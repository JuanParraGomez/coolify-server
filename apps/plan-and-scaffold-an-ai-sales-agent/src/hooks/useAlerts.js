import { useState, useEffect, useCallback } from 'react'
import { apiClient } from '../lib/api-client.js'

/**
 * Hook para alertas en tiempo real (leads que respondieron, menciones, etc.).
 * Realiza polling cada 30 segundos contra GET /api/alerts.
 */
export function useAlerts(pollInterval = 30000) {
  const [alerts, setAlerts] = useState([])
  const [unread, setUnread] = useState(0)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(null)

  const fetchAlerts = useCallback(async () => {
    setLoading(true)
    try {
      const data = await apiClient.getAlerts()
      const list = Array.isArray(data) ? data : data.alerts ?? []
      setAlerts(list)
      setUnread(list.filter(a => !a.read).length)
      setError(null)
    } catch (err) {
      setError(err.message)
      setAlerts(MOCK_ALERTS)
      setUnread(MOCK_ALERTS.filter(a => !a.read).length)
    } finally {
      setLoading(false)
    }
  }, [])

  useEffect(() => {
    fetchAlerts()
    const interval = setInterval(fetchAlerts, pollInterval)
    return () => clearInterval(interval)
  }, [fetchAlerts, pollInterval])

  const markRead = useCallback(async (id) => {
    try { await apiClient.markAlertRead(id) } catch {}
    setAlerts(prev => prev.map(a => a.id === id ? { ...a, read: true } : a))
    setUnread(prev => Math.max(0, prev - 1))
  }, [])

  const markAllRead = useCallback(() => {
    setAlerts(prev => prev.map(a => ({ ...a, read: true })))
    setUnread(0)
  }, [])

  return { alerts, unread, loading, error, markRead, markAllRead, refetch: fetchAlerts }
}

const MOCK_ALERTS = [
  {
    id: 'a1', type: 'reply', lead_id: '1', lead_name: 'María González',
    message: 'María González respondió tu mensaje en LinkedIn',
    read: false, created_at: '2026-03-16T12:30:00Z',
  },
  {
    id: 'a2', type: 'view', lead_id: '2', lead_name: 'Carlos Mendoza',
    message: 'Carlos Mendoza vio tu perfil',
    read: false, created_at: '2026-03-16T11:00:00Z',
  },
  {
    id: 'a3', type: 'connection', lead_id: '3', lead_name: 'Ana Ruiz',
    message: 'Ana Ruiz aceptó tu solicitud de conexión',
    read: true, created_at: '2026-03-15T16:00:00Z',
  },
]
