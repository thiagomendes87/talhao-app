import type { Metadata } from 'next'
import MapaClient from './MapaClient'

export const metadata: Metadata = {
  title: 'Mapa — Talhão',
  description: 'Navegue pelo mapa interativo de propriedades rurais do Brasil.',
}

// Nota: a verificação de autenticação acontece no MapaClient (client-side)
// para manter compatibilidade com o setup atual de @supabase/supabase-js.
// Para auth server-side real, seria necessário adicionar @supabase/ssr.
export default function MapaPage() {
  return <MapaClient />
}
