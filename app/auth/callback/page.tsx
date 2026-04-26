'use client'

import Image from 'next/image'
import { Suspense, useEffect, useState } from 'react'
import Link from 'next/link'
import { useRouter, useSearchParams } from 'next/navigation'
import { type EmailOtpType } from '@supabase/supabase-js'
import { supabase } from '@/lib/supabase'

const POST_LOGIN_PATH = '/mapa'

function AuthCallbackLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <div className="h-screen overflow-hidden bg-white">
      <div className="grid h-full grid-cols-1 lg:grid-cols-2">
        <section className="relative flex h-full flex-col items-center justify-center overflow-hidden bg-white px-6 py-10 lg:px-16">
          <div className="glow-green-strong" />
          <div className="relative z-10 mx-auto w-full max-w-md">{children}</div>
        </section>

        <section className="relative hidden h-full overflow-hidden lg:flex">
          <Image
            src="/foto-lp2.png"
            alt="Vista aérea"
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
              <div className="w-full max-w-sm rounded-2xl border border-white/20 bg-white/10 p-8 backdrop-blur-md">
                <p className="text-xl font-semibold leading-relaxed text-white">
                  &ldquo;Acesse dados de qualquer fazenda do Brasil em segundos —
                  diretamente do satélite.&rdquo;
                </p>
                <div className="mt-6 flex flex-col gap-3 text-sm text-white/80">
                  <span>🛰 Satélite atualizado semanalmente</span>
                  <span>⚡ Resultados em menos de 30s</span>
                  <span>📍 100% do território brasileiro</span>
                </div>
              </div>
            </div>
          </div>
          <div className="absolute bottom-6 right-6 z-20 inline-flex items-center gap-2 rounded-full border border-[#40916C]/60 bg-[#40916C]/20 px-4 py-2 text-xs font-semibold text-[#B7E4C7] backdrop-blur-sm">
            <span className="h-2.5 w-2.5 animate-pulse rounded-full bg-[#52b788]" />
            Sistema da Talhão está ativo
          </div>
        </section>
      </div>
    </div>
  )
}

function AuthCallbackContent() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const [status, setStatus] = useState('Conectando sua conta...')
  const [errorMessage, setErrorMessage] = useState('')

  useEffect(() => {
    let cancelled = false

    const finishLogin = async () => {
      const oauthError = searchParams.get('error_description') || searchParams.get('error')
      const tokenHash = searchParams.get('token_hash')
      const type = searchParams.get('type') as EmailOtpType | null

      if (oauthError) {
        if (!cancelled) {
          setErrorMessage('Não foi possível concluir o login com Google. Tente novamente.')
        }
        return
      }

      if (tokenHash && type) {
        setStatus('Confirmando seu cadastro...')
        const { error } = await supabase.auth.verifyOtp({
          token_hash: tokenHash,
          type,
        })

        if (error && !cancelled) {
          setErrorMessage('Não foi possível confirmar seu cadastro. Tente novamente.')
          return
        }
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
        router.replace(POST_LOGIN_PATH)
        return
      }

      if (!cancelled) {
        setErrorMessage('Não encontramos uma sessão ativa após o login. Tente novamente.')
      }
    }

    const { data: { subscription } } = supabase.auth.onAuthStateChange((event, session) => {
      if (!cancelled && event === 'SIGNED_IN' && session?.user) {
        router.replace(POST_LOGIN_PATH)
      }
    })

    finishLogin()

    return () => {
      cancelled = true
      subscription.unsubscribe()
    }
  }, [router, searchParams])

  if (errorMessage) {
    return (
      <AuthCallbackLayout>
        <div className="w-full rounded-[28px] border border-red-100 bg-white p-8 shadow-[0_30px_80px_rgba(16,24,20,0.08)]">
          <div className="inline-flex rounded-full border border-red-100 bg-red-50 px-4 py-2 text-xs font-semibold uppercase tracking-wide text-red-500">
            Erro de autenticação
          </div>
          <div className="mt-2 mb-6 h-0.5 w-8 bg-red-500" />
          <h1 className="text-4xl font-extrabold leading-tight text-[#162113]">
            Não foi possível entrar
          </h1>
          <p className="mt-4 rounded-2xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
            {errorMessage}
          </p>
          <div className="mt-8 flex flex-col gap-3">
            <Link href="/entrar" className="btn-primary text-center">
              Tentar novamente
            </Link>
            <Link href="/" className="text-center text-sm font-semibold text-[#1f5230] hover:text-[#162113]">
              Voltar para o início
            </Link>
          </div>
        </div>
      </AuthCallbackLayout>
    )
  }

  return (
    <AuthCallbackLayout>
      <div className="flex flex-col items-center gap-4 text-center">
        <div className="w-12 h-12 border-4 border-[#2D6A4F] border-t-transparent rounded-full animate-spin" />
        <p className="text-sm font-medium text-gray-500">{status}</p>
      </div>
    </AuthCallbackLayout>
  )
}

export default function AuthCallbackPage() {
  return (
    <Suspense fallback={
      <AuthCallbackLayout>
        <div className="flex flex-col items-center gap-4 text-center">
          <div className="w-12 h-12 border-4 border-[#2D6A4F] border-t-transparent rounded-full animate-spin" />
          <p className="text-sm font-medium text-gray-500">Conectando sua conta...</p>
        </div>
      </AuthCallbackLayout>
    }>
      <AuthCallbackContent />
    </Suspense>
  )
}
