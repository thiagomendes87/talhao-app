'use client'

import { Suspense, useEffect, useMemo, useState } from 'react'
import Link from 'next/link'
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

  const helperMessage = searchParams.get('message')
    || (nextPath === '/mapa' ? 'Para baixar, entre com sua conta Google.' : null)

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
      setErrorMessage('Não foi possível iniciar a autenticação com o Google. Tente novamente.')
      setIsSubmitting(false)
    }
  }

  return (
    <div className="min-h-screen bg-[#F7FAF8] px-6 py-10">
      <div className="mx-auto flex min-h-[calc(100vh-80px)] max-w-md items-center">
        <div className="w-full rounded-[28px] border border-[rgba(28,43,24,0.10)] bg-white p-8 shadow-[0_30px_80px_rgba(16,24,20,0.08)]">
          <Link href="/" className="inline-flex items-center gap-2 text-sm font-semibold text-[#1f5230] hover:text-[#162113]">
            <span className="text-base">←</span>
            Voltar para o início
          </Link>

          <div className="mt-8">
            <p className="text-xs font-bold uppercase tracking-[0.24em] text-[#5C7C6C]">Acesso</p>
            <h1 className="mt-3 text-3xl font-extrabold text-[#162113]">Entre com sua conta Google</h1>
            <p className="mt-3 text-sm leading-relaxed text-gray-600">
              O Talhão usa o Google como único método de autenticação. Depois de entrar, você volta direto para o mapa.
            </p>
          </div>

          {helperMessage && (
            <div className="mt-6 rounded-2xl border border-[#D8E9DE] bg-[#F3FBF6] px-4 py-3 text-sm text-[#24503B]">
              {helperMessage}
            </div>
          )}

          {errorMessage && (
            <div className="mt-4 rounded-2xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
              {errorMessage}
            </div>
          )}

          <button
            type="button"
            onClick={handleGoogleLogin}
            disabled={isSubmitting || loading}
            className="mt-8 flex w-full items-center justify-center gap-3 rounded-2xl border border-[rgba(22,33,19,0.12)] px-4 py-3 text-sm font-semibold text-[#162113] transition-colors hover:bg-gray-50 disabled:cursor-not-allowed disabled:opacity-60"
          >
            <svg width="18" height="18" viewBox="0 0 24 24" aria-hidden="true">
              <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" />
              <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" />
              <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" />
              <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" />
            </svg>
            {isSubmitting ? 'Redirecionando...' : 'Continuar com Google'}
          </button>
        </div>
      </div>
    </div>
  )
}

export default function EntrarPage() {
  return (
    <Suspense fallback={<div className="min-h-screen flex items-center justify-center">Carregando...</div>}>
      <LoginContent />
    </Suspense>
  )
}
