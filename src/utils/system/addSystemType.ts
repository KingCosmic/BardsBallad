import { produce } from 'immer';
import { SystemData } from '@storage/schemas/system';

export default async (data: SystemData, typeName: string) => {
  return produce(data, draft => {
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
