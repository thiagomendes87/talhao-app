import Link from 'next/link'

const beneficios = [
  'Downloads ilimitados de qualquer arquivo',
  'KML (CAR/SICAR), SIGEF, SNCR',
  'Topografia, Declividade e Altitude',
  'Busca por CPF, CNPJ e matrícula',
  'Suporte prioritário por email',
]

const comparativo = [
  { label: '10 downloads (créditos avulsos)', valor: 'R$ 35,00', destaque: false, positivo: false },
  { label: '14 downloads (créditos avulsos)', valor: 'R$ 49,00 ← break-even', destaque: false, positivo: false },
  { label: '20 downloads (Plano Pro)', valor: 'R$ 49,00 ✓ mais barato', destaque: true, positivo: true },
  { label: 'Ilimitado (Plano Pro)', valor: 'R$ 49,00 ✓ sem limite', destaque: true, positivo: true },
]

export default function AssinarPage() {
  return (
    <div className="min-h-screen bg-gray-50">
      <nav className="bg-white border-b border-gray-200 px-10 py-4 flex items-center justify-between">
        <Link href="/" className="flex items-center gap-2">
          <div className="w-7 h-7 bg-[#2D6A4F] rounded-md flex items-center justify-center text-sm">🌿</div>
          <span className="font-extrabold text-[#1A1A2E]">Talhão</span>
        </Link>
        <span className="text-sm font-medium text-gray-600">🌿 Assinar Plano Pro</span>
        <div className="bg-[#D8F3DC] text-[#2D6A4F] text-xs font-bold px-3 py-1.5 rounded-lg">
          Saldo: R$ 21,00 · 6 créditos
        </div>
      </nav>

      <div className="max-w-5xl mx-auto py-10 px-8 grid grid-cols-5 gap-8">
        {/* Esquerda */}
        <div className="col-span-3 space-y-6">
          <div>
            <p className="text-xs font-bold tracking-widest text-gray-400 uppercase mb-1">Plano Pro — Mensal</p>
            <h1 className="text-2xl font-extrabold text-[#1A1A2E]">Downloads ilimitados por R$49/mês</h1>
          </div>

          {/* Comparativo */}
          <div className="bg-[#F0FDF4] border border-[#BBF7D0] rounded-xl p-5">
            <p className="text-sm font-bold text-green-800 mb-3">📊 Compare: Créditos vs Pro</p>
            <div className="space-y-2">
              {comparativo.map(c => (
                <div key={c.label} className={`flex justify-between text-xs px-3 py-2.5 rounded-lg ${c.destaque ? 'bg-[#D8F3DC] border border-[#86EFAC]' : 'bg-white'}`}>
                  <span className={c.destaque ? 'font-bold text-gray-800' : 'text-gray-600'}>{c.label}</span>
                  <span className={`font-bold ${c.positivo ? 'text-[#2D6A4F]' : c.label.includes('break') ? 'text-amber-600' : 'text-red-500'}`}>{c.valor}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Tabs */}
          <div>
            <div className="flex border-2 border-gray-200 rounded-xl overflow-hidden mb-5">
              <button className="flex-1 py-3 text-sm font-semibold bg-[#1A1A2E] text-white">🟢 PIX</button>
              <button className="flex-1 py-3 text-sm font-semibold text-gray-600 bg-white">💳 Cartão de crédito</button>
            </div>

            {/* Dados NF */}
            <div className="bg-gray-50 rounded-xl p-5 space-y-3 mb-5">
              <p className="text-sm font-bold text-[#1A1A2E]">Dados para nota fiscal mensal</p>
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

            {/* QR Code */}
            <div className="bg-gray-50 rounded-xl p-6 text-center mb-5">
              <p className="text-sm font-semibold text-[#1A1A2E] mb-1">Escaneie o QR Code</p>
              <p className="text-xs text-gray-500 mb-4">R$ 49,00 · Plano Pro ativado automaticamente após confirmação</p>
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
                <span className="flex-1 truncate">00020126580014BR.GOV.BCB.PIX0136talhao-ai...</span>
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
              <div className="border-t border-gray-100 pt-4 space-y-3">
                <p className="text-xs font-bold text-gray-400 uppercase tracking-widest">Dados para nota fiscal</p>
                <div>
                  <label className="form-label">CPF ou CNPJ</label>
                  <input className="form-input" placeholder="000.000.000-00" />
                </div>
                <div>
                  <label className="form-label">Nome completo / Razão social</label>
                  <input className="form-input" placeholder="João da Silva" />
                </div>
              </div>
              <div className="bg-amber-50 border border-amber-200 rounded-lg p-3 text-xs text-amber-800">
                🔄 <strong>Assinatura recorrente:</strong> seu cartão será cobrado automaticamente R$ 49,00 todo mês. Cancele quando quiser.
              </div>
              <button className="btn-primary w-full py-3 rounded-xl text-base font-bold">
                Assinar Pro — R$ 49/mês →
              </button>
              <p className="text-center text-xs text-gray-400">Visa · Mastercard · Elo · Hipercard</p>
            </div>
          </div>

          <div className="flex items-center gap-2 bg-gray-50 border border-gray-200 rounded-xl p-3 text-xs text-gray-500">
            🔒 Assinatura gerenciada via <strong className="text-[#1A1A2E] mx-1">Stripe</strong>. Cancele quando quiser no painel.
          </div>
        </div>

        {/* Direita */}
        <div className="col-span-2 space-y-5">
          <h2 className="text-sm font-bold text-[#1A1A2E]">Plano Pro — o que você ganha</h2>
          <div className="bg-white rounded-xl p-5 border border-gray-200">
            <div className="flex justify-between items-start mb-4">
              <div>
                <p className="font-bold text-[#1A1A2E]">🌿 Plano Pro</p>
                <p className="text-xs text-gray-500">Mensal · cancele quando quiser</p>
              </div>
              <div className="text-right">
                <span className="text-2xl font-extrabold text-[#1A1A2E]">R$49</span>
                <span className="text-xs text-gray-500 block">/mês</span>
              </div>
            </div>
            <div className="space-y-2">
              {beneficios.map(b => (
                <div key={b} className="flex items-start gap-2 text-sm text-gray-700">
                  <span className="text-[#2D6A4F] font-bold mt-0.5">✓</span>{b}
                </div>
              ))}
            </div>
          </div>

          <div className="space-y-2 text-sm text-gray-600">
            <div className="flex justify-between"><span>Valor mensal</span><span>R$ 49,00</span></div>
            <div className="flex justify-between font-extrabold text-[#1A1A2E] text-base pt-3 border-t border-gray-200">
              <span>Total hoje</span><span>R$ 49,00</span>
            </div>
          </div>

          <div className="text-xs text-gray-500 space-y-1.5 pt-3 border-t border-gray-200">
            {['Cancele a qualquer momento, sem multa', 'Renova automaticamente todo mês', 'Nota fiscal emitida automaticamente', 'Seus créditos avulsos continuam válidos'].map(i => (
              <div key={i} className="flex items-center gap-2"><span className="text-[#2D6A4F]">✓</span>{i}</div>
            ))}
          </div>

          <div className="bg-amber-50 rounded-xl p-4 border border-amber-200 text-xs text-amber-800">
            <strong className="block mb-1">💡 Seus créditos não somem</strong>
            Ao assinar o Pro, seus créditos avulsos continuam válidos para uso quando o Pro for cancelado.
          </div>
        </div>
      </div>
    </div>
  )
}
