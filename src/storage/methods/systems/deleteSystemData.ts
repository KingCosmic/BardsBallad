import updateSystem from './updateSystem';

export default async (local_id: string, name: string) => {
  await updateSystem(local_id, (draft) => {
    const index = draft.data.findIndex((data => data.name === name))

    if (index === -1) return

    draft.data.splice(index, 1)
  })
}