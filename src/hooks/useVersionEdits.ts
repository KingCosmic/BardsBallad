import { db } from '../storage'
import { VersionedResource } from '../storage/schemas/versionedResource'
import { useEffect, useMemo, useState } from 'react'
import duplicateVersionedResource from '../storage/methods/versionedresources/duplicateVersionedResource'
import { useVersionResource } from './useVersionResource'

export function useVersionEdits<T>(edit_id: string | undefined): (Omit<VersionedResource, 'data'> & { data: T }) | undefined {
  const [id] = useMemo(() => edit_id?.split('|') || [''], [edit_id])
  const edits = useVersionResource(edit_id)

  useEffect(() => {
    const getEdits = async () => {
      let v = await db.versions.get(edit_id ?? '')

      if (v) return

      const original = await db.versions.get(id)
  
      if (!original) return
  
      duplicateVersionedResource(original, edit_id ?? '')
    }

    if (!edits) getEdits()
  }, [edit_id, id, edits])
  
  if (!edits) return

  return {
    ...edits,
    data: edits?.data as T
  }
}