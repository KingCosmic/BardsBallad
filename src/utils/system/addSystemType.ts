import { produce } from 'immer';
import { SystemData } from '@storage/schemas/system';

export default async (data: SystemData, typeName: string) => {
  return produce(data, draft => {
    const index = draft.types.findIndex(data => data.name === typeName)

    if (index !== -1) return

    draft.types.push({
      name: typeName,
      properties: [
        {
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
      ]
    })
  })
}
