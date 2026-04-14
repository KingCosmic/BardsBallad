import importDatapack from '@/db/datapack/methods/importDatapack'
import importSystem from '@/db/system/methods/importSystem'
import { Item } from '../schema'

export default async (item: Item) => {
  switch (item.type) {
    case 'system':
      return await importSystem(item)
    case 'datapack':
      return await importDatapack(item, null)
  }
}