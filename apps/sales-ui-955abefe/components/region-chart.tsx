'use client'
import React, { useMemo, useState } from 'react'

type SaleRecord = {
  region: string
  category: string
  month: string // YYYY-MM
  amount: number
}

type Props = {
  data?: SaleRecord[]
}

const fallbackData: SaleRecord[] = [
  { region: 'North', category: 'Software', month: '2026-01', amount: 12000 },
  { region: 'North', category: 'Services', month: '2026-01', amount: 8000 },
  { region: 'South', category: 'Software', month: '2026-01', amount: 7000 },
  { region: 'East', category: 'Hardware', month: '2026-01', amount: 5000 },
  { region: 'West', category: 'Services', month: '2026-01', amount: 3000 },
  { region: 'North', category: 'Software', month: '2026-02', amount: 15000 },
  { region: 'South', category: 'Hardware', month: '2026-02', amount: 4000 },
  { region: 'East', category: 'Software', month: '2026-02', amount: 6000 },
]

function summarizeByRegion(data: SaleRecord[]) {
  const map = new Map<string, number>()
  data.forEach(d => map.set(d.region, (map.get(d.region) || 0) + d.amount))
  return Array.from(map.entries()).map(([region, amount]) => ({ region, amount }))
}

function summarizeByCategory(data: SaleRecord[]) {
  const map = new Map<string, number>()
  data.forEach(d => map.set(d.category, (map.get(d.category) || 0) + d.amount))
  return Array.from(map.entries()).map(([category, amount]) => ({ category, amount }))
}

