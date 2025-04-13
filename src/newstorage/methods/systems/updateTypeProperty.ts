import { TypeData } from '../../../types/system';
import updateSystem from './updateSystem';

export default async (local_id: string, typeName: string, oldKey: string, data: { key: string; typeData: TypeData }) => {
  await updateSystem(local_id, (draft) => {
    for (let t = 0; t < draft.types.length; t++) {
      const type = draft.types[t]

      if (type.name !== typeName) continue

      const index = type.properties.findIndex((prop => prop.key === oldKey))

      if (index === -1) return

      if (oldKey !== data.key) {
        type.properties.splice(index, 1)
        type.properties.push(data)
      } else {
        type.properties[index] = data
      }
    }
  })
}