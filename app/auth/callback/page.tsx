'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { type EmailOtpType } from '@supabase/supabase-js'
import { supabase } from '@/lib/supabase'

export default function AuthCallback() {
  const router = useRouter()
  const [status, setStatus] = useState('Autenticando...')
  const [erro, setErro] = useState('')

  useEffect(() => {
    let redirected = false

    const getNextPath = () => {
      const params = new URLSearchParams(window.location.search)
      const next = params.get('next') || '/dashboard'
      return next.startsWith('/') ? next : '/dashboard'
    }

    const go = (path: string) => {
      if (redirected) return
      redirected = true
      router.replace(path)
    }

    const run = async () => {
      const params = new URLSearchParams(window.location.search)
      const code = params.get('code')
      const tokenHash = params.get('token_hash')
      const type = params.get('type') as EmailOtpType | null
      const next = getNextPath()
      const oauthError = params.get('error')
      const oauthErrorDesc = params.get('error_description')

      // Supabase/Google retornou erro direto
      if (oauthError) {
        setErro(`Erro OAuth: ${oauthErrorDesc || oauthError}`)
        return
      }

      if (tokenHash && type) {
        setStatus('Confirmando email...')
        const { error } = await supabase.auth.verifyOtp({
          token_hash: tokenHash,
          type,
        })

        if (error) {
          setErro(`Erro ao confirmar email: ${error.message}`)
          return
        }

        const { data: { session } } = await supabase.auth.getSession()
        if (session) {
          setStatus('Email confirmado! Redirecionando...')
          go(next)
          return
        }
      }

      // PKCE flow: há um code na URL
      if (code) {
        setStatus('Trocando código...')
        const { data, error } = await supabase.auth.exchangeCodeForSession(code)

        if (error) {
          // Log visível para debug
          setErro(`Erro ao trocar código: ${error.message}`)
          console.error('exchangeCodeForSession error:', error)

          // Tenta pegar sessão de qualquer forma (às vezes a troca acontece em paralelo)
          const { data: { session } } = await supabase.auth.getSession()
          if (session) {
            setStatus('Sessão encontrada! Redirecionando...')
            go(next)
          }
          return
        }

        if (data.session) {
          setStatus('Logado! Redirecionando...')
          go(next)
          return
        }
      }

      // Sem code → verifica sessão existente (hash flow ou já logado)
      setStatus('Verificando sessão...')
      const { data: { session } } = await supabase.auth.getSession()
      if (session) {
        go(next)
        return
      }

      setErro('Nenhum código ou sessão encontrada. Tente novamente.')
    }

    // Listener de estado (captura SIGNED_IN de qualquer flow)
    const { data: { subscription } } = supabase.auth.onAuthStateChange((event, session) => {
      if (event === 'SIGNED_IN' && session && !redirected) {
        go(getNextPath())
      }
    })

    run()

    return () => {
      subscription.unsubscribe()
      redirected = true
    }
  }, [router])

  if (erro) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center gap-4 px-6">
        <div className="text-4xl">⚠️</div>
        <h2 className="text-lg font-bold text-[#1A1A2E]">Erro na autenticação</h2>
        <p className="text-sm text-red-600 bg-red-50 px-4 py-3 rounded-lg max-w-sm text-center">{erro}</p>
        <a href="/entrar" className="text-sm text-[#2D6A4F] font-semibold underline">
          Voltar para o login
        </a>
      </div>
    )
  }

  return (
    <div className="min-h-screen flex flex-col items-center justify-center gap-4">
      <div className="w-8 h-8 border-4 border-[#2D6A4F] border-t-transparent rounded-full animate-spin" />
      <p className="text-sm text-gray-500">{status}</p>
    </div>
  )
}
