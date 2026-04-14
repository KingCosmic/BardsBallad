import createWholeSubscription from '@/db/subscription/methods/createWholeSubscription'

export default async (name: string, slug: string, data: any, system: string, datapacks: { pack_id: string, version_id: string }[]) => {
  try {
    return createWholeSubscription('character', {
      ...data,
      _slug: slug,
      _name: name,
      _system: system,
      _datapacks: datapacks
    })
  } catch (e) {
    console.log('Error creating character:', e);
  }
}