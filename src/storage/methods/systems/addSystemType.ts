import updateSystem from './updateSystem';

export default async (local_id: string, typeName: string) => {
  await updateSystem(local_id, (draft) => {
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