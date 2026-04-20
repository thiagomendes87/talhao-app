'use client'

import Link from 'next/link'

const credits = [
  { qty: 4, price: 'R$ 14', unit: 'R$ 3,50 / download' },
  { qty: 8, price: 'R$ 28', unit: 'R$ 3,50 / download' },
  { qty: 16, price: 'R$ 56', unit: 'R$ 3,50 / download' },
]

const freeItems = ['Mapa com 10M+ propriedades', 'Busca por CAR ou município', 'Visualização de topografia']
const proItems = [
  'Tudo do plano gratuito',
  'Downloads ilimitados por dia',
  'KML, Shapefile, GeoTIFF',
  'Mapas topográficos completos',
  'Suporte prioritário via WhatsApp',
]

export default function Pricing() {
  return (
    <section
      id="precos"
      className="relative overflow-hidden px-6 py-28"
      style={{ background: '#ffffff' }}
    >
      <div
        className="pointer-events-none absolute inset-0"
        style={{
          backgroundImage:
            'linear-gradient(rgba(31,82,48,0.04) 1px, transparent 1px), linear-gradient(90deg, rgba(31,82,48,0.04) 1px, transparent 1px)',
          backgroundSize: '40px 40px',
        }}
      />
      <div
        className="pointer-events-none absolute inset-0"
        style={{
          background:
            'radial-gradient(ellipse 80% 60% at 50% 50%, transparent 40%, white 100%)',
        }}
      />

      <div className="relative mx-auto max-w-5xl">
        <div className="mb-16 text-center">
          <p className="mb-4 text-xs font-bold uppercase tracking-widest" style={{ color: '#1f5230' }}>
            Preços
          </p>
          <h2 className="mb-4 text-4xl font-extrabold leading-tight md:text-5xl" style={{ color: '#162113' }}>
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
          </h2>
          <p className="mx-auto max-w-lg text-base text-gray-500">
            Explore o mapa gratuitamente. Pague só quando precisar baixar — ou assine o Pro e baixe à vontade.
          </p>
        </div>

        <div className="mb-12 grid grid-cols-1 gap-6 md:grid-cols-2">
          <div
            className="flex flex-col rounded-2xl p-8 transition-all duration-300"
            style={{
              background: '#ffffff',
              border: '1px solid rgba(22,33,19,0.10)',
              boxShadow: '0 1px 3px rgba(22,33,19,0.06), 0 8px 32px rgba(22,33,19,0.05)',
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.boxShadow = '0 4px 8px rgba(22,33,19,0.08), 0 16px 48px rgba(22,33,19,0.10)'
              e.currentTarget.style.transform = 'translateY(-3px)'
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.boxShadow = '0 1px 3px rgba(22,33,19,0.06), 0 8px 32px rgba(22,33,19,0.05)'
              e.currentTarget.style.transform = 'translateY(0)'
            }}
          >
            <p className="mb-3 text-xs font-bold uppercase tracking-widest" style={{ color: '#9ca3af' }}>
              Gratuito
            </p>
            <div className="mb-1 flex items-end gap-2">
              <span className="text-5xl font-extrabold" style={{ color: '#162113' }}>R$0</span>
            </div>
            <p className="mb-8 text-sm" style={{ color: '#9ca3af' }}>para sempre, sem cartão</p>
            <ul className="mb-10 flex-1 space-y-3">
              {freeItems.map((item) => (
                <li key={item} className="flex items-center gap-3 text-sm" style={{ color: '#4f6347' }}>
                  <span
                    className="flex h-5 w-5 flex-shrink-0 items-center justify-center rounded-full text-xs"
                    style={{ background: 'rgba(31,82,48,0.10)', color: '#1f5230' }}
                  >
                    ✓
                  </span>
                  {item}
                </li>
              ))}
            </ul>
            <Link
              href="/mapa"
              className="block w-full rounded-xl py-3 text-center text-sm font-semibold transition-all duration-200"
              style={{
                background: 'rgba(31,82,48,0.07)',
                color: '#1f5230',
                border: '1px solid rgba(31,82,48,0.15)',
              }}
              onMouseEnter={(e) => {
                const el = e.currentTarget as HTMLAnchorElement
                el.style.background = 'rgba(31,82,48,0.13)'
              }}
              onMouseLeave={(e) => {
                const el = e.currentTarget as HTMLAnchorElement
                el.style.background = 'rgba(31,82,48,0.07)'
              }}
            >
              Abrir mapa grátis →
            </Link>
          </div>

          <div
            className="relative flex flex-col rounded-2xl p-8 transition-all duration-300"
            style={{
              background: 'linear-gradient(160deg, #0f2d1a 0%, #0a1a0e 100%)',
              border: '1px solid rgba(82,183,136,0.25)',
              boxShadow: '0 0 0 1px rgba(82,183,136,0.08), 0 8px 32px rgba(31,82,48,0.35), 0 0 80px rgba(31,82,48,0.15)',
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.boxShadow = '0 0 0 1px rgba(82,183,136,0.15), 0 12px 48px rgba(31,82,48,0.5), 0 0 100px rgba(31,82,48,0.2)'
              e.currentTarget.style.transform = 'translateY(-3px)'
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.boxShadow = '0 0 0 1px rgba(82,183,136,0.08), 0 8px 32px rgba(31,82,48,0.35), 0 0 80px rgba(31,82,48,0.15)'
              e.currentTarget.style.transform = 'translateY(0)'
            }}
          >
            <div
              className="absolute left-1/2 top-[-0.875rem] -translate-x-1/2 whitespace-nowrap rounded-full px-4 py-1.5 text-xs font-bold uppercase tracking-wide"
              style={{
                background: 'linear-gradient(135deg, #52b788, #1f5230)',
                color: '#ffffff',
                boxShadow: '0 2px 12px rgba(31,82,48,0.5)',
              }}
            >
              ✦ Mais popular
            </div>

            <p className="mb-3 text-xs font-bold uppercase tracking-widest" style={{ color: 'rgba(82,183,136,0.7)' }}>
              Pro
            </p>
            <div className="mb-1 flex items-end gap-2">
              <span className="text-5xl font-extrabold" style={{ color: '#f0fdf4' }}>R$49</span>
              <span className="mb-2 text-base" style={{ color: 'rgba(255,255,255,0.4)' }}>/mês</span>
            </div>
            <p className="mb-8 text-xs font-medium" style={{ color: '#52b788' }}>
              = R$3,50/download a partir de 14 downloads/mês
            </p>
            <ul className="mb-10 flex-1 space-y-3">
              {proItems.map((item, i) => (
                <li
                  key={item}
                  className="flex items-center gap-3 text-sm"
                  style={{ color: i === 1 ? '#86efac' : 'rgba(240,253,244,0.75)' }}
                >
                  <span
                    className="flex h-5 w-5 flex-shrink-0 items-center justify-center rounded-full text-xs font-bold"
                    style={{ background: 'rgba(82,183,136,0.2)', color: '#52b788' }}
                  >
                    ✓
                  </span>
                  {i === 1 ? <strong style={{ color: '#86efac' }}>{item}</strong> : item}
                </li>
              ))}
            </ul>
            <Link
              href="/assinar"
              className="block w-full rounded-xl py-3.5 text-center text-sm font-bold transition-all duration-200"
              style={{
                background: 'linear-gradient(135deg, #1f5230, #2a6b3f)',
                color: '#ffffff',
                boxShadow: '0 2px 8px rgba(31,82,48,0.5), 0 0 24px rgba(31,82,48,0.25)',
              }}
              onMouseEnter={(e) => {
                const el = e.currentTarget as HTMLAnchorElement
                el.style.boxShadow = '0 4px 16px rgba(31,82,48,0.6), 0 0 32px rgba(31,82,48,0.35)'
                el.style.transform = 'translateY(-1px)'
              }}
              onMouseLeave={(e) => {
                const el = e.currentTarget as HTMLAnchorElement
                el.style.boxShadow = '0 2px 8px rgba(31,82,48,0.5), 0 0 24px rgba(31,82,48,0.25)'
                el.style.transform = 'translateY(0)'
              }}
            >
              Assinar Pro — R$49/mês →
            </Link>
          </div>
        </div>

        <div
          className="rounded-2xl px-8 py-7"
          style={{
            background: 'rgba(31,82,48,0.04)',
            border: '1px solid rgba(31,82,48,0.10)',
          }}
        >
          <div className="flex flex-col gap-6 sm:flex-row sm:items-center">
            <div className="flex-1">
              <p className="mb-1.5 text-xs font-bold uppercase tracking-widest" style={{ color: '#1f5230' }}>
                Prefere pagar por download?
              </p>
              <p className="text-sm" style={{ color: '#4f6347' }}>
                Carregue créditos e use quando precisar. <strong style={{ color: '#162113' }}>R$3,50 por arquivo.</strong> Válidos por 1 ano. Sem mensalidade.
              </p>
            </div>
            <div className="flex flex-wrap gap-2">
              {credits.map((c) => (
                <div
                  key={c.qty}
                  className="rounded-xl px-4 py-2.5 text-center"
                  style={{
                    background: '#ffffff',
                    border: '1px solid rgba(22,33,19,0.10)',
                    minWidth: '90px',
                  }}
                >
                  <div className="text-base font-extrabold" style={{ color: '#162113' }}>{c.price}</div>
                  <div className="text-xs" style={{ color: '#9ca3af' }}>{c.qty} downloads</div>
                </div>
              ))}
              <Link
                href="/carteira"
                className="flex items-center gap-1.5 rounded-xl px-5 py-2.5 text-sm font-bold transition-all duration-200"
                style={{
                  background: '#1f5230',
                  color: '#ffffff',
                  boxShadow: '0 2px 8px rgba(31,82,48,0.3)',
                }}
              >
                Comprar créditos →
              </Link>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
