import React from 'react'
import { useAppStore } from '../store'
import { useMarkNotificationRead } from '../hooks/useNotifications'
import type { Notification, NotificationType } from '../types'

const TYPE_ICONS: Record<NotificationType, string> = {
  lead_responded: '💬',
  new_lead: '👤',
  follow_up_due: '⏰',
  research_complete: '🔍',
}

const TYPE_LABELS: Record<NotificationType, string> = {
  lead_responded: 'Lead respondió',
  new_lead: 'Nuevo lead',
  follow_up_due: 'Follow-up pendiente',
  research_complete: 'Investigación lista',
}

// Demo notifications para cuando no hay backend
const DEMO_NOTIFICATIONS: Notification[] = [
  {
    id: '1',
    type: 'lead_responded',
    leadId: '1',
    leadName: 'Ana García',
    message: 'Ana García respondió tu mensaje en LinkedIn',
    timestamp: new Date(Date.now() - 15 * 60 * 1000).toISOString(),
    read: false,
  },
  {
    id: '2',
    type: 'new_lead',
    leadId: '3',
    leadName: 'María López',
    message: 'Nuevo lead capturado: María López de FinanceGroup',
    timestamp: new Date(Date.now() - 30 * 60 * 1000).toISOString(),
    read: false,
  },
  {
    id: '3',
    type: 'follow_up_due',
    leadId: '2',
    leadName: 'Carlos Rodríguez',
    message: 'Es momento de hacer follow-up con Carlos Rodríguez',
    timestamp: new Date(Date.now() - 2 * 60 * 60 * 1000).toISOString(),
    read: true,
  },
]

export default function NotificationsPanel() {
  const { notifications } = useAppStore()
  const markRead = useMarkNotificationRead()

  const displayNotifications: Notification[] = notifications.length > 0 ? notifications : DEMO_NOTIFICATIONS
  const unread = displayNotifications.filter((n) => !n.read).length

  return (
    <div style={{ maxWidth: 600 }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem' }}>
        <h2 style={{ margin: 0, fontSize: 20, color: '#1e293b' }}>
          Notificaciones
          {unread > 0 && (
            <span style={{
              marginLeft: 8,
              background: '#ef4444',
              color: 'white',
              borderRadius: 999,
              fontSize: 12,
              padding: '2px 8px',
              fontWeight: 700,
            }}>
              {unread} nuevas
            </span>
          )}
        </h2>
        {notifications.length === 0 && (
          <span style={{ fontSize: 12, color: '#94a3b8' }}>Demo — sin backend conectado</span>
        )}
      </div>

      <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
        {displayNotifications.map((notif) => (
          <div
            key={notif.id}
            onClick={() => !notif.read && markRead.mutate(notif.id)}
            style={{
              background: notif.read ? '#f8fafc' : 'white',
              border: '1px solid',
              borderColor: notif.read ? '#e2e8f0' : '#bfdbfe',
              borderRadius: 8,
              padding: '0.875rem 1rem',
              cursor: notif.read ? 'default' : 'pointer',
              display: 'flex',
              gap: 12,
              alignItems: 'flex-start',
              transition: 'border-color 0.15s',
            }}
          >
            <div style={{ fontSize: 20, flexShrink: 0, marginTop: 1 }}>
              {TYPE_ICONS[notif.type]}
            </div>
            <div style={{ flex: 1 }}>
              <div style={{ fontSize: 12, color: '#94a3b8', marginBottom: 3 }}>
                {TYPE_LABELS[notif.type]}
              </div>
              <div style={{ fontSize: 13, color: notif.read ? '#64748b' : '#1e293b', fontWeight: notif.read ? 400 : 500 }}>
                {notif.message}
              </div>
              <div style={{ fontSize: 11, color: '#94a3b8', marginTop: 4 }}>
                {new Date(notif.timestamp).toLocaleString('es', { dateStyle: 'short', timeStyle: 'short' })}
              </div>
            </div>
            {!notif.read && (
              <div style={{
                width: 8,
                height: 8,
                borderRadius: '50%',
                background: '#3b82f6',
                flexShrink: 0,
                marginTop: 4,
              }} />
            )}
          </div>
        ))}

        {displayNotifications.length === 0 && (
          <div style={{ textAlign: 'center', color: '#94a3b8', padding: '3rem', fontSize: 14 }}>
            Sin notificaciones pendientes
          </div>
        )}
      </div>

      <div style={{ marginTop: '1rem', fontSize: 12, color: '#94a3b8' }}>
        Polling automático cada 30 segundos · Haz clic en una notificación para marcarla como leída
      </div>
    </div>
  )
}
