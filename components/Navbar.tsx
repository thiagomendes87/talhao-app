'use client'

import Link from 'next/link'
import { useEffect, useState, useRef } from 'react'
import { useRouter } from 'next/navigation'
import { supabase } from '@/lib/supabase'

async function buscarCreditos(userId: string): Promise<number> {
  try {
    const { data } = await supabase
      .from('carteira')
      .select('creditos')
      .eq('user_id', userId)
      .single()
    return data?.creditos ?? 0
  } catch {
    return 0
  }
}

export default function Navbar() {
  const [usuario, setUsuario] = useState<any>(null)
  const [creditos, setCreditos] = useState<number>(0)
  const [carregando, setCarregando] = useState(true)
  const [dropdownOpen, setDropdownOpen] = useState(false)
  const dropdownRef = useRef<HTMLDivElement>(null)
  const router = useRouter()

  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      setUsuario(session?.user ?? null)
      if (session?.user) {
        buscarCreditos(session.user.id).then(setCreditos)
      }
      setCarregando(false)
    }).catch(() => setCarregando(false))

    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      setUsuario(session?.user ?? null)
      if (session?.user) {
        buscarCreditos(session.user.id).then(setCreditos)
      } else {
        setCreditos(0)
      }
    })

    return () => subscription.unsubscribe()
  }, [])

  // Fecha dropdown ao clicar fora
  useEffect(() => {
    if (!dropdownOpen) return
    function handler(e: MouseEvent) {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target as Node)) {
        setDropdownOpen(false)
      }
    }
    document.addEventListener('mousedown', handler)
    return () => document.removeEventListener('mousedown', handler)
  }, [dropdownOpen])

  const handleLogout = async () => {
    setDropdownOpen(false)
    await supabase.auth.signOut()
    setUsuario(null)
    router.push('/')
  }

  const nomeUsuario =
    usuario?.user_metadata?.full_name?.split(' ')[0] ||
    usuario?.email?.split('@')[0] ||
    'Conta'

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
        <Link href="/" className="flex items-center gap-2 z-10">
          <img
            src="/logo-oficial.png"
            alt="Talhão"
            className="w-[126px] h-[126px] object-contain"
            style={{ borderRadius: '10px' }}
          />
        </Link>

        {/* Links centro — absolutamente centralizado, só desktop */}
        <div className="hidden md:flex absolute left-1/2 -translate-x-1/2 items-center gap-7 text-[13px] text-[#4f6347]">
          {usuario && (
            <Link href="/mapa" className="flex items-center gap-1.5 text-[13px] text-[#1f5230] font-semibold underline-offset-4 hover:underline hover:text-[#162113] transition-all duration-150">
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 20l-5.447-2.724A1 1 0 013 16.382V5.618a1 1 0 011.447-.894L9 7m0 13l6-3m-6 3V7m6 10l4.553 2.276A1 1 0 0021 18.382V7.618a1 1 0 00-.553-.894L15 4m0 13V4m0 0L9 7" />
              </svg>
              Mapa
            </Link>
          )}
          <Link href="#como-funciona" className="text-[13px] font-medium text-[#4f6347] hover:text-[#162113] transition-all duration-150">Como funciona</Link>
          <Link href="#precos" className="text-[13px] font-medium text-[#4f6347] hover:text-[#162113] transition-all duration-150">Preços</Link>
          <Link href="#faq" className="text-[13px] font-medium text-[#4f6347] hover:text-[#162113] transition-all duration-150">FAQ</Link>
          <a href="https://wa.me/5511999999999" target="_blank" rel="noopener noreferrer"
            className="flex items-center gap-1.5 text-[13px] font-medium text-[#4f6347] hover:text-[#162113] transition-all duration-150">
            <svg className="w-4 h-4 fill-current" viewBox="0 0 24 24">
              <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/>
            </svg>
            Contato
          </a>
        </div>

        {/* Actions */}
        <div className="flex items-center gap-2 md:gap-3 z-10">

          {carregando ? (
            <div className="w-20 h-8 animate-pulse rounded-lg" style={{ background: 'rgba(28,43,24,0.06)' }} />
          ) : usuario ? (
            <>
              {/* Saldo de créditos — só informativo */}
              <div
                className="hidden sm:flex items-center"
                style={{
                  background: 'rgba(31,82,48,0.06)',
                  border: '1px solid rgba(31,82,48,0.14)',
                  borderRadius: '20px',
                  padding: '5px 12px',
                  fontSize: '13px',
                  fontWeight: 600,
                  color: '#1f5230',
                  gap: '6px',
                }}
              >
                <svg className="text-[#1f5230]" width="14" height="14" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 10h18M7 15h1m4 0h1m-7 4h12a3 3 0 003-3V8a3 3 0 00-3-3H6a3 3 0 00-3 3v8a3 3 0 003 3z" />
                </svg>
                <span>{creditos} créditos</span>
              </div>

              {/* Comprar Créditos */}
              <Link href="/assinar"
                onMouseEnter={(event) => {
                  event.currentTarget.style.background = 'rgba(31,82,48,0.12)'
                  event.currentTarget.style.borderColor = 'rgba(31,82,48,0.24)'
                }}
                onMouseLeave={(event) => {
                  event.currentTarget.style.background = 'rgba(31,82,48,0.07)'
                  event.currentTarget.style.borderColor = 'rgba(31,82,48,0.16)'
                }}
                className="flex items-center gap-1.5 text-[#1f5230] text-[13px] font-semibold transition-all duration-150"
                style={{
                  background: 'rgba(31,82,48,0.07)',
                  border: '1px solid rgba(31,82,48,0.16)',
                  borderRadius: '10px',
                  padding: '6px 14px',
                }}>
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                </svg>
                <span className="hidden sm:inline">Comprar Créditos</span>
                <span className="sm:hidden">Comprar</span>
              </Link>

              {/* Dropdown de perfil */}
              <div ref={dropdownRef} className="relative">
                <button
                  onClick={() => setDropdownOpen(v => !v)}
                  onMouseEnter={() => setDropdownOpen(true)}
                  className="flex items-center gap-1 px-2 py-2 rounded-lg border border-transparent hover:bg-[rgba(28,43,24,0.05)] hover:border-[rgba(28,43,24,0.10)] transition-all duration-150">
                  <span className="text-[13px] font-medium text-[#162113]">Olá, {nomeUsuario}</span>
                  <svg className="text-[#4f6347]" width="12" height="12" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                  </svg>
                </button>

                {dropdownOpen && (
                  <div
                    onMouseLeave={() => setDropdownOpen(false)}
                    className="absolute right-0 mt-1 w-44 overflow-hidden z-50"
                    style={{
                      background: 'rgba(255,255,255,0.96)',
                      backdropFilter: 'blur(16px) saturate(160%)',
                      WebkitBackdropFilter: 'blur(16px) saturate(160%)',
                      border: '1px solid rgba(28,43,24,0.12)',
                      borderRadius: '14px',
                      boxShadow: 'inset 0 1px 0 rgba(255,255,255,0.8), 0 8px 32px rgba(0,0,0,0.10)',
                      padding: '6px',
                    }}
                  >
                    <Link
                      href="/mapa"
                      onClick={() => setDropdownOpen(false)}
                      className="flex items-center gap-2 w-full text-[13px] text-[#162113] hover:bg-[rgba(28,43,24,0.05)] transition-all duration-150"
                      style={{ borderRadius: '8px', padding: '8px 12px' }}
                    >
                      <svg className="w-4 h-4 text-[#1f5230]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 20l-5.447-2.724A1 1 0 013 16.382V5.618a1 1 0 011.447-.894L9 7m0 13l6-3m-6 3V7m6 10l4.553 2.276A1 1 0 0021 18.382V7.618a1 1 0 00-.553-.894L15 4m0 13V4m0 0L9 7" />
                      </svg>
                      Mapa
                    </Link>
                    <Link
                      href="/dashboard"
                      onClick={() => setDropdownOpen(false)}
                      className="flex items-center gap-2 w-full text-[13px] text-[#162113] hover:bg-[rgba(28,43,24,0.05)] transition-all duration-150"
                      style={{ borderRadius: '8px', padding: '8px 12px' }}
                    >
                      <svg className="w-4 h-4 text-[#1f5230]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                      </svg>
                      Minha Conta
                    </Link>
                    <button
                      onClick={handleLogout}
                      className="flex items-center gap-2 w-full text-[13px] text-[#a2372f] hover:bg-[rgba(162,55,47,0.06)] transition-all duration-150"
                      style={{ borderRadius: '8px', padding: '8px 12px' }}
                    >
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
                      </svg>
                      Sair
                    </button>
                  </div>
                )}
              </div>
            </>
          ) : (
            <>
              <Link href="/entrar" className="text-[13px] font-medium text-[#4f6347] hover:text-[#162113] hover:bg-[rgba(28,43,24,0.05)] rounded-lg px-[14px] py-[6px] transition-all duration-150">Entrar</Link>
              <Link href="/cadastro" className="btn-primary">Começar grátis</Link>
            </>
          )}
        </div>
      </nav>
    </div>
  )
}
