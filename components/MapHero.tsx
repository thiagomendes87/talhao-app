'use client'

import React from 'react'
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
  { icon: '🗺', title: 'SICAR, SIGEF e SNCI', desc: 'Cobertura nacional com 10M+ polígonos' },
  { icon: '📥', title: 'Download em um clique', desc: 'KML, Shapefile, GeoTIFF e topografia' },
  { icon: '⛰', title: 'Topografia e altitude', desc: 'Declividade e altitude por propriedade' },
]

const PLACEHOLDER_TEXTS = [
  'Procure por uma coordenada',
  'Procure por um município',
  'Procure por um Estado',
]

export default function MapHero() {
  const router = useRouter()
  const [searchQuery, setSearchQuery] = React.useState('')
  const [placeholderIdx, setPlaceholderIdx] = React.useState(0)
  const [typedText, setTypedText] = React.useState('')
  const [isDeleting, setIsDeleting] = React.useState(false)

  React.useEffect(() => {
    const current = PLACEHOLDER_TEXTS[placeholderIdx]
    let timeout: ReturnType<typeof setTimeout>

    if (!isDeleting && typedText.length < current.length) {
      timeout = setTimeout(() => setTypedText(current.slice(0, typedText.length + 1)), 75)
    } else if (!isDeleting && typedText.length === current.length) {
      timeout = setTimeout(() => setIsDeleting(true), 2000)
    } else if (isDeleting && typedText.length > 0) {
      timeout = setTimeout(() => setTypedText(typedText.slice(0, -1)), 35)
    } else {
      setIsDeleting(false)
      setPlaceholderIdx((i) => (i + 1) % PLACEHOLDER_TEXTS.length)
    }

    return () => clearTimeout(timeout)
  }, [typedText, isDeleting, placeholderIdx])

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault()
    const q = searchQuery.trim()
    router.push(q ? `/mapa?q=${encodeURIComponent(q)}` : '/mapa')
  }

  return (
    <>
      {/* ===== MOBILE ===== */}
      <section className="md:hidden bg-[#1B4332]">
        <div className="px-5 pt-12 pb-8 text-center">
          <span className="inline-flex items-center gap-2 text-xs font-bold tracking-widest text-[#74C69D] uppercase mb-3">
            <span className="inline-block w-2 h-2 rounded-full bg-[#74C69D] animate-pulse flex-shrink-0" />
            Procure na talhão você também
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
            Começar gratuitamente →
          </Link>
          <p className="text-xs text-white/50 mt-3">Grátis para explorar · Pague só ao baixar</p>
        </div>
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
        className="hidden md:block relative w-full min-h-screen overflow-hidden cursor-pointer group"
        onClick={() => router.push('/mapa')}
      >
        <iframe
          src={`${GEO_API_URL}/?cleanmode=1`}
          title="Mapa Talhão"
          className="absolute inset-0 w-full h-full border-none pointer-events-none z-0"
          loading="lazy"
        />

        {/* Overlay escuro — clareia levemente no hover para sinalizar clicabilidade */}
        <div
          className="absolute inset-0 z-10 pointer-events-none transition-opacity duration-300 group-hover:opacity-80"
          style={{ background: 'linear-gradient(to bottom, rgba(10,30,15,0.55) 0%, rgba(10,30,15,0.35) 60%, rgba(10,30,15,0.65) 100%)' }}
        />

        {/* Hint de hover fora do painel — aparece só no hover */}
        <div className="absolute bottom-10 left-0 right-0 z-20 flex justify-center pointer-events-none opacity-0 group-hover:opacity-100 transition-opacity duration-300">
          <span style={{
            background: 'rgba(255,255,255,0.1)',
            border: '1px solid rgba(255,255,255,0.2)',
            backdropFilter: 'blur(8px)',
            WebkitBackdropFilter: 'blur(8px)',
            borderRadius: '999px',
            padding: '8px 22px',
            color: 'rgba(255,255,255,0.85)',
            fontSize: '13px',
            fontWeight: 600,
            letterSpacing: '0.02em',
          }}>
            Explorar o mapa →
          </span>
        </div>

        {/* Conteúdo central — stopPropagation para não disparar o click do section */}
        <div
          className="relative z-20 flex min-h-screen flex-col items-center justify-center px-6 pt-28 pb-16 text-center"
        >
          {/* Painel de vidro opaco */}
          <div
            onClick={(e) => e.stopPropagation()}
            style={{
              background: 'rgba(255, 255, 255, 0.13)',
              backdropFilter: 'blur(24px) saturate(180%)',
              WebkitBackdropFilter: 'blur(24px) saturate(180%)',
              border: '1px solid rgba(255,255,255,0.28)',
              borderRadius: '28px',
            }}
            className="px-10 py-12 max-w-3xl w-full mx-auto"
          >
            {/* Badge com ícone piscando */}
            <span className="inline-flex items-center gap-2 text-xs font-bold tracking-widest text-[#74C69D] uppercase mb-4">
              <span className="inline-block w-2 h-2 rounded-full bg-[#74C69D] animate-pulse flex-shrink-0" />
              Procure na talhão você também
            </span>

            <h1
              className="text-5xl font-extrabold text-white leading-tight mb-5"
              style={{ textShadow: '0 2px 20px rgba(0,0,0,0.4)' }}
            >
              Encontre qualquer fazenda no Brasil
            </h1>

            <p className="text-base text-white/85 leading-relaxed mb-8 max-w-xl mx-auto">
              Navegue por mais de 10 milhões de propriedades rurais. Baixe KML, Shapefile e mapas topográficos em segundos.
            </p>

            {/* Campo de busca com efeito de digitação */}
            <form
              onSubmit={handleSearch}
              className="flex items-center gap-2.5 rounded-2xl bg-white px-4 py-1.5 shadow-2xl max-w-2xl w-full mx-auto"
              onClick={(e) => e.stopPropagation()}
            >
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder={typedText}
                className="flex-1 border-none outline-none text-sm text-gray-700 bg-transparent py-2.5 placeholder:text-gray-400"
              />
              <button type="submit" className="btn-primary whitespace-nowrap">
                Começar gratuitamente →
              </button>
            </form>

            {/* Feature chips */}
            <div className="flex gap-6 justify-center mt-6 flex-wrap">
              {desktopFeatures.map((feature) => (
                <div
                  key={feature.title}
                  className="flex items-center gap-2.5"
                  style={{
                    background: 'rgba(255,255,255,0.10)',
                    border: '1px solid rgba(255,255,255,0.18)',
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
        </div>
      </section>
    </>
  )
}
