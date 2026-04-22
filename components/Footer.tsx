import Link from 'next/link'

const links = [
  { label: 'Abrir mapa', href: '/mapa' },
  { label: 'Preços', href: '/#precos' },
  { label: 'Plano Pro', href: '/assinar' },
  { label: 'Comprar créditos', href: '/carteira' },
  { label: 'Termos de uso', href: '#' },
  { label: 'Privacidade', href: '#' },
  { label: 'WhatsApp', href: 'https://wa.me/5519981150397' },
  { label: 'contato@talhao.ai', href: 'mailto:contato@talhao.ai' },
]

export default function Footer() {
  return (
    <footer className="bg-[#f8f9fb] pt-16">
      <div className="mx-6 mb-0 rounded-[24px] border border-[#e5e7eb] bg-white px-8 py-20 shadow-sm">
        <div className="mx-auto max-w-3xl text-center">
          <span className="mb-6 inline-flex items-center gap-1.5 rounded-full border border-[#c6e6d4] bg-[#e8f5ee] px-4 py-1.5 text-sm font-medium text-[#1a5c38]">
            Suporte &amp; Contato
          </span>
          <h2 className="mb-8 text-center text-5xl font-bold leading-tight text-gray-900">
            <span className="block">Tire suas dúvidas</span>
            <span className="block text-[#25d366]">no WhatsApp</span>
          </h2>
          <a
            href="https://wa.me/5511530433330?text=Olá%2C%20gostaria%20de%20saber%20mais%20sobre%20o%20Talhão"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 rounded-full bg-[#25d366] px-10 py-4 text-lg font-semibold text-white shadow-md transition-colors transition-shadow hover:bg-[#1ebe5d] hover:shadow-lg"
          >
            💬 Falar no WhatsApp
          </a>
        </div>
      </div>

      <div className="border-t border-[#e5e7eb] bg-[#f8f9fb] px-8 py-8">
        <div className="mx-auto flex max-w-6xl flex-wrap items-center justify-between gap-4">
          <div>
            <p className="font-semibold text-gray-900">talhão</p>
            <p className="text-sm text-gray-400">Plataforma geoespacial rural</p>
          </div>

          <nav className="flex flex-wrap items-center justify-center gap-6">
            {links.map((item) => (
              <Link
                key={item.label}
                href={item.href}
                className="text-sm text-gray-500 transition-colors hover:text-gray-900"
              >
                {item.label}
              </Link>
            ))}
          </nav>

          <p className="text-sm text-gray-400">
            © 2025 Talhão. Todos os direitos reservados.
          </p>
        </div>
      </div>
    </footer>
  )
}
