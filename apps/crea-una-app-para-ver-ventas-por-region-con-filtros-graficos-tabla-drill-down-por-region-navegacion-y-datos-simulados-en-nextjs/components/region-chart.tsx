'use client'

import {
  CHANNELS,
  formatCompactCurrency,
  formatCurrency,
  formatPercent,
  type ChannelKey,
  type DerivedRegion,
} from '../lib/mock-data'

type RegionChartProps = {
  regions: DerivedRegion[]
  periodLabel: string
  channelLabel: string
  activeChannel: ChannelKey
  selectedRegionId: string
  onSelectRegion: (regionId: string) => void
  sectionIds?: {
    overview?: string
    regions?: string
    drilldown?: string
  }
  className?: string
}

function sum(values: number[]) {
  return values.reduce((total, current) => total + current, 0)
}

function buildPath(points: { x: number; y: number }[]) {
  return points.map((point, index) => `${index === 0 ? 'M' : 'L'} ${point.x} ${point.y}`).join(' ')
}

function PerformanceChart({
  regions,
  selectedRegionId,
  onSelectRegion,
}: {
  regions: DerivedRegion[]
  selectedRegionId: string
  onSelectRegion: (regionId: string) => void
}) {
  const width = 620
  const height = 280
  const left = 74
  const right = 18
  const top = 18
  const bottom = 34
  const barStep = (height - top - bottom) / regions.length
  const maxValue = Math.max(...regions.flatMap((region) => [region.revenue, region.target]), 1)
  const chartWidth = width - left - right

  return (
    <svg viewBox={`0 0 ${width} ${height}`} className="chart-svg" role="img" aria-label="Comparativo de ventas por región">
      {regions.map((region, index) => {
        const y = top + index * barStep
        const revenueWidth = (region.revenue / maxValue) * chartWidth
        const targetWidth = (region.target / maxValue) * chartWidth
        const isSelected = region.id === selectedRegionId

        return (
          <g
            key={region.id}
            onClick={() => onSelectRegion(region.id)}
            style={{ cursor: 'pointer' }}
            aria-label={`${region.name}: ${Math.round(region.performance * 100)}% del objetivo`}
          >
            <text x="0" y={y + 18} fontSize="13" fill={isSelected ? region.color : 'rgba(23, 49, 63, 0.72)'}>
              {region.name}
            </text>
            <rect
              x={left}
              y={y + 4}
              width={chartWidth}
              height="18"
              rx="9"
              fill="rgba(23, 49, 63, 0.06)"
            />
            <rect
              x={left}
              y={y + 4}
              width={targetWidth}
              height="18"
              rx="9"
              fill="rgba(23, 49, 63, 0.12)"
            />
            <rect
              x={left}
              y={y + 4}
              width={revenueWidth}
              height="18"
              rx="9"
              fill={region.color}
              opacity={isSelected ? 1 : 0.88}
            />
            {isSelected ? (
              <rect
                x={left - 4}
                y={y}
                width={chartWidth + 8}
                height="26"
                rx="13"
                fill="none"
                stroke={region.color}
                strokeWidth="1.5"
                opacity="0.7"
              />
            ) : null}
            <text x={left + chartWidth + 10} y={y + 18} fontSize="12" fill="rgba(23, 49, 63, 0.72)">
              {Math.round(region.performance * 100)}%
            </text>
          </g>
        )
      })}
      <text x={left} y={height - 8} fontSize="12" fill="rgba(23, 49, 63, 0.5)">
        Selecciona una región para actualizar el drill-down.
      </text>
    </svg>
  )
}

function TrendChart({ region }: { region: DerivedRegion }) {
  const width = 620
  const height = 300
  const left = 28
  const right = 16
  const top = 20
  const bottom = 34
  const maxValue = Math.max(...region.scaledTrend, ...region.targetTrend, 1)
  const stepX = (width - left - right) / Math.max(region.labels.length - 1, 1)
  const chartHeight = height - top - bottom
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
          stroke="rgba(23, 49, 63, 0.08)"
          strokeDasharray="4 8"
        />
      ))}
      <path d={areaPath} fill={`${region.color}22`} />
      <path
        d={buildPath(targetPoints)}
        fill="none"
        stroke="rgba(23, 49, 63, 0.25)"
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
        <g key={region.labels[index]}>
          <circle cx={point.x} cy={point.y} r="5" fill={region.color} />
          <text x={point.x} y={height - 8} textAnchor="middle" fontSize="12" fill="rgba(23, 49, 63, 0.72)">
            {region.labels[index]}
          </text>
        </g>
      ))}
    </svg>
  )
}

