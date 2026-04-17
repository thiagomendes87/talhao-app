import type { Metadata } from 'next'
import { Suspense } from 'react'
import MapaClient from './MapaClient'

export const metadata: Metadata = {
  title: 'Mapa — Talhão',
  description: 'Navegue pelo mapa interativo de propriedades rurais do Brasil.',
}

export default function MapaPage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center">
          <div className="w-8 h-8 border-4 border-[#2D6A4F] border-t-transparent rounded-full animate-spin mx-auto mb-3" />
          <p className="text-gray-500 text-sm">Carregando mapa...</p>
        </div>
      </div>
    }>
      <MapaClient />
    </Suspense>
  )
}
