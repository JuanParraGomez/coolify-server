'use client'

import { useCallback, useMemo, useState, type ReactNode } from 'react'

import {
  dashboardSections,
  defaultSalesFilters,
  type Quarter,
  type SalesChannel,
  type SalesFilterOptions,
  type SalesFilters,
  type SalesSegment,
} from '../lib/mock-data'

type FiltersPanelProps = {
  filters: SalesFilters
  options: SalesFilterOptions
  onFiltersChange: (nextFilters: SalesFilters) => void
}

export function useSalesFilters(initialFilters?: Partial<SalesFilters>) {
  const initialState = useMemo(
    () => ({
      ...defaultSalesFilters,
      ...initialFilters,
    }),
    [initialFilters],
  )
  const [filters, setFilters] = useState<SalesFilters>(initialState)

  const resetFilters = useCallback(() => {
    setFilters({
      ...defaultSalesFilters,
      ...initialFilters,
    })
  }, [initialFilters])

  return { filters, setFilters, resetFilters }
}

const toggleStringValue = (values: string[], value: string): string[] =>
  values.includes(value) ? values.filter((item) => item !== value) : [...values, value]

const toggleNumberValue = (values: number[], value: number): number[] =>
  values.includes(value) ? values.filter((item) => item !== value) : [...values, value]

const toNumber = (value: string): number => {
  const parsed = Number(value)
  return Number.isFinite(parsed) ? parsed : 0
}

