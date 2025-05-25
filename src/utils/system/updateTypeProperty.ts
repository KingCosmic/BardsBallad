import { produce } from 'immer';
import { SystemData, TypeData } from '@storage/schemas/system';

export default async (data: SystemData, typeName: string, oldKey: string, property: { key: string; typeData: TypeData }) => {
  return produce(data, draft => {
    for (let t = 0; t < draft.types.length; t++) {
      const type = draft.types[t]

      if (type.name !== typeName) continue

      const index = type.properties.findIndex(prop => prop.key === oldKey)

      if (index === -1) return

      if (oldKey !== property.key) {
        type.properties.splice(index, 1)
        type.properties.push(property)
      } else {
        type.properties[index] = property
      }
    }
  })
}
