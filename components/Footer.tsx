import Link from 'next/link'
import Image from 'next/image'

const links = {
  Produto: [
    { label: 'Abrir mapa', href: '/mapa' },
    { label: 'Preços', href: '/#precos' },
    { label: 'Plano Pro', href: '/assinar' },
    { label: 'Comprar créditos', href: '/carteira' },
  ],
  Legal: [
    { label: 'Termos de uso', href: '#' },
    { label: 'Privacidade', href: '#' },
  ],
  Contato: [
    { label: 'WhatsApp', href: 'https://wa.me/5519981150397' },
    { label: 'contato@talhao.ai', href: 'mailto:contato@talhao.ai' },
  ],
}

export default function Footer() {
  return (
    <footer
      className="px-6 pb-8 pt-16"
      style={{
        background: '#0a1a0e',
        borderTop: '1px solid rgba(82,183,136,0.10)',
      }}
    >
      <div className="mx-auto max-w-5xl">
        <div className="mb-14 grid grid-cols-1 gap-10 md:grid-cols-4">
          <div className="md:col-span-1">
            <div className="mb-4 flex items-center gap-2">
              <Image
                src="/logo-oficial-4.png"
                alt="Talhão"
                width={32}
                height={32}
                className="rounded-lg"
              />
              <span className="text-base font-extrabold" style={{ color: '#f0fdf4' }}>
                talhão
              </span>
            </div>
            <p className="text-sm leading-relaxed" style={{ color: 'rgba(240,253,244,0.40)' }}>
              O mapa de propriedades rurais do Brasil. Dados oficiais do SICAR, SIGEF e INCRA.
            </p>
          </div>

          {Object.entries(links).map(([category, items]) => (
            <div key={category}>
              <p
                className="mb-4 text-xs font-bold uppercase tracking-widest"
                style={{ color: 'rgba(82,183,136,0.6)' }}
              >
                {category}
              </p>
              <ul className="space-y-2.5">
                {items.map((item) => (
                  <li key={item.label}>
                    <Link
                      href={item.href}
                      className="text-sm transition-colors duration-150 hover:text-[#f0fdf4]"
                      style={{ color: 'rgba(240,253,244,0.45)' }}
                    >
                      {item.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        <div
          className="flex flex-col items-center justify-between gap-3 pt-6 sm:flex-row"
          style={{ borderTop: '1px solid rgba(255,255,255,0.06)' }}
        >
          <p className="text-xs" style={{ color: 'rgba(240,253,244,0.25)' }}>
            © 2026 Talhão Tecnologia Rural Ltda. Todos os direitos reservados.
          </p>
          <p className="text-xs" style={{ color: 'rgba(240,253,244,0.20)' }}>
            Dados: SICAR · SIGEF · SNCI · Topodata
          </p>
        </div>
      </div>
    </footer>
  )
}
