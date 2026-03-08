'use client'

import type { CSSProperties } from 'react'

const CHANNEL_LABELS: Record<string, string> = {
  all: 'Todos los canales',
  online: 'Online',
  retail: 'Retail',
  partners: 'Partners',
}

const FALLBACK_COLORS = ['#e27a45', '#2d8f85', '#869c50', '#5c6bc0', '#c05c7a']

export type ChannelKey = 'all' | 'online' | 'retail' | 'partners' | string

export type RegionChartSubregion = {
  name: string
  revenue: number
  target: number
  orders: number
  conversion: number
  pipeline: number
  delta?: number
}

export type RegionChartAccount = {
  name: string
  segment: string
  revenue: number
  delta: number
}

export type RegionChartRegion = {
  id: string
  name: string
  manager: string
  color?: string
  revenue: number
  target: number
  margin: number
  orders: number
  pipeline?: number
  avgTicket?: number
  performance?: number
  labels?: string[]
  scaledTrend?: number[]
  targetTrend?: number[]
  channels?: Record<string, number>
  subregions?: RegionChartSubregion[]
  accounts?: RegionChartAccount[]
  alerts?: string[]
}

type RegionChartProps = {
  regions: RegionChartRegion[]
  periodLabel?: string
  channelLabel?: string
  activeChannel?: ChannelKey
  selectedRegionId?: string
  onSelectRegion?: (regionId: string) => void
  sectionIds?: {
    overview?: string
    regions?: string
    drilldown?: string
  }
  className?: string
}

type NormalizedRegion = Omit<RegionChartRegion, 'color' | 'pipeline' | 'avgTicket' | 'performance' | 'scaledTrend' | 'targetTrend' | 'channels' | 'subregions' | 'accounts' | 'alerts'> & {
  color: string
  pipeline: number
  avgTicket: number
  performance: number
  labels: string[]
  scaledTrend: number[]
  targetTrend: number[]
  channels: Record<string, number>
  subregions: Array<RegionChartSubregion & { delta: number }>
  accounts: RegionChartAccount[]
  alerts: string[]
}

function sum(values: number[]) {
  return values.reduce((total, current) => total + current, 0)
}

function clamp(value: number, minimum: number, maximum: number) {
  return Math.min(maximum, Math.max(minimum, value))
}

function formatCurrency(value: number) {
  return new Intl.NumberFormat('es-MX', {
    style: 'currency',
    currency: 'USD',
    maximumFractionDigits: 0,
  }).format(value)
}

function formatCompactCurrency(value: number) {
  return new Intl.NumberFormat('es-MX', {
    style: 'currency',
    currency: 'USD',
    notation: 'compact',
    maximumFractionDigits: 1,
  }).format(value)
}

function formatPercent(value: number) {
  return `${value.toFixed(1)}%`
}

function formatAttainment(value: number) {
  return `${Math.round(value * 100)}%`
}

function buildLabels(length: number) {
  return Array.from({ length }, (_, index) => `P${index + 1}`)
}

function fitSeriesLength(series: number[], length: number) {
  if (series.length === length) {
    return series
  }

  if (!series.length) {
    return Array.from({ length }, () => 0)
  }

  if (series.length > length) {
    return series.slice(0, length)
  }

  const nextSeries = [...series]
  while (nextSeries.length < length) {
    nextSeries.push(nextSeries[nextSeries.length - 1])
  }

  return nextSeries
}

function rescaleSeries(series: number[], total: number) {
  if (!series.length) {
    return []
  }

  const currentTotal = sum(series)
  if (currentTotal <= 0) {
    const evenValue = Math.round(total / series.length)
    return series.map((_, index) => {
      if (index === series.length - 1) {
        return Math.max(total - evenValue * (series.length - 1), 0)
      }

      return evenValue
    })
  }

  const scaled = series.map((value) => Math.round((value / currentTotal) * total))
  const drift = total - sum(scaled)
  scaled[scaled.length - 1] = Math.max(scaled[scaled.length - 1] + drift, 0)
  return scaled
}

function buildFallbackTrend(total: number, length: number) {
  const baseSeries = Array.from({ length }, (_, index) => {
    const midpoint = (length - 1) / 2
    const distance = Math.abs(index - midpoint)
    return Math.max(1, 1.08 - distance * 0.1 + index * 0.03)
  })
  return rescaleSeries(baseSeries, total)
}

