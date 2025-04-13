import updateSystem from './updateSystem';

export default async (local_id: string, name: string) => {
  await updateSystem(local_id, (draft) => {
    const index = draft.creator.findIndex((data => data.name === name))

    if (index === -1) return

    draft.creator.splice(index, 1)
  })
}