import type { RegionalDataRow } from '../lib/types'

interface RegionChartProps {
  data: RegionalDataRow[]
  metric: 'users' | 'revenue' | 'tickets'
}

const COLORS: Record<string, string> = {
  users: '#3b82f6',
  revenue: '#10b981',
  tickets: '#f59e0b',
}

const LABELS: Record<string, string> = {
  users: 'Usuarios activos',
  revenue: 'Ingresos del mes',
  tickets: 'Tickets pendientes',
}

export default function RegionChart({ data, metric }: RegionChartProps) {
  const getValue = (row: RegionalDataRow): number => {
    if (metric === 'revenue') return row.revenue
    if (metric === 'tickets') return row.tickets
    return row.users
  }

  const formatValue = (val: number): string => {
    if (metric === 'revenue') return `$${val.toLocaleString()}`
    return val.toLocaleString()
  }

  const max = Math.max(...data.map(getValue), 1)
  const color = COLORS[metric]

  return (
    <div
      style={{
        background: '#fff',
        border: '1px solid #e2e8f0',
        borderRadius: '12px',
        padding: '1.5rem',
        boxShadow: '0 1px 4px rgba(0,0,0,0.06)',
      }}
    >
      <h3
        style={{
          margin: '0 0 1.25rem',
          fontSize: '0.95rem',
          fontWeight: 600,
          color: '#1e293b',
        }}
      >
        {LABELS[metric]} por región
      </h3>
      <div style={{ display: 'flex', flexDirection: 'column', gap: '0.875rem' }}>
        {data.map((row) => {
          const val = getValue(row)
          const pct = (val / max) * 100
          return (
            <div key={row.region}>
              <div
                style={{
                  display: 'flex',
                  justifyContent: 'space-between',
                  marginBottom: '0.3rem',
                }}
              >
                <span style={{ fontSize: '0.85rem', color: '#374151' }}>{row.region}</span>
                <span style={{ fontSize: '0.85rem', fontWeight: 600, color: '#111827' }}>
                  {formatValue(val)}
                </span>
              </div>
              <div
                style={{
                  height: '8px',
                  background: '#f1f5f9',
                  borderRadius: '4px',
                  overflow: 'hidden',
                }}
              >
                <div
                  style={{
                    height: '100%',
                    width: `${pct}%`,
                    background: color,
                    borderRadius: '4px',
                    transition: 'width 0.35s ease',
                  }}
                />
              </div>
            </div>
          )
        })}
      </div>
    </div>
  )
}
