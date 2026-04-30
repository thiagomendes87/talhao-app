'use client'

import Link from 'next/link'
import { useEffect, useState } from 'react'

const productLinks = [
  { label: 'Mapa', href: '/mapa' },
  { label: 'Preços', href: '/#precos' },
  { label: 'FAQ', href: '/#faq' },
  { label: 'API', href: '#', badge: 'em breve' },
]

const companyLinks = [
  { label: 'Como funciona', href: '/#como-funciona' },
  { label: 'Para quem é', href: '/#para-quem-e' },
  { label: 'Formatos de saída', href: '/#formatos-de-saida' },
  { label: 'Contato', href: 'mailto:ariel@talhao.ai' },
]

type LegalModalKey = 'terms' | 'privacy' | 'cookies'

const legalLinks: Array<{ label: string; modalKey: LegalModalKey }> = [
  { label: 'Termos', modalKey: 'terms' },
  { label: 'Privacidade', modalKey: 'privacy' },
  { label: 'Cookies', modalKey: 'cookies' },
]

const LEGAL_CONTENT: Record<LegalModalKey, { title: string; body: string }> = {
  terms: {
    title: 'Termos de uso',
    body: 'Em construção. Os termos de uso completos serão publicados em breve. Para qualquer dúvida sobre como usamos a plataforma ou seus dados, fale com a gente em ariel@talhao.ai.',
  },
  privacy: {
    title: 'Política de privacidade',
    body: 'Em construção. Nossa política de privacidade completa será publicada em breve. Coletamos apenas os dados necessários para operação da plataforma e cumprimento da LGPD. Para dúvidas: ariel@talhao.ai.',
  },
  cookies: {
    title: 'Política de cookies',
    body: 'Em construção. Utilizamos apenas cookies essenciais para autenticação e preferências do usuário. A política completa de cookies será publicada em breve. Dúvidas: ariel@talhao.ai.',
  },
}

const FOOTER_WHATSAPP_URL =
  'https://wa.me/551153043330?text=Olá%2C%20gostaria%20de%20saber%20mais%20sobre%20a%20Talhão'

