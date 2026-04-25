'use client'

import Link from 'next/link'
import { type ReactNode, useMemo, useState } from 'react'
import Reveal from '@/components/ui/Reveal'
import Section from '@/components/ui/Section'

type BillingMode = 'monthly' | 'annual'

const credits = [
  { qty: 4, price: 'R$ 14', unit: 'R$ 3,50 / download' },
  { qty: 8, price: 'R$ 28', unit: 'R$ 3,50 / download' },
  { qty: 16, price: 'R$ 56', unit: 'R$ 3,50 / download' },
]

const freeItems = [
  'Mapa com 10M+ propriedades',
  'Busca por CAR ou município',
  'Visualização de topografia',
]

const proItems = [
  'Tudo do plano gratuito',
  'Downloads ilimitados por dia',
  'KML, Shapefile, GeoTIFF',
  'Mapas topográficos completos',
  'Suporte prioritário via WhatsApp',
]

const comparisonRows = [
  {
    feature: 'Downloads/mês',
    free: 'Explorar',
    pro: 'Ilimitados',
    credits: 'Sob demanda',
  },
  {
    feature: 'Formatos',
    free: 'Visualização',
    pro: 'KML · SHP · TIF',
    credits: 'KML · SHP · TIF',
  },
  {
    feature: 'Topografia',
    free: 'Consultar',
    pro: 'Completa',
    credits: 'Por download',
  },
  {
    feature: 'Suporte',
    free: 'Base',
    pro: 'Prioritário',
    credits: 'Padrão',
  },
  {
    feature: 'Validade',
    free: 'Sem prazo',
    pro: 'Assinatura ativa',
    credits: '12 meses',
  },
]

const planByMode = {
  monthly: {
    price: 'R$49',
    period: '/mês',
    note: '= R$3,50/download a partir de 14 downloads/mês',
    kicker: 'mensal',
    strike: null,
  },
  annual: {
    price: 'R$39',
    period: '/mês',
    note: 'cobrado em R$468/ano · 20% off ilustrativo',
    kicker: 'anual',
    strike: 'R$49',
  },
} satisfies Record<
  BillingMode,
  { price: string; period: string; note: string; kicker: string; strike: string | null }
>

function CheckBullet({ highlight = false }: { highlight?: boolean }) {
  return (
    <span
      className="flex h-5 w-5 flex-shrink-0 items-center justify-center rounded-full text-xs font-bold"
      style={{
        background: highlight ? 'rgba(134,239,172,0.16)' : 'rgba(31,82,48,0.10)',
        color: highlight ? '#86efac' : '#1f5230',
      }}
    >
      ✓
    </span>
  )
}

function MobileField({ label, value }: { label: string; value: ReactNode }) {
  return (
    <div className="flex items-start justify-between gap-4 border-b border-[rgba(22,33,19,0.06)] py-3 last:border-b-0">
      <span className="text-[11px] font-semibold uppercase tracking-[0.08em] text-[#9ca3af]">
        {label}
      </span>
      <div className="text-right text-[13px] text-[#162113]">{value}</div>
    </div>
  )
}

