'use client'

import React, { useMemo, useState } from 'react'

type Breakdown = { name: string; sales: number }
type Region = { region: string; sales: number; breakdown: Breakdown[] }

function seededRandom(seed: number) {
  return () => {
    // simple LCG
    seed = (seed * 1664525 + 1013904223) % 4294967296
    return seed / 4294967296
  }
}

function generateData(days: number): Region[] {
  const regions = ['North', 'South', 'East', 'West', 'Central']
  const rnd = seededRandom(days + 42)
  return regions.map((r, idx) => {
    const base = Math.round((rnd() * 0.8 + 0.2) * (100000 + idx * 20000) * Math.max(1, days / 30))
    const parts = 3
    const breakdown: Breakdown[] = Array.from({ length: parts }).map((_, i) => {
      const factor = 0.4 + rnd() * 0.8
      return { name: `${r} - Sub${i + 1}`, sales: Math.round(base * factor / parts) }
    })
    const total = breakdown.reduce((s, b) => s + b.sales, 0)
    return { region: r, sales: total, breakdown }
  })
}

export default function RegionChart() {
  const [daysRange, setDaysRange] = useState<number>(30)
  const [selectedRegion, setSelectedRegion] = useState<string | null>(null)
  const [minSalesFilter, setMinSalesFilter] = useState<number>(0)

  const data = useMemo(() => generateData(daysRange), [daysRange])

  const filtered = useMemo(() => data.filter(d => d.sales >= minSalesFilter), [data, minSalesFilter])

  const totalSales = useMemo(() => filtered.reduce((s, r) => s + r.sales, 0), [filtered])
  const avgSales = useMemo(() => Math.round((totalSales / Math.max(1, filtered.length)) || 0), [totalSales, filtered.length])
  const topRegion = useMemo(() => filtered.slice().sort((a, b) => b.sales - a.sales)[0]?.region || null, [filtered])

  const maxSales = Math.max(1, ...filtered.map(d => d.sales))

  return (
    <div style={{ fontFamily: 'Inter, system-ui, Arial, sans-serif', padding: 12 }}>
      <h2 style={{ margin: '6px 0' }}>Ventas por Región</h2>

      <div style={{ display: 'flex', gap: 12, alignItems: 'center', flexWrap: 'wrap' }}>
        <label>
          Rango:
          <select value={daysRange} onChange={e => setDaysRange(Number(e.target.value))} style={{ marginLeft: 8 }}>
            <option value={7}>Últimos 7 días</option>
            <option value={30}>Últimos 30 días</option>
            <option value={90}>Últimos 90 días</option>
            <option value={365}>Últimos 365 días</option>
          </select>
        </label>

        <label>
          Mín ventas:
          <input type="range" min={0} max={200000} step={1000} value={minSalesFilter} onChange={e => setMinSalesFilter(Number(e.target.value))} style={{ marginLeft: 8 }} />
          <span style={{ marginLeft: 8 }}>{minSalesFilter}</span>
        </label>

        <button onClick={() => { setSelectedRegion(null); setMinSalesFilter(0); setDaysRange(30) }}>Reset</button>

        <div style={{ marginLeft: 'auto', display: 'flex', gap: 12 }}>
          <div style={{ background: '#f3f4f6', padding: 8, borderRadius: 6 }}>
            <div style={{ fontSize: 12, color: '#6b7280' }}>Total</div>
            <div style={{ fontSize: 18, fontWeight: 700 }}>€{totalSales.toLocaleString()}</div>
          </div>
          <div style={{ background: '#f3f4f6', padding: 8, borderRadius: 6 }}>
            <div style={{ fontSize: 12, color: '#6b7280' }}>Promedio</div>
            <div style={{ fontSize: 18, fontWeight: 700 }}>€{avgSales.toLocaleString()}</div>
          </div>
          <div style={{ background: '#f3f4f6', padding: 8, borderRadius: 6 }}>
            <div style={{ fontSize: 12, color: '#6b7280' }}>Top</div>
            <div style={{ fontSize: 18, fontWeight: 700 }}>{topRegion || '-'}</div>
          </div>
        </div>
      </div>

      <div style={{ marginTop: 16 }}>
        <svg viewBox={`0 0 600 240`} width="100%" height={240} style={{ borderRadius: 8, background: '#ffffff' }}>
          <g transform="translate(40,10)">
            {/* Y axis labels */}
            {Array.from({ length: 5 }).map((_, i) => {
              const y = (i / 4) * 200
              const val = Math.round(maxSales * (1 - i / 4))
              return (
                <g key={i}>
                  <line x1={0} y1={y} x2={520} y2={y} stroke="#e5e7eb" strokeWidth={1} />
                  <text x={-36} y={y + 4} fontSize={10} fill="#6b7280">{val}</text>
                </g>
              )
            })}

            {/* Bars */}
            {filtered.map((d, i) => {
              const w = 520 / filtered.length
              const barWidth = Math.max(24, w * 0.6)
              const x = i * w + (w - barWidth) / 2
              const height = Math.max(2, (d.sales / maxSales) * 200)
              const y = 200 - height
              const isSelected = selectedRegion === d.region
              return (
                <g key={d.region} onClick={() => setSelectedRegion(d.region)} style={{ cursor: 'pointer' }}>
                  <rect x={x} y={y} width={barWidth} height={height} fill={isSelected ? '#2563eb' : '#60a5fa'} rx={4}></rect>
                  <text x={x + barWidth / 2} y={215} fontSize={12} textAnchor="middle">{d.region}</text>
                  <text x={x + barWidth / 2} y={y - 6} fontSize={11} textAnchor="middle">€{d.sales.toLocaleString()}</text>
                </g>
              )
            })}
          </g>
        </svg>
      </div>

      <div style={{ marginTop: 12 }}>
        {selectedRegion ? (
          <div>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <h3 style={{ margin: 0 }}>Detalle: {selectedRegion}</h3>
              <button onClick={() => setSelectedRegion(null)}>Back</button>
            </div>
            <div style={{ marginTop: 8, display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(160px, 1fr))', gap: 8 }}>
              {data.find(r => r.region === selectedRegion)?.breakdown.map(b => (
                <div key={b.name} style={{ padding: 8, borderRadius: 6, background: '#f8fafc' }}>
                  <div style={{ fontSize: 12, color: '#6b7280' }}>{b.name}</div>
                  <div style={{ fontSize: 16, fontWeight: 700 }}>€{b.sales.toLocaleString()}</div>
                </div>
              ))}
            </div>
          </div>
        ) : (
          <div style={{ marginTop: 8, color: '#6b7280' }}>Haz click en una barra para ver el detalle por subregión (drill-down).</div>
        )}
      </div>

      <div style={{ marginTop: 16 }}>
        <table style={{ width: '100%', borderCollapse: 'collapse' }}>
          <thead>
            <tr style={{ textAlign: 'left', borderBottom: '1px solid #e5e7eb' }}>
              <th style={{ padding: 8 }}>Región</th>
              <th style={{ padding: 8 }}>Ventas</th>
              <th style={{ padding: 8 }}>% del total</th>
            </tr>
          </thead>
          <tbody>
            {filtered.map(r => (
              <tr key={r.region} style={{ borderBottom: '1px solid #f1f5f9' }}>
                <td style={{ padding: 8 }}>{r.region}</td>
                <td style={{ padding: 8 }}>€{r.sales.toLocaleString()}</td>
                <td style={{ padding: 8 }}>{((r.sales / Math.max(1, totalSales)) * 100).toFixed(1)}%</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  )
}

