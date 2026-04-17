'use client'

import { useEffect, useState } from 'react'
import { useSearchParams } from 'next/navigation'
import { supabase } from '@/lib/supabase'
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
  const [pronto, setPronto] = useState(false)
  const searchParams = useSearchParams()

  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      if (session?.access_token) {
        ;(window as any).__TALHAO_JWT = session.access_token
      }
      ;(window as any).__GEO_API_URL = process.env.NEXT_PUBLIC_GEO_API_URL ?? ''
      
      // Passa query de busca da landing-page para o produto
      const q = searchParams.get('q')
      if (q) {
        ;(window as any).__TALHAO_BUSCA = q
      }

      setPronto(true)
    })
  }, [searchParams])

  if (!pronto) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center">
          <div className="w-8 h-8 border-4 border-[#2D6A4F] border-t-transparent rounded-full animate-spin mx-auto mb-3" />
          <p className="text-gray-500 text-sm">Carregando mapa...</p>
        </div>
      </div>
    )
  }

  // MapEmbedded agora é um iframe full-screen — sem wrapper extra
  return <MapEmbedded />
}
