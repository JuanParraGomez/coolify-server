'use client'

import type { CSSProperties, ReactNode } from 'react'

import {
  ALL_CATEGORIES,
  ALL_MONTHS,
  ALL_REGIONS,
  type Category,
  type FilterState,
  type Region,
} from '../lib/mock-data'

interface FiltersPanelProps {
  filters: FilterState
  onChange: (filters: FilterState) => void
}

const regionLabels: Record<Region, string> = {
  North: 'North',
  South: 'South',
  East: 'East',
  West: 'West',
  Central: 'Central',
}

const categoryLabels: Record<Category, string> = {
  Electronics: 'Electronica',
  Clothing: 'Moda',
  Food: 'Alimentos',
  Home: 'Hogar',
  Sports: 'Deportes',
}

const monthLabels = Object.fromEntries(ALL_MONTHS.map((month) => [month, month.slice(5)]))

function toggleItem<T>(arr: T[], item: T): T[] {
  return arr.includes(item) ? arr.filter((x) => x !== item) : [...arr, item]
}

export default function FiltersPanel({ filters, onChange }: FiltersPanelProps) {
  const toggleRegion = (region: Region) =>
    onChange({ ...filters, regions: toggleItem(filters.regions, region) })

  const toggleCategory = (category: Category) =>
    onChange({ ...filters, categories: toggleItem(filters.categories, category) })

  const toggleMonth = (month: string) =>
    onChange({ ...filters, months: toggleItem(filters.months, month) })

  const selectAll = () =>
    onChange({
      regions: [...ALL_REGIONS],
      categories: [...ALL_CATEGORIES],
      months: [...ALL_MONTHS],
    })

  const clearAll = () => onChange({ regions: [], categories: [], months: [] })

  return (
    <aside style={styles.panel}>
      <div style={styles.header}>
        <div>
          <span style={styles.title}>Filtros</span>
          <div style={styles.subtitle}>Regiones, categorias y meses</div>
        </div>
        <div style={styles.actions}>
          <button style={styles.btn} type="button" onClick={selectAll}>
            Todos
          </button>
          <button style={styles.btn} type="button" onClick={clearAll}>
            Limpiar
          </button>
        </div>
      </div>

      <FilterSection label="Regiones">
        {ALL_REGIONS.map((region) => (
          <Chip
            key={region}
            label={regionLabels[region]}
            active={filters.regions.includes(region)}
            onClick={() => toggleRegion(region)}
          />
        ))}
      </FilterSection>

      <FilterSection label="Categorias">
        {ALL_CATEGORIES.map((category) => (
          <Chip
            key={category}
            label={categoryLabels[category]}
            active={filters.categories.includes(category)}
            onClick={() => toggleCategory(category)}
          />
        ))}
      </FilterSection>

      <FilterSection label="Meses">
        <div style={styles.monthGrid}>
          {ALL_MONTHS.map((month) => (
            <Chip
              key={month}
              label={monthLabels[month]}
              title={month}
              active={filters.months.includes(month)}
              onClick={() => toggleMonth(month)}
            />
          ))}
        </div>
      </FilterSection>
    </aside>
  )
}

function FilterSection({
  label,
  children,
}: {
  label: string
  children: ReactNode
}) {
  return (
    <div style={styles.section}>
      <div style={styles.sectionLabel}>{label}</div>
      <div style={styles.chips}>{children}</div>
    </div>
  )
}

function Chip({
  label,
  active,
  onClick,
  title,
}: {
  label: string
  active: boolean
  onClick: () => void
  title?: string
}) {
  return (
    <button
      title={title}
      type="button"
      onClick={onClick}
      style={{
        ...styles.chip,
        background: active
          ? 'linear-gradient(135deg, #f97316, #e27a45)'
          : '#f8fafc',
        color: active ? '#fff7ed' : '#334155',
        borderColor: active ? '#c2410c' : '#d7dee7',
      }}
    >
      {label}
    </button>
  )
}

const styles: Record<string, CSSProperties> = {
  panel: {
    width: '100%',
    minWidth: 0,
    background:
      'radial-gradient(circle at top right, rgba(255, 255, 255, 0.72), transparent 36%), linear-gradient(180deg, rgba(255,255,255,0.96), rgba(248,250,252,0.92))',
    border: '1px solid rgba(148, 163, 184, 0.24)',
    borderRadius: 24,
    padding: '1.1rem',
    display: 'flex',
    flexDirection: 'column',
    gap: '0.95rem',
  },
  header: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    gap: '0.75rem',
    marginBottom: '0.25rem',
  },
  title: { fontWeight: 700, fontSize: '1rem', color: '#0f172a' },
  subtitle: { marginTop: '0.25rem', fontSize: '0.78rem', color: '#64748b' },
  actions: { display: 'flex', gap: '0.25rem' },
  btn: {
    fontSize: '0.72rem',
    padding: '0.4rem 0.7rem',
    border: '1px solid rgba(148, 163, 184, 0.28)',
    borderRadius: 999,
    background: '#ffffff',
    cursor: 'pointer',
    color: '#475569',
    fontWeight: 600,
  },
  section: { display: 'flex', flexDirection: 'column', gap: '0.35rem' },
  sectionLabel: {
    fontSize: '0.72rem',
    fontWeight: 700,
    color: '#9a4f1d',
    textTransform: 'uppercase',
    letterSpacing: '0.08em',
  },
  chips: { display: 'flex', flexWrap: 'wrap', gap: '0.3rem' },
  monthGrid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(3, minmax(0, 1fr))',
    gap: '0.3rem',
  },
  chip: {
    fontSize: '0.75rem',
    padding: '0.38rem 0.72rem',
    border: '1px solid',
    borderRadius: 999,
    cursor: 'pointer',
    transition: 'all 0.15s',
    fontWeight: 600,
  },
}
