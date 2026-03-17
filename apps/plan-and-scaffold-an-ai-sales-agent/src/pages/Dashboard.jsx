import React from 'react'
import { Link } from 'react-router-dom'
import { useAlerts } from '../hooks/useAlerts.js'
import { mockLeads } from '../lib/mock-data.js'
import { LEAD_STATUS } from '../lib/constants.js'

// Compute metrics from mock data
const leadMetrics = {
  total: mockLeads.length,
  newThisWeek: mockLeads.filter(l => new Date(l.createdAt) > new Date(Date.now() - 7*24*60*60*1000)).length,
  replied: mockLeads.filter(l => l.status === 'replied').length,
  qualified: mockLeads.filter(l => l.status === 'qualified').length,
  conversionRate: Math.round((mockLeads.filter(l => l.status === 'qualified').length / mockLeads.length) * 100),
  avgResponseTime: '2.5h',
  topSource: 'extension',
}

const S = {
  h1:    { fontSize: '1.4rem', fontWeight: 700, marginBottom: '0.25rem' },
  sub:   { color: '#64748b', fontSize: '0.875rem', marginBottom: '1.5rem' },
  grid:  { display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(180px, 1fr))', gap: '1rem', marginBottom: '1.5rem' },
  card:  { background: '#1e293b', borderRadius: 10, padding: '1rem 1.25rem', border: '1px solid #334155' },
  stat:  { fontSize: '2rem', fontWeight: 700, lineHeight: 1 },
  label: { fontSize: '0.75rem', color: '#94a3b8', marginTop: 4 },
  section: { marginBottom: '1.5rem' },
  sectionTitle: { fontSize: '1rem', fontWeight: 600, marginBottom: '0.75rem', color: '#cbd5e1' },
  table: { width: '100%', borderCollapse: 'collapse' },
  th:    { textAlign: 'left', padding: '0.5rem 0.75rem', fontSize: '0.75rem', color: '#64748b', borderBottom: '1px solid #334155', textTransform: 'uppercase', letterSpacing: '0.05em' },
  td:    { padding: '0.65rem 0.75rem', fontSize: '0.875rem', borderBottom: '1px solid #1e293b', verticalAlign: 'middle' },
  pill:  (c) => ({ display: 'inline-block', background: `${c}22`, color: c, borderRadius: 6, padding: '2px 8px', fontSize: '0.75rem', fontWeight: 500 }),
  link:  { color: '#3b82f6', textDecoration: 'none', fontSize: '0.875rem' },
}

function MetricCard({ value, label, color = '#3b82f6' }) {
  return (
    <div style={S.card}>
      <div style={{ ...S.stat, color }}>{value}</div>
      <div style={S.label}>{label}</div>
    </div>
  )
}

export default function Dashboard() {
  const { leads } = useLeads()
  const { alerts, unread } = useAlerts()

  const recent = mockLeads.slice(0, 4)

  return (
    <div>
      <h1 style={S.h1}>Dashboard</h1>
      <p style={S.sub}>Resumen del pipeline de ventas · AI Sales Agent</p>

      {/* Métricas clave */}
      <div style={S.grid}>
        <MetricCard value={leadMetrics.total}          label="Leads totales"           color="#3b82f6" />
        <MetricCard value={leadMetrics.newThisWeek}    label="Nuevos esta semana"       color="#22c55e" />
        <MetricCard value={leadMetrics.replied}        label="Respondieron"             color="#f59e0b" />
        <MetricCard value={leadMetrics.qualified}      label="Calificados"              color="#8b5cf6" />
        <MetricCard value={`${leadMetrics.conversionRate}%`} label="Tasa de conversión" color="#10b981" />
        <MetricCard value={unread}                     label="Alertas sin leer"         color="#ef4444" />
      </div>

      {/* Leads recientes */}
      <div style={S.section}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.75rem' }}>
          <span style={S.sectionTitle}>Leads recientes</span>
          <Link to="/leads" style={S.link}>Ver todos →</Link>
        </div>
        <div style={{ background: '#1e293b', borderRadius: 10, border: '1px solid #334155', overflow: 'hidden' }}>
          <table style={S.table}>
            <thead>
              <tr>
                <th style={S.th}>Nombre</th>
                <th style={S.th}>Empresa</th>
                <th style={S.th}>Cargo</th>
                <th style={S.th}>Estado</th>
                <th style={S.th}>Score</th>
              </tr>
            </thead>
            <tbody>
              {recent.map(lead => {
                const st = LEAD_STATUS[lead.status]
                return (
                  <tr key={lead.id}>
                    <td style={S.td}>{lead.name}</td>
                    <td style={{ ...S.td, color: '#94a3b8' }}>{lead.company}</td>
                    <td style={{ ...S.td, color: '#94a3b8' }}>{lead.title}</td>
                    <td style={S.td}><span style={S.pill(st?.color ?? '#64748b')}>{st?.label ?? lead.status}</span></td>
                    <td style={{ ...S.td, color: '#22c55e', fontWeight: 600 }}>{lead.score}</td>
                  </tr>
                )
              })}
            </tbody>
          </table>
        </div>
      </div>

      {/* Alertas recientes */}
      <div style={S.section}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.75rem' }}>
          <span style={S.sectionTitle}>Alertas recientes</span>
          <Link to="/alerts" style={S.link}>Ver todas →</Link>
        </div>
        <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
          {alerts.slice(0, 3).map(a => (
            <div key={a.id} style={{ ...S.card, borderLeft: `3px solid ${a.read ? '#334155' : '#3b82f6'}`, padding: '0.75rem 1rem' }}>
              <div style={{ fontSize: '0.875rem' }}>{a.message}</div>
              <div style={{ fontSize: '0.75rem', color: '#64748b', marginTop: 4 }}>{new Date(a.timestamp ?? a.created_at).toLocaleString('es-MX')}</div>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
