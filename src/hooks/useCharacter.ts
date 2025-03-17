import { useEffect, useState } from 'react'
import { database } from '../storage'
import { CharacterData } from '../types/character'

export function useCharacter(characterId: string | undefined) {
  const [character, setCharacter] = useState<CharacterData | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const subscription = database.loading$.subscribe(setLoading)

    return () => subscription.unsubscribe()
  }, [])

  useEffect(() => {
    if (!characterId || loading) return

    // Subscribe to single character changes
    const sub = database.characters
      .findOne(characterId)
      .$
      .subscribe(doc => {
        if (doc) {
          setCharacter(doc.toJSON())
        } else {
          setCharacter(null)
        }
      })

    return () => sub.unsubscribe()
  }, [characterId, loading])

  return character
} 