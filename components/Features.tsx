const features = [
  {
    num: '01',
    icon: (
      <svg
        width="22"
        height="22"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="1.8"
        strokeLinecap="round"
        strokeLinejoin="round"
      >
        <polygon points="3 11 22 2 13 21 11 13 3 11" />
      </svg>
    ),
    title: 'Encontre qualquer fazenda',
    desc: 'Mais de 10 milhões de propriedades rurais no mapa — busque por município, CAR ou coordenadas GPS.',
  },
  {
    num: '02',
    icon: (
      <svg
        width="22"
        height="22"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="1.8"
        strokeLinecap="round"
        strokeLinejoin="round"
      >
        <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
        <polyline points="7 10 12 15 17 10" />
        <line x1="12" y1="15" x2="12" y2="3" />
      </svg>
    ),
    title: 'Baixe em um clique',
    desc: 'KML para Google Earth, Shapefile para QGIS ou imagem do mapa. Tudo que você precisa, sem complicação.',
  },
  {
    num: '03',
    icon: (
      <svg
        width="22"
        height="22"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="1.8"
        strokeLinecap="round"
        strokeLinejoin="round"
      >
        <path d="M8 3H5a2 2 0 0 0-2 2v3m18 0V5a2 2 0 0 0-2-2h-3m0 18h3a2 2 0 0 0 2-2v-3M3 16v3a2 2 0 0 0 2 2h3" />
      </svg>
    ),
    title: 'Topografia e altitude',
    desc: 'Veja o relevo, declividade e perfil altimétrico de cada propriedade antes de fazer uma visita ou negócio.',
  },
]

export default function Features() {
  return (
    <section
      className="relative overflow-hidden px-6 py-24"
      style={{ background: '#0a1a0e' }}
    >
      <div
        className="pointer-events-none absolute inset-0"
        style={{
          background:
            'radial-gradient(ellipse 70% 50% at 50% -10%, rgba(31,82,48,0.45), transparent)',
        }}
      />

      <div className="relative mx-auto max-w-5xl">
        <div className="mb-16 text-center">
          <p
            className="mb-4 text-xs font-bold uppercase tracking-widest"
            style={{ color: '#52b788' }}
          >
            Por que o Talhão?
          </p>
          <h2
            className="text-4xl font-extrabold leading-tight md:text-5xl"
            style={{ color: '#f0fdf4' }}
          >
            Dados de 10 milhões de fazendas.{' '}
            <br className="hidden md:block" />
            <span
              style={{
                background: 'linear-gradient(135deg, #52b788, #1f5230)',
                WebkitBackgroundClip: 'text',
                WebkitTextFillColor: 'transparent',
              }}
            >
              Na palma da mão.
            </span>
          </h2>
        </div>

        <div className="grid grid-cols-1 gap-5 md:grid-cols-3">
          {features.map((f) => (
            <div
              key={f.num}
              className="group relative cursor-default rounded-2xl border border-[rgba(255,255,255,0.07)] bg-[rgba(255,255,255,0.03)] p-7 transition-all duration-300 hover:-translate-y-1 hover:border-[rgba(82,183,136,0.25)] hover:bg-[rgba(31,82,48,0.12)]"
            >
              <span
                className="mb-5 block text-xs font-bold tracking-widest"
                style={{ color: 'rgba(82,183,136,0.5)' }}
              >
                {f.num}
              </span>

              <div
                className="mb-5 flex h-11 w-11 items-center justify-center rounded-xl"
                style={{
                  background: 'rgba(31,82,48,0.35)',
                  color: '#52b788',
                  border: '1px solid rgba(82,183,136,0.2)',
                }}
              >
                {f.icon}
              </div>

              <h3
                className="mb-2.5 text-lg font-bold leading-snug"
                style={{ color: '#f0fdf4' }}
              >
                {f.title}
              </h3>
              <p className="text-sm leading-relaxed" style={{ color: '#9ca3af' }}>
                {f.desc}
              </p>

              <div
                className="absolute bottom-0 left-7 right-7 h-px rounded-full opacity-0 transition-opacity duration-300 group-hover:opacity-100"
                style={{ background: 'linear-gradient(90deg, transparent, #52b788, transparent)' }}
              />
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
