'use client'

import { useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { supabase } from '@/lib/supabase'

export default function AuthCallback() {
  const router = useRouter()

  useEffect(() => {
    const handleCallback = async () => {
      // Pega o code da URL (PKCE flow do OAuth)
      const params = new URLSearchParams(window.location.search)
      const code = params.get('code')
      const next = params.get('next') || '/dashboard'

      if (code) {
        // O browser faz a troca — sessão é salva em localStorage automaticamente
        const { error } = await supabase.auth.exchangeCodeForSession(code)
        if (!error) {
          router.replace(next)
          return
        }
      }

      // Sem código ou erro → tenta pegar sessão existente (caso hash-based)
      const { data: { session } } = await supabase.auth.getSession()
      if (session) {
        router.replace('/dashboard')
        return
      }

      // Nada funcionou
      router.replace('/entrar')
    }

    handleCallback()
  }, [router])

  return (
    <div className="min-h-screen flex flex-col items-center justify-center gap-4">
      <div className="w-8 h-8 border-4 border-[#2D6A4F] border-t-transparent rounded-full animate-spin" />
      <p className="text-sm text-gray-500">Autenticando...</p>
    </div>
  )
}
