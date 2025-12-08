import { checkInternetAccess } from '@/lib/api/misc/checkInternetAccess'
import { authState } from '@/state/auth'
import { setOnlineState } from '@/state/sync'
import { sync } from '@/sync'
import { useCallback, useEffect, useRef } from 'react'

const syncTimer = 30 * 1000

export default () => {
  const syncRef = useRef<NodeJS.Timeout | null>(null)
  const startedRef = useRef(false)
  const mountedRef = useRef(false)

  const runSync = useCallback(async () => {
    if (startedRef.current || !mountedRef.current) return

    startedRef.current = true
    try {
      const isOnline = await checkInternetAccess()
      const { isLoggedIn } = authState.get()

      setOnlineState(isOnline)

      if (isOnline && isLoggedIn) {
        await sync()
      }
    } catch (e) {
      console.error('Error in sync', e)
    } finally {
      startedRef.current = false
      if (mountedRef.current) {
        syncRef.current = setTimeout(runSync, syncTimer)
      }
    }
  }, [])

  useEffect(() => {
    mountedRef.current = true
    runSync()

    return () => {
      mountedRef.current = false
      startedRef.current = false
      if (syncRef.current) {
        clearTimeout(syncRef.current)
        syncRef.current = null
      }
    }
  }, [])
}