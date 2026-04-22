const features = [
  {
    num: '01',
    icon: (
      <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
        <polygon points="3 11 22 2 13 21 11 13 3 11" />
      </svg>
    ),
    title: 'Encontre qualquer fazenda',
    desc: 'Mais de 10 milhões de propriedades rurais no mapa — busque por município, CAR ou coordenadas GPS.',
  },
  {
    num: '02',
    icon: (
      <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
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
      <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
        <path d="M8 3H5a2 2 0 0 0-2 2v3m18 0V5a2 2 0 0 0-2-2h-3m0 18h3a2 2 0 0 0 2-2v-3M3 16v3a2 2 0 0 0 2 2h3" />
      </svg>
    ),
    title: 'Topografia e altitude',
    desc: 'Veja o relevo, declividade e perfil altimétrico de cada propriedade antes de fazer uma visita ou negócio.',
  },
]

export default function Features() {
  return (
    <section className="bg-white px-6 py-24">
      <div className="mx-auto max-w-5xl">

        <div className="mb-14 text-center">
          <div className="inline-flex items-center rounded-lg border border-[rgba(28,43,24,0.12)] bg-[#f4f7f5] px-3 py-1.5 mb-5">
            <span className="text-[11px] font-semibold uppercase tracking-[0.08em] text-[#1f5230]">Por que o Talhão?</span>
          </div>
          <h2 className="text-3xl font-bold text-[#162113] mb-3">
            A plataforma que o agro estava esperando
          </h2>
          <p className="mx-auto max-w-xl text-[13px] leading-relaxed text-[#4f6347]">
            Encontre propriedades rurais, baixe arquivos e visualize topografia com a velocidade que faltava no campo e no escritório.
          </p>
        </div>

        <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
          {features.map((f) => (
            <div
              key={f.num}
              className="flex flex-col rounded-2xl border border-[rgba(28,43,24,0.10)] bg-white p-6"
              style={{ boxShadow: '0 1px 3px rgba(22,33,19,0.05), 0 8px 24px rgba(22,33,19,0.04)' }}
            >
              <div className="mb-5 flex h-10 w-10 items-center justify-center rounded-xl bg-[#D8F3DC] text-[#1f5230]">
                {f.icon}
              </div>
              <p className="mb-2 text-[11px] font-semibold uppercase tracking-[0.08em] text-[#4f6347]">{f.num}</p>
              <h3 className="mb-2 text-[15px] font-semibold text-[#162113]">{f.title}</h3>
              <p className="text-[13px] leading-relaxed text-[#4f6347]">{f.desc}</p>
            </div>
          ))}
        </div>

      </div>
    </section>
  )
}
