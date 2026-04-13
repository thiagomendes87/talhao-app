import { createClient } from '@supabase/supabase-js'
import { NextRequest, NextResponse } from 'next/server'

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
)

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

export async function POST(request: NextRequest) {
  try {
    const body: AsaasWebhook = await request.json()

    console.log('Webhook do Asaas recebido:', body)

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

    // 3. Atualizar status do pagamento no banco
    const { data: payment, error: updateError } = await supabase
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

    // 4. Se pagamento foi aprovado, adicionar créditos
    if (creditosAdicionados && payment) {
      const { data: carteira, error: carteiraError } = await supabase
        .from('carteira')
        .select('creditos')
        .eq('user_id', payment.user_id)
        .single()

      if (!carteiraError && carteira) {
        const novosCreditosTotais = carteira.creditos + (payment.quantidade_creditos || 0)

        const { error: updateCarteiraError } = await supabase
          .from('carteira')
          .update({
            creditos: novosCreditosTotais,
            atualizado_em: new Date().toISOString(),
          })
          .eq('user_id', payment.user_id)

        if (updateCarteiraError) {
          console.error('Erro ao atualizar carteira:', updateCarteiraError)
        } else {
          console.log(
            `✅ Créditos adicionados: ${payment.quantidade_creditos} para usuário ${payment.user_id}`
          )
        }
      }
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
