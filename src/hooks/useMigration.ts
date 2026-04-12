/**
 * Hook to run Automerge migration on app startup
 */

import { useEffect, useState } from 'react'
import { runMigration, isMigrationComplete, getMigrationStats } from '@/db/migration'

export function useMigration() {
  const [migrationStatus, setMigrationStatus] = useState<'pending' | 'running' | 'complete' | 'error'>('pending')
  const [error, setError] = useState<Error | null>(null)

  useEffect(() => {
    async function migrate() {
      if (isMigrationComplete()) {
        setMigrationStatus('complete')
        console.log('Migration stats:', getMigrationStats())
        return
      }

      setMigrationStatus('running')
      try {
        await runMigration()
        setMigrationStatus('complete')
        console.log('Migration stats:', getMigrationStats())
      } catch (err) {
        setError(err as Error)
        setMigrationStatus('error')
        console.error('Migration error:', err)
      }
    }

    migrate()
  }, [])

  return { migrationStatus, error }
}
