import deleteDatapack from '@/db/datapack/methods/deleteDatapack'
import deleteSystem from '@/db/system/methods/deleteSystem'

export default async (type: 'system' | 'datapack' | 'theme', local_id: string, force: boolean = false) => {
  switch (type) {
    case 'system':
      return await deleteSystem(local_id, force)
    case 'datapack':
      return await deleteDatapack(local_id, force)
  }
}