export function FiltersPanel({ filters, options, onFiltersChange }: FiltersPanelProps) {
  const activeCount = useMemo(() => {
    let count = 0
    if (filters.regions.length > 0) count += 1
    if (filters.countries.length > 0) count += 1
    if (filters.channels.length > 0) count += 1
    if (filters.segments.length > 0) count += 1
    if (filters.years.length > 0) count += 1
    if (filters.quarters.length > 0) count += 1
    if (filters.search.trim().length > 0) count += 1
    if (filters.minRevenue > 0) count += 1
    if (filters.maxRevenue !== null) count += 1
    if (filters.onlyProfitable) count += 1
    return count
  }, [filters])

  const updateFilters = (nextValues: Partial<SalesFilters>) => {
    onFiltersChange({
      ...filters,
      ...nextValues,
    })
  }

  const toggleRegion = (region: string) =>
    updateFilters({ regions: toggleStringValue(filters.regions, region) })
  const toggleCountry = (country: string) =>
    updateFilters({ countries: toggleStringValue(filters.countries, country) })
  const toggleChannel = (channel: SalesChannel) =>
    updateFilters({ channels: toggleStringValue(filters.channels, channel) as SalesChannel[] })
  const toggleSegment = (segment: SalesSegment) =>
    updateFilters({ segments: toggleStringValue(filters.segments, segment) as SalesSegment[] })
  const toggleYear = (year: number) => updateFilters({ years: toggleNumberValue(filters.years, year) })
  const toggleQuarter = (quarter: Quarter) =>
    updateFilters({ quarters: toggleStringValue(filters.quarters, quarter) as Quarter[] })

  return (
    <section className="filters-panel" id="filtros-avanzados" aria-label="Filtros avanzados">
      <div className="filters-panel__head">
        <div>
          <p className="eyebrow">Control de análisis</p>
          <h2>Filtros avanzados</h2>
        </div>
        <button type="button" onClick={() => onFiltersChange({ ...defaultSalesFilters })}>
          Limpiar filtros
        </button>
      </div>

      <div className="section-nav">
        {dashboardSections.map((section) => (
          <a key={section.id} href={`#${section.id}`}>
            {section.label}
          </a>
        ))}
      </div>

      <div className="filters-grid">
        <label>
          Buscar por región, país, ciudad, canal o segmento
          <input
            type="search"
            value={filters.search}
            placeholder="Ej. Monterrey, Retail, SMB"
            onChange={(event) => updateFilters({ search: event.target.value })}
          />
        </label>

        <label>
          Ingreso mínimo por operación (USD)
          <input
            type="number"
            min={0}
            step={1_000}
            value={filters.minRevenue}
            onChange={(event) => updateFilters({ minRevenue: Math.max(0, toNumber(event.target.value)) })}
          />
        </label>

        <label>
          Ingreso máximo por operación (USD)
          <input
            type="number"
            min={0}
            step={1_000}
            value={filters.maxRevenue ?? ''}
            onChange={(event) =>
              updateFilters({
                maxRevenue: event.target.value === '' ? null : Math.max(0, toNumber(event.target.value)),
              })
            }
          />
        </label>

        <label className="checkbox">
          <input
            type="checkbox"
            checked={filters.onlyProfitable}
            onChange={(event) => updateFilters({ onlyProfitable: event.target.checked })}
          />
          Mostrar solo operaciones rentables
        </label>
      </div>

      <FilterGroup title="Regiones">
        {options.regions.map((region) => (
          <button
            key={region}
            type="button"
            onClick={() => toggleRegion(region)}
            className={filters.regions.includes(region) ? 'active' : undefined}
          >
            {region}
          </button>
        ))}
      </FilterGroup>

      <FilterGroup title="Países">
        {options.countries.map((country) => (
          <button
            key={country}
            type="button"
            onClick={() => toggleCountry(country)}
            className={filters.countries.includes(country) ? 'active' : undefined}
          >
            {country}
          </button>
        ))}
      </FilterGroup>

      <FilterGroup title="Canales">
        {options.channels.map((channel) => (
          <button
            key={channel}
            type="button"
            onClick={() => toggleChannel(channel)}
            className={filters.channels.includes(channel) ? 'active' : undefined}
          >
            {channel}
          </button>
        ))}
      </FilterGroup>

      <FilterGroup title="Segmentos">
        {options.segments.map((segment) => (
          <button
            key={segment}
            type="button"
            onClick={() => toggleSegment(segment)}
            className={filters.segments.includes(segment) ? 'active' : undefined}
          >
            {segment}
          </button>
        ))}
      </FilterGroup>

      <FilterGroup title="Años">
        {options.years.map((year) => (
          <button
            key={year}
            type="button"
            onClick={() => toggleYear(year)}
            className={filters.years.includes(year) ? 'active' : undefined}
          >
            {year}
          </button>
        ))}
      </FilterGroup>

      <FilterGroup title="Trimestres">
        {options.quarters.map((quarter) => (
          <button
            key={quarter}
            type="button"
            onClick={() => toggleQuarter(quarter)}
            className={filters.quarters.includes(quarter) ? 'active' : undefined}
          >
            {quarter}
          </button>
        ))}
      </FilterGroup>

      <p className="active-count">
        {activeCount > 0 ? `${activeCount} filtros activos` : 'Sin filtros activos'}
      </p>

      <style jsx>{`
        .filters-panel {
          border: 1px solid rgba(148, 163, 184, 0.35);
          background: rgba(15, 23, 42, 0.75);
          border-radius: 1rem;
          padding: 1rem;
          display: flex;
          flex-direction: column;
          gap: 1rem;
        }

        .filters-panel__head {
          display: flex;
          justify-content: space-between;
          gap: 1rem;
          align-items: flex-start;
        }

        .filters-panel__head h2 {
          margin: 0.25rem 0 0 0;
        }

        .eyebrow {
          margin: 0;
          text-transform: uppercase;
          letter-spacing: 0.18em;
          font-size: 0.7rem;
          color: rgba(148, 163, 184, 0.9);
        }

        .filters-panel__head button {
          border: 1px solid rgba(148, 163, 184, 0.6);
          background: transparent;
          color: inherit;
          border-radius: 999px;
          padding: 0.5rem 0.95rem;
          cursor: pointer;
        }

        .section-nav {
          display: flex;
          flex-wrap: wrap;
          gap: 0.5rem;
        }

        .section-nav a {
          color: #bfdbfe;
          text-decoration: none;
          border: 1px solid rgba(147, 197, 253, 0.4);
          border-radius: 999px;
          padding: 0.3rem 0.7rem;
          font-size: 0.82rem;
        }

        .filters-grid {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(220px, 1fr));
          gap: 0.75rem;
        }

        label {
          display: flex;
          flex-direction: column;
          gap: 0.4rem;
          font-size: 0.82rem;
          color: #dbeafe;
        }

        input[type='search'],
        input[type='number'] {
          background: rgba(15, 23, 42, 0.95);
          border: 1px solid rgba(148, 163, 184, 0.45);
          border-radius: 0.5rem;
          color: inherit;
          padding: 0.5rem 0.65rem;
        }

        .checkbox {
          flex-direction: row;
          align-items: center;
          gap: 0.55rem;
        }

        .checkbox input {
          width: 1rem;
          height: 1rem;
        }

        .active-count {
          margin: 0;
          color: #93c5fd;
          font-size: 0.85rem;
        }
      `}</style>
    </section>
  )
}

function FilterGroup({
  title,
  children,
}: {
  title: string
  children: ReactNode
}) {
  return (
    <div className="filter-group">
      <h3>{title}</h3>
      <div className="chips">{children}</div>
      <style jsx>{`
        .filter-group {
          display: flex;
          flex-direction: column;
          gap: 0.5rem;
        }

        h3 {
          margin: 0;
          font-size: 0.87rem;
          text-transform: uppercase;
          letter-spacing: 0.14em;
          color: rgba(148, 163, 184, 0.9);
        }

        .chips {
          display: flex;
          flex-wrap: wrap;
          gap: 0.45rem;
        }

        .chips :global(button) {
          border: 1px solid rgba(148, 163, 184, 0.45);
          background: rgba(15, 23, 42, 0.8);
          color: inherit;
          border-radius: 999px;
          padding: 0.35rem 0.75rem;
          font-size: 0.8rem;
          cursor: pointer;
        }

        .chips :global(button.active) {
          border-color: rgba(56, 189, 248, 0.95);
          background: rgba(14, 116, 144, 0.35);
        }
      `}</style>
    </div>
  )
}
