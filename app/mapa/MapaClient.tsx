'use client'

import { useMemo } from 'react'
import { useSearchParams } from 'next/navigation'
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
  const { loading, session } = useAuthSession()
  const searchParams = useSearchParams()
  const searchQuery = searchParams.get('q')
  const authToken = session?.access_token ?? null
  const geoApiUrl = process.env.NEXT_PUBLIC_GEO_API_URL ?? ''

  const iframeKey = useMemo(
    () => `${authToken ?? 'anonymous'}::${searchQuery ?? ''}`,
    [authToken, searchQuery]
  )

  if (loading) {
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
      key={iframeKey}
      authToken={authToken}
      geoApiUrl={geoApiUrl}
      searchQuery={searchQuery}
    />
  )
}
