import { type TypeData } from '../../schemas/system'
import updateSystem from './updateSystem';

export default async (local_id: string, name: string) => {
  let newProperty: {
    key: string;
    typeData: TypeData;
  } = {
    key: 'newProperty',
    typeData: {
      type: 'string',
      options: [],
      isArray: false,
      useTextArea: false,
      inputs: [],
      outputType: 'none',
      isOutputAnArray: false
    }
  }

  await updateSystem(local_id, (draft) => {
    const index = draft.types.findIndex((type => type.name === name))

    if (index === -1) return

    draft.types[index].properties.push(newProperty)
  })

  return newProperty
}