import updateSystem from './updateSystem';

export default async (local_id: string, oldName: string, newName: string) => {
  await updateSystem(local_id, (draft) => {
    const index = draft.pages.findIndex((data => data.name === oldName))
    
    if (index !== -1) return

    draft.pages[index].name = newName
  })
}