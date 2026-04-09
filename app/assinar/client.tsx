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

  return (
    <div className="min-h-screen bg-gray-50">
      <nav className="bg-white border-b border-gray-200 px-10 py-4 flex items-center justify-between">
        <Link href="/" className="flex items-center gap-2">
          <div className="w-7 h-7 bg-[#2D6A4F] rounded-md flex items-center justify-center">🌿</div>
          <span className="font-extrabold text-[#1A1A2E]">Talhão</span>
        </Link>
        <span className="text-sm font-medium text-gray-600">Planos</span>
        <div className="bg-[#D8F3DC] text-[#2D6A4F] text-xs font-bold px-3 py-1.5 rounded-lg">
          Saldo: {creditos} créditos
        </div>
      </nav>

      <div className="max-w-5xl mx-auto py-10 px-8 grid grid-cols-3 gap-8">
        <div className="col-span-2 space-y-6">

          {/* Abas */}
          <div className="flex gap-2 border-b border-gray-200">
            <button
              onClick={() => setTipoCompra('pro')}
              className={`pb-3 px-4 font-bold transition-all ${
                tipoCompra === 'pro'
                  ? 'text-[#1A1A2E] border-b-2 border-[#1A1A2E]'
                  : 'text-gray-500'
              }`}
            >
              Plano Pro
            </button>
            <button
              onClick={() => setTipoCompra('downloads')}
              className={`pb-3 px-4 font-bold transition-all ${
                tipoCompra === 'downloads'
                  ? 'text-[#1A1A2E] border-b-2 border-[#1A1A2E]'
                  : 'text-gray-500'
              }`}
            >
              Comprar Downloads
            </button>
          </div>

          {tipoCompra === 'pro' ? (
            <>
              <div>
                <h1 className="text-4xl font-extrabold text-[#1A1A2E] mb-1">R$ 49,00/mês</h1>
                <p className="text-gray-600">Downloads ilimitados · Cancele quando quiser</p>
              </div>

              <div className="bg-[#F0FDF4] border border-[#2D6A4F] rounded-xl p-6">
                <h3 className="font-bold text-[#2D6A4F] mb-4">Incluso:</h3>
                <ul className="space-y-2 text-sm text-gray-700">
                  <li>✓ KML (CAR/SICAR)</li>
                  <li>✓ SIGEF e Topografia</li>
                  <li>✓ Downloads ilimitados</li>
                  <li>✓ Suporte por email</li>
                  <li>✓ Sem compromisso</li>
                </ul>
              </div>
            </>
          ) : (
            <>
              <div>
                <h1 className="text-4xl font-extrabold text-[#1A1A2E] mb-1">R$ 3,50 por download</h1>
                <p className="text-gray-600">Pague só quando precisar</p>
              </div>

              <div className="grid grid-cols-2 gap-2">
                {[4, 6, 8, 10, 14, 20].map(qty => (
                  <button
                    key={qty}
                    onClick={() => setQuantidadeDownloads(qty)}
                    className={`p-4 rounded-lg border-2 transition-all font-semibold text-left ${
                      quantidadeDownloads === qty
                        ? 'border-[#2D6A4F] bg-[#F0FDF4]'
                        : 'border-gray-200 bg-white'
                    }`}
                  >
                    <div className="text-[#1A1A2E]">{qty}</div>
                    <div className="text-xs text-gray-500">R$ {(qty * 3.5).toFixed(2)}</div>
                  </button>
                ))}
              </div>
            </>
          )}
        </div>

        {/* Sidebar */}
        <div className="bg-white rounded-xl border border-gray-200 p-6 h-fit sticky top-8">
          <h3 className="font-bold text-[#1A1A2E] mb-4">Resumo</h3>

          <div className="space-y-2 mb-6 pb-6 border-b border-gray-200">
            <div className="flex justify-between text-sm">
              <span className="text-gray-600">
                {tipoCompra === 'pro' ? 'Plano Pro (1 mês)' : `${quantidadeDownloads} créditos`}
              </span>
              <span className="font-bold">
                R$ {(tipoCompra === 'pro' ? precoPro : totalDownloads).toFixed(2)}
              </span>
            </div>
          </div>

          <button className="w-full bg-[#2D6A4F] hover:bg-[#1A5C3A] text-white font-bold py-3 rounded-lg mb-3 transition-colors">
            {tipoCompra === 'pro'
              ? 'Assinar Pro'
              : `Comprar ${quantidadeDownloads} créditos`
            }
          </button>

          <p className="text-xs text-gray-500 text-center">
            Pagamento com Asaas em breve
          </p>
        </div>
      </div>
    </div>
  )
}
