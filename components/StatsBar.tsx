'use client'

import { useRef } from 'react'
import { useInView } from 'framer-motion'
import useCountUp from '@/hooks/useCountUp'

const stats = [
  {
    value: 10.2,
    suffix: 'Mi+',
    label: 'propriedades rurais mapeadas',
    decimals: 1,
    locale: 'en-US',
  },
  {
    value: 5570,
    suffix: '',
    label: 'municípios cobertos',
    decimals: 0,
    locale: 'pt-BR',
  },
  {
    value: 851,
    suffix: 'Mi ha',
    label: 'área total mapeada',
    decimals: 0,
    locale: 'en-US',
  },
  {
    value: 4,
    suffix: '',
    label: 'fontes oficiais integradas',
    decimals: 0,
    locale: 'pt-BR',
  },
] as const

type StatCardProps = {
  value: number
  suffix: string
  label: string
  decimals: number
  locale: string
  isActive: boolean
  showDivider: boolean
}

function StatCard({
  value,
  suffix,
  label,
  decimals,
  locale,
  isActive,
  showDivider,
}: StatCardProps) {
  const count = useCountUp({
    end: value,
    duration: 1600,
    decimals,
    locale,
    enabled: isActive,
  })

  return (
    <div className="group relative overflow-hidden rounded-2xl border border-transparent px-4 py-6 text-center transition-all duration-300 ease-out hover:-translate-y-1 hover:border-[rgba(31,82,48,0.18)] hover:bg-[linear-gradient(180deg,#f7fbf8_0%,#f0faf4_100%)] hover:shadow-[0_8px_32px_rgba(31,82,48,0.10)] md:px-4">
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-x-8 top-6 h-16 rounded-full bg-[radial-gradient(ellipse,rgba(82,183,136,0.18),transparent_70%)] opacity-0 blur-2xl transition-opacity duration-300 group-hover:opacity-100"
      />

      <p className="relative whitespace-nowrap font-mono-tabular text-[48px] font-bold leading-none text-[#162113] transition-colors duration-300 group-hover:text-[#1f5230]">
        {count}
        <span className="ml-1 align-baseline text-[28px] font-semibold text-[#4f6347] transition-colors duration-300 group-hover:text-[#52b788]">
          {suffix}
        </span>
      </p>
      <p className="relative mt-3 text-[13px] leading-relaxed text-[#4f6347] transition-colors duration-300 group-hover:text-[#162113]">
        {label}
      </p>

      {showDivider && (
        <div
          aria-hidden="true"
          className="absolute right-0 top-1/2 hidden h-20 w-px -translate-y-1/2 bg-[rgba(22,33,19,0.08)] transition-opacity duration-300 group-hover:opacity-0 md:block"
        />
      )}
    </div>
  )
}

export default function StatsBar() {
  const ref = useRef<HTMLElement | null>(null)
  const isInView = useInView(ref, { once: true, margin: '-80px' })

  return (
    <section ref={ref} className="relative overflow-hidden bg-white py-24">
      <div className="glow-green-top" />

      <div className="relative z-10 mx-auto max-w-6xl px-6">
        <div className="grid grid-cols-1 gap-8 md:grid-cols-4">
          {stats.map((stat, index) => (
            <StatCard
              key={stat.label}
              value={stat.value}
              suffix={stat.suffix}
              label={stat.label}
              decimals={stat.decimals}
              locale={stat.locale}
              isActive={isInView}
              showDivider={index < stats.length - 1}
            />
          ))}
        </div>
      </div>
    </section>
  )
}
