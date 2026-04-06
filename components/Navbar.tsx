'use client'

import Link from 'next/link'

export default function Navbar() {
  return (
    <nav className="flex items-center justify-between px-10 py-4 border-b border-gray-200 bg-white/97 backdrop-blur-sm sticky top-0 z-50">
      {/* Logo */}
      <Link href="/" className="flex items-center gap-2">
        <div className="w-7 h-7 bg-[#2D6A4F] rounded-md flex items-center justify-center text-white text-sm">
          🌿
        </div>
        <span className="text-xl font-extrabold text-[#1A1A2E]">Talhão</span>
      </Link>

      {/* Links */}
      <div className="hidden md:flex items-center gap-7 text-sm text-gray-600">
        <Link href="#como-funciona" className="hover:text-[#1A1A2E] transition-colors">Como funciona</Link>
        <Link href="#precos" className="hover:text-[#1A1A2E] transition-colors">Preços</Link>
        <Link href="#suporte" className="hover:text-[#1A1A2E] transition-colors">Suporte</Link>
      </div>

      {/* Actions */}
      <div className="flex items-center gap-3">
        <Link href="/entrar" className="btn-ghost">Entrar</Link>
        <Link href="/cadastro" className="btn-primary">Começar grátis</Link>
      </div>
    </nav>
  )
}
