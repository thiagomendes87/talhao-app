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
          <p className="text-[11px] font-semibold uppercase tracking-[0.08em] text-[#4f6347]">Como usar</p>
          <h2 className="mt-1 text-lg font-semibold text-[#162113]">Em 3 passos</h2>
          <div className="mt-5 grid gap-4 sm:grid-cols-3">
            <div className="rounded-xl border border-[rgba(28,43,24,0.08)] bg-[#f4f7f5] p-4">
              <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-[#D8F3DC]">
                <svg className="h-5 w-5 text-[#1f5230]" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.8}>
                  <circle cx="11" cy="11" r="8" />
                  <path strokeLinecap="round" d="M21 21l-4.35-4.35" />
                </svg>
              </div>
              <p className="mt-3 text-sm font-semibold text-[#162113]">Buscar</p>
              <p className="mt-1 text-xs leading-relaxed text-[#4f6347]">Encontre imóveis por município, nome ou código CAR no mapa interativo.</p>
            </div>
            <div className="rounded-xl border border-[rgba(28,43,24,0.08)] bg-[#f4f7f5] p-4">
              <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-[#D8F3DC]">
                <svg className="h-5 w-5 text-[#1f5230]" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.8}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M9 20l-5.447-2.724A1 1 0 013 16.382V5.618a1 1 0 011.447-.894L9 7m0 13l6-3m-6 3V7m6 10l4.553 2.276A1 1 0 0021 18.382V7.618a1 1 0 00-.553-.894L15 4m0 13V4m0 0L9 7" />
                </svg>
              </div>
              <p className="mt-3 text-sm font-semibold text-[#162113]">Analisar</p>
              <p className="mt-1 text-xs leading-relaxed text-[#4f6347]">Veja área, perímetro, situação e dados geoespaciais de cada propriedade.</p>
            </div>
            <div className="rounded-xl border border-[rgba(28,43,24,0.08)] bg-[#f4f7f5] p-4">
              <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-[#D8F3DC]">
                <svg className="h-5 w-5 text-[#1f5230]" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.8}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
                </svg>
              </div>
              <p className="mt-3 text-sm font-semibold text-[#162113]">Baixar</p>
              <p className="mt-1 text-xs leading-relaxed text-[#4f6347]">Exporte KML, SHP e outros formatos usando créditos da sua carteira.</p>
            </div>
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
            <div className="mt-5 rounded-2xl border border-dashed border-[rgba(28,43,24,0.12)] bg-[#f4f7f5] px-4 py-12 text-center">
              <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-[#D8F3DC]">
                <svg className="h-6 w-6 text-[#1f5230]" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M9 13h6m-3-3v6m5 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                </svg>
              </div>
              <p className="mt-4 text-sm font-semibold text-[#162113]">Nenhum download ainda.</p>
              <p className="mt-1.5 text-xs text-[#4f6347]">Busque uma propriedade no mapa e baixe os dados para aparecer aqui.</p>
              <Link href="/mapa" className="mt-5 inline-flex rounded-xl bg-[#1f5230] px-4 py-2.5 text-xs font-bold text-white transition-colors hover:bg-[#163b23]">
                Abrir mapa →
              </Link>
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
