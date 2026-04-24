'use client'

import Link from 'next/link'
import { AnimatePresence, motion } from 'framer-motion'
import { useMemo, useState } from 'react'
import Reveal from '@/components/ui/Reveal'
import Section from '@/components/ui/Section'

type Density = 'high' | 'medium' | 'low'

type StateShape = {
  uf: string
  name: string
  properties: number
  density: Density
  path: string
  tooltipX: number
  tooltipY: number
}

const states: StateShape[] = [
  { uf: 'AC', name: 'Acre', properties: 68000, density: 'low', path: 'M42 278 L60 248 L96 254 L92 292 L58 300 Z', tooltipX: 74, tooltipY: 268 },
  { uf: 'RO', name: 'Rondonia', properties: 214000, density: 'medium', path: 'M90 252 L130 242 L146 270 L126 300 L86 290 L82 268 Z', tooltipX: 114, tooltipY: 270 },
  { uf: 'AM', name: 'Amazonas', properties: 154000, density: 'low', path: 'M98 170 L176 150 L242 166 L232 228 L186 248 L122 236 L92 204 Z', tooltipX: 168, tooltipY: 198 },
  { uf: 'RR', name: 'Roraima', properties: 39000, density: 'low', path: 'M176 94 L220 88 L238 112 L228 144 L188 148 L168 124 Z', tooltipX: 204, tooltipY: 118 },
  { uf: 'PA', name: 'Para', properties: 880000, density: 'medium', path: 'M238 162 L332 150 L388 178 L378 236 L332 262 L256 248 L228 204 Z', tooltipX: 312, tooltipY: 204 },
  { uf: 'AP', name: 'Amapa', properties: 41000, density: 'low', path: 'M390 146 L422 150 L430 182 L408 198 L384 182 Z', tooltipX: 408, tooltipY: 170 },
  { uf: 'TO', name: 'Tocantins', properties: 348000, density: 'medium', path: 'M270 248 L326 242 L338 292 L302 324 L258 308 L248 270 Z', tooltipX: 292, tooltipY: 280 },
  { uf: 'MA', name: 'Maranhao', properties: 302000, density: 'medium', path: 'M334 228 L372 224 L392 252 L376 286 L342 292 L324 264 Z', tooltipX: 356, tooltipY: 254 },
  { uf: 'PI', name: 'Piaui', properties: 176000, density: 'low', path: 'M372 246 L410 240 L420 276 L396 304 L366 292 L362 264 Z', tooltipX: 390, tooltipY: 274 },
  { uf: 'CE', name: 'Ceara', properties: 265000, density: 'low', path: 'M414 236 L446 236 L456 258 L438 280 L414 272 Z', tooltipX: 434, tooltipY: 256 },
  { uf: 'RN', name: 'Rio Grande do Norte', properties: 92000, density: 'low', path: 'M454 236 L480 238 L486 252 L470 262 L454 254 Z', tooltipX: 470, tooltipY: 246 },
  { uf: 'PB', name: 'Paraiba', properties: 118000, density: 'low', path: 'M448 258 L476 262 L480 278 L454 286 L442 272 Z', tooltipX: 462, tooltipY: 272 },
  { uf: 'PE', name: 'Pernambuco', properties: 208000, density: 'low', path: 'M432 278 L470 288 L466 310 L430 308 L420 294 Z', tooltipX: 446, tooltipY: 294 },
  { uf: 'AL', name: 'Alagoas', properties: 124000, density: 'low', path: 'M426 308 L454 314 L450 336 L422 332 L416 318 Z', tooltipX: 438, tooltipY: 322 },
  { uf: 'SE', name: 'Sergipe', properties: 76000, density: 'low', path: 'M422 332 L444 338 L440 354 L420 350 L414 338 Z', tooltipX: 432, tooltipY: 344 },
  { uf: 'BA', name: 'Bahia', properties: 920000, density: 'high', path: 'M354 292 L424 294 L430 366 L392 420 L334 410 L312 354 L330 314 Z', tooltipX: 374, tooltipY: 352 },
  { uf: 'MT', name: 'Mato Grosso', properties: 1240000, density: 'high', path: 'M172 248 L254 240 L266 320 L208 354 L152 332 L144 280 Z', tooltipX: 206, tooltipY: 292 },
  { uf: 'MS', name: 'Mato Grosso do Sul', properties: 735000, density: 'high', path: 'M174 354 L226 346 L236 414 L188 450 L148 428 L146 382 Z', tooltipX: 192, tooltipY: 392 },
  { uf: 'GO', name: 'Goias', properties: 810000, density: 'high', path: 'M252 316 L312 324 L320 368 L282 396 L242 382 L236 340 Z', tooltipX: 278, tooltipY: 354 },
  { uf: 'DF', name: 'Distrito Federal', properties: 23000, density: 'low', path: 'M286 352 L294 348 L300 356 L292 364 Z', tooltipX: 306, tooltipY: 350 },
  { uf: 'MG', name: 'Minas Gerais', properties: 980000, density: 'high', path: 'M318 366 L382 370 L396 414 L356 446 L304 432 L292 394 Z', tooltipX: 346, tooltipY: 404 },
  { uf: 'ES', name: 'Espirito Santo', properties: 198000, density: 'medium', path: 'M392 390 L412 396 L414 430 L398 442 L386 422 Z', tooltipX: 408, tooltipY: 414 },
  { uf: 'RJ', name: 'Rio de Janeiro', properties: 144000, density: 'low', path: 'M376 438 L398 442 L404 456 L382 462 L370 450 Z', tooltipX: 388, tooltipY: 452 },
  { uf: 'SP', name: 'Sao Paulo', properties: 702000, density: 'high', path: 'M250 396 L304 404 L314 448 L268 472 L224 454 L220 420 Z', tooltipX: 270, tooltipY: 436 },
  { uf: 'PR', name: 'Parana', properties: 760000, density: 'high', path: 'M238 470 L284 458 L296 492 L254 516 L220 500 L214 480 Z', tooltipX: 258, tooltipY: 490 },
  { uf: 'SC', name: 'Santa Catarina', properties: 332000, density: 'medium', path: 'M258 514 L292 502 L300 524 L272 540 L248 530 Z', tooltipX: 274, tooltipY: 522 },
  { uf: 'RS', name: 'Rio Grande do Sul', properties: 640000, density: 'high', path: 'M236 538 L294 524 L318 566 L278 604 L222 592 L204 556 Z', tooltipX: 262, tooltipY: 566 },
]

