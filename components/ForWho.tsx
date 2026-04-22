const profiles = [
  {
    icon: (
      <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
        <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2" />
        <circle cx="9" cy="7" r="4" />
        <path d="M23 21v-2a4 4 0 0 0-3-3.87" />
        <path d="M16 3.13a4 4 0 0 1 0 7.75" />
      </svg>
    ),
    label: 'Corretores & Imobiliárias',
    desc: 'Encontre os limites exatos de qualquer fazenda antes da visita. Baixe o arquivo e mostre ao cliente no Google Earth na hora.',
    tag: 'Mais usado',
  },
  {
    icon: (
      <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
        <path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z" />
        <polyline points="9 22 9 12 15 12 15 22" />
      </svg>
    ),
    label: 'Proprietários Rurais',
    desc: 'Confira os limites oficiais da sua propriedade, detecte sobreposições com vizinhos e tenha os documentos prontos para o cartório.',
    tag: null,
  },
  {
    icon: (
      <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
        <line x1="12" y1="1" x2="12" y2="23" />
        <path d="M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6" />
      </svg>
    ),
    label: 'Investidores de Terras',
    desc: 'Analise qualquer gleba com dados reais antes de negociar. Área, documentação, topografia e localização em segundos.',
    tag: null,
  },
  {
    icon: (
      <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
        <rect x="2" y="3" width="20" height="14" rx="2" ry="2" />
        <line x1="8" y1="21" x2="16" y2="21" />
        <line x1="12" y1="17" x2="12" y2="21" />
      </svg>
    ),
    label: 'Advogados & Cartórios',
    desc: 'Acesse matrículas georreferenciadas do INCRA, shapefiles e documentação oficial para processos, registros e due diligence.',
    tag: null,
  },
]

export default function ForWho() {
  return (
    <section className="bg-white px-6 py-28">
      <div className="mx-auto max-w-5xl">
        <div className="mb-16 text-center">
          <div className="inline-flex items-center rounded-lg border border-[rgba(28,43,24,0.12)] bg-[#f4f7f5] px-3 py-1.5 mb-5">
            <span className="text-[11px] font-semibold uppercase tracking-[0.08em] text-[#1f5230]">Para quem é</span>
          </div>
          <h2 className="mb-4 text-4xl font-extrabold leading-tight md:text-5xl" style={{ color: '#162113' }}>
            Feito para quem trabalha{' '}
            <span
              style={{
                background: 'linear-gradient(135deg, #1f5230, #52b788)',
                WebkitBackgroundClip: 'text',
                WebkitTextFillColor: 'transparent',
              }}
            >
              com terra.
            </span>
          </h2>
          <p className="mx-auto max-w-lg text-base text-gray-500">
            Sem jargão técnico, sem curva de aprendizado. Se você precisa de dados de uma fazenda, o Talhão resolve.
          </p>
        </div>

        <div className="grid grid-cols-1 gap-5 sm:grid-cols-2">
          {profiles.map((p) => (
            <div
              key={p.label}
              className="relative flex cursor-default gap-5 rounded-2xl border border-[rgba(22,33,19,0.09)] bg-white p-7 transition-all duration-300 hover:-translate-y-[3px] hover:border-[rgba(31,82,48,0.25)] hover:shadow-[0_4px_24px_rgba(31,82,48,0.10)]"
              style={{
                boxShadow: '0 1px 3px rgba(22,33,19,0.05)',
              }}
            >
              {p.tag && (
                <div
                  className="absolute right-5 top-5 rounded-full px-2.5 py-1 text-xs font-bold"
                  style={{ background: 'rgba(31,82,48,0.08)', color: '#1f5230' }}
                >
                  {p.tag}
                </div>
              )}
              <div
                className="mt-0.5 flex h-12 w-12 flex-shrink-0 items-center justify-center rounded-xl"
                style={{ background: 'rgba(31,82,48,0.07)', color: '#1f5230' }}
              >
                {p.icon}
              </div>
              <div>
                <h3 className="mb-2 text-base font-bold leading-snug" style={{ color: '#162113' }}>
                  {p.label}
                </h3>
                <p className="text-sm leading-relaxed" style={{ color: '#6b7280' }}>
                  {p.desc}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
