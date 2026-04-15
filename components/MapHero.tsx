'use client'

import Link from 'next/link'
import { useRouter } from 'next/navigation'

const features = [
  {
    icon: '🗺',
    title: 'SICAR, SIGEF e SNCI',
    desc: 'Mais de 10 milhões de polígonos do SICAR, além de SIGEF e SNCI com cobertura nacional.',
  },
  {
    icon: '📥',
    title: 'Download em um clique',
    desc: 'KML, Shapefile, GeoTIFF e mapas topográficos prontos para uso no campo ou no escritório.',
  },
  {
    icon: '⛰',
    title: 'Topografia e altitude',
    desc: 'Visualize declividade, curvas de nível e altitude de qualquer propriedade rural do Brasil.',
  },
]

const GEO_API_URL = (process.env.NEXT_PUBLIC_GEO_API_URL ?? 'http://localhost:8000').replace(/\/$/, '')
const desktopFeatures = [
  {
    icon: '🗺',
    title: 'SICAR, SIGEF e SNCI',
    desc: 'Cobertura nacional com 10M+ polígonos',
  },
  {
    icon: '📥',
    title: 'Download em um clique',
    desc: 'KML, Shapefile, GeoTIFF e topografia',
  },
  {
    icon: '⛰',
    title: 'Topografia e altitude',
    desc: 'Declividade e altitude por propriedade',
  },
]

export default function MapHero() {
  const router = useRouter()

  return (
    <>
      {/* ===== MOBILE ===== */}
      <section className="md:hidden bg-[#1B4332]">
        <div className="px-5 pt-12 pb-8 text-center">
          <span className="inline-block text-xs font-bold tracking-widest text-[#74C69D] uppercase mb-3">
            Plataforma geoespacial rural
          </span>
          <h1 className="text-2xl font-extrabold text-white mb-3 leading-tight">
            Encontre qualquer fazenda no Brasil
          </h1>
          <p className="text-sm text-white/75 leading-relaxed mb-6">
            Busque pelo CAR, município ou coordenadas e baixe os arquivos em segundos.
          </p>
          <Link
            href="/mapa"
            className="inline-flex items-center gap-2 bg-white text-[#1B4332] font-bold px-6 py-3 rounded-xl text-sm shadow-lg hover:shadow-xl transition-all"
          >
            Abrir mapa →
          </Link>
          <p className="text-xs text-white/50 mt-3">Grátis para explorar · Pague só ao baixar</p>
        </div>

        {/* Features no mobile */}
        <div className="bg-white border-t border-gray-100 px-5 py-6 space-y-4">
          {features.map(f => (
            <div key={f.title} className="flex items-start gap-4">
              <div className="flex-shrink-0 w-10 h-10 rounded-xl bg-[#D8F3DC] flex items-center justify-center text-lg">
                {f.icon}
              </div>
              <div>
                <h3 className="font-bold text-[#1A1A2E] text-sm">{f.title}</h3>
                <p className="text-xs text-gray-500 mt-0.5 leading-relaxed">{f.desc}</p>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* ===== DESKTOP ===== */}
      <section
        className="hidden md:block relative w-full min-h-screen overflow-hidden cursor-pointer"
        onClick={() => router.push('/mapa')}
      >
        <iframe
          src={`${GEO_API_URL}/?cleanmode=1`}
          title="Mapa Talhão"
          className="absolute inset-0 w-full h-full border-none pointer-events-none z-0"
          loading="lazy"
        />

        <div
          className="absolute inset-0 z-10 pointer-events-none"
          style={{ background: 'linear-gradient(to bottom, rgba(10,30,15,0.55) 0%, rgba(10,30,15,0.35) 60%, rgba(10,30,15,0.65) 100%)' }}
        />

        <div
          className="relative z-20 flex min-h-screen flex-col items-center justify-center px-6 pt-28 pb-16 text-center"
          onClick={(e) => e.stopPropagation()}
        >
          <span className="text-xs font-bold tracking-widest text-[#74C69D] uppercase mb-4">
            Plataforma geoespacial rural
          </span>

          <h1
            className="text-5xl font-extrabold text-white leading-tight mb-5"
            style={{ textShadow: '0 2px 20px rgba(0,0,0,0.5)' }}
          >
            Encontre qualquer fazenda no Brasil
          </h1>

          <p className="text-base text-white/85 leading-relaxed mb-8 max-w-xl mx-auto">
            Navegue por mais de 10 milhões de propriedades rurais. Baixe KML, Shapefile e mapas topográficos em segundos.
          </p>

          <div className="flex items-center gap-2.5 rounded-2xl bg-white px-4 py-1.5 shadow-2xl max-w-2xl w-full mx-auto">
            <span className="text-gray-400 text-lg">🔍</span>
            <input
              type="text"
              placeholder="Digite o CAR, fazenda, município ou coordenadas..."
              className="flex-1 border-none outline-none text-sm text-gray-700 bg-transparent py-2.5 placeholder:text-gray-400"
            />
            <Link href="/mapa" className="btn-primary whitespace-nowrap">
              Buscar no mapa →
            </Link>
          </div>

          <div className="flex gap-2 justify-center mt-3 flex-wrap">
            {['CAR: MT-5107602-...', 'CPF / CNPJ', 'Matrícula SIGEF', '-15.78, -47.92'].map((tag) => (
              <span
                key={tag}
                className="text-white/85 text-xs px-3 py-1 rounded-full"
                style={{
                  background: 'rgba(255,255,255,0.15)',
                  border: '1px solid rgba(255,255,255,0.25)',
                  backdropFilter: 'blur(4px)',
                }}
              >
                {tag}
              </span>
            ))}
          </div>

          {/* Feature icons — abaixo do campo de busca */}
          <div className="flex gap-6 justify-center mt-6 flex-wrap">
            {desktopFeatures.map((feature) => (
              <div key={feature.title} className="flex items-center gap-2.5"
                style={{
                  background: 'rgba(255,255,255,0.12)',
                  border: '1px solid rgba(255,255,255,0.22)',
                  backdropFilter: 'blur(8px)',
                  borderRadius: '14px',
                  padding: '10px 16px',
                }}
              >
                <div className="w-8 h-8 rounded-xl bg-[#D8F3DC]/80 flex items-center justify-center text-sm flex-shrink-0">
                  {feature.icon}
                </div>
                <div className="text-left">
                  <h3 className="font-bold text-white text-xs leading-tight">{feature.title}</h3>
                  <p className="text-white/65 text-xs mt-0.5">{feature.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>
    </>
  )
}
