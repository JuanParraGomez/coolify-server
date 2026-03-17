import React, { useState } from 'react'
import { useLeads } from '../hooks/useLeads.js'
import { LEAD_STATUS } from '../lib/constants.js'

export function LeadsView({ onSelectLead }) {
  const [statusFilter, setStatusFilter] = useState('')
  const { leads, loading, error, updateLeadStatus } = useLeads(statusFilter ? { status: statusFilter } : {})

  return (
    <div className="view">
      <div className="card-header mb-2">
        <h2 className="card-title">Lista de Leads</h2>
        <div className="flex gap-1 items-center">
          <select
            className="select"
            style={{ width: 'auto' }}
            value={statusFilter}
            onChange={e => setStatusFilter(e.target.value)}
          >
            <option value="">Todos los estados</option>
            {Object.entries(LEAD_STATUS).map(([k, v]) => (
              <option key={k} value={k}>{v.label}</option>
            ))}
          </select>
          <button className="btn btn-primary btn-sm">+ Nuevo Lead</button>
        </div>
      </div>

      {loading && (
        <div className="flex items-center gap-1 text-muted mb-2">
          <span className="spinner" /> Cargando leads...
        </div>
      )}
      {error && (
        <div className="text-warning text-sm mb-2">
          ⚠ Backend no disponible — mostrando datos de ejemplo.
        </div>
      )}

      <div className="card">
        <table className="leads-table">
          <thead>
            <tr>
              <th>Nombre</th>
              <th>Empresa</th>
              <th>Cargo</th>
              <th>Email</th>
              <th>Estado</th>
              <th>Acciones</th>
            </tr>
          </thead>
          <tbody>
            {leads.map(lead => {
              const st = LEAD_STATUS[lead.status] ?? { label: lead.status, color: '#6b7280' }
              return (
                <tr key={lead.id} onClick={() => onSelectLead?.(lead)}>
                  <td><strong>{lead.name}</strong></td>
                  <td>{lead.company}</td>
                  <td className="text-muted">{lead.title}</td>
                  <td className="text-muted">{lead.email}</td>
                  <td>
                    <span
                      className="badge-status"
                      style={{ background: `${st.color}22`, color: st.color }}
                    >
                      {st.label}
                    </span>
                  </td>
                  <td onClick={e => e.stopPropagation()}>
                    <div className="flex gap-1">
                      <button
                        className="btn btn-ghost btn-sm"
                        onClick={() => onSelectLead?.(lead)}
                      >Chat</button>
                      <button
                        className="btn btn-ghost btn-sm"
                        onClick={() => updateLeadStatus(lead.id, 'qualified')}
                      >Calificar</button>
                    </div>
                  </td>
                </tr>
              )
            })}
            {!loading && leads.length === 0 && (
              <tr><td colSpan={6}>
                <div className="empty-state">
                  <div className="empty-icon">👥</div>
                  <p>No hay leads aún. Usa la extensión de chat para capturar leads.</p>
                </div>
              </td></tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  )
}
