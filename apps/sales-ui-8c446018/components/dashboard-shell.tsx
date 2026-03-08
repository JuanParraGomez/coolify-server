'use client'

import React, { useMemo, useState } from 'react'

const regions = ['All', 'North', 'South', 'East', 'West']

const sampleData = [
  { region: 'North', value: 120 },
  { region: 'South', value: 80 },
  { region: 'East', value: 150 },
  { region: 'West', value: 60 },
]

export default function DashboardShell({ children }: { children?: React.ReactNode }) {
  const [region, setRegion] = useState<string>('All')
  const [metric, setMetric] = useState<string>('Revenue')

  const filtered = useMemo(() => {
    if (region === 'All') return sampleData
    return sampleData.filter((d) => d.region === region)
  }, [region])

  const total = filtered.reduce((s, d) => s + d.value, 0)

  return (
    <div>
      <header style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem' }}>
        <h1 style={{ margin: 0 }}>Ventas por Región</h1>

        <div style={{ display: 'flex', gap: '0.75rem', alignItems: 'center' }}>
          <label style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
            Región
            <select value={region} onChange={(e) => setRegion(e.target.value)}>
              {regions.map((r) => (
                <option key={r} value={r}>
                  {r}
                </option>
              ))}
            </select>
          </label>

          <label style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
            Métrica
            <select value={metric} onChange={(e) => setMetric(e.target.value)}>
              <option>Revenue</option>
              <option>Orders</option>
              <option>Customers</option>
            </select>
          </label>
        </div>
      </header>

      <section style={{ display: 'grid', gridTemplateColumns: '1fr 320px', gap: '1rem' }}>
        <div style={{ background: '#fff', padding: '1rem', borderRadius: 8 }}>
          <div style={{ marginBottom: 12, color: '#666' }}>Resumen: {metric}</div>

          <div style={{ display: 'flex', alignItems: 'flex-end', gap: 12, height: 160 }}>
            {filtered.map((d) => {
              const height = Math.max(8, (d.value / 150) * 100)
              return (
                <div key={d.region} style={{ flex: 1, textAlign: 'center' }}>
                  <div style={{ height: `${height}%`, background: '#2563eb', borderRadius: 4, marginBottom: 6 }} />
                  <div style={{ fontSize: 12 }}>{d.region}</div>
                  <div style={{ fontWeight: 700 }}>{d.value}</div>
                </div>
              )
            })}
          </div>
        </div>

        <aside style={{ background: '#fff', padding: '1rem', borderRadius: 8 }}>
          <h3 style={{ marginTop: 0 }}>Detalles</h3>
          <p style={{ margin: 0 }}>
            Total: <strong>{total}</strong>
          </p>

          <div style={{ marginTop: 12 }}>
            <button style={{ padding: '8px 12px', borderRadius: 6, border: 'none', background: '#0ea5e9', color: '#fff' }}>
              Exportar
            </button>
          </div>
        </aside>
      </section>

      {children}
    </div>
  )
}
