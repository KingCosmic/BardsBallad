import { Item } from '@storage/index'
import createDatapack from '@storage/methods/datapacks/createDatapack'
import { createSystem } from '@storage/methods/systems'

export default async (type: 'system' | 'datapack' , itemData: Item) => {
  switch (type) {
    case 'system':
      return await createSystem(itemData)
    case 'datapack':
      return await createDatapack(itemData)
  }
}