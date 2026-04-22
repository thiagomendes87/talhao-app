import Link from 'next/link'

const stats = [
  { value: '10M+', label: 'propriedades no mapa' },
  { value: 'R$3,50', label: 'por download' },
  { value: '3', label: 'fontes oficiais' },
  { value: '100%', label: 'dados do governo federal' },
]

export default function CTASection() {
  return (
    <section
      className="relative overflow-hidden px-6 py-28"
      style={{ background: '#0a1a0e' }}
    >
      <div
        className="pointer-events-none absolute inset-0"
        style={{
          background:
            'radial-gradient(ellipse 60% 70% at 50% 100%, rgba(31,82,48,0.5), transparent)',
        }}
      />

      <div className="relative mx-auto max-w-4xl text-center">
        <div className="mb-20 grid grid-cols-2 gap-6 md:grid-cols-4">
          {stats.map((s) => (
            <div key={s.label} className="text-center">
              <div
                className="mb-1 text-3xl font-extrabold"
                style={{
                  background: 'linear-gradient(135deg, #f0fdf4, #86efac)',
                  WebkitBackgroundClip: 'text',
                  WebkitTextFillColor: 'transparent',
                }}
              >
                {s.value}
              </div>
              <div className="text-xs" style={{ color: 'rgba(240,253,244,0.45)' }}>
                {s.label}
              </div>
            </div>
          ))}
        </div>

        <h2 className="mb-6 text-4xl font-extrabold leading-tight md:text-6xl" style={{ color: '#f0fdf4' }}>
          Comece agora.
          <br />
          <span
            style={{
              background: 'linear-gradient(135deg, #52b788, #86efac)',
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent',
            }}
          >
            É gratuito.
          </span>
        </h2>
        <p className="mx-auto mb-10 max-w-lg text-base" style={{ color: 'rgba(240,253,244,0.55)' }}>
          Explore o mapa sem criar conta. Cadastre-se só quando quiser baixar o primeiro arquivo.
        </p>

        <div className="flex flex-col items-center justify-center gap-4 sm:flex-row">
          <Link
            href="/mapa"
            className="w-full rounded-xl px-8 py-4 text-center text-base font-bold text-white transition-all duration-200 sm:w-auto hover:-translate-y-[2px] hover:shadow-[0_4px_20px_rgba(31,82,48,0.65),0_0_60px_rgba(31,82,48,0.3)]"
            style={{
              background: 'linear-gradient(135deg, #1f5230, #2a6b3f)',
              boxShadow: '0 2px 12px rgba(31,82,48,0.5), 0 0 40px rgba(31,82,48,0.2)',
            }}
          >
            Abrir mapa gratuitamente →
          </Link>
          <Link
            href="/assinar"
            className="w-full rounded-xl px-8 py-4 text-center text-base font-bold transition-all duration-200 sm:w-auto hover:bg-[rgba(255,255,255,0.10)] hover:border-[rgba(255,255,255,0.20)]"
            style={{
              background: 'rgba(255,255,255,0.06)',
              color: '#f0fdf4',
              border: '1px solid rgba(255,255,255,0.12)',
            }}
          >
            Ver plano Pro — R$49/mês
          </Link>
        </div>
      </div>
    </section>
  )
}
