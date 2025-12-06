import { Item } from '@/db'
import createDatapack from '@/db/datapack/methods/createDatapack'
import createSystem from '@/db/system/methods/createSystem'

export default async (type: 'system' | 'datapack' , itemData: Item) => {
  switch (type) {
    case 'system':
      return await createSystem(itemData)
    case 'datapack':
      return await createDatapack(itemData)
  }
}