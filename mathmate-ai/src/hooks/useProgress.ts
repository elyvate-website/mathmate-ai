'use client'
import { useState, useEffect } from 'react'
import { createClient }  from '@/lib/supabase/client'
import { UserStats }     from '@/types'

export function useProgress(userId: string | undefined) {
  const supabase = createClient()
  const [stats,   setStats]   = useState<UserStats | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    if (!userId) { setLoading(false); return }
    supabase
      .from('user_stats')
      .select('*')
      .eq('user_id', userId)
      .single()
      .then(({ data }) => { setStats(data); setLoading(false) })
  }, [userId, supabase])

  return { stats, loading }
}
