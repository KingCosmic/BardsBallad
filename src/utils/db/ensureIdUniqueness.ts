import { db } from '@/storage'

// This functions makes sure a id is unique across all database tables.
const ensureUniqueness = async (id: string) => {
  const results = await Promise.all(
    db.tables.map(tb => tb.get(id))
  )

  for (let i = 0; i < results.length; i++) {
    if (results[i]) return false
  }

  return true
}

export default ensureUniqueness
