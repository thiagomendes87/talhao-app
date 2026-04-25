'use client'

import Link from 'next/link'
import { AnimatePresence, motion } from 'framer-motion'
import { useMemo, useState } from 'react'
import Reveal from '@/components/ui/Reveal'
import Section from '@/components/ui/Section'

type Density = 'high' | 'medium' | 'low'

type UFHex = {
  uf: string
  name: string
  col: number
  row: number
  density: Density
}

type PositionedUFHex = UFHex & {
  cx: number
  cy: number
  leftPercent: number
  topPercent: number
}

const UF_GRID: UFHex[] = [
  { uf: 'RR', name: 'Roraima', col: 4, row: 0, density: 'low' },
  { uf: 'AP', name: 'Amapá', col: 6, row: 0, density: 'low' },
  { uf: 'AM', name: 'Amazonas', col: 2, row: 1, density: 'low' },
  { uf: 'PA', name: 'Pará', col: 4, row: 1, density: 'medium' },
  { uf: 'RN', name: 'Rio Grande do Norte', col: 7, row: 1, density: 'low' },
  { uf: 'AC', name: 'Acre', col: 1, row: 2, density: 'low' },
  { uf: 'RO', name: 'Rondônia', col: 2, row: 2, density: 'medium' },
  { uf: 'TO', name: 'Tocantins', col: 4, row: 2, density: 'medium' },
  { uf: 'MA', name: 'Maranhão', col: 5, row: 2, density: 'medium' },
  { uf: 'CE', name: 'Ceará', col: 6, row: 2, density: 'low' },
  { uf: 'PB', name: 'Paraíba', col: 7, row: 2, density: 'low' },
  { uf: 'MT', name: 'Mato Grosso', col: 3, row: 3, density: 'high' },
  { uf: 'PI', name: 'Piauí', col: 5, row: 3, density: 'low' },
  { uf: 'PE', name: 'Pernambuco', col: 6, row: 3, density: 'low' },
  { uf: 'MS', name: 'Mato Grosso do Sul', col: 2, row: 4, density: 'high' },
  { uf: 'GO', name: 'Goiás', col: 3, row: 4, density: 'high' },
  { uf: 'DF', name: 'Distrito Federal', col: 4, row: 4, density: 'low' },
  { uf: 'BA', name: 'Bahia', col: 5, row: 4, density: 'high' },
  { uf: 'AL', name: 'Alagoas', col: 6, row: 4, density: 'low' },
  { uf: 'SE', name: 'Sergipe', col: 5, row: 5, density: 'low' },
  { uf: 'SP', name: 'São Paulo', col: 3, row: 6, density: 'high' },
  { uf: 'MG', name: 'Minas Gerais', col: 4, row: 6, density: 'high' },
  { uf: 'ES', name: 'Espírito Santo', col: 5, row: 6, density: 'medium' },
  { uf: 'PR', name: 'Paraná', col: 3, row: 7, density: 'high' },
  { uf: 'RJ', name: 'Rio de Janeiro', col: 4, row: 7, density: 'low' },
  { uf: 'SC', name: 'Santa Catarina', col: 3, row: 8, density: 'medium' },
  { uf: 'RS', name: 'Rio Grande do Sul', col: 3, row: 9, density: 'high' },
]

const densityStyles: Record<Density, { fill: string; stroke: string; label: string }> = {
  high: { fill: '#1f5230', stroke: 'rgba(31,82,48,0.30)', label: 'Alta densidade' },
  medium: { fill: '#52b788', stroke: 'rgba(31,82,48,0.22)', label: 'Média densidade' },
  low: { fill: '#D8F3DC', stroke: '#52b788', label: 'Cobertura base' },
}

const HEX_RADIUS = 32
const HEX_WIDTH = HEX_RADIUS * 2
const HEX_HEIGHT = Math.sqrt(3) * HEX_RADIUS
const HEX_GAP = 4
const HEX_STEP_X = HEX_WIDTH * 0.75 + HEX_GAP
const HEX_STEP_Y = HEX_HEIGHT + HEX_GAP * 0.6
const SVG_PADDING_X = 52
const SVG_PADDING_Y = 46
const TOP_BAR_WIDTHS = [100, 92, 86, 78, 72]
const TOP_STATE_ORDER = ['MT', 'MS', 'GO', 'BA', 'MG', 'SP', 'PR', 'RS']

const HEX_PATH = [
  `M ${-HEX_RADIUS} 0`,
  `L ${-HEX_RADIUS / 2} ${-HEX_HEIGHT / 2}`,
  `L ${HEX_RADIUS / 2} ${-HEX_HEIGHT / 2}`,
  `L ${HEX_RADIUS} 0`,
  `L ${HEX_RADIUS / 2} ${HEX_HEIGHT / 2}`,
  `L ${-HEX_RADIUS / 2} ${HEX_HEIGHT / 2}`,
  'Z',
].join(' ')

const POSITIONED_UFS = (() => {
  const positioned = UF_GRID.map((state) => {
    const cx = SVG_PADDING_X + state.col * HEX_STEP_X
    const cy =
      SVG_PADDING_Y +
      state.row * HEX_STEP_Y +
      (state.col % 2 === 0 ? 0 : HEX_STEP_Y / 2)

    return {
      ...state,
      cx,
      cy,
    }
  })

  const maxX = Math.max(...positioned.map((state) => state.cx))
  const maxY = Math.max(...positioned.map((state) => state.cy))
  const svgWidth = maxX + HEX_RADIUS + SVG_PADDING_X
  const svgHeight = maxY + HEX_HEIGHT / 2 + SVG_PADDING_Y

  return {
    states: positioned.map((state) => ({
      ...state,
      leftPercent: (state.cx / svgWidth) * 100,
      topPercent: (state.cy / svgHeight) * 100,
    })),
    svgWidth,
    svgHeight,
  }
})()

