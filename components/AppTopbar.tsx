'use client'

import Image from 'next/image'
import Link from 'next/link'
import { useEffect, useState } from 'react'
import { usePathname } from 'next/navigation'
import { useAuthSession } from '@/lib/use-auth-session'

const navItems = [
  { href: '/dashboard', label: 'Dashboard' },
  { href: '/carteira', label: 'Carteira' },
  { href: '/conta', label: 'Conta' },
]

function getUserInitial(email?: string | null) {
  return (email?.[0] || 'U').toUpperCase()
}

export default function AppTopbar() {
  const pathname = usePathname()
  const { user } = useAuthSession()
  const [menuOpen, setMenuOpen] = useState(false)

  useEffect(() => {
    setMenuOpen(false)
  }, [pathname])

  return (
    <header className="sticky top-0 z-40 border-b border-[rgba(28,43,24,0.12)] bg-white/95 backdrop-blur">
      <div className="mx-auto flex max-w-5xl items-center justify-between gap-4 px-4 py-4 sm:px-10">
        <Link href="/" className="shrink-0">
          <Image
            src="/logo-oficial.png"
            alt="Talhão"
            width={120}
            height={32}
            className="h-8 w-auto"
            priority
          />
        </Link>

        <nav className="hidden items-center gap-7 md:flex">
          {navItems.map((item) => {
            const active = pathname === item.href

            return (
              <Link
                key={item.href}
                href={item.href}
                className={`border-b-2 pb-1 text-sm font-semibold transition-colors ${
                  active
                    ? 'border-[#2D6A4F] text-[#1f5230]'
                    : 'border-transparent text-[#4f6347] hover:text-[#162113]'
                }`}
              >
                {item.label}
              </Link>
            )
          })}
        </nav>

        <div className="hidden items-center gap-3 md:flex">
          <Link
            href="/mapa"
            target="_blank"
            rel="noopener noreferrer"
            className="rounded-lg bg-[#1f5230] px-4 py-2.5 text-sm font-bold text-white transition-colors hover:bg-[#163b23]"
          >
            Abrir mapa →
          </Link>
          <div
            className="flex h-10 w-10 items-center justify-center rounded-full border border-[#D8E9DE] bg-[#F3FBF6] text-sm font-bold text-[#1f5230]"
            title={user?.email || 'Usuário'}
          >
            {getUserInitial(user?.email)}
          </div>
        </div>

        <div className="flex items-center gap-3 md:hidden">
          <div
            className="flex h-10 w-10 items-center justify-center rounded-full border border-[#D8E9DE] bg-[#F3FBF6] text-sm font-bold text-[#1f5230]"
            title={user?.email || 'Usuário'}
          >
            {getUserInitial(user?.email)}
          </div>
          <button
            type="button"
            onClick={() => setMenuOpen((open) => !open)}
            className="inline-flex h-10 w-10 items-center justify-center rounded-xl border border-gray-200 text-[#162113] transition-colors hover:bg-gray-50"
            aria-label="Abrir menu"
            aria-expanded={menuOpen}
          >
            <svg className="h-5 w-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              {menuOpen ? (
                <path strokeLinecap="round" strokeLinejoin="round" d="M6 6l12 12M18 6L6 18" />
              ) : (
                <path strokeLinecap="round" strokeLinejoin="round" d="M4 7h16M4 12h16M4 17h16" />
              )}
            </svg>
          </button>
        </div>
      </div>

      {menuOpen && (
        <div className="border-t border-gray-100 bg-white px-4 py-4 shadow-sm md:hidden">
          <div className="mx-auto flex max-w-5xl flex-col gap-2 sm:px-6">
            {navItems.map((item) => {
              const active = pathname === item.href

              return (
                <Link
                  key={item.href}
                  href={item.href}
                  className={`rounded-xl px-4 py-3 text-sm font-semibold transition-colors ${
                    active
                      ? 'bg-[#F0FDF4] text-[#1f5230]'
                      : 'text-gray-600 hover:bg-gray-50 hover:text-[#162113]'
                  }`}
                >
                  {item.label}
                </Link>
              )
            })}

            <Link
              href="/mapa"
              target="_blank"
              rel="noopener noreferrer"
              className="mt-2 rounded-lg bg-[#1f5230] px-4 py-3 text-center text-sm font-bold text-white transition-colors hover:bg-[#163b23]"
            >
              Abrir mapa →
            </Link>
          </div>
        </div>
      )}
    </header>
  )
}
