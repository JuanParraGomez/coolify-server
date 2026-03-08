'use client'

import { useDeferredValue, useState } from 'react'

type Quarter = 'All' | 'Q1' | 'Q2' | 'Q3' | 'Q4'
type Channel = 'All' | 'Enterprise' | 'Partner' | 'Self-serve'
type Product = 'All' | 'Core Analytics' | 'Forecast AI' | 'Pipeline Guard'
type FixedQuarter = Exclude<Quarter, 'All'>
type FixedChannel = Exclude<Channel, 'All'>
type FixedProduct = Exclude<Product, 'All'>

type SalesRecord = {
  region: string
  quarter: FixedQuarter
  channel: FixedChannel
  product: FixedProduct
  revenue: number
  target: number
  orders: number
  winRate: number
  pipeline: number
}

const quarters: Quarter[] = ['All', 'Q1', 'Q2', 'Q3', 'Q4']
const fixedQuarters: FixedQuarter[] = ['Q1', 'Q2', 'Q3', 'Q4']
const channels: Channel[] = ['All', 'Enterprise', 'Partner', 'Self-serve']
const products: Product[] = ['All', 'Core Analytics', 'Forecast AI', 'Pipeline Guard']
const productCycle: FixedProduct[] = ['Forecast AI', 'Pipeline Guard', 'Core Analytics']

const regionProfiles = [
  { name: 'North America', baseRevenue: 286000, targetBase: 275000, growth: 22000, ordersBase: 24, winBase: 37 },
  { name: 'LATAM', baseRevenue: 194000, targetBase: 188000, growth: 15000, ordersBase: 28, winBase: 34 },
  { name: 'EMEA', baseRevenue: 242000, targetBase: 235000, growth: 18500, ordersBase: 26, winBase: 35 },
  { name: 'APAC', baseRevenue: 214000, targetBase: 210000, growth: 20500, ordersBase: 30, winBase: 33 },
]

const channelProfiles = [
  { name: 'Enterprise' as const, multiplier: 1.18, ordersMultiplier: 0.64, pipelineBoost: 1.44, winAdjust: 4, targetBias: 18000 },
  { name: 'Partner' as const, multiplier: 0.94, ordersMultiplier: 0.98, pipelineBoost: 1.18, winAdjust: 1, targetBias: 7000 },
  { name: 'Self-serve' as const, multiplier: 0.78, ordersMultiplier: 1.52, pipelineBoost: 0.9, winAdjust: -3, targetBias: -12000 },
]

const salesRecords: SalesRecord[] = regionProfiles.flatMap((region, regionIndex) =>
  fixedQuarters.flatMap((quarter, quarterIndex) =>
    channelProfiles.map((channel, channelIndex) => {
      const seasonalLift = [0, 22000, 41000, 64000][quarterIndex]
      const regionLift = regionIndex * 9000
      const revenueBase = region.baseRevenue + seasonalLift + regionLift + quarterIndex * region.growth
      const revenue = Math.round(revenueBase * channel.multiplier)
      const target = Math.round(
        region.targetBase +
          quarterIndex * 18000 +
          regionIndex * 8500 +
          channel.targetBias
      )
      const orders = Math.round(
        (region.ordersBase + quarterIndex * 3 + regionIndex * 2) * channel.ordersMultiplier
      )
      const winRate = Number(
        (
          region.winBase +
          quarterIndex * 1.3 +
          channel.winAdjust -
          regionIndex * 0.5
        ).toFixed(1)
      )
      const pipeline = Math.round(revenue * channel.pipelineBoost)

      return {
        region: region.name,
        quarter,
        channel: channel.name,
        product: productCycle[(regionIndex + quarterIndex + channelIndex) % productCycle.length],
        revenue,
        target,
        orders,
        winRate,
        pipeline,
      }
    })
  )
)

const currencyFormatter = new Intl.NumberFormat('es-ES', {
  style: 'currency',
  currency: 'USD',
  maximumFractionDigits: 0,
})

const numberFormatter = new Intl.NumberFormat('es-ES')

function formatCurrency(value: number) {
  return currencyFormatter.format(value)
}

function formatCompactCurrency(value: number) {
  return new Intl.NumberFormat('es-ES', {
    style: 'currency',
    currency: 'USD',
    notation: 'compact',
    maximumFractionDigits: 1,
  }).format(value)
}