const socialLinks = [
  {
    label: 'WhatsApp',
    href: FOOTER_WHATSAPP_URL,
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
    'inline-flex items-center gap-2 text-[13px] text-white/55 transition-colors hover:text-white'

  const content = (
    <>
      <span>{label}</span>
      {badge && (
        <span className="rounded-full border border-[rgba(82,183,136,0.30)] bg-[rgba(82,183,136,0.15)] px-2 py-0.5 text-[10px] font-semibold uppercase tracking-[0.08em] text-[#86efac]">
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

function LegalButton({
  label,
  modalKey,
  onClick,
}: {
  label: string
  modalKey: LegalModalKey
  onClick: (modalKey: LegalModalKey) => void
}) {
  return (
    <button
      type="button"
      onClick={() => onClick(modalKey)}
      className="inline-flex items-center gap-2 text-[13px] text-white/55 transition-colors hover:text-white"
    >
      {label}
    </button>
  )
}

export default function Footer() {
  const [openModal, setOpenModal] = useState<LegalModalKey | null>(null)

  useEffect(() => {
    if (!openModal) return

    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') setOpenModal(null)
    }

    window.addEventListener('keydown', onKey)
    document.body.style.overflow = 'hidden'

    return () => {
      window.removeEventListener('keydown', onKey)
      document.body.style.overflow = ''
    }
  }, [openModal])

  return (
    <footer
      className="relative overflow-hidden border-t border-white/5 px-6 pt-16"
      style={{ background: 'linear-gradient(165deg, #0f2d1a 0%, #0a1410 55%, #060807 100%)' }}
    >
      <div aria-hidden="true" className="pointer-events-none absolute inset-x-0 top-0 h-40 bg-[radial-gradient(ellipse_at_top,rgba(82,183,136,0.15),transparent_70%)]" />

      <div className="relative z-10 mx-auto max-w-6xl">
        <div className="grid grid-cols-1 gap-12 pb-14 md:grid-cols-[2fr_1fr_1fr_1fr]">
          <div className="max-w-md">
            <Link href="/" className="-mt-7 inline-flex items-center gap-2">
              <img
                src="/logo-oficial-branco.png"
                alt="Talhão"
                className="h-28 w-28 object-contain"
              />
            </Link>

            <p className="-mt-5 text-[14px] leading-relaxed text-[rgba(240,253,244,0.7)]">
              Tenha informações valiosas sobre qualquer fazenda do Brasil em poucos segundos.
            </p>

            <a
              href="mailto:ariel@talhao.ai"
              className="mt-4 inline-flex items-center gap-2 font-mono-tabular text-[13px] text-[#86efac] transition-colors hover:text-white"
            >
              <svg viewBox="0 0 24 24" className="h-4 w-4" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                <rect x="3" y="5" width="18" height="14" rx="2" />
                <path d="M3 7l9 6 9-6" />
              </svg>
              ariel@talhao.ai
            </a>

          </div>

          <div>
            <h3 className="text-[12px] font-semibold uppercase tracking-[0.08em] text-white/40">
              Produto
            </h3>
            <div className="mt-4 flex flex-col gap-3">
              {productLinks.map((link) => (
                <FooterLink key={link.label} {...link} />
              ))}
            </div>
          </div>

          <div>
            <h3 className="text-[12px] font-semibold uppercase tracking-[0.08em] text-white/40">
              Empresa
            </h3>
            <div className="mt-4 flex flex-col gap-3">
              {companyLinks.map((link) => (
                <FooterLink key={link.label} {...link} />
              ))}
            </div>
          </div>

          <div>
            <h3 className="text-[12px] font-semibold uppercase tracking-[0.08em] text-white/40">
              Legal
            </h3>
            <div className="mt-4 flex flex-col gap-3">
              {legalLinks.map((link) => (
                <LegalButton
                  key={link.label}
                  label={link.label}
                  modalKey={link.modalKey}
                  onClick={setOpenModal}
                />
              ))}
            </div>
          </div>
        </div>

        <div className="-mt-4 mb-10 overflow-hidden rounded-3xl border border-[rgba(82,183,136,0.30)] bg-[linear-gradient(135deg,rgba(31,82,48,0.55)_0%,rgba(82,183,136,0.18)_100%)] p-1">
          <div className="relative flex flex-col gap-5 rounded-[22px] bg-[linear-gradient(135deg,#0f2d1a_0%,#0a1a10_100%)] px-7 py-6 sm:flex-row sm:items-center sm:justify-between">
            <div
              aria-hidden="true"
              className="pointer-events-none absolute -right-12 -top-12 h-48 w-48 rounded-full bg-[radial-gradient(circle,rgba(82,183,136,0.22),transparent_70%)] blur-2xl"
            />
            <div className="relative flex items-center gap-4">
              <div className="flex h-14 w-14 flex-shrink-0 items-center justify-center rounded-2xl bg-[#25D366] shadow-[0_8px_24px_rgba(37,211,102,0.35)]">
                <svg viewBox="0 0 24 24" className="h-7 w-7" fill="none" stroke="white" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                  <path d="M20 11.5A8.5 8.5 0 0 1 7.6 19l-3.6 1 1.1-3.5A8.5 8.5 0 1 1 20 11.5Z" />
                  <path d="M9.5 9.5c.4-.9.8-.9 1.1-.9.2 0 .4 0 .6.5l.5 1.3c.1.3 0 .5-.2.7l-.4.4c-.2.2-.2.4-.1.6.4.8 1.1 1.5 1.9 1.9.2.1.4.1.6-.1l.4-.4c.2-.2.4-.3.7-.2l1.3.5c.5.2.5.4.5.6 0 .3 0 .7-.9 1.1-.7.3-1.4.3-2.1 0a8.2 8.2 0 0 1-4.1-4.1c-.3-.7-.3-1.4 0-2.1Z" />
                </svg>
              </div>
              <div>
                <p className="text-[11px] font-semibold uppercase tracking-[0.14em] text-[#86efac]">
                  Atendimento direto
                </p>
                <p className="mt-1 text-[18px] font-semibold leading-tight text-white">
                  Fale com a Talhão no WhatsApp
                </p>
                <p className="mt-1 text-[13px] text-white/65">
                  Resposta rápida durante o horário comercial.
                </p>
              </div>
            </div>

            <a
              href={FOOTER_WHATSAPP_URL}
              target="_blank"
              rel="noopener noreferrer"
              className="relative inline-flex items-center justify-center gap-2 self-start rounded-xl bg-[#25D366] px-6 py-3 text-[14px] font-semibold text-white shadow-[0_8px_24px_rgba(37,211,102,0.35)] transition-all duration-200 hover:bg-[#1ebe5b] hover:shadow-[0_12px_32px_rgba(37,211,102,0.5)] sm:self-auto"
            >
              Iniciar conversa
              <svg viewBox="0 0 24 24" className="h-4 w-4" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                <path d="M5 12h14" />
                <path d="m13 6 6 6-6 6" />
              </svg>
            </a>
          </div>
        </div>

        <div className="flex flex-col gap-4 border-t border-white/5 py-6 md:flex-row md:items-center md:justify-between">
          <p className="text-[13px] text-white/45">© 2026 Talhão.ai</p>

          <div className="flex items-center gap-4">
            {socialLinks.map((social) => (
              <a
                key={social.label}
                href={social.href}
                aria-label={social.label}
                target={social.href.startsWith('http') ? '_blank' : undefined}
                rel={social.href.startsWith('http') ? 'noopener noreferrer' : undefined}
                className="text-white/40 transition-colors hover:text-[#86efac]"
              >
                {social.icon}
              </a>
            ))}
          </div>
        </div>
      </div>

      {openModal && (
        <div
          role="dialog"
          aria-modal="true"
          aria-labelledby="legal-modal-title"
          className="fixed inset-0 z-[100] flex items-center justify-center bg-black/70 px-6 backdrop-blur-sm"
          onClick={() => setOpenModal(null)}
        >
          <div
            className="relative w-full max-w-md rounded-2xl border border-white/10 bg-[#0f2d1a] p-8 shadow-[0_24px_64px_rgba(0,0,0,0.5)]"
            onClick={(e) => e.stopPropagation()}
          >
            <h3 id="legal-modal-title" className="text-[18px] font-semibold text-white">
              {LEGAL_CONTENT[openModal].title}
            </h3>
            <p className="mt-4 text-[14px] leading-relaxed text-white/70">
              {LEGAL_CONTENT[openModal].body}
            </p>
            <button
              type="button"
              onClick={() => setOpenModal(null)}
              className="mt-6 inline-flex items-center justify-center rounded-xl bg-[#1f5230] px-5 py-2.5 text-[13px] font-semibold text-white transition-colors hover:bg-[#2a6b3f]"
            >
              Fechar
            </button>
            <button
              type="button"
              onClick={() => setOpenModal(null)}
              aria-label="Fechar"
              className="absolute right-4 top-4 text-white/50 transition-colors hover:text-white"
            >
              <svg viewBox="0 0 24 24" className="h-5 w-5" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true"><path d="M18 6 6 18" /><path d="m6 6 12 12" /></svg>
            </button>
          </div>
        </div>
      )}
    </footer>
  )
}
