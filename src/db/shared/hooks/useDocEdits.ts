import { db } from '@/db'
import { useEffect, useMemo } from 'react'
import duplicateVersionedResource from '@/db/version/methods/duplicateVersionedResource'
import { useLiveQuery } from 'dexie-react-hooks'
import { Item } from '../schema'

export function useDocEdits(edit_id: string | undefined): Item | undefined {
  const [original_id] = useMemo(() => edit_id?.split('|') || [''], [edit_id])

  const query = useLiveQuery(async () => {
    const edits = await db.docs.get(edit_id ?? '')

    return {
      hasLooked: true,
      edits
    }
  }, [edit_id])

  useEffect(() => {
    const getOrCreateEdits = async () => {
      // if we have no edit_id, just return.
      if (!edit_id) return
      if (!query || !query.hasLooked) return

      if (query.hasLooked && query.edits) return

      const original = await db.docs.get(original_id);
      if (!original) return;
      await duplicateVersionedResource(original, edit_id);
    }

    getOrCreateEdits()
  }, [query, edit_id])

  const returnObject = useMemo(() => (!query || !query.edits) ? undefined : query.edits, [query])
  
  return returnObject
}