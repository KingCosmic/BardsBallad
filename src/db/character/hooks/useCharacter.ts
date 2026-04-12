import { useLiveQuery } from 'dexie-react-hooks'
import { db } from '@/db'
import { useMemo } from 'react'

import * as automerge from '@automerge/automerge'

export function useCharacter(characterId: string) {
  const c = useLiveQuery(() => db.docs.get(characterId), [characterId])

  const character = useMemo(() => {
    if (!c) return
    
    console.log('running!')

    // TODO: add our correct character Type
    return (automerge.load<any>(c.doc))
  }, [c])

  return c
}