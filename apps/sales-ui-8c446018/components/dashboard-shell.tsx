'use client'

import React, { useMemo, useState } from 'react'
import FiltersPanel from '../components/filters-panel'
import RegionTable from '../components/region-table'
import RegionChart from '../components/region-chart'
import type { Filters } from '../lib/mock-data'
import { generateMockSales, filterAndAggregate, REGIONS, CATEGORIES } from '../lib/mock-data'

export default function DashboardShell({ children }: { children?: React.ReactNode }) {
  const [filters, setFilters] = useState<Filters | undefined>(undefined)

  // generate mock sales once
  const sales = useMemo(() => generateMockSales(), [])

  // aggregated data per region based on filters
  const data = useMemo(() => filterAndAggregate(sales, filters), [sales, filters])

  const total = data.reduce((s, d) => s + d.total, 0)

  return (
    <div>
      <header style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem' }}>
        <h1 style={{ margin: 0 }}>Ventas por Región</h1>

        <div style={{ display: 'flex', gap: '0.75rem', alignItems: 'center' }}>
          <div style={{ minWidth: 360 }}>
            <FiltersPanel regions={REGIONS} categories={CATEGORIES} onChange={(f) => setFilters(f)} initial={filters} />
          </div>
        </div>
      </header>

      <section style={{ display: 'grid', gridTemplateColumns: '1fr 360px', gap: '1rem' }}>
        <div style={{ background: '#fff', padding: '1rem', borderRadius: 8 }}>
          <div style={{ marginBottom: 12, color: '#666' }}>Resumen (últimos 12 meses)</div>

          <RegionChart />

          <div style={{ marginTop: 12 }}>
            <RegionTable data={data} />
          </div>
        </div>

        <aside style={{ background: '#fff', padding: '1rem', borderRadius: 8 }}>
          <h3 style={{ marginTop: 0 }}>Detalles</h3>
          <p style={{ margin: 0 }}>
            Total: <strong>€{total.toLocaleString()}</strong>
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
