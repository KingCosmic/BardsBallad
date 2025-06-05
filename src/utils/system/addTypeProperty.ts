import { produce } from 'immer';
import { SystemData, TypeData } from '@storage/schemas/system';

export default async (data: SystemData, name: string, newProperty: { key: string, typeData: TypeData }) => {
  return produce(data, draft => {
    const typeIndex = draft.types.findIndex(type => type.name === name)

    if (typeIndex === -1) return

    const propIndex = draft.types[typeIndex].properties.findIndex(prop => prop.key === newProperty.key)

    if (propIndex !== -1) return

    draft.types[typeIndex].properties.push(newProperty)
  })
}