const densityStyles: Record<
  Density,
  { fill: string; stroke: string; strokeWidth: number }
> = {
  high: { fill: '#1f5230', stroke: 'rgba(31,82,48,0.28)', strokeWidth: 1.1 },
  medium: { fill: '#52b788', stroke: 'rgba(31,82,48,0.22)', strokeWidth: 1.1 },
  low: { fill: '#D8F3DC', stroke: '#52b788', strokeWidth: 1.15 },
}

function formatProperties(value: number) {
  if (value >= 1_000_000) {
    return `${(value / 1_000_000).toLocaleString('pt-BR', {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    })}M`
  }

  return new Intl.NumberFormat('pt-BR').format(value)
}

export default function CoverageHeatmap() {
  const [hoveredState, setHoveredState] = useState<StateShape | null>(null)

  const topStates = useMemo(() => {
    return [...states]
      .sort((a, b) => b.properties - a.properties)
      .slice(0, 5)
  }, [])

  const topStateMax = topStates[0]?.properties ?? 1

  return (
    <section className="bg-white py-28">
      <Section
        eyebrow="Cobertura"
        title="Presentes em todo o Brasil"
        subtitle="Dados oficiais de 5.570 municípios, atualizados continuamente."
        contentClassName="mt-16"
      >
        <Reveal>
          <div className="grid gap-12 lg:grid-cols-[1fr_360px]">
            <div className="relative overflow-hidden rounded-[28px] border border-[rgba(22,33,19,0.08)] bg-[linear-gradient(180deg,#fbfcfb_0%,#f4f7f5_100%)] p-4 shadow-[0_1px_3px_rgba(22,33,19,0.05),0_18px_44px_rgba(22,33,19,0.06)] sm:p-6">
              <div className="absolute inset-0 bg-grid-dots opacity-60" />
              <div className="absolute inset-x-12 top-12 h-40 rounded-full bg-[radial-gradient(circle,rgba(82,183,136,0.10),transparent_70%)] blur-3xl" />

              <div className="relative">
                <svg
                  viewBox="0 0 520 620"
                  className="mx-auto w-full max-w-[520px]"
                  role="img"
                  aria-label="Mapa simplificado do Brasil por estado"
                >
                  {states.map((state) => {
                    const style = densityStyles[state.density]

                    return (
                      <path
                        key={state.uf}
                        d={state.path}
                        fill={style.fill}
                        stroke={style.stroke}
                        strokeWidth={style.strokeWidth}
                        className="cursor-pointer transition-all duration-200 hover:opacity-90"
                        onMouseEnter={() => setHoveredState(state)}
                        onMouseLeave={() => setHoveredState((current) => (current?.uf === state.uf ? null : current))}
                      />
                    )
                  })}
                </svg>

                <AnimatePresence>
                  {hoveredState && (
                    <motion.div
                      key={hoveredState.uf}
                      initial={{ opacity: 0, y: 10, scale: 0.94 }}
                      animate={{ opacity: 1, y: 0, scale: 1 }}
                      exit={{ opacity: 0, y: 8, scale: 0.96 }}
                      transition={{ type: 'spring', stiffness: 340, damping: 24, mass: 0.7 }}
                      className="pointer-events-none absolute z-20 w-[210px] rounded-2xl border border-[rgba(22,33,19,0.08)] bg-white/96 p-3 shadow-[0_12px_32px_rgba(22,33,19,0.14)] backdrop-blur"
                      style={{
                        left: hoveredState.tooltipX,
                        top: hoveredState.tooltipY,
                        transform: 'translate(-50%, -115%)',
                      }}
                    >
                      <p className="text-[11px] font-semibold uppercase tracking-[0.08em] text-[#4f6347]">
                        {hoveredState.uf}
                      </p>
                      <p className="mt-1 text-[15px] font-semibold text-[#162113]">
                        {hoveredState.name}
                      </p>
                      <p className="mt-2 text-[13px] leading-relaxed text-[#4f6347]">
                        {formatProperties(hoveredState.properties)} propriedades mapeadas
                      </p>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            </div>

            <div className="space-y-6">
              <div className="rounded-[28px] border border-[rgba(22,33,19,0.08)] bg-white p-6 shadow-[0_1px_3px_rgba(22,33,19,0.05),0_12px_36px_rgba(22,33,19,0.06)]">
                <p className="text-[11px] font-semibold uppercase tracking-[0.08em] text-[#4f6347]">
                  Legenda
                </p>
                <div className="mt-4 space-y-3">
                  <div className="flex items-center gap-3 text-[13px] text-[#4f6347]">
                    <span className="h-3 w-3 rounded-full bg-[#1f5230]" />
                    Alta densidade de propriedades
                  </div>
                  <div className="flex items-center gap-3 text-[13px] text-[#4f6347]">
                    <span className="h-3 w-3 rounded-full bg-[#52b788]" />
                    Média densidade de propriedades
                  </div>
                  <div className="flex items-center gap-3 text-[13px] text-[#4f6347]">
                    <span className="h-3 w-3 rounded-full border border-[#52b788] bg-[#D8F3DC]" />
                    Cobertura base nacional
                  </div>
                </div>
              </div>

              <div className="rounded-[28px] border border-[rgba(22,33,19,0.08)] bg-white p-6 shadow-[0_1px_3px_rgba(22,33,19,0.05),0_12px_36px_rgba(22,33,19,0.06)]">
                <div className="flex items-center justify-between gap-4">
                  <p className="text-[11px] font-semibold uppercase tracking-[0.08em] text-[#4f6347]">
                    Top 5 estados
                  </p>
                  <span className="rounded-full bg-[rgba(31,82,48,0.08)] px-3 py-1 text-[10px] font-semibold uppercase tracking-[0.08em] text-[#1f5230]">
                    por propriedades
                  </span>
                </div>

                <div className="mt-5 space-y-4">
                  {topStates.map((state, index) => {
                    const width = (state.properties / topStateMax) * 100

                    return (
                      <div key={state.uf}>
                        <div className="mb-1.5 flex items-end justify-between gap-3">
                          <div>
                            <p className="text-[13px] font-semibold text-[#162113]">
                              {index + 1}. {state.name}
                            </p>
                            <p className="text-[11px] uppercase tracking-[0.08em] text-[#9ca3af]">
                              {state.uf}
                            </p>
                          </div>
                          <span className="font-mono-tabular text-[13px] font-semibold text-[#1f5230]">
                            {formatProperties(state.properties)}
                          </span>
                        </div>
                        <div className="h-2 overflow-hidden rounded-full bg-[rgba(31,82,48,0.08)]">
                          <div
                            className="h-full rounded-full bg-[linear-gradient(90deg,#52b788_0%,#1f5230_100%)]"
                            style={{ width: `${width}%` }}
                          />
                        </div>
                      </div>
                    )
                  })}
                </div>
              </div>

              <div className="rounded-[28px] border border-[rgba(22,33,19,0.08)] bg-[linear-gradient(180deg,#ffffff_0%,#f7faf8_100%)] p-6 shadow-[0_1px_3px_rgba(22,33,19,0.05),0_12px_36px_rgba(22,33,19,0.06)]">
                <p className="text-[11px] font-semibold uppercase tracking-[0.08em] text-[#4f6347]">
                  Última atualização
                </p>
                <p className="mt-2 font-mono-tabular text-[15px] font-semibold text-[#162113]">
                  22 de abril, 2026
                </p>
                <p className="mt-3 text-[13px] leading-relaxed text-[#4f6347]">
                  Cobertura nacional consolidada a partir das bases oficiais integradas ao Talhão.
                </p>
                <Link
                  href="/mapa"
                  className="mt-5 inline-flex rounded-xl bg-[#1f5230] px-4 py-2.5 text-sm font-semibold text-white transition hover:bg-[#2a6b3f]"
                >
                  Ver cobertura detalhada →
                </Link>
              </div>
            </div>
          </div>
        </Reveal>
      </Section>
    </section>
  )
}
