import React from 'react'
import { useAlerts } from '../hooks/useAlerts.js'

const S = {
  h1:    { fontSize: '1.4rem', fontWeight: 700, marginBottom: '0.25rem' },
  sub:   { color: '#64748b', fontSize: '0.875rem', marginBottom: '1.5rem' },
  card:  { background: '#1e293b', borderRadius: 10, padding: '1rem 1.25rem', border: '1px solid #334155', marginBottom: '0.75rem', cursor: 'pointer' },
  unread:{ borderLeft: '3px solid #3b82f6' },
  read:  { borderLeft: '3px solid transparent', opacity: 0.65 },
  title: { fontSize: '0.875rem', fontWeight: 600, marginBottom: '0.35rem', display: 'flex', gap: '0.5rem', alignItems: 'center' },
  msg:   { fontSize: '0.875rem', color: '#cbd5e1', marginBottom: '0.35rem' },
  meta:  { fontSize: '0.75rem', color: '#64748b' },
  badge: (c) => ({ background: `${c}22`, color: c, borderRadius: 6, padding: '2px 8px', fontSize: '0.72rem', fontWeight: 600 }),
  suggest:{ background: '#0f172a', border: '1px solid #334155', borderRadius: 8, padding: '0.75rem 1rem', marginTop: '0.75rem', fontSize: '0.825rem', color: '#94a3b8' },
  btn:   { background: '#3b82f6', color: '#fff', border: 'none', borderRadius: 6, padding: '0.4rem 0.9rem', fontSize: '0.8rem', cursor: 'pointer', marginTop: '0.5rem' },
  btnSm: { background: '#1e293b', color: '#94a3b8', border: '1px solid #334155', borderRadius: 6, padding: '0.3rem 0.75rem', fontSize: '0.75rem', cursor: 'pointer' },
  topBar:{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.25rem' },
  statsRow:{ display: 'grid', gridTemplateColumns: 'repeat(4,1fr)', gap: '0.75rem', marginBottom: '1.5rem' },
  stat:  { background: '#1e293b', borderRadius: 8, padding: '0.75rem', border: '1px solid #334155', textAlign: 'center' },
  statN: { fontSize: '1.5rem', fontWeight: 700, color: '#3b82f6' },
  statL: { fontSize: '0.7rem', color: '#64748b', marginTop: 2 },
}

const TYPE_MAP = {
  reply:        { icon: '💬', label: 'Respuesta',     color: '#10b981' },
  view:         { icon: '👁',  label: 'Vista perfil',  color: '#3b82f6' },
  connection:   { icon: '🔗', label: 'Conexión',      color: '#8b5cf6' },
  followup:     { icon: '⏰', label: 'Seguimiento',   color: '#f59e0b' },
  score_change: { icon: '📈', label: 'Score subió',   color: '#22c55e' },
  new_lead:     { icon: '✨', label: 'Nuevo Lead',    color: '#3b82f6' },
}

function fmt(ts) {
  return ts ? new Date(ts).toLocaleString('es-MX', { dateStyle: 'short', timeStyle: 'short' }) : ''
}

export default function Alerts() {
  const { alerts, unread, loading, error, markRead, markAllRead } = useAlerts()

  const stats = {
    total: alerts.length,
    unread,
    replies: alerts.filter(a => a.type === 'reply').length,
    highPri: alerts.filter(a => a.priority === 'high' || a.type === 'reply').length,
  }

  return (
    <div>
      <h1 style={S.h1}>Alertas</h1>
      <p style={S.sub}>Notificaciones en tiempo real — leads que responden, vistas de perfil y señales de compra.</p>

      <div style={S.statsRow}>
        <div style={S.stat}><div style={S.statN}>{stats.total}</div><div style={S.statL}>Total</div></div>
        <div style={S.stat}><div style={{ ...S.statN, color: '#ef4444' }}>{stats.unread}</div><div style={S.statL}>Sin leer</div></div>
        <div style={S.stat}><div style={{ ...S.statN, color: '#10b981' }}>{stats.replies}</div><div style={S.statL}>Respuestas</div></div>
        <div style={S.stat}><div style={{ ...S.statN, color: '#f59e0b' }}>{stats.highPri}</div><div style={S.statL}>Alta prioridad</div></div>
      </div>

      <div style={S.topBar}>
        <div style={{ fontSize: '0.9rem', color: '#94a3b8' }}>
          {loading ? 'Actualizando...' : `${alerts.length} alertas · polling cada 30s`}
          {error && <span style={{ color: '#ef4444', marginLeft: '0.5rem' }}>· datos de ejemplo</span>}
        </div>
        {unread > 0 && (
          <button style={S.btnSm} onClick={markAllRead}>Marcar todas como leídas</button>
        )}
      </div>

      {alerts.length === 0 && !loading && (
        <div style={{ color: '#64748b', textAlign: 'center', padding: '2rem' }}>Sin alertas por ahora.</div>
      )}

      {alerts.map(alert => {
        const typeInfo = TYPE_MAP[alert.type] ?? { icon: '🔔', label: alert.type, color: '#94a3b8' }
        const isUnread = !alert.read
        const leadName = alert.lead_name ?? alert.lead?.name ?? ''
        const company = alert.lead?.company ?? ''
        const suggestion = alert.suggestedReply

        return (
          <div
            key={alert.id}
            style={{ ...S.card, ...(isUnread ? S.unread : S.read) }}
            onClick={() => isUnread && markRead(alert.id)}
          >
            <div style={S.title}>
              <span>{typeInfo.icon}</span>
              <span style={S.badge(typeInfo.color)}>{typeInfo.label}</span>
              {leadName && <span style={{ color: '#e2e8f0', fontWeight: 700 }}>{leadName}</span>}
              {company && <span style={{ color: '#64748b', fontWeight: 400 }}>{company}</span>}
              {isUnread && <span style={{ marginLeft: 'auto', ...S.badge('#3b82f6') }}>nuevo</span>}
            </div>

            <div style={S.msg}>{alert.message}</div>

            <div style={S.meta}>
              {fmt(alert.timestamp ?? alert.created_at)}
              {alert.priority === 'high' && <span style={{ marginLeft: '0.5rem', color: '#ef4444' }}>⚡ alta prioridad</span>}
            </div>

            {suggestion && (
              <div style={S.suggest}>
                <div style={{ fontSize: '0.72rem', color: '#3b82f6', marginBottom: '0.4rem', fontWeight: 600 }}>
                  ✍️ Respuesta sugerida por IA
                </div>
                <div>{suggestion}</div>
                <button style={S.btn}>Usar esta respuesta</button>
              </div>
            )}
          </div>
        )
      })}
    </div>
  )
}
