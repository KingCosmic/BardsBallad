import createDatapack from '@/db/datapack/methods/createDatapack'
import createSystem from '@/db/system/methods/createSystem'
import { Item } from '../schema'

export default async (type: 'system' | 'datapack' , itemData: Item) => {
  switch (type) {
    case 'system':
      return await createSystem(itemData)
    case 'datapack':
      return await createDatapack(itemData)
  }
}