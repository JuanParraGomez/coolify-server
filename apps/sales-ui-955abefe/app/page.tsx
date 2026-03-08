'use client'

import React, { useMemo, useState } from 'react'
import { generateMockData, REGIONS, MONTHS } from '../lib/mock-data'
import FiltersPanel from '../components/filters-panel'
import RegionChart from '../components/region-chart'
import RegionTable from '../components/region-table'

export default function Page() {
  const [filters, setFilters] = useState<{ region?: string; from?: string; to?: string; minSales?: number }>({
    from: MONTHS[0],
    to: MONTHS[MONTHS.length - 1],
  })

  const allData = useMemo(() => generateMockData(42), [])

  const filtered = useMemo(() => {
    return allData
      .map((r) => {
        const monthly = r.monthly.filter((m) => (filters.from ? m.month >= filters.from : true) && (filters.to ? m.month <= filters.to : true))
        const totalSales = monthly.reduce((s, m) => s + m.sales, 0)
        return { ...r, monthly, totalSales }
      })
      .filter((r) => {
        if (filters.region && r.region !== filters.region) return false
        if (typeof filters.minSales === 'number' && r.totalSales < filters.minSales) return false
        return true
      })
  }, [allData, filters])

  // RegionChart expects a flat list of SaleRecords; transform mock data accordingly
  const chartData = useMemo(() => {
    return allData.flatMap((r) => r.monthly.map((m) => ({ region: r.region, category: 'All', month: m.month, amount: m.sales })))
  }, [allData])

  return (
    <div>
      <h1 style={{ margin: 0, marginBottom: 12 }}>Ventas por región</h1>

      <section style={{ display: 'flex', gap: 20, marginBottom: 20 }}>
        <div style={{ flex: '0 0 320px', padding: 12, border: '1px solid #e5e7eb', borderRadius: 8, background: '#fff' }}>
          <h3 style={{ marginTop: 0 }}>Filtros</h3>
          <FiltersPanel regions={REGIONS} months={MONTHS} onChange={(f) => setFilters(f as any)} />
        </div>

        <div style={{ flex: 1 }}>
          <div style={{ padding: 12, border: '1px solid #e5e7eb', borderRadius: 8, background: '#fff' }}>
            <h3 style={{ marginTop: 0 }}>Gráficos</h3>
            <RegionChart data={chartData} />
          </div>
        </div>
      </section>

      <section>
        <h3>Resumen por región</h3>
        <div style={{ display: 'grid', gap: 12 }}>
          <RegionTable data={filtered} />
        </div>
      </section>
    </div>
  )
}
