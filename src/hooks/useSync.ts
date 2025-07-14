import { checkInternetAccess } from '@api/checkInternetAccess'
import { authState } from '@state/auth'
import { setOnlineState } from '@state/sync'
import { sync } from '@sync/index'
import { useEffect, useRef } from 'react'

export default () => {
  const syncRef = useRef<NodeJS.Timeout | null>(null)

  useEffect(() => {
    const runSync = async () => {
      try {
        const isOnline = await checkInternetAccess()
        const { isLoggedIn } = authState.get()

        setOnlineState(isOnline)

        if (isOnline && isLoggedIn) {
          await sync()
        }
      } catch (e) {
        console.error('Error in sync', e)
      }

      syncRef.current = setTimeout(runSync, 10 * 1000) // every 10 seconds
    }

    runSync()

    return () => {
      if (!syncRef.current) return

      clearTimeout(syncRef.current)
    }
  }, [])
}