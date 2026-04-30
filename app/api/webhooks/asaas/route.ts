import { createClient } from '@supabase/supabase-js'
import { NextRequest, NextResponse } from 'next/server'

interface AsaasWebhook {
  event: string
  payment: {
    id: string
    externalReference: string // ID do pagamento nosso
    status: string // 'PENDING', 'CONFIRMED', 'RECEIVED', 'OVERDUE', 'REFUNDED', 'DELETED', 'FAILED'
    value: number
    billingType: string
  }
}

async function addCreditsToWallet(supabase: any, userId: string, quantidadeCreditos: number) {
  const { data: carteira, error: carteiraError } = await supabase
    .from('carteira')
    .select('creditos')
    .eq('user_id', userId)
    .single()

  if (carteiraError || !carteira) {
    throw carteiraError ?? new Error('Carteira não encontrada')
  }

  const { error: updateCarteiraError } = await supabase
    .from('carteira')
    .update({
      creditos: Number(carteira.creditos ?? 0) + Number(quantidadeCreditos ?? 0),
      atualizado_em: new Date().toISOString(),
    })
    .eq('user_id', userId)

  if (updateCarteiraError) {
    throw updateCarteiraError
  }
}

async function activateSubscription(
  supabase: any,
  userId: string,
  paymentId: string,
  planType: string
) {
  const { data: existingSubscription } = await supabase
    .from('subscriptions')
    .select('id')
    .eq('payment_id', paymentId)
    .eq('status', 'active')
    .maybeSingle()

  if (existingSubscription) {
    return
  }

  const now = new Date()
  const expiresAt = new Date(now)

  if (planType === 'pro_anual') {
    expiresAt.setFullYear(expiresAt.getFullYear() + 1)
  } else {
    expiresAt.setDate(expiresAt.getDate() + 30)
  }

  await supabase
    .from('subscriptions')
    .update({ status: 'cancelled' })
    .eq('user_id', userId)
    .eq('status', 'active')

  await supabase.from('subscriptions').insert({
    user_id: userId,
    plan_type: planType,
    status: 'active',
    payment_id: paymentId,
    started_at: now.toISOString(),
    expires_at: expiresAt.toISOString(),
  })
}

export async function POST(request: NextRequest) {
  // Valida o token do webhook configurado no painel Asaas
  const webhookToken = process.env.ASAAS_WEBHOOK_TOKEN
  if (webhookToken) {
    const incomingToken = request.headers.get('asaas-access-token')
    if (incomingToken !== webhookToken) {
      return NextResponse.json({ error: 'Não autorizado' }, { status: 401 })
    }
  }

  const supabase = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!
  )
  try {
    const body: AsaasWebhook = await request.json()

    console.log('🔔 Webhook do Asaas recebido:', JSON.stringify(body, null, 2))

    // 1. Validar se é um evento de pagamento
    if (!body.event || !body.payment) {
      return NextResponse.json(
        { error: 'Formato inválido' },
        { status: 400 }
      )
    }

    const paymentId = body.payment.externalReference
    const asaasPaymentId = body.payment.id
    const asaasStatus = body.payment.status

    // 2. Mapear status do Asaas para nosso sistema
    let novoStatus = 'pending'
    let creditosAdicionados = false

    switch (asaasStatus) {
      case 'CONFIRMED':
      case 'RECEIVED':
        novoStatus = 'approved'
        creditosAdicionados = true
        break
      case 'REFUNDED':
        novoStatus = 'refunded'
        break
      case 'FAILED':
      case 'DELETED':
      case 'OVERDUE':
        novoStatus = 'failed'
        break
      default:
        novoStatus = 'pending'
    }

    let payment: any = null

    let approvedPaymentChangedState = false

    if (creditosAdicionados) {
      const { data: approvedPayment, error: approveError } = await supabase
        .from('payments')
        .update({
          status: novoStatus,
          updated_at: new Date().toISOString(),
        })
        .eq('id', paymentId)
        .eq('status', 'pending')
        .select()
        .maybeSingle()

      if (approveError) {
        console.error('Erro ao atualizar pagamento:', approveError)
        return NextResponse.json(
          { error: 'Erro ao processar pagamento' },
          { status: 500 }
        )
      }

      payment = approvedPayment
      approvedPaymentChangedState = Boolean(approvedPayment)

      console.log(`💰 Status: ${novoStatus}, Créditos a adicionar: ${creditosAdicionados}`)
      if (payment) {
        try {
          await addCreditsToWallet(supabase, payment.user_id, payment.quantidade_creditos || 0)
          console.log(
            `✅ Créditos adicionados: ${payment.quantidade_creditos} para usuário ${payment.user_id}`
          )
        } catch (walletError) {
          console.error('Erro ao atualizar carteira:', walletError)
        }
      }

      if (!payment) {
        const { data: currentPayment, error: currentPaymentError } = await supabase
          .from('payments')
          .select()
          .eq('id', paymentId)
          .single()

        if (currentPaymentError) {
          console.error('Erro ao carregar pagamento aprovado:', currentPaymentError)
          return NextResponse.json(
            { error: 'Erro ao processar pagamento' },
            { status: 500 }
          )
        }

        payment = currentPayment
      }

      if (payment && (payment.plan_type === 'pro_mensal' || payment.plan_type === 'pro_anual')) {
        try {
          await activateSubscription(supabase, payment.user_id, payment.id, payment.plan_type)
          if (approvedPaymentChangedState) {
            console.log(`✅ Assinatura ${payment.plan_type} ativada para ${payment.user_id}`)
          }
        } catch (subError) {
          console.error('Erro ao ativar assinatura:', subError)
        }
      }
    } else {
      const { data: updatedPayment, error: updateError } = await supabase
        .from('payments')
        .update({
          status: novoStatus,
          updated_at: new Date().toISOString(),
        })
        .eq('id', paymentId)
        .select()
        .single()

      if (updateError) {
        console.error('Erro ao atualizar pagamento:', updateError)
        return NextResponse.json(
          { error: 'Erro ao processar pagamento' },
          { status: 500 }
        )
      }

      payment = updatedPayment
    }

    // 5. Retornar sucesso (importante para Asaas saber que processamos)
    return NextResponse.json({
      success: true,
      paymentStatus: novoStatus,
      message: `Pagamento ${novoStatus}`,
    })
  } catch (error) {
    console.error('Erro no webhook do Asaas:', error)
    return NextResponse.json(
      { error: 'Erro ao processar webhook' },
      { status: 500 }
    )
  }
}
