'use client'

import { useState, useEffect } from 'react'
import { useSearchParams } from 'next/navigation'
import Link from 'next/link'
import { supabase } from '@/lib/supabase'

const beneficios = [
  'Downloads ilimitados de qualquer arquivo',
  'KML (CAR/SICAR), SIGEF, Topografia',
  'Sem limite de requisições',
  'Suporte prioritário por email',
  'Acesso a novas camadas quando lançadas',
]

export default function AssinarPage() {
  const searchParams = useSearchParams()
  const tabParam = searchParams.get('tab')
  const [tipoCompra, setTipoCompra] = useState<'pro' | 'downloads'>(tabParam === 'downloads' ? 'downloads' : 'pro')
  const [quantidadeDownloads, setQuantidadeDownloads] = useState(4)
  const [creditos, setCreditos] = useState(0)
  const [usuario, setUsuario] = useState<any>(null)

  useEffect(() => {
    const carregarDados = async () => {
      const { data: { session } } = await supabase.auth.getSession()
      if (session) {
        setUsuario(session.user)
        const { data } = await supabase
          .from('carteira')
          .select('creditos')
          .eq('user_id', session.user.id)
          .single()
        setCreditos(data?.creditos ?? 0)
      }
    }
    carregarDados()
  }, [])

  const precoDownload = 3.50
  const totalDownloads = quantidadeDownloads * precoDownload
  const precoPro = 49.00

  // Se chegar em 14+ downloads, calcula economia
  const downloadEquivalentePro = 14
  const custoDowloads14 = downloadEquivalentePro * precoDownload
  const economia = Math.max(0, totalDownloads - precoPro)

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Nav */}
      <nav className="bg-white border-b border-gray-200 px-10 py-4 flex items-center justify-between">
        <Link href="/" className="flex items-center gap-2">
          <div className="w-7 h-7 bg-[#2D6A4F] rounded-md flex items-center justify-center text-sm">🌿</div>
          <span className="font-extrabold text-[#1A1A2E]">Talhão</span>
        </Link>
        <span className="text-sm font-medium text-gray-600">💳 Planos e Pagamento</span>
        <div className="bg-[#D8F3DC] text-[#2D6A4F] text-xs font-bold px-3 py-1.5 rounded-lg">
          Saldo: R$ {(creditos * 3.5).toFixed(2)} · {creditos} créditos
        </div>
      </nav>

      <div className="max-w-5xl mx-auto py-10 px-8 grid grid-cols-5 gap-8">
        {/* Esquerda */}
        <div className="col-span-3 space-y-6">

          {/* Abas de seleção */}
          <div className="flex border-2 border-gray-300 rounded-2xl overflow-hidden bg-white">
            <button
              onClick={() => setTipoCompra('pro')}
              className={`flex-1 py-4 text-base font-bold transition-all ${
                tipoCompra === 'pro'
                  ? 'bg-[#1A1A2E] text-white'
                  : 'text-gray-600 hover:text-gray-800'
              }`}
            >
              🌟 Plano Pro
            </button>
            <button
              onClick={() => setTipoCompra('downloads')}
              className={`flex-1 py-4 text-base font-bold transition-all ${
                tipoCompra === 'downloads'
                  ? 'bg-[#1A1A2E] text-white'
                  : 'text-gray-600 hover:text-gray-800'
              }`}
            >
              📥 Comprar Downloads
            </button>
          </div>

          {/* ===== SEÇÃO: PLANO PRO ===== */}
          {tipoCompra === 'pro' && (
            <>
              <div>
                <p className="text-xs font-bold tracking-widest text-gray-400 uppercase mb-1">Plano Pro — Mensal</p>
                <h1 className="text-3xl font-extrabold text-[#1A1A2E]">Downloads ilimitados</h1>
                <p className="text-gray-600 text-lg mt-2">R$ 49,00 por mês · cancele quando quiser</p>
              </div>

              {/* Comparativo */}
              <div className="bg-[#F0FDF4] border border-[#BBF7D0] rounded-xl p-5 space-y-3">
                <p className="text-sm font-bold text-green-800">📊 Por que o Pro é melhor?</p>
                <div className="space-y-2 text-sm">
                  <div className="flex justify-between"><span className="text-gray-700">14 downloads avulsos</span><span className="font-bold text-red-600">R$ 49,00</span></div>
                  <div className="flex justify-between"><span className="text-gray-700">20 downloads avulsos</span><span className="font-bold text-red-600">R$ 70,00</span></div>
                  <div className="flex justify-between border-t pt-2"><span className="text-gray-700 font-bold">Plano Pro (ilimitado)</span><span className="font-bold text-[#2D6A4F]">R$ 49,00 ✓</span></div>
                </div>
              </div>

              {/* Método de pagamento */}
              <div className="space-y-4">
                <p className="text-sm font-bold text-[#1A1A2E]">Escolha a forma de pagamento:</p>

                <div className="flex border-2 border-gray-200 rounded-xl overflow-hidden mb-5">
                  <button className="flex-1 py-3 text-sm font-semibold bg-[#1A1A2E] text-white">🟢 PIX</button>
                  <button className="flex-1 py-3 text-sm font-semibold text-gray-600 bg-white">💳 Cartão</button>
                </div>

                {/* Dados para NF */}
                <div className="bg-gray-50 rounded-xl p-5 space-y-3 mb-5">
                  <p className="text-sm font-bold text-[#1A1A2E]">Dados para nota fiscal</p>
                  <div>
                    <label className="form-label">CPF ou CNPJ</label>
                    <input className="form-input" placeholder="000.000.000-00" />
                    <p className="text-xs text-gray-400 mt-1">Usado apenas para emissão da nota fiscal mensal</p>
                  </div>
                  <div>
                    <label className="form-label">Nome completo / Razão social</label>
                    <input className="form-input" placeholder="João da Silva" />
                  </div>
                </div>

                {/* QR Code PIX */}
                <div className="bg-gray-50 rounded-xl p-6 text-center mb-5">
                  <p className="text-sm font-semibold text-[#1A1A2E] mb-1">Escaneie o QR Code</p>
                  <p className="text-xs text-gray-500 mb-4">R$ 49,00 · Plano Pro ativado automaticamente</p>
                  <div className="w-40 h-40 bg-white border-2 border-gray-300 rounded-lg mx-auto mb-4 flex items-center justify-center">
                    <svg width="100" height="100" viewBox="0 0 100 100" fill="none">
                      <rect x="5" y="5" width="35" height="35" rx="3" stroke="#1A1A2E" strokeWidth="4" fill="none"/>
                      <rect x="15" y="15" width="15" height="15" rx="1" fill="#1A1A2E"/>
                      <rect x="60" y="5" width="35" height="35" rx="3" stroke="#1A1A2E" strokeWidth="4" fill="none"/>
                      <rect x="70" y="15" width="15" height="15" rx="1" fill="#1A1A2E"/>
                      <rect x="5" y="60" width="35" height="35" rx="3" stroke="#1A1A2E" strokeWidth="4" fill="none"/>
                      <rect x="15" y="70" width="15" height="15" rx="1" fill="#1A1A2E"/>
                      <rect x="55" y="55" width="8" height="8" fill="#1A1A2E"/>
                      <rect x="67" y="55" width="8" height="8" fill="#1A1A2E"/>
                      <rect x="79" y="55" width="16" height="8" fill="#1A1A2E"/>
                    </svg>
                  </div>
                  <div className="flex items-center gap-2 bg-white border border-gray-200 rounded-lg px-3 py-2.5 text-xs font-mono text-gray-600 mb-3">
                    <span className="flex-1 truncate">00020126580014BR.GOB.BCB.PIX...</span>
                    <button className="bg-[#1A1A2E] text-white px-3 py-1.5 rounded-md text-xs font-bold">Copiar</button>
                  </div>
                  <p className="text-xs text-gray-400">⏱ Expira em <strong className="text-red-500">14:38</strong></p>
                </div>

                {/* Cartão */}
                <div className="border-2 border-gray-200 rounded-xl p-5 bg-white space-y-4">
                  <p className="text-xs font-bold text-gray-400 uppercase tracking-widest">Cartão de crédito</p>
                  <div>
                    <label className="form-label">Número do cartão</label>
                    <input className="form-input" placeholder="0000 0000 0000 0000" />
                  </div>
                  <div>
                    <label className="form-label">Nome impresso no cartão</label>
                    <input className="form-input" placeholder="JOAO DA SILVA" />
                  </div>
                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <label className="form-label">Validade</label>
                      <input className="form-input" placeholder="MM/AA" />
                    </div>
                    <div>
                      <label className="form-label">CVV</label>
                      <input className="form-input" placeholder="123" />
                    </div>
                  </div>
                  <button className="btn-primary w-full py-3 rounded-xl text-base font-bold">
                    Assinar Pro — R$ 49,00/mês →
                  </button>
                </div>
              </div>

              <div className="flex items-center gap-2 bg-gray-50 border border-gray-200 rounded-xl p-3 text-xs text-gray-500">
                🔒 Pagamento processado via <strong className="text-[#1A1A2E] mx-1">Stripe</strong>. Seus dados são seguros.
              </div>
            </>
          )}

          {/* ===== SEÇÃO: COMPRAR DOWNLOADS ===== */}
          {tipoCompra === 'downloads' && (
            <>
              <div>
                <p className="text-xs font-bold tracking-widest text-gray-400 uppercase mb-1">Créditos Avulsos</p>
                <h1 className="text-3xl font-extrabold text-[#1A1A2E]">R$ 3,50 por download</h1>
                <p className="text-gray-600 text-lg mt-2">Use quando quiser, sem compromisso mensal</p>
              </div>

              {/* Seletor de quantidade */}
              <div className="bg-white rounded-2xl border-2 border-gray-200 p-8 space-y-6">
                <div>
                  <p className="text-sm font-bold text-[#1A1A2E] mb-4">Quantos downloads você precisa?</p>

                  <div className="space-y-3">
                    {[4, 6, 10, 14, 20, 30].map((qty) => (
                      <button
                        key={qty}
                        onClick={() => setQuantidadeDownloads(qty)}
                        className={`w-full flex items-center justify-between px-5 py-4 rounded-xl border-2 transition-all ${
                          quantidadeDownloads === qty
                            ? 'border-[#2D6A4F] bg-[#F0FDF4]'
                            : 'border-gray-200 bg-white hover:border-gray-300'
                        }`}
                      >
                        <div className="text-left">
                          <p className="font-semibold text-[#1A1A2E]">{qty} downloads</p>
                          <p className="text-xs text-gray-500">Validade: 1 ano</p>
                        </div>
                        <div className="text-right">
                          <p className="font-bold text-lg text-[#2D6A4F]">R$ {(qty * precoDownload).toFixed(2)}</p>
                          <p className="text-xs text-gray-500">{(qty * precoDownload / qty).toFixed(2)}/download</p>
                        </div>
                      </button>
                    ))}
                  </div>
                </div>

                {/* Aviso break-even */}
                {quantidadeDownloads >= downloadEquivalentePro && (
                  <div className="bg-amber-50 border-2 border-amber-300 rounded-xl p-4 space-y-2">
                    <p className="font-bold text-amber-900 text-sm">💡 Dica importante</p>
                    <p className="text-xs text-amber-800">
                      {quantidadeDownloads === downloadEquivalentePro
                        ? `Com ${quantidadeDownloads} downloads você gasta R$ ${totalDownloads.toFixed(2)} — exatamente o preço do Plano Pro! Mas o Pro é ilimitado.`
                        : `Você vai gastar R$ ${totalDownloads.toFixed(2)} em ${quantidadeDownloads} downloads. O Plano Pro (R$ 49,00/mês) sai mais barato se você fizer mais de ${downloadEquivalentePro} downloads.`
                      }
                    </p>
                  </div>
                )}
              </div>

              {/* Resumo */}
              <div className="bg-gray-50 rounded-xl p-5 space-y-4">
                <p className="text-sm font-bold text-[#1A1A2E]">Resumo da compra</p>
                <div className="space-y-2 text-sm">
                  <div className="flex justify-between"><span className="text-gray-600">{quantidadeDownloads} downloads</span><span className="font-semibold">R$ {totalDownloads.toFixed(2)}</span></div>
                  <div className="flex justify-between text-xs text-gray-500"><span>Taxa de processamento</span><span>Grátis</span></div>
                  <div className="border-t pt-3 flex justify-between font-bold text-base">
                    <span>Total</span>
                    <span className="text-[#2D6A4F]">R$ {totalDownloads.toFixed(2)}</span>
                  </div>
                </div>
              </div>

              {/* Métodos de pagamento */}
              <div className="space-y-4">
                <p className="text-sm font-bold text-[#1A1A2E]">Forma de pagamento:</p>

                <div className="flex border-2 border-gray-200 rounded-xl overflow-hidden">
                  <button className="flex-1 py-3 text-sm font-semibold bg-[#1A1A2E] text-white">🟢 PIX</button>
                  <button className="flex-1 py-3 text-sm font-semibold text-gray-600 bg-white">💳 Cartão</button>
                </div>

                {/* QR Code PIX */}
                <div className="bg-gray-50 rounded-xl p-6 text-center">
                  <p className="text-sm font-semibold text-[#1A1A2E] mb-1">Escaneie o QR Code</p>
                  <p className="text-xs text-gray-500 mb-4">R$ {totalDownloads.toFixed(2)} · Créditos adicionados imediatamente</p>
                  <div className="w-40 h-40 bg-white border-2 border-gray-300 rounded-lg mx-auto mb-4 flex items-center justify-center">
                    <svg width="100" height="100" viewBox="0 0 100 100" fill="none">
                      <rect x="5" y="5" width="35" height="35" rx="3" stroke="#1A1A2E" strokeWidth="4" fill="none"/>
                      <rect x="15" y="15" width="15" height="15" rx="1" fill="#1A1A2E"/>
                      <rect x="60" y="5" width="35" height="35" rx="3" stroke="#1A1A2E" strokeWidth="4" fill="none"/>
                      <rect x="70" y="15" width="15" height="15" rx="1" fill="#1A1A2E"/>
                      <rect x="5" y="60" width="35" height="35" rx="3" stroke="#1A1A2E" strokeWidth="4" fill="none"/>
                      <rect x="15" y="70" width="15" height="15" rx="1" fill="#1A1A2E"/>
                      <rect x="55" y="55" width="8" height="8" fill="#1A1A2E"/>
                      <rect x="67" y="55" width="8" height="8" fill="#1A1A2E"/>
                      <rect x="79" y="55" width="16" height="8" fill="#1A1A2E"/>
                    </svg>
                  </div>
                  <button className="btn-primary w-full py-3 rounded-xl text-base font-bold">
                    Copiar código PIX
                  </button>
                </div>
              </div>
            </>
          )}
        </div>

        {/* Direita: Benefícios */}
        <div className="col-span-2 space-y-5">
          {tipoCompra === 'pro' ? (
            <>
              <h2 className="text-sm font-bold text-[#1A1A2E]">Plano Pro — o que você ganha</h2>
              <div className="bg-white rounded-xl p-5 border border-gray-200 space-y-4">
                <div>
                  <p className="font-bold text-[#1A1A2E] text-lg">🌟 Plano Pro</p>
                  <p className="text-xs text-gray-500">Mensal · sem contrato</p>
                </div>
                <div className="space-y-3">
                  {beneficios.map(b => (
                    <div key={b} className="flex items-start gap-2 text-sm text-gray-700">
                      <span className="text-[#2D6A4F] font-bold mt-0.5">✓</span>
                      <span>{b}</span>
                    </div>
                  ))}
                </div>
              </div>
              <div className="bg-amber-50 rounded-xl p-4 border border-amber-200 text-xs text-amber-800 space-y-2">
                <strong className="block">💡 Seus créditos continuam válidos</strong>
                <p>Ao assinar Pro, seus downloads avulsos não somem. Use-os quando cancelar o plano.</p>
              </div>
            </>
          ) : (
            <>
              <h2 className="text-sm font-bold text-[#1A1A2E]">Créditos Avulsos</h2>
              <div className="bg-white rounded-xl p-5 border border-gray-200 space-y-4">
                <div>
                  <p className="font-bold text-[#1A1A2E] text-lg">📥 Pague por download</p>
                  <p className="text-xs text-gray-500">Sem contrato · use quando quiser</p>
                </div>
                <div className="space-y-3 text-sm text-gray-700">
                  <div className="flex items-start gap-2">
                    <span className="text-[#2D6A4F] font-bold mt-0.5">✓</span>
                    <span>Sem compromisso mensal</span>
                  </div>
                  <div className="flex items-start gap-2">
                    <span className="text-[#2D6A4F] font-bold mt-0.5">✓</span>
                    <span>Créditos válidos por 1 ano</span>
                  </div>
                  <div className="flex items-start gap-2">
                    <span className="text-[#2D6A4F] font-bold mt-0.5">✓</span>
                    <span>Acesso a todos os arquivos</span>
                  </div>
                  <div className="flex items-start gap-2">
                    <span className="text-[#2D6A4F] font-bold mt-0.5">✓</span>
                    <span>Suporte por email</span>
                  </div>
                </div>
              </div>
              <div className="bg-blue-50 rounded-xl p-4 border border-blue-200 text-xs text-blue-800 space-y-2">
                <strong className="block">🎯 Dica</strong>
                <p>Se você vai fazer mais de 14 downloads por mês, considere assinar o Plano Pro.</p>
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  )
}
