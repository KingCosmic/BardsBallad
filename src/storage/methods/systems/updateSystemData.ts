import updateSystem from './updateSystem';

export default async (local_id: string, oldName: string, newData: any) => {
  await updateSystem(local_id, (draft) => {
    const index = draft.data.findIndex((data => data.name === oldName))

    if (index === -1) return

    if (oldName !== newData.name) {
      draft.data.splice(index, 1)
      draft.data.push(newData)
    } else {
      draft.data[index] = newData
    }
  })
}