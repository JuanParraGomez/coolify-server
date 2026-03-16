'use client'

import { useState } from 'react'
import DashboardShell from './components/dashboard-shell'
import MetricCard from './components/MetricCard'
import FiltersPanel, { type FilterState } from './components/filters-panel'
import RegionTable from './components/region-table'
import RegionChart from './components/region-chart'
import { useMetrics } from './hooks/useMetrics'
import { MOCK_METRICS } from './lib/mock-data'

export default function Page() {
  const { data, loading } = useMetrics()

  const [filters, setFilters] = useState<FilterState>({
    selectedRegion: null,
    sortBy: 'revenue',
  })

  const metrics = data ?? MOCK_METRICS.metrics
  const metricsArray = [
    metrics.activeUsers,
    metrics.monthlyRevenue,
    metrics.pendingTickets,
  ]

  const regions = MOCK_METRICS.regionalData.map((r) => r.region)

  const chartMetric = filters.sortBy === 'tickets' ? 'tickets'
    : filters.sortBy === 'users' ? 'users'
    : 'revenue'

  return (
    <DashboardShell>
      <div style={{ marginBottom: '1.75rem' }}>
        <h2
          style={{
            fontSize: '1.375rem',
            fontWeight: 700,
            color: '#1e293b',
            margin: '0 0 0.25rem',
          }}
        >
          Resumen de métricas
        </h2>
        <p style={{ fontSize: '0.875rem', color: '#64748b', margin: 0 }}>
          Indicadores clave de rendimiento — marzo 2026
        </p>
      </div>

      {/* KPI cards */}
      <div
        style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))',
          gap: '1.25rem',
          marginBottom: '2rem',
          opacity: loading ? 0.5 : 1,
          transition: 'opacity 0.2s',
        }}
      >
        {metricsArray.map((metric) => (
          <MetricCard key={metric.id} metric={metric} />
        ))}
      </div>

      {/* Filters */}
      <FiltersPanel regions={regions} onFilterChange={setFilters} />

      {/* Chart + Table side by side on wide screens */}
      <div
        style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))',
          gap: '1.5rem',
        }}
      >
        <RegionChart
          data={MOCK_METRICS.regionalData}
          metric={chartMetric}
        />
        <RegionTable
          data={MOCK_METRICS.regionalData}
          sortBy={filters.sortBy}
          selectedRegion={filters.selectedRegion}
        />
      </div>
    </DashboardShell>
  )
}
