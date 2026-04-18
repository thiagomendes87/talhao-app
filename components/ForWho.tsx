export default function ForWho() {
  const profiles = [
    { icon: '🤝', label: 'Corretores & Imobiliárias', desc: 'Encontre qualquer propriedade rural em segundos. Impressione clientes com dados precisos.' },
    { icon: '🌾', label: 'Proprietários Rurais', desc: 'Conheça sua própria terra como nunca antes. Acesse os dados oficiais da sua fazenda.' },
    { icon: '📐', label: 'Compradores de Terrenos', desc: 'Pesquise antes de comprar. Veja área, localização e documentação georreferenciada.' },
    { icon: '📈', label: 'Investidores', desc: 'Analise o mercado de terras com dados reais do SICAR. Tome decisões com embasamento.' },
  ]

  return (
    <section className="bg-[#1A1A2E] py-24 px-6">
      <div className="max-w-5xl mx-auto text-center">

        {/* Headline */}
        <p className="text-[#2D6A4F] font-semibold text-sm uppercase tracking-widest mb-4">Para quem é</p>
        <h2 className="text-4xl md:text-5xl font-extrabold text-white leading-tight mb-6">
          A plataforma de dados rurais<br />
          <span className="text-[#52B788]">mais acessível e justa do Brasil.</span>
        </h2>
        <p className="text-gray-400 text-lg max-w-2xl mx-auto mb-16">
          Pague só pelo que usar. Sem contrato, sem mensalidade obrigatória. Dados oficiais ao alcance de qualquer profissional do agro.
        </p>

        {/* Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 text-left">
          {profiles.map((p) => (
            <div key={p.label} className="bg-white/5 border border-white/10 rounded-2xl p-6 hover:bg-white/10 transition-colors">
              <div className="text-3xl mb-3">{p.icon}</div>
              <h3 className="text-white font-bold text-lg mb-2">{p.label}</h3>
              <p className="text-gray-400 text-sm leading-relaxed">{p.desc}</p>
            </div>
          ))}
        </div>

        {/* CTA */}
        <div className="mt-12">
          <a href="/mapa" className="inline-block bg-[#2D6A4F] hover:bg-[#245c43] text-white font-semibold px-8 py-4 rounded-xl transition-colors text-base">
            Abrir mapa gratuitamente →
          </a>
        </div>
      </div>
    </section>
  )
}
