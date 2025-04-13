import updateSystem from './updateSystem';

export default async (local_id: string) => {
  await updateSystem(local_id, (draft) => {
    const index = draft.data.findIndex((data => data.name === 'New Data'))

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