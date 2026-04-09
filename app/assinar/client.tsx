'use client'

import { useState, useEffect } from 'react'
import { useSearchParams, useRouter } from 'next/navigation'
import Link from 'next/link'
import { supabase } from '@/lib/supabase'

export default function AssinarClient() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const tabParam = searchParams.get('tab')
  const [tipoCompra, setTipoCompra] = useState<'pro' | 'downloads'>(tabParam === 'downloads' ? 'downloads' : 'pro')
  const [quantidadeDownloads, setQuantidadeDownloads] = useState(4)
  const [creditos, setCreditos] = useState(0)
  const [carregando, setCarregando] = useState(true)

  useEffect(() => {
    const verificarAuth = async () => {
      const { data: { session } } = await supabase.auth.getSession()
      if (!session) {
        router.push('/entrar?redirect=/assinar')
        return
      }

      const { data } = await supabase
        .from('carteira')
        .upsert({ user_id: session.user.id, creditos: 0 }, { onConflict: 'user_id', ignoreDuplicates: true })
        .select('creditos')
        .eq('user_id', session.user.id)
        .single()

      setCreditos(data?.creditos ?? 0)
      setCarregando(false)
    }
    verificarAuth()
  }, [router])

  if (carregando) {
    return <div className="min-h-screen flex items-center justify-center">Carregando...</div>
  }

  const precoPro = 49.0
  const totalDownloads = quantidadeDownloads * 3.5
  const pacotes = [4, 6, 8, 10, 14, 20, 30]

  return (
    <div className="min-h-screen bg-gray-50">
      <nav className="bg-white border-b border-gray-200 px-10 py-4 flex items-center justify-between">
        <Link href="/" className="flex items-center gap-2">
          <div className="w-7 h-7 bg-[#2D6A4F] rounded-md flex items-center justify-center">🌿</div>
          <span className="font-extrabold text-[#1A1A2E]">Talhão</span>
        </Link>
        <span className="text-sm font-medium text-gray-600">Planos e Pagamento</span>
        <div className="bg-[#D8F3DC] text-[#2D6A4F] text-xs font-bold px-3 py-1.5 rounded-lg">
          Saldo: R$ {(creditos * 3.5).toFixed(2)} · {creditos} créditos
        </div>
      </nav>

      <div className="max-w-6xl mx-auto py-10 px-8">

        {/* Abas */}
        <div className="flex gap-4 mb-8 border-b-2 border-gray-200">
          <button
            onClick={() => setTipoCompra('pro')}
            className={`pb-3 px-6 font-bold text-lg transition-all border-b-2 ${
              tipoCompra === 'pro'
                ? 'text-[#1A1A2E] border-[#1A1A2E]'
                : 'text-gray-500 border-transparent'
            }`}
          >
            Plano Pro
          </button>
          <button
            onClick={() => setTipoCompra('downloads')}
            className={`pb-3 px-6 font-bold text-lg transition-all border-b-2 ${
              tipoCompra === 'downloads'
                ? 'text-[#1A1A2E] border-[#1A1A2E]'
                : 'text-gray-500 border-transparent'
            }`}
          >
            Comprar Créditos
          </button>
        </div>

        {tipoCompra === 'pro' ? (
          <div className="grid grid-cols-2 gap-8">
            {/* Esquerda - Descrição */}
            <div className="space-y-6">
              <div>
                <p className="text-sm font-bold text-gray-500 uppercase mb-2">Plano Pro</p>
                <h1 className="text-4xl font-extrabold text-[#1A1A2E] mb-3">R$ 49,00/mês</h1>
                <p className="text-gray-600 text-lg">Downloads ilimitados · Cancele quando quiser</p>
              </div>

              <div className="bg-[#F0FDF4] border border-[#2D6A4F] rounded-xl p-6 space-y-3">
                <h3 className="font-bold text-[#2D6A4F] text-lg mb-4">Incluso:</h3>
                <ul className="space-y-3 text-gray-700">
                  <li className="flex gap-3"><span className="text-[#2D6A4F] font-bold">✓</span> KML (CAR/SICAR)</li>
                  <li className="flex gap-3"><span className="text-[#2D6A4F] font-bold">✓</span> SIGEF e Topografia</li>
                  <li className="flex gap-3"><span className="text-[#2D6A4F] font-bold">✓</span> Qualquer nova análise da Talhão</li>
                  <li className="flex gap-3"><span className="text-[#2D6A4F] font-bold">✓</span> Downloads ilimitados</li>
                  <li className="flex gap-3"><span className="text-[#2D6A4F] font-bold">✓</span> Suporte por email e Whatsapp</li>
                  <li className="flex gap-3"><span className="text-[#2D6A4F] font-bold">✓</span> Sem compromisso anual</li>
                </ul>
              </div>

              <div className="bg-blue-50 border border-blue-200 rounded-xl p-4 text-sm text-blue-800">
                <strong>💡 Cancelável:</strong> Sem contrato, cancele quando quiser.
              </div>
            </div>

            {/* Direita - Botão e resumo */}
            <div className="bg-white rounded-xl border border-gray-200 p-6 h-fit sticky top-8 space-y-6">
              <div>
                <p className="text-sm text-gray-600 mb-2">Resumo</p>
                <div className="flex justify-between items-end mb-4">
                  <div>
                    <p className="text-gray-600 text-sm">Plano Pro (1 mês)</p>
                    <p className="text-xs text-gray-500">Renova automaticamente</p>
                  </div>
                  <p className="text-2xl font-extrabold text-[#1A1A2E]">R$ 49,00</p>
                </div>
              </div>

              <button className="w-full bg-[#2D6A4F] hover:bg-[#1A5C3A] text-white font-bold py-3 rounded-lg transition-colors text-lg">
                Assinar Pro →
              </button>

              <p className="text-xs text-gray-500 text-center">
                Pagamento com Asaas em breve
              </p>
            </div>
          </div>
        ) : (
          <div className="grid grid-cols-2 gap-8">
            {/* Esquerda - Descrição */}
            <div className="space-y-6">
              <div>
                <p className="text-sm font-bold text-gray-500 uppercase mb-2">Créditos Avulsos</p>
                <h1 className="text-4xl font-extrabold text-[#1A1A2E] mb-1">R$ 3,50 por crédito</h1>
                <p className="text-gray-600 text-lg">Pague só quando precisar</p>
              </div>

              <div className="bg-[#F0FDF4] border border-[#2D6A4F] rounded-xl p-5">
                <p className="font-bold text-[#2D6A4F] text-sm mb-3">Como funciona:</p>
                <div className="bg-white rounded-lg p-4 mb-3">
                  <p className="font-bold text-[#1A1A2E] text-base">1 crédito = 1 download</p>
                  <p className="text-xs text-gray-500 mt-1">de qualquer arquivo</p>
                </div>
                <ul className="space-y-2 text-sm text-gray-700">
                  <li className="flex gap-2"><span className="text-[#2D6A4F] font-bold">✓</span> KML (CAR/SICAR)</li>
                  <li className="flex gap-2"><span className="text-[#2D6A4F] font-bold">✓</span> SIGEF</li>
                  <li className="flex gap-2"><span className="text-[#2D6A4F] font-bold">✓</span> Mapa de Topografia</li>
                  <li className="flex gap-2"><span className="text-[#2D6A4F] font-bold">✓</span> E outros formatos</li>
                </ul>
                <p className="text-xs text-gray-500 mt-3">Créditos válidos por 1 ano</p>
              </div>

              <div className="space-y-3">
                <p className="text-sm font-bold text-gray-700">Escolha a quantidade:</p>
                <div className="grid grid-cols-3 gap-2">
                  {pacotes.map(qty => (
                    <button
                      key={qty}
                      onClick={() => setQuantidadeDownloads(qty)}
                      className={`p-4 rounded-lg border-2 transition-all text-center font-bold ${
                        quantidadeDownloads === qty
                          ? 'border-[#2D6A4F] bg-[#F0FDF4] text-[#1A1A2E]'
                          : 'border-gray-200 bg-white text-gray-700 hover:border-gray-400'
                      }`}
                    >
                      <div className="text-lg">{qty} créditos</div>
                      <div className="text-xs text-gray-500 mt-1">R$ {(qty * 3.5).toFixed(2)}</div>
                    </button>
                  ))}
                </div>
              </div>

              <div className="bg-amber-50 border border-amber-200 rounded-xl p-4 text-sm text-amber-800">
                <strong>💡 Dica:</strong> A partir de 14 créditos (R$ 49), o Plano Pro é mais vantajoso.
              </div>
            </div>

            {/* Direita - Resumo */}
            <div className="bg-white rounded-xl border border-gray-200 p-6 h-fit sticky top-8 space-y-6">
              <div>
                <p className="text-sm text-gray-600 mb-2">Resumo</p>
                <div className="flex justify-between items-end mb-4">
                  <div>
                    <p className="text-gray-600 text-sm">{quantidadeDownloads} créditos</p>
                    <p className="text-xs text-gray-500">R$ 3,50 cada</p>
                  </div>
                  <p className="text-2xl font-extrabold text-[#1A1A2E]">R$ {totalDownloads.toFixed(2)}</p>
                </div>
              </div>

              <button className="w-full bg-[#2D6A4F] hover:bg-[#1A5C3A] text-white font-bold py-3 rounded-lg transition-colors text-lg">
                Comprar {quantidadeDownloads} créditos →
              </button>

              <p className="text-xs text-gray-500 text-center">
                Pagamento com Asaas em breve
              </p>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
