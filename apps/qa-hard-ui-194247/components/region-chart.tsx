'use client'

import { useMemo, useState } from 'react'

type Quarter = 'Q1 2025' | 'Q2 2025' | 'Q3 2025'
type RegionMetric = {
  region: string
  quarter: Quarter
  revenue: number
  margin: number
  orders: number
  growth: number
}

const ALL_QUARTERS = 'Todos los trimestres'
const quarters: Quarter[] = ['Q1 2025', 'Q2 2025', 'Q3 2025']
const regionNames = ['Norte', 'Centro', 'Sur', 'Occidente'] as const
type RegionName = (typeof regionNames)[number]
const regions: RegionName[] = [...regionNames]

const regionColors: Record<RegionName, string> = {
  Norte: '#2563eb',
  Centro: '#f97316',
  Sur: '#10b981',
  Occidente: '#8b5cf6',
}

const rawSalesData: RegionMetric[] = [
  { region: 'Norte', quarter: 'Q1 2025', revenue: 820000, margin: 0.21, orders: 540, growth: 0.07 },
  { region: 'Centro', quarter: 'Q1 2025', revenue: 670000, margin: 0.19, orders: 410, growth: 0.05 },
  { region: 'Sur', quarter: 'Q1 2025', revenue: 560000, margin: 0.17, orders: 360, growth: 0.03 },
  { region: 'Occidente', quarter: 'Q1 2025', revenue: 480000, margin: 0.18, orders: 310, growth: 0.04 },
  { region: 'Norte', quarter: 'Q2 2025', revenue: 920000, margin: 0.23, orders: 620, growth: 0.08 },
  { region: 'Centro', quarter: 'Q2 2025', revenue: 720000, margin: 0.21, orders: 450, growth: 0.07 },
  { region: 'Sur', quarter: 'Q2 2025', revenue: 610000, margin: 0.18, orders: 385, growth: 0.05 },
  { region: 'Occidente', quarter: 'Q2 2025', revenue: 540000, margin: 0.20, orders: 340, growth: 0.06 },
  { region: 'Norte', quarter: 'Q3 2025', revenue: 880000, margin: 0.22, orders: 600, growth: 0.05 },
  { region: 'Centro', quarter: 'Q3 2025', revenue: 750000, margin: 0.22, orders: 470, growth: 0.08 },
  { region: 'Sur', quarter: 'Q3 2025', revenue: 640000, margin: 0.19, orders: 410, growth: 0.04 },
  { region: 'Occidente', quarter: 'Q3 2025', revenue: 560000, margin: 0.21, orders: 360, growth: 0.04 },
]

const formatCurrency = (value: number) =>
  new Intl.NumberFormat('es-ES', {
    style: 'currency',
    currency: 'USD',
    maximumFractionDigits: 0,
  }).format(value)

const formatPercent = (value: number) => `${Math.round(value * 100)}%`

const panelStyle = {
  borderRadius: 12,
  border: '1px solid #e5e7eb',
  background: '#fff',
  boxShadow: '0 10px 25px rgba(15,23,42,0.08)',
  padding: 22,
}

const gridGap = { gap: 16 }

const navButtonStyle = (active: boolean) => ({
  flex: 1,
  padding: '10px 16px',
  borderRadius: 999,
  border: '1px solid transparent',
  background: active ? '#0ea5e9' : '#e0f2fe',
  color: active ? '#fff' : '#0f172a',
  fontWeight: 600,
  cursor: 'pointer',
})

