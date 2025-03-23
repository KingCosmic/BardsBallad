import { useEffect, useState } from 'react'
import { database } from '../storage'
import { SystemData } from '../types/system'

export function useSystem(systemId: string | undefined) {
  const [system, setSystem] = useState<SystemData | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const subscription = database.loading$.subscribe(setLoading)

    return () => subscription.unsubscribe()
  }, [])

  useEffect(() => {
    if (!systemId || loading) return

    // Subscribe to single system changes
    const sub = database.systems
      .findOne(systemId)
      .$
      .subscribe(doc => {
        if (doc) {
          setSystem(doc.toJSON())
        } else {
          setSystem(null)
        }
      })

    return () => sub.unsubscribe()
  }, [systemId, loading])

  return { system, loading }
} 