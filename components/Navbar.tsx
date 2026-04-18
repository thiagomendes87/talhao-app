'use client'

import Link from 'next/link'
import { useEffect, useRef, useState } from 'react'
import { supabase } from '@/lib/supabase'
import { useAuthSession } from '@/lib/use-auth-session'

const GEO_API_URL = (process.env.NEXT_PUBLIC_GEO_API_URL ?? 'http://localhost:8000').replace(/\/$/, '')

const navLinks = [
  { href: '/mapa', label: 'Mapa' },
  { href: '/#precos', label: 'Preços' },
  { href: '/#faq', label: 'FAQ' },
]

export default function Navbar() {
  const { loading, user, session } = useAuthSession()
  const [dropdownOpen, setDropdownOpen] = useState(false)
  const [balance, setBalance] = useState<number | null>(null)
  const dropdownRef = useRef<HTMLDivElement | null>(null)

  // Busca saldo quando o usuário está logado
  useEffect(() => {
    if (!session?.access_token) {
      setBalance(null)
      return
    }
    fetch(`${GEO_API_URL}/api/auth/me`, {
      headers: { Authorization: `Bearer ${session.access_token}` },
    })
      .then((r) => r.ok ? r.json() : null)
      .then((data) => {
        if (data && typeof data.balance === 'number') setBalance(data.balance)
      })
      .catch(() => {})
  }, [session?.access_token])

  useEffect(() => {
    if (!dropdownOpen) return
    const handlePointerDown = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setDropdownOpen(false)
      }
    }
    document.addEventListener('mousedown', handlePointerDown)
    return () => document.removeEventListener('mousedown', handlePointerDown)
  }, [dropdownOpen])

  const handleLogout = async () => {
    setDropdownOpen(false)
    await supabase.auth.signOut()
    if (typeof window !== 'undefined') {
      delete (window as any).__TALHAO_JWT
      delete (window as any).__TALHAO_BUSCA
      window.location.assign('/')
    }
  }

  const mapUrlWithJwt = session?.access_token
    ? `/mapa?jwt=${encodeURIComponent(session.access_token)}`
    : '/mapa'

  const userInitial = (user?.email?.[0] || user?.user_metadata?.full_name?.[0] || 'U').toUpperCase()

  return (
    <div className="fixed top-3 left-0 right-0 z-50 px-4 pointer-events-none">
      <nav
        className="relative flex h-[65px] items-center justify-between px-6 md:px-8 max-w-[1200px] mx-auto pointer-events-auto"
        style={{
          background: 'rgba(255,255,255,0.92)',
          backdropFilter: 'blur(24px) saturate(180%)',
          WebkitBackdropFilter: 'blur(24px) saturate(180%)',
          borderBottom: '1px solid rgba(28,43,24,0.12)',
          boxShadow: 'inset 0 1px 0 rgba(255,255,255,0.6), 0 4px 24px rgba(0,0,0,0.06), 0 1px 4px rgba(0,0,0,0.04)',
          borderRadius: '18px',
        }}
      >
        {/* Logo */}
        <Link href="/" className="flex items-center gap-2 z-10 shrink-0">
          <img
            src="/logo-oficial.png"
            alt="Talhão"
            className="w-[126px] h-[126px] object-contain"
            style={{ borderRadius: '10px' }}
          />
        </Link>

        {/* Nav links — centered */}
        <div className="hidden md:flex absolute left-1/2 -translate-x-1/2 items-center gap-7 text-[13px] text-[#4f6347]">
          {navLinks.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className="text-[13px] font-medium text-[#4f6347] hover:text-[#162113] transition-all duration-150 whitespace-nowrap"
            >
              {link.label}
            </Link>
          ))}
        </div>

        {/* Right side */}
        <div className="flex items-center gap-2 z-10">
          {loading ? (
            <div className="w-24 h-8 animate-pulse rounded-full" style={{ background: 'rgba(28,43,24,0.06)' }} />
          ) : user ? (
            <>
              {/* Saldo de créditos */}
              <Link
                href={mapUrlWithJwt}
                className="hidden md:flex items-center gap-1.5 rounded-full px-3 py-1.5 text-xs font-semibold transition-all duration-150 whitespace-nowrap"
                style={{
                  background: 'rgba(31,82,48,0.08)',
                  border: '1px solid rgba(31,82,48,0.18)',
                  color: '#1f5230',
                }}
                title={`Logado como ${user.email}`}
              >
                <svg className="w-3.5 h-3.5 shrink-0" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2">
                  <circle cx="12" cy="12" r="9" />
                  <path strokeLinecap="round" d="M12 7v5l3 3" />
                </svg>
                {balance !== null ? `${balance} créditos` : 'Minha conta'}
              </Link>

              {/* Comprar créditos */}
              <Link
                href="/#precos"
                className="hidden md:inline-flex items-center rounded-full px-3 py-1.5 text-xs font-bold whitespace-nowrap transition-all duration-150 hover:opacity-90"
                style={{
                  background: '#1f5230',
                  color: '#fff',
                }}
              >
                + Créditos
              </Link>

              {/* Avatar → dropdown */}
              <div ref={dropdownRef} className="relative">
                <button
                  type="button"
                  onClick={() => setDropdownOpen((open) => !open)}
                  className="flex h-9 w-9 items-center justify-center rounded-full border border-[rgba(31,82,48,0.16)] bg-[rgba(31,82,48,0.08)] text-sm font-bold text-[#1f5230] transition-all duration-150 hover:bg-[rgba(31,82,48,0.14)]"
                  aria-label="Abrir menu da conta"
                >
                  {userInitial}
                </button>

                {dropdownOpen && (
                  <div
                    className="absolute right-0 mt-2 min-w-[220px] overflow-hidden"
                    style={{
                      background: 'rgba(255,255,255,0.98)',
                      backdropFilter: 'blur(16px) saturate(160%)',
                      WebkitBackdropFilter: 'blur(16px) saturate(160%)',
                      border: '1px solid rgba(28,43,24,0.12)',
                      borderRadius: '14px',
                      boxShadow: 'inset 0 1px 0 rgba(255,255,255,0.8), 0 8px 32px rgba(0,0,0,0.10)',
                      padding: '8px',
                    }}
                  >
                    <div className="px-3 py-2 text-xs text-gray-500 border-b border-gray-100">
                      {user.email || 'Conta conectada'}
                    </div>

                    {/* Dashboard */}
                    <Link
                      href="/dashboard"
                      onClick={() => setDropdownOpen(false)}
                      className="mt-1 flex w-full items-center gap-2 rounded-lg px-3 py-2 text-left text-[13px] text-[#1f5230] transition-all duration-150 hover:bg-[rgba(31,82,48,0.06)]"
                    >
                      <svg className="w-4 h-4 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <rect x="3" y="3" width="7" height="7" rx="1" strokeWidth={2} strokeLinecap="round" />
                        <rect x="14" y="3" width="7" height="7" rx="1" strokeWidth={2} strokeLinecap="round" />
                        <rect x="3" y="14" width="7" height="7" rx="1" strokeWidth={2} strokeLinecap="round" />
                        <rect x="14" y="14" width="7" height="7" rx="1" strokeWidth={2} strokeLinecap="round" />
                      </svg>
                      Dashboard
                    </Link>

                    {/* Comprar créditos */}
                    <Link
                      href="/#precos"
                      onClick={() => setDropdownOpen(false)}
                      className="flex w-full items-center gap-2 rounded-lg px-3 py-2 text-left text-[13px] text-[#1f5230] transition-all duration-150 hover:bg-[rgba(31,82,48,0.06)]"
                    >
                      <svg className="w-4 h-4 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                      </svg>
                      Comprar créditos
                    </Link>

                    {/* Sair */}
                    <button
                      type="button"
                      onClick={handleLogout}
                      className="flex w-full items-center gap-2 rounded-lg px-3 py-2 text-left text-[13px] text-[#a2372f] transition-all duration-150 hover:bg-[rgba(162,55,47,0.06)]"
                    >
                      <svg className="w-4 h-4 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
                      </svg>
                      Sair da conta
                    </button>
                  </div>
                )}
              </div>
            </>
          ) : (
            <>
              <Link
                href="/entrar"
                className="rounded-lg px-[14px] py-[8px] text-[13px] font-semibold text-[#1f5230] transition-all duration-150 hover:bg-[rgba(28,43,24,0.05)] hover:text-[#162113]"
              >
                Entrar
              </Link>
              <Link href="/cadastro" className="btn-primary">
                Criar conta
              </Link>
            </>
          )}
        </div>
      </nav>
    </div>
  )
}
