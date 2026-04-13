import { createClient } from '@supabase/supabase-js'
import { NextRequest, NextResponse } from 'next/server'

// Service role ignora RLS — necessário para operações server-side
const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
)

const ASAAS_API_URL = 'https://api.asaas.com/v3'
const ASAAS_API_KEY = process.env.ASAAS_API_KEY!

async function asaasRequest(path: string, method = 'GET', body?: object) {
  const res = await fetch(`${ASAAS_API_URL}${path}`, {
    method,
    headers: {
      'Content-Type': 'application/json',
      'access_token': ASAAS_API_KEY,
    },
    body: body ? JSON.stringify(body) : undefined,
  })
  return res.json()
}

async function getOrCreateCustomer(userId: string, nome: string, email: string, cpf: string) {
  // Busca customer_id salvo
  const { data: perfil } = await supabase
    .from('perfis')
    .select('asaas_customer_id')
    .eq('id', userId)
    .single()

  if (perfil?.asaas_customer_id) {
    return perfil.asaas_customer_id
  }

  // Cria cliente no Asaas
  const customer = await asaasRequest('/customers', 'POST', {
    name: nome || email,
    email,
    cpfCnpj: cpf.replace(/\D/g, ''),
  })

  if (!customer.id) {
    throw new Error(customer.errors?.[0]?.description || 'Erro ao criar cliente no Asaas')
  }

  // Salva customer_id no perfil
  await supabase
    .from('perfis')
    .upsert({ id: userId, asaas_customer_id: customer.id }, { onConflict: 'id' })

  return customer.id
}

export async function POST(request: NextRequest) {
  try {
    // Autenticação
    const authHeader = request.headers.get('authorization')
    if (!authHeader?.startsWith('Bearer ')) {
      return NextResponse.json({ error: 'Não autenticado' }, { status: 401 })
    }
    const token = authHeader.substring(7)
    const { data: { user }, error: userError } = await supabase.auth.getUser(token)
    if (userError || !user) {
      return NextResponse.json({ error: 'Usuário não encontrado' }, { status: 401 })
    }

    const body = await request.json()
    const { quantidade_creditos, payment_method, cpf } = body

    if (!quantidade_creditos || !payment_method || !cpf) {
      return NextResponse.json({ error: 'Dados incompletos: quantidade_creditos, payment_method e cpf são obrigatórios' }, { status: 400 })
    }

    const amount = quantidade_creditos * 3.5
    const nome = user.user_metadata?.full_name || user.email || 'Cliente'

    // Cria/busca cliente no Asaas
    const customerId = await getOrCreateCustomer(user.id, nome, user.email!, cpf)

    // Data de vencimento: 1 dia para PIX/cartão, 3 dias para boleto
    const daysToExpire = payment_method === 'boleto' ? 3 : 1
    const dueDate = new Date(Date.now() + daysToExpire * 24 * 60 * 60 * 1000)
      .toISOString().split('T')[0]

    // Mapa de método para billingType do Asaas
    const billingTypeMap: Record<string, string> = {
      pix: 'PIX',
      boleto: 'BOLETO',
      cartao: 'CREDIT_CARD',
    }

    const billingType = billingTypeMap[payment_method]
    if (!billingType) {
      return NextResponse.json({ error: 'Método de pagamento inválido' }, { status: 400 })
    }

    // Cria registro local primeiro
    const { data: payment, error: paymentError } = await supabase
      .from('payments')
      .insert({
        user_id: user.id,
        type: 'credits_purchase',
        amount,
        quantidade_creditos,
        payment_method,
        status: 'pending',
      })
      .select()
      .single()

    if (paymentError || !payment) {
      return NextResponse.json({ error: 'Erro ao registrar pagamento' }, { status: 500 })
    }

    // Cria cobrança no Asaas
    const asaasPayload: any = {
      customer: customerId,
      billingType,
      value: amount,
      dueDate,
      description: `Talhão — ${quantidade_creditos} créditos`,
      externalReference: payment.id,
      notificationUrl: `${process.env.NEXT_PUBLIC_APP_URL}/api/webhooks/asaas`,
    }

    const asaasPayment = await asaasRequest('/payments', 'POST', asaasPayload)

    if (!asaasPayment.id) {
      await supabase.from('payments').update({ status: 'failed' }).eq('id', payment.id)
      return NextResponse.json({
        error: asaasPayment.errors?.[0]?.description || 'Erro ao criar cobrança no Asaas'
      }, { status: 500 })
    }

    // Para PIX, busca QR code
    let pixData = null
    if (payment_method === 'pix') {
      pixData = await asaasRequest(`/payments/${asaasPayment.id}/pixQrCode`)
    }

    // Atualiza registro com dados do Asaas
    await supabase
      .from('payments')
      .update({
        asaas_payment_id: asaasPayment.id,
        pix_qr_code: pixData?.encodedImage || null,
        pix_copy_paste: pixData?.payload || null,
      })
      .eq('id', payment.id)

    return NextResponse.json({
      success: true,
      payment_id: payment.id,
      asaas_id: asaasPayment.id,
      // PIX
      pix_qr_code: pixData?.encodedImage || null,
      pix_copy_paste: pixData?.payload || null,
      // Boleto
      boleto_url: asaasPayment.bankSlipUrl || null,
      // Cartão / página de pagamento
      invoice_url: asaasPayment.invoiceUrl || null,
      // Valor
      amount,
      quantidade_creditos,
    })

  } catch (err: any) {
    console.error('Erro no pagamento:', err)
    return NextResponse.json({ error: err.message || 'Erro interno' }, { status: 500 })
  }
}
