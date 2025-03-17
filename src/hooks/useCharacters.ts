import { useEffect, useState } from 'react'
import { database } from '../storage'
import { CharacterData } from '../types/character'

export function useCharacters() {
  const [characters, setCharacters] = useState<CharacterData[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const subscription = database.loading$.subscribe(setLoading)

    return () => subscription.unsubscribe()
  }, [])

  useEffect(() => {
    if (loading) return

    // Subscribe to all characters
    const sub = database.characters
      .find()
      .$
      .subscribe(docs => {
        setCharacters(docs.map(doc => doc.toJSON()))
      })

    return () => sub.unsubscribe()
  }, [loading])

  return { characters, loading }
} 