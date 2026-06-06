'use client'
import { useEffect, useState, useCallback } from 'react'
import { User }        from '@supabase/supabase-js'
import { createClient } from '@/lib/supabase/client'
import { Profile }     from '@/types'

export function useAuth() {
  const supabase = createClient()
  const [user,    setUser]    = useState<User | null>(null)
  const [profile, setProfile] = useState<Profile | null>(null)
  const [loading, setLoading] = useState(true)

  const fetchProfile = useCallback(async (userId: string) => {
    const { data } = await supabase
      .from('profiles')
      .select('*')
      .eq('id', userId)
      .single()
    setProfile(data)
  }, [supabase])

  useEffect(() => {
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      async (_event, session) => {
        setUser(session?.user ?? null)
        if (session?.user) await fetchProfile(session.user.id)
        else setProfile(null)
        setLoading(false)
      }
    )
    return () => subscription.unsubscribe()
  }, [supabase, fetchProfile])

  const signOut = async () => {
    await supabase.auth.signOut()
    window.location.href = '/login'
  }

  return { user, profile, loading, signOut }
}
