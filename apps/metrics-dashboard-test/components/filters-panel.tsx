'use client'

import { useState } from 'react'

export interface FilterState {
  selectedRegion: string | null
  sortBy: 'revenue' | 'users' | 'tickets'
}

interface FiltersPanelProps {
  regions: string[]
  onFilterChange: (filters: FilterState) => void
}

/**
 * FiltersPanel Component
 * Provides filtering options for the metrics dashboard:
 * - Region selector: Filter by specific region or show all
 * - Sort selector: Sort by revenue, users, or tickets
 *
 * Real functionality: Updates parent state with filter selections
 */
export default function FiltersPanel({ regions, onFilterChange }: FiltersPanelProps) {
  const [selectedRegion, setSelectedRegion] = useState<string | null>(null)
  const [sortBy, setSortBy] = useState<FilterState['sortBy']>('revenue')

  function handleRegionChange(e: React.ChangeEvent<HTMLSelectElement>) {
    const value = e.target.value || null
    setSelectedRegion(value)
    onFilterChange({ selectedRegion: value, sortBy })
  }

  function handleSortChange(e: React.ChangeEvent<HTMLSelectElement>) {
    const value = e.target.value as FilterState['sortBy']
    setSortBy(value)
    onFilterChange({ selectedRegion, sortBy: value })
  }

  return (
    <div
      style={{
        background: '#fff',
        border: '1px solid #e2e8f0',
        borderRadius: '12px',
        padding: '1.25rem 1.5rem',
        marginBottom: '1.5rem',
      }}
    >
      <h3 style={{ margin: '0 0 1rem', color: '#1e293b', fontSize: '0.95rem', fontWeight: 600 }}>
        Filtros
      </h3>
      <div style={{ display: 'flex', gap: '1rem', flexWrap: 'wrap' }}>
        {/* Region selector */}
        <div style={{ flex: '1', minWidth: '160px' }}>
          <label
            style={{
              display: 'block',
              fontSize: '0.8rem',
              fontWeight: 600,
              color: '#64748b',
              marginBottom: '0.375rem',
              textTransform: 'uppercase',
              letterSpacing: '0.04em',
            }}
          >
            Región
          </label>
          <select
            value={selectedRegion ?? ''}
            onChange={handleRegionChange}
            style={{
              width: '100%',
              padding: '0.5rem 0.75rem',
              border: '1px solid #e2e8f0',
              borderRadius: '6px',
              fontSize: '0.875rem',
              color: '#1e293b',
              background: '#fff',
              cursor: 'pointer',
            }}
          >
            <option value="">Todas las regiones</option>
            {regions.map((r) => (
              <option key={r} value={r}>
                {r}
              </option>
            ))}
          </select>
        </div>

        {/* Sort selector */}
        <div style={{ flex: '1', minWidth: '160px' }}>
          <label
            style={{
              display: 'block',
              fontSize: '0.8rem',
              fontWeight: 600,
              color: '#64748b',
              marginBottom: '0.375rem',
              textTransform: 'uppercase',
              letterSpacing: '0.04em',
            }}
          >
            Ordenar por
          </label>
          <select
            value={sortBy}
            onChange={handleSortChange}
            style={{
              width: '100%',
              padding: '0.5rem 0.75rem',
              border: '1px solid #e2e8f0',
              borderRadius: '6px',
              fontSize: '0.875rem',
              color: '#1e293b',
              background: '#fff',
              cursor: 'pointer',
            }}
          >
            <option value="revenue">Ingresos</option>
            <option value="users">Usuarios</option>
            <option value="tickets">Tickets</option>
          </select>
        </div>
      </div>
    </div>
  )
}