function formatPercent(value: number) {
  return `${value.toFixed(1)}%`
}

function sum(values: number[]) {
  return values.reduce((total, value) => total + value, 0)
}

function buildLinePath(values: number[], width: number, height: number) {
  if (!values.length) {
    return { line: '', area: '', points: [] as { x: number; y: number }[] }
  }

  const maxValue = Math.max(...values, 1)
  const step = values.length > 1 ? width / (values.length - 1) : width
  const points = values.map((value, index) => ({
    x: index * step,
    y: height - (value / maxValue) * height,
  }))

  const line = points
    .map((point, index) => `${index === 0 ? 'M' : 'L'} ${point.x} ${point.y}`)
    .join(' ')

  const area = `${line} L ${width} ${height} L 0 ${height} Z`

  return { line, area, points }
}

function buildMixGradient(values: { value: number; color: string }[]) {
  const total = sum(values.map((entry) => entry.value))
  if (!total) {
    return 'conic-gradient(rgba(58, 35, 26, 0.08) 0deg 360deg)'
  }

  let cursor = 0
  const segments = values.map((entry) => {
    const start = cursor
    const span = (entry.value / total) * 360
    cursor += span
    return `${entry.color} ${start}deg ${cursor}deg`
  })

  return `conic-gradient(${segments.join(', ')})`
}

