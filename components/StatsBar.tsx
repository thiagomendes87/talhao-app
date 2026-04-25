'use client'

import { useRef } from 'react'
import { useInView } from 'framer-motion'
import useCountUp from '@/hooks/useCountUp'

const stats = [
  {
    value: 10.2,
    suffix: 'M+',
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
    suffix: 'M ha',
    label: 'área total mapeada',
    decimals: 0,
    locale: 'en-US',
  },
  {
    value: 4,
    suffix: '',
    label: 'fontes oficiais integradas (SICAR/SIGEF/SNCI/INPE)',
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
    <div className="relative text-center md:px-4">
      <p className="font-mono-tabular text-[48px] font-bold leading-none text-[#162113]">
        {count}
        {suffix}
      </p>
      <p className="mt-3 text-[13px] leading-relaxed text-[#4f6347]">{label}</p>

      {showDivider && (
        <div
          aria-hidden="true"
          className="absolute right-0 top-1/2 hidden h-20 w-px -translate-y-1/2 bg-[rgba(22,33,19,0.08)] md:block"
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
