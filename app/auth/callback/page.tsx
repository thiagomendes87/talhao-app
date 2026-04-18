'use client'

import { Suspense, useEffect, useMemo, useState } from 'react'
import Link from 'next/link'
import { useRouter, useSearchParams } from 'next/navigation'
import { getSafeNextPath, supabase } from '@/lib/supabase'

function AuthCallbackContent() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const [status, setStatus] = useState('Conectando sua conta...')
  const [errorMessage, setErrorMessage] = useState('')

  const nextPath = useMemo(
    () => getSafeNextPath(searchParams.get('next')),
    [searchParams]
  )

  useEffect(() => {
    let cancelled = false

    const finishLogin = async () => {
      const oauthError = searchParams.get('error_description') || searchParams.get('error')

      if (oauthError) {
        if (!cancelled) {
          setErrorMessage('Não foi possível concluir o login com Google. Tente novamente.')
        }
        return
      }

      const code = searchParams.get('code')

      if (code) {
        setStatus('Validando sua autenticação...')
        const { error } = await supabase.auth.exchangeCodeForSession(code)

        if (error && !cancelled) {
          setErrorMessage('Sua autenticação expirou ou não pôde ser validada. Tente novamente.')
          return
        }
      }

      const { data: { session } } = await supabase.auth.getSession()

      if (!cancelled && session?.user) {
        router.replace(nextPath)
        return
      }

      if (!cancelled) {
        setErrorMessage('Não encontramos uma sessão ativa após o login. Tente novamente.')
      }
    }

    const { data: { subscription } } = supabase.auth.onAuthStateChange((event, session) => {
      if (!cancelled && event === 'SIGNED_IN' && session?.user) {
        router.replace(nextPath)
      }
    })

    finishLogin()

    return () => {
      cancelled = true
      subscription.unsubscribe()
    }
  }, [nextPath, router, searchParams])

  if (errorMessage) {
    return (
      <div className="min-h-screen bg-[#F7FAF8] px-6 py-10">
        <div className="mx-auto flex min-h-[calc(100vh-80px)] max-w-md items-center">
          <div className="w-full rounded-[28px] border border-red-100 bg-white p-8 shadow-[0_30px_80px_rgba(16,24,20,0.08)]">
            <p className="text-xs font-bold uppercase tracking-[0.24em] text-red-500">Erro de autenticação</p>
            <h1 className="mt-3 text-3xl font-extrabold text-[#162113]">Não foi possível entrar</h1>
            <p className="mt-4 rounded-2xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
              {errorMessage}
            </p>
            <div className="mt-8 flex flex-col gap-3">
              <Link href={`/entrar?next=${encodeURIComponent(nextPath)}`} className="btn-primary text-center">
                Tentar novamente
              </Link>
              <Link href="/" className="text-center text-sm font-semibold text-[#1f5230] hover:text-[#162113]">
                Voltar para o início
              </Link>
            </div>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen flex flex-col items-center justify-center gap-4 bg-[#F7FAF8] px-6">
      <div className="w-10 h-10 border-4 border-[#2D6A4F] border-t-transparent rounded-full animate-spin" />
      <p className="text-sm text-gray-600">{status}</p>
    </div>
  )
}

export default function AuthCallbackPage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen flex flex-col items-center justify-center gap-4 bg-[#F7FAF8] px-6">
        <div className="w-10 h-10 border-4 border-[#2D6A4F] border-t-transparent rounded-full animate-spin" />
        <p className="text-sm text-gray-600">Conectando sua conta...</p>
      </div>
    }>
      <AuthCallbackContent />
    </Suspense>
  )
}
