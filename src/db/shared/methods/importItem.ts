import { Item } from '@/db'
import importDatapack from '@/db/datapack/methods/importDatapack'
import importSystem from '@/db/system/methods/importSystem'
import { VersionedResource } from '@/db/version/schema'

export default async (type: 'system' | 'datapack' , item: Item, version: VersionedResource) => {
  switch (type) {
    case 'system':
      return await importSystem(item, version)
    case 'datapack':
      return await importDatapack(item, version)
  }
}