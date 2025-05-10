import { produce } from 'immer';
import { SystemData, TypeData } from '../../storage/schemas/system';

export default async (data: SystemData, name: string, newProperty: { key: string, typeData: TypeData }) => {
  return produce(data, draft => {
    const index = draft.types.findIndex(type => type.name === name)

    if (index === -1) return

    draft.types[index].properties.push(newProperty)
  })
}