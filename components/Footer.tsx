import Link from 'next/link'

const productLinks = [
  { label: 'Mapa', href: '/mapa' },
  { label: 'Preços', href: '/#precos' },
  { label: 'FAQ', href: '/#faq' },
  { label: 'API', href: '#', badge: 'em breve' },
]

const companyLinks = [
  { label: 'Sobre', href: '#' },
  { label: 'Blog', href: '#' },
  { label: 'Contato', href: 'mailto:contato@talhao.ai' },
]

const legalLinks = [
  { label: 'Termos', href: '#' },
  { label: 'Privacidade', href: '#' },
  { label: 'Cookies', href: '#' },
]

const socialLinks = [
  {
    label: 'LinkedIn',
    href: '#',
    icon: (
      <svg viewBox="0 0 24 24" className="h-5 w-5" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
        <path d="M16 8a6 6 0 0 1 6 6v7h-4v-7a2 2 0 0 0-4 0v7h-4v-7a6 6 0 0 1 6-6Z" />
        <rect x="2" y="9" width="4" height="12" />
        <circle cx="4" cy="4" r="2" />
      </svg>
    ),
  },
  {
    label: 'Instagram',
    href: '#',
    icon: (
      <svg viewBox="0 0 24 24" className="h-5 w-5" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
        <rect x="3" y="3" width="18" height="18" rx="5" />
        <circle cx="12" cy="12" r="4" />
        <circle cx="17.5" cy="6.5" r="0.75" fill="currentColor" stroke="none" />
      </svg>
    ),
  },
  {
    label: 'WhatsApp',
    href: 'https://wa.me/5511530433330?text=Olá%2C%20gostaria%20de%20saber%20mais%20sobre%20o%20Talhão',
    icon: (
      <svg viewBox="0 0 24 24" className="h-5 w-5" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
        <path d="M20 11.5A8.5 8.5 0 0 1 7.6 19l-3.6 1 1.1-3.5A8.5 8.5 0 1 1 20 11.5Z" />
        <path d="M9.5 9.5c.4-.9.8-.9 1.1-.9.2 0 .4 0 .6.5l.5 1.3c.1.3 0 .5-.2.7l-.4.4c-.2.2-.2.4-.1.6.4.8 1.1 1.5 1.9 1.9.2.1.4.1.6-.1l.4-.4c.2-.2.4-.3.7-.2l1.3.5c.5.2.5.4.5.6 0 .3 0 .7-.9 1.1-.7.3-1.4.3-2.1 0a8.2 8.2 0 0 1-4.1-4.1c-.3-.7-.3-1.4 0-2.1Z" />
      </svg>
    ),
  },
]

function FooterLink({
  href,
  label,
  badge,
}: {
  href: string
  label: string
  badge?: string
}) {
  const classes =
    'inline-flex items-center gap-2 text-[13px] text-[#4f6347] transition-colors hover:text-[#1f5230]'

  const content = (
    <>
      <span>{label}</span>
      {badge && (
        <span className="rounded-full bg-[rgba(31,82,48,0.08)] px-2 py-0.5 text-[10px] font-semibold uppercase tracking-[0.08em] text-[#1f5230]">
          {badge}
        </span>
      )}
    </>
  )

  if (href.startsWith('/') || href.startsWith('#')) {
    return (
      <Link href={href} className={classes}>
        {content}
      </Link>
    )
  }

  return (
    <a
      href={href}
      className={classes}
      target={href.startsWith('http') ? '_blank' : undefined}
      rel={href.startsWith('http') ? 'noopener noreferrer' : undefined}
    >
      {content}
    </a>
  )
}

export default function Footer() {
  return (
    <footer className="border-t border-[rgba(22,33,19,0.08)] bg-white px-6 pt-16">
      <div className="mx-auto max-w-6xl">
        <div className="grid grid-cols-1 gap-12 pb-14 md:grid-cols-[2fr_1fr_1fr_1fr]">
          <div className="max-w-md">
            <Link href="/" className="inline-flex items-center gap-2">
              <img
                src="/logo-oficial.png"
                alt="Talhão"
                className="h-16 w-16 object-contain"
              />
              <span className="text-[22px] font-semibold tracking-[-0.02em] text-[#162113]">
                Talhão
              </span>
            </Link>

            <p className="mt-4 text-[14px] leading-relaxed text-[#4f6347]">
              Dados geoespaciais oficiais do Brasil em segundos.
            </p>

            <div className="mt-5 flex flex-wrap items-center gap-2">
              <span className="rounded-full bg-[rgba(31,82,48,0.08)] px-3 py-1.5 font-mono-tabular text-[11px] text-[#1f5230]">
                Fontes oficiais: SICAR · SIGEF · SNCI · INPE
              </span>
              <span className="rounded-full border border-[rgba(31,82,48,0.12)] bg-[#f4f7f5] px-3 py-1.5 text-[11px] font-semibold text-[#1f5230]">
                LGPD ✓
              </span>
            </div>
          </div>

          <div>
            <h3 className="text-[12px] font-semibold uppercase tracking-[0.08em] text-[#9ca3af]">
              Produto
            </h3>
            <div className="mt-4 flex flex-col gap-3">
              {productLinks.map((link) => (
                <FooterLink key={link.label} {...link} />
              ))}
            </div>
          </div>

          <div>
            <h3 className="text-[12px] font-semibold uppercase tracking-[0.08em] text-[#9ca3af]">
              Empresa
            </h3>
            <div className="mt-4 flex flex-col gap-3">
              {companyLinks.map((link) => (
                <FooterLink key={link.label} {...link} />
              ))}
            </div>
          </div>

          <div>
            <h3 className="text-[12px] font-semibold uppercase tracking-[0.08em] text-[#9ca3af]">
              Legal
            </h3>
            <div className="mt-4 flex flex-col gap-3">
              {legalLinks.map((link) => (
                <FooterLink key={link.label} {...link} />
              ))}
            </div>
          </div>
        </div>

        <div className="flex flex-col gap-4 border-t border-[rgba(22,33,19,0.08)] py-6 md:flex-row md:items-center md:justify-between">
          <p className="text-[13px] text-[#4f6347]">© 2026 Talhão.ai</p>

          <div className="flex items-center gap-4">
            {socialLinks.map((social) => (
              <a
                key={social.label}
                href={social.href}
                aria-label={social.label}
                target={social.href.startsWith('http') ? '_blank' : undefined}
                rel={social.href.startsWith('http') ? 'noopener noreferrer' : undefined}
                className="text-[#9ca3af] transition-colors hover:text-[#1f5230]"
              >
                {social.icon}
              </a>
            ))}
          </div>
        </div>
      </div>
    </footer>
  )
}
