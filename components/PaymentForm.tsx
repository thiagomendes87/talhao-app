'use client'

import { useState } from 'react'
import { supabase } from '@/lib/supabase'

interface PaymentFormProps {
  tipoCompra: 'pro' | 'downloads'
  quantidade: number
  amount: number
  onPaymentSuccess?: (paymentId: string) => void
  onClose?: () => void
}

export default function PaymentForm({
  tipoCompra,
  quantidade,
  amount,
  onPaymentSuccess,
  onClose,
}: PaymentFormProps) {
  const [paymentMethod, setPaymentMethod] = useState<'pix' | 'card'>('pix')
  const [loading, setLoading] = useState(false)
  const [paymentStatus, setPaymentStatus] = useState<'idle' | 'pending' | 'success' | 'error'>('idle')
  const [paymentData, setPaymentData] = useState<any>(null)
  const [errorMsg, setErrorMsg] = useState('')

  const handlePayment = async () => {
    setLoading(true)
    setPaymentStatus('pending')
    setErrorMsg('')

    try {
      // 1. Obter token de autenticação
      const { data: { session } } = await supabase.auth.getSession()
      if (!session) {
        setErrorMsg('Você precisa estar autenticado')
        setPaymentStatus('error')
        setLoading(false)
        return
      }

      // 2. Chamar endpoint de pagamento
      const response = await fetch('/api/payments/create', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${session.access_token}`,
        },
        body: JSON.stringify({
          type: tipoCompra === 'pro' ? 'pro_subscription' : 'credits_purchase',
          amount: amount,
          payment_method: paymentMethod,
          quantidade_creditos: tipoCompra === 'downloads' ? quantidade : undefined,
          descricao: tipoCompra === 'pro' ? 'Assinatura Pro - 1 mês' : `${quantidade} créditos`,
        }),
      })

      const data = await response.json()

      if (!response.ok) {
        setErrorMsg(data.error || 'Erro ao iniciar pagamento')
        setPaymentStatus('error')
        setLoading(false)
        return
      }

      // 3. Armazenar dados do pagamento
      setPaymentData(data.payment)

      // 4. Se for PIX, mostrar QR Code
      if (paymentMethod === 'pix' && data.payment?.pix_qr_code) {
        setPaymentStatus('success')
        onPaymentSuccess?.(data.payment.id)
      } else {
        // Se for cartão, em breve será redirecionado para o Asaas
        setPaymentStatus('success')
      }
    } catch (error) {
      console.error('Erro:', error)
      setErrorMsg('Erro ao processar pagamento')
      setPaymentStatus('error')
    } finally {
      setLoading(false)
    }
  }

  // Mostrar tela de sucesso com QR Code
  if (paymentStatus === 'success' && paymentData?.pix_qr_code) {
    return (
      <div className="space-y-6">
        <div className="bg-[#F0FDF4] border border-[#2D6A4F] rounded-2xl p-6 text-center">
          <h3 className="text-lg font-bold text-[#1A1A2E] mb-2">Escaneie o QR Code</h3>
          <p className="text-sm text-gray-600 mb-4">Use seu app bancário para escanear e confirmar o pagamento</p>

          {/* QR Code Image */}
          <div className="bg-white rounded-lg p-4 mb-4 inline-block border border-gray-200">
            <img
              src={`data:image/png;base64,${paymentData.pix_qr_code}`}
              alt="QR Code PIX"
              className="w-48 h-48"
            />
          </div>

          <div className="bg-white rounded-lg p-3 mb-4">
            <p className="text-xs text-gray-500 mb-1">Ou copie e cole:</p>
            <div className="flex items-center gap-2">
              <input
                type="text"
                value={paymentData.pix_copy_paste || ''}
                readOnly
                className="flex-1 bg-gray-50 px-3 py-2 rounded text-xs font-mono text-gray-700 truncate"
              />
              <button
                onClick={() => {
                  navigator.clipboard.writeText(paymentData.pix_copy_paste || '')
                  alert('Copiado!')
                }}
                className="bg-[#2D6A4F] hover:bg-[#1A5C3A] text-white px-3 py-2 rounded text-xs font-bold"
              >
                Copiar
              </button>
            </div>
          </div>

          <p className="text-xs text-gray-500">Prazo: 24 horas</p>
          <p className="text-sm font-semibold text-[#2D6A4F] mt-3">
            R$ {amount.toFixed(2)}
          </p>
        </div>

        <button
          onClick={onClose}
          className="w-full bg-gray-200 hover:bg-gray-300 text-gray-800 font-bold px-4 py-2 rounded-lg transition-colors"
        >
          Fechar
        </button>
      </div>
    )
  }

  return (
    <div className="space-y-4">
      {/* Seleção de método */}
      <div>
        <label className="text-sm font-bold text-gray-700 block mb-2">Método de pagamento</label>
        <div className="grid grid-cols-2 gap-2">
          <button
            onClick={() => setPaymentMethod('pix')}
            className={`p-3 rounded-lg border-2 transition-all ${
              paymentMethod === 'pix'
                ? 'border-[#2D6A4F] bg-[#F0FDF4]'
                : 'border-gray-200 bg-white hover:border-gray-300'
            }`}
          >
            <p className="text-lg font-bold">🔷</p>
            <p className="text-xs font-semibold text-gray-700">PIX</p>
            <p className="text-xs text-gray-500">Instantâneo</p>
          </button>
          <button
            onClick={() => setPaymentMethod('card')}
            className={`p-3 rounded-lg border-2 transition-all ${
              paymentMethod === 'card'
                ? 'border-[#2D6A4F] bg-[#F0FDF4]'
                : 'border-gray-200 bg-white hover:border-gray-300'
            }`}
          >
            <p className="text-lg font-bold">💳</p>
            <p className="text-xs font-semibold text-gray-700">Cartão</p>
            <p className="text-xs text-gray-500">Parcelado</p>
          </button>
        </div>
      </div>

      {/* Resumo do pedido */}
      <div className="bg-gray-50 rounded-lg p-4">
        <div className="flex justify-between items-center mb-2">
          <span className="text-sm text-gray-600">
            {tipoCompra === 'pro'
              ? 'Assinatura Pro (1 mês)'
              : `${quantidade} créditos`}
          </span>
          <span className="font-bold text-[#1A1A2E]">R$ {amount.toFixed(2)}</span>
        </div>
        {tipoCompra === 'downloads' && (
          <div className="flex justify-between items-center text-xs text-gray-500 border-t pt-2">
            <span>R$ 3,50 por download</span>
            <span>Total: {quantidade} downloads</span>
          </div>
        )}
      </div>

      {/* Erro */}
      {paymentStatus === 'error' && (
        <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg text-sm">
          {errorMsg}
        </div>
      )}

      {/* Botão de pagar */}
      <button
        onClick={handlePayment}
        disabled={loading}
        className="w-full bg-[#2D6A4F] hover:bg-[#1A5C3A] disabled:opacity-50 disabled:cursor-not-allowed text-white font-bold px-4 py-3 rounded-lg transition-colors flex items-center justify-center gap-2"
      >
        {loading && <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />}
        {loading ? 'Processando...' : `Pagar com ${paymentMethod === 'pix' ? 'PIX' : 'Cartão'}`}
      </button>

      <p className="text-xs text-gray-500 text-center">
        Seus dados estão seguros. Processado com Asaas.
      </p>
    </div>
  )
}
