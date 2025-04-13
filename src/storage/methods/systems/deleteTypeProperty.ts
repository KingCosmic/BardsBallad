import updateSystem from './updateSystem';

export default async (local_id: string, typeName: string, key: string) => {
  await updateSystem(local_id, (draft) => {
    for (let t = 0; t < draft.types.length; t++) {
      const type = draft.types[t]

      if (type.name !== typeName) continue

      const index = type.properties.findIndex((prop => prop.key === key))

      if (index === -1) return

      type.properties.splice(index, 1)
    }
  })
}