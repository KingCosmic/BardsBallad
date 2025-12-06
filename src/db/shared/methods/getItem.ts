import { Item } from '@/db'
import getDatapack from '@/db/datapack/methods/getDatapack'
import getSystem from '@/db/system/methods/getSystem'

export default async (type: 'system' | 'datapack' | 'theme', item_id: string): Promise<Item | undefined> => {
  switch (type) {
    case 'system':
      return await getSystem(item_id)
    case 'datapack':
      return await getDatapack(item_id)
  }
}