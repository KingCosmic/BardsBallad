import { produce } from 'immer';
import { SystemData } from '@storage/schemas/system';

export default async (data: SystemData, typeName: string, key: string) => {
  return produce(data, draft => {
    for (let t = 0; t < draft.types.length; t++) {
      const type = draft.types[t]

      if (type.name !== typeName) continue

      const index = type.properties.findIndex((prop => prop.key === key))

      if (index === -1) return

      type.properties.splice(index, 1)
    }
  })
}
