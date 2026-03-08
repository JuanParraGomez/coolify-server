'use client'

import type { CSSProperties, ReactNode } from 'react'
import {
  DEFAULT_SALES_FILTERS,
  QUARTERS,
  type DashboardState,
  type DashboardView,
  type RegionName,
  type SalesFilters,
} from '../lib/mock-data'

interface FiltersPanelProps {
  state: DashboardState
  years: number[]
  regions: RegionName[]
  onFiltersChange: (next: SalesFilters) => void
  onViewChange: (view: DashboardView) => void
  onRegionFocusChange?: (region: RegionName | null) => void
}

export default function FiltersPanel({
  state,
  years,
  regions,
  onFiltersChange,
  onViewChange,
  onRegionFocusChange,
}: FiltersPanelProps) {
  const { filters, selectedRegion, view } = state

  const updateFilters = <K extends keyof SalesFilters>(key: K, value: SalesFilters[K]) => {
    onFiltersChange({
      ...filters,
      [key]: value,
    })
  }

  const toggleRegion = (region: RegionName) => {
    const exists = filters.regions.includes(region)
    const nextRegions = exists
      ? filters.regions.filter((value) => value !== region)
      : [...filters.regions, region]
    updateFilters('regions', nextRegions)
  }

  const resetFilters = () => {
    onFiltersChange({ ...DEFAULT_SALES_FILTERS })
    onRegionFocusChange?.(null)
  }

  return (
    <section
      style={{
        display: 'grid',
        gap: '1rem',
        padding: '1rem',
        borderRadius: 12,
        border: '1px solid rgba(148, 163, 184, 0.35)',
        background: 'rgba(15, 23, 42, 0.65)',
      }}
    >
      <div style={{ display: 'flex', gap: '0.5rem', flexWrap: 'wrap' }}>
        <ViewButton active={view === 'summary'} onClick={() => onViewChange('summary')}>
          Resumen
        </ViewButton>
        <ViewButton active={view === 'detail'} onClick={() => onViewChange('detail')}>
          Detalle
        </ViewButton>
      </div>

      <div
        style={{
          display: 'grid',
          gap: '0.75rem',
          gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))',
        }}
      >
        <label style={labelStyle}>
          Año
          <select
            style={controlStyle}
            value={filters.year}
            onChange={(event) =>
              updateFilters(
                'year',
                event.target.value === 'all' ? 'all' : Number(event.target.value)
              )
            }
          >
            <option value="all">Todos</option>
            {years.map((year) => (
              <option key={year} value={year}>
                {year}
              </option>
            ))}
          </select>
        </label>

        <label style={labelStyle}>
          Trimestre
          <select
            style={controlStyle}
            value={filters.quarter}
            onChange={(event) => {
              const quarter = QUARTERS.find((value) => value === event.target.value)
              updateFilters('quarter', quarter ?? 'all')
            }}
          >
            <option value="all">Todos</option>
            {QUARTERS.map((quarter) => (
              <option key={quarter} value={quarter}>
                {quarter}
              </option>
            ))}
          </select>
        </label>

        {view === 'detail' && (
          <label style={labelStyle}>
            Región en foco
            <select
              style={controlStyle}
              value={selectedRegion ?? ''}
              onChange={(event) => {
                const region = regions.find((value) => value === event.target.value) ?? null
                onRegionFocusChange?.(region)
              }}
            >
              <option value="">Seleccionar región</option>
              {regions.map((region) => (
                <option key={region} value={region}>
                  {region}
                </option>
              ))}
            </select>
          </label>
        )}

        <label style={labelStyle}>
          Buscar región
          <input
            style={controlStyle}
            type="search"
            placeholder="Ej. Norte"
            value={filters.search}
            onChange={(event) => updateFilters('search', event.target.value)}
          />
        </label>
      </div>

      <div style={{ display: 'flex', gap: '0.5rem', flexWrap: 'wrap' }}>
        {regions.map((region) => {
          const isActive = filters.regions.includes(region)
          return (
            <button
              key={region}
              type="button"
              onClick={() => toggleRegion(region)}
              style={{
                padding: '0.45rem 0.7rem',
                borderRadius: 999,
                border: '1px solid rgba(148, 163, 184, 0.45)',
                background: isActive ? 'rgba(14, 165, 233, 0.25)' : 'transparent',
                color: '#e2e8f0',
                cursor: 'pointer',
                fontWeight: 600,
              }}
            >
              {region}
            </button>
          )
        })}
      </div>

      <div style={{ display: 'flex', justifyContent: 'space-between', gap: '0.75rem' }}>
        <small style={{ color: '#cbd5e1' }}>
          {filters.regions.length === 0
            ? 'Mostrando todas las regiones'
            : `${filters.regions.length} región(es) seleccionada(s)`}
        </small>
        <button
          type="button"
          onClick={resetFilters}
          style={{
            border: '1px solid rgba(248, 250, 252, 0.35)',
            borderRadius: 8,
            background: 'transparent',
            color: '#f8fafc',
            padding: '0.4rem 0.75rem',
            cursor: 'pointer',
          }}
        >
          Limpiar filtros
        </button>
      </div>
    </section>
  )
}

function ViewButton({
  active,
  children,
  onClick,
}: {
  active: boolean
  children: ReactNode
  onClick: () => void
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      style={{
        border: '1px solid rgba(56, 189, 248, 0.55)',
        borderRadius: 999,
        background: active ? 'rgba(56, 189, 248, 0.2)' : 'transparent',
        color: '#e2e8f0',
        padding: '0.5rem 0.9rem',
        cursor: 'pointer',
        fontWeight: 700,
      }}
    >
      {children}
    </button>
  )
}

const labelStyle: CSSProperties = {
  display: 'grid',
  gap: '0.4rem',
  color: '#cbd5e1',
  fontSize: 14,
}

const controlStyle: CSSProperties = {
  width: '100%',
  borderRadius: 8,
  border: '1px solid rgba(148, 163, 184, 0.45)',
  background: 'rgba(15, 23, 42, 0.9)',
  color: '#f8fafc',
  padding: '0.5rem 0.6rem',
}
