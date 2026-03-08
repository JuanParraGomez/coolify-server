'use client'

import type { CSSProperties, ReactNode } from 'react'

import type { Region, RegionSummary } from '../lib/mock-data'

interface RegionTableProps {
  summaries: RegionSummary[]
  selectedRegion: Region | null
  onSelectRegion: (region: Region | null) => void
}

export default function RegionTable({
  summaries,
  selectedRegion,
  onSelectRegion,
}: RegionTableProps) {
  const sorted = [...summaries].sort((left, right) => right.totalRevenue - left.totalRevenue)

  if (!sorted.length) {
    return <div style={styles.empty}>No hay datos para la combinacion actual de filtros.</div>
  }

  return (
    <div style={styles.wrapper}>
      <table style={styles.table}>
        <thead>
          <tr style={styles.headRow}>
            <Th>Region</Th>
            <Th align="right">Revenue</Th>
            <Th align="right">Target</Th>
            <Th align="right">Cumplimiento</Th>
            <Th align="right">Unidades</Th>
            <Th>Categoria lider</Th>
          </tr>
        </thead>
        <tbody>
          {sorted.map((summary) => {
            const isSelected = selectedRegion === summary.region
            const achievementColor =
              summary.achievementPct >= 100
                ? '#16a34a'
                : summary.achievementPct >= 85
                  ? '#d97706'
                  : '#dc2626'

            return (
              <tr
                key={summary.region}
                onClick={() => onSelectRegion(isSelected ? null : summary.region)}
                style={{
                  ...styles.row,
                  background: isSelected ? '#fff7ed' : undefined,
                  cursor: 'pointer',
                }}
              >
                <td style={{ ...styles.cell, fontWeight: 600, color: '#1e293b' }}>
                  <span style={isSelected ? styles.selectedDot : styles.dot} />
                  {summary.region}
                </td>
                <td style={{ ...styles.cell, ...styles.right }}>
                  {fmt(summary.totalRevenue)}
                </td>
                <td style={{ ...styles.cell, ...styles.right, color: '#64748b' }}>
                  {fmt(summary.totalTarget)}
                </td>
                <td style={{ ...styles.cell, ...styles.right }}>
                  <span
                    style={{
                      ...styles.badge,
                      background: `${achievementColor}18`,
                      color: achievementColor,
                      borderColor: `${achievementColor}33`,
                    }}
                  >
                    {summary.achievementPct}%
                  </span>
                </td>
                <td style={{ ...styles.cell, ...styles.right }}>
                  {summary.totalUnits.toLocaleString('es-MX')}
                </td>
                <td style={{ ...styles.cell, color: '#475569', fontSize: '0.82rem' }}>
                  {translateCategory(summary.topCategory)}
                </td>
              </tr>
            )
          })}
        </tbody>
      </table>
    </div>
  )
}

function Th({ children, align }: { children: ReactNode; align?: 'right' }) {
  return (
    <th
      style={{
        ...styles.th,
        textAlign: align === 'right' ? 'right' : 'left',
      }}
    >
      {children}
    </th>
  )
}

function translateCategory(category: RegionSummary['topCategory']) {
  return {
    Electronics: 'Electronica',
    Clothing: 'Moda',
    Food: 'Alimentos',
    Home: 'Hogar',
    Sports: 'Deportes',
  }[category]
}

function fmt(value: number) {
  if (value >= 1_000_000) return `$${(value / 1_000_000).toFixed(1)}M`
  if (value >= 1_000) return `$${(value / 1_000).toFixed(0)}K`
  return `$${value}`
}

const styles: Record<string, CSSProperties> = {
  wrapper: {
    overflowX: 'auto',
    borderRadius: 24,
    border: '1px solid rgba(148, 163, 184, 0.24)',
    background:
      'radial-gradient(circle at top right, rgba(255,255,255,0.72), transparent 36%), linear-gradient(180deg, rgba(255,255,255,0.96), rgba(248,250,252,0.94))',
  },
  table: {
    width: '100%',
    borderCollapse: 'collapse',
    fontSize: '0.875rem',
  },
  headRow: {
    background: 'rgba(248, 250, 252, 0.92)',
    borderBottom: '2px solid rgba(148, 163, 184, 0.2)',
  },
  th: {
    padding: '0.6rem 1rem',
    fontWeight: 700,
    color: '#9a4f1d',
    fontSize: '0.75rem',
    textTransform: 'uppercase',
    letterSpacing: '0.08em',
    whiteSpace: 'nowrap',
  },
  row: {
    borderBottom: '1px solid rgba(226, 232, 240, 0.72)',
    transition: 'background 0.1s',
  },
  cell: {
    padding: '0.65rem 1rem',
    verticalAlign: 'middle',
    whiteSpace: 'nowrap',
  },
  right: { textAlign: 'right' },
  badge: {
    display: 'inline-block',
    padding: '1px 8px',
    borderRadius: 999,
    border: '1px solid',
    fontWeight: 600,
    fontSize: '0.78rem',
  },
  dot: {
    display: 'inline-block',
    width: 8,
    height: 8,
    borderRadius: '50%',
    background: '#cbd5e1',
    marginRight: 8,
    verticalAlign: 'middle',
  },
  selectedDot: {
    display: 'inline-block',
    width: 8,
    height: 8,
    borderRadius: '50%',
    background: '#f97316',
    marginRight: 8,
    verticalAlign: 'middle',
  },
  empty: {
    padding: '2rem',
    textAlign: 'center',
    color: '#94a3b8',
    fontSize: '0.9rem',
    border: '1px solid rgba(148, 163, 184, 0.24)',
    borderRadius: 24,
    background: '#fff',
  },
}
