'use client'

import Image from 'next/image'
import { useState, useEffect } from 'react'
import { useSearchParams, useRouter } from 'next/navigation'
import Link from 'next/link'
import AppTopbar from '@/components/AppTopbar'
import { buildLoginPath, supabase } from '@/lib/supabase'

type PaymentMethod = 'pix' | 'cartao'
type PaymentResult = {
  payment_id: string
  pix_qr_code?: string
  pix_copy_paste?: string
  invoice_url?: string
  valor?: number
  approved?: boolean
  plan_type?: 'pro_mensal' | 'pro_anual' | 'creditos'
}

const pacotes = [4, 6, 8, 10, 14, 20, 30]

export default function AssinarClient() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const tabParam = searchParams.get('tab')

  const [tipoCompra, setTipoCompra] = useState<'pro_mensal' | 'pro_anual' | 'downloads'>(
    tabParam === 'downloads' ? 'downloads' :
    tabParam === 'pro_anual' ? 'pro_anual' :
    'pro_mensal'
  )
  const [quantidade, setQuantidade] = useState(8)
  const [planType, setPlanType] = useState<'pro_mensal' | 'pro_anual' | 'creditos'>('creditos')
  const [creditos, setCreditos] = useState(0)
  const [carregando, setCarregando] = useState(true)
  const [session, setSession] = useState<any>(null)

  // Modal de pagamento
  const [modalAberto, setModalAberto] = useState(false)
  const [paymentMethod, setPaymentMethod] = useState<PaymentMethod>('pix')
  const [cpf, setCpf] = useState('')
  const [ddi, setDdi] = useState('+55')
  const [phone, setPhone] = useState('')
  const [processando, setProcessando] = useState(false)
  const [erro, setErro] = useState('')
  const [resultado, setResultado] = useState<PaymentResult | null>(null)
  const [pixCopiado, setPixCopiado] = useState(false)
  // Dados do cartão
  const [cardHolder, setCardHolder] = useState('')
  const [cardNumber, setCardNumber] = useState('')
  const [cardExpiry, setCardExpiry] = useState('')
  const [cardCvv, setCardCvv] = useState('')
  const [cardCep, setCardCep] = useState('')
  const [cardAddressNum, setCardAddressNum] = useState('')

  useEffect(() => {
    const verificarAuth = async () => {
      const { data: { session } } = await supabase.auth.getSession()
      if (!session) {
        router.replace(buildLoginPath('/assinar', 'Entre com sua conta Google para comprar créditos ou assinar o plano Pro.'))
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

  const formatPhone = (v: string, selectedDdi: string) => {
    const nums = v.replace(/\D/g, '').slice(0, selectedDdi === '+55' ? 11 : 15)
    if (selectedDdi === '+55') {
      // Format: (XX) XXXXX-XXXX or (XX) XXXX-XXXX
      if (nums.length <= 2) return nums
      if (nums.length <= 7) return `(${nums.slice(0, 2)}) ${nums.slice(2)}`
      if (nums.length <= 11) return `(${nums.slice(0, 2)}) ${nums.slice(2, nums.length - 4)}-${nums.slice(-4)}`
    }
    return nums
  }

  const formatCardNumber = (v: string) => {
    const nums = v.replace(/\D/g, '').slice(0, 16)
    return nums.replace(/(\d{4})(?=\d)/g, '$1 ').trim()
  }

  const formatExpiry = (v: string) => {
    const nums = v.replace(/\D/g, '').slice(0, 4)
    if (nums.length >= 3) return `${nums.slice(0, 2)}/${nums.slice(2)}`
    return nums
  }

  const formatCep = (v: string) => {
    const nums = v.replace(/\D/g, '').slice(0, 8)
    if (nums.length > 5) return `${nums.slice(0, 5)}-${nums.slice(5)}`
    return nums
  }

  const getPhoneForApi = () => {
    const nums = phone.replace(/\D/g, '')
    // Remove DDI prefix for Asaas (which handles BR numbers without +55)
    if (ddi === '+55') return nums
    return ddi.replace('+', '') + nums
  }

  const handlePagar = async () => {
    if (!cpf || cpf.replace(/\D/g, '').length < 11) {
      setErro('CPF inválido')
      return
    }
    const phoneNums = phone.replace(/\D/g, '')
    if (!phoneNums || (ddi === '+55' && phoneNums.length < 10) || phoneNums.length < 7) {
      setErro('Telefone inválido')
      return
    }
    if (paymentMethod === 'cartao') {
      if (!cardHolder.trim()) { setErro('Informe o nome como está no cartão'); return }
      if (cardNumber.replace(/\s/g, '').length < 15) { setErro('Número do cartão inválido'); return }
      if (cardExpiry.length < 5) { setErro('Validade inválida (MM/AA)'); return }
      if (cardCvv.length < 3) { setErro('CVV inválido'); return }
      if (cardCep.replace(/\D/g, '').length < 8) { setErro('CEP inválido'); return }
      if (!cardAddressNum.trim()) { setErro('Informe o número do endereço'); return }
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
          user_id: currentSession?.user.id,
          quantidade_creditos: quantidade,
          payment_method: paymentMethod,
          plan_type: planType,
          cpf,
          phone: getPhoneForApi(),
          ...(paymentMethod === 'cartao' ? {
            card_holder: cardHolder,
            card_number: cardNumber.replace(/\s/g, ''),
            card_expiry_month: cardExpiry.split('/')[0],
            card_expiry_year: `20${cardExpiry.split('/')[1] ?? ''}`,
            card_cvv: cardCvv,
            card_cep: cardCep.replace(/\D/g, ''),
            card_address_number: cardAddressNum,
          } : {}),
        }),
      })

      const data = await res.json()

      if (!res.ok || !data.success) {
        setErro(data.error || 'Erro ao processar pagamento')
        return
      }

      if (paymentMethod === 'cartao') {
        if (!data.approved) {
          setErro(data.error || 'Pagamento com cartão não foi aprovado')
          return
        }

        setResultado(data)
        return
      }

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

  const abrirModal = (qty: number, plan: 'pro_mensal' | 'pro_anual' | 'creditos' = 'creditos') => {
    setQuantidade(qty)
    setPlanType(plan)
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
    <div className="flex min-h-screen">
      <aside className="sticky top-0 hidden h-screen w-1/3 shrink-0 overflow-hidden lg:flex">
        <Image
          src="/foto-lp4.png"
          alt="Vista aérea de propriedade rural"
          fill
          className="object-cover object-center"
          priority
        />
        <div className="absolute inset-0 bg-[#162113]/70" />

        <div className="relative z-10 flex h-full w-full flex-col p-10">
          <Link href="/" className="inline-flex">
            <Image
              src="/logo-oficial-branco.png"
              width={360}
              height={96}
              alt="Talhão"
            />
          </Link>

          <div className="flex flex-1 items-center justify-center">
            <div className="w-full max-w-sm rounded-2xl border border-white/20 bg-white/10 p-8 backdrop-blur-md">
              <p className="text-xl font-semibold leading-relaxed text-white">
                &ldquo;Acesse dados de qualquer fazenda do Brasil em segundos —
                diretamente do satélite.&rdquo;
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

        <div className="mx-auto max-w-6xl px-6 py-8">
          {/* Abas */}
          <div className="flex gap-2 sm:gap-4 mb-6 sm:mb-8 border-b-2 border-gray-200">
            {[
              ['pro_mensal', '⭐ Pro Mensal'],
              ['pro_anual', '🏆 Pro Anual'],
              ['downloads', 'Créditos Avulsos'],
            ].map(([tab, label]) => (
              <button key={tab} onClick={() => setTipoCompra(tab as any)}
                className={`pb-3 px-3 sm:px-6 font-bold text-sm sm:text-lg transition-all border-b-2 whitespace-nowrap ${
                  tipoCompra === tab ? 'text-[#162113] border-[#162113]' : 'text-gray-400 border-transparent'
                }`}>
                {label}
              </button>
            ))}
          </div>

          {tipoCompra === 'pro_mensal' && (
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 lg:gap-8">
              <div className="space-y-6">
                <div>
                  <p className="text-xs font-bold text-gray-500 uppercase mb-2">Plano Pro Mensal</p>
                  <h1 className="text-3xl sm:text-4xl font-extrabold text-[#162113] mb-3">R$ 49,00<span className="text-lg font-normal text-gray-500">/mês</span></h1>
                  <p className="text-gray-600">14 créditos por mês · Cancele quando quiser</p>
                </div>
                <div className="bg-[#F0FDF4] border border-[#2D6A4F] rounded-xl p-5 space-y-3">
                  <h3 className="font-bold text-[#2D6A4F] mb-3">Incluso:</h3>
                  {['KML (CAR/SICAR)', 'SIGEF e Topografia', 'Todas as análises da Talhão', '14 créditos mensais', 'Suporte por email e WhatsApp', 'Sem compromisso anual'].map(f => (
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
                    <p className="text-xs text-gray-500">Renova manualmente</p>
                  </div>
                  <p className="text-2xl font-extrabold text-[#162113]">R$ 49,00</p>
                </div>
                <button onClick={() => abrirModal(14, 'pro_mensal')}
                  className="w-full rounded-xl bg-[#1f5230] px-5 py-3 text-base font-semibold text-white shadow-[0_12px_32px_rgba(31,82,48,0.22)] transition hover:-translate-y-[1px] hover:bg-[#2a6b3f]">
                  Assinar Pro Mensal →
                </button>
                <p className="text-xs text-gray-500 text-center">PIX · Cartão de Crédito</p>
              </div>
            </div>
          )}

          {tipoCompra === 'pro_anual' && (
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 lg:gap-8">
              <div className="space-y-6">
                <div>
                  <p className="text-xs font-bold text-gray-500 uppercase mb-2">Plano Pro Anual</p>
                  <div className="flex items-end gap-3 mb-1">
                    <h1 className="text-3xl sm:text-4xl font-extrabold text-[#162113]">R$ 468,00<span className="text-lg font-normal text-gray-500">/ano</span></h1>
                  </div>
                  <p className="text-gray-600">R$ 39,00/mês · <span className="text-[#2D6A4F] font-bold">Economize R$ 120 vs mensal</span></p>
                </div>
                <div className="inline-flex items-center gap-2 bg-amber-50 border border-amber-300 rounded-full px-4 py-1.5 text-sm text-amber-800 font-semibold">
                  🏆 Melhor custo-benefício
                </div>
                <div className="bg-[#F0FDF4] border border-[#2D6A4F] rounded-xl p-5 space-y-3">
                  <h3 className="font-bold text-[#2D6A4F] mb-3">Incluso:</h3>
                  {['KML (CAR/SICAR)', 'SIGEF e Topografia', 'Todas as análises da Talhão', '168 créditos (14/mês por 12 meses)', 'Suporte por email e WhatsApp', 'Acesso garantido por 12 meses'].map(f => (
                    <div key={f} className="flex gap-3 text-sm text-gray-700">
                      <span className="text-[#2D6A4F] font-bold">✓</span> {f}
                    </div>
                  ))}
                </div>
              </div>
              <div className="bg-white rounded-xl border-2 border-[#2D6A4F] p-5 lg:h-fit lg:sticky lg:top-8 space-y-5 relative overflow-hidden">
                <div className="absolute top-0 right-0 bg-[#2D6A4F] text-white text-xs font-bold px-3 py-1 rounded-bl-xl">
                  Recomendado
                </div>
                <div className="flex justify-between items-end">
                  <div>
                    <p className="text-sm text-gray-600">Plano Pro (12 meses)</p>
                    <p className="text-xs text-[#2D6A4F] font-semibold">Equivale a R$ 39/mês</p>
                  </div>
                  <div className="text-right">
                    <p className="text-2xl font-extrabold text-[#162113]">R$ 468,00</p>
                    <p className="text-xs text-gray-400 line-through">R$ 588,00</p>
                  </div>
                </div>
                <button onClick={() => abrirModal(168, 'pro_anual')}
                  className="w-full rounded-xl bg-[#1f5230] px-5 py-3 text-base font-semibold text-white shadow-[0_12px_32px_rgba(31,82,48,0.22)] transition hover:-translate-y-[1px] hover:bg-[#2a6b3f]">
                  Assinar Pro Anual →
                </button>
                <p className="text-xs text-gray-500 text-center">PIX · Cartão de Crédito</p>
              </div>
            </div>
          )}

          {tipoCompra === 'downloads' && (
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 lg:gap-8">
              <div className="space-y-6">
              <div>
                <p className="text-xs font-bold text-gray-500 uppercase mb-2">Créditos Avulsos</p>
                <h1 className="text-3xl sm:text-4xl font-extrabold text-[#162113] mb-1">R$ 3,50 por crédito</h1>
                <p className="text-gray-600">Pague só quando precisar</p>
              </div>
                <div className="space-y-3">
                  <p className="text-sm font-bold text-gray-700">Escolha a quantidade:</p>
                  <div className="grid grid-cols-3 sm:grid-cols-4 gap-2">
                    {pacotes.map(qty => (
                    <button key={qty} onClick={() => setQuantidade(qty)}
                      className={`p-3 rounded-lg border-2 transition-all text-center ${
                        quantidade === qty
                          ? 'border-[#2D6A4F] bg-[#F0FDF4] text-[#162113]'
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
                  <p className="text-2xl font-extrabold text-[#162113]">R$ {totalDownloads.toFixed(2)}</p>
                </div>
                <button
                  onClick={() => abrirModal(quantidade, 'creditos')}
                  className="w-full rounded-xl bg-[#1f5230] px-5 py-3 text-base font-semibold text-white shadow-[0_12px_32px_rgba(31,82,48,0.22)] transition hover:-translate-y-[1px] hover:bg-[#2a6b3f] hover:shadow-[0_18px_42px_rgba(31,82,48,0.28)]">
                  Comprar {quantidade} créditos →
                </button>
                <p className="text-xs text-gray-500 text-center">PIX · Cartão de Crédito</p>
              </div>
            </div>
          )}
        </div>
      </main>

      {/* ── MODAL DE PAGAMENTO ── */}
      {modalAberto && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-md w-full p-6 relative max-h-[90vh] overflow-y-auto">

            <button onClick={() => { setModalAberto(false); setResultado(null) }}
              className="absolute top-4 right-4 text-gray-400 hover:text-gray-600 text-xl font-bold">✕</button>

            {!resultado ? (
              <>
            <h2 className="text-xl font-extrabold text-[#162113] mb-1">Finalizar pagamento</h2>
                <p className="text-sm text-gray-500 mb-5">
                  {planType === 'pro_anual'
                    ? <>Plano Pro Anual · <strong>R$ 468,00</strong></>
                    : planType === 'pro_mensal'
                    ? <>Plano Pro Mensal · <strong>R$ 49,00</strong></>
                    : <>{quantidade} créditos · <strong>R$ {(quantidade * 3.5).toFixed(2)}</strong></>
                  }
                </p>

                {/* CPF */}
                <div className="mb-4">
                  <label className="form-label">CPF</label>
                  <input
                    type="text"
                    placeholder="000.000.000-00"
                    value={cpf}
                    onChange={e => setCpf(formatCpf(e.target.value))}
                    className="form-input rounded-xl"
                  />
                </div>

                {/* Telefone */}
                <div className="mb-5">
                  <label className="form-label">Celular</label>
                  <div className="flex gap-2">
                    <select
                      value={ddi}
                      onChange={e => { setDdi(e.target.value); setPhone('') }}
                      className="form-input w-24 shrink-0 rounded-xl bg-white"
                    >
                      <option value="+55">🇧🇷 +55</option>
                      <option value="+1">🇺🇸 +1</option>
                      <option value="+54">🇦🇷 +54</option>
                      <option value="+595">🇵🇾 +595</option>
                      <option value="+598">🇺🇾 +598</option>
                      <option value="+56">🇨🇱 +56</option>
                      <option value="+51">🇵🇪 +51</option>
                      <option value="+34">🇪🇸 +34</option>
                      <option value="+351">🇵🇹 +351</option>
                    </select>
                    <input
                      type="tel"
                      placeholder={ddi === '+55' ? '(11) 99999-9999' : 'Número com DDD'}
                      value={phone}
                      onChange={e => setPhone(formatPhone(e.target.value, ddi))}
                      className="form-input flex-1 rounded-xl"
                    />
                  </div>
                </div>

                {/* Método */}
                <div className="mb-5">
                  <label className="form-label">Forma de pagamento</label>
                <div className="grid grid-cols-2 gap-2">
                  {[
                    { id: 'pix', label: 'PIX', icon: '⚡', desc: 'Instantâneo' },
                    { id: 'cartao', label: 'Cartão', icon: '💳', desc: 'Crédito' },
                    ].map(m => (
                      <button key={m.id} onClick={() => setPaymentMethod(m.id as PaymentMethod)}
                        className={`p-3 rounded-xl border-2 transition-all text-center ${
                          paymentMethod === m.id ? 'border-[#2D6A4F] bg-[#F0FDF4]' : 'border-gray-200 hover:border-gray-300'
                        }`}>
                        <div className="text-xl mb-1">{m.icon}</div>
                        <div className="font-bold text-xs text-[#162113]">{m.label}</div>
                        <div className="text-xs text-gray-400">{m.desc}</div>
                      </button>
                    ))}
                  </div>
                </div>

                {paymentMethod === 'cartao' && (
                  <div className="mt-4 space-y-3">
                    <p className="text-xs font-bold text-gray-500 uppercase">Dados do cartão</p>

                    <div>
                      <label className="form-label">Nome no cartão</label>
                      <input type="text" placeholder="Como está impresso no cartão"
                        value={cardHolder}
                        onChange={e => setCardHolder(e.target.value.toUpperCase())}
                        className="form-input rounded-xl" />
                    </div>

                    <div>
                      <label className="form-label">Número do cartão</label>
                      <input type="text" placeholder="0000 0000 0000 0000"
                        value={cardNumber}
                        onChange={e => setCardNumber(formatCardNumber(e.target.value))}
                        className="form-input rounded-xl font-mono tracking-widest" />
                    </div>

                    <div className="grid grid-cols-2 gap-3">
                      <div>
                        <label className="form-label">Validade</label>
                        <input type="text" placeholder="MM/AA"
                          value={cardExpiry}
                          onChange={e => setCardExpiry(formatExpiry(e.target.value))}
                          className="form-input rounded-xl" />
                      </div>
                      <div>
                        <label className="form-label">CVV</label>
                        <input type="text" placeholder="000"
                          value={cardCvv}
                          onChange={e => setCardCvv(e.target.value.replace(/\D/g, '').slice(0, 4))}
                          className="form-input rounded-xl" />
                      </div>
                    </div>

                    <div className="grid grid-cols-2 gap-3">
                      <div>
                        <label className="form-label">CEP do titular</label>
                        <input type="text" placeholder="00000-000"
                          value={cardCep}
                          onChange={e => setCardCep(formatCep(e.target.value))}
                          className="form-input rounded-xl" />
                      </div>
                      <div>
                        <label className="form-label">Número</label>
                        <input type="text" placeholder="Ex: 123"
                          value={cardAddressNum}
                          onChange={e => setCardAddressNum(e.target.value)}
                          className="form-input rounded-xl" />
                      </div>
                    </div>
                  </div>
                )}

                {erro && (
                  <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg text-sm mb-4">
                    {erro}
                  </div>
                )}

                <button onClick={handlePagar} disabled={processando}
                  className="w-full rounded-xl bg-[#1f5230] px-5 py-3 text-base font-semibold text-white shadow-[0_12px_32px_rgba(31,82,48,0.22)] transition hover:-translate-y-[1px] hover:bg-[#2a6b3f] hover:shadow-[0_18px_42px_rgba(31,82,48,0.28)] disabled:opacity-50">
                  {processando ? 'Processando...' :
                    planType === 'pro_anual' ? 'Pagar R$ 468,00' :
                    planType === 'pro_mensal' ? 'Pagar R$ 49,00' :
                    `Pagar R$ ${(quantidade * 3.5).toFixed(2)}`
                  }
                </button>

                <p className="text-xs text-gray-400 text-center mt-3">Pagamento seguro via Asaas</p>
              </>
            ) : (
              <>
                {/* ── RESULTADO PIX ── */}
                {paymentMethod === 'pix' && resultado.pix_qr_code && (
                  <div className="text-center">
                    <div className="text-3xl mb-2">⚡</div>
                    <h2 className="text-lg font-extrabold text-[#162113] mb-1">Pague com PIX</h2>
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
                          : 'bg-[#162113] text-white hover:bg-[#2d2d50]'
                      }`}>
                      {pixCopiado ? '✅ Código copiado!' : '📋 Copiar código PIX'}
                    </button>
                    <p className="text-xs text-gray-400">Os créditos serão adicionados automaticamente após a confirmação.</p>
                  </div>
                )}

                {/* ── RESULTADO CARTÃO ── */}
                {paymentMethod === 'cartao' && (
                  <div className="text-center">
                    <div className="text-3xl mb-2">✅</div>
                    <h2 className="text-lg font-extrabold text-[#162113] mb-1">Pagamento realizado!</h2>
                    <p className="text-sm text-gray-500 mb-4">
                      Seu cartão foi cobrado com sucesso. Os créditos já estão na sua carteira.
                    </p>
                    <p className="text-xs text-gray-400">Você receberá a confirmação por e-mail.</p>
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