function normalizeChannels(channels?: Record<string, number>) {
  const entries = Object.entries(channels ?? {}).filter((entry) => Number.isFinite(entry[1]) && entry[1] > 0)
  if (!entries.length) {
    return {
      online: 0.36,
      retail: 0.41,
      partners: 0.23,
    }
  }

  const total = sum(entries.map(([, value]) => value)) || 1
  return Object.fromEntries(entries.map(([key, value]) => [key, value / total]))
}

function buildPath(points: { x: number; y: number }[]) {
  return points.map((point, index) => `${index === 0 ? 'M' : 'L'} ${point.x} ${point.y}`).join(' ')
}

function normalizeRegion(region: RegionChartRegion, index: number): NormalizedRegion {
  const color = region.color ?? FALLBACK_COLORS[index % FALLBACK_COLORS.length]
  const subregions = (region.subregions ?? []).map((subregion) => ({
    ...subregion,
    delta: subregion.delta ?? subregion.revenue - subregion.target,
  }))
  const labels =
    region.labels && region.labels.length
      ? region.labels
      : buildLabels(Math.max(region.scaledTrend?.length ?? 0, region.targetTrend?.length ?? 0, 6))
  const scaledTrend =
    region.scaledTrend && region.scaledTrend.length
      ? rescaleSeries(fitSeriesLength(region.scaledTrend, labels.length), region.revenue)
      : buildFallbackTrend(region.revenue, labels.length)
  const targetTrend =
    region.targetTrend && region.targetTrend.length
      ? rescaleSeries(fitSeriesLength(region.targetTrend, labels.length), region.target)
      : rescaleSeries(scaledTrend, region.target)
  const pipeline = region.pipeline ?? sum(subregions.map((subregion) => subregion.pipeline))
  const performance = region.performance ?? region.revenue / Math.max(region.target, 1)
  const avgTicket = region.avgTicket ?? Math.round(region.revenue / Math.max(region.orders, 1))

  return {
    ...region,
    color,
    pipeline,
    avgTicket,
    performance,
    labels,
    scaledTrend,
    targetTrend,
    channels: normalizeChannels(region.channels),
    subregions,
    accounts: region.accounts ?? [],
    alerts: region.alerts ?? [],
  }
}

function PerformanceChart({
  regions,
  selectedRegionId,
  onSelectRegion,
}: {
  regions: NormalizedRegion[]
  selectedRegionId: string
  onSelectRegion?: (regionId: string) => void
}) {
  const width = 640
  const height = 300
  const left = 88
  const right = 32
  const top = 18
  const bottom = 40
  const chartWidth = width - left - right
  const rowStep = (height - top - bottom) / Math.max(regions.length, 1)
  const maxValue = Math.max(...regions.flatMap((region) => [region.revenue, region.target]), 1)

  return (
    <svg viewBox={`0 0 ${width} ${height}`} className="chart-svg" role="img" aria-label="Comparativo de ventas por region">
      {regions.map((region, index) => {
        const y = top + index * rowStep
        const revenueWidth = (region.revenue / maxValue) * chartWidth
        const targetWidth = (region.target / maxValue) * chartWidth
        const isSelected = region.id === selectedRegionId

        return (
          <g
            key={region.id}
            onClick={() => onSelectRegion?.(region.id)}
            style={{ cursor: onSelectRegion ? 'pointer' : 'default' }}
            aria-label={`${region.name}: ${formatAttainment(region.performance)} del objetivo`}
          >
            <text
              x="0"
              y={y + 18}
              fontSize="13"
              fontWeight={isSelected ? '700' : '500'}
              fill={isSelected ? region.color : 'rgba(15, 23, 42, 0.68)'}
            >
              {region.name}
            </text>
            <rect x={left} y={y + 3} width={chartWidth} height="20" rx="10" fill="rgba(148, 163, 184, 0.16)" />
            <rect x={left} y={y + 3} width={targetWidth} height="20" rx="10" fill="rgba(15, 23, 42, 0.1)" />
            <rect
              x={left}
              y={y + 3}
              width={revenueWidth}
              height="20"
              rx="10"
              fill={region.color}
              opacity={isSelected ? 1 : 0.9}
            />
            {isSelected ? (
              <rect
                x={left - 5}
                y={y - 1}
                width={chartWidth + 10}
                height="28"
                rx="14"
                fill="none"
                stroke={region.color}
                strokeWidth="1.5"
                opacity="0.75"
              />
            ) : null}
            <text x={left + chartWidth + 10} y={y + 18} fontSize="12" fill="rgba(15, 23, 42, 0.64)">
              {formatAttainment(region.performance)}
            </text>
          </g>
        )
      })}
      <text x={left} y={height - 10} fontSize="12" fill="rgba(15, 23, 42, 0.52)">
        Selecciona una region para actualizar el drill-down.
      </text>
    </svg>
  )
}

