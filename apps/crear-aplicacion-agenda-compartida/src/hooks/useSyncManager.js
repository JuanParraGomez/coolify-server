import { useCallback, useEffect, useRef, useState } from 'react'
import { detectConflict, resolveMerge } from '../lib/mock-data'

/**
 * Hook for managing data sync and conflict resolution
 * Prepares app for real-time sync via Socket.io
 */
export function useSyncManager(
  localTasks = [],
  localEvents = [],
  onTasksSync = () => {},
  onEventsSync = () => {},
  syncInterval = 30000
) {
  const [syncStatus, setSyncStatus] = useState('idle')
  const [lastSyncTime, setLastSyncTime] = useState(null)
  const [pendingChanges, setPendingChanges] = useState({ tasks: [], events: [] })
  const syncTimerRef = useRef(null)

  // Track local changes
  const trackChange = useCallback((type, entity, operation) => {
    setPendingChanges(prev => ({
      ...prev,
      [type]: [
        ...prev[type],
        {
          entity,
          operation,
          timestamp: new Date().toISOString(),
        },
      ],
    }))
  }, [])

  // Queue task for sync
  const queueTaskChange = useCallback(
    (task, operation = 'update') => {
      trackChange('tasks', task, operation)
    },
    [trackChange]
  )

  // Queue event for sync
  const queueEventChange = useCallback(
    (event, operation = 'update') => {
      trackChange('events', event, operation)
    },
    [trackChange]
  )

  // Simulate sync with server
  const performSync = useCallback(async () => {
    if (syncStatus === 'syncing') return

    setSyncStatus('syncing')
    try {
      // Simulate network delay
      await new Promise(resolve => setTimeout(resolve, 500))

      // Here you would send pendingChanges to server
      // For now, we'll just resolve and clear pending changes
      onTasksSync(localTasks)
      onEventsSync(localEvents)

      setPendingChanges({ tasks: [], events: [] })
      setLastSyncTime(new Date().toISOString())
      setSyncStatus('synced')

      // Reset status after showing success
      setTimeout(() => setSyncStatus('idle'), 2000)
    } catch (error) {
      console.error('Sync failed:', error)
      setSyncStatus('error')
      setTimeout(() => setSyncStatus('idle'), 3000)
    }
  }, [syncStatus, localTasks, localEvents, onTasksSync, onEventsSync])

  // Periodic sync
  useEffect(() => {
    syncTimerRef.current = setInterval(() => {
      if (pendingChanges.tasks.length > 0 || pendingChanges.events.length > 0) {
        performSync()
      }
    }, syncInterval)

    return () => {
      if (syncTimerRef.current) {
        clearInterval(syncTimerRef.current)
      }
    }
  }, [pendingChanges, syncInterval, performSync])

  // Handle offline/online status
  useEffect(() => {
    const handleOnline = () => setSyncStatus('idle')
    const handleOffline = () => setSyncStatus('offline')

    window.addEventListener('online', handleOnline)
    window.addEventListener('offline', handleOffline)

    return () => {
      window.removeEventListener('online', handleOnline)
      window.removeEventListener('offline', handleOffline)
    }
  }, [])

  // Resolve conflicts between local and remote
  const resolveConflict = useCallback((localData, remoteData) => {
    const conflicts = []
    const resolved = []

    localData.forEach(local => {
      const remote = remoteData.find(r => r.id === local.id)
      if (remote) {
        const conflict = detectConflict(local, remote)
        if (conflict) {
          conflicts.push({
            id: local.id,
            conflict,
            local,
            remote,
          })
          const merged = resolveMerge(local, remote)
          resolved.push(merged)
        } else {
          resolved.push(local)
        }
      } else {
        resolved.push(local)
      }
    })

    remoteData.forEach(remote => {
      if (!resolved.find(r => r.id === remote.id)) {
        resolved.push(remote)
      }
    })

    return { resolved, conflicts }
  }, [])

  return {
    syncStatus,
    lastSyncTime,
    pendingChanges,
    hasPendingChanges:
      pendingChanges.tasks.length > 0 || pendingChanges.events.length > 0,
    queueTaskChange,
    queueEventChange,
    performSync,
    resolveConflict,
  }
}
