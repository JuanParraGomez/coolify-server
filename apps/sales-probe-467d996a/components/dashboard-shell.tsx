'use client'

import React, { useState } from 'react'

type Props = { children: React.ReactNode }

export default function DashboardShell({ children }: Props) {
  const [region, setRegion] = useState('All')
  const [range, setRange] = useState('30d')

  return (
    <div style={{ display: 'flex', minHeight: '100vh', background: '#f5f7fa' }}>
      <aside style={{ width: 240, padding: 20, background: '#fff', borderRight: '1px solid #e6e9ef' }}>
        <h2 style={{ margin: 0, marginBottom: 12 }}>Ventas por Región</h2>
        <nav style={{ display: 'flex', flexDirection: 'column', gap: 8, marginBottom: 18 }}>
          <a href="#" style={{ textDecoration: 'none', color: '#111' }}>Dashboard</a>
          <a href="#" style={{ textDecoration: 'none', color: '#111' }}>Reportes</a>
          <a href="#" style={{ textDecoration: 'none', color: '#111' }}>Ajustes</a>
        </nav>

        <div style={{ marginTop: 12 }}>
          <label style={{ display: 'block', fontSize: 12, marginBottom: 6 }}>Región</label>
          <select value={region} onChange={(e) => setRegion(e.target.value)} style={{ width: '100%', padding: 8 }}>
            <option>All</option>
            <option>North</option>
            <option>South</option>
            <option>East</option>
            <option>West</option>
          </select>
        </div>

        <div style={{ marginTop: 12 }}>
          <label style={{ display: 'block', fontSize: 12, marginBottom: 6 }}>Rango</label>
          <select value={range} onChange={(e) => setRange(e.target.value)} style={{ width: '100%', padding: 8 }}>
            <option value="7d">Últimos 7 días</option>
            <option value="30d">Últimos 30 días</option>
            <option value="90d">Últimos 90 días</option>
            <option value="12m">Últimos 12 meses</option>
          </select>
        </div>

        <div style={{ marginTop: 18 }}>
          <button style={{ width: '100%', padding: 10, background: '#0b5fff', color: '#fff', border: 'none', borderRadius: 6 }}>Aplicar filtros</button>
        </div>
      </aside>

      <main style={{ flex: 1, padding: 24 }}>
        <header style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 18 }}>
          <div>
            <h1 style={{ margin: 0 }}>Panel</h1>
            <p style={{ margin: 0, color: '#666' }}>Resumen de ventas por región</p>
          </div>
          <div>
            <input placeholder="Buscar..." style={{ padding: '8px 12px', borderRadius: 8, border: '1px solid #d0d5dd' }} />
          </div>
        </header>

        <section style={{ background: '#fff', padding: 16, borderRadius: 8, minHeight: 200 }}>
          {children}
        </section>
      </main>
    </div>
  )
}
