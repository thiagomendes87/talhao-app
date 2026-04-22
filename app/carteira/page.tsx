'use client'

import Link from 'next/link'
import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import AppTopbar from '@/components/AppTopbar'
import { buildLoginPath, supabase } from '@/lib/supabase'

type PaymentHistoryRow = {
  id: string
  amount: number
  status: 'approved' | 'pending' | 'failed' | 'refunded'
  created_at: string
}

type WalletResponse = {
  success: boolean
  creditos: number
  balance_reais: number
  payments: PaymentHistoryRow[]
}

const currencyFormatter = new Intl.NumberFormat('pt-BR', {
  style: 'currency',
  currency: 'BRL',
})

const statusLabelMap: Record<PaymentHistoryRow['status'], string> = {
  approved: 'Aprovado',
  pending: 'Pendente',
  failed: 'Falhou',
  refunded: 'Reembolsado',
}

const statusClassMap: Record<PaymentHistoryRow['status'], string> = {
  approved: 'bg-green-100 text-green-700',
  pending: 'bg-amber-100 text-amber-700',
  failed: 'bg-red-100 text-red-700',
  refunded: 'bg-blue-100 text-blue-700',
}

function formatCurrency(value: number) {
  return currencyFormatter.format(value)
}

function formatDateTime(value: string) {
  return new Date(value).toLocaleString('pt-BR')
}

