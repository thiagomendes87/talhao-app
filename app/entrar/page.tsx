'use client'

import Image from 'next/image'
import Link from 'next/link'
import { Suspense, useEffect, useMemo, useState } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'
import { buildAuthCallbackUrl, getSafeNextPath, supabase } from '@/lib/supabase'
import { useAuthSession } from '@/lib/use-auth-session'

function LoginContent() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const { isAuthenticated, loading } = useAuthSession()
  const [errorMessage, setErrorMessage] = useState('')
  const [isSubmitting, setIsSubmitting] = useState(false)

  const nextPath = useMemo(
    () => getSafeNextPath(searchParams.get('next')),
    [searchParams]
  )

  const helperMessage =
    searchParams.get('message') ||
    (nextPath === '/mapa' ? 'Para baixar, entre com sua conta Google.' : null)

  useEffect(() => {
    if (!loading && isAuthenticated) {
      router.replace(nextPath)
    }
  }, [isAuthenticated, loading, nextPath, router])

  const handleGoogleLogin = async () => {
    setErrorMessage('')
    setIsSubmitting(true)

    const { error } = await supabase.auth.signInWithOAuth({
      provider: 'google',
      options: {
        redirectTo: buildAuthCallbackUrl(nextPath),
      },
    })

    if (error) {
      setErrorMessage(
        'Não foi possível iniciar a autenticação com o Google. Tente novamente.',
      )
      setIsSubmitting(false)
    }
  }

  return (
    <div className="h-screen overflow-hidden bg-white">
      <div className="grid h-full grid-cols-1 bg-white lg:grid-cols-2">
        <section className="relative hidden h-full overflow-hidden lg:flex">
          <Image
            src="/foto-lp2.png"
            alt="Vista de satélite de uma propriedade rural"
            fill
            className="object-cover object-center"
            priority
          />
          <div className="absolute inset-0 bg-[#162113]/70" />

          <div className="relative z-10 flex h-full w-full flex-col p-10">
            <Link href="/" className="inline-flex">
              <Image
                src="/logo-oficial-branco.png"
                width={360}
                height={96}
                alt="Talhão"
              />
            </Link>

            <div className="flex flex-1 items-center justify-center">
              <div className="w-full max-w-lg rounded-2xl border border-white/20 bg-white/10 p-8 backdrop-blur-md">
                <p className="text-xl font-semibold leading-relaxed text-white">
                  &ldquo;Acesse dados de qualquer fazenda do Brasil em segundos —
                  diretamente do satélite.&rdquo;
                </p>
                <div className="mt-6 flex flex-wrap gap-6 whitespace-nowrap text-sm text-white/80">
                  <span>🛰 Satélite atualizado semanalmente</span>
                  <span>⚡ Resultados em menos de 30s</span>
                  <span>📍 100% do território brasileiro</span>
                </div>
              </div>
            </div>
          </div>

          <div className="absolute bottom-6 right-6 z-20 inline-flex items-center gap-2 rounded-full border border-[#40916C]/60 bg-[#40916C]/20 px-4 py-2 text-xs font-semibold text-[#B7E4C7] backdrop-blur-sm">
            <span className="h-2.5 w-2.5 rounded-full bg-[#52b788] animate-pulse" />
            Sistema da Talhão está ativo
          </div>
        </section>

        <section className="relative flex h-full flex-col justify-center overflow-hidden bg-white px-6 py-10 lg:px-16 lg:py-12">
          <div className="glow-green-strong" />
          <div className="relative z-10 mx-auto w-full max-w-xl">
            <div className="inline-flex rounded-full border border-[#D8F3DC] bg-[#F0FDF4] px-4 py-2 text-xs font-semibold uppercase tracking-wide text-[#2D6A4F]">
              Acesso
            </div>
            <div className="mt-2 mb-6 h-0.5 w-8 bg-[#2D6A4F]" />

            <h1 className="text-4xl font-extrabold leading-tight text-[#162113]">
              Entre na <span className="text-[#2D6A4F]">Talhão</span> 👋
            </h1>

            <p className="mt-3 mb-8 text-sm leading-relaxed text-gray-500">
              O Talhão usa o Google como único método de autenticação. Depois de
              entrar, você volta direto para o mapa.
            </p>

            {helperMessage && (
              <div className="mb-6 rounded-2xl border border-[#D8E9DE] bg-[#F3FBF6] px-4 py-3 text-sm text-[#24503B]">
                {helperMessage}
              </div>
            )}

            {errorMessage && (
              <div className="mb-4 rounded-2xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
                {errorMessage}
              </div>
            )}

            <button
              type="button"
              onClick={handleGoogleLogin}
              disabled={isSubmitting || loading}
              className="flex w-full items-center justify-center gap-3 rounded-xl border border-[rgba(22,33,19,0.12)] bg-white px-4 py-4 text-sm font-semibold text-[#162113] shadow-sm transition-colors hover:bg-gray-50 disabled:cursor-not-allowed disabled:opacity-60"
            >
              <svg width="18" height="18" viewBox="0 0 24 24" aria-hidden="true">
                <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" />
                <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" />
                <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" />
                <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" />
              </svg>
              {isSubmitting ? 'Redirecionando...' : 'Continuar com Google'}
            </button>

            <p className="mt-8 text-center text-xs text-gray-400">
              <Link href="/" className="transition-colors hover:text-[#2D6A4F]">
                ← Voltar para o início
              </Link>
            </p>
          </div>
        </section>
      </div>
    </div>
  )
}

export default function EntrarPage() {
  return (
    <Suspense
      fallback={
        <div className="min-h-screen flex items-center justify-center">
          Carregando...
        </div>
      }
    >
      <LoginContent />
    </Suspense>
  )
}
