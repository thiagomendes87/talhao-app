'use client'

import { useEffect, useRef, useState } from 'react'
import styles from './styles/mapa.module.css'

export default function MapEmbedded() {
  const [iframeSrc, setIframeSrc] = useState<string>('')

  useEffect(() => {
    // window.__TALHAO_JWT e window.__GEO_API_URL são injetados pelo MapaClient antes de montar este componente
    const jwt = (window as any).__TALHAO_JWT as string | undefined
    const geoUrl = ((window as any).__GEO_API_URL as string | undefined)
      ?.replace(/\/$/, '') ?? 'http://localhost:8000'

    // Passa JWT via URL param para o produto geoespacial conseguir autenticar
    const url = jwt ? `${geoUrl}/?jwt=${encodeURIComponent(jwt)}` : `${geoUrl}/`
    setIframeSrc(url)
  }, [])

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
