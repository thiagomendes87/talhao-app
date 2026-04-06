import Link from 'next/link'

export default function Footer() {
  return (
    <footer className="bg-[#1A1A2E] px-10 py-8 flex items-center justify-between text-sm">
      <div className="text-white font-extrabold text-base">🌿 Talhão</div>
      <div className="flex gap-5">
        {['Termos', 'Privacidade', 'Contato', 'Blog'].map(l => (
          <Link key={l} href="#" className="text-white/60 hover:text-white transition-colors">{l}</Link>
        ))}
      </div>
      <div className="text-white/40">© 2025 Talhão Tecnologia Rural Ltda.</div>
    </footer>
  )
}
