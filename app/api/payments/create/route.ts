import { NextRequest, NextResponse } from 'next/server'
import { getAuthenticatedUserFromRequest, getSupabaseAdminClient } from '@/lib/server-auth'

type PaymentMethod = 'pix' | 'cartao'

type CreatePaymentBody = {
  user_id?: string
  quantidade_creditos?: number
  cpf?: string
  phone?: string
  payment_method?: string
  card_holder?: string
  card_number?: string
  card_expiry_month?: string
  card_expiry_year?: string
  card_cvv?: string
  card_cep?: string
  card_address_number?: string
}

type AsaasListResponse<T> = {
  data?: T[]
}

type AsaasCustomer = {
  id: string
}

type AsaasPayment = {
  id: string
  status?: string
  invoiceUrl?: string
}

type AsaasPixQrCode = {
  encodedImage?: string
  payload?: string
}

type AdminClient = any

const CREDIT_PRICE = 3.5

function getRequiredEnv(name: string) {
  const value = process.env[name]

  if (!value) {
    throw new Error(`Missing required environment variable: ${name}`)
  }

  return value
}

function getAsaasBaseUrl() {
  return process.env.ASAAS_BASE_URL || 'https://api.asaas.com/v3'
}

function sanitizeCpf(value: string) {
  return value.replace(/\D/g, '')
}

function normalizePaymentMethod(value?: string): PaymentMethod | null {
  if (value === 'pix' || value === 'cartao') return value
  return null
}

function toAsaasBillingType(paymentMethod: PaymentMethod) {
  if (paymentMethod === 'pix') return 'PIX'
  return 'CREDIT_CARD'
}

function buildDueDate() {
  const date = new Date()
  date.setHours(0, 0, 0, 0)
  date.setDate(date.getDate() + 1)
  return date.toISOString().slice(0, 10)
}

function buildAsaasHeaders() {
  return {
    'Content-Type': 'application/json',
    'User-Agent': 'TalhaoApp/1.0',
    access_token: getRequiredEnv('ASAAS_API_KEY'),
  }
}

function extractAsaasErrorMessage(payload: any) {
  if (payload?.errors?.[0]?.description) {
    return payload.errors[0].description
  }

  if (typeof payload?.message === 'string' && payload.message) {
    return payload.message
  }

  return 'Não foi possível processar o pagamento no Asaas.'
}

async function asaasRequest<T>(path: string, init?: RequestInit): Promise<T> {
  const response = await fetch(`${getAsaasBaseUrl()}${path}`, {
    ...init,
    cache: 'no-store',
    headers: {
      ...buildAsaasHeaders(),
      ...(init?.headers ?? {}),
    },
  })

  const raw = await response.text()
  const payload = raw ? JSON.parse(raw) : null

  if (!response.ok) {
    throw new Error(extractAsaasErrorMessage(payload))
  }

  return payload as T
}

async function getOrCreateAsaasCustomer(user: any, cpf: string, phone?: string) {
  const params = new URLSearchParams({
    limit: '1',
    externalReference: user.id,
    cpfCnpj: cpf,
  })

  const existing = await asaasRequest<AsaasListResponse<AsaasCustomer>>(`/customers?${params.toString()}`)
  const existingCustomerId = existing.data?.[0]?.id

  if (existingCustomerId) {
    return existingCustomerId
  }

  const name =
    user.user_metadata?.full_name
    || user.user_metadata?.name
    || user.email?.split('@')[0]
    || 'Cliente Talhão'

  const customerBody: Record<string, string> = {
    name,
    email: user.email,
    cpfCnpj: cpf,
    externalReference: user.id,
  }

  if (phone) {
    customerBody.mobilePhone = phone
  }

  const customer = await asaasRequest<AsaasCustomer>('/customers', {
    method: 'POST',
    body: JSON.stringify(customerBody),
  })

  return customer.id
}

function shouldRetryWithoutOptionalColumns(errorMessage: string) {
  return /column|schema cache|Could not find the .* column/i.test(errorMessage)
}

async function insertPaymentRecord(supabase: AdminClient, basePayload: Record<string, unknown>) {
  const attempts = [
    basePayload,
    Object.fromEntries(Object.entries(basePayload).filter(([key]) => key !== 'updated_at')),
  ]

  let lastError: Error | null = null

  for (const payload of attempts) {
    const { error } = await supabase.from('payments').insert(payload)

    if (!error) {
      return
    }

    lastError = new Error(error.message)

    if (!shouldRetryWithoutOptionalColumns(error.message)) {
      break
    }
  }

  throw lastError ?? new Error('Não foi possível registrar o pagamento.')
}

