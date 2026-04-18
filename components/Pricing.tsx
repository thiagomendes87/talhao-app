import Link from 'next/link'

const packages = [
  { downloads: 4, price: 'R$ 14,00' },
  { downloads: 6, price: 'R$ 21,00' },
  { downloads: 8, price: 'R$ 28,00' },
]

export default function Pricing() {
  return (
    <section id="precos" className="py-10 px-4 sm:px-10 bg-gray-50 border-t border-gray-200">
      <h2 className="text-center text-xl sm:text-2xl font-extrabold text-[#1A1A2E] mb-2">
        Simples. Transparente. Sem mensalidade obrigatória.
      </h2>
      <p className="text-center text-sm text-gray-600 mb-8">
        Pague só quando precisar, ou assine o Pro e baixe à vontade.
      </p>

      {/* Créditos pré-pagos */}
      <div className="max-w-3xl mx-auto mb-8 bg-white rounded-2xl p-5 sm:p-8 border border-gray-200">
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 sm:gap-8 items-start">
          <div>
            <span className="text-xs font-bold tracking-widest text-gray-400 uppercase">Como funciona</span>
            <h3 className="text-xl sm:text-2xl font-extrabold text-[#1A1A2E] mt-2 mb-2.5">Créditos pré-pagos</h3>
            <p className="text-sm text-gray-600 leading-relaxed mb-4">
              Carregue sua carteira e baixe o que precisar, quando precisar.
              Cada arquivo custa <strong className="text-[#1A1A2E]">R$ 3,50</strong> — sem mensalidade, sem surpresa.
            </p>
            <div className="flex gap-2 flex-wrap">
              {['✓ Sem assinatura', '✓ Válido por 1 ano', '✓ PIX instantâneo', '✓ Cartão'].map(tag => (
                <span key={tag} className="text-xs font-bold px-3 py-1.5 rounded-full bg-[#D8F3DC] text-[#2D6A4F]">{tag}</span>
              ))}
            </div>
          </div>
          <div>
            <span className="text-xs font-bold tracking-widest text-gray-400 uppercase mb-3 block">Pacotes de créditos</span>
            <div className="flex flex-col gap-2">
              {packages.map(p => (
                <div key={p.downloads} className="flex justify-between items-center bg-gray-50 rounded-lg px-3.5 py-2.5 text-sm">
                  <span className="text-gray-700">{p.downloads} créditos</span>
                  <span className="font-bold text-[#1A1A2E]">{p.price}</span>
                </div>
              ))}
              <div className="flex justify-between items-center bg-indigo-50 rounded-lg px-3.5 py-2.5 text-sm border border-dashed border-indigo-200">
                <span className="text-gray-600">R$ 3,50 por crédito</span>
                <span className="text-gray-400 text-xs">a qualquer hora</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Cards Grátis + Pro */}
      <div className="max-w-3xl mx-auto grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-5 items-stretch">
        {/* Grátis */}
        <div className="bg-white rounded-xl p-5 sm:p-7 border-2 border-gray-200 flex flex-col">
          <p className="text-xs font-bold tracking-widest text-gray-500 uppercase mb-2">Gratuito</p>
          <div className="text-3xl sm:text-4xl font-extrabold text-[#1A1A2E]">R$0 <span className="text-base font-normal text-gray-500">para sempre</span></div>
          <ul className="my-4 space-y-2 text-sm text-gray-700">
            {['Visualização do mapa', 'Busca por CAR, endereço', 'KML, SIGEF, SNCR, Topografia', 'Downloads com créditos'].map(i => (
              <li key={i} className="flex items-start gap-2"><span className="text-[#2D6A4F] font-bold flex-shrink-0">✓</span>{i}</li>
            ))}
          </ul>
          <Link href="/mapa" className="btn-primary mt-auto block w-full rounded-lg py-2.5 text-center text-sm">Abrir mapa grátis</Link>
        </div>

        {/* Pro */}
        <div className="bg-white rounded-xl p-5 sm:p-7 border-2 border-[#1A1A2E] relative flex flex-col">
          <div className="absolute -top-3 left-1/2 -translate-x-1/2 bg-[#1A1A2E] text-white text-xs font-bold px-4 py-1 rounded-full whitespace-nowrap tracking-wide uppercase">
            Melhor custo-benefício
          </div>
          <p className="text-xs font-bold tracking-widest text-gray-500 uppercase mb-2">Pro</p>
          <div className="text-3xl sm:text-4xl font-extrabold text-[#1A1A2E]">R$49 <span className="text-base font-normal text-gray-500">/mês</span></div>
          <p className="text-xs text-[#2D6A4F] font-semibold mt-1 mb-4">= R$ 3,50/download a partir de 14/mês</p>
          <ul className="mb-4 space-y-2 text-sm text-gray-700">
            {['Visualização do mapa', 'Busca por CAR, endereço', 'KML, SIGEF, SNCR, Topografia', 'Downloads ilimitados'].map(i => (
              <li key={i} className="flex items-start gap-2">
                <span className="text-[#2D6A4F] font-bold flex-shrink-0">✓</span>
                <span className={i === 'Downloads ilimitados' ? 'font-bold text-[#1A1A2E]' : ''}>{i}</span>
              </li>
            ))}
          </ul>
          <Link href="/assinar" className="btn-green mt-auto block w-full rounded-lg py-2.5 text-center text-sm">Assinar Pro — R$49/mês</Link>
        </div>
      </div>
    </section>
  )
}
