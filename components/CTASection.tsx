import Link from 'next/link'

export default function CTASection() {
  return (
    <section className="relative overflow-hidden bg-white px-6 py-32">
      <div className="glow-green-strong" />

      <div className="pointer-events-none absolute inset-x-0 top-1/2 z-0 -translate-y-1/2">
        <div className="mx-auto flex max-w-3xl justify-center">
          <svg
            viewBox="0 0 720 360"
            className="h-auto w-full max-w-[640px] opacity-[0.16]"
            fill="none"
            aria-hidden="true"
          >
            <polygon
              points="126,210 210,108 382,88 552,160 514,278 302,296"
              fill="rgba(216,243,220,0.18)"
              stroke="rgba(31,82,48,0.22)"
              strokeWidth="2"
            />
            <path
              d="M126 210 L210 108 L382 88 L552 160 L514 278 L302 296 Z"
              stroke="rgba(31,82,48,0.38)"
              strokeWidth="2.2"
              strokeDasharray="10 12"
              strokeLinecap="round"
            >
              <animate
                attributeName="stroke-dashoffset"
                from="0"
                to="132"
                dur="6s"
                repeatCount="indefinite"
              />
            </path>
            <path
              d="M168 228 L244 142 L378 128 L500 176 L470 254 L314 268 Z"
              stroke="rgba(82,183,136,0.34)"
              strokeWidth="1.6"
              strokeDasharray="8 10"
              strokeLinecap="round"
            >
              <animate
                attributeName="stroke-dashoffset"
                from="118"
                to="0"
                dur="6s"
                repeatCount="indefinite"
              />
            </path>
            <circle cx="382" cy="88" r="6" fill="rgba(82,183,136,0.38)" />
            <circle cx="514" cy="278" r="6" fill="rgba(82,183,136,0.28)" />
            <circle cx="126" cy="210" r="6" fill="rgba(31,82,48,0.24)" />
          </svg>
        </div>
      </div>

      <div className="relative z-10 mx-auto max-w-3xl text-center">
        <div
          className="mb-5 inline-flex items-center gap-2 rounded-full border border-[rgba(31,82,48,0.18)] bg-[linear-gradient(135deg,#f0faf4,#e3f5e9)] px-4 py-2"
          style={{
            boxShadow:
              '0 1px 2px rgba(31,82,48,0.08), 0 4px 16px rgba(31,82,48,0.06)',
          }}
        >
          <span className="inline-block h-1.5 w-1.5 rounded-full bg-[#1f5230] animate-pulse" />
          <span className="text-[12px] font-semibold uppercase tracking-[0.14em] text-[#1f5230]">
            Comece agora
          </span>
        </div>

        <h2 className="mx-auto max-w-4xl text-5xl font-extrabold leading-[0.95] tracking-[-0.03em] text-[#162113] sm:text-6xl md:text-7xl">
          <span className="block md:block">Acesse qualquer talhão</span>
          <span className="block md:inline">do seu interesse em 30 </span>
          <span
            className="block md:inline"
            style={{
              background: 'linear-gradient(135deg, #1f5230 0%, #52b788 100%)',
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent',
            }}
          >
            segundos.
          </span>
        </h2>

        <p className="mx-auto mt-6 max-w-2xl text-base leading-relaxed text-[#4f6347] md:text-lg">
          Navegue grátis. Baixe quando precisar. Sem cadastro para começar.
        </p>

        <div className="mt-10 flex flex-wrap items-center justify-center gap-4">
          <Link
            href="/mapa"
            className="inline-flex min-w-[220px] items-center justify-center rounded-xl bg-[#1f5230] px-7 py-3.5 text-base font-semibold text-white shadow-[0_12px_32px_rgba(31,82,48,0.22)] transition hover:-translate-y-[1px] hover:bg-[#2a6b3f] hover:shadow-[0_18px_42px_rgba(31,82,48,0.28)]"
          >
            Abrir mapa grátis →
          </Link>
          <Link
            href="/#precos"
            className="inline-flex min-w-[180px] items-center justify-center rounded-xl border border-[rgba(31,82,48,0.20)] bg-white px-7 py-3.5 text-base font-semibold text-[#1f5230] transition hover:border-[rgba(31,82,48,0.32)] hover:bg-[rgba(31,82,48,0.03)]"
          >
            Ver planos
          </Link>
        </div>
      </div>
    </section>
  )
}
