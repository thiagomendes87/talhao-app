'use client'

import { useRef } from 'react'
import { useSearchParams } from 'next/navigation'
import { useAuthSession } from '@/lib/use-auth-session'
import LeadCaptureSheet from '@/components/LeadCaptureSheet'
import dynamic from 'next/dynamic'

const MapEmbedded = dynamic(() => import('./MapEmbedded'), {
  ssr: false,
  loading: () => (
    <div className="h-screen w-screen flex items-center justify-center bg-gray-50">
      <div className="text-center">
        <div className="w-8 h-8 border-4 border-[#2D6A4F] border-t-transparent rounded-full animate-spin mx-auto mb-3" />
        <p className="text-gray-500 text-sm">Carregando mapa...</p>
      </div>
    </div>
  ),
})

export default function MapaClient() {
  const { loading, session } = useAuthSession()
  const searchParams = useSearchParams()
  const searchQuery = searchParams.get('q')
  const geoApiUrl = process.env.NEXT_PUBLIC_GEO_API_URL ?? ''

  // Congela o JWT no primeiro render com auth carregado.
  // Impede o iframe de remontar quando o Supabase renova o token.
  const frozenToken = useRef<string | null | undefined>(undefined)

  // Aguarda o estado de auth carregar
  if (loading) {
    return (
      <div className="h-screen w-screen flex items-center justify-center bg-gray-50">
        <div className="text-center">
          <div className="w-8 h-8 border-4 border-[#2D6A4F] border-t-transparent rounded-full animate-spin mx-auto mb-3" />
          <p className="text-gray-500 text-sm">Verificando sessão...</p>
        </div>
      </div>
    )
  }

  // Auth carregado — congela o token (null se não logado)
  if (frozenToken.current === undefined) {
    frozenToken.current = session?.access_token ?? null
  }

  return (
    <>
      <MapEmbedded
        authToken={frozenToken.current}
        geoApiUrl={geoApiUrl}
        searchQuery={searchQuery}
      />
      <LeadCaptureSheet trigger="timer" timerMs={20000} />
    </>
  )
}
