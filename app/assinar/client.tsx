'use client'

import { useState, useEffect } from 'react'
import { useSearchParams, useRouter } from 'next/navigation'
import Link from 'next/link'
import { supabase } from '@/lib/supabase'

type PaymentMethod = 'pix' | 'boleto' | 'cartao'
type PaymentResult = {
  payment_id: string
  pix_qr_code?: string
  pix_copy_paste?: string
  boleto_url?: string
  invoice_url?: string
  amount: number
  quantidade_creditos: number
}

const pacotes = [4, 6, 8, 10, 14, 20, 30]

export default function AssinarClient() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const tabParam = searchParams.get('tab')

  const [tipoCompra, setTipoCompra] = useState<'pro' | 'downloads'>(tabParam === 'downloads' ? 'downloads' : 'pro')
  const [quantidade, setQuantidade] = useState(8)
  const [creditos, setCreditos] = useState(0)
  const [carregando, setCarregando] = useState(true)
  const [session, setSession] = useState<any>(null)

  // Modal de pagamento
  const [modalAberto, setModalAberto] = useState(false)
  const [paymentMethod, setPaymentMethod] = useState<PaymentMethod>('pix')
  const [cpf, setCpf] = useState('')
  const [processando, setProcessando] = useState(false)
  const [erro, setErro] = useState('')
  const [resultado, setResultado] = useState<PaymentResult | null>(null)
  const [pixCopiado, setPixCopiado] = useState(false)

  useEffect(() => {
    const verificarAuth = async () => {
      const { data: { session } } = await supabase.auth.getSession()
      if (!session) {
        router.push('/entrar?redirect=/assinar')
        return
      }
      setSession(session)

      const { data } = await supabase
        .from('carteira')
        .select('creditos')
        .eq('user_id', session.user.id)
        .single()

      setCreditos(data?.creditos ?? 0)
      setCarregando(false)
    }
    verificarAuth()
  }, [router])

  const formatCpf = (v: string) => {
    const nums = v.replace(/\D/g, '').slice(0, 11)
    return nums
      .replace(/(\d{3})(\d)/, '$1.$2')
      .replace(/(\d{3})(\d)/, '$1.$2')
      .replace(/(\d{3})(\d{1,2})$/, '$1-$2')
  }

  const handlePagar = async () => {
    if (!cpf || cpf.replace(/\D/g, '').length < 11) {
      setErro('CPF inválido')
      return
    }
    setProcessando(true)
    setErro('')

    try {
      const { data: { session: currentSession } } = await supabase.auth.getSession()
      const res = await fetch('/api/payments/create', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${currentSession?.access_token}`,
        },
        body: JSON.stringify({
          quantidade_creditos: quantidade,
          payment_method: paymentMethod,
          cpf,
        }),
      })

      const data = await res.json()

      if (!res.ok || !data.success) {
        setErro(data.error || 'Erro ao processar pagamento')
        return
      }

      // Redireciona para página de acompanhamento
      router.push(`/pagamento/${data.payment_id}`)

    } catch (e: any) {
      setErro(e.message || 'Erro de conexão')
    } finally {
      setProcessando(false)
    }
  }

  const copiarPix = () => {
    if (resultado?.pix_copy_paste) {
      navigator.clipboard.writeText(resultado.pix_copy_paste)
      setPixCopiado(true)
      setTimeout(() => setPixCopiado(false), 3000)
    }
  }

  const abrirModal = (qty: number) => {
    setQuantidade(qty)
    setResultado(null)
    setErro('')
    setModalAberto(true)
  }

  if (carregando) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="w-8 h-8 border-4 border-[#2D6A4F] border-t-transparent rounded-full animate-spin" />
      </div>
    )
  }

  const totalDownloads = quantidade * 3.5

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Navbar */}
      <nav className="bg-white border-b border-gray-200 px-4 sm:px-10 py-3 sm:py-4">
        <div className="flex items-center justify-between">
          <Link href="/" className="flex items-center gap-2">
            <div className="w-7 h-7 bg-[#2D6A4F] rounded-md flex items-center justify-center">🌿</div>
            <span className="font-extrabold text-[#1A1A2E] text-lg">Talhão</span>
          </Link>
          <div className="bg-[#D8F3DC] text-[#2D6A4F] text-xs font-bold px-3 py-1.5 rounded-lg">
            {creditos} créditos
          </div>
        </div>
      </nav>

      <div className="max-w-6xl mx-auto py-6 sm:py-10 px-4 sm:px-8">

        {/* Abas */}
        <div className="flex gap-2 sm:gap-4 mb-6 sm:mb-8 border-b-2 border-gray-200">
          {[['pro', 'Plano Pro'], ['downloads', 'Comprar Créditos']].map(([tab, label]) => (
            <button key={tab} onClick={() => setTipoCompra(tab as any)}
              className={`pb-3 px-3 sm:px-6 font-bold text-sm sm:text-lg transition-all border-b-2 whitespace-nowrap ${
                tipoCompra === tab ? 'text-[#1A1A2E] border-[#1A1A2E]' : 'text-gray-500 border-transparent'
              }`}>
              {label}
            </button>
          ))}
        </div>

        {tipoCompra === 'pro' ? (
          /* ── PLANO PRO ── */
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 lg:gap-8">
            <div className="space-y-6">
              <div>
                <p className="text-xs font-bold text-gray-500 uppercase mb-2">Plano Pro</p>
                <h1 className="text-3xl sm:text-4xl font-extrabold text-[#1A1A2E] mb-3">R$ 49,00/mês</h1>
                <p className="text-gray-600">Downloads ilimitados · Cancele quando quiser</p>
              </div>
              <div className="bg-[#F0FDF4] border border-[#2D6A4F] rounded-xl p-5 space-y-3">
                <h3 className="font-bold text-[#2D6A4F] mb-3">Incluso:</h3>
                {['KML (CAR/SICAR)', 'SIGEF e Topografia', 'Todas as análises da Talhão', 'Downloads ilimitados', 'Suporte por email e WhatsApp', 'Sem compromisso anual'].map(f => (
                  <div key={f} className="flex gap-3 text-sm text-gray-700">
                    <span className="text-[#2D6A4F] font-bold">✓</span> {f}
                  </div>
                ))}
              </div>
            </div>
            <div className="bg-white rounded-xl border border-gray-200 p-5 lg:h-fit lg:sticky lg:top-8 space-y-5">
              <div className="flex justify-between items-end">
                <div>
                  <p className="text-sm text-gray-600">Plano Pro (1 mês)</p>
                  <p className="text-xs text-gray-500">Renova automaticamente</p>
                </div>
                <p className="text-2xl font-extrabold text-[#1A1A2E]">R$ 49,00</p>
              </div>
              <button
                onClick={() => abrirModal(14)}
                className="w-full bg-[#2D6A4F] hover:bg-[#1A5C3A] text-white font-bold py-3 rounded-lg transition-colors text-lg">
                Assinar Pro →
              </button>
              <p className="text-xs text-gray-500 text-center">PIX · Boleto · Cartão</p>
            </div>
          </div>
        ) : (
          /* ── CRÉDITOS AVULSOS ── */
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 lg:gap-8">
            <div className="space-y-6">
              <div>
                <p className="text-xs font-bold text-gray-500 uppercase mb-2">Créditos Avulsos</p>
                <h1 className="text-3xl sm:text-4xl font-extrabold text-[#1A1A2E] mb-1">R$ 3,50 por crédito</h1>
                <p className="text-gray-600">Pague só quando precisar</p>
              </div>
              <div className="space-y-3">
                <p className="text-sm font-bold text-gray-700">Escolha a quantidade:</p>
                <div className="grid grid-cols-3 sm:grid-cols-4 gap-2">
                  {pacotes.map(qty => (
                    <button key={qty} onClick={() => setQuantidade(qty)}
                      className={`p-3 rounded-lg border-2 transition-all text-center ${
                        quantidade === qty
                          ? 'border-[#2D6A4F] bg-[#F0FDF4] text-[#1A1A2E]'
                          : 'border-gray-200 bg-white text-gray-700 hover:border-gray-400'
                      }`}>
                      <div className="font-bold text-sm">{qty} créditos</div>
                      <div className="text-xs text-gray-500 mt-0.5">R$ {(qty * 3.5).toFixed(2)}</div>
                    </button>
                  ))}
                </div>
              </div>
              <div className="bg-amber-50 border border-amber-200 rounded-xl p-4 text-sm text-amber-800">
                <strong>💡 Dica:</strong> A partir de 14 créditos (R$ 49), o Plano Pro é mais vantajoso.
              </div>
            </div>
            <div className="bg-white rounded-xl border border-gray-200 p-5 lg:h-fit lg:sticky lg:top-8 space-y-5">
              <div className="flex justify-between items-end">
                <div>
                  <p className="text-sm text-gray-600">{quantidade} créditos</p>
                  <p className="text-xs text-gray-500">R$ 3,50 cada</p>
                </div>
                <p className="text-2xl font-extrabold text-[#1A1A2E]">R$ {totalDownloads.toFixed(2)}</p>
              </div>
              <button
                onClick={() => abrirModal(quantidade)}
                className="w-full bg-[#2D6A4F] hover:bg-[#1A5C3A] text-white font-bold py-3 rounded-lg transition-colors text-lg">
                Comprar {quantidade} créditos →
              </button>
              <p className="text-xs text-gray-500 text-center">PIX · Boleto · Cartão</p>
            </div>
          </div>
        )}
      </div>

      {/* ── MODAL DE PAGAMENTO ── */}
      {modalAberto && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-md w-full p-6 relative max-h-[90vh] overflow-y-auto">

            <button onClick={() => { setModalAberto(false); setResultado(null) }}
              className="absolute top-4 right-4 text-gray-400 hover:text-gray-600 text-xl font-bold">✕</button>

            <h2 className="text-xl font-extrabold text-[#1A1A2E] mb-1">Finalizar pagamento</h2>
                <p className="text-sm text-gray-500 mb-5">
                  {quantidade} créditos · <strong>R$ {(quantidade * 3.5).toFixed(2)}</strong>
                </p>

                {/* CPF */}
                <div className="mb-5">
                  <label className="block text-xs font-bold text-gray-600 uppercase mb-1.5">CPF</label>
                  <input
                    type="text"
                    placeholder="000.000.000-00"
                    value={cpf}
                    onChange={e => setCpf(formatCpf(e.target.value))}
                    className="w-full px-3.5 py-2.5 border border-gray-300 rounded-lg text-sm outline-none focus:border-[#1A1A2E] transition-colors"
                  />
                </div>

                {/* Método */}
                <div className="mb-5">
                  <label className="block text-xs font-bold text-gray-600 uppercase mb-2">Forma de pagamento</label>
                  <div className="grid grid-cols-3 gap-2">
                    {[
                      { id: 'pix', label: 'PIX', icon: '⚡', desc: 'Instantâneo' },
                      { id: 'boleto', label: 'Boleto', icon: '📄', desc: 'Até 3 dias' },
                      { id: 'cartao', label: 'Cartão', icon: '💳', desc: 'Crédito' },
                    ].map(m => (
                      <button key={m.id} onClick={() => setPaymentMethod(m.id as PaymentMethod)}
                        className={`p-3 rounded-xl border-2 transition-all text-center ${
                          paymentMethod === m.id ? 'border-[#2D6A4F] bg-[#F0FDF4]' : 'border-gray-200 hover:border-gray-300'
                        }`}>
                        <div className="text-xl mb-1">{m.icon}</div>
                        <div className="font-bold text-xs text-[#1A1A2E]">{m.label}</div>
                        <div className="text-xs text-gray-400">{m.desc}</div>
                      </button>
                    ))}
                  </div>
                </div>

                {erro && (
                  <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg text-sm mb-4">
                    {erro}
                  </div>
                )}

                <button onClick={handlePagar} disabled={processando}
                  className="w-full bg-[#2D6A4F] hover:bg-[#1A5C3A] disabled:opacity-50 text-white font-bold py-3 rounded-xl transition-colors text-base">
                  {processando ? 'Processando...' : `Pagar R$ ${(quantidade * 3.5).toFixed(2)}`}
                </button>

                <p className="text-xs text-gray-400 text-center mt-3">Pagamento seguro via Asaas</p>
              </>
            ) : (
              <>
                {/* ── RESULTADO PIX ── */}
                {paymentMethod === 'pix' && resultado.pix_qr_code && (
                  <div className="text-center">
                    <div className="text-3xl mb-2">⚡</div>
                    <h2 className="text-lg font-extrabold text-[#1A1A2E] mb-1">Pague com PIX</h2>
                    <p className="text-sm text-gray-500 mb-4">Escaneie o QR code ou copie o código</p>
                    <img
                      src={`data:image/png;base64,${resultado.pix_qr_code}`}
                      alt="QR Code PIX"
                      className="w-48 h-48 mx-auto mb-4 border border-gray-200 rounded-lg"
                    />
                    <button onClick={copiarPix}
                      className={`w-full py-3 rounded-xl font-bold text-sm transition-colors mb-3 ${
                        pixCopiado
                          ? 'bg-green-100 text-green-700 border border-green-300'
                          : 'bg-[#1A1A2E] text-white hover:bg-[#2d2d50]'
                      }`}>
                      {pixCopiado ? '✅ Código copiado!' : '📋 Copiar código PIX'}
                    </button>
                    <p className="text-xs text-gray-400">Os créditos serão adicionados automaticamente após a confirmação.</p>
                  </div>
                )}

                {/* ── RESULTADO BOLETO ── */}
                {paymentMethod === 'boleto' && resultado.boleto_url && (
                  <div className="text-center">
                    <div className="text-3xl mb-2">📄</div>
                    <h2 className="text-lg font-extrabold text-[#1A1A2E] mb-1">Boleto gerado!</h2>
                    <p className="text-sm text-gray-500 mb-4">Vencimento em 3 dias úteis</p>
                    <a href={resultado.boleto_url} target="_blank" rel="noopener noreferrer"
                      className="block w-full bg-[#1A1A2E] text-white font-bold py-3 rounded-xl text-sm hover:bg-[#2d2d50] transition-colors mb-3">
                      Abrir boleto →
                    </a>
                    <p className="text-xs text-gray-400">Os créditos serão adicionados após a compensação.</p>
                  </div>
                )}

                {/* ── RESULTADO CARTÃO ── */}
                {paymentMethod === 'cartao' && (
                  <div className="text-center">
                    <div className="text-3xl mb-2">💳</div>
                    <h2 className="text-lg font-extrabold text-[#1A1A2E] mb-1">Página de pagamento aberta</h2>
                    <p className="text-sm text-gray-500 mb-4">
                      Uma nova aba foi aberta com a página segura do Asaas para inserir os dados do cartão.
                    </p>
                    {resultado.invoice_url && (
                      <a href={resultado.invoice_url} target="_blank" rel="noopener noreferrer"
                        className="block w-full bg-[#1A1A2E] text-white font-bold py-3 rounded-xl text-sm hover:bg-[#2d2d50] transition-colors mb-3">
                        Abrir novamente →
                      </a>
                    )}
                    <p className="text-xs text-gray-400">Os créditos serão adicionados automaticamente após a confirmação.</p>
                  </div>
                )}

                <button onClick={() => { setModalAberto(false); setResultado(null) }}
                  className="w-full mt-4 py-2 text-sm text-gray-500 hover:text-gray-700 transition-colors">
                  Fechar
                </button>
              </>
            )}
          </div>
        </div>
      )}
    </div>
  )
}