export default function RegionChart() {
  const [selectedQuarter, setSelectedQuarter] = useState<string>(ALL_QUARTERS)
  const [visibleRegions, setVisibleRegions] = useState<RegionName[]>([...regions])
  const [selectedRegion, setSelectedRegion] = useState<RegionName>(regions[0])
  const [viewMode, setViewMode] = useState<'summary' | 'detail'>('summary')

  const filteredData = useMemo(
    () =>
      rawSalesData.filter(
        (item) =>
          (selectedQuarter === ALL_QUARTERS || item.quarter === selectedQuarter) &&
          visibleRegions.includes(item.region),
      ),
    [selectedQuarter, visibleRegions],
  )

  const totals = useMemo(() => {
    const revenue = filteredData.reduce((sum, cur) => sum + cur.revenue, 0)
    const orders = filteredData.reduce((sum, cur) => sum + cur.orders, 0)
    const margin =
      filteredData.length === 0
        ? 0
        : filteredData.reduce((sum, cur) => sum + cur.margin, 0) / filteredData.length
    return { revenue, orders, margin }
  }, [filteredData])

  const bestRegion = useMemo(() => {
    const regionRevenue: Record<string, number> = {}
    filteredData.forEach((item) => {
      regionRevenue[item.region] = (regionRevenue[item.region] ?? 0) + item.revenue
    })
    return Object.entries(regionRevenue).sort((a, b) => b[1] - a[1])[0]
  }, [filteredData])

  const chartData = useMemo(() => {
    const aggregated: Record<string, number> = {}
    filteredData.forEach((item) => {
      aggregated[item.region] = (aggregated[item.region] ?? 0) + item.revenue
    })
    return regions
      .filter((region) => aggregated[region])
      .map((region) => ({
        region,
        value: aggregated[region],
      }))
  }, [filteredData])

  const maxRevenue = Math.max(1, ...chartData.map((entry) => entry.value))

  const regionSummaries = useMemo(() => {
    const record: Record<RegionName, { totalRevenue: number; quarterDetails: RegionMetric[]; averageMargin: number }> =
      {} as Record<RegionName, { totalRevenue: number; quarterDetails: RegionMetric[]; averageMargin: number }>
    regions.forEach((region) => {
      const entries = rawSalesData.filter((item) => item.region === region)
      if (!entries.length) return
      record[region] = {
        totalRevenue: entries.reduce((sum, entry) => sum + entry.revenue, 0),
        averageMargin:
          entries.reduce((sum, entry) => sum + entry.margin, 0) / (entries.length || 1),
        quarterDetails: entries,
      }
    })
    return record
  }, [])

  const detailRegion = regionSummaries[selectedRegion]

  const toggleRegionVisibility = (region: RegionName) => {
    setVisibleRegions((current) =>
      current.includes(region) ? current.filter((name) => name !== region) : [...current, region],
    )
  }

  const quarterComparison = quarters.map((quarter) => ({
    quarter,
    values: regions.map((region) => {
      const metric = rawSalesData.find(
        (item) => item.region === region && item.quarter === quarter,
      )
      return {
        region,
        revenue: metric ? metric.revenue : 0,
        margin: metric ? metric.margin : 0,
      }
    }),
  }))

  return (
    <section style={{ fontFamily: 'Inter, system-ui, sans-serif', color: '#0f172a' }}>
      <header style={{ marginBottom: 32 }}>
        <p style={{ fontSize: 14, color: '#64748b', margin: 0 }}>Mercado LATAM</p>
        <h1 style={{ fontSize: 28, margin: '6px 0 0', fontWeight: 700 }}>Dashboard de ventas por región</h1>
        <p style={{ color: '#475569', marginTop: 6 }}>
          Navega entre el resumen ejecutivo y el detalle trimestral. Usa los filtros para limitar el gráfico.
        </p>
      </header>

      <div
        style={{
          display: 'grid',
          gridTemplateColumns: '1fr 1fr',
          ...gridGap,
          marginBottom: 24,
        }}
      >
        <div style={panelStyle}>
          <p style={{ margin: 0, fontWeight: 600, fontSize: 14 }}>Filtro por trimestre</p>
          <select
            value={selectedQuarter}
            onChange={(event) => setSelectedQuarter(event.target.value)}
            style={{
              marginTop: 8,
              width: '100%',
              padding: '10px 12px',
              borderRadius: 8,
              border: '1px solid #cbd5f5',
              fontSize: 14,
            }}
          >
            {[ALL_QUARTERS, ...quarters].map((quarter) => (
              <option key={quarter} value={quarter}>
                {quarter}
              </option>
            ))}
          </select>
        </div>

        <div style={panelStyle}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <p style={{ margin: 0, fontWeight: 600, fontSize: 14 }}>Regiones visibles</p>
            <button
              onClick={() => setVisibleRegions([...regions])}
              style={{
                fontSize: 12,
                color: '#0ea5e9',
                border: 'none',
                background: 'transparent',
                cursor: 'pointer',
              }}
            >
              Restaurar
            </button>
          </div>
          <div style={{ display: 'flex', flexWrap: 'wrap', marginTop: 10, gap: 10 }}>
            {regions.map((region) => {
              const active = visibleRegions.includes(region)
              return (
                <button
                  key={region}
                  onClick={() => toggleRegionVisibility(region)}
                  style={{
                    padding: '6px 14px',
                    borderRadius: 999,
                    border: `1px solid ${active ? regionColors[region] : '#cbd5f5'}`,
                    background: active ? regionColors[region] : '#f9fafb',
                    color: active ? '#fff' : '#0f172a',
                    fontWeight: 600,
                    cursor: 'pointer',
                  }}
                >
                  {region}
                </button>
              )
            })}
          </div>
        </div>
      </div>

      <div style={{ display: 'flex', gap: 12, marginBottom: 24 }}>
        <button style={navButtonStyle(viewMode === 'summary')} onClick={() => setViewMode('summary')}>
          Resumen
        </button>
        <button style={navButtonStyle(viewMode === 'detail')} onClick={() => setViewMode('detail')}>
          Detalle
        </button>
      </div>

      {viewMode === 'summary' ? (
        <div style={{ ...panelStyle, marginBottom: 24 }}>
          <div
            style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))',
              ...gridGap,
              marginBottom: 24,
            }}
          >
            <div style={{ padding: 18, borderRadius: 10, background: '#f8fafc', border: '1px solid #e2e8f0' }}>
              <p style={{ margin: 0, fontWeight: 600, color: '#0f172a' }}>Ingresos activos</p>
              <p style={{ margin: '8px 0 0', fontSize: 24, fontWeight: 700 }}>{formatCurrency(totals.revenue)}</p>
              <span style={{ color: '#10b981' }}>Ajustado por filtros</span>
            </div>
            <div style={{ padding: 18, borderRadius: 10, background: '#f8fafc', border: '1px solid #e2e8f0' }}>
              <p style={{ margin: 0, fontWeight: 600, color: '#0f172a' }}>Pedidos</p>
              <p style={{ margin: '8px 0 0', fontSize: 24, fontWeight: 700 }}>{totals.orders.toLocaleString('es-ES')}</p>
              <span style={{ color: '#0ea5e9' }}>Impacto de región visible</span>
            </div>
            <div style={{ padding: 18, borderRadius: 10, background: '#f8fafc', border: '1px solid #e2e8f0' }}>
              <p style={{ margin: 0, fontWeight: 600, color: '#0f172a' }}>Margen promedio</p>
              <p style={{ margin: '8px 0 0', fontSize: 24, fontWeight: 700 }}>{formatPercent(totals.margin)}</p>
              <span style={{ color: '#0ea5e9' }}>Con los datos visibles</span>
            </div>
          </div>

          <div
            style={{
              display: 'flex',
              flexDirection: 'row',
              gap: 24,
              flexWrap: 'wrap',
            }}
          >
            <div style={{ flex: 2, minWidth: 280 }}>
              <p style={{ margin: 0, fontWeight: 600, fontSize: 16 }}>Distribución por región</p>
              {chartData.length === 0 ? (
                <p style={{ color: '#475569', marginTop: 12 }}>Activa al menos una región para ver el gráfico.</p>
              ) : (
                <svg viewBox="0 0 380 240" width="100%" height={240} style={{ overflow: 'visible' }}>
                  {chartData.map((entry, index) => {
                    const barWidth = 60
                    const spacing = 24
                    const x = index * (barWidth + spacing)
                    const height = (entry.value / maxRevenue) * 160
                    const y = 200 - height
                    return (
                      <g key={entry.region}>
                        <rect
                          x={x}
                          y={y}
                          width={barWidth}
                          height={height}
                          rx={6}
                          fill={regionColors[entry.region]}
                          opacity={selectedRegion === entry.region ? 1 : 0.7}
                          cursor="pointer"
                          onClick={() => setSelectedRegion(entry.region)}
                        />
                        <text
                          x={x + barWidth / 2}
                          y={216}
                          textAnchor="middle"
                          style={{ fontSize: 12, fill: '#475569' }}
                        >
                          {entry.region}
                        </text>
                        <text
                          x={x + barWidth / 2}
                          y={y - 8}
                          textAnchor="middle"
                          style={{
                            fontSize: 12,
                            fontWeight: 600,
                            fill: '#0f172a',
                          }}
                        >
                          {formatCurrency(entry.value)}
                        </text>
                      </g>
                    )
                  })}
                </svg>
              )}
              <p style={{ marginTop: 12, color: '#475569' }}>
                Mejor región: <strong>{bestRegion ? bestRegion[0] : '—'}</strong> ({bestRegion ? formatCurrency(bestRegion[1]) : '—'})
              </p>
            </div>

            <div style={{ flex: 1, minWidth: 220, padding: 16, borderRadius: 12, border: '1px dashed #cbd5f5' }}>
              <p style={{ margin: 0, fontWeight: 600 }}>Drill-down rápido</p>
              {detailRegion ? (
                <>
                  <p style={{ marginTop: 12, fontSize: 20, fontWeight: 700 }}>{selectedRegion}</p>
                  <p style={{ margin: 4 }}>
                    Total histórico: <strong>{formatCurrency(detailRegion.totalRevenue)}</strong>
                  </p>
                  <p style={{ margin: 4 }}>Margen promedio: {formatPercent(detailRegion.averageMargin)}</p>
                  <p style={{ marginTop: 12, fontWeight: 600 }}>Trimestres</p>
                  <ul style={{ paddingLeft: 16, margin: 4, color: '#475569' }}>
                    {detailRegion.quarterDetails.map((row) => (
                      <li key={`${row.region}-${row.quarter}`} style={{ marginTop: 4 }}>
                        {row.quarter}: {formatCurrency(row.revenue)} ({formatPercent(row.growth)} crecimiento)
                      </li>
                    ))}
                  </ul>
                </>
              ) : (
                <p style={{ marginTop: 8, color: '#94a3b8' }}>Selecciona una región del gráfico.</p>
              )}
            </div>
          </div>
        </div>
      ) : (
        <div style={{ ...panelStyle, marginBottom: 24 }}>
          <p style={{ margin: 0, fontWeight: 600, marginBottom: 16 }}>Comparativa trimestral</p>
          <div style={{ overflowX: 'auto' }}>
            <table
              style={{
                width: '100%',
                borderCollapse: 'collapse',
                fontSize: 14,
                minWidth: 560,
              }}
            >
              <thead>
                <tr>
                  <th style={{ textAlign: 'left', padding: '10px 8px', borderBottom: '1px solid #e2e8f0' }}>Trimestre</th>
                  {regions.map((region) => (
                    <th
                      key={region}
                      style={{
                        textAlign: 'right',
                        padding: '10px 8px',
                        borderBottom: '1px solid #e2e8f0',
                      }}
                    >
                      {region}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {quarterComparison.map((row) => (
                  <tr key={row.quarter}>
                    <td style={{ padding: '10px 8px', fontWeight: 600 }}>{row.quarter}</td>
                    {row.values.map((value) => (
                      <td
                        key={`${row.quarter}-${value.region}`}
                        style={{
                          padding: '10px 8px',
                          textAlign: 'right',
                          color: visibleRegions.includes(value.region) ? '#0f172a' : '#94a3b8',
                        }}
                      >
                        {formatCurrency(value.revenue)}
                      </td>
                    ))}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <div style={{ marginTop: 18, color: '#475569' }}>
            <strong>Hint:</strong> haz clic en una región para resaltar su historia y ver cómo avanza trimestre a trimestre.
          </div>
        </div>
      )}
    </section>
  )
}
