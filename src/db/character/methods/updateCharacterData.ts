import { db } from '@/db'
import { characterShadow } from '@/newsync/shadows';
import * as automerge from '@automerge/automerge'

export default async (local_id: string, newData: any) => {
  try {
    return await db.docs.update(local_id, {
      doc: newData,
      shadow: characterShadow(automerge.load(newData))
    })
  } catch (e) {
    console.log('Error updating character data:', e);
  }
}
