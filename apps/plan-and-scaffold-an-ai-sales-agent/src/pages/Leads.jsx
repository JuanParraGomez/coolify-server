import React, { useState, useMemo } from 'react'
import { Link } from 'react-router-dom'
import { mockLeads } from '../lib/mock-data.js'
import FiltersPanel from '../components/FiltersPanel.jsx'
import DataTable from '../components/DataTable.jsx'
import { LEAD_STATUS } from '../lib/constants.js'

const S = {
  container: { padding: '0' },
  h1:       { fontSize: '1.4rem', fontWeight: 700, marginBottom: '0.25rem' },
  sub:      { color: '#64748b', fontSize: '0.875rem', marginBottom: '1.25rem' },
  score:    (n) => ({ fontWeight: 700, color: n >= 80 ? '#22c55e' : n >= 50 ? '#f59e0b' : '#ef4444' }),
  pill:     (c) => ({ display: 'inline-block', background: `${c}22`, color: c, borderRadius: 6, padding: '2px 8px', fontSize: '0.75rem', fontWeight: 500 }),
  tag:      { background: '#334155', borderRadius: 4, padding: '1px 6px', fontSize: '0.7rem', color: '#94a3b8', marginRight: 3 },
}

export default function Leads() {
  const [search, setSearch] = useState('')
  const [filters, setFilters] = useState({ status: 'all' })

  const filtered = useMemo(() => {
    return mockLeads.filter(l => {
      const matchSearch = !search || `${l.name} ${l.company} ${l.email}`.toLowerCase().includes(search.toLowerCase())
      const matchStatus = filters.status === 'all' || l.status === filters.status
      return matchSearch && matchStatus
    })
  }, [search, filters])

  const columns = [
    { key: 'name', label: 'Nombre', width: '20%' },
    { key: 'company', label: 'Empresa', width: '18%' },
    { key: 'title', label: 'Cargo', width: '15%' },
    { key: 'tags', label: 'Tags', width: '15%' },
    { key: 'status', label: 'Estado', width: '12%' },
    { key: 'score', label: 'Score', width: '10%' },
    { key: 'lastActivity', label: 'Última actividad', width: '10%' },
  ]

  const renderCell = (col, value, row) => {
    switch (col.key) {
      case 'name':
        return (
          <div>
            <div style={{ fontWeight: 500 }}>{row.name}</div>
            <div style={{ fontSize: '0.75rem', color: '#64748b' }}>{row.email}</div>
          </div>
        )
      case 'company':
        return (
          <div>
            <div>{row.company}</div>
            <div style={{ fontSize: '0.75rem', color: '#94a3b8' }}>{row.title}</div>
          </div>
        )
      case 'tags':
        return (
          <div>
            {(row.tags ?? []).map(t => <span key={t} style={S.tag}>{t}</span>)}
          </div>
        )
      case 'status':
        const st = LEAD_STATUS[row.status] || { label: row.status, color: '#94a3b8' }
        return <span style={S.pill(st.color)}>{st.label}</span>
      case 'score':
        return <span style={S.score(row.score ?? 0)}>{row.score ?? '—'}</span>
      case 'lastActivity':
        return row.lastActivity ? new Date(row.lastActivity).toLocaleDateString('es-MX') : '—'
      default:
        return value
    }
  }

  const rowActions = [
    { label: 'Chat', onClick: (row) => window.location.href = `/chat?lead=${row.id}`, icon: '💬' },
    { label: 'Investigar', onClick: (row) => window.location.href = `/research?lead=${row.id}`, icon: '🔍' },
  ]

  return (
    <div style={S.container}>
      <h1 style={S.h1}>Leads</h1>
      <p style={S.sub}>Gestiona tus prospectos capturados desde la extensión y fuentes manuales.</p>

      <FiltersPanel
        searchValue={search}
        onSearchChange={setSearch}
        filters={filters}
        onFilterChange={(key, val) => setFilters(prev => ({ ...prev, [key]: val }))}
        filterConfigs={[
          {
            key: 'status',
            label: 'Estado',
            options: [
              { value: 'all', label: 'Todos los estados' },
              ...Object.entries(LEAD_STATUS).map(([k, v]) => ({ value: k, label: v.label })),
            ],
          },
        ]}
      />

      <DataTable
        data={filtered}
        columns={columns}
        renderCell={renderCell}
        rowActions={rowActions}
        sortable
        pagination
        rowsPerPage={10}
      />
    </div>
  )
}
