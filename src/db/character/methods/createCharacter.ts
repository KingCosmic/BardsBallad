import createWholeSubscription from '@/db/subscription/methods/createWholeSubscription'

export default async (name: string, slug: string, data: any, system: string, datapacks: { pack_id: string, version_id: string }[]) => {
  try {
    const normalizedData = (data && typeof data === 'object' && data.data && typeof data.data === 'object')
      ? data.data
      : (data && typeof data === 'object' ? data : {})

    return createWholeSubscription('character', {
      name,
      slug,
      description: '',
      progression: {
        level: 1,
      },
      selections: {},
      data: normalizedData,
      states: [],
      overrides: {},
      system,
      datapacks,
    })
  } catch (e) {
    console.log('Error creating character:', e);
  }
}