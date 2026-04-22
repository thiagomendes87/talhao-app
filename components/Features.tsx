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
    <section className="bg-[#f8f9fb] px-6 py-24">
      <div className="mx-auto max-w-6xl">
        <div className="mb-16 text-center">
          <span className="mb-6 inline-flex items-center gap-1.5 rounded-full border border-gray-200 bg-white px-4 py-1.5 text-sm font-medium text-[#1a5c38] shadow-sm">
            Por que o Talhão?
          </span>
          <h2 className="mb-4 text-center text-4xl font-bold text-gray-900">
            A plataforma que o agro estava esperando
          </h2>
          <p className="mx-auto mb-16 max-w-2xl text-center text-lg text-gray-500">
            Encontre propriedades rurais, baixe arquivos e visualize topografia com a velocidade que faltava no campo e no escritório.
          </p>
        </div>

        <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
          {features.map((f) => (
            <div
              key={f.num}
              className="flex flex-col overflow-hidden rounded-2xl border border-gray-200 bg-white shadow-sm"
            >
              <div className="flex h-40 items-center justify-center bg-[#e8f5ee]">
                <div className="rounded-full bg-white p-4 text-[#1a5c38] shadow-sm [&_svg]:h-10 [&_svg]:w-10">
                  {f.icon}
                </div>
              </div>

              <div className="p-6">
                <span className="mb-2 block text-sm font-bold text-[#1a5c38]">{f.num}</span>
                <h3 className="mb-2 text-xl font-semibold text-gray-900">{f.title}</h3>
                <p className="text-sm leading-relaxed text-gray-500">{f.desc}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
