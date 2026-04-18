'use client'

import { useEffect, useState } from 'react'
import styles from './styles/mapa.module.css'

type MapEmbeddedProps = {
  authToken: string | null
  geoApiUrl: string
  searchQuery: string | null
}

export default function MapEmbedded({ authToken, geoApiUrl, searchQuery }: MapEmbeddedProps) {
  const [iframeSrc, setIframeSrc] = useState<string>('')

  useEffect(() => {
    const cleanGeoUrl = geoApiUrl.replace(/\/$/, '') || 'http://localhost:8000'

    const params = new URLSearchParams()

    if (authToken) {
      params.set('jwt', authToken)
    }

    if (searchQuery) {
      params.set('busca', searchQuery)
    }

    const qs = params.toString()
    const url = qs ? `${cleanGeoUrl}/?${qs}` : `${cleanGeoUrl}/`
    setIframeSrc(url)
  }, [authToken, geoApiUrl, searchQuery])

  if (!iframeSrc) {
    return (
      <div className={styles.loadingWrapper}>
        <div className={styles.spinner} />
        <p className={styles.loadingText}>Carregando mapa...</p>
      </div>
    )
  }

  return (
    <iframe
      src={iframeSrc}
      className={styles.mapIframe}
      title="Mapa Talhão"
      allow="geolocation"
    />
  )
}
