'use client'

import { useEffect, useState } from 'react'
import { useParams, useRouter } from 'next/navigation'
import Link from 'next/link'
import { buildLoginPath, supabase } from '@/lib/supabase'

type Payment = {
  id: string
  status: 'pending' | 'approved' | 'failed' | 'refunded'
  amount: number
  quantidade_creditos: number
  payment_method: 'pix' | 'boleto' | 'cartao'
  pix_qr_code?: string
  pix_copy_paste?: string
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
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center">
          <div className="w-12 h-12 border-4 border-[#2D6A4F] border-t-transparent rounded-full animate-spin mx-auto mb-4" />
          <p className="text-gray-500">Carregando...</p>
        </div>
      </div>
    )
  }

  if (erro || !payment) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50 p-4">
        <div className="bg-white rounded-2xl p-8 max-w-md text-center">
          <div className="text-4xl mb-4">❌</div>
          <h1 className="text-xl font-bold text-[#1A1A2E] mb-2">Erro</h1>
          <p className="text-gray-600 mb-6">{erro}</p>
          <Link href="/assinar" className="inline-block bg-[#2D6A4F] text-white font-bold py-2 px-6 rounded-lg hover:bg-[#1A5C3A] transition-colors">
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

  const formatData = (dateString: string) => {
    return new Date(dateString).toLocaleString('pt-BR')
  }

  const metodoPagamentoIcon = {
    pix: '⚡',
    boleto: '📄',
    cartao: '💳',
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Navbar */}
      <nav className="bg-white border-b border-gray-200 px-4 sm:px-10 py-4">
        <Link href="/" className="flex items-center gap-2 w-fit">
          <div className="w-7 h-7 bg-[#2D6A4F] rounded-md flex items-center justify-center">🌿</div>
          <span className="font-extrabold text-[#1A1A2E] text-lg">Talhão</span>
        </Link>
      </nav>

      <div className="max-w-2xl mx-auto py-8 sm:py-12 px-4 sm:px-8">

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
          <h2 className="font-bold text-[#1A1A2E] mb-4">Resumo da transação</h2>

          <div className="space-y-4">
            <div className="flex justify-between items-center pb-3 border-b border-gray-200">
              <span className="text-gray-600">Quantidade</span>
              <span className="font-bold text-[#1A1A2E]">{payment.quantidade_creditos} créditos</span>
            </div>

            <div className="flex justify-between items-center pb-3 border-b border-gray-200">
              <span className="text-gray-600">Valor</span>
              <span className="font-bold text-[#1A1A2E]">R$ {payment.amount.toFixed(2)}</span>
            </div>

            <div className="flex justify-between items-center pb-3 border-b border-gray-200">
              <span className="text-gray-600">Forma de pagamento</span>
              <span className="font-bold text-[#1A1A2E]">
                {metodoPagamentoIcon[payment.payment_method]} {payment.payment_method.toUpperCase()}
              </span>
            </div>

            <div className="flex justify-between items-center pb-3 border-b border-gray-200">
              <span className="text-gray-600">Data</span>
              <span className="font-bold text-[#1A1A2E] text-sm">{formatData(payment.created_at)}</span>
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
            <h3 className="font-bold text-[#1A1A2E] mb-4">Escaneie o QR code</h3>
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
                    : 'bg-[#1A1A2E] text-white hover:bg-[#2d2d50]'
                }`}>
                {pixCopiado ? '✅ Código copiado!' : '📋 Copiar código PIX'}
              </button>
            )}
            <p className="text-xs text-gray-500">A página será atualizada automaticamente assim que o pagamento for confirmado</p>
          </div>
        )}

        {payment.status === 'pending' && payment.payment_method === 'boleto' && payment.boleto_url && (
          <div className="bg-white rounded-xl border border-gray-200 p-6 mb-6 text-center">
            <div className="text-3xl mb-2">📄</div>
            <h3 className="font-bold text-[#1A1A2E] mb-3">Seu boleto está pronto</h3>
            <p className="text-sm text-gray-500 mb-5">
              Abra o boleto em uma nova aba para concluir o pagamento.
            </p>
            <a
              href={payment.boleto_url}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-block rounded-xl bg-[#1A1A2E] px-5 py-3 text-sm font-bold text-white transition-colors hover:bg-[#2d2d50]"
            >
              Abrir boleto
            </a>
          </div>
        )}

        {payment.status === 'pending' && payment.payment_method === 'cartao' && payment.invoice_url && (
          <div className="bg-white rounded-xl border border-gray-200 p-6 mb-6 text-center">
            <div className="text-3xl mb-2">💳</div>
            <h3 className="font-bold text-[#1A1A2E] mb-3">Continue o pagamento no Asaas</h3>
            <p className="text-sm text-gray-500 mb-5">
              Abra a página segura do Asaas para informar os dados do cartão.
            </p>
            <a
              href={payment.invoice_url}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-block rounded-xl bg-[#1A1A2E] px-5 py-3 text-sm font-bold text-white transition-colors hover:bg-[#2d2d50]"
            >
              Abrir página de pagamento
            </a>
          </div>
        )}

        {/* Sucesso */}
        {payment.status === 'approved' && (
          <div className="bg-white rounded-xl border border-gray-200 p-6 mb-6 text-center">
            <h3 className="font-bold text-[#1A1A2E] mb-4">Créditos adicionados! 🎉</h3>
            <p className="text-sm text-gray-600 mb-6">
              {payment.quantidade_creditos} créditos já estão na sua carteira e prontos para usar.
            </p>
            <Link
              href="/dashboard"
              className="inline-block bg-[#2D6A4F] text-white font-bold py-3 px-6 rounded-lg hover:bg-[#1A5C3A] transition-colors">
              Ir para o dashboard →
            </Link>
          </div>
        )}

        {/* Botões de Ação */}
        <div className="flex gap-3 justify-center">
          <Link
            href="/assinar"
            className="text-sm font-bold text-[#2D6A4F] hover:text-[#1A5C3A] transition-colors">
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
    </div>
  )
}