function TrendChart({ region }: { region: NormalizedRegion }) {
  const width = 640
  const height = 310
  const left = 26
  const right = 18
  const top = 18
  const bottom = 42
  const chartHeight = height - top - bottom
  const maxValue = Math.max(...region.scaledTrend, ...region.targetTrend, 1)
  const stepX = (width - left - right) / Math.max(region.labels.length - 1, 1)
  const revenuePoints = region.scaledTrend.map((point, index) => ({
    x: left + stepX * index,
    y: top + chartHeight - (point / maxValue) * chartHeight,
  }))
  const targetPoints = region.targetTrend.map((point, index) => ({
    x: left + stepX * index,
    y: top + chartHeight - (point / maxValue) * chartHeight,
  }))
  const areaPath = `${buildPath(revenuePoints)} L ${left + stepX * (revenuePoints.length - 1)} ${height - bottom} L ${left} ${height - bottom} Z`

  return (
    <svg viewBox={`0 0 ${width} ${height}`} className="chart-svg" role="img" aria-label={`Tendencia de ${region.name}`}>
      {[0.25, 0.5, 0.75].map((tick) => (
        <line
          key={tick}
          x1={left}
          x2={width - right}
          y1={top + chartHeight - chartHeight * tick}
          y2={top + chartHeight - chartHeight * tick}
          stroke="rgba(148, 163, 184, 0.32)"
          strokeDasharray="4 10"
        />
      ))}
      <path d={areaPath} fill={`${region.color}1f`} />
      <path
        d={buildPath(targetPoints)}
        fill="none"
        stroke="rgba(15, 23, 42, 0.28)"
        strokeWidth="2.5"
        strokeDasharray="8 8"
      />
      <path
        d={buildPath(revenuePoints)}
        fill="none"
        stroke={region.color}
        strokeWidth="4"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      {revenuePoints.map((point, index) => (
        <g key={`${region.id}-${region.labels[index]}`}>
          <circle cx={point.x} cy={point.y} r="5" fill={region.color} />
          <text x={point.x} y={height - 10} textAnchor="middle" fontSize="12" fill="rgba(15, 23, 42, 0.66)">
            {region.labels[index]}
          </text>
        </g>
      ))}
    </svg>
  )
}

function SubregionBars({ region }: { region: NormalizedRegion }) {
  const rankedSubregions = [...region.subregions].sort((left, right) => right.revenue - left.revenue)
  const maxValue = Math.max(...rankedSubregions.map((subregion) => Math.max(subregion.revenue, subregion.target)), 1)

  return (
    <div className="subregion-list">
      {rankedSubregions.map((subregion) => {
        const delta = subregion.delta
        return (
          <div key={subregion.name} className="subregion-item">
            <div className="subregion-header">
              <div>
                <strong>{subregion.name}</strong>
                <span className="table-note">
                  {subregion.orders.toLocaleString('es-MX')} ordenes · conversion {formatPercent(subregion.conversion)}
                </span>
              </div>
              <span className={delta >= 0 ? 'text-positive' : 'text-warning'}>
                {delta >= 0 ? '+' : ''}
                {formatCompactCurrency(delta)}
              </span>
            </div>
            <div className="subregion-rail">
              <span
                className="subregion-target"
                style={{ width: `${(subregion.target / maxValue) * 100}%` }}
              />
              <span
                className="subregion-value"
                style={{
                  width: `${(subregion.revenue / maxValue) * 100}%`,
                  background: region.color,
                }}
              />
            </div>
            <div className="subregion-footer">
              <span>Ventas {formatCompactCurrency(subregion.revenue)}</span>
              <span>Pipeline {formatCompactCurrency(subregion.pipeline)}</span>
            </div>
          </div>
        )
      })}
    </div>
  )
}

