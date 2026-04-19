'use client'

import Link from 'next/link'
import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { buildLoginPath, supabase } from '@/lib/supabase'

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

type WalletResponse = {
  success: boolean
  creditos: number
  balance_reais: number
  downloads: DownloadHistoryRow[]
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

function formatDateTime(value: string) {
  return new Date(value).toLocaleString('pt-BR')
}

function formatCurrency(value: number) {
  return currencyFormatter.format(value)
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
      const {
        data: { session },
      } = await supabase.auth.getSession()

      if (!active) {
        return
      }

      if (!session) {
        router.replace(
          buildLoginPath('/carteira', 'Entre com sua conta Google para acessar sua carteira.')
        )
        return
      }

      const firstName =
        session.user.user_metadata?.full_name?.split(' ')[0]
        || session.user.user_metadata?.name?.split(' ')[0]
        || session.user.email?.split('@')[0]
        || 'Usuário'

      setNomeUsuario(firstName)

      try {
        const response = await fetch('/api/carteira', {
          headers: {
            Authorization: `Bearer ${session.access_token}`,
          },
          cache: 'no-store',
        })

        const payload = await response.json().catch(() => null)

        if (!active) {
          return
        }

        if (response.status === 401) {
          router.replace(
            buildLoginPath('/carteira', 'Entre com sua conta Google para acessar sua carteira.')
          )
          return
        }

        if (!response.ok || !payload?.success) {
          setErro(payload?.error || 'Não foi possível carregar a carteira.')
          setCarregando(false)
          return
        }

        setWallet(payload as WalletResponse)
        setCarregando(false)
      } catch (error) {
        if (!active) {
          return
        }

        setErro(error instanceof Error ? error.message : 'Erro ao carregar a carteira.')
        setCarregando(false)
      }
    }

    carregarCarteira()

    return () => {
      active = false
    }
  }, [router])

  if (carregando) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center">
          <div className="w-10 h-10 border-4 border-[#2D6A4F] border-t-transparent rounded-full animate-spin mx-auto mb-4" />
          <p className="text-sm text-gray-500">Carregando carteira...</p>
        </div>
      </div>
    )
  }

  if (!wallet) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50 px-4">
        <div className="max-w-md rounded-2xl border border-red-100 bg-white p-8 text-center shadow-sm">
          <p className="text-xs font-bold uppercase tracking-[0.22em] text-red-500">Erro</p>
          <h1 className="mt-3 text-2xl font-extrabold text-[#162113]">Não foi possível abrir a carteira</h1>
          <p className="mt-4 text-sm text-gray-600">{erro || 'Tente novamente em instantes.'}</p>
          <div className="mt-6 flex flex-col gap-3">
            <Link
              href="/assinar"
              className="rounded-xl bg-[#2D6A4F] px-4 py-3 text-sm font-bold text-white transition-colors hover:bg-[#1F5230]"
            >
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
    <div className="min-h-screen bg-gray-50">
      <div className="bg-white border-b border-gray-100 pt-8 pb-8 px-4 sm:px-10">
        <div className="max-w-6xl mx-auto flex flex-col gap-5 lg:flex-row lg:items-center lg:justify-between">
          <div>
            <p className="text-sm text-gray-500">Carteira de {nomeUsuario}</p>
            <h1 className="mt-1 text-2xl sm:text-3xl font-extrabold text-[#162113]">Seu saldo atual</h1>
            <p className="mt-3 text-4xl sm:text-5xl font-extrabold text-[#2D6A4F]">
              {formatCurrency(wallet.balance_reais)}
            </p>
            <p className="mt-2 text-sm text-gray-500">{wallet.creditos} créditos disponíveis</p>
          </div>

          <div className="flex flex-col sm:flex-row gap-3">
            <Link
              href="/assinar"
              className="rounded-xl bg-[#2D6A4F] px-5 py-3 text-center text-sm font-bold text-white transition-colors hover:bg-[#1F5230]"
            >
              Comprar créditos
            </Link>
            <a
              href="https://www.talhao.ai/mapa"
              target="_blank"
              rel="noopener noreferrer"
              className="rounded-xl border border-[#2D6A4F] px-5 py-3 text-center text-sm font-bold text-[#2D6A4F] transition-colors hover:bg-[#F0FDF4]"
            >
              Abrir mapa
            </a>
          </div>
        </div>
      </div>

      <div className="max-w-6xl mx-auto py-6 sm:py-10 px-4 sm:px-10 space-y-6 sm:space-y-8">
        <section className="rounded-2xl border border-gray-200 bg-white p-5 sm:p-6 shadow-sm">
          <div className="flex items-center justify-between gap-3 flex-wrap mb-5">
            <div>
              <p className="text-xs font-bold uppercase tracking-[0.22em] text-[#5C7C6C]">Downloads</p>
              <h2 className="mt-1 text-lg sm:text-xl font-extrabold text-[#162113]">
                Últimos 50 downloads
              </h2>
            </div>
            <span className="rounded-full bg-[#F3FBF6] px-3 py-1 text-xs font-semibold text-[#2D6A4F]">
              Histórico completo do consumo de créditos
            </span>
          </div>

          {wallet.downloads.length === 0 ? (
            <div className="rounded-2xl border border-dashed border-gray-200 bg-gray-50 px-4 py-10 text-center">
              <p className="text-sm font-semibold text-[#162113]">Nenhum download registrado ainda.</p>
              <p className="mt-2 text-sm text-gray-500">
                Quando você baixar arquivos no mapa, eles aparecerão aqui.
              </p>
            </div>
          ) : (
            <>
              <div className="hidden md:block overflow-x-auto">
                <table className="w-full text-sm">
                  <thead>
                    <tr className="border-b border-gray-100 text-left">
                      <th className="pb-3 text-xs font-semibold uppercase tracking-wide text-gray-400">Data</th>
                      <th className="pb-3 text-xs font-semibold uppercase tracking-wide text-gray-400">Propriedade</th>
                      <th className="pb-3 text-xs font-semibold uppercase tracking-wide text-gray-400">Tipo de arquivo</th>
                      <th className="pb-3 text-xs font-semibold uppercase tracking-wide text-gray-400 text-right">Créditos usados</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-50">
                    {wallet.downloads.map((download) => (
                      <tr key={download.id} className="hover:bg-gray-50 transition-colors">
                        <td className="py-3.5 pr-4 text-gray-500">{formatDateTime(download.criado_em)}</td>
                        <td className="py-3.5 pr-4 font-semibold text-[#162113]">
                          {download.codigo_imovel || 'Código não informado'}
                        </td>
                        <td className="py-3.5 pr-4">
                          <span className="rounded-full bg-[#D8F3DC] px-2.5 py-1 text-xs font-bold text-[#1F5230]">
                            {download.tipo_arquivo}
                          </span>
                        </td>
                        <td className="py-3.5 text-right font-semibold text-[#162113]">
                          {download.creditos_usados}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

              <div className="space-y-3 md:hidden">
                {wallet.downloads.map((download) => (
                  <div key={download.id} className="rounded-xl border border-gray-200 bg-gray-50 p-4">
                    <div className="flex items-start justify-between gap-3">
                      <div>
                        <p className="font-semibold text-[#162113]">
                          {download.codigo_imovel || 'Código não informado'}
                        </p>
                        <p className="mt-1 text-xs text-gray-500">{formatDateTime(download.criado_em)}</p>
                      </div>
                      <span className="rounded-full bg-white px-2.5 py-1 text-xs font-bold text-[#2D6A4F] border border-[#D8F3DC]">
                        {download.creditos_usados} crédito{download.creditos_usados === 1 ? '' : 's'}
                      </span>
                    </div>
                    <div className="mt-3">
                      <span className="rounded-full bg-[#D8F3DC] px-2.5 py-1 text-xs font-bold text-[#1F5230]">
                        {download.tipo_arquivo}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            </>
          )}
        </section>

        <section className="rounded-2xl border border-gray-200 bg-white p-5 sm:p-6 shadow-sm">
          <div className="flex items-center justify-between gap-3 flex-wrap mb-5">
            <div>
              <p className="text-xs font-bold uppercase tracking-[0.22em] text-[#5C7C6C]">Pagamentos</p>
              <h2 className="mt-1 text-lg sm:text-xl font-extrabold text-[#162113]">
                Últimos 20 pagamentos
              </h2>
            </div>
            <span className="rounded-full bg-[#F3FBF6] px-3 py-1 text-xs font-semibold text-[#2D6A4F]">
              Compras de créditos e confirmações
            </span>
          </div>

          {wallet.payments.length === 0 ? (
            <div className="rounded-2xl border border-dashed border-gray-200 bg-gray-50 px-4 py-10 text-center">
              <p className="text-sm font-semibold text-[#162113]">Nenhum pagamento registrado ainda.</p>
              <p className="mt-2 text-sm text-gray-500">
                Quando você comprar créditos, o histórico aparecerá aqui.
              </p>
            </div>
          ) : (
            <>
              <div className="hidden md:block overflow-x-auto">
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
                        <td className="py-3.5 pr-4 font-semibold text-[#162113]">
                          {formatCurrency(payment.amount)}
                        </td>
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

              <div className="space-y-3 md:hidden">
                {wallet.payments.map((payment) => (
                  <div key={payment.id} className="rounded-xl border border-gray-200 bg-gray-50 p-4">
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
      </div>
    </div>
  )
}
