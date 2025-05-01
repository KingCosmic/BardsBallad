import { db } from '../storage'
import { VersionedResource } from '../storage/schemas/versionedResource'
import { useEffect, useMemo, useState } from 'react'
import duplicateVersionedResource from '../storage/methods/versionedresources/duplicateVersionedResource'

export function useVersionEdits<T>(edit_id: string | undefined): (Omit<VersionedResource, 'data'> & { data: T }) | undefined {
  const [id] = useMemo(() => edit_id?.split('|') || [''], [edit_id])

  const [edits, setEdits] = useState<VersionedResource | undefined>(undefined)

  useEffect(() => {
    const getEdits = async () => {
      let v = await db.versions.get(edit_id ?? '')

      if (v) return setEdits(v)

      const original = await db.versions.get(id)
  
      if (!original) return setEdits(undefined)
  
      setEdits(await duplicateVersionedResource(original, edit_id ?? ''))
    }

    getEdits()
  }, [edit_id, id, setEdits])
  
  if (!edits) return

  return {
    ...edits,
    data: edits?.data as T
  }
}