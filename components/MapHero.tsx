'use client'

import React from 'react'
import { useRouter } from 'next/navigation'

const GEO_API_URL = (process.env.NEXT_PUBLIC_GEO_API_URL ?? 'http://localhost:8000').replace(/\/$/, '')

const heroFeatures = [
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
    <section
      className="relative w-full min-h-[100dvh] overflow-hidden cursor-pointer group md:min-h-screen"
      onClick={() => router.push('/mapa')}
    >
      <iframe
        src={`${GEO_API_URL}/?cleanmode=1`}
        title="Mapa Talhão"
        tabIndex={-1}
        aria-hidden="true"
        className="absolute inset-0 z-0 h-full w-full border-none"
        style={{ pointerEvents: 'none' }}
        loading="lazy"
      />

      <div
        className="absolute inset-0 z-[1]"
        style={{ pointerEvents: 'none' }}
        aria-hidden="true"
      />

      <div
        className="absolute inset-0 z-10 pointer-events-none transition-opacity duration-300 group-hover:opacity-80"
        style={{
          background:
            'linear-gradient(to bottom, rgba(10,30,15,0.55) 0%, rgba(10,30,15,0.35) 60%, rgba(10,30,15,0.65) 100%)',
        }}
      />

      <div className="absolute bottom-10 left-0 right-0 z-20 hidden justify-center pointer-events-none opacity-0 transition-opacity duration-300 md:flex group-hover:opacity-100">
        <span
          style={{
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
          }}
        >
          Explorar o mapa →
        </span>
      </div>

      <div className="relative z-20 flex min-h-[100dvh] flex-col items-center justify-center px-4 pt-24 pb-16 text-center md:min-h-screen md:px-6 md:pt-28">
        <div
          onClick={(e) => e.stopPropagation()}
          style={{
            background: 'rgba(255, 255, 255, 0.08)',
            backdropFilter: 'blur(20px) saturate(170%)',
            WebkitBackdropFilter: 'blur(20px) saturate(170%)',
            border: '1px solid rgba(255,255,255,0.20)',
          }}
          className="mx-auto w-full max-w-[92vw] rounded-3xl px-6 py-8 md:max-w-3xl md:px-10 md:py-12"
        >
          <span className="mb-5 inline-flex items-center gap-2.5 text-sm font-extrabold uppercase tracking-[0.18em] text-white drop-shadow-[0_2px_8px_rgba(0,0,0,0.35)]">
            <span className="relative inline-flex h-3 w-3 flex-shrink-0">
              <span aria-hidden="true" className="absolute inline-flex h-full w-full animate-ping rounded-full bg-[#74C69D] opacity-75" />
              <span className="relative inline-flex h-3 w-3 rounded-full bg-[#74C69D] shadow-[0_0_12px_rgba(116,198,157,0.8)]" />
            </span>
            Procure na talhão você também
          </span>

          <h1
            className="mb-5 text-3xl font-extrabold leading-tight text-white md:text-5xl"
            style={{ textShadow: '0 2px 20px rgba(0,0,0,0.4)' }}
          >
            Encontre qualquer fazenda no Brasil
          </h1>

          <p className="mx-auto mb-8 max-w-xl text-sm leading-relaxed text-white/85 md:text-base">
            Navegue por mais de 10 milhões de propriedades rurais. Baixe KML, Shapefile e mapas topográficos em segundos.
          </p>

          <form
            onSubmit={handleSearch}
            onClick={(e) => e.stopPropagation()}
            className="mx-auto flex w-full max-w-2xl flex-col gap-2.5 rounded-2xl bg-white px-3 py-3 shadow-2xl md:flex-row md:items-center md:px-4 md:py-1.5"
          >
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder={typedText}
              className="w-full min-w-0 border-none bg-transparent py-2.5 text-base text-gray-700 outline-none placeholder:text-gray-400 md:flex-1"
            />
            <button type="submit" className="btn-primary w-full whitespace-nowrap md:w-auto">
              Começar gratuitamente →
            </button>
          </form>

          <div className="mt-6 flex flex-col justify-center gap-3 md:flex-row md:flex-wrap md:gap-6">
            {heroFeatures.map((feature) => (
              <div
                key={feature.title}
                className="flex w-full items-center gap-2.5 text-left md:w-auto"
                style={{
                  background: 'rgba(255,255,255,0.10)',
                  border: '1px solid rgba(255,255,255,0.18)',
                  backdropFilter: 'blur(8px)',
                  borderRadius: '14px',
                  padding: '10px 16px',
                }}
              >
                <div className="flex h-8 w-8 flex-shrink-0 items-center justify-center rounded-xl bg-[#D8F3DC]/80 text-sm">
                  {feature.icon}
                </div>
                <div>
                  <h3 className="text-xs font-bold leading-tight text-white">{feature.title}</h3>
                  <p className="mt-0.5 text-xs text-white/65">{feature.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  )
}
