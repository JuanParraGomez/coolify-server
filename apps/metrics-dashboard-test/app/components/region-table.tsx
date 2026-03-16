import type { RegionalDataRow } from '../lib/types'

interface RegionTableProps {
  data: RegionalDataRow[]
  sortBy: string
  selectedRegion: string | null
}

export default function RegionTable({ data, sortBy, selectedRegion }: RegionTableProps) {
  const filteredData = selectedRegion ? data.filter((row) => row.region === selectedRegion) : data

  const sortedData = [...filteredData].sort((a, b) => {
    if (sortBy === 'revenue') return b.revenue - a.revenue
    if (sortBy === 'users') return b.users - a.users
    if (sortBy === 'tickets') return b.tickets - a.tickets
    return 0
  })

  return (
    <div
      style={{
        background: '#fff',
        border: '1px solid #e2e8f0',
        borderRadius: '12px',
        overflow: 'hidden',
      }}
    >
      <table
        style={{
          width: '100%',
          borderCollapse: 'collapse',
          fontSize: '0.875rem',
        }}
      >
        <thead>
          <tr style={{ background: '#f8fafc', borderBottom: '1px solid #e2e8f0' }}>
            <th style={{ padding: '1rem', textAlign: 'left', fontWeight: 600, color: '#64748b' }}>Región</th>
            <th style={{ padding: '1rem', textAlign: 'right', fontWeight: 600, color: '#64748b' }}>Usuarios</th>
            <th style={{ padding: '1rem', textAlign: 'right', fontWeight: 600, color: '#64748b' }}>Ingresos</th>
            <th style={{ padding: '1rem', textAlign: 'right', fontWeight: 600, color: '#64748b' }}>Tickets</th>
          </tr>
        </thead>
        <tbody>
          {sortedData.map((row, idx) => (
            <tr key={idx} style={{ borderBottom: '1px solid #e2e8f0' }}>
              <td style={{ padding: '1rem', color: '#1e293b' }}>{row.region}</td>
              <td style={{ padding: '1rem', textAlign: 'right', color: '#1e293b' }}>{row.users.toLocaleString()}</td>
              <td style={{ padding: '1rem', textAlign: 'right', color: '#1e293b' }}>
                ${row.revenue.toLocaleString()}
              </td>
              <td style={{ padding: '1rem', textAlign: 'right', color: '#1e293b' }}>{row.tickets}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}
