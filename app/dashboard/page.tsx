'use client'

import Link from 'next/link'
import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { supabase } from '@/lib/supabase'
import Navbar from '@/components/Navbar'

type Download = {
  id: string
  car_code: string | null
  propriedade: string | null
  municipio: string | null
  estado: string | null
  tipo: string
  creditos_usados: number
  criado_em: string
}

export default function DashboardPage() {
  const [usuario, setUsuario] = useState<any>(null)
  const [creditos, setCreditos] = useState(0)
  const [downloads, setDownloads] = useState<Download[]>([])
  const [carregando, setCarregando] = useState(true)
  const router = useRouter()

  useEffect(() => {
    const verificarAuth = async () => {
      const { data: { session } } = await supabase.auth.getSession()
      if (!session) {
        router.push('/entrar')
      } else {
        // Usuário Google sem perfil → vai para onboarding
        if (!session.user.user_metadata?.perfil) {
          router.push('/onboarding')
          return
        }

        setUsuario(session.user)

        // Garante que a linha existe (sem sobrescrever créditos existentes)
        await supabase
          .from('carteira')
          .upsert({ user_id: session.user.id, creditos: 0 }, { onConflict: 'user_id', ignoreDuplicates: true })

        // Busca o saldo atual separadamente
        const { data: carteira } = await supabase
          .from('carteira')
          .select('creditos')
          .eq('user_id', session.user.id)
          .single()
        setCreditos(carteira?.creditos ?? 0)

        const { data: historico } = await supabase
          .from('downloads')
          .select('*')
          .eq('user_id', session.user.id)
          .order('criado_em', { ascending: false })
          .limit(50)
        setDownloads(historico ?? [])
      }
      setCarregando(false)
    }
    verificarAuth()
  }, [router])

  if (carregando) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center">
          <div className="w-8 h-8 border-4 border-[#2D6A4F] border-t-transparent rounded-full animate-spin mx-auto mb-3" />
          <p className="text-gray-500 text-sm">Carregando...</p>
        </div>
      </div>
    )
  }

  if (!usuario) return null

  const nomeUsuario = usuario?.user_metadata?.full_name?.split(' ')[0] || 'Usuário'

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />

      <div className="bg-white border-b border-gray-100 pt-24 pb-8 px-4 sm:px-10">
        <div className="max-w-6xl mx-auto flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div>
            <p className="text-sm text-gray-500">Olá, {nomeUsuario}! 👋</p>
            <h1 className="text-xl font-bold text-[#162113] mt-1">O que você quer fazer hoje?</h1>
          </div>
          <Link href="/mapa" className="bg-[#1f5230] text-white font-bold px-5 py-2.5 rounded-xl hover:bg-[#2a6b3f] transition-all whitespace-nowrap">
            Abrir mapa →
          </Link>
        </div>
      </div>

      <div className="max-w-6xl mx-auto py-6 sm:py-10 px-4 sm:px-10 space-y-6 sm:space-y-8">

        {/* Saldo + Ações */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 sm:gap-5">

          {/* Saldo de créditos */}
          <div className="sm:col-span-2 bg-white rounded-2xl border border-gray-200 p-4 sm:p-6 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
            <div>
              <p className="text-xs sm:text-sm text-gray-500 mb-1">Seu saldo</p>
              <p className="text-2xl sm:text-4xl font-extrabold text-[#1A1A2E]">{creditos} créditos</p>
              <p className="text-xs sm:text-sm text-gray-500 mt-1">= R$ {(creditos * 3.5).toFixed(2)} disponível</p>
            </div>
            <Link href="/carteira" className="bg-[#1f5230] hover:bg-[#2a6b3f] text-white font-bold px-4 sm:px-6 py-2 sm:py-3 rounded-xl transition-colors text-xs sm:text-sm whitespace-nowrap">
              Recarregar
            </Link>
          </div>

          {/* Plano */}
          <div className="bg-white rounded-2xl border border-gray-200 p-4 sm:p-6 flex flex-col justify-between">
            <div>
              <p className="text-xs sm:text-sm text-gray-500 mb-1">Seu plano</p>
              <p className="text-lg sm:text-xl font-extrabold text-[#1A1A2E]">Gratuito</p>
              <p className="text-xs text-gray-400 mt-1">R$ 3,50 por download</p>
            </div>
            <Link href="/assinar" className="text-[#1f5230] font-semibold text-xs sm:text-sm hover:underline mt-3">
              Assinar Pro →
            </Link>
          </div>
        </div>

        {/* Histórico de Downloads */}
        <div className="bg-white rounded-2xl border border-gray-200 p-4 sm:p-6">
          <div className="flex items-center justify-between mb-4 sm:mb-5 flex-wrap gap-2">
            <h2 className="text-base sm:text-lg font-extrabold text-[#1A1A2E]">Histórico de downloads</h2>
            <span className="text-xs text-gray-400">Últimos 30 dias</span>
          </div>

          {downloads.length === 0 ? (
            <div className="text-center py-8 sm:py-12 text-gray-400">
              <svg className="w-8 sm:w-10 h-8 sm:h-10 mx-auto mb-3 text-gray-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
              </svg>
              <p className="text-xs sm:text-sm">Você ainda não fez nenhum download.</p>
              <p className="text-xs mt-1">Busque uma propriedade acima para começar!</p>
            </div>
          ) : (
            <>
              {/* Desktop: Tabela */}
              <div className="hidden sm:block overflow-x-auto">
                <table className="w-full text-sm">
                  <thead>
                    <tr className="border-b border-gray-100 text-left">
                      <th className="pb-3 text-xs font-semibold text-gray-400 uppercase tracking-wide">Propriedade</th>
                      <th className="pb-3 text-xs font-semibold text-gray-400 uppercase tracking-wide">Município</th>
                      <th className="pb-3 text-xs font-semibold text-gray-400 uppercase tracking-wide">Tipo</th>
                      <th className="pb-3 text-xs font-semibold text-gray-400 uppercase tracking-wide">Data</th>
                      <th className="pb-3 text-xs font-semibold text-gray-400 uppercase tracking-wide text-right">Ação</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-50">
                    {downloads.map((d) => (
                      <tr key={d.id} className="hover:bg-gray-50 transition-colors">
                        <td className="py-3.5 pr-4">
                          <p className="font-semibold text-[#1A1A2E]">{d.propriedade || 'Propriedade sem nome'}</p>
                          {d.car_code && <p className="text-xs text-gray-400 font-mono">{d.car_code}</p>}
                        </td>
                        <td className="py-3.5 pr-4 text-gray-600 text-sm">
                          {[d.municipio, d.estado].filter(Boolean).join(', ') || '—'}
                        </td>
                        <td className="py-3.5 pr-4">
                          <span className="bg-[#D8F3DC] text-[#1f5230] text-xs font-bold px-2.5 py-1 rounded-full">{d.tipo}</span>
                        </td>
                        <td className="py-3.5 pr-4 text-gray-500 text-sm">
                          {new Date(d.criado_em).toLocaleDateString('pt-BR')}
                        </td>
                        <td className="py-3.5 text-right">
                          <button className="text-[#1f5230] hover:text-[#174023] font-semibold text-xs transition-colors flex items-center gap-1 ml-auto">
                            <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
                            </svg>
                            Baixar
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

              {/* Mobile: Cards */}
              <div className="sm:hidden space-y-3">
                {downloads.map((d) => (
                  <div key={d.id} className="bg-gray-50 rounded-lg p-4 border border-gray-200">
                    <div className="mb-3">
                      <p className="font-semibold text-[#1A1A2E] text-sm">{d.propriedade || 'Propriedade sem nome'}</p>
                      {d.car_code && <p className="text-xs text-gray-400 font-mono mt-1">{d.car_code}</p>}
                    </div>
                    <div className="flex items-center justify-between gap-2">
                      <div className="flex items-center gap-3 text-xs">
                        <span className="text-gray-600">{[d.municipio, d.estado].filter(Boolean).join(', ') || '—'}</span>
                        <span className="bg-[#D8F3DC] text-[#1f5230] font-bold px-2 py-0.5 rounded-full">{d.tipo}</span>
                        <span className="text-gray-500">{new Date(d.criado_em).toLocaleDateString('pt-BR')}</span>
                      </div>
                      <button className="text-[#1f5230] hover:text-[#174023] font-semibold text-xs whitespace-nowrap ml-2">
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
                        </svg>
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </>
          )}
        </div>

      </div>
    </div>
  )
}
