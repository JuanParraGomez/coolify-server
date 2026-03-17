import React, { useState } from 'react'
import { useLeads } from '../hooks/useLeads'
import { useAppStore } from '../store'
import type { Lead, LeadStatus, LeadChannel } from '../types'

const STATUS_LABELS: Record<LeadStatus, string> = {
  nuevo: 'Nuevo',
  contactado: 'Contactado',
  respondio: 'Respondió',
  en_proceso: 'En proceso',
  cerrado: 'Cerrado',
}

const STATUS_COLORS: Record<LeadStatus, string> = {
  nuevo: '#3b82f6',
  contactado: '#f59e0b',
  respondio: '#22c55e',
  en_proceso: '#8b5cf6',
  cerrado: '#64748b',
}

const CHANNEL_ICONS: Record<LeadChannel, string> = {
  linkedin: '💼',
  email: '📧',
  twitter: '🐦',
  whatsapp: '💚',
  web: '🌐',
}

// Leads de ejemplo para cuando no hay backend conectado
const DEMO_LEADS: Lead[] = [
  {
    id: '1',
    name: 'Ana García',
    email: 'ana@techcorp.com',
    company: 'TechCorp',
    role: 'CTO',
    channel: 'linkedin',
    status: 'respondio',
    lastActivity: new Date(Date.now() - 2 * 60 * 60 * 1000).toISOString(),
    messages: [],
  },
  {
    id: '2',
    name: 'Carlos Rodríguez',
    email: 'carlos@startup.io',
    company: 'Startup.io',
    role: 'CEO',
    channel: 'email',
    status: 'contactado',
    lastActivity: new Date(Date.now() - 24 * 60 * 60 * 1000).toISOString(),
    messages: [],
  },
  {
    id: '3',
    name: 'María López',
    company: 'FinanceGroup',
    role: 'VP Ventas',
    channel: 'linkedin',
    status: 'nuevo',
    lastActivity: new Date(Date.now() - 30 * 60 * 1000).toISOString(),
    messages: [],
  },
]

export default function LeadsList() {
  const { data: leads, isLoading, error } = useLeads()
  const { selectLead, setActiveSection } = useAppStore()
  const [filterStatus, setFilterStatus] = useState<LeadStatus | 'todos'>('todos')

  const displayLeads: Lead[] = leads ?? DEMO_LEADS
  const filtered = filterStatus === 'todos'
    ? displayLeads
    : displayLeads.filter((l) => l.status === filterStatus)

  function handleOpenChat(lead: Lead) {
    selectLead(lead.id)
    setActiveSection('chat')
  }

  function handleResearch(lead: Lead) {
    selectLead(lead.id)
    setActiveSection('research')
  }

  return (
    <div>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem' }}>
        <h2 style={{ margin: 0, fontSize: 20, color: '#1e293b' }}>
          Leads {!leads && <span style={{ fontSize: 13, color: '#94a3b8' }}>(demo)</span>}
        </h2>
        {isLoading && <span style={{ color: '#64748b', fontSize: 13 }}>Cargando...</span>}
        {error && <span style={{ color: '#ef4444', fontSize: 13 }}>Sin conexión — mostrando demo</span>}
      </div>

      {/* Filtros */}
      <div style={{ display: 'flex', gap: 8, marginBottom: '1rem', flexWrap: 'wrap' }}>
        {(['todos', ...Object.keys(STATUS_LABELS)] as const).map((s) => (
          <button
            key={s}
            onClick={() => setFilterStatus(s as LeadStatus | 'todos')}
            style={{
              padding: '4px 12px',
              borderRadius: 999,
              border: '1px solid',
              borderColor: filterStatus === s ? '#3b82f6' : '#e2e8f0',
              background: filterStatus === s ? '#eff6ff' : 'white',
              color: filterStatus === s ? '#1d4ed8' : '#64748b',
              cursor: 'pointer',
              fontSize: 12,
            }}
          >
            {s === 'todos' ? 'Todos' : STATUS_LABELS[s as LeadStatus]}
          </button>
        ))}
      </div>

      {/* Tabla */}
      <div style={{ background: 'white', borderRadius: 8, border: '1px solid #e2e8f0', overflow: 'hidden' }}>
        <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: 13 }}>
          <thead>
            <tr style={{ background: '#f8fafc', borderBottom: '1px solid #e2e8f0' }}>
              {['Nombre', 'Empresa', 'Canal', 'Estado', 'Última actividad', 'Acciones'].map((h) => (
                <th key={h} style={{ padding: '10px 14px', textAlign: 'left', color: '#64748b', fontWeight: 600, fontSize: 12 }}>
                  {h}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {filtered.map((lead, i) => (
              <tr
                key={lead.id}
                style={{ borderBottom: i < filtered.length - 1 ? '1px solid #f1f5f9' : 'none' }}
              >
                <td style={{ padding: '10px 14px' }}>
                  <div style={{ fontWeight: 500, color: '#1e293b' }}>{lead.name}</div>
                  {lead.role && <div style={{ fontSize: 11, color: '#94a3b8' }}>{lead.role}</div>}
                </td>
                <td style={{ padding: '10px 14px', color: '#475569' }}>{lead.company}</td>
                <td style={{ padding: '10px 14px' }}>
                  <span title={lead.channel}>{CHANNEL_ICONS[lead.channel]} {lead.channel}</span>
                </td>
                <td style={{ padding: '10px 14px' }}>
                  <span style={{
                    background: STATUS_COLORS[lead.status] + '22',
                    color: STATUS_COLORS[lead.status],
                    padding: '2px 8px',
                    borderRadius: 999,
                    fontSize: 12,
                    fontWeight: 500,
                  }}>
                    {STATUS_LABELS[lead.status]}
                  </span>
                </td>
                <td style={{ padding: '10px 14px', color: '#94a3b8', fontSize: 12 }}>
                  {new Date(lead.lastActivity).toLocaleString('es', { dateStyle: 'short', timeStyle: 'short' })}
                </td>
                <td style={{ padding: '10px 14px' }}>
                  <div style={{ display: 'flex', gap: 6 }}>
                    <button
                      onClick={() => handleOpenChat(lead)}
                      style={{ padding: '4px 10px', borderRadius: 5, border: '1px solid #e2e8f0', background: 'white', cursor: 'pointer', fontSize: 12, color: '#475569' }}
                    >
                      💬 Chat
                    </button>
                    <button
                      onClick={() => handleResearch(lead)}
                      style={{ padding: '4px 10px', borderRadius: 5, border: '1px solid #e2e8f0', background: 'white', cursor: 'pointer', fontSize: 12, color: '#475569' }}
                    >
                      🔍 Investigar
                    </button>
                  </div>
                </td>
              </tr>
            ))}
            {filtered.length === 0 && (
              <tr>
                <td colSpan={6} style={{ padding: '2rem', textAlign: 'center', color: '#94a3b8' }}>
                  No hay leads con este filtro
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  )
}
