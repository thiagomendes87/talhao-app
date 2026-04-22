'use client'

import Link from 'next/link'
import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import AppTopbar from '@/components/AppTopbar'
import { buildLoginPath, supabase } from '@/lib/supabase'

type Download = {
  id: string
  codigo_imovel: string | null
  tipo_arquivo: string | null
  creditos_usados: number
  status: string | null
  criado_em: string
}

const currencyFormatter = new Intl.NumberFormat('pt-BR', {
  style: 'currency',
  currency: 'BRL',
})

function formatCurrency(value: number) {
  return currencyFormatter.format(value)
}

export default function DashboardPage() {
  const [usuario, setUsuario] = useState<any>(null)
  const [creditos, setCreditos] = useState(0)
  const [downloads, setDownloads] = useState<Download[]>([])
  const [carregando, setCarregando] = useState(true)
  const router = useRouter()

  useEffect(() => {
    let active = true

    const verificarAuth = async () => {
      const {
        data: { session },
      } = await supabase.auth.getSession()

      if (!active) {
        return
      }

      if (!session) {
        router.replace(
          buildLoginPath('/dashboard', 'Entre com sua conta Google para acessar seu dashboard.')
        )
        return
      }

      setUsuario(session.user)

      await supabase
        .from('carteira')
        .upsert({ user_id: session.user.id, creditos: 0 }, { onConflict: 'user_id', ignoreDuplicates: true })

      const [{ data: carteira }, { data: historico }] = await Promise.all([
        supabase
          .from('carteira')
          .select('creditos')
          .eq('user_id', session.user.id)
          .single(),
        supabase
          .from('downloads')
          .select('id, codigo_imovel, tipo_arquivo, creditos_usados, criado_em')
          .eq('user_id', session.user.id)
          .order('criado_em', { ascending: false })
          .limit(10),
      ])

      if (!active) {
        return
      }

      setCreditos(carteira?.creditos ?? 0)
      setDownloads(historico ?? [])
      setCarregando(false)
    }

    verificarAuth()

    return () => {
      active = false
    }
  }, [router])

  if (carregando) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#f4f7f5]">
        <div className="text-center">
          <div className="w-8 h-8 border-4 border-[#2D6A4F] border-t-transparent rounded-full animate-spin mx-auto mb-3" />
          <p className="text-gray-500 text-sm">Carregando...</p>
        </div>
      </div>
    )
  }

  if (!usuario) return null

  const nomeUsuario =
    usuario?.user_metadata?.full_name?.split(' ')[0]
    || usuario?.email?.split('@')[0]
    || 'Usuário'

  const saldoReais = Number((creditos * 3.5).toFixed(2))

  return (
    <div className="min-h-screen bg-[#f4f7f5]">
      <AppTopbar />

      <main className="mx-auto max-w-5xl px-4 py-8 sm:px-10 sm:py-10">
        <section className="rounded-2xl border border-[rgba(28,43,24,0.08)] bg-white px-6 py-7 shadow-sm sm:px-8">
          <p className="text-sm text-gray-500">Olá, {nomeUsuario}.</p>
          <h1 className="mt-2 text-2xl font-bold text-[#162113]">Seu dashboard</h1>
          <p className="mt-3 max-w-2xl text-sm leading-relaxed text-gray-600">
            Acompanhe seu saldo disponível, veja os downloads mais recentes e acesse rapidamente
            sua carteira ou os dados da sua conta.
          </p>

          <div className="mt-8 grid gap-4 lg:grid-cols-[1.3fr_0.7fr_0.7fr]">
            <div className="rounded-2xl border border-[#D8E9DE] bg-[#F3FBF6] p-5">
              <p className="text-xs font-bold uppercase tracking-[0.22em] text-[#5C7C6C]">Saldo atual</p>
              <p className="mt-3 text-3xl font-bold text-[#1f5230]">{creditos} <span className="text-xl font-bold">créditos</span></p>
              <p className="mt-1 text-sm text-[#40614E]">{formatCurrency(saldoReais)} disponível</p>
            </div>

            <Link
              href="/carteira"
              className="rounded-2xl border border-gray-200 bg-white p-5 transition-colors hover:border-[#2D6A4F] hover:bg-[#FBFEFC]"
            >
              <p className="text-xs font-bold uppercase tracking-[0.22em] text-[#5C7C6C]">Atalho</p>
              <h2 className="mt-3 text-lg font-semibold text-[#162113]">Carteira</h2>
              <p className="mt-2 text-sm text-gray-600">Recarregue créditos e acompanhe pagamentos.</p>
            </Link>

            <Link
              href="/conta"
              className="rounded-2xl border border-gray-200 bg-white p-5 transition-colors hover:border-[#2D6A4F] hover:bg-[#FBFEFC]"
            >
              <p className="text-xs font-bold uppercase tracking-[0.22em] text-[#5C7C6C]">Atalho</p>
              <h2 className="mt-3 text-lg font-semibold text-[#162113]">Conta</h2>
              <p className="mt-2 text-sm text-gray-600">Edite seu perfil e gerencie a sessão atual.</p>
            </Link>
          </div>
        </section>

        <section className="mt-8 rounded-2xl border border-[rgba(28,43,24,0.08)] bg-white p-5 shadow-sm sm:p-6">
          <div className="flex items-center justify-between gap-3 flex-wrap">
            <div>
              <p className="text-xs font-bold uppercase tracking-[0.22em] text-[#5C7C6C]">Downloads</p>
              <h2 className="mt-1 text-lg font-semibold text-[#162113]">Downloads recentes</h2>
            </div>
            <span className="rounded-full bg-[#F3FBF6] px-3 py-1 text-xs font-semibold text-[#2D6A4F]">
              Últimos 10 arquivos
            </span>
          </div>

          {downloads.length === 0 ? (
            <div className="mt-5 rounded-2xl border border-dashed border-gray-200 bg-gray-50 px-4 py-10 text-center">
              <p className="text-sm font-semibold text-[#162113]">Você ainda não fez downloads.</p>
              <p className="mt-2 text-sm text-gray-500">
                Abra o mapa pela topbar para buscar propriedades e baixar arquivos.
              </p>
            </div>
          ) : (
            <>
              <div className="mt-5 hidden overflow-x-auto md:block">
                <table className="w-full text-sm">
                  <thead>
                    <tr className="border-b border-gray-100 text-left">
                      <th className="pb-3 text-xs font-semibold uppercase tracking-wide text-gray-400">Data</th>
                      <th className="pb-3 text-xs font-semibold uppercase tracking-wide text-gray-400">Imóvel / CAR</th>
                      <th className="pb-3 text-xs font-semibold uppercase tracking-wide text-gray-400">Tipo</th>
                      <th className="pb-3 text-xs font-semibold uppercase tracking-wide text-gray-400 text-right">Créditos</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-50">
                    {downloads.map((download) => (
                      <tr key={download.id} className="hover:bg-gray-50 transition-colors">
                        <td className="py-3.5 pr-4 text-gray-500">
                          {new Date(download.criado_em).toLocaleString('pt-BR')}
                        </td>
                        <td className="py-3.5 pr-4 font-semibold text-[#162113]">
                          {download.codigo_imovel || '—'}
                        </td>
                        <td className="py-3.5 pr-4">
                          <span className="rounded-full bg-[#D8F3DC] px-2.5 py-1 text-xs font-bold text-[#1f5230]">
                            {download.tipo_arquivo || '—'}
                          </span>
                        </td>
                        <td className="py-3.5 text-right font-semibold text-red-500">
                          {download.creditos_usados > 0 ? `-${download.creditos_usados}` : '0'}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

              <div className="mt-5 space-y-3 md:hidden">
                {downloads.map((download) => (
                  <div key={download.id} className="rounded-2xl border border-gray-200 bg-gray-50 p-4">
                    <div className="flex items-start justify-between gap-3">
                      <div>
                        <p className="font-semibold text-[#162113]">
                          {download.codigo_imovel || '—'}
                        </p>
                        <p className="mt-1 text-xs text-gray-500">
                          {new Date(download.criado_em).toLocaleString('pt-BR')}
                        </p>
                      </div>
                      <span className="rounded-full bg-red-50 px-2.5 py-1 text-xs font-bold text-red-500 border border-red-100">
                        {download.creditos_usados > 0 ? `-${download.creditos_usados}` : '0'} crédito{download.creditos_usados === 1 ? '' : 's'}
                      </span>
                    </div>
                    <div className="mt-3">
                      <span className="rounded-full bg-[#D8F3DC] px-2.5 py-1 text-xs font-bold text-[#1f5230]">
                        {download.tipo_arquivo}
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
