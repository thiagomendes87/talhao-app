import { NextRequest, NextResponse } from 'next/server'
import { getAuthenticatedUserFromRequest, getSupabaseAdminClient } from '@/lib/server-auth'

type DownloadHistoryRow = {
  id: string
  codigo_imovel: string | null
  tipo_arquivo: string
  creditos_usados: number
  criado_em: string
}

type PaymentHistoryRow = {
  id: string
  amount: number
  status: 'approved' | 'pending' | 'failed' | 'refunded'
  created_at: string
}

export async function GET(request: NextRequest) {
  const user = await getAuthenticatedUserFromRequest(request)

  if (!user) {
    return NextResponse.json(
      { success: false, error: 'Usuário não autenticado.' },
      { status: 401 }
    )
  }

  const supabase = getSupabaseAdminClient() as any

  const { error: walletUpsertError } = await supabase
    .from('carteira')
    .upsert({ user_id: user.id, creditos: 0 }, { onConflict: 'user_id', ignoreDuplicates: true })

  if (walletUpsertError) {
    return NextResponse.json(
      { success: false, error: 'Não foi possível preparar a carteira do usuário.' },
      { status: 500 }
    )
  }

  const [walletResult, downloadsResult, paymentsResult] = await Promise.all([
    supabase
      .from('carteira')
      .select('creditos')
      .eq('user_id', user.id)
      .single(),
    supabase
      .from('downloads')
      .select('id, codigo_imovel, tipo_arquivo, creditos_usados, criado_em')
      .eq('user_id', user.id)
      .order('criado_em', { ascending: false })
      .limit(50),
    supabase
      .from('payments')
      .select('id, amount, status, created_at')
      .eq('user_id', user.id)
      .order('created_at', { ascending: false })
      .limit(20),
  ])

  if (walletResult.error || downloadsResult.error || paymentsResult.error) {
    return NextResponse.json(
      { success: false, error: 'Não foi possível carregar os dados da carteira.' },
      { status: 500 }
    )
  }

  const creditos = Number((walletResult.data as { creditos?: number } | null)?.creditos ?? 0)

  return NextResponse.json({
    success: true,
    creditos,
    balance_reais: Number((creditos * 3.5).toFixed(2)),
    downloads: (downloadsResult.data ?? []) as DownloadHistoryRow[],
    payments: (paymentsResult.data ?? []) as PaymentHistoryRow[],
  })
}