export default function RegionChart({
  regions,
  periodLabel = 'YTD',
  channelLabel,
  activeChannel = 'all',
  selectedRegionId,
  onSelectRegion,
  sectionIds,
  className,
}: RegionChartProps) {
  const normalizedRegions = regions.map(normalizeRegion)
  const rootClassName = className ? `chart-sections ${className}` : 'chart-sections'

  if (!normalizedRegions.length) {
    return (
      <div className={rootClassName}>
        <section id={sectionIds?.overview} className="section-grid">
          <div className="empty-state">
            <h3>No hay regiones para visualizar</h3>
            <p className="detail-copy">
              Ajusta los filtros o vuelve a la vista general para recuperar el comparativo regional.
            </p>
          </div>
        </section>
        <style jsx>{styles}</style>
      </div>
    )
  }

  const selectedRegion =
    normalizedRegions.find((region) => region.id === selectedRegionId) ?? normalizedRegions[0]
  const resolvedChannelLabel = channelLabel ?? CHANNEL_LABELS[activeChannel] ?? 'Vista activa'
  const totalRevenue = sum(normalizedRegions.map((region) => region.revenue))
  const totalTarget = sum(normalizedRegions.map((region) => region.target))
  const totalOrders = sum(normalizedRegions.map((region) => region.orders))
  const totalPipeline = sum(normalizedRegions.map((region) => region.pipeline))
  const averageMargin = normalizedRegions.reduce((total, region) => total + region.margin, 0) / normalizedRegions.length
  const averageTicket = totalOrders > 0 ? Math.round(totalRevenue / totalOrders) : 0
  const bestRegion = normalizedRegions.reduce(
    (best, region) => (region.performance > best.performance ? region : best),
    normalizedRegions[0],
  )
  const focusRegion = normalizedRegions.reduce(
    (focus, region) => (region.performance < focus.performance ? region : focus),
    normalizedRegions[0],
  )
  const focusSubregion =
    [...selectedRegion.subregions].sort((left, right) => left.delta - right.delta)[0] ?? selectedRegion.subregions[0]
  const dominantChannelEntry =
    Object.entries(selectedRegion.channels).sort((left, right) => right[1] - left[1])[0] ?? ['all', 1]
  const dominantChannelKey = dominantChannelEntry[0]
  const attainment = Math.round((totalRevenue / Math.max(totalTarget, 1)) * 100)
  const detailStyle = { '--accent-color': selectedRegion.color } as CSSProperties

  return (
    <div className={rootClassName}>
      <section id={sectionIds?.overview} className="section-grid">
        <div className="section-heading">
          <div>
            <h2>Resumen visual</h2>
            <p>
              Comparativo regional con foco en cumplimiento, margen y capacidad comercial para
              cambiar de contexto sin salir del dashboard.
            </p>
          </div>
          <div className="pill-row">
            <span className="accent-pill">Meta agregada {formatCompactCurrency(totalTarget)}</span>
            <span className={`status-pill ${totalRevenue >= totalTarget ? 'positive' : 'warning'}`}>
              Cumplimiento {attainment}%
            </span>
          </div>
        </div>

        <div className="metrics-grid">
          <article className="metric-card accent">
            <span className="label">Ventas visibles</span>
            <strong className="metric-value">{formatCompactCurrency(totalRevenue)}</strong>
            <span className="metric-detail">
              {normalizedRegions.length} regiones en {resolvedChannelLabel.toLowerCase()}.
            </span>
          </article>
          <article className="metric-card">
            <span className="label">Margen promedio</span>
            <strong className="metric-value">{formatPercent(averageMargin)}</strong>
            <span className="metric-detail">
              Mejor lectura: {bestRegion.name} con {formatPercent(bestRegion.margin)}.
            </span>
          </article>
          <article className="metric-card">
            <span className="label">Ordenes</span>
            <strong className="metric-value">{totalOrders.toLocaleString('es-MX')}</strong>
            <span className="metric-detail">Ticket promedio de {formatCurrency(averageTicket)}.</span>
          </article>
          <article className="metric-card dark">
            <span className="label">Pipeline activo</span>
            <strong className="metric-value">{formatCompactCurrency(totalPipeline)}</strong>
            <span className="metric-detail">Region a vigilar: {focusRegion.name}.</span>
          </article>
        </div>

        <div className="surface-card summary-layout">
          <div className="chart-block">
            <div className="chart-header">
              <div>
                <h3>Ventas vs objetivo por region</h3>
                <p className="table-note">
                  El comparativo resalta brechas y actualiza el drill-down al seleccionar una region.
                </p>
              </div>
              <span className="selection-pill">{periodLabel}</span>
            </div>
            <PerformanceChart
              regions={normalizedRegions}
              selectedRegionId={selectedRegion.id}
              onSelectRegion={onSelectRegion}
            />
            <div className="chart-legend">
              <span>
                <span className="legend-dot neutral" />
                Objetivo
              </span>
              <span>
                <span className="legend-dot" style={{ background: selectedRegion.color }} />
                Ventas actuales
              </span>
            </div>
          </div>

          <aside className="surface-card sidebar-card" style={detailStyle}>
            <div className="detail-header">
              <div>
                <h3>Senales del portafolio</h3>
                <p className="table-note">
                  Resumen para la reunion semanal con foco en la region seleccionada.
                </p>
              </div>
            </div>
            <div className="detail-list">
              <div className="detail-stat">
                <span className="label">Region lider</span>
                <strong className="detail-number">{bestRegion.name}</strong>
                <span className="detail-copy">
                  {formatAttainment(bestRegion.performance)} del plan y margen de {formatPercent(bestRegion.margin)}.
                </span>
              </div>
              <div className="detail-stat">
                <span className="label">Riesgo inmediato</span>
                <strong className="detail-number">{focusRegion.name}</strong>
                <span className="detail-copy">
                  Requiere cerrar brecha de {formatCompactCurrency(Math.abs(focusRegion.target - focusRegion.revenue))}.
                </span>
              </div>
              <div className="detail-stat">
                <span className="label">Foco del drill-down</span>
                <strong className="detail-number">{selectedRegion.name}</strong>
                <span className="detail-copy">
                  Manager: {selectedRegion.manager}. Categoria dominante: {CHANNEL_LABELS[dominantChannelKey] ?? dominantChannelKey}.
                </span>
              </div>
            </div>
          </aside>
        </div>
      </section>

      <section id={sectionIds?.regions} className="section-grid">
        <div className="section-heading">
          <div>
            <h2>Navegacion regional</h2>
            <p>
              Las tarjetas mantienen visible el contexto comercial y permiten cambiar de region
              para profundizar en tendencia, mix y alertas.
            </p>
          </div>
        </div>

        <div className="regions-grid">
          {normalizedRegions.map((region) => {
            const regionStyle = { '--region-accent': region.color } as CSSProperties
            return (
              <article
                key={region.id}
                className={`region-card ${selectedRegion.id === region.id ? 'active' : ''}`}
                style={regionStyle}
              >
                <button
                  type="button"
                  className="region-select"
                  onClick={() => onSelectRegion?.(region.id)}
                  aria-pressed={selectedRegion.id === region.id}
                >
                  <div className="region-topline">
                    <div>
                      <div className="label">{region.manager}</div>
                      <strong className="region-figure">{region.name}</strong>
                    </div>
                    <span className={`status-pill ${region.performance >= 1 ? 'positive' : 'warning'}`}>
                      {formatAttainment(region.performance)}
                    </span>
                  </div>
                  <div className="region-meta">
                    Ventas {formatCompactCurrency(region.revenue)} · Pipeline {formatCompactCurrency(region.pipeline)}
                  </div>
                  <div className="mini-progress">
                    <span
                      style={{
                        width: `${clamp(region.performance * 100, 0, 100)}%`,
                        background: region.color,
                      }}
                    />
                  </div>
                  <div className="subregion-row">
                    <span className="label">Margen {formatPercent(region.margin)}</span>
                    <span className="label">{region.subregions.length} subregiones</span>
                  </div>
                </button>
              </article>
            )
          })}
        </div>
      </section>

      <section id={sectionIds?.drilldown} className="section-grid">
        <div className="section-heading">
          <div>
            <h2>Drill-down regional</h2>
            <p>
              La seleccion activa alimenta la tendencia, el mix y las alertas para dar una lectura
              accionable del territorio.
            </p>
          </div>
          <div className="pill-row">
            <span className={`status-pill ${selectedRegion.performance >= 1 ? 'positive' : 'warning'}`}>
              {selectedRegion.name} {formatAttainment(selectedRegion.performance)}
            </span>
            <span className="accent-pill">{resolvedChannelLabel}</span>
          </div>
        </div>

        <div className="detail-layout">
          <article className="detail-card" style={detailStyle}>
            <div className="chart-header">
              <div>
                <h3>Tendencia de {selectedRegion.name}</h3>
                <p className="table-note">Linea de ventas contra objetivo ajustada al periodo visible.</p>
              </div>
              <span className="selection-pill">{periodLabel}</span>
            </div>
            <TrendChart region={selectedRegion} />
            <div className="chart-legend">
              <span>
                <span className="legend-dot" style={{ background: selectedRegion.color }} />
                Ventas
              </span>
              <span>
                <span className="legend-dot neutral-strong" />
                Objetivo
              </span>
            </div>
          </article>

          <article className="detail-card" style={detailStyle}>
            <div className="detail-header">
              <div>
                <h3>Lectura tactica</h3>
                <p className="table-note">
                  El filtro visible modifica el enfasis del mix y ayuda a anticipar el proximo ajuste operativo.
                </p>
              </div>
            </div>
            <div className="detail-stats">
              <div className="detail-stat">
                <span className="label">Ticket promedio</span>
                <strong className="detail-number">{formatCompactCurrency(selectedRegion.avgTicket)}</strong>
              </div>
              <div className="detail-stat">
                <span className="label">Ordenes</span>
                <strong className="detail-number">{selectedRegion.orders.toLocaleString('es-MX')}</strong>
              </div>
              <div className="detail-stat">
                <span className="label">Pipeline</span>
                <strong className="detail-number">{formatCompactCurrency(selectedRegion.pipeline)}</strong>
              </div>
            </div>
            <p className="footnote">
              El mix actual favorece {CHANNEL_LABELS[dominantChannelKey] ?? dominantChannelKey} y el foco operativo esta en{' '}
              {focusSubregion?.name ?? 'la subregion con mayor brecha'}.
            </p>

            <div className="detail-header with-margin">
              <div>
                <h3>Mix del portafolio</h3>
                <p className="table-note">Participacion base de la region y enfasis del filtro seleccionado.</p>
              </div>
            </div>
            <div className="mix-list">
              {Object.entries(selectedRegion.channels).map(([key, value]) => (
                <div key={key}>
                  <div className="mix-row">
                    <span className="mix-label">{CHANNEL_LABELS[key] ?? key}</span>
                    <span className="mix-label">{Math.round(value * 100)}%</span>
                  </div>
                  <div className="mix-progress">
                    <span
                      style={{
                        width: `${value * 100}%`,
                        background:
                          activeChannel === key || activeChannel === 'all'
                            ? `linear-gradient(90deg, ${selectedRegion.color}, #9cd3ca)`
                            : 'linear-gradient(90deg, rgba(15,23,42,0.18), rgba(15,23,42,0.08))',
                      }}
                    />
                  </div>
                </div>
              ))}
            </div>
          </article>
        </div>

        <div className="details-grid">
          <article className="detail-card" style={detailStyle}>
            <div className="detail-header">
              <div>
                <h3>Subregiones prioritarias</h3>
                <p className="table-note">Comparativo local para ubicar focos de volumen y brecha comercial.</p>
              </div>
            </div>
            <SubregionBars region={selectedRegion} />
          </article>

          <article className="detail-card" style={detailStyle}>
            <div className="detail-header">
              <div>
                <h3>Cuentas clave y alertas</h3>
                <p className="table-note">Lectura rapida para forecast, seguimiento y conversacion comercial.</p>
              </div>
            </div>

            <div className="account-list">
              {selectedRegion.accounts.map((account) => (
                <div key={account.name} className="detail-stat compact">
                  <div className="account-row">
                    <strong>{account.name}</strong>
                    <span className={account.delta >= 0 ? 'text-positive' : 'text-warning'}>
                      {account.delta >= 0 ? '+' : ''}
                      {account.delta}%
                    </span>
                  </div>
                  <div className="account-meta">
                    {account.segment} · {formatCompactCurrency(account.revenue)}
                  </div>
                </div>
              ))}
            </div>

            <ul className="alert-list">
              {selectedRegion.alerts.map((alert) => (
                <li key={alert} className="alert-item">
                  <span className="alert-dot" />
                  <span>{alert}</span>
                </li>
              ))}
            </ul>
          </article>
        </div>
      </section>

      <style jsx>{styles}</style>
    </div>
  )
}

