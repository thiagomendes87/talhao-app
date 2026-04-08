import { Suspense } from 'react'
import AssinarClient from './client'

export default function AssinarPage() {
  return (
    <Suspense fallback={<div className="min-h-screen flex items-center justify-center">Carregando...</div>}>
      <AssinarClient />
    </Suspense>
  )
}
