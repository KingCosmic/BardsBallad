import updateSystem from './updateSystem';

export default async (local_id: string, oldName: string, newName: string) => {
  await updateSystem(local_id, (draft) => {
    const index = draft.types.findIndex((type => type.name === oldName))

    if (index === -1) return

    draft.types[index].name = newName
  })
}