const styles = `
  .chart-sections {
    display: grid;
    gap: 1.5rem;
    color: #0f172a;
  }

  .section-grid {
    display: grid;
    gap: 1rem;
  }

  .section-heading,
  .chart-header,
  .detail-header {
    display: flex;
    align-items: flex-start;
    justify-content: space-between;
    gap: 1rem;
  }

  .section-heading h2,
  .chart-header h3,
  .detail-header h3 {
    margin: 0;
    font-size: 1.1rem;
    line-height: 1.2;
  }

  .section-heading p,
  .chart-header p,
  .detail-header p,
  .table-note,
  .detail-copy,
  .footnote {
    margin: 0.35rem 0 0;
    color: rgba(15, 23, 42, 0.72);
    font-size: 0.94rem;
    line-height: 1.5;
  }

  .pill-row {
    display: flex;
    flex-wrap: wrap;
    gap: 0.65rem;
    justify-content: flex-end;
  }

  .accent-pill,
  .status-pill,
  .selection-pill {
    display: inline-flex;
    align-items: center;
    justify-content: center;
    border-radius: 999px;
    padding: 0.45rem 0.8rem;
    font-size: 0.8rem;
    font-weight: 700;
    letter-spacing: 0.01em;
    white-space: nowrap;
  }

  .accent-pill {
    background: rgba(226, 122, 69, 0.12);
    color: #9a4f1d;
  }

  .selection-pill {
    background: rgba(15, 23, 42, 0.08);
    color: rgba(15, 23, 42, 0.78);
  }

  .status-pill {
    background: rgba(15, 23, 42, 0.08);
    color: rgba(15, 23, 42, 0.78);
  }

  .status-pill.positive {
    background: rgba(22, 163, 74, 0.14);
    color: #166534;
  }

  .status-pill.warning {
    background: rgba(234, 88, 12, 0.14);
    color: #9a3412;
  }

  .metrics-grid,
  .regions-grid,
  .details-grid {
    display: grid;
    gap: 1rem;
  }

  .metrics-grid {
    grid-template-columns: repeat(4, minmax(0, 1fr));
  }

  .metric-card,
  .surface-card,
  .detail-card,
  .region-card,
  .empty-state {
    border: 1px solid rgba(148, 163, 184, 0.26);
    border-radius: 24px;
    background:
      radial-gradient(circle at top right, rgba(255, 255, 255, 0.72), transparent 36%),
      linear-gradient(180deg, rgba(255, 255, 255, 0.96), rgba(248, 250, 252, 0.94));
    box-shadow: 0 18px 40px rgba(15, 23, 42, 0.06);
  }

  .metric-card,
  .detail-card,
  .empty-state {
    padding: 1.2rem;
  }

  .metric-card {
    display: grid;
    gap: 0.5rem;
    min-height: 148px;
  }

  .metric-card.accent {
    background:
      radial-gradient(circle at top right, rgba(226, 122, 69, 0.18), transparent 40%),
      linear-gradient(180deg, rgba(255, 255, 255, 0.98), rgba(255, 248, 243, 0.98));
  }

  .metric-card.dark {
    background:
      radial-gradient(circle at top right, rgba(45, 143, 133, 0.18), transparent 40%),
      linear-gradient(180deg, rgba(244, 251, 249, 0.98), rgba(240, 249, 255, 0.98));
  }

  .label {
    font-size: 0.8rem;
    font-weight: 700;
    letter-spacing: 0.03em;
    text-transform: uppercase;
    color: rgba(15, 23, 42, 0.56);
  }

  .metric-value,
  .detail-number,
  .region-figure {
    font-size: 1.6rem;
    line-height: 1.1;
  }

  .metric-detail,
  .account-meta,
  .subregion-footer,
  .region-meta {
    color: rgba(15, 23, 42, 0.68);
    font-size: 0.92rem;
    line-height: 1.45;
  }

  .summary-layout {
    grid-template-columns: minmax(0, 1.75fr) minmax(300px, 0.95fr);
    padding: 1rem;
  }

  .surface-card {
    display: grid;
    gap: 1rem;
  }

  .chart-block {
    display: grid;
    gap: 1rem;
  }

  .chart-svg {
    width: 100%;
    height: auto;
    display: block;
  }

  .chart-legend {
    display: flex;
    flex-wrap: wrap;
    gap: 1rem;
    color: rgba(15, 23, 42, 0.68);
    font-size: 0.88rem;
  }

  .chart-legend span {
    display: inline-flex;
    align-items: center;
    gap: 0.45rem;
  }

  .legend-dot {
    width: 0.7rem;
    height: 0.7rem;
    border-radius: 999px;
    display: inline-block;
    background: rgba(15, 23, 42, 0.16);
  }

  .legend-dot.neutral {
    background: rgba(15, 23, 42, 0.14);
  }

  .legend-dot.neutral-strong {
    background: rgba(15, 23, 42, 0.28);
  }

  .sidebar-card::before,
  .detail-card::before {
    content: '';
    position: absolute;
    inset: 0 auto auto 0;
    width: 100%;
    height: 4px;
    background: linear-gradient(90deg, var(--accent-color, rgba(45, 143, 133, 0.4)), rgba(255, 255, 255, 0));
    border-top-left-radius: 24px;
    border-top-right-radius: 24px;
  }

  .sidebar-card,
  .detail-card {
    position: relative;
    overflow: hidden;
  }

  .detail-list,
  .detail-stats,
  .mix-list,
  .account-list,
  .subregion-list {
    display: grid;
    gap: 0.85rem;
  }

  .detail-stat {
    display: grid;
    gap: 0.35rem;
    padding: 0.95rem;
    border-radius: 18px;
    background: rgba(255, 255, 255, 0.72);
    border: 1px solid rgba(148, 163, 184, 0.18);
  }

  .detail-stat.compact {
    padding: 0.85rem 0.95rem;
  }

  .regions-grid {
    grid-template-columns: repeat(4, minmax(0, 1fr));
  }

  .region-card {
    padding: 0;
    overflow: hidden;
    transition: transform 160ms ease, box-shadow 160ms ease, border-color 160ms ease;
  }

  .region-card.active {
    border-color: var(--region-accent);
    box-shadow: 0 18px 44px rgba(15, 23, 42, 0.1);
    transform: translateY(-2px);
  }

  .region-select {
    width: 100%;
    border: 0;
    background: transparent;
    padding: 1.1rem;
    text-align: left;
    cursor: pointer;
    display: grid;
    gap: 0.8rem;
    font: inherit;
    color: inherit;
  }

  .region-topline,
  .subregion-row,
  .mix-row,
  .account-row,
  .subregion-header,
  .subregion-footer {
    display: flex;
    align-items: center;
    justify-content: space-between;
    gap: 0.75rem;
  }

  .mini-progress,
  .mix-progress,
  .subregion-rail {
    position: relative;
    height: 0.6rem;
    border-radius: 999px;
    background: rgba(148, 163, 184, 0.18);
    overflow: hidden;
  }

  .mini-progress span,
  .mix-progress span,
  .subregion-target,
  .subregion-value {
    position: absolute;
    inset: 0 auto 0 0;
    border-radius: inherit;
  }

  .subregion-target {
    background: rgba(15, 23, 42, 0.14);
  }

  .subregion-value {
    opacity: 0.95;
  }

  .detail-layout {
    display: grid;
    grid-template-columns: minmax(0, 1.35fr) minmax(320px, 0.95fr);
    gap: 1rem;
  }

  .detail-stats {
    grid-template-columns: repeat(3, minmax(0, 1fr));
  }

  .footnote {
    padding: 0.95rem 1rem;
    border-radius: 18px;
    background: rgba(15, 23, 42, 0.04);
  }

  .with-margin {
    margin-top: 1.2rem;
  }

  .mix-label {
    font-size: 0.92rem;
    color: rgba(15, 23, 42, 0.72);
  }

  .details-grid {
    grid-template-columns: repeat(2, minmax(0, 1fr));
  }

  .subregion-item {
    display: grid;
    gap: 0.55rem;
    padding: 0.95rem 1rem;
    border-radius: 18px;
    background: rgba(255, 255, 255, 0.72);
    border: 1px solid rgba(148, 163, 184, 0.18);
  }

  .text-positive {
    color: #166534;
    font-weight: 700;
  }

  .text-warning {
    color: #b45309;
    font-weight: 700;
  }

  .alert-list {
    list-style: none;
    padding: 0;
    margin: 1rem 0 0;
    display: grid;
    gap: 0.8rem;
  }

  .alert-item {
    display: grid;
    grid-template-columns: auto 1fr;
    gap: 0.65rem;
    align-items: start;
    color: rgba(15, 23, 42, 0.76);
  }

  .alert-dot {
    width: 0.65rem;
    height: 0.65rem;
    border-radius: 999px;
    margin-top: 0.35rem;
    background: var(--accent-color, #2d8f85);
  }

  .empty-state {
    min-height: 220px;
    place-items: center;
    text-align: center;
    display: grid;
  }

  @media (max-width: 1120px) {
    .metrics-grid,
    .regions-grid {
      grid-template-columns: repeat(2, minmax(0, 1fr));
    }

    .summary-layout,
    .detail-layout,
    .details-grid {
      grid-template-columns: 1fr;
    }
  }

  @media (max-width: 760px) {
    .metrics-grid,
    .regions-grid,
    .detail-stats,
    .details-grid {
      grid-template-columns: 1fr;
    }

    .section-heading,
    .chart-header,
    .detail-header,
    .subregion-header,
    .subregion-footer {
      flex-direction: column;
      align-items: flex-start;
    }

    .pill-row {
      justify-content: flex-start;
    }

    .metric-value,
    .detail-number,
    .region-figure {
      font-size: 1.35rem;
    }
  }
`
