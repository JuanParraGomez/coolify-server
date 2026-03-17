import React from 'react'
import { useAlerts } from '../hooks/useAlerts.js'

const TYPE_ICONS = {
  reply: '💬',
  mention: '📣',
  connection: '🤝',
  view: '👁',
}

export function AlertsView() {
  const { alerts, unread, loading, markRead, markAllRead } = useAlerts()

  return (
    <div className="view">
      <div className="card-header mb-2">
        <h2 className="card-title">
          Alertas {unread > 0 && <span className="badge" style={{ position: 'static', marginLeft: 8 }}>{unread} nuevas</span>}
        </h2>
        {unread > 0 && (
          <button className="btn btn-secondary btn-sm" onClick={markAllRead}>
            Marcar todas como leídas
          </button>
        )}
      </div>

      {loading && (
        <div className="flex items-center gap-1 text-muted mb-2">
          <span className="spinner" /> Verificando notificaciones...
        </div>
      )}

      <div className="flex flex-col gap-1">
        {alerts.length === 0 && !loading && (
          <div className="empty-state">
            <div className="empty-icon">🔔</div>
            <p>Sin alertas nuevas por ahora.</p>
          </div>
        )}
        {alerts.map(alert => (
          <div
            key={alert.id}
            className={`alert-item${!alert.read ? ' unread' : ''}`}
            onClick={() => !alert.read && markRead(alert.id)}
            style={{ cursor: alert.read ? 'default' : 'pointer' }}
          >
            <span className="alert-icon">{TYPE_ICONS[alert.type] ?? '🔔'}</span>
            <div className="alert-text">
              <strong>{alert.message}</strong>
              <time>{new Date(alert.created_at).toLocaleString('es-MX', {
                weekday: 'short', hour: '2-digit', minute: '2-digit', month: 'short', day: 'numeric'
              })}</time>
            </div>
            {!alert.read && (
              <span style={{ width: 8, height: 8, borderRadius: '50%', background: 'var(--primary)', flexShrink: 0, marginTop: 4 }} />
            )}
          </div>
        ))}
      </div>

      <div className="card mt-3" style={{ background: 'rgba(99,102,241,0.06)' }}>
        <p className="text-sm text-muted">
          🔄 Las alertas se actualizan automáticamente cada 30 segundos.
          Recibirás notificaciones cuando un lead responda, vea tu perfil o acepte una conexión.
        </p>
      </div>
    </div>
  )
}
