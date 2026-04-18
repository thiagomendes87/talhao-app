import { createClient } from '@supabase/supabase-js'

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL ?? 'https://placeholder.supabase.co'
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY ?? 'placeholder-key'
const defaultAuthNextPath = '/mapa'

export const supabase = createClient(supabaseUrl, supabaseKey, {
  auth: {
    detectSessionInUrl: true,
  },
})

export function getSafeNextPath(next?: string | null, fallback = defaultAuthNextPath) {
  if (!next || !next.startsWith('/')) {
    return fallback
  }

  return next
}

export function buildAuthCallbackUrl(next = defaultAuthNextPath) {
  const safeNext = getSafeNextPath(next)

  if (typeof window === 'undefined') {
    return `/auth/callback?next=${encodeURIComponent(safeNext)}`
  }

  const callbackUrl = new URL('/auth/callback', window.location.origin)
  callbackUrl.searchParams.set('next', safeNext)
  return callbackUrl.toString()
}

export function buildLoginPath(next = defaultAuthNextPath, message?: string) {
  const params = new URLSearchParams()
  const safeNext = getSafeNextPath(next)

  params.set('next', safeNext)

  if (message) {
    params.set('message', message)
  }

  return `/entrar?${params.toString()}`
}
