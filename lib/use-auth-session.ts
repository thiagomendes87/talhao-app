'use client'

import { useEffect, useState } from 'react'
import type { Session, User } from '@supabase/supabase-js'
import { supabase } from '@/lib/supabase'

type AuthSessionState = {
  isAuthenticated: boolean
  loading: boolean
  session: Session | null
  user: User | null
}

export function useAuthSession(): AuthSessionState {
  const [session, setSession] = useState<Session | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    let active = true

    const syncSession = async () => {
      const { data: { session: currentSession } } = await supabase.auth.getSession()

      if (!active) {
        return
      }

      setSession(currentSession ?? null)
      setLoading(false)
    }

    syncSession()

    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, nextSession) => {
      if (!active) {
        return
      }

      setSession(nextSession ?? null)
      setLoading(false)
    })

    return () => {
      active = false
      subscription.unsubscribe()
    }
  }, [])

  return {
    isAuthenticated: Boolean(session?.user),
    loading,
    session,
    user: session?.user ?? null,
  }
}