async function updatePaymentRecord(supabase: AdminClient, paymentId: string, payload: Record<string, unknown>) {
  const attempts = [
    payload,
    Object.fromEntries(
      Object.entries(payload).filter(
        ([key]) => !['asaas_payment_id', 'invoice_url'].includes(key)
      )
    ),
    Object.fromEntries(
      Object.entries(payload).filter(
        ([key]) => !['asaas_payment_id', 'invoice_url', 'updated_at'].includes(key)
      )
    ),
  ]

  let lastError: Error | null = null

  for (const attempt of attempts) {
    const { error } = await supabase.from('payments').update(attempt).eq('id', paymentId)

    if (!error) {
      return
    }

    lastError = new Error(error.message)

    if (!shouldRetryWithoutOptionalColumns(error.message)) {
      break
    }
  }

  throw lastError ?? new Error('Não foi possível atualizar o pagamento.')
}

async function addCreditsToWallet(supabase: AdminClient, userId: string, quantidadeCreditos: number) {
  const { data: carteira, error: carteiraError } = await supabase
    .from('carteira')
    .select('creditos')
    .eq('user_id', userId)
    .single()

  if (carteiraError || !carteira) {
    throw new Error('Não foi possível localizar a carteira do usuário.')
  }

  const novosCreditosTotais = Number(carteira.creditos ?? 0) + quantidadeCreditos

  const { error: updateCarteiraError } = await supabase
    .from('carteira')
    .update({
      creditos: novosCreditosTotais,
      atualizado_em: new Date().toISOString(),
    })
    .eq('user_id', userId)

  if (updateCarteiraError) {
    throw new Error(updateCarteiraError.message)
  }
}

async function approvePaymentAndCredit(
  supabase: AdminClient,
  paymentId: string,
  userId: string,
  quantidadeCreditos: number
) {
  const { data: approvedPayment, error: approveError } = await supabase
    .from('payments')
    .update({
      status: 'approved',
      updated_at: new Date().toISOString(),
    })
    .eq('id', paymentId)
    .eq('status', 'pending')
    .select('id')
    .maybeSingle()

  if (approveError) {
    throw new Error(approveError.message)
  }

  if (!approvedPayment) {
    return false
  }

  await addCreditsToWallet(supabase, userId, quantidadeCreditos)
  return true
}