export function SalesDashboard() {
  const [selectedQuarter, setSelectedQuarter] = useState<Quarter>('All')
  const [selectedChannel, setSelectedChannel] = useState<Channel>('All')
  const [selectedProduct, setSelectedProduct] = useState<Product>('All')
  const [regionSearch, setRegionSearch] = useState('')
  const [showAttentionOnly, setShowAttentionOnly] = useState(false)
  const deferredSearch = useDeferredValue(regionSearch.trim().toLowerCase())

  const filteredRecords = salesRecords.filter((record) => {
    const matchesQuarter = selectedQuarter === 'All' || record.quarter === selectedQuarter
    const matchesChannel = selectedChannel === 'All' || record.channel === selectedChannel
    const matchesProduct = selectedProduct === 'All' || record.product === selectedProduct
    const matchesSearch =
      !deferredSearch || record.region.toLowerCase().includes(deferredSearch)
    const needsAttention =
      record.revenue < record.target || record.winRate < 35 || record.pipeline < record.target

    return (
      matchesQuarter &&
      matchesChannel &&
      matchesProduct &&
      matchesSearch &&
      (!showAttentionOnly || needsAttention)
    )
  })

  const revenue = sum(filteredRecords.map((record) => record.revenue))
  const target = sum(filteredRecords.map((record) => record.target))
  const orders = sum(filteredRecords.map((record) => record.orders))
  const pipeline = sum(filteredRecords.map((record) => record.pipeline))
  const attainment = target ? (revenue / target) * 100 : 0
  const pipelineCoverage = revenue ? pipeline / revenue : 0
  const averageDeal = orders ? revenue / orders : 0
  const weightedWinRate = revenue
    ? filteredRecords.reduce((total, record) => total + record.winRate * record.revenue, 0) / revenue
    : 0

  const byRegion = regionProfiles.map((profile) => {
    const records = filteredRecords.filter((record) => record.region === profile.name)
    const regionRevenue = sum(records.map((record) => record.revenue))
    const regionTarget = sum(records.map((record) => record.target))
    const regionOrders = sum(records.map((record) => record.orders))
    const regionPipeline = sum(records.map((record) => record.pipeline))
    const regionWinRate = regionRevenue
      ? records.reduce((total, record) => total + record.winRate * record.revenue, 0) / regionRevenue
      : 0

    return {
      region: profile.name,
      revenue: regionRevenue,
      target: regionTarget,
      gap: regionRevenue - regionTarget,
      orders: regionOrders,
      pipeline: regionPipeline,
      winRate: regionWinRate,
    }
  })

  const activeRegions = byRegion.filter(
    (entry) => entry.revenue || entry.target || entry.orders || entry.pipeline
  )
  const topRegion = [...activeRegions].sort((left, right) => right.revenue - left.revenue)[0]
  const largestGap = [...activeRegions].sort((left, right) => left.gap - right.gap)[0]
  const regionRevenueMax = Math.max(...activeRegions.map((entry) => entry.revenue), 1)
  const regionTargetMax = Math.max(...activeRegions.map((entry) => entry.target), 1)

  const quarterTrend = fixedQuarters.map((quarter) => ({
    quarter,
    revenue: sum(
      filteredRecords
        .filter((record) => record.quarter === quarter)
        .map((record) => record.revenue)
    ),
  }))

  const mixPalette = ['#d85e32', '#0d7c74', '#e0a830']
  const channelMix = channelProfiles.map((channel, index) => ({
    label: channel.name,
    value: sum(
      filteredRecords
        .filter((record) => record.channel === channel.name)
        .map((record) => record.revenue)
    ),
    color: mixPalette[index],
  }))

  const lineChart = buildLinePath(
    quarterTrend.map((entry) => entry.revenue),
    320,
    150
  )

  return (
    <main className="dashboard-shell">
      <div className="dashboard">
        <section className="hero">
          <div className="hero-panel">
            <span className="eyebrow">UI factory sales probe</span>
            <h1>Pulse regional para ventas y forecast.</h1>
            <p>
              Vista ejecutiva con datos simulados deterministas para explorar ventas por
              región, canal y producto. Incluye métricas de attainment, cobertura de
              pipeline y focos de riesgo para priorizar seguimiento comercial.
            </p>

            <div className="hero-grid">
              <article className="kpi-card">
                <p className="kpi-label">Revenue filtrado</p>
                <p className="kpi-value">{formatCompactCurrency(revenue)}</p>
                <p className="kpi-note">
                  {filteredRecords.length} cortes comerciales activos en la vista.
                </p>
              </article>
              <article className="kpi-card">
                <p className="kpi-label">Attainment</p>
                <p className="kpi-value">{formatPercent(attainment)}</p>
                <p className="kpi-note">
                  {formatCurrency(target)} de cuota comparada contra plan.
                </p>
              </article>
              <article className="kpi-card">
                <p className="kpi-label">Mejor región</p>
                <p className="kpi-value">{topRegion?.region ?? 'Sin datos'}</p>
                <p className="kpi-note">
                  {topRegion ? formatCompactCurrency(topRegion.revenue) : 'Ajusta filtros'}
                </p>
              </article>
              <article className="kpi-card">
                <p className="kpi-label">Mayor gap</p>
                <p className="kpi-value">{largestGap?.region ?? 'Sin datos'}</p>
                <p className="kpi-note">
                  {largestGap ? formatCompactCurrency(largestGap.gap) : 'No aplica'}
                </p>
              </article>
            </div>
          </div>

          <aside className="status-panel hero-panel">
            <h2>Checklist de validación</h2>
            <div className="status-list">
              <div className="status-item">
                <div className="status-row">
                  <strong>Proyecto UI local</strong>
                  <span className="status-pill ok">Listo</span>
                </div>
                <p>
                  README, metadatos y scaffold Next.js quedaron alineados con la implementación.
                </p>
              </div>
              <div className="status-item">
                <div className="status-row">
                  <strong>Registro público en hapi</strong>
                  <span className="status-pill warn">Pendiente</span>
                </div>
                <p>
                  La validación real requiere el runner `agent_run_ui_factory` o conectividad a
                  `hapi`, no disponible en este workspace.
                </p>
              </div>
              <div className="status-item">
                <div className="status-row">
                  <strong>Memoria final en rag</strong>
                  <span className="status-pill warn">Pendiente</span>
                </div>
                <p>
                  El manifest local existe, pero la comprobación de ingestión remota no puede
                  ejecutarse sin el flujo externo.
                </p>
              </div>
            </div>
            <p className="panel-subtitle">
              La app está preparada para despliegue en Coolify y para una validación externa
              posterior del registro público.
            </p>
          </aside>
        </section>

        <section className="content-grid">
          <aside className="panel filters-panel">
            <div>
              <h2 className="section-title">Filtros</h2>
              <p className="panel-subtitle">
                Ajusta el corte comercial y revisa sólo las regiones con señales de riesgo.
              </p>
            </div>

            <div className="filter-group">
              <span className="filter-title">Trimestre</span>
              <div className="chip-row">
                {quarters.map((quarter) => (
                  <button
                    key={quarter}
                    className={`chip ${selectedQuarter === quarter ? 'active' : ''}`}
                    onClick={() => setSelectedQuarter(quarter)}
                    type="button"
                  >
                    {quarter}
                  </button>
                ))}
              </div>
            </div>

            <div className="filter-group">
              <label htmlFor="channel">Canal</label>
              <select
                id="channel"
                className="control"
                value={selectedChannel}
                onChange={(event) => setSelectedChannel(event.target.value as Channel)}
              >
                {channels.map((channel) => (
                  <option key={channel} value={channel}>
                    {channel}
                  </option>
                ))}
              </select>
            </div>

            <div className="filter-group">
              <label htmlFor="product">Producto</label>
              <select
                id="product"
                className="control"
                value={selectedProduct}
                onChange={(event) => setSelectedProduct(event.target.value as Product)}
              >
                {products.map((product) => (
                  <option key={product} value={product}>
                    {product}
                  </option>
                ))}
              </select>
            </div>

            <div className="filter-group">
              <label htmlFor="region">Buscar región</label>
              <input
                id="region"
                className="control"
                placeholder="Ej. LATAM o APAC"
                value={regionSearch}
                onChange={(event) => setRegionSearch(event.target.value)}
              />
            </div>

            <label className="toggle" htmlFor="attention-only">
              <input
                id="attention-only"
                checked={showAttentionOnly}
                onChange={(event) => setShowAttentionOnly(event.target.checked)}
                type="checkbox"
              />
              Mostrar sólo regiones con riesgo comercial
            </label>

            <div className="filter-summary">
              <div className="summary-line">
                <span>Registros visibles</span>
                <span>{numberFormatter.format(filteredRecords.length)}</span>
              </div>
              <div className="summary-line">
                <span>Revenue</span>
                <span>{formatCompactCurrency(revenue)}</span>
              </div>
              <div className="summary-line">
                <span>Pipeline</span>
                <span>{formatCompactCurrency(pipeline)}</span>
              </div>
            </div>
          </aside>

          <div className="main-stack">
            <section className="metrics-strip">
              <article className="panel metric-panel">
                <h3>Average deal</h3>
                <strong>{formatCurrency(averageDeal)}</strong>
                <p className="metric-annotation">Ticket promedio por orden cerrada.</p>
              </article>
              <article className="panel metric-panel">
                <h3>Win rate</h3>
                <strong>{formatPercent(weightedWinRate)}</strong>
                <p className="metric-annotation">Promedio ponderado por revenue.</p>
              </article>
              <article className="panel metric-panel">
                <h3>Pipeline cover</h3>
                <strong>{pipelineCoverage.toFixed(2)}x</strong>
                <p className="metric-annotation">Cobertura de pipeline sobre ventas.</p>
              </article>
              <article className="panel metric-panel">
                <h3>Orders</h3>
                <strong>{numberFormatter.format(orders)}</strong>
                <p className="metric-annotation">Operaciones cerradas en la selección.</p>
              </article>
            </section>

            <section className="charts-grid">
              <article className="panel chart-panel">
                <div className="chart-header">
                  <div>
                    <h2 className="section-title">Revenue por región</h2>
                    <p className="panel-subtitle">
                      Comparativa contra target agregado con foco en brechas.
                    </p>
                  </div>
                  <span className="legend">Barra: revenue | línea dorada: target</span>
                </div>

                {revenue ? (
                  <div className="chart-frame">
                    <div className="bar-grid">
                      {activeRegions.map((entry) => {
                        const barHeight = `${Math.max((entry.revenue / regionRevenueMax) * 220, 6)}px`
                        const targetOffset = `${Math.max((entry.target / regionTargetMax) * 220, 4)}px`

                        return (
                          <div className="bar-column" key={entry.region}>
                            <div className="bar-stack">
                              <div className="bar-target" style={{ bottom: targetOffset }} />
                              <div className="bar" style={{ height: barHeight }} />
                            </div>
                            <div>
                              <div className="bar-label">{entry.region}</div>
                              <div className="bar-value">{formatCompactCurrency(entry.revenue)}</div>
                            </div>
                          </div>
                        )
                      })}
                    </div>
                  </div>
                ) : (
                  <p className="empty-state">No hay datos con los filtros actuales.</p>
                )}
              </article>

              <article className="panel chart-panel">
                <div className="chart-header">
                  <div>
                    <h2 className="section-title">Mix por canal</h2>
                    <p className="panel-subtitle">
                      Distribución del revenue en Enterprise, Partner y Self-serve.
                    </p>
                  </div>
                </div>

                <div className="mix-layout">
                  <div
                    className="mix-chart"
                    style={{ background: buildMixGradient(channelMix) }}
                  >
                    <div className="mix-center">
                      <div>
                        <span className="legend">Total</span>
                        <strong>{formatCompactCurrency(revenue)}</strong>
                      </div>
                    </div>
                  </div>

                  <div className="mix-legend">
                    {channelMix.map((entry) => {
                      const share = revenue ? (entry.value / revenue) * 100 : 0
                      return (
                        <div className="legend-row" key={entry.label}>
                          <span className="swatch" style={{ background: entry.color }} />
                          <span>{entry.label}</span>
                          <strong>{formatPercent(share)}</strong>
                        </div>
                      )
                    })}
                  </div>
                </div>
              </article>
            </section>

            <section className="charts-grid">
              <article className="panel chart-panel">
                <div className="chart-header">
                  <div>
                    <h2 className="section-title">Tendencia trimestral</h2>
                    <p className="panel-subtitle">
                      Evolución del revenue filtrado a lo largo del año comercial.
                    </p>
                  </div>
                </div>

                {revenue ? (
                  <div className="line-chart">
                    <svg viewBox="0 0 320 170" role="img" aria-label="Grafico trimestral de revenue">
                      <path className="line-fill" d={lineChart.area} />
                      <path className="line-stroke" d={lineChart.line} />
                      {lineChart.points.map((point, index) => (
                        <circle
                          className="line-point"
                          cx={point.x}
                          cy={point.y}
                          key={`${quarterTrend[index]?.quarter ?? index}`}
                          r="5"
                        />
                      ))}
                    </svg>
                    <div className="axis-row">
                      {quarterTrend.map((entry) => (
                        <span key={entry.quarter}>{entry.quarter}</span>
                      ))}
                    </div>
                  </div>
                ) : (
                  <p className="empty-state">No hay tendencia visible con esta combinación de filtros.</p>
                )}
              </article>

              <article className="panel chart-panel">
                <div className="chart-header">
                  <div>
                    <h2 className="section-title">Lectura ejecutiva</h2>
                    <p className="panel-subtitle">
                      Resumen textual para revisión de comité comercial.
                    </p>
                  </div>
                </div>
                <p className="table-caption">
                  {topRegion
                    ? `${topRegion.region} lidera la selección con ${formatCompactCurrency(
                        topRegion.revenue
                      )}, mientras ${
                        largestGap?.region ?? 'la cartera más rezagada'
                      } conserva la mayor brecha frente al objetivo.`
                    : 'Sin datos suficientes para generar una lectura ejecutiva.'}
                </p>
                <p className="table-caption">
                  El mix se concentra en{' '}
                  {
                    [...channelMix].sort((left, right) => right.value - left.value)[0]
                      ?.label
                  }{' '}
                  y la cobertura de pipeline se mantiene en {pipelineCoverage.toFixed(2)}x
                  sobre ventas filtradas.
                </p>
                <p className="table-caption">
                  Usa el filtro de riesgo para aislar regiones donde revenue, win rate o
                  pipeline están por debajo de la señal esperada.
                </p>
              </article>
            </section>

            <section className="panel table-panel">
              <div className="chart-header">
                <div>
                  <h2 className="section-title">Detalle regional</h2>
                  <p className="panel-subtitle">
                    Tabla agregada para revisión operativa y priorización de seguimiento.
                  </p>
                </div>
              </div>

              <div className="table-wrap">
                <table className="data-table">
                  <thead>
                    <tr>
                      <th>Región</th>
                      <th>Revenue</th>
                      <th>Target</th>
                      <th>Gap</th>
                      <th>Win rate</th>
                      <th>Pipeline</th>
                      <th>Orders</th>
                    </tr>
                  </thead>
                  <tbody>
                    {byRegion.map((entry) => (
                      <tr key={entry.region}>
                        <td>{entry.region}</td>
                        <td>{formatCurrency(entry.revenue)}</td>
                        <td>{formatCurrency(entry.target)}</td>
                        <td className={entry.gap < 0 ? 'risk' : 'healthy'}>
                          {formatCurrency(entry.gap)}
                        </td>
                        <td>{formatPercent(entry.winRate)}</td>
                        <td>{formatCurrency(entry.pipeline)}</td>
                        <td>{numberFormatter.format(entry.orders)}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </section>
          </div>
        </section>
      </div>
    </main>
  )
}
