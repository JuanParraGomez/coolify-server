import { useAppStore } from '../store/appStore'
import { useCallback, useMemo } from 'react'
import { getNotificationSummary } from '../lib/mock-data'

/**
 * Hook for managing notifications and alerts
 * Provides comprehensive notification management with filtering, grouping, and statistics
 * Supports real-time notification updates and priority handling
 */
export function useNotifications() {
  const notifications = useAppStore((state) => state.notifications)
  const unreadCount = useAppStore((state) => state.unreadCount)
  const setNotifications = useAppStore((state) => state.setNotifications)
  const addNotification = useAppStore((state) => state.addNotification)
  const markNotificationRead = useAppStore((state) => state.markNotificationRead)
  const clearNotifications = useAppStore((state) => state.clearNotifications)

  const summary = useMemo(() => {
    return getNotificationSummary(notifications)
  }, [notifications])

  const unreadNotifications = useMemo(() => {
    return notifications.filter((n) => !n.read)
  }, [notifications])

  const urgentNotifications = useMemo(() => {
    return unreadNotifications.filter((n) => n.type === 'response' || n.type === 'milestone')
  }, [unreadNotifications])

  const notificationsByType = useMemo(() => {
    const grouped = {}
    notifications.forEach((n) => {
      if (!grouped[n.type]) grouped[n.type] = []
      grouped[n.type].push(n)
    })
    return grouped
  }, [notifications])

  const markAllRead = useCallback(() => {
    const unreadNotifs = notifications.filter((n) => !n.read)
    unreadNotifs.forEach((n) => markNotificationRead(n.id))
  }, [notifications, markNotificationRead])

  const removeNotification = useCallback((id) => {
    const updated = notifications.filter((n) => n.id !== id)
    setNotifications(updated)
  }, [notifications, setNotifications])

  const getUnreadByType = useCallback((type) => {
    return notifications.filter((n) => n.type === type && !n.read).length
  }, [notifications])

  const getNotificationsByLead = useCallback((leadId) => {
    return notifications.filter((n) => n.leadId === leadId)
  }, [notifications])

  const getNotificationsByType = useCallback((type) => {
    return notifications.filter((n) => n.type === type)
  }, [notifications])

  const addNewNotification = useCallback(
    (type, leadId, leadName, message, content = '') => {
      const newNotification = {
        id: Math.max(...notifications.map((n) => n.id || 0), 0) + 1,
        type,
        leadId,
        leadName,
        message,
        content: content || message,
        timestamp: new Date().toISOString(),
        read: false,
        action: type === 'response' ? 'reply' : 'view',
      }
      addNotification(newNotification)
    },
    [notifications, addNotification]
  )

  return {
    // Core data
    notifications,
    unreadNotifications,
    urgentNotifications,
    unreadCount,
    summary,

    // Grouped data
    notificationsByType,

    // Actions
    addNotification,
    markNotificationRead,
    markAllRead,
    removeNotification,
    clearNotifications,
    addNewNotification,

    // Queries
    getUnreadByType,
    getNotificationsByLead,
    getNotificationsByType,

    // Stats & Flags
    hasUnreadNotifications: unreadCount > 0,
    hasUrgentNotifications: urgentNotifications.length > 0,
    urgentCount: urgentNotifications.length,
    totalNotifications: notifications.length,
  }
}