export async function POST(request: NextRequest) {
  const user = await getAuthenticatedUserFromRequest(request)

  if (!user) {
    return NextResponse.json(
      { success: false, error: 'Usuário não autenticado.' },
      { status: 401 }
    )
  }

  let body: CreatePaymentBody

  try {
    body = await request.json()
  } catch {
    return NextResponse.json(
      { success: false, error: 'Body JSON inválido.' },
      { status: 400 }
    )
  }

  const paymentMethod = normalizePaymentMethod(body.payment_method)
  const quantidadeCreditos = Number(body.quantidade_creditos)
  const cpf = sanitizeCpf(body.cpf || '')
  const phone = (body.phone || '').replace(/\D/g, '').slice(0, 15)
  const cardHolder = body.card_holder?.trim() ?? ''
  const cardNumber = (body.card_number ?? '').replace(/\s/g, '')
  const cardExpiryMonth = body.card_expiry_month ?? ''
  const cardExpiryYear = body.card_expiry_year ?? ''
  const cardCvv = body.card_cvv ?? ''
  const cardCep = (body.card_cep ?? '').replace(/\D/g, '')
  const cardAddressNumber = body.card_address_number?.trim() ?? ''

  if (body.user_id && body.user_id !== user.id) {
    return NextResponse.json(
      { success: false, error: 'O usuário informado não corresponde à sessão autenticada.' },
      { status: 403 }
    )
  }

  if (!paymentMethod) {
    return NextResponse.json(
      { success: false, error: 'Método de pagamento inválido.' },
      { status: 400 }
    )
  }

  if (!Number.isInteger(quantidadeCreditos) || quantidadeCreditos <= 0) {
    return NextResponse.json(
      { success: false, error: 'A quantidade de créditos deve ser um número inteiro positivo.' },
      { status: 400 }
    )
  }

  if (cpf.length !== 11) {
    return NextResponse.json(
      { success: false, error: 'CPF inválido.' },
      { status: 400 }
    )
  }

  if (paymentMethod === 'cartao') {
    if (!cardHolder || cardNumber.length < 15 || !cardExpiryMonth || !cardExpiryYear || cardCvv.length < 3 || cardCep.length !== 8 || !cardAddressNumber) {
      return NextResponse.json(
        { success: false, error: 'Dados do cartão inválidos.' },
        { status: 400 }
      )
    }
  }

  const valor = Number((quantidadeCreditos * CREDIT_PRICE).toFixed(2))
  const paymentId = crypto.randomUUID()
  const now = new Date().toISOString()
  const supabase = getSupabaseAdminClient() as any

  const { error: walletUpsertError } = await supabase
    .from('carteira')
    .upsert({ user_id: user.id, creditos: 0 }, { onConflict: 'user_id', ignoreDuplicates: true })

  if (walletUpsertError) {
    return NextResponse.json(
      { success: false, error: 'Não foi possível preparar a carteira para a compra.' },
      { status: 500 }
    )
  }

  try {
    await insertPaymentRecord(supabase, {
      id: paymentId,
      user_id: user.id,
      type: paymentMethod,
      amount: valor,
      quantidade_creditos: quantidadeCreditos,
      payment_method: paymentMethod,
      status: 'pending',
      updated_at: now,
    })
  } catch (error) {
    return NextResponse.json(
      {
        success: false,
        error: error instanceof Error ? error.message : 'Não foi possível registrar o pagamento.',
      },
      { status: 500 }
    )
  }

  try {
    const customerId = await getOrCreateAsaasCustomer(user, cpf, phone)

    const payment = await asaasRequest<AsaasPayment>('/payments', {
      method: 'POST',
      body: JSON.stringify({
        customer: customerId,
        billingType: toAsaasBillingType(paymentMethod),
        value: valor,
        dueDate: buildDueDate(),
        description: `${quantidadeCreditos} crédito${quantidadeCreditos === 1 ? '' : 's'} Talhão`,
        externalReference: paymentId,
        ...(paymentMethod === 'cartao' ? {
          creditCard: {
            holderName: cardHolder,
            number: cardNumber,
            expiryMonth: cardExpiryMonth,
            expiryYear: cardExpiryYear,
            ccv: cardCvv,
          },
          creditCardHolderInfo: {
            name: user.user_metadata?.full_name || user.user_metadata?.name || cardHolder,
            email: user.email,
            cpfCnpj: cpf,
            postalCode: cardCep,
            addressNumber: cardAddressNumber,
            phone: phone || '',
          },
        } : {}),
      }),
    })

    let pixQrCode: string | null = null
    let pixCopyPaste: string | null = null

    if (paymentMethod === 'pix') {
      const pixData = await asaasRequest<AsaasPixQrCode>(`/payments/${payment.id}/pixQrCode`)
      pixQrCode = pixData.encodedImage ?? null
      pixCopyPaste = pixData.payload ?? null
    }

    try {
      await updatePaymentRecord(supabase, paymentId, {
        asaas_payment_id: payment.id,
        pix_qr_code: pixQrCode,
        pix_copy_paste: pixCopyPaste,
        invoice_url: payment.invoiceUrl ?? null,
        updated_at: new Date().toISOString(),
      })
    } catch {
      // Não interrompe a jornada do usuário se apenas o enriquecimento do histórico falhar.
    }

    const approved = payment.status === 'CONFIRMED' || payment.status === 'RECEIVED'

    if (paymentMethod === 'cartao' && approved) {
      try {
        await approvePaymentAndCredit(supabase, paymentId, user.id, quantidadeCreditos)
      } catch {
        // O webhook do Asaas ainda pode concluir a sincronização se esse passo falhar.
      }
    }

    return NextResponse.json({
      success: true,
      payment_id: paymentId,
      pix_qr_code: pixQrCode,
      pix_copy_paste: pixCopyPaste,
      valor,
      approved: payment.status === 'CONFIRMED' || payment.status === 'RECEIVED',
    })
  } catch (error) {
    try {
      await updatePaymentRecord(supabase, paymentId, {
        status: 'failed',
        updated_at: new Date().toISOString(),
      })
    } catch {
      // Mantém o erro original da criação do pagamento.
    }

    return NextResponse.json(
      {
        success: false,
        error: error instanceof Error ? error.message : 'Erro ao criar pagamento.',
      },
      { status: 502 }
    )
  }
}
