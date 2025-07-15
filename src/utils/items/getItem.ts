import { Item } from '@storage/index'
import getDatapack from '@storage/methods/datapacks/getDatapack'
import getSystem from '@storage/methods/systems/getSystem'

export default async (type: 'system' | 'datapack' | 'theme', item_id: string): Promise<Item | undefined> => {
  switch (type) {
    case 'system':
      return await getSystem(item_id)
    case 'datapack':
      return await getDatapack(item_id)
  }
}