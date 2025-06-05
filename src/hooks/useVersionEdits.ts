import { db } from '@/storage'
import { VersionedResource } from '@storage/schemas/versionedResource'
import { useMemo } from 'react'
import duplicateVersionedResource from '@storage/methods/versionedresources/duplicateVersionedResource'
import { useLiveQuery } from 'dexie-react-hooks'

export function useVersionEdits<T>(edit_id: string | undefined): (Omit<VersionedResource, 'data'> & { data: T }) | undefined {
  const [id] = useMemo(() => edit_id?.split('|') || [''], [edit_id])
  
  const edits = useLiveQuery(async () => {
    if (!edit_id) return undefined;
    let v = await db.versions.get(edit_id);
    if (!v) {
      const original = await db.versions.get(id);
      if (!original) return;
      await duplicateVersionedResource(original, edit_id);
      v = await db.versions.get(edit_id); // fetch newly created
    }
    return v;
  }, [edit_id, id]);
  
  if (!edits) return

  return {
    ...edits,
    data: edits?.data as T
  }
}
