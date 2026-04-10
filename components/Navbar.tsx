'use client'

import Link from 'next/link'
import { useEffect, useState, useRef } from 'react'
import { useRouter, usePathname } from 'next/navigation'
import { supabase } from '@/lib/supabase'

export default function Navbar() {
  const [usuario, setUsuario] = useState<any>(null)
  const [creditos, setCreditos] = useState<number>(0)
  const [carregando, setCarregando] = useState(true)
  const [dropdownOpen, setDropdownOpen] = useState(false)
  const dropdownRef = useRef<HTMLDivElement>(null)
  const router = useRouter()
  const pathname = usePathname()

  useEffect(() => {
    const verificarSessao = async () => {
      const { data: { session } } = await supabase.auth.getSession()
      setUsuario(session?.user ?? null)

      // Busca créditos se logado
      if (session?.user) {
        const { data } = await supabase
          .from('carteira')
          .select('saldo')
          .eq('user_id', session.user.id)
          .single()

        if (data) {
          setCreditos(data.saldo)
        }
      }

      setCarregando(false)
    }
    verificarSessao()

    const { data: { subscription } } = supabase.auth.onAuthStateChange(async (_event, session) => {
      setUsuario(session?.user ?? null)

      if (session?.user) {
        const { data } = await supabase
          .from('carteira')
          .select('saldo')
          .eq('user_id', session.user.id)
          .single()

        if (data) {
          setCreditos(data.saldo)
        }
      } else {
        setCreditos(0)
      }
    })

    return () => subscription.unsubscribe()
  }, [])

  // Fecha dropdown quando clica fora
  useEffect(() => {
    function handleClickOutside(e: MouseEvent) {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target as Node)) {
        setDropdownOpen(false)
      }
    }

    if (dropdownOpen) {
      document.addEventListener('mousedown', handleClickOutside)
      return () => document.removeEventListener('mousedown', handleClickOutside)
    }
  }, [dropdownOpen])

  const handleLogout = async () => {
    await supabase.auth.signOut()
    setUsuario(null)
    setDropdownOpen(false)
    router.push('/')
  }

  const nomeUsuario = usuario?.user_metadata?.full_name?.split(' ')[0] || usuario?.email?.split('@')[0] || 'Conta'

  return (
    <nav className="flex items-center justify-between px-10 py-4 border-b border-gray-200 bg-white/97 backdrop-blur-sm sticky top-0 z-50">
      {/* Logo */}
      <Link href="/" className="flex items-center gap-2">
        <div className="w-7 h-7 bg-[#2D6A4F] rounded-md flex items-center justify-center text-white text-sm">🌿</div>
        <span className="text-xl font-extrabold text-[#1A1A2E]">Talhão</span>
      </Link>

      {/* Links */}
      <div className="hidden md:flex items-center gap-7 text-sm text-gray-600">
        <Link href="#como-funciona" className="hover:text-[#1A1A2E] transition-colors">Como funciona</Link>
        <Link href="#precos" className="hover:text-[#1A1A2E] transition-colors">Preços</Link>
        <Link href="#faq" className="hover:text-[#1A1A2E] transition-colors">FAQ</Link>
        <a href="https://wa.me/5511999999999" target="_blank" rel="noopener noreferrer"
          className="flex items-center gap-1.5 text-[#2D6A4F] font-semibold hover:text-[#1A1A2E] transition-colors">
          <svg className="w-4 h-4 fill-current" viewBox="0 0 24 24">
            <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/>
          </svg>
          Contato
        </a>
      </div>

      {/* Actions */}
      <div className="flex items-center gap-3">
        {carregando ? (
          <div className="w-24 h-8 bg-gray-100 animate-pulse rounded-lg" />
        ) : usuario ? (
          // LOGADO
          <>
            {/* Botão informativo de créditos */}
            <div className="flex items-center gap-2 bg-gray-50 border border-gray-200 text-gray-700 text-sm font-medium px-4 py-2 rounded-xl">
              <svg className="w-4 h-4 text-[#2D6A4F]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 10h18M7 15h1m4 0h1m-7 4h12a3 3 0 003-3V8a3 3 0 00-3-3H6a3 3 0 00-3 3v8a3 3 0 003 3z" />
              </svg>
              <span>{creditos}</span>
            </div>

            {/* Botão Comprar Créditos */}
            <Link href="/assinar"
              className="flex items-center gap-2 bg-[#F0FDF4] border border-[#BBF7D0] text-[#2D6A4F] text-sm font-semibold px-4 py-2 rounded-xl hover:bg-[#D8F3DC] transition-colors">
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
              </svg>
              Comprar Créditos
            </Link>

            {/* Dropdown de perfil */}
            <div ref={dropdownRef} className="relative">
              <button
                onClick={() => setDropdownOpen(!dropdownOpen)}
                onMouseEnter={() => setDropdownOpen(true)}
                onMouseLeave={() => setDropdownOpen(false)}
                className="text-sm text-gray-700 font-medium hover:text-[#1A1A2E] transition-colors px-2 py-2 rounded-lg hover:bg-gray-50">
                Olá, {nomeUsuario}
              </button>

              {dropdownOpen && (
                <div
                  onMouseEnter={() => setDropdownOpen(true)}
                  onMouseLeave={() => setDropdownOpen(false)}
                  className="absolute right-0 mt-1 w-40 bg-white border border-gray-200 rounded-lg shadow-lg overflow-hidden z-50">
                  <Link href="/dashboard"
                    className="block w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-50 transition-colors">
                    Minha Conta
                  </Link>
                  <button onClick={handleLogout}
                    className="block w-full text-left px-4 py-2 text-sm text-red-600 hover:bg-red-50 transition-colors border-t border-gray-100">
                    Sair
                  </button>
                </div>
              )}
            </div>
          </>
        ) : (
          // NÃO LOGADO
          <>
            <Link href="/entrar" className="btn-ghost">Entrar</Link>
            <Link href="/cadastro" className="btn-primary">Começar grátis</Link>
          </>
        )}
      </div>
    </nav>
  )
}
