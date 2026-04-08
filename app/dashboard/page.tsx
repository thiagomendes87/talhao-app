'use client'

import Link from 'next/link'
import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { supabase } from '@/lib/supabase'
import Navbar from '@/components/Navbar'

// Downloads de exemplo (futuramente virão do banco de dados)
const downloadsExemplo = [
  { id: 1, propriedade: 'Fazenda Santa Cruz', car: 'MT-5107909-7A2B...', municipio: 'Sorriso, MT', tipo: 'KML', data: '07/04/2025', creditos: 1 },
  { id: 2, propriedade: 'Sítio Boa Esperança', car: 'GO-5218805-3C4D...', municipio: 'Rio Verde, GO', tipo: 'SIGEF', data: '06/04/2025', creditos: 1 },
  { id: 3, propriedade: 'Chácara Recanto Verde', car: 'SP-3516200-1A2C...', municipio: 'Ribeirão Preto, SP', tipo: 'KML', data: '05/04/2025', creditos: 1 },
]

export default function DashboardPage() {
  const [busca, setBusca] = useState('')
  const [usuario, setUsuario] = useState<any>(null)
  const [creditos, setCreditos] = useState(0)
  const [carregando, setCarregando] = useState(true)
  const router = useRouter()

  useEffect(() => {
    const verificarAuth = async () => {
      const { data: { session } } = await supabase.auth.getSession()
      if (!session) {
        router.push('/entrar')
      } else {
        if (!session.user.user_metadata?.perfil) {
          router.push('/onboarding')
        } else {
          setUsuario(session.user)
          // Busca créditos reais do Supabase (cria carteira se não existir)
          const { data } = await supabase
            .from('carteira')
            .upsert({ user_id: session.user.id, creditos: 0 }, { onConflict: 'user_id', ignoreDuplicates: true })
            .select('creditos')
            .eq('user_id', session.user.id)
            .single()
          setCreditos(data?.creditos ?? 0)
        }
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

      {/* Hero / Busca */}
      <div className="bg-gradient-to-br from-[#1A1A2E] to-[#2D6A4F] py-14 px-10">
        <div className="max-w-4xl mx-auto">
          <p className="text-white/60 text-sm mb-1">Olá, {nomeUsuario}!</p>
          <h1 className="text-3xl font-extrabold text-white mb-6">Busque qualquer propriedade rural do Brasil</h1>
          <div className="flex gap-3">
            <input
              type="text"
              value={busca}
              onChange={(e) => setBusca(e.target.value)}
              placeholder="Digite município, CAR ou coordenadas..."
              className="flex-1 px-5 py-4 rounded-xl bg-white/10 text-white placeholder-white/50 border border-white/20 focus:outline-none focus:ring-2 focus:ring-[#52B788]"
            />
            <button className="bg-[#52B788] hover:bg-[#2D6A4F] text-white font-bold px-8 py-4 rounded-xl transition-colors flex items-center gap-2">
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
              </svg>
              Buscar
            </button>
          </div>
        </div>
      </div>

      <div className="max-w-6xl mx-auto py-10 px-10 space-y-8">

        {/* Saldo + Ações */}
        <div className="grid grid-cols-3 gap-5">

          {/* Saldo de créditos */}
          <div className="col-span-2 bg-white rounded-2xl border border-gray-200 p-6 flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-500 mb-1">Seu saldo</p>
              <p className="text-4xl font-extrabold text-[#1A1A2E]">{creditos} créditos</p>
              <p className="text-sm text-gray-500 mt-1">= R$ {(creditos * 3.5).toFixed(2)} em downloads disponíveis</p>
            </div>
            <Link href="/carteira" className="bg-[#2D6A4F] hover:bg-[#1A5C3A] text-white font-bold px-6 py-3 rounded-xl transition-colors text-sm">
              Recarregar
            </Link>
          </div>

          {/* Plano */}
          <div className="bg-white rounded-2xl border border-gray-200 p-6 flex flex-col justify-between">
            <div>
              <p className="text-sm text-gray-500 mb-1">Seu plano</p>
              <p className="text-xl font-extrabold text-[#1A1A2E]">Gratuito</p>
              <p className="text-xs text-gray-400 mt-1">R$ 3,50 por download</p>
            </div>
            <Link href="/assinar" className="text-[#2D6A4F] font-semibold text-sm hover:underline">
              Assinar Pro →
            </Link>
          </div>
        </div>

        {/* Mapa */}
        <div className="bg-white rounded-2xl border border-gray-200 p-6">
          <h2 className="text-lg font-extrabold text-[#1A1A2E] mb-4">Mapa interativo</h2>
          <div className="bg-gray-100 rounded-xl h-80 flex flex-col items-center justify-center text-gray-400 gap-2">
            <svg className="w-10 h-10 text-gray-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 20l-5.447-2.724A1 1 0 013 16.382V5.618a1 1 0 011.447-.894L9 7m0 13l6-3m-6 3V7m6 10l4.553 2.276A1 1 0 0021 18.382V7.618a1 1 0 00-.553-.894L15 4m0 13V4m0 0L9 7" />
            </svg>
            <p className="text-sm font-medium">Mapa do Brasil com polígonos do CAR</p>
            <p className="text-xs">Integração com Mapbox em breve</p>
          </div>
        </div>

        {/* Histórico de Downloads */}
        <div className="bg-white rounded-2xl border border-gray-200 p-6">
          <div className="flex items-center justify-between mb-5">
            <h2 className="text-lg font-extrabold text-[#1A1A2E]">Histórico de downloads</h2>
            <span className="text-xs text-gray-400">Últimos 30 dias</span>
          </div>

          {downloadsExemplo.length === 0 ? (
            <div className="text-center py-12 text-gray-400">
              <svg className="w-10 h-10 mx-auto mb-3 text-gray-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
              </svg>
              <p className="text-sm">Você ainda não fez nenhum download.</p>
              <p className="text-xs mt-1">Busque uma propriedade acima para começar!</p>
            </div>
          ) : (
            <div className="overflow-x-auto">
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
                  {downloadsExemplo.map((d) => (
                    <tr key={d.id} className="hover:bg-gray-50 transition-colors">
                      <td className="py-3.5 pr-4">
                        <p className="font-semibold text-[#1A1A2E]">{d.propriedade}</p>
                        <p className="text-xs text-gray-400 font-mono">{d.car}</p>
                      </td>
                      <td className="py-3.5 pr-4 text-gray-600">{d.municipio}</td>
                      <td className="py-3.5 pr-4">
                        <span className="bg-[#F0FDF4] text-[#2D6A4F] text-xs font-bold px-2.5 py-1 rounded-full">{d.tipo}</span>
                      </td>
                      <td className="py-3.5 pr-4 text-gray-500">{d.data}</td>
                      <td className="py-3.5 text-right">
                        <button className="text-[#2D6A4F] hover:text-[#1A1A2E] font-semibold text-xs transition-colors flex items-center gap-1 ml-auto">
                          <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
                          </svg>
                          Baixar novamente
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>

      </div>
    </div>
  )
}
