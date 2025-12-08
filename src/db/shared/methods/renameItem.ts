import renameDatapack from '@/db/datapack/methods/renameDatapack'
import renameSystem from '@/db/system/methods/renameSystem'

export default async (type: 'system' | 'theme' | 'datapack', local_id: string, newName: string) => {
  switch (type) {
    case 'system':
      return await renameSystem(local_id, newName)
    case 'datapack':
      return await renameDatapack(local_id, newName)
  }
}