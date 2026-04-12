import getDatapack from '@/db/datapack/methods/getDatapack'
import getSystem from '@/db/system/methods/getSystem'
import { Item } from '../schema'
import getCharacter from '@/db/character/methods/getCharacter'

export default async (type: 'system' | 'datapack' | 'theme' | 'character', item_id: string): Promise<Item | undefined> => {
  switch (type) {
    case 'system':
      return await getSystem(item_id)
    case 'datapack':
      return await getDatapack(item_id)
    case 'character':
      return await getCharacter(item_id)
  }
}