export default function CoverageHeatmap() {
  const [hoveredUf, setHoveredUf] = useState<string | null>(null)

  const hoveredState = useMemo(
    () => POSITIONED_UFS.states.find((state) => state.uf === hoveredUf) ?? null,
    [hoveredUf],
  )

  const topStates = useMemo(() => {
    return TOP_STATE_ORDER.map((uf) =>
      POSITIONED_UFS.states.find((state) => state.uf === uf),
    )
      .filter((state): state is PositionedUFHex => Boolean(state))
      .slice(0, 5)
  }, [])

  return (
    <section className="bg-white py-28">
      <Section
        eyebrow="Cobertura"
        title="Presentes em todo o Brasil"
        subtitle="Dados oficiais de 5.570 municípios, atualizados continuamente"
        contentClassName="mt-16"
      >
        <Reveal>
          <div className="grid gap-12 lg:grid-cols-[1fr_360px]">
            <div className="relative overflow-hidden rounded-[28px] border border-[rgba(22,33,19,0.08)] bg-[linear-gradient(180deg,#fbfcfb_0%,#f4f7f5_100%)] p-4 shadow-[0_1px_3px_rgba(22,33,19,0.05),0_18px_44px_rgba(22,33,19,0.06)] sm:p-6">
              <div className="absolute inset-0 bg-grid-dots opacity-60" />
              <div className="absolute inset-x-12 top-12 h-40 rounded-full bg-[radial-gradient(circle,rgba(82,183,136,0.10),transparent_70%)] blur-3xl" />

              <div className="relative">
                <div
                  className="relative mx-auto w-full max-w-[480px]"
                  onMouseLeave={() => setHoveredUf(null)}
                >
                  <svg
                    viewBox={`0 0 ${POSITIONED_UFS.svgWidth} ${POSITIONED_UFS.svgHeight}`}
                    className="mx-auto w-full h-auto"
                    role="img"
                    aria-label="Mapa hexagonal do Brasil com cobertura por UF"
                  >
                    {POSITIONED_UFS.states.map((state) => {
                      const style = densityStyles[state.density]
                      const textColor =
                        state.density === 'low' ? '#1f5230' : '#ffffff'

                      return (
                        <g key={state.uf} transform={`translate(${state.cx}, ${state.cy})`}>
                          <motion.g
                            initial={{ opacity: 0, y: -8, scale: 0.92 }}
                            whileInView={{ opacity: 1, y: 0, scale: 1 }}
                            whileHover={{ scale: 1.04 }}
                            viewport={{ once: true, margin: '-80px' }}
                            transition={{
                              delay: state.row * 0.06,
                              duration: 0.42,
                              ease: [0.16, 1, 0.3, 1],
                            }}
                            style={{
                              filter:
                                hoveredState?.uf === state.uf ? 'brightness(1.1)' : 'brightness(1)',
                              transformBox: 'fill-box',
                              transformOrigin: 'center',
                            }}
                            className="cursor-pointer"
                            onMouseEnter={() => setHoveredUf(state.uf)}
                            onFocus={() => setHoveredUf(state.uf)}
                            onBlur={() => setHoveredUf((current) => (current === state.uf ? null : current))}
                          >
                            <path
                              d={HEX_PATH}
                              fill={style.fill}
                              stroke={style.stroke}
                              strokeWidth={1.15}
                              vectorEffect="non-scaling-stroke"
                            />
                            <text
                              textAnchor="middle"
                              dominantBaseline="central"
                              fill={textColor}
                              fontSize="11"
                              fontWeight="700"
                              style={{ fontVariantNumeric: 'tabular-nums' }}
                              className="pointer-events-none"
                            >
                              {state.uf}
                            </text>
                          </motion.g>
                        </g>
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
                        className="pointer-events-none absolute z-20 w-[220px] rounded-2xl border border-[rgba(22,33,19,0.08)] bg-white/96 p-3 shadow-[0_12px_32px_rgba(22,33,19,0.14)] backdrop-blur"
                        style={{
                          left: `${hoveredState.leftPercent}%`,
                          top: `${hoveredState.topPercent}%`,
                          transform: 'translate(-50%, -118%)',
                        }}
                      >
                        <p className="text-[11px] font-semibold uppercase tracking-[0.08em] text-[#4f6347]">
                          {hoveredState.uf}
                        </p>
                        <p className="mt-1 text-[15px] font-semibold text-[#162113]">
                          {hoveredState.name}
                        </p>
                        <p className="mt-2 text-[13px] leading-relaxed text-[#4f6347]">
                          {densityStyles[hoveredState.density].label}
                        </p>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
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
                <p className="text-[11px] font-semibold uppercase tracking-[0.08em] text-[#4f6347]">
                  Estados com maior cobertura
                </p>

                <div className="mt-5 space-y-4">
                  {topStates.map((state, index) => (
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
                        <span className="font-mono-tabular text-[11px] font-semibold text-[#1f5230]">
                          {densityStyles[state.density].label}
                        </span>
                      </div>
                      <div className="h-2 overflow-hidden rounded-full bg-[rgba(31,82,48,0.08)]">
                        <div
                          className="h-full rounded-full bg-[linear-gradient(90deg,#52b788_0%,#1f5230_100%)]"
                          style={{ width: `${TOP_BAR_WIDTHS[index] ?? TOP_BAR_WIDTHS.at(-1) ?? 72}%` }}
                        />
                      </div>
                    </div>
                  ))}
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
