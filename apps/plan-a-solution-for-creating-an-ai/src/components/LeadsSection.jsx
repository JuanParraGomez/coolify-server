import React from 'react'
import { useLeads } from '../hooks/useLeads'
import { MOCK_SOCIAL_PROFILES } from '../data/mockData'

const ESTADO_COLOR = { nuevo: '#3b82f6', contactado: '#f59e0b', calificado: '#10b981', propuesta: '#8b5cf6' }
const ESTADOS = ['todos', 'nuevo', 'contactado', 'calificado', 'propuesta']
const CANALES = ['todos', 'LinkedIn', 'Extension', 'Twitter']

function ScoreBar({ score }) {
  const color = score >= 85 ? '#10b981' : score >= 65 ? '#f59e0b' : '#ef4444'
  return (
    <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
      <div style={{ flex: 1, height: 6, background: '#e5e7eb', borderRadius: 3, overflow: 'hidden' }}>
        <div style={{ width: `${score}%`, height: '100%', background: color, borderRadius: 3 }} />
      </div>
      <span style={{ fontSize: '0.78rem', fontWeight: 600, color, minWidth: 28 }}>{score}</span>
    </div>
  )
}

function LeadDrawer({ lead, onClose }) {
  const profile = MOCK_SOCIAL_PROFILES.find(p => p.nombre === lead.nombre)
  return (
    <div style={styles.drawer}>
      <div style={styles.drawerHeader}>
        <div>
          <h3 style={{ margin: 0 }}>{lead.nombre}</h3>
          <span style={{ color: '#6b7280', fontSize: '0.85rem' }}>{lead.cargo} · {lead.empresa}</span>
        </div>
        <button onClick={onClose} style={styles.closeBtn}>✕</button>
      </div>
      <div style={styles.drawerGrid}>
        <InfoItem label="Canal" value={lead.canal} />
        <InfoItem label="Estado" value={lead.estado} />
        <InfoItem label="Presupuesto" value={lead.presupuesto} />
        <InfoItem label="Interés" value={lead.interes} />
        <InfoItem label="Fecha contacto" value={lead.fechaContacto} />
        <InfoItem label="Respondió" value={lead.respondio ? '✅ Sí' : '❌ No'} />
      </div>
      {profile && (
        <div style={styles.drawerSocial}>
          <h4 style={{ margin: '0 0 0.75rem' }}>🔍 Perfil Social (OSINT)</h4>
          <div style={styles.triggerList}>
            {profile.triggers.map((t, i) => <div key={i} style={styles.trigger}>🎯 {t}</div>)}
          </div>
          <p style={styles.buyerProfile}><strong>Perfil de compra:</strong> {profile.perfil_compra}</p>
          <p style={{ ...styles.buyerProfile, background: '#ecfdf5', color: '#065f46' }}><strong>Mejor ángulo:</strong> {profile.mejor_angulo}</p>
        </div>
      )}
      <div style={styles.aiReply}>
        <h4 style={{ margin: '0 0 0.5rem' }}>💬 Generar respuesta con IA</h4>
        <p style={{ color: '#6b7280', fontSize: '0.82rem', margin: '0 0 0.75rem' }}>
          Endpoint: <code>POST /api/v1/leads/{lead.id}/generar-respuesta</code>
        </p>
        <div style={{ display: 'flex', gap: '0.5rem', flexWrap: 'wrap' }}>
          {['OpenAI', 'Gemini', 'Claude', 'Deepseek'].map(p => (
            <button key={p} style={styles.provBtn}>{p}</button>
          ))}
        </div>
      </div>
    </div>
  )
}

function InfoItem({ label, value }) {
  return (
    <div>
      <div style={{ fontSize: '0.72rem', color: '#9ca3af', fontWeight: 500, textTransform: 'uppercase', letterSpacing: '0.05em' }}>{label}</div>
      <div style={{ fontWeight: 600, color: '#111827', fontSize: '0.9rem' }}>{value}</div>
    </div>
  )
}

