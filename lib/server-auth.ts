import { createClient, type User } from '@supabase/supabase-js'
import type { NextRequest } from 'next/server'

let supabaseAdminClient: ReturnType<typeof createClient> | null = null

function getRequiredEnv(name: string) {
  const value = process.env[name]

  if (!value) {
    throw new Error(`Missing required environment variable: ${name}`)
  }

  return value
}

export function getSupabaseAdminClient() {
  if (!supabaseAdminClient) {
    supabaseAdminClient = createClient(
      getRequiredEnv('NEXT_PUBLIC_SUPABASE_URL'),
      getRequiredEnv('SUPABASE_SERVICE_ROLE_KEY'),
      {
        auth: {
          autoRefreshToken: false,
          persistSession: false,
        },
      }
    )
  }

  return supabaseAdminClient
}

export function getBearerToken(request: NextRequest) {
  const authorization = request.headers.get('authorization') ?? ''

  if (!authorization.startsWith('Bearer ')) {
    return null
  }

  const token = authorization.slice('Bearer '.length).trim()
  return token || null
}

export async function getAuthenticatedUserFromRequest(request: NextRequest): Promise<User | null> {
  const token = getBearerToken(request)

  if (!token) {
    return null
  }

  const supabase = getSupabaseAdminClient()
  const { data, error } = await supabase.auth.getUser(token)

  if (error || !data.user) {
    return null
  }

  return data.user
}
