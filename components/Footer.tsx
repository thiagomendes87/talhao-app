import Link from 'next/link'

export default function Footer() {
  return (
    <footer className="flex items-center justify-between bg-green-900 px-10 py-8 text-sm">
      <div className="text-white font-extrabold text-base">🌿 Talhão</div>
      <div className="flex gap-5">
        {['Termos', 'Privacidade', 'Contato', 'Blog'].map(l => (
          <Link key={l} href="#" className="text-white/60 hover:text-white transition-colors">{l}</Link>
        ))}
      </div>
      <div className="text-white/40">© 2026 Talhão Tecnologia Rural Ltda.</div>
    </footer>
  )
}
