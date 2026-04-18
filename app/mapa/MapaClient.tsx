'use client'

import { useEffect, useRef, useState } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'
import { useAuthSession } from '@/lib/use-auth-session'
import dynamic from 'next/dynamic'

// Leaflet não funciona no SSR — carrega apenas no client
const MapEmbedded = dynamic(() => import('./MapEmbedded'), {
  ssr: false,
  loading: () => (
    <div className="flex-1 flex items-center justify-center bg-gray-50">
      <div className="text-center">
        <div className="w-8 h-8 border-4 border-[#2D6A4F] border-t-transparent rounded-full animate-spin mx-auto mb-3" />
        <p className="text-gray-500 text-sm">Carregando mapa...</p>
      </div>
    </div>
  ),
})

export default function MapaClient() {
  const router = useRouter()
  const { loading, session } = useAuthSession()
  const searchParams = useSearchParams()
  const searchQuery = searchParams.get('q')
  const geoApiUrl = process.env.NEXT_PUBLIC_GEO_API_URL ?? ''

  // Congela o JWT na primeira vez que o auth carrega.
  // Isso evita que o iframe remonte quando o Supabase renova o token.
  const frozenToken = useRef<string | null | undefined>(undefined)
  const [ready, setReady] = useState(false)

  useEffect(() => {
    if (!loading && frozenToken.current === undefined) {
      if (!session) {
        // Não autenticado → redireciona para login
        router.replace('/entrar?next=/mapa&message=Entre+com+sua+conta+para+acessar+o+mapa.')
        return
      }
      frozenToken.current = session.access_token
      setReady(true)
    }
  }, [loading, session, router])

  if (!ready || loading) {
    return (
      <div className="h-screen w-screen flex items-center justify-center bg-gray-50">
        <div className="text-center">
          <div className="w-8 h-8 border-4 border-[#2D6A4F] border-t-transparent rounded-full animate-spin mx-auto mb-3" />
          <p className="text-gray-500 text-sm">Carregando mapa...</p>
        </div>
      </div>
    )
  }

  return (
    <MapEmbedded
      authToken={frozenToken.current ?? null}
      geoApiUrl={geoApiUrl}
      searchQuery={searchQuery}
    />
  )
}
