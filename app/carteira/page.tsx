import Link from 'next/link'

const pacotes = [14, 17.5, 21, 24.5, 35]

export default function CarteiraPage() {
  return (
    <div className="min-h-screen bg-gray-50">
      {/* Nav */}
      <nav className="bg-white border-b border-gray-200 px-10 py-4 flex items-center justify-between">
        <Link href="/" className="flex items-center gap-2">
          <div className="w-7 h-7 bg-[#2D6A4F] rounded-md flex items-center justify-center text-white text-sm">🌿</div>
          <span className="font-extrabold text-[#1A1A2E]">Talhão</span>
        </Link>
        <span className="text-sm font-medium text-gray-600">💳 Recarregar carteira</span>
        <div className="bg-[#D8F3DC] text-[#2D6A4F] text-xs font-bold px-3 py-1.5 rounded-lg">
          Saldo atual: R$ 0,00 · 0 créditos
        </div>
      </nav>

      <div className="max-w-5xl mx-auto py-10 px-8 grid grid-cols-5 gap-8">
        {/* Esquerda — formulário */}
        <div className="col-span-3 space-y-6">
          <div>
            <p className="text-xs font-bold tracking-widest text-gray-400 uppercase mb-1">Escolha o valor</p>
            <h1 className="text-2xl font-extrabold text-[#1A1A2E]">Quantos créditos quer adicionar?</h1>
          </div>

          {/* Seletor de pacotes */}
          <div className="grid grid-cols-3 gap-3">
            {pacotes.map((v, i) => (
              <div key={v} className={`border-2 rounded-xl p-4 text-center cursor-pointer transition-all ${i === 1 ? 'border-[#1A1A2E] bg-indigo-50' : 'border-gray-200 hover:border-gray-300 bg-white'}`}>
                {i === 1 && (
                  <div className="text-[10px] font-bold text-white bg-[#1A1A2E] rounded-full px-2 py-0.5 mb-2 inline-block tracking-wide uppercase">Selecionado</div>
                )}
                <div className="text-2xl font-extrabold text-[#1A1A2E]">R${v.toFixed(2).replace('.', ',')}</div>
                <div className="text-xs text-gray-500 mt-1">{Math.round(v / 3.5)} downloads</div>
              </div>
            ))}
            <div className="border-2 border-dashed border-indigo-200 rounded-xl p-4 text-center cursor-pointer bg-indigo-50/50">
              <div className="text-sm font-bold text-gray-500">Outro valor</div>
              <div className="text-xs text-gray-400 mt-1">múltiplos de R$3,50</div>
            </div>
          </div>

          {/* Aviso Pro */}
          <div className="bg-amber-50 border border-amber-200 rounded-xl p-4 text-sm text-amber-800">
            💡 <strong>Dica:</strong> Com mais de 14 downloads/mês, o{' '}
            <Link href="/assinar" className="text-[#2D6A4F] font-bold">Plano Pro (R$49/mês)</Link> é mais econômico.
          </div>

          {/* Tabs pagamento */}
          <div>
            <p className="text-sm font-bold text-[#1A1A2E] mb-3">Forma de pagamento</p>
            <div className="flex border-2 border-gray-200 rounded-xl overflow-hidden mb-5">
              <button className="flex-1 py-3 text-sm font-semibold bg-[#1A1A2E] text-white">🟢 PIX (instantâneo)</button>
              <button className="flex-1 py-3 text-sm font-semibold text-gray-600 bg-white">💳 Cartão de crédito</button>
            </div>

            {/* Dados NF */}
            <div className="bg-gray-50 rounded-xl p-5 space-y-3 mb-5">
              <p className="text-sm font-bold text-[#1A1A2E]">Dados para nota fiscal</p>
              <div>
                <label className="form-label">CPF ou CNPJ</label>
                <input className="form-input" placeholder="000.000.000-00" />
                <p className="text-xs text-gray-400 mt-1">Usado apenas para emissão da nota fiscal</p>
              </div>
              <div>
                <label className="form-label">Nome completo / Razão social</label>
                <input className="form-input" placeholder="João da Silva" />
              </div>
            </div>

            {/* QR Code */}
            <div className="bg-gray-50 rounded-xl p-6 text-center">
              <p className="text-sm font-semibold text-[#1A1A2E] mb-1">Escaneie o QR Code</p>
              <p className="text-xs text-gray-500 mb-4">R$ 17,50 · 5 créditos adicionados automaticamente após confirmação</p>
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
                  <rect x="55" y="67" width="16" height="8" fill="#1A1A2E"/>
                  <rect x="79" y="67" width="8" height="8" fill="#1A1A2E"/>
                </svg>
              </div>
              <div className="flex items-center gap-2 bg-white border border-gray-200 rounded-lg px-3 py-2.5 text-xs font-mono text-gray-600 mb-3">
                <span className="flex-1 truncate">00020126580014BR.GOV.BCB.PIX0136talhao-ai...</span>
                <button className="bg-[#1A1A2E] text-white px-3 py-1.5 rounded-md text-xs font-bold whitespace-nowrap">Copiar</button>
              </div>
              <p className="text-xs text-gray-400">⏱ QR Code expira em <strong className="text-red-500">14:52</strong></p>
            </div>
          </div>

          <div className="flex items-center gap-2 bg-gray-50 border border-gray-200 rounded-xl p-3 text-xs text-gray-500">
            🔒 Pagamento seguro via <strong className="text-[#1A1A2E] mx-1">Stripe</strong>. Créditos adicionados automaticamente.
          </div>
        </div>

        {/* Direita — resumo */}
        <div className="col-span-2 space-y-5">
          <h2 className="text-sm font-bold text-[#1A1A2E]">Resumo da recarga</h2>
          <div className="bg-white rounded-xl p-5 border border-gray-200">
            <div className="flex justify-between items-start mb-3">
              <div>
                <p className="font-bold text-[#1A1A2E]">💳 Créditos Talhão</p>
                <p className="text-xs text-gray-500">Pré-pagos · não expiram</p>
              </div>
              <span className="text-xl font-extrabold text-[#1A1A2E]">R$17,50</span>
            </div>
            <div className="bg-[#F0FDF4] rounded-lg p-3 text-sm">
              <p className="font-bold text-green-800 mb-1">Você vai receber:</p>
              <p className="text-3xl font-extrabold text-[#2D6A4F]">5 créditos</p>
              <p className="text-xs text-gray-500">= 5 downloads de qualquer arquivo</p>
            </div>
          </div>
          <div className="space-y-2 text-sm text-gray-600">
            <div className="flex justify-between"><span>Valor por crédito</span><span>R$ 3,50</span></div>
            <div className="flex justify-between"><span>Créditos</span><span>× 5</span></div>
            <div className="flex justify-between font-extrabold text-[#1A1A2E] text-base pt-3 border-t border-gray-200">
              <span>Total</span><span>R$ 17,50</span>
            </div>
          </div>
          <div className="text-xs text-gray-500 space-y-1.5 pt-3 border-t border-gray-200">
            {['Créditos não expiram', 'Adicionados em segundos via PIX', 'Funciona para todos os arquivos', 'Nota fiscal emitida automaticamente'].map(i => (
              <div key={i} className="flex items-center gap-2"><span className="text-[#2D6A4F]">✓</span>{i}</div>
            ))}
          </div>
          <div className="bg-indigo-50 rounded-xl p-4 border border-indigo-200 text-xs text-indigo-800">
            <strong className="block mb-1">📊 Economia com Plano Pro</strong>
            Mais de 14 downloads/mês? O Plano Pro (R$49) é mais barato.
            <Link href="/assinar" className="text-[#2D6A4F] font-bold block mt-2">Ver Plano Pro →</Link>
          </div>
        </div>
      </div>
    </div>
  )
}
