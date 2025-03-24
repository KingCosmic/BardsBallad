import { useEffect, useState } from 'react'
import { database } from '../storage'
import { SystemData } from '../types/system'

export function useSystems() {
  const [systems, setSystems] = useState<SystemData[]>([])
  const [loading, setLoading] = useState(database.loading$.value)

  useEffect(() => {
    const subscription = database.loading$.subscribe(setLoading)

    return () => subscription.unsubscribe()
  }, [])

  useEffect(() => {
    if (loading) return
    // Subscribe to changes
    const sub = database.systems.find().$.subscribe(newSystems => {
      setSystems(newSystems.map(doc => doc.toJSON()))
    })

    return () => sub.unsubscribe()
  }, [loading])

  return { systems, loading }
} 