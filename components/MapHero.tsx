'use client'

import Link from 'next/link'

const features = [
  {
    icon: '🗺',
    title: 'Todos os CAR do Brasil',
    desc: 'Mais de 10 milhões de polígonos do SICAR disponíveis, com status, área e perímetro.',
  },
  {
    icon: '📥',
    title: 'KML, SIGEF e muito mais',
    desc: 'Baixe os arquivos da propriedade rural em um clique. KML, SIGEF, SNCR e topografia.',
  },
  {
    icon: '🔲',
    title: 'Múltiplas camadas',
    desc: 'Sobreponha satélite, topografia, SNCR e SIGEF para uma análise completa.',
  },
]

export default function MapHero() {
  return (
    <section className="relative min-h-[calc(100vh-72px)] overflow-hidden" style={{
      background: 'linear-gradient(135deg, #1B4332 0%, #2D6A4F 30%, #40916C 60%, #74C69D 100%)'
    }}>
      {/* Grid overlay */}
      <div className="absolute inset-0" style={{
        backgroundImage: `
          repeating-linear-gradient(0deg, rgba(255,255,255,0.03) 0px, rgba(255,255,255,0.03) 1px, transparent 1px, transparent 60px),
          repeating-linear-gradient(90deg, rgba(255,255,255,0.03) 0px, rgba(255,255,255,0.03) 1px, transparent 1px, transparent 60px)
        `
      }} />

      {/* Fake polygon shapes — serão substituídos pelo Mapbox */}
      <div className="absolute" style={{ top: '20%', left: '15%', width: 120, height: 80, background: 'rgba(255,230,100,0.15)', border: '1.5px solid rgba(255,230,100,0.5)', borderRadius: 2, transform: 'rotate(-5deg)' }} />
      <div className="absolute" style={{ top: '35%', left: '8%', width: 90, height: 110, background: 'rgba(255,230,100,0.15)', border: '1.5px solid rgba(255,230,100,0.5)', borderRadius: 2, transform: 'rotate(10deg)' }} />
      <div className="absolute" style={{ top: '55%', left: '20%', width: 160, height: 70, background: 'rgba(255,230,100,0.15)', border: '1.5px solid rgba(255,230,100,0.5)', borderRadius: 2, transform: 'rotate(-2deg)' }} />
      <div className="absolute" style={{ top: '25%', left: '70%', width: 100, height: 90, background: 'rgba(255,230,100,0.15)', border: '1.5px solid rgba(255,230,100,0.5)', borderRadius: 2, transform: 'rotate(8deg)' }} />
      <div className="absolute" style={{ top: '50%', left: '65%', width: 140, height: 100, background: 'rgba(255,230,100,0.15)', border: '1.5px solid rgba(255,230,100,0.5)', borderRadius: 2, transform: 'rotate(-6deg)' }} />
      {/* Polígono ativo destacado */}
      <div className="absolute" style={{ top: '30%', left: '42%', width: 150, height: 110, background: 'rgba(255,210,50,0.35)', border: '2.5px solid rgba(255,210,0,0.9)', borderRadius: 2, boxShadow: '0 0 0 6px rgba(255,215,0,0.15)', transform: 'rotate(3deg)' }} />

      {/* Labels */}
      <span className="absolute text-white/70 text-xs font-medium" style={{ top: '17%', left: '16%' }}>MT-1234567...</span>
      <span className="absolute text-white/70 text-xs font-medium" style={{ top: '26%', left: '71%' }}>GO-9876543...</span>
      <span className="absolute text-white/70 text-xs font-medium" style={{ top: '27%', left: '43%' }}>SP-3550308...</span>

      {/* Search overlay centralizado */}
      <div className="absolute top-[44%] left-1/2 flex w-[680px] max-w-[92vw] -translate-x-1/2 -translate-y-1/2 flex-col items-center text-center">
        <h1 className="mb-2.5 whitespace-nowrap text-[clamp(1.9rem,4.8vw,3.5rem)] font-extrabold leading-tight text-white" style={{ textShadow: '0 2px 12px rgba(0,0,0,0.4)' }}>
          Encontre qualquer fazenda no Brasil
        </h1>
        <p className="mb-6 max-w-2xl text-base leading-relaxed text-white/85" style={{ textShadow: '0 1px 6px rgba(0,0,0,0.3)' }}>
          Navegue pelo mapa, busque pelo CAR, CPF, coordenadas<br />ou nome da propriedade e baixe o KML em segundos.
        </p>

        {/* Search box */}
        <div className="flex w-full items-center gap-2.5 rounded-xl bg-white px-4 py-1.5 shadow-2xl">
          <span className="text-gray-400 text-lg">🔍</span>
          <input
            type="text"
            placeholder="Digite o CAR, nome da fazenda, município ou coordenadas..."
            className="flex-1 border-none outline-none text-sm text-gray-700 bg-transparent py-2"
          />
          <Link href="/mapa" className="btn-primary whitespace-nowrap">
            Buscar no mapa →
          </Link>
        </div>

        {/* Tags */}
        <div className="flex gap-2 justify-center mt-3 flex-wrap">
          {['CAR: MT-5107602-...', 'CPF / CNPJ', 'Matrícula SIGEF', '-15.78, -47.92'].map(tag => (
            <span key={tag} className="text-white/90 text-xs px-2.5 py-1 rounded-full" style={{ background: 'rgba(255,255,255,0.15)', border: '1px solid rgba(255,255,255,0.25)', backdropFilter: 'blur(4px)' }}>
              {tag}
            </span>
          ))}
        </div>
      </div>

      {/* Zoom controls */}
      <div className="absolute right-5 bottom-16 flex flex-col gap-1">
        {['+', '−'].map(c => (
          <div key={c} className="w-8 h-8 bg-white rounded flex items-center justify-center font-bold text-gray-600 shadow-md cursor-pointer text-base">
            {c}
          </div>
        ))}
      </div>

      {/* Layer toggles */}
      <div className="absolute bottom-5 left-5 flex gap-1.5">
        {['🛰 Satélite', '🗺 Mapa', '⛰ Topografia'].map((l, i) => (
          <div key={l} className={`rounded-md px-2.5 py-1.5 text-xs font-semibold shadow-md cursor-pointer ${i === 0 ? 'bg-[#1A1A2E] text-white' : 'bg-white text-gray-700'}`}>
            {l}
          </div>
        ))}
      </div>

      {/* Bloco de benefícios dentro do mapa */}
      <div className="absolute left-1/2 bottom-5 z-20 w-[92vw] max-w-5xl -translate-x-1/2 rounded-2xl border border-gray-200 bg-white/95 p-5 shadow-2xl backdrop-blur-sm">
        <div className="grid grid-cols-1 gap-5 md:grid-cols-3">
          {features.map(f => (
            <div key={f.title} className="text-center px-4 py-2">
              <div className="mx-auto mb-3 flex h-11 w-11 items-center justify-center rounded-xl bg-[#D8F3DC] text-xl">
                {f.icon}
              </div>
              <h3 className="mb-1.5 font-bold text-[#1A1A2E]">{f.title}</h3>
              <p className="text-sm leading-relaxed text-gray-600">{f.desc}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
