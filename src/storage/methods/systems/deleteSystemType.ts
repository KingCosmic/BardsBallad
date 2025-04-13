import updateSystem from './updateSystem';

export default async (local_id: string, name: string) => {
  await updateSystem(local_id, (draft) => {
    const index = draft.types.findIndex((type => type.name === name)) 

    if (index === -1) return

    draft.types.splice(index, 1)
  })
}