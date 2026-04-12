import { db } from '@/db'
import { VersionedResource } from '@/db/version/schema'
import { useEffect, useMemo } from 'react'
import duplicateVersionedResource from '@/db/version/methods/duplicateVersionedResource'
import { useLiveQuery } from 'dexie-react-hooks'

export function useVersionEdits<T>(edit_id: string | undefined): (Omit<VersionedResource, 'data'> & { data: T }) | undefined {
  const [original_id] = useMemo(() => edit_id?.split('|') || [''], [edit_id])
  const query = useLiveQuery(async () => {
    const edits = await db.versions.get(edit_id ?? '')

    return {
      hasLooked: true,
      edits
    }
  }, [edit_id])

  useEffect(() => {
    const getOrCreateEdits = async () => {
      // if we have no edit_id, just return.
      if (!edit_id) return
      if (!query) return

      if (query.hasLooked && query.edits) return

      const original = await db.versions.get(original_id);
      if (!original) return;
      await duplicateVersionedResource(original, edit_id);
    }

    getOrCreateEdits()
  }, [query, edit_id])

  const returnObject = useMemo(() => (!query || !query.edits) ? undefined : ({ ...query.edits, data: query.edits.data as T }), [query])
  
  return returnObject
}