export default function CarteiraPage() {
  const router = useRouter()
  const [carregando, setCarregando] = useState(true)
  const [erro, setErro] = useState('')
  const [nomeUsuario, setNomeUsuario] = useState('Usuário')
  const [wallet, setWallet] = useState<WalletResponse | null>(null)

  useEffect(() => {
    let active = true

    const carregarCarteira = async () => {
      const { data: { session } } = await supabase.auth.getSession()

      if (!active) return

      if (!session) {
        router.replace(buildLoginPath('/carteira', 'Entre com sua conta Google para acessar sua carteira.'))
        return
      }

      const firstName =
        session.user.user_metadata?.full_name?.split(' ')[0] ||
        session.user.email?.split('@')[0] ||
        'Usuário'
      setNomeUsuario(firstName)

      try {
        const response = await fetch('/api/carteira', {
          headers: { Authorization: `Bearer ${session.access_token}` },
          cache: 'no-store',
        })
        const payload = await response.json().catch(() => null)

        if (!active) return

        if (response.status === 401) {
          router.replace(buildLoginPath('/carteira', 'Entre com sua conta Google para acessar sua carteira.'))
          return
        }

        if (!response.ok || !payload?.success) {
          setErro(payload?.error || 'Não foi possível carregar a carteira.')
          setCarregando(false)
          return
        }

        setWallet({
          success: true,
          creditos: payload.creditos ?? 0,
          balance_reais: payload.balance_reais ?? 0,
          payments: payload.payments ?? [],
        })
        setCarregando(false)
      } catch (error) {
        if (!active) return
        setErro(error instanceof Error ? error.message : 'Erro ao carregar a carteira.')
        setCarregando(false)
      }
    }

    carregarCarteira()
    return () => { active = false }
  }, [router])

  if (carregando) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#f4f7f5]">
        <div className="text-center">
          <div className="w-10 h-10 border-4 border-[#2D6A4F] border-t-transparent rounded-full animate-spin mx-auto mb-4" />
          <p className="text-sm text-gray-500">Carregando carteira...</p>
        </div>
      </div>
    )
  }

  if (!wallet) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#f4f7f5] px-4">
        <div className="max-w-md rounded-2xl border border-red-100 bg-white p-8 text-center shadow-sm">
          <p className="text-xs font-bold uppercase tracking-[0.22em] text-red-500">Erro</p>
          <h1 className="mt-3 text-2xl font-extrabold text-[#162113]">Não foi possível abrir a carteira</h1>
          <p className="mt-4 text-sm text-gray-600">{erro || 'Tente novamente em instantes.'}</p>
          <div className="mt-6 flex flex-col gap-3">
            <Link href="/assinar" className="rounded-xl bg-[#2D6A4F] px-4 py-3 text-sm font-bold text-white transition-colors hover:bg-[#1F5230]">
              Ir para comprar créditos
            </Link>
            <Link href="/" className="text-sm font-semibold text-[#2D6A4F] hover:text-[#1F5230]">
              Voltar para o início
            </Link>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-[#f4f7f5]">
      <AppTopbar />

      <main className="mx-auto max-w-5xl px-4 py-8 sm:px-10 sm:py-10">
        <section className="rounded-2xl border border-[rgba(28,43,24,0.08)] bg-white px-6 py-7 shadow-sm sm:px-8">
          <p className="text-sm text-gray-500">Carteira de {nomeUsuario}</p>
          <h1 className="mt-2 text-2xl font-bold text-[#162113]">Compre créditos quando precisar</h1>
          <p className="mt-3 max-w-2xl text-sm leading-relaxed text-gray-600">
            Seu saldo fica disponível para novos downloads no mapa. Recarregue a qualquer momento
            e acompanhe abaixo o histórico dos pagamentos já feitos.
          </p>

          <div className="mt-8 grid gap-4 lg:grid-cols-[1.2fr_0.8fr]">
            <div className="rounded-2xl border border-[#D8E9DE] bg-[#F3FBF6] p-5">
              <p className="text-[11px] font-semibold uppercase tracking-[0.08em] text-[#4f6347]">Saldo disponível</p>
              <p className="mt-3 text-3xl font-bold text-[#1f5230]">{formatCurrency(wallet.balance_reais)}</p>
              <p className="mt-1 text-xs text-[#4f6347]">{wallet.creditos} créditos na sua carteira</p>
              <div className="mt-4">
                <div className="flex items-center justify-between mb-1.5">
                  <span className="text-[11px] text-[#4f6347]">uso estimado</span>
                  <span className="text-[11px] font-semibold text-[#1f5230]">{wallet.creditos} restantes</span>
                </div>
                <div className="h-1.5 w-full rounded-full bg-[#D8E9DE] overflow-hidden">
                  <div
                    className="h-full rounded-full bg-[#1f5230] transition-all"
                    style={{ width: `${Math.min(100, Math.max(4, (wallet.creditos / 300) * 100))}%` }}
                  />
                </div>
                <p className="mt-1.5 text-[11px] text-[#4f6347]">referência: pacote de 300 créditos</p>
              </div>
            </div>

            <div className="rounded-2xl border border-gray-200 bg-white p-5">
              <p className="text-xs font-bold uppercase tracking-[0.22em] text-[#5C7C6C]">Recarga</p>
              <h2 className="mt-3 text-lg font-semibold text-[#162113]">Adicionar créditos</h2>
              <p className="mt-2 text-sm text-gray-600">
                Compre novos créditos via PIX, boleto ou cartão e continue baixando arquivos no mapa.
              </p>
              <Link
                href="/assinar?tab=downloads"
                className="mt-5 inline-flex rounded-xl bg-[#1f5230] px-4 py-3 text-sm font-bold text-white transition-colors hover:bg-[#163b23]"
              >
                Comprar créditos
              </Link>
            </div>
          </div>
        </section>

        <section className="mt-8 rounded-2xl border border-[rgba(28,43,24,0.08)] bg-white p-5 shadow-sm sm:p-6">
          <div className="flex items-center justify-between gap-3 flex-wrap">
            <div>
              <p className="text-xs font-bold uppercase tracking-[0.22em] text-[#5C7C6C]">Pagamentos</p>
              <h2 className="mt-1 text-lg font-semibold text-[#162113]">Histórico de pagamentos</h2>
            </div>
            <span className="rounded-full bg-[#F3FBF6] px-3 py-1 text-xs font-semibold text-[#2D6A4F]">
              Últimos 20 registros
            </span>
          </div>

          {wallet.payments.length === 0 ? (
            <div className="mt-5 rounded-2xl border border-dashed border-gray-200 bg-gray-50 px-4 py-10 text-center">
              <p className="text-sm font-semibold text-[#162113]">Nenhum pagamento registrado ainda.</p>
              <p className="mt-2 text-sm text-gray-500">
                Seu histórico aparecerá aqui assim que você fizer a primeira compra.
              </p>
            </div>
          ) : (
            <>
              <div className="mt-5 hidden overflow-x-auto md:block">
                <table className="w-full text-sm">
                  <thead>
                    <tr className="border-b border-gray-100 text-left">
                      <th className="pb-3 text-xs font-semibold uppercase tracking-wide text-gray-400">Data</th>
                      <th className="pb-3 text-xs font-semibold uppercase tracking-wide text-gray-400">Valor</th>
                      <th className="pb-3 text-xs font-semibold uppercase tracking-wide text-gray-400">Status</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-50">
                    {wallet.payments.map((payment) => (
                      <tr key={payment.id} className="hover:bg-gray-50 transition-colors">
                        <td className="py-3.5 pr-4 text-gray-500">{formatDateTime(payment.created_at)}</td>
                        <td className="py-3.5 pr-4 font-semibold text-[#162113]">{formatCurrency(payment.amount)}</td>
                        <td className="py-3.5">
                          <span className={`rounded-full px-2.5 py-1 text-xs font-bold ${statusClassMap[payment.status]}`}>
                            {statusLabelMap[payment.status]}
                          </span>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

              <div className="mt-5 space-y-3 md:hidden">
                {wallet.payments.map((payment) => (
                  <div key={payment.id} className="rounded-2xl border border-gray-200 bg-gray-50 p-4">
                    <div className="flex items-start justify-between gap-3">
                      <div>
                        <p className="font-semibold text-[#162113]">{formatCurrency(payment.amount)}</p>
                        <p className="mt-1 text-xs text-gray-500">{formatDateTime(payment.created_at)}</p>
                      </div>
                      <span className={`rounded-full px-2.5 py-1 text-xs font-bold ${statusClassMap[payment.status]}`}>
                        {statusLabelMap[payment.status]}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            </>
          )}
        </section>
      </main>
    </div>
  )
}
