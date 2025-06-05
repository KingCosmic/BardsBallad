import { produce } from 'immer';
import { SystemData } from '@storage/schemas/system';

export default async (data: SystemData) => {
  return produce(data, draft => {
    const index = draft.data.findIndex(data => data.name === 'New Data')

    if (index !== -1) return

    draft.data.push({
      name: 'New Data',
      typeData: {
        type: 'string',
        options: [],
        isArray: false,
        useTextArea: false,
        inputs: [],
        outputType: 'none',
        isOutputAnArray: false
      },
      data: 'lorem ipsum'
    })
  })
}