export default function LeadsSection() {
  const { leadsFiltered, filtros, setFiltros, sortField, sortDir, toggleSort, stats, selectedId, setSelectedId, selectedLead } = useLeads()

  const SortIcon = ({ field }) => {
    if (sortField !== field) return <span style={{ color: '#d1d5db' }}>↕</span>
    return <span style={{ color: '#3b82f6' }}>{sortDir === 'asc' ? '↑' : '↓'}</span>
  }

  return (
    <section style={styles.section}>
      <h2 style={styles.h2}>📋 Gestión de Leads (Mock Data)</h2>
      <div style={styles.statsRow}>
        <StatCard label="Total leads" value={stats.total} color="#3b82f6" />
        <StatCard label="Nuevos" value={stats.nuevos} color="#6366f1" />
        <StatCard label="Respondieron" value={stats.respondieron} color="#10b981" />
        <StatCard label="Score promedio" value={stats.scorePromedio} color="#f59e0b" />
      </div>

      <div style={styles.filters}>
        <input
          style={styles.searchInput}
          placeholder="🔍 Buscar nombre, empresa, cargo..."
          value={filtros.q}
          onChange={e => setFiltros(f => ({ ...f, q: e.target.value }))}
        />
        <select style={styles.select} value={filtros.estado} onChange={e => setFiltros(f => ({ ...f, estado: e.target.value }))}>
          {ESTADOS.map(e => <option key={e} value={e}>{e === 'todos' ? 'Todos los estados' : e}</option>)}
        </select>
        <select style={styles.select} value={filtros.canal} onChange={e => setFiltros(f => ({ ...f, canal: e.target.value }))}>
          {CANALES.map(c => <option key={c} value={c}>{c === 'todos' ? 'Todos los canales' : c}</option>)}
        </select>
        <select style={styles.select} value={filtros.respondio} onChange={e => setFiltros(f => ({ ...f, respondio: e.target.value }))}>
          <option value="todos">Respondió: todos</option>
          <option value="si">Respondió: Sí</option>
          <option value="no">Respondió: No</option>
        </select>
      </div>

      <div style={styles.tableWrap}>
        <table style={styles.table}>
          <thead>
            <tr>
              {[
                { key: 'nombre', label: 'Nombre' },
                { key: 'empresa', label: 'Empresa' },
                { key: 'cargo', label: 'Cargo' },
                { key: 'estado', label: 'Estado' },
                { key: 'canal', label: 'Canal' },
                { key: 'score', label: 'Score' },
                { key: 'respondio', label: 'Respondió' },
              ].map(col => (
                <th key={col.key} style={styles.th} onClick={() => toggleSort(col.key)}>
                  {col.label} <SortIcon field={col.key} />
                </th>
              ))}
              <th style={styles.th}>Acciones</th>
            </tr>
          </thead>
          <tbody>
            {leadsFiltered.map(lead => (
              <tr
                key={lead.id}
                style={{ ...styles.tr, background: selectedId === lead.id ? '#eff6ff' : undefined }}
                onClick={() => setSelectedId(lead.id === selectedId ? null : lead.id)}
              >
                <td style={styles.td}><strong>{lead.nombre}</strong></td>
                <td style={styles.td}>{lead.empresa}</td>
                <td style={styles.td}><span style={styles.cargoChip}>{lead.cargo}</span></td>
                <td style={styles.td}>
                  <span style={{ ...styles.estadoBadge, background: ESTADO_COLOR[lead.estado] + '20', color: ESTADO_COLOR[lead.estado] }}>
                    {lead.estado}
                  </span>
                </td>
                <td style={styles.td}>{lead.canal}</td>
                <td style={{ ...styles.td, minWidth: 100 }}><ScoreBar score={lead.score} /></td>
                <td style={styles.td}>{lead.respondio ? '✅' : '❌'}</td>
                <td style={styles.td}>
                  <button style={styles.actionBtn} onClick={e => { e.stopPropagation(); setSelectedId(lead.id) }}>Ver →</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      <p style={{ color: '#9ca3af', fontSize: '0.78rem', margin: '0.5rem 0 0' }}>{leadsFiltered.length} leads · Endpoint: GET /api/v1/leads · Tipado con TanStack Query</p>

      {selectedLead && <LeadDrawer lead={selectedLead} onClose={() => setSelectedId(null)} />}
    </section>
  )
}

function StatCard({ label, value, color }) {
  return (
    <div style={{ ...styles.statCard, borderTop: `3px solid ${color}` }}>
      <div style={{ fontSize: '1.75rem', fontWeight: 700, color }}>{value}</div>
      <div style={{ fontSize: '0.78rem', color: '#6b7280', fontWeight: 500 }}>{label}</div>
    </div>
  )
}

const styles = {
  section: { background: '#fff', borderRadius: '12px', padding: '1.5rem', marginBottom: '1.5rem', boxShadow: '0 1px 3px rgba(0,0,0,0.08)' },
  h2: { fontSize: '1.3rem', fontWeight: 700, marginTop: 0, marginBottom: '1rem', color: '#111827' },
  statsRow: { display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(130px, 1fr))', gap: '0.75rem', marginBottom: '1rem' },
  statCard: { background: '#f9fafb', borderRadius: '8px', padding: '0.875rem', textAlign: 'center' },
  filters: { display: 'flex', gap: '0.5rem', flexWrap: 'wrap', marginBottom: '1rem' },
  searchInput: { flex: 2, minWidth: 200, padding: '0.5rem 0.75rem', border: '1px solid #d1d5db', borderRadius: '6px', fontSize: '0.85rem', outline: 'none' },
  select: { padding: '0.5rem 0.75rem', border: '1px solid #d1d5db', borderRadius: '6px', fontSize: '0.85rem', background: '#fff', cursor: 'pointer' },
  tableWrap: { overflowX: 'auto' },
  table: { width: '100%', borderCollapse: 'collapse', fontSize: '0.85rem' },
  th: { textAlign: 'left', padding: '0.625rem 0.75rem', background: '#f9fafb', color: '#374151', fontWeight: 600, fontSize: '0.8rem', cursor: 'pointer', borderBottom: '2px solid #e5e7eb', whiteSpace: 'nowrap' },
  tr: { borderBottom: '1px solid #f3f4f6', cursor: 'pointer', transition: 'background 0.1s' },
  td: { padding: '0.625rem 0.75rem', color: '#374151', verticalAlign: 'middle' },
  estadoBadge: { padding: '0.2rem 0.6rem', borderRadius: '999px', fontWeight: 600, fontSize: '0.75rem' },
  cargoChip: { background: '#f3f4f6', padding: '0.15rem 0.5rem', borderRadius: '4px', fontSize: '0.78rem' },
  actionBtn: { background: '#3b82f6', color: '#fff', border: 'none', borderRadius: '5px', padding: '0.3rem 0.6rem', fontSize: '0.78rem', cursor: 'pointer', fontWeight: 600 },
  drawer: { marginTop: '1rem', border: '1px solid #e5e7eb', borderRadius: '10px', padding: '1.25rem', background: '#f8fafc' },
  drawerHeader: { display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '1rem' },
  closeBtn: { background: 'none', border: 'none', fontSize: '1.1rem', cursor: 'pointer', color: '#6b7280' },
  drawerGrid: { display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(140px, 1fr))', gap: '0.75rem', marginBottom: '1rem' },
  drawerSocial: { background: '#fff', borderRadius: '8px', padding: '1rem', marginBottom: '1rem', border: '1px solid #e5e7eb' },
  triggerList: { display: 'flex', flexDirection: 'column', gap: '0.35rem', marginBottom: '0.75rem' },
  trigger: { background: '#fef3c7', color: '#92400e', padding: '0.3rem 0.6rem', borderRadius: '5px', fontSize: '0.82rem' },
  buyerProfile: { background: '#f0f9ff', color: '#0c4a6e', borderRadius: '6px', padding: '0.6rem 0.75rem', fontSize: '0.83rem', margin: '0.5rem 0 0', lineHeight: 1.6 },
  aiReply: { background: '#fff', borderRadius: '8px', padding: '1rem', border: '1px solid #e5e7eb' },
  provBtn: { background: '#6366f1', color: '#fff', border: 'none', borderRadius: '6px', padding: '0.4rem 0.875rem', fontSize: '0.8rem', cursor: 'pointer', fontWeight: 600 },
}
