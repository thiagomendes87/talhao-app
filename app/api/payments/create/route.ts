import { createClient } from '@supabase/supabase-js'
import { NextRequest, NextResponse } from 'next/server'

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
)

interface CreatePaymentRequest {
  type: 'pro_subscription' | 'credits_purchase'
  amount: number
  payment_method: 'pix' | 'card'
  quantidade_creditos?: number
  descricao?: string
}

export async function POST(request: NextRequest) {
  try {
    // 1. Obter sessão do usuário
    const authHeader = request.headers.get('authorization')
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return NextResponse.json(
        { error: 'Não autenticado' },
        { status: 401 }
      )
    }

    // Validar token (de forma simples)
    const token = authHeader.substring(7)

    // 2. Parsear corpo da requisição
    const body: CreatePaymentRequest = await request.json()

    // Validar dados
    if (!body.type || !body.amount || !body.payment_method) {
      return NextResponse.json(
        { error: 'Dados incompletos' },
        { status: 400 }
      )
    }

    // 3. Obter usuário do token
    const { data: { user }, error: userError } = await supabase.auth.getUser(token)
    if (userError || !user) {
      return NextResponse.json(
        { error: 'Usuário não encontrado' },
        { status: 401 }
      )
    }

    // 4. Criar registro de pagamento no banco (status: pending)
    const { data: payment, error: paymentError } = await supabase
      .from('payments')
      .insert({
        user_id: user.id,
        type: body.type,
        amount: body.amount,
        quantidade_creditos: body.quantidade_creditos,
        payment_method: body.payment_method,
        status: 'pending',
        descricao: body.descricao || `${body.type === 'credits_purchase' ? body.quantidade_creditos + ' créditos' : 'Assinatura Pro'}`,
      })
      .select()
      .single()

    if (paymentError) {
      return NextResponse.json(
        { error: 'Erro ao criar pagamento', details: paymentError },
        { status: 500 }
      )
    }

    // 5. Chamar API do Asaas para criar transação
    // ⚠️ Isso será feito quando a conta Asaas for aprovada
    const asaasApiKey = process.env.NEXT_PUBLIC_ASAAS_API_KEY

    if (!asaasApiKey) {
      // Por enquanto, retorna o pagamento como 'pending' esperando a integração
      return NextResponse.json({
        success: true,
        payment: payment,
        message: 'Integração com Asaas em desenvolvimento. Pagamento registrado como pendente.',
      })
    }

    // 6. Integração com Asaas (quando aprovado)
    try {
      const asaasResponse = await fetch('https://api.asaas.com/v3/payments', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'access_token': asaasApiKey,
        },
        body: JSON.stringify({
          customer: user.email, // ou customer_id se tiver
          billingType: body.payment_method === 'pix' ? 'PIX' : 'CREDIT_CARD',
          value: body.amount,
          dueDate: new Date(Date.now() + 24 * 60 * 60 * 1000).toISOString().split('T')[0], // 24h de prazo
          description: `Talhão - ${body.descricao}`,
          externalReference: payment.id, // Link com nosso pagamento
          notificationUrl: `${process.env.NEXT_PUBLIC_APP_URL}/api/webhooks/asaas`,
        }),
      })

      const asaasData = await asaasResponse.json()

      if (!asaasResponse.ok) {
        return NextResponse.json(
          { error: 'Erro na integração com Asaas', details: asaasData },
          { status: 500 }
        )
      }

      // 7. Atualizar pagamento com ID do Asaas
      const { error: updateError } = await supabase
        .from('payments')
        .update({
          asaas_payment_id: asaasData.id,
          pix_qr_code: asaasData.pixQrCode,
          pix_copy_paste: asaasData.pixCopiaECola,
        })
        .eq('id', payment.id)

      if (updateError) {
        console.error('Erro ao atualizar pagamento:', updateError)
      }

      return NextResponse.json({
        success: true,
        payment: {
          ...payment,
          asaas_payment_id: asaasData.id,
          pix_qr_code: asaasData.pixQrCode,
          pix_copy_paste: asaasData.pixCopiaECola,
        },
      })
    } catch (asaasError) {
      console.error('Erro ao chamar Asaas:', asaasError)
      return NextResponse.json({
        success: true,
        payment: payment,
        warning: 'Pagamento registrado mas não foi sincronizado com Asaas',
      })
    }
  } catch (error) {
    console.error('Erro no endpoint de pagamento:', error)
    return NextResponse.json(
      { error: 'Erro interno do servidor' },
      { status: 500 }
    )
  }
}