export default function RegionChart({
  regions,
  periodLabel,
  channelLabel,
  activeChannel,
  selectedRegionId,
  onSelectRegion,
  sectionIds,
  className,
}: RegionChartProps) {
  const rootClassName = className ? `chart-sections ${className}` : 'chart-sections'

  if (!regions.length) {
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
      </div>
    )
  }

  const selectedRegion =
    regions.find((region) => region.id === selectedRegionId) ??
    regions[0]
  const totalRevenue = sum(regions.map((region) => region.revenue))
  const totalTarget = sum(regions.map((region) => region.target))
  const totalOrders = sum(regions.map((region) => region.orders))
  const totalPipeline = sum(regions.map((region) => region.pipeline))
  const averageMargin = regions.reduce((total, region) => total + region.margin, 0) / regions.length
  const averageTicket = totalOrders > 0 ? Math.round(totalRevenue / totalOrders) : 0
  const bestRegion = regions.reduce(
    (best, region) => (region.performance > best.performance ? region : best),
    regions[0],
  )
  const focusRegion = regions.reduce(
    (focus, region) => (region.performance < focus.performance ? region : focus),
    regions[0],
  )
  const focusSubregion =
    [...selectedRegion.subregions].sort((left, right) => left.delta - right.delta)[0] ??
    selectedRegion.subregions[0]
  const dominantChannelEntry =
    Object.entries(selectedRegion.channels).sort((left, right) => right[1] - left[1])[0] ??
    ['all', 1]
  const dominantChannelKey = dominantChannelEntry[0] as keyof typeof CHANNELS
  const attainment = Math.round((totalRevenue / Math.max(totalTarget, 1)) * 100)

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
              {regions.length} regiones en {channelLabel.toLowerCase()}.
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
            <span className="label">Órdenes</span>
            <strong className="metric-value">{totalOrders.toLocaleString('es-MX')}</strong>
            <span className="metric-detail">
              Ticket promedio de {formatCurrency(averageTicket)}.
            </span>
          </article>
          <article className="metric-card dark">
            <span className="label">Pipeline activo</span>
            <strong className="metric-value">{formatCompactCurrency(totalPipeline)}</strong>
            <span className="metric-detail">
              Región a vigilar: {focusRegion.name}.
            </span>
          </article>
        </div>

        <div className="surface-card summary-layout">
          <div className="chart-block">
            <div className="chart-header">
              <div>
                <h3>Ventas vs objetivo por región</h3>
                <p className="table-note">
                  El comparativo resalta brechas y actualiza el drill-down al seleccionar una región.
                </p>
              </div>
              <span className="selection-pill">{periodLabel}</span>
            </div>
            <PerformanceChart
              regions={regions}
              selectedRegionId={selectedRegion.id}
              onSelectRegion={onSelectRegion}
            />
            <div className="chart-legend">
              <span>
                <span className="legend-dot" style={{ background: 'rgba(23, 49, 63, 0.12)' }} />
                Objetivo
              </span>
              <span>
                <span className="legend-dot" style={{ background: selectedRegion.color }} />
                Ventas actuales
              </span>
            </div>
          </div>

          <aside className="surface-card" style={{ padding: 20 }}>
            <div className="detail-header">
              <div>
                <h3>Señales del portafolio</h3>
                <p className="table-note">
                  Resumen para la reunión semanal con foco en la región seleccionada.
                </p>
              </div>
            </div>
            <div className="detail-list">
              <div className="detail-stat">
                <span className="label">Región líder</span>
                <strong className="detail-number">{bestRegion.name}</strong>
                <span className="detail-copy">
                  {Math.round(bestRegion.performance * 100)}% del plan y margen de {formatPercent(bestRegion.margin)}.
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
                  Manager: {selectedRegion.manager}. Mejor canal base: {CHANNELS[dominantChannelKey].label}.
                </span>
              </div>
            </div>
          </aside>
        </div>
      </section>

      <section id={sectionIds?.regions} className="section-grid">
        <div className="section-heading">
          <div>
            <h2>Navegación regional</h2>
            <p>
              Las tarjetas mantienen visible el contexto comercial y permiten cambiar de región
              para profundizar en tendencia, mix y alertas.
            </p>
          </div>
        </div>

        <div className="regions-grid">
          {regions.map((region) => (
            <article key={region.id} className={`region-card ${selectedRegion.id === region.id ? 'active' : ''}`}>
              <button type="button" className="region-select" onClick={() => onSelectRegion(region.id)}>
                <div className="region-topline">
                  <div>
                    <div className="label">{region.manager}</div>
                    <strong className="region-figure">{region.name}</strong>
                  </div>
                  <span className={`status-pill ${region.performance >= 1 ? 'positive' : 'warning'}`}>
                    {Math.round(region.performance * 100)}%
                  </span>
                </div>
                <div className="region-meta">
                  Ventas {formatCompactCurrency(region.revenue)} · Pipeline {formatCompactCurrency(region.pipeline)}
                </div>
                <div className="mini-progress">
                  <span
                    style={{
                      width: `${Math.min(region.performance * 100, 100)}%`,
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
          ))}
        </div>
      </section>

      <section id={sectionIds?.drilldown} className="section-grid">
        <div className="section-heading">
          <div>
            <h2>Drill-down regional</h2>
            <p>
              La selección activa alimenta la tendencia, el mix y las alertas para dar una lectura
              accionable del territorio.
            </p>
          </div>
          <div className="pill-row">
            <span className={`status-pill ${selectedRegion.performance >= 1 ? 'positive' : 'warning'}`}>
              {selectedRegion.name} {Math.round(selectedRegion.performance * 100)}%
            </span>
            <span className="accent-pill">{channelLabel}</span>
          </div>
        </div>

        <div className="detail-layout">
          <article className="detail-card">
            <div className="chart-header">
              <div>
                <h3>Tendencia de {selectedRegion.name}</h3>
                <p className="table-note">
                  Línea de ventas contra objetivo ajustada al periodo visible.
                </p>
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
                <span className="legend-dot" style={{ background: 'rgba(23, 49, 63, 0.28)' }} />
                Objetivo
              </span>
            </div>
          </article>

          <article className="detail-card">
            <div className="detail-header">
              <div>
                <h3>Lectura táctica</h3>
                <p className="table-note">
                  El canal visible modifica el énfasis del mix y ayuda a anticipar el próximo ajuste operativo.
                </p>
              </div>
            </div>
            <div className="detail-stats">
              <div className="detail-stat">
                <span className="label">Ticket promedio</span>
                <strong className="detail-number">{formatCompactCurrency(selectedRegion.avgTicket)}</strong>
              </div>
              <div className="detail-stat">
                <span className="label">Órdenes</span>
                <strong className="detail-number">{selectedRegion.orders.toLocaleString('es-MX')}</strong>
              </div>
              <div className="detail-stat">
                <span className="label">Pipeline</span>
                <strong className="detail-number">{formatCompactCurrency(selectedRegion.pipeline)}</strong>
              </div>
            </div>
            <p className="footnote">
              El mix actual favorece {CHANNELS[dominantChannelKey].label} y el foco operativo está en{' '}
              {focusSubregion?.name ?? selectedRegion.subregions[0]?.name}.
            </p>

            <div className="detail-header" style={{ marginTop: 24 }}>
              <div>
                <h3>Mix de canales</h3>
                <p className="table-note">
                  Participación base de la región y énfasis del filtro seleccionado.
                </p>
              </div>
            </div>
            <div className="mix-list">
              {Object.entries(selectedRegion.channels).map(([key, value]) => (
                <div key={key}>
                  <div className="mix-row">
                    <span className="mix-label">{CHANNELS[key as keyof typeof CHANNELS].label}</span>
                    <span className="mix-label">{Math.round(value * 100)}%</span>
                  </div>
                  <div className="mix-progress">
                    <span
                      style={{
                        width: `${value * 100}%`,
                        background:
                          activeChannel === key || activeChannel === 'all'
                            ? `linear-gradient(90deg, ${selectedRegion.color}, #9ad7cf)`
                            : 'linear-gradient(90deg, rgba(23,49,63,0.18), rgba(23,49,63,0.08))',
                      }}
                    />
                  </div>
                </div>
              ))}
            </div>
          </article>
        </div>

        <div className="details-grid split">
          <article className="detail-card">
            <div className="detail-header">
              <div>
                <h3>Cuentas clave</h3>
                <p className="table-note">
                  Las tres cuentas con mayor impacto dentro del territorio seleccionado.
                </p>
              </div>
            </div>
            <div className="account-list">
              {selectedRegion.accounts.map((account) => (
                <div key={account.name} className="detail-stat">
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
          </article>

          <article className="detail-card">
            <div className="detail-header">
              <div>
                <h3>Alertas y notas</h3>
                <p className="table-note">
                  Recomendaciones y señales de seguimiento para la reunión de forecast.
                </p>
              </div>
            </div>
            <ul className="alert-list">
              {selectedRegion.alerts.map((alert) => (
                <li key={alert} className="alert-item">
                  <span>•</span>
                  <span>{alert}</span>
                </li>
              ))}
            </ul>
          </article>
        </div>
      </section>
    </div>
  )
}