export default function RegionChart({ data = fallbackData }: Props) {
  const [monthFilter, setMonthFilter] = useState<string>('')
  const [search, setSearch] = useState('')
  const [selectedRegion, setSelectedRegion] = useState<string | null>(null)

  const filtered = useMemo(() => {
    return data.filter(d => {
      if (monthFilter && d.month !== monthFilter) return false
      if (search && !d.region.toLowerCase().includes(search.toLowerCase())) return false
      return true
    })
  }, [data, monthFilter, search])

  const regionSummary = useMemo(() => summarizeByRegion(filtered).sort((a, b) => b.amount - a.amount), [filtered])
  const total = regionSummary.reduce((s, r) => s + r.amount, 0)

  const selectedDetails = useMemo(() => {
    if (!selectedRegion) return null
    const regionData = filtered.filter(d => d.region === selectedRegion)
    return {
      byCategory: summarizeByCategory(regionData),
      byMonth: regionData.reduce((m: Record<string, number>, rec) => { m[rec.month] = (m[rec.month] || 0) + rec.amount; return m }, {})
    }
  }, [selectedRegion, filtered])

  // Simple responsive SVG bar chart
  const BarChart = ({ items }: { items: { region: string; amount: number }[] }) => {
    const width = 700
    const height = 300
    const padding = 40
    const max = Math.max(...items.map(i => i.amount), 1)
    const barWidth = (width - padding * 2) / Math.max(items.length, 1)

    return (
      <svg width="100%" viewBox={`0 0 ${width} ${height}`} style={{ maxWidth: '100%' }}>
        {/* axes */}
        <line x1={padding} y1={height - padding} x2={width - padding} y2={height - padding} stroke="#ccc" />
        {items.map((it, idx) => {
          const barHeight = ((height - padding * 2) * it.amount) / max
          const x = padding + idx * barWidth + 6
          const y = height - padding - barHeight
          return (
            <g key={it.region} onClick={() => setSelectedRegion(it.region)} style={{ cursor: 'pointer' }}>
              <rect x={x} y={y} width={barWidth - 12} height={barHeight} fill="#4f46e5" rx={4} />
              <text x={x + (barWidth - 12) / 2} y={height - padding + 14} fontSize={12} fill="#111" textAnchor="middle">
                {it.region}
              </text>
              <title>{`${it.region}: $${it.amount.toLocaleString()}`}</title>
            </g>
          )
        })}
      </svg>
    )
  }

  const PieChart = ({ data }: { data: { label: string; value: number }[] }) => {
    const size = 200
    const radius = size / 2
    const total = data.reduce((s, d) => s + d.value, 0) || 1
    let cumulative = 0
    return (
      <svg width={size} height={size} viewBox={`0 0 ${size} ${size}`}>
        {data.map((d, i) => {
          const start = (cumulative / total) * Math.PI * 2
          cumulative += d.value
          const end = (cumulative / total) * Math.PI * 2
          const x1 = radius + radius * Math.cos(start - Math.PI / 2)
          const y1 = radius + radius * Math.sin(start - Math.PI / 2)
          const x2 = radius + radius * Math.cos(end - Math.PI / 2)
          const y2 = radius + radius * Math.sin(end - Math.PI / 2)
          const large = end - start > Math.PI ? 1 : 0
          const path = `M ${radius} ${radius} L ${x1} ${y1} A ${radius} ${radius} 0 ${large} 1 ${x2} ${y2} Z`
          const colors = ['#ef4444', '#f59e0b', '#10b981', '#3b82f6', '#8b5cf6', '#ec4899']
          return <path key={i} d={path} fill={colors[i % colors.length]} stroke="#fff" strokeWidth={1} />
        })}
        <g transform={`translate(${size + 10},20)`}></g>
      </svg>
    )
  }

  return (
    <div style={{ fontFamily: 'Inter, system-ui, -apple-system, Segoe UI, Roboto, sans-serif' }}>
      <h3>Ventas por Región</h3>
      <div style={{ display: 'flex', gap: 12, marginBottom: 12, flexWrap: 'wrap' }}>
        <div>
          <label style={{ display: 'block', fontSize: 12 }}>Mes (YYYY-MM)</label>
          <input value={monthFilter} onChange={e => setMonthFilter(e.target.value)} placeholder="2026-01" />
        </div>
        <div>
          <label style={{ display: 'block', fontSize: 12 }}>Buscar región</label>
          <input value={search} onChange={e => setSearch(e.target.value)} placeholder="North" />
        </div>
        <div style={{ marginLeft: 'auto', minWidth: 200 }}>
          <div style={{ fontSize: 12, color: '#666' }}>Total filtrado</div>
          <div style={{ fontSize: 20, fontWeight: 700 }}>${total.toLocaleString()}</div>
        </div>
      </div>

      <div style={{ border: '1px solid #eee', padding: 12, borderRadius: 8 }}>
        {regionSummary.length === 0 ? (
          <div>No hay datos para los filtros aplicados.</div>
        ) : (
          <BarChart items={regionSummary} />
        )}
      </div>

      <div style={{ marginTop: 12, display: 'flex', gap: 12, flexWrap: 'wrap' }}>
        <div style={{ minWidth: 260, flex: '1 1 300px' }}>
          <h4>Resumen rápido</h4>
          <ul>
            {regionSummary.slice(0, 5).map(r => (
              <li key={r.region} style={{ marginBottom: 6 }}>
                <strong>{r.region}</strong>: ${r.amount.toLocaleString()}
                <button style={{ marginLeft: 8 }} onClick={() => setSelectedRegion(r.region)}>Ver detalle</button>
              </li>
            ))}
          </ul>
        </div>

        <div style={{ flex: '1 1 300px', minWidth: 300 }}>
          <h4>Detalle</h4>
          {selectedRegion && selectedDetails ? (
            <div>
              <div style={{ marginBottom: 8 }}><strong>{selectedRegion}</strong> — total ${selectedDetails.byCategory.reduce((s, c) => s + c.amount, 0).toLocaleString()}</div>
              <div style={{ display: 'flex', gap: 12, alignItems: 'center' }}>
                <PieChart data={selectedDetails.byCategory.map(b => ({ label: b.category, value: b.amount }))} />
                <div>
                  <h5>Por categoría</h5>
                  <ul>
                    {selectedDetails.byCategory.map(c => (
                      <li key={c.category}>{c.category}: ${c.amount.toLocaleString()}</li>
                    ))}
                  </ul>
                </div>
              </div>
            </div>
          ) : (
            <div>Hacer click en una barra o "Ver detalle" para explorar una región.</div>
          )}
        </div>
      </div>
    </div>
  )
}
