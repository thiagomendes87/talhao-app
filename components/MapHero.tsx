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
    <div>
      {/* Hero */}
      <section className="relative overflow-hidden" style={{
        background: 'linear-gradient(135deg, #1B4332 0%, #2D6A4F 30%, #40916C 60%, #74C69D 100%)',
        minHeight: 'clamp(400px, 70vh, 700px)'
      }}>
        {/* Grid overlay */}
        <div className="absolute inset-0" style={{
          backgroundImage: `
            repeating-linear-gradient(0deg, rgba(255,255,255,0.03) 0px, rgba(255,255,255,0.03) 1px, transparent 1px, transparent 60px),
            repeating-linear-gradient(90deg, rgba(255,255,255,0.03) 0px, rgba(255,255,255,0.03) 1px, transparent 1px, transparent 60px)
          `
        }} />

        {/* Polígonos decorativos — só em desktop */}
        <div className="hidden md:block">
          <div className="absolute" style={{ top: '20%', left: '15%', width: 120, height: 80, background: 'rgba(255,230,100,0.15)', border: '1.5px solid rgba(255,230,100,0.5)', borderRadius: 2, transform: 'rotate(-5deg)' }} />
          <div className="absolute" style={{ top: '35%', left: '8%', width: 90, height: 110, background: 'rgba(255,230,100,0.15)', border: '1.5px solid rgba(255,230,100,0.5)', borderRadius: 2, transform: 'rotate(10deg)' }} />
          <div className="absolute" style={{ top: '55%', left: '20%', width: 160, height: 70, background: 'rgba(255,230,100,0.15)', border: '1.5px solid rgba(255,230,100,0.5)', borderRadius: 2, transform: 'rotate(-2deg)' }} />
          <div className="absolute" style={{ top: '25%', left: '70%', width: 100, height: 90, background: 'rgba(255,230,100,0.15)', border: '1.5px solid rgba(255,230,100,0.5)', borderRadius: 2, transform: 'rotate(8deg)' }} />
          <div className="absolute" style={{ top: '50%', left: '65%', width: 140, height: 100, background: 'rgba(255,230,100,0.15)', border: '1.5px solid rgba(255,230,100,0.5)', borderRadius: 2, transform: 'rotate(-6deg)' }} />
          <div className="absolute" style={{ top: '30%', left: '42%', width: 150, height: 110, background: 'rgba(255,210,50,0.35)', border: '2.5px solid rgba(255,210,0,0.9)', borderRadius: 2, boxShadow: '0 0 0 6px rgba(255,215,0,0.15)', transform: 'rotate(3deg)' }} />
          <span className="absolute text-white/70 text-xs font-medium" style={{ top: '17%', left: '16%' }}>MT-1234567...</span>
          <span className="absolute text-white/70 text-xs font-medium" style={{ top: '26%', left: '71%' }}>GO-9876543...</span>
          <span className="absolute text-white/70 text-xs font-medium" style={{ top: '27%', left: '43%' }}>SP-3550308...</span>
        </div>

        {/* Conteúdo central */}
        <div className="relative z-10 flex flex-col items-center justify-center text-center px-4 sm:px-8 py-16 sm:py-24 h-full">
          <h1 className="text-2xl sm:text-4xl md:text-5xl font-extrabold text-white mb-3 max-w-3xl leading-tight" style={{ textShadow: '0 2px 12px rgba(0,0,0,0.4)' }}>
            Encontre qualquer fazenda no Brasil
          </h1>
          <p className="mb-6 max-w-xl text-sm sm:text-base leading-relaxed text-white/85" style={{ textShadow: '0 1px 6px rgba(0,0,0,0.3)' }}>
            Navegue pelo mapa, busque pelo município, CAR ou coordenadas e baixe o KML em segundos.
          </p>

          {/* Search box */}
          <div className="w-full max-w-2xl">
            <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-2 rounded-xl bg-white px-4 py-2 shadow-2xl">
              <span className="text-gray-400 text-lg hidden sm:block">🔍</span>
              <input
                type="text"
                placeholder="Digite o CAR, município ou coordenadas..."
                className="flex-1 border-none outline-none text-sm text-gray-700 bg-transparent py-2"
              />
              <Link href="/mapa" className="btn-primary text-center whitespace-nowrap text-sm py-2 px-4 rounded-lg">
                Buscar →
              </Link>
            </div>

            {/* Tags */}
            <div className="flex gap-2 justify-center mt-3 flex-wrap">
              {['CAR: MT-5107602-...', 'CPF / CNPJ', 'Matrícula SIGEF', '-15.78, -47.92'].map(tag => (
                <span key={tag} className="text-white/90 text-xs px-2.5 py-1 rounded-full" style={{ background: 'rgba(255,255,255,0.15)', border: '1px solid rgba(255,255,255,0.25)' }}>
                  {tag}
                </span>
              ))}
            </div>
          </div>
        </div>

        {/* Controles — só em desktop */}
        <div className="hidden md:flex absolute right-5 bottom-16 flex-col gap-1">
          {['+', '−'].map(c => (
            <div key={c} className="w-8 h-8 bg-white rounded flex items-center justify-center font-bold text-gray-600 shadow-md cursor-pointer">
              {c}
            </div>
          ))}
        </div>
        <div className="hidden md:flex absolute bottom-5 left-5 gap-1.5">
          {['🛰 Satélite', '🗺 Mapa', '⛰ Topografia'].map((l, i) => (
            <div key={l} className={`rounded-md px-2.5 py-1.5 text-xs font-semibold shadow-md cursor-pointer ${i === 0 ? 'bg-[#1A1A2E] text-white' : 'bg-white text-gray-700'}`}>
              {l}
            </div>
          ))}
        </div>
      </section>

      {/* Bloco de features — fora do hero, sempre visível */}
      <div className="bg-white border-b border-gray-200 shadow-sm">
        <div className="max-w-5xl mx-auto px-4 sm:px-8 py-6 sm:py-8">
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 sm:gap-6">
            {features.map(f => (
              <div key={f.title} className="flex items-start gap-4 sm:flex-col sm:items-center sm:text-center">
                <div className="flex-shrink-0 flex h-11 w-11 items-center justify-center rounded-xl bg-[#D8F3DC] text-xl">
                  {f.icon}
                </div>
                <div>
                  <h3 className="font-bold text-[#1A1A2E] text-sm sm:text-base mb-1">{f.title}</h3>
                  <p className="text-xs sm:text-sm leading-relaxed text-gray-600">{f.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}
