'use client'

import Image from 'next/image'
import { useEffect, useState } from 'react'
import { useParams, useRouter } from 'next/navigation'
import Link from 'next/link'
import AppTopbar from '@/components/AppTopbar'
import { buildLoginPath, supabase } from '@/lib/supabase'

type Payment = {
  id: string
  status: 'pending' | 'approved' | 'failed' | 'refunded'
  amount: number
  quantidade_creditos: number
  payment_method: 'pix' | 'boleto' | 'cartao'
  pix_qr_code?: string
  pix_copy_paste?: string
  boleto_line?: string
  boleto_url?: string
  invoice_url?: string
  created_at: string
}

const statusConfig = {
  pending: {
    icon: '⏳',
    titulo: 'Aguardando pagamento',
    descricao: 'Escaneie o QR code PIX ou use o código para pagar',
    cor: 'bg-amber-50 border-amber-200 text-amber-800',
    progresso: 33,
  },
  approved: {
    icon: '✅',
    titulo: 'Pagamento confirmado!',
    descricao: 'Seus créditos foram adicionados à carteira',
    cor: 'bg-green-50 border-green-200 text-green-800',
    progresso: 100,
  },
  failed: {
    icon: '❌',
    titulo: 'Pagamento recusado',
    descricao: 'Houve um problema ao processar seu pagamento. Tente novamente.',
    cor: 'bg-red-50 border-red-200 text-red-800',
    progresso: 0,
  },
  refunded: {
    icon: '🔄',
    titulo: 'Reembolsado',
    descricao: 'Este pagamento foi reembolsado',
    cor: 'bg-blue-50 border-blue-200 text-blue-800',
    progresso: 50,
  },
}

