import type { RegionalDataRow } from '../lib/types'

interface RegionTableProps {
  data: RegionalDataRow[]
  sortBy: string
  selectedRegion: string | null
}

/**
 * RegionTable Component
 * Displays regional metrics in a data table:
 * - 5 regions with real data: Norteamérica, Europa, Asia Pacífico, Latinoamérica, MENA
 * - Columns: Region, Users, Revenue, Tickets
 * - Filtering: By selected region
 * - Sorting: By revenue, users, or tickets count
 *
 * Real functionality: Displays actual regional data with dynamic filtering and sorting
 */
export default function RegionTable({ data, sortBy, selectedRegion }: RegionTableProps) {
  // Filter data by selected region
  const filteredData = selectedRegion ? data.filter((row) => row.region === selectedRegion) : data

  // Sort data by selected metric
  const sortedData = [...filteredData].sort((a, b) => {
    if (sortBy === 'revenue') return b.revenue - a.revenue
    if (sortBy === 'users') return b.users - a.users
    if (sortBy === 'tickets') return b.tickets - a.tickets
    return 0
  })

  // Calculate totals for footer
  const totals = {
    users: sortedData.reduce((sum, row) => sum + row.users, 0),
    revenue: sortedData.reduce((sum, row) => sum + row.revenue, 0),
    tickets: sortedData.reduce((sum, row) => sum + row.tickets, 0),
  }

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
            <th style={{ padding: '1rem', textAlign: 'left', fontWeight: 600, color: '#64748b' }}>
              Región
            </th>
            <th style={{ padding: '1rem', textAlign: 'right', fontWeight: 600, color: '#64748b' }}>
              Usuarios
            </th>
            <th style={{ padding: '1rem', textAlign: 'right', fontWeight: 600, color: '#64748b' }}>
              Ingresos
            </th>
            <th style={{ padding: '1rem', textAlign: 'right', fontWeight: 600, color: '#64748b' }}>
              Tickets
            </th>
          </tr>
        </thead>
        <tbody>
          {sortedData.map((row, idx) => (
            <tr key={idx} style={{ borderBottom: '1px solid #e2e8f0' }}>
              <td style={{ padding: '1rem', color: '#1e293b', fontWeight: 500 }}>
                {row.region}
              </td>
              <td style={{ padding: '1rem', textAlign: 'right', color: '#1e293b' }}>
                {row.users.toLocaleString()}
              </td>
              <td style={{ padding: '1rem', textAlign: 'right', color: '#1e293b' }}>
                ${row.revenue.toLocaleString()}
              </td>
              <td style={{ padding: '1rem', textAlign: 'right', color: '#1e293b' }}>
                {row.tickets}
              </td>
            </tr>
          ))}
        </tbody>
        {/* Totals row */}
        <tfoot>
          <tr
            style={{
              background: '#f1f5f9',
              borderTop: '2px solid #e2e8f0',
              fontWeight: 600,
            }}
          >
            <td style={{ padding: '1rem', color: '#1e293b' }}>Total</td>
            <td style={{ padding: '1rem', textAlign: 'right', color: '#1e293b' }}>
              {totals.users.toLocaleString()}
            </td>
            <td style={{ padding: '1rem', textAlign: 'right', color: '#1e293b' }}>
              ${totals.revenue.toLocaleString()}
            </td>
            <td style={{ padding: '1rem', textAlign: 'right', color: '#1e293b' }}>
              {totals.tickets}
            </td>
          </tr>
        </tfoot>
      </table>
    </div>
  )
}