export default function Pricing() {
  const [billingMode, setBillingMode] = useState<BillingMode>('monthly')

  const proPlan = useMemo(() => planByMode[billingMode], [billingMode])

  return (
    <section
      id="precos"
      className="relative overflow-hidden bg-white py-28"
    >
      <div className="glow-green-right" />
      <div className="pointer-events-none absolute inset-0 bg-grid-dots opacity-60" />
      <div className="pointer-events-none absolute inset-x-0 top-14 mx-auto h-72 max-w-4xl rounded-full bg-[radial-gradient(circle,rgba(82,183,136,0.14),transparent_70%)] blur-3xl" />
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_80%_60%_at_50%_45%,transparent_42%,white_100%)]" />

      <Section
        eyebrow="Preços"
        title={
          <>
            Simples. Transparente.{' '}
            <span
              style={{
                background: 'linear-gradient(135deg, #1f5230, #52b788)',
                WebkitBackgroundClip: 'text',
                WebkitTextFillColor: 'transparent',
              }}
            >
              Sem surpresas.
            </span>
          </>
        }
        subtitle="Explore o mapa gratuitamente. Pague só quando precisar baixar — ou assine o Pro e baixe à vontade."
        className="relative z-10"
        contentClassName="mt-14"
      >
        <Reveal className="flex justify-center">
          <div className="inline-flex items-center gap-1 rounded-full border border-[rgba(22,33,19,0.08)] bg-white p-1 shadow-[0_8px_24px_rgba(22,33,19,0.05)]">
            <button
              type="button"
              onClick={() => setBillingMode('monthly')}
              className={`rounded-full px-4 py-2 text-sm font-semibold transition ${
                billingMode === 'monthly'
                  ? 'bg-[#1f5230] text-white'
                  : 'text-[#4f6347] hover:bg-[rgba(31,82,48,0.05)]'
              }`}
            >
              Mensal
            </button>
            <button
              type="button"
              onClick={() => setBillingMode('annual')}
              className={`rounded-full px-4 py-2 text-sm font-semibold transition ${
                billingMode === 'annual'
                  ? 'bg-[#1f5230] text-white'
                  : 'text-[#4f6347] hover:bg-[rgba(31,82,48,0.05)]'
              }`}
            >
              Anual
            </button>
            <span className="rounded-full bg-[rgba(31,82,48,0.08)] px-3 py-1 text-[11px] font-semibold uppercase tracking-[0.08em] text-[#1f5230]">
              20% off
            </span>
          </div>
        </Reveal>

        <div className="mt-16 grid grid-cols-1 gap-6 lg:grid-cols-2">
          <Reveal delay={0}>
            <div className="flex h-full flex-col rounded-[28px] border border-[rgba(22,33,19,0.10)] bg-white p-8 shadow-[0_1px_3px_rgba(22,33,19,0.06),0_12px_36px_rgba(22,33,19,0.05)] transition duration-300 hover:-translate-y-[3px] hover:border-[rgba(31,82,48,0.18)] hover:shadow-[0_8px_18px_rgba(22,33,19,0.08),0_24px_60px_rgba(22,33,19,0.08)]">
              <p className="mb-3 text-[11px] font-semibold uppercase tracking-[0.08em] text-[#9ca3af]">
                Gratuito
              </p>
              <div className="mb-1 flex items-end gap-2">
                <span className="font-mono-tabular text-5xl font-extrabold text-[#162113]">R$0</span>
              </div>
              <p className="mb-8 text-sm text-[#9ca3af]">para sempre, sem cartão</p>

              <ul className="mb-10 flex-1 space-y-3">
                {freeItems.map((item) => (
                  <li key={item} className="flex items-center gap-3 text-sm text-[#4f6347]">
                    <CheckBullet />
                    {item}
                  </li>
                ))}
              </ul>

              <Link
                href="/mapa"
                className="block w-full rounded-xl border border-[rgba(31,82,48,0.15)] bg-[rgba(31,82,48,0.07)] py-3 text-center text-sm font-semibold text-[#1f5230] transition hover:bg-[rgba(31,82,48,0.13)]"
              >
                Abrir mapa grátis →
              </Link>
            </div>
          </Reveal>

          <Reveal delay={0.08}>
            <div className="relative rounded-[28px] p-px">
              <span className="absolute inset-0 rounded-[28px] bg-[conic-gradient(from_180deg_at_50%_50%,rgba(82,183,136,0.04),rgba(134,239,172,0.95),rgba(31,82,48,0.45),rgba(82,183,136,0.04))] animate-[spin_8s_linear_infinite]" />
              <span className="absolute inset-0 rounded-[28px] shadow-[inset_0_0_40px_rgba(134,239,172,0.12)]" />

              <div className="relative m-px flex h-full flex-col rounded-[27px] bg-[linear-gradient(160deg,#0f2d1a_0%,#0a1a0e_100%)] p-8 shadow-[0_0_0_1px_rgba(82,183,136,0.08),0_8px_32px_rgba(31,82,48,0.35),0_0_80px_rgba(31,82,48,0.15)] transition duration-300 hover:-translate-y-[3px] hover:shadow-[0_0_0_1px_rgba(82,183,136,0.16),0_12px_48px_rgba(31,82,48,0.5),0_0_100px_rgba(31,82,48,0.22)]">
                <div className="absolute left-1/2 top-[-0.875rem] -translate-x-1/2 whitespace-nowrap rounded-full bg-[linear-gradient(135deg,#52b788,#1f5230)] px-4 py-1.5 text-xs font-bold uppercase tracking-wide text-white shadow-[0_2px_12px_rgba(31,82,48,0.5)]">
                  ✦ Mais popular
                </div>

                <div className="flex items-start justify-between gap-4">
                  <p className="text-[11px] font-semibold uppercase tracking-[0.08em] text-[rgba(82,183,136,0.72)]">
                    Pro
                  </p>
                  <span className="rounded-full bg-[rgba(82,183,136,0.12)] px-3 py-1 text-[10px] font-semibold uppercase tracking-[0.08em] text-[#86efac]">
                    {proPlan.kicker}
                  </span>
                </div>

                <div className="mt-3 flex items-end gap-2">
                  <span className="font-mono-tabular text-5xl font-extrabold text-[#f0fdf4]">
                    {proPlan.price}
                  </span>
                  <span className="mb-2 text-base text-[rgba(255,255,255,0.42)]">
                    {proPlan.period}
                  </span>
                </div>
                {proPlan.strike && (
                  <p className="mt-2 text-sm text-[rgba(255,255,255,0.35)] line-through">
                    {proPlan.strike}/mês
                  </p>
                )}
                <p className="mb-8 mt-2 text-xs font-medium text-[#52b788]">{proPlan.note}</p>

                <ul className="mb-10 flex-1 space-y-3">
                  {proItems.map((item, index) => (
                    <li
                      key={item}
                      className={`flex items-center gap-3 text-sm ${
                        index === 1 ? 'text-[#86efac]' : 'text-[rgba(240,253,244,0.78)]'
                      }`}
                    >
                      <CheckBullet highlight={index === 1} />
                      {index === 1 ? <strong>{item}</strong> : item}
                    </li>
                  ))}
                </ul>

                <Link
                  href="/assinar"
                  className="block w-full rounded-xl bg-[linear-gradient(135deg,#1f5230,#2a6b3f)] py-3.5 text-center text-sm font-bold text-white shadow-[0_2px_8px_rgba(31,82,48,0.5),0_0_24px_rgba(31,82,48,0.25)] transition hover:-translate-y-[1px] hover:shadow-[0_4px_16px_rgba(31,82,48,0.6),0_0_32px_rgba(31,82,48,0.35)]"
                >
                  Assinar Pro — {proPlan.price}/{billingMode === 'annual' ? 'mês no anual' : 'mês'} →
                </Link>
              </div>
            </div>
          </Reveal>
        </div>

        <Reveal delay={0.16}>
          <div className="mt-8 rounded-[28px] border border-[rgba(31,82,48,0.10)] bg-[rgba(31,82,48,0.04)] p-4 sm:p-5">
            <div className="mb-5 flex flex-col gap-2 sm:flex-row sm:items-end sm:justify-between">
              <div>
                <p className="text-[11px] font-semibold uppercase tracking-[0.08em] text-[#1f5230]">
                  Créditos sob demanda
                </p>
                <p className="mt-2 text-sm text-[#4f6347]">
                  Carregue créditos e use quando precisar. <strong className="text-[#162113]">R$3,50 por arquivo.</strong> Válidos por 1 ano. Sem mensalidade.
                </p>
              </div>
            </div>

            <div className="space-y-3 lg:hidden">
              {credits.map((credit) => (
                <div
                  key={credit.qty}
                  className="rounded-2xl border border-[rgba(22,33,19,0.08)] bg-white p-4 shadow-[0_1px_3px_rgba(22,33,19,0.04)]"
                >
                  <MobileField
                    label="Quantidade"
                    value={
                      <div>
                        <p className="font-mono-tabular text-[22px] font-semibold text-[#162113]">
                          {credit.qty}
                        </p>
                        <p className="text-[12px] text-[#4f6347]">downloads</p>
                      </div>
                    }
                  />
                  <MobileField
                    label="Preço"
                    value={
                      <span className="font-mono-tabular text-[18px] font-semibold text-[#162113]">
                        {credit.price}
                      </span>
                    }
                  />
                  <MobileField label="Por download" value={credit.unit} />
                  <Link
                    href="/carteira"
                    className="mt-4 inline-flex w-full items-center justify-center rounded-xl bg-[#1f5230] px-4 py-2.5 text-sm font-semibold text-white transition hover:bg-[#2a6b3f]"
                  >
                    Comprar
                  </Link>
                </div>
              ))}
            </div>

            <div className="hidden overflow-x-auto rounded-2xl border border-[rgba(22,33,19,0.08)] bg-white lg:block">
              <div className="min-w-[720px]">
                <div className="grid grid-cols-[1.15fr_1fr_1fr_0.9fr] border-b border-[rgba(22,33,19,0.06)] bg-[#fafbfa] px-5 py-3 text-[11px] font-semibold uppercase tracking-[0.08em] text-[#9ca3af]">
                  <span>Quantidade</span>
                  <span>Preço</span>
                  <span>Por download</span>
                  <span className="text-right">Ação</span>
                </div>

                {credits.map((credit) => (
                  <div
                    key={credit.qty}
                    className="grid grid-cols-[1.15fr_1fr_1fr_0.9fr] items-center border-b border-[rgba(22,33,19,0.06)] px-5 py-4 transition last:border-b-0 hover:bg-[#f7faf8]"
                  >
                    <div>
                      <p className="font-mono-tabular text-[22px] font-semibold text-[#162113]">
                        {credit.qty}
                      </p>
                      <p className="text-[12px] text-[#4f6347]">downloads</p>
                    </div>
                    <p className="font-mono-tabular text-[18px] font-semibold text-[#162113]">
                      {credit.price}
                    </p>
                    <p className="text-[13px] text-[#4f6347]">{credit.unit}</p>
                    <div className="flex justify-end">
                      <Link
                        href="/carteira"
                        className="rounded-xl bg-[#1f5230] px-4 py-2.5 text-sm font-semibold text-white transition hover:bg-[#2a6b3f]"
                      >
                        Comprar
                      </Link>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </Reveal>

        <Reveal delay={0.24}>
            <div className="mt-8 space-y-3 lg:hidden">
              {comparisonRows.map((row) => (
                <div
                  key={row.feature}
                  className="rounded-[24px] border border-[rgba(22,33,19,0.08)] bg-white p-4 shadow-[0_1px_3px_rgba(22,33,19,0.05)]"
                >
                  <p className="text-[13px] font-semibold text-[#162113]">{row.feature}</p>
                  <div className="mt-3">
                    <MobileField label="Free" value={row.free} />
                    <MobileField
                      label="Pro"
                      value={<span className="font-semibold text-[#1f5230]">{row.pro}</span>}
                    />
                    <MobileField label="Créditos" value={row.credits} />
                  </div>
                </div>
              ))}
            </div>

            <div className="mt-8 hidden overflow-x-auto rounded-[28px] border border-[rgba(22,33,19,0.08)] bg-white shadow-[0_1px_3px_rgba(22,33,19,0.05)] lg:block">
              <div className="min-w-[760px]">
                <div className="grid grid-cols-[1.35fr_repeat(3,minmax(0,1fr))] border-b border-[rgba(22,33,19,0.06)] bg-[#fafbfa]">
                  <div className="px-5 py-4 text-[11px] font-semibold uppercase tracking-[0.08em] text-[#9ca3af]">
                  Comparativo rápido
                </div>
                <div className="px-5 py-4 text-center text-[11px] font-semibold uppercase tracking-[0.08em] text-[#4f6347]">
                  Free
                </div>
                <div className="px-5 py-4 text-center text-[11px] font-semibold uppercase tracking-[0.08em] text-[#1f5230]">
                  Pro
                </div>
                <div className="px-5 py-4 text-center text-[11px] font-semibold uppercase tracking-[0.08em] text-[#4f6347]">
                  Créditos
                </div>
              </div>

              {comparisonRows.map((row) => (
                <div
                  key={row.feature}
                  className="grid grid-cols-[1.35fr_repeat(3,minmax(0,1fr))] border-b border-[rgba(22,33,19,0.06)] last:border-b-0"
                >
                  <div className="px-5 py-4 text-[13px] font-medium text-[#162113]">{row.feature}</div>
                  <div className="px-5 py-4 text-center text-[13px] text-[#4f6347]">{row.free}</div>
                  <div className="px-5 py-4 text-center text-[13px] font-semibold text-[#1f5230]">{row.pro}</div>
                  <div className="px-5 py-4 text-center text-[13px] text-[#4f6347]">{row.credits}</div>
                </div>
              ))}
            </div>
          </div>
        </Reveal>
      </Section>
    </section>
  )
}