export default function PagamentoPage() {
  const params = useParams()
  const router = useRouter()
  const paymentId = params.id as string

  const [payment, setPayment] = useState<Payment | null>(null)
  const [carregando, setCarregando] = useState(true)
  const [erro, setErro] = useState('')
  const [pixCopiado, setPixCopiado] = useState(false)
  const [boletoCopiado, setBoletoCopiado] = useState(false)
  const [autoRefresh, setAutoRefresh] = useState(true)

  useEffect(() => {
    const buscarPagamento = async () => {
      try {
        const { data: { session } } = await supabase.auth.getSession()
        if (!session) {
          router.replace(buildLoginPath(`/pagamento/${paymentId}`, 'Entre com sua conta Google para acompanhar este pagamento.'))
          return
        }

        const { data, error } = await supabase
          .from('payments')
          .select('*')
          .eq('id', paymentId)
          .eq('user_id', session.user.id)
          .single()

        if (error || !data) {
          setErro('Pagamento não encontrado')
          return
        }

        setPayment(data)
      } catch (e: any) {
        setErro(e.message || 'Erro ao buscar pagamento')
      } finally {
        setCarregando(false)
      }
    }

    buscarPagamento()

    // Auto-refresh a cada 5 segundos se ainda está pending
    const interval = setInterval(buscarPagamento, 5000)
    return () => clearInterval(interval)
  }, [paymentId, router])

  if (carregando) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-white">
        <div className="text-center">
          <div className="w-12 h-12 border-4 border-[#2D6A4F] border-t-transparent rounded-full animate-spin mx-auto mb-4" />
          <p className="text-gray-500">Carregando...</p>
        </div>
      </div>
    )
  }

  if (erro || !payment) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-white p-4">
        <div className="bg-white rounded-2xl p-8 max-w-md text-center">
          <div className="text-4xl mb-4">❌</div>
          <h1 className="text-xl font-bold text-[#162113] mb-2">Erro</h1>
          <p className="text-gray-600 mb-6">{erro}</p>
          <Link href="/assinar" className="inline-block bg-[#2D6A4F] text-white font-bold py-2 px-6 rounded-lg hover:bg-[#1f5230] transition-colors">
            Voltar para comprar créditos
          </Link>
        </div>
      </div>
    )
  }

  const config = statusConfig[payment.status]
  const copiarPix = () => {
    if (payment.pix_copy_paste) {
      navigator.clipboard.writeText(payment.pix_copy_paste)
      setPixCopiado(true)
      setTimeout(() => setPixCopiado(false), 3000)
    }
  }

  const copiarBoleto = () => {
    if (payment.boleto_line) {
      navigator.clipboard.writeText(payment.boleto_line)
      setBoletoCopiado(true)
      setTimeout(() => setBoletoCopiado(false), 3000)
    }
  }

  const formatData = (dateString: string) => {
    return new Date(dateString).toLocaleString('pt-BR')
  }

  const metodoPagamentoIcon = {
    pix: '⚡',
    boleto: '📄',
    cartao: '💳',
  }

  return (
    <div className="flex min-h-screen">
      <aside className="sticky top-0 hidden h-screen w-1/3 shrink-0 overflow-hidden lg:flex">
        <Image
          src="/foto-lp5.png"
          alt="Vista aérea de propriedade rural"
          fill
          className="object-cover object-center"
          priority
        />
        <div className="absolute inset-0 bg-[#162113]/70" />

        <div className="relative z-10 flex h-full w-full flex-col p-10">
          <Link href="/" className="inline-flex">
            <Image src="/logo-oficial-branco.png" width={360} height={96} alt="Talhão" />
          </Link>

          <div className="flex flex-1 items-center justify-center">
            <div className="w-full max-w-sm rounded-2xl border border-white/20 bg-white/10 p-8 backdrop-blur-md">
              <p className="text-xl font-semibold leading-relaxed text-white">
                &ldquo;Acesse dados de qualquer fazenda do Brasil em segundos — diretamente do satélite.&rdquo;
              </p>
              <div className="mt-6 flex flex-col gap-3 text-sm text-white/80">
                <span>🛰 Satélite atualizado semanalmente</span>
                <span>⚡ Resultados em menos de 30s</span>
                <span>📍 100% do território brasileiro</span>
              </div>
            </div>
          </div>
        </div>

        <div className="absolute bottom-6 right-6 z-20 inline-flex items-center gap-2 rounded-full border border-[#40916C]/60 bg-[#40916C]/20 px-4 py-2 text-xs font-semibold text-[#B7E4C7] backdrop-blur-sm">
          <span className="h-2.5 w-2.5 animate-pulse rounded-full bg-[#52b788]" />
          Sistema da Talhão está ativo
        </div>
      </aside>

      <main className="flex-1 bg-white lg:h-screen lg:overflow-y-auto">
        <AppTopbar />

        <div className="mx-auto max-w-2xl px-4 py-8 sm:px-8 sm:py-12">
          {/* Card Principal */}
          <div className={`rounded-2xl border-2 p-6 sm:p-8 mb-6 ${config.cor}`}>
            <div className="text-5xl mb-4 text-center">{config.icon}</div>
            <h1 className="text-2xl sm:text-3xl font-extrabold text-center mb-2">{config.titulo}</h1>
            <p className="text-center text-sm sm:text-base opacity-90">{config.descricao}</p>

            {/* Barra de Progresso */}
            <div className="mt-6">
              <div className="w-full bg-black/10 rounded-full h-2">
                <div
                  className="bg-[#2D6A4F] h-2 rounded-full transition-all duration-500"
                  style={{ width: `${config.progresso}%` }}
                />
              </div>
            </div>
          </div>

          {/* Resumo da Transação */}
          <div className="bg-white rounded-xl border border-gray-200 p-6 mb-6">
            <h2 className="font-bold text-[#162113] mb-4">Resumo da transação</h2>

            <div className="space-y-4">
              <div className="flex justify-between items-center pb-3 border-b border-gray-200">
                <span className="text-gray-600">Quantidade</span>
                <span className="font-bold text-[#162113]">{payment.quantidade_creditos} créditos</span>
              </div>

              <div className="flex justify-between items-center pb-3 border-b border-gray-200">
                <span className="text-gray-600">Valor</span>
                <span className="font-bold text-[#162113]">R$ {payment.amount.toFixed(2)}</span>
              </div>

              <div className="flex justify-between items-center pb-3 border-b border-gray-200">
                <span className="text-gray-600">Forma de pagamento</span>
                <span className="font-bold text-[#162113]">
                  {metodoPagamentoIcon[payment.payment_method]} {payment.payment_method.toUpperCase()}
                </span>
              </div>

              <div className="flex justify-between items-center pb-3 border-b border-gray-200">
                <span className="text-gray-600">Data</span>
                <span className="font-bold text-[#162113] text-sm">{formatData(payment.created_at)}</span>
              </div>

              <div className="flex justify-between items-center">
                <span className="text-gray-600">Status</span>
                <span className={`px-3 py-1 rounded-full text-sm font-bold ${
                  payment.status === 'approved' ? 'bg-green-100 text-green-700' :
                  payment.status === 'pending' ? 'bg-amber-100 text-amber-700' :
                  payment.status === 'failed' ? 'bg-red-100 text-red-700' :
                  'bg-blue-100 text-blue-700'
                }`}>
                  {payment.status === 'approved' ? 'Confirmado' :
                   payment.status === 'pending' ? 'Aguardando' :
                   payment.status === 'failed' ? 'Recusado' :
                   'Reembolsado'}
                </span>
              </div>
            </div>
          </div>

          {/* PIX (se ainda pendente) */}
          {payment.status === 'pending' && payment.payment_method === 'pix' && payment.pix_qr_code && (
            <div className="bg-white rounded-xl border border-gray-200 p-6 mb-6 text-center">
              <h3 className="font-bold text-[#162113] mb-4">Escaneie o QR code</h3>
              <img
                src={`data:image/png;base64,${payment.pix_qr_code}`}
                alt="QR Code PIX"
                className="w-48 h-48 mx-auto mb-4 border border-gray-200 rounded-lg"
              />
              {payment.pix_copy_paste && (
                <button
                  onClick={copiarPix}
                  className={`w-full py-3 rounded-lg font-bold text-sm transition-colors mb-2 ${
                    pixCopiado
                      ? 'bg-green-100 text-green-700 border border-green-300'
                      : 'bg-[#162113] text-white hover:bg-[#1f5230]'
                  }`}>
                  {pixCopiado ? '✅ Código copiado!' : '📋 Copiar código PIX'}
                </button>
              )}
              <p className="text-xs text-gray-500">A página será atualizada automaticamente assim que o pagamento for confirmado</p>
            </div>
          )}

          {payment.status === 'pending' && payment.payment_method === 'boleto' && (
            <div className="bg-white rounded-xl border border-gray-200 p-6 mb-6 text-center">
              <div className="text-3xl mb-2">📄</div>
              <h3 className="font-bold text-[#162113] mb-3">Seu boleto está pronto</h3>

              {payment.boleto_line ? (
                <>
                  <p className="text-sm text-gray-500 mb-3">Copie a linha digitável e pague no seu banco:</p>
                  <div className="bg-gray-50 border border-gray-200 rounded-xl p-3 mb-4 text-xs text-gray-700 break-all font-mono text-left">
                    {payment.boleto_line}
                  </div>
                  <button onClick={copiarBoleto}
                    className={`w-full py-3 rounded-xl font-bold text-sm transition-colors mb-3 ${
                      boletoCopiado
                        ? 'bg-green-100 text-green-700 border border-green-300'
                        : 'bg-[#162113] text-white hover:bg-[#1f5230]'
                    }`}>
                    {boletoCopiado ? '✅ Linha copiada!' : '📋 Copiar linha digitável'}
                  </button>
                </>
              ) : null}

              {payment.boleto_url && (
                <a href={payment.boleto_url} target="_blank" rel="noopener noreferrer"
                  className={`text-xs text-[#2D6A4F] underline ${!payment.boleto_line ? 'block' : ''}`}>
                  {payment.boleto_line ? 'Ver boleto em PDF' : 'Abrir boleto PDF →'}
                </a>
              )}

              <p className="text-xs text-gray-500 mt-4">A página atualiza automaticamente após a compensação.</p>
            </div>
          )}

          {payment.status === 'pending' && payment.payment_method === 'cartao' && payment.invoice_url && (
            <div className="bg-white rounded-xl border border-gray-200 p-6 mb-6 text-center">
              <div className="text-3xl mb-2">💳</div>
              <h3 className="font-bold text-[#162113] mb-3">Continue o pagamento no Asaas</h3>
              <p className="text-sm text-gray-500 mb-5">
                Abra a página segura do Asaas para informar os dados do cartão.
              </p>
              <a
                href={payment.invoice_url}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-block rounded-xl bg-[#162113] px-5 py-3 text-sm font-bold text-white transition-colors hover:bg-[#1f5230]"
              >
                Abrir página de pagamento
              </a>
            </div>
          )}

          {/* Sucesso */}
          {payment.status === 'approved' && (
            <div className="bg-white rounded-xl border border-gray-200 p-6 mb-6 text-center">
              <h3 className="font-bold text-[#162113] mb-4">Créditos adicionados! 🎉</h3>
              <p className="text-sm text-gray-600 mb-6">
                {payment.quantidade_creditos} créditos já estão na sua carteira e prontos para usar.
              </p>
              <Link
                href="/dashboard"
                className="inline-block bg-[#2D6A4F] text-white font-bold py-3 px-6 rounded-lg hover:bg-[#1f5230] transition-colors">
                Ir para o dashboard →
              </Link>
            </div>
          )}

          {/* Botões de Ação */}
          <div className="flex gap-3 justify-center">
            <Link
              href="/assinar"
              className="text-sm font-bold text-[#2D6A4F] hover:text-[#1f5230] transition-colors">
              ← Voltar para comprar
            </Link>
            {payment.status === 'pending' && (
              <button
                onClick={() => window.location.reload()}
                className="text-sm font-bold text-gray-500 hover:text-gray-700 transition-colors">
                🔄 Atualizar
              </button>
            )}
          </div>
        </div>
      </main>
      
      </div>
  )
}
