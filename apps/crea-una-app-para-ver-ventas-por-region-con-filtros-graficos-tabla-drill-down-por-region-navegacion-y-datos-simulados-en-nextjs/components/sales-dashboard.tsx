'use client'

import { useEffect, useState } from 'react'

const MONTHS = ['Ene', 'Feb', 'Mar', 'Abr', 'May', 'Jun']

const PERIODS = {
  q1: { label: 'Q1', factor: 0.46, indices: [0, 1, 2] },
  q2: { label: 'Q2', factor: 0.54, indices: [3, 4, 5] },
  ytd: { label: 'YTD', factor: 1, indices: [0, 1, 2, 3, 4, 5] },
}

const CHANNELS = {
  all: { label: 'Todos los canales', factor: 1, emphasis: 1 },
  online: { label: 'Online', factor: 0.36, emphasis: 1.04 },
  retail: { label: 'Retail', factor: 0.41, emphasis: 0.97 },
  partners: { label: 'Partners', factor: 0.23, emphasis: 1.11 },
}

const HEALTH = {
  all: { label: 'Todas las regiones' },
  ahead: { label: 'Sólo arriba del objetivo' },
  watch: { label: 'Sólo en seguimiento' },
}

const NAV_ITEMS = [
  { id: 'overview', label: 'Resumen' },
  { id: 'regions', label: 'Regiones' },
  { id: 'table', label: 'Tabla' },
  { id: 'drilldown', label: 'Drill-down' },
]

const REGIONS = [
  {
    id: 'north',
    name: 'Norte',
    manager: 'Ana Suárez',
    color: '#E27A45',
    target: 9800000,
    margin: 32.4,
    orders: 1840,
    trend: [1480000, 1560000, 1610000, 1730000, 1820000, 1940000],
    channels: { online: 0.39, retail: 0.37, partners: 0.24 },
    subregions: [
      { name: 'Monterrey', revenue: 3920000, target: 3680000, orders: 690, conversion: 28.2, pipeline: 1140000 },
      { name: 'Saltillo', revenue: 2240000, target: 2360000, orders: 415, conversion: 23.8, pipeline: 820000 },
      { name: 'Chihuahua', revenue: 1930000, target: 1820000, orders: 352, conversion: 25.1, pipeline: 610000 },
      { name: 'Tijuana', revenue: 1510000, target: 1480000, orders: 283, conversion: 21.3, pipeline: 480000 },
    ],
    accounts: [
      { name: 'Grupo Atlas', segment: 'Enterprise', revenue: 1280000, delta: 14 },
      { name: 'Retail Nova', segment: 'Mid-market', revenue: 860000, delta: 8 },
      { name: 'Distribuciones Roca', segment: 'Partners', revenue: 640000, delta: -3 },
    ],
    alerts: [
      'Saltillo muestra menor conversión en retail frente al plan.',
      'El inventario en Tijuana se normaliza, pero sigue por debajo del ritmo de mayo.',
    ],
  },
  {
    id: 'central',
    name: 'Centro',
    manager: 'Carlos Pérez',
    color: '#2D8F85',
    target: 11300000,
    margin: 29.7,
    orders: 2165,
    trend: [1640000, 1710000, 1780000, 1840000, 1970000, 2050000],
    channels: { online: 0.34, retail: 0.45, partners: 0.21 },
    subregions: [
      { name: 'CDMX', revenue: 4250000, target: 4380000, orders: 792, conversion: 30.5, pipeline: 1480000 },
      { name: 'Puebla', revenue: 2330000, target: 2160000, orders: 452, conversion: 27.1, pipeline: 760000 },
      { name: 'Querétaro', revenue: 2090000, target: 2020000, orders: 403, conversion: 24.6, pipeline: 720000 },
      { name: 'Toluca', revenue: 1780000, target: 1900000, orders: 351, conversion: 22.5, pipeline: 590000 },
    ],
    accounts: [
      { name: 'Mercado Capital', segment: 'Enterprise', revenue: 1420000, delta: 6 },
      { name: 'Farmacias Uno', segment: 'Retail', revenue: 980000, delta: -2 },
      { name: 'Servicios Plaza', segment: 'SMB', revenue: 760000, delta: 11 },
    ],
    alerts: [
      'CDMX sostiene volumen, pero el ticket promedio cayó frente a abril.',
      'Toluca requiere acelerar partners para cerrar la brecha contra objetivo.',
    ],
  },
  {
    id: 'south',
    name: 'Sur',
    manager: 'María Nolasco',
    color: '#869C50',
    target: 8600000,
    margin: 35.1,
    orders: 1595,
    trend: [1190000, 1270000, 1320000, 1380000, 1460000, 1510000],
    channels: { online: 0.42, retail: 0.31, partners: 0.27 },
    subregions: [
      { name: 'Mérida', revenue: 2460000, target: 2360000, orders: 470, conversion: 32.4, pipeline: 880000 },
      { name: 'Tuxtla', revenue: 1790000, target: 1840000, orders: 314, conversion: 26.7, pipeline: 540000 },
      { name: 'Oaxaca', revenue: 1640000, target: 1580000, orders: 299, conversion: 24.2, pipeline: 490000 },
      { name: 'Cancún', revenue: 1410000, target: 1320000, orders: 262, conversion: 28.8, pipeline: 510000 },
    ],
    accounts: [
      { name: 'Hotelaria Azul', segment: 'Enterprise', revenue: 940000, delta: 17 },
      { name: 'Cadena Sol', segment: 'Retail', revenue: 690000, delta: 10 },
      { name: 'Mayab Connect', segment: 'Partners', revenue: 610000, delta: 5 },
    ],
    alerts: [
      'Tuxtla necesita más cobertura comercial en partners para junio.',
      'Mérida lidera margen y absorbe mejor el crecimiento online.',
    ],
  },
  {
    id: 'west',
    name: 'Oeste',
    manager: 'Diego Ramírez',
    color: '#7B5BE6',
    target: 9200000,
    margin: 30.8,
    orders: 1710,
    trend: [1360000, 1420000, 1470000, 1540000, 1600000, 1680000],
    channels: { online: 0.37, retail: 0.4, partners: 0.23 },
    subregions: [
      { name: 'Guadalajara', revenue: 3210000, target: 3340000, orders: 592, conversion: 27.3, pipeline: 1080000 },
      { name: 'León', revenue: 2010000, target: 1940000, orders: 382, conversion: 25.4, pipeline: 640000 },
      { name: 'Culiacán', revenue: 1770000, target: 1710000, orders: 319, conversion: 23.8, pipeline: 520000 },
      { name: 'La Paz', revenue: 1330000, target: 1340000, orders: 248, conversion: 20.9, pipeline: 430000 },
    ],
    accounts: [
      { name: 'Consumax', segment: 'Retail', revenue: 1040000, delta: 4 },
      { name: 'Logística Horizonte', segment: 'Enterprise', revenue: 840000, delta: 9 },
      { name: 'Canal Cinco', segment: 'Partners', revenue: 580000, delta: -1 },
    ],
    alerts: [
      'Guadalajara mantiene pipeline sano, aunque sigue por debajo del target.',
      'La Paz necesita más cobertura de cuentas medianas para mejorar volumen.',
    ],
  },
]

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

function sum(values: number[]) {
  return values.reduce((total, current) => total + current, 0)
}

function deriveRegion(region: (typeof REGIONS)[number], periodKey: keyof typeof PERIODS, channelKey: keyof typeof CHANNELS) {
  const period = PERIODS[periodKey]
  const channel = CHANNELS[channelKey]
  const rawTrend = period.indices.map((index) => region.trend[index])
  const scaledTrend =
    channelKey === 'all'
      ? rawTrend
      : rawTrend.map((point) => Math.round(point * channel.factor * channel.emphasis))
  const revenue = sum(scaledTrend)
  const baseTarget = Math.round(region.target * period.factor)
  const target =
    channelKey === 'all' ? baseTarget : Math.round(baseTarget * channel.factor * 1.02)
  const seasonalBase = sum(rawTrend) || 1
  const targetTrend = rawTrend.map((point) => Math.round(target * (point / seasonalBase)))
  const orderFactor =
    channelKey === 'all'
      ? period.factor
      : period.factor * channel.factor * (channelKey === 'online' ? 1.16 : channelKey === 'retail' ? 0.96 : 0.82)
  const orders = Math.max(1, Math.round(region.orders * orderFactor))
  const avgTicket = Math.round(revenue / orders)
  const marginShift =
    channelKey === 'all' ? 0 : channelKey === 'online' ? 1.4 : channelKey === 'retail' ? -0.8 : 2.1
  const subregions = region.subregions.map((subregion) => {
    const revenueBase = Math.round(subregion.revenue * period.factor)
    const revenueValue =
      channelKey === 'all'
        ? revenueBase
        : Math.round(revenueBase * channel.factor * channel.emphasis)
    const targetBase = Math.round(subregion.target * period.factor)
    const targetValue =
      channelKey === 'all' ? targetBase : Math.round(targetBase * channel.factor * 1.02)
    const conversionShift =
      channelKey === 'all' ? 0 : channelKey === 'online' ? 2.2 : channelKey === 'retail' ? -1 : 1.1

    return {
      ...subregion,
      revenue: revenueValue,
      target: targetValue,
      orders: Math.max(1, Math.round(subregion.orders * orderFactor)),
      conversion: Number((subregion.conversion + conversionShift).toFixed(1)),
      pipeline: Math.round(subregion.pipeline * period.factor),
      delta: revenueValue - targetValue,
    }
  })
  const pipeline = sum(subregions.map((subregion) => subregion.pipeline))
  const accounts = region.accounts.map((account) => ({
    ...account,
    revenue:
      channelKey === 'all'
        ? account.revenue
        : Math.round(account.revenue * channel.factor * channel.emphasis),
    delta:
      account.delta +
      (channelKey === 'all' ? 0 : channelKey === 'online' ? 2 : channelKey === 'retail' ? -1 : 3),
  }))
  const performance = revenue / Math.max(target, 1)
  const health =
    performance >= 1.02 ? 'positive' : performance >= 0.97 ? 'steady' : 'warning'

  return {
    ...region,
    labels: period.indices.map((index) => MONTHS[index]),
    revenue,
    target,
    performance,
    margin: Number((region.margin + marginShift).toFixed(1)),
    orders,
    avgTicket,
    scaledTrend,
    targetTrend,
    subregions,
    pipeline,
    accounts,
    health,
  }
}

function buildPath(points: { x: number; y: number }[]) {
  return points.map((point, index) => `${index === 0 ? 'M' : 'L'} ${point.x} ${point.y}`).join(' ')
}

function PerformanceChart({ regions }: { regions: ReturnType<typeof deriveRegion>[] }) {
  if (!regions.length) {
    return null
  }

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

        return (
          <g key={region.id}>
            <text x="0" y={y + 18} fontSize="13" fill="rgba(23, 49, 63, 0.72)">
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
            />
            <text x={left + chartWidth + 10} y={y + 18} fontSize="12" fill="rgba(23, 49, 63, 0.72)">
              {Math.round(region.performance * 100)}%
            </text>
          </g>
        )
      })}
    </svg>
  )
}

function TrendChart({ region }: { region: ReturnType<typeof deriveRegion> }) {
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
      <path d={buildPath(targetPoints)} fill="none" stroke="rgba(23, 49, 63, 0.25)" strokeWidth="2.5" strokeDasharray="8 8" />
      <path d={buildPath(revenuePoints)} fill="none" stroke={region.color} strokeWidth="4" strokeLinecap="round" strokeLinejoin="round" />
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

function scrollToSection(id: string) {
  document.getElementById(id)?.scrollIntoView({ behavior: 'smooth', block: 'start' })
}

export default function SalesDashboard() {
  const [period, setPeriod] = useState<keyof typeof PERIODS>('ytd')
  const [channel, setChannel] = useState<keyof typeof CHANNELS>('all')
  const [health, setHealth] = useState<keyof typeof HEALTH>('all')
  const [selectedRegionId, setSelectedRegionId] = useState(REGIONS[0].id)
  const [activeSection, setActiveSection] = useState('overview')

  const derivedRegions = REGIONS.map((region) => deriveRegion(region, period, channel))
  const filteredRegions = derivedRegions.filter((region) => {
    if (health === 'ahead') {
      return region.performance >= 1.02
    }

    if (health === 'watch') {
      return region.performance < 1
    }

    return true
  })

  useEffect(() => {
    if (filteredRegions.length && !filteredRegions.some((region) => region.id === selectedRegionId)) {
      setSelectedRegionId(filteredRegions[0].id)
    }
  }, [channel, health, period, selectedRegionId, filteredRegions])

  const selectedRegion =
    filteredRegions.find((region) => region.id === selectedRegionId) ??
    derivedRegions.find((region) => region.id === selectedRegionId) ??
    derivedRegions[0]

  const totalRevenue = sum(filteredRegions.map((region) => region.revenue))
  const totalTarget = sum(filteredRegions.map((region) => region.target))
  const totalOrders = sum(filteredRegions.map((region) => region.orders))
  const totalPipeline = sum(filteredRegions.map((region) => region.pipeline))
  const averageMargin =
    filteredRegions.length > 0
      ? filteredRegions.reduce((total, region) => total + region.margin, 0) / filteredRegions.length
      : 0
  const averageTicket = totalOrders > 0 ? Math.round(totalRevenue / totalOrders) : 0
  const bestRegion = filteredRegions.reduce(
    (best, region) => (region.performance > best.performance ? region : best),
    filteredRegions[0] ?? selectedRegion,
  )
  const focusRegion = filteredRegions.reduce(
    (focus, region) => (region.performance < focus.performance ? region : focus),
    filteredRegions[0] ?? selectedRegion,
  )
  const dominantChannelEntry = Object.entries(selectedRegion.channels).sort((a, b) => b[1] - a[1])[0]
  const focusSubregion = [...selectedRegion.subregions].sort((a, b) => a.delta - b.delta)[0]

  return (
    <main className="dashboard-shell">
      <header className="hero">
        <section className="hero-panel">
          <span className="eyebrow">Pulse Regional • Next.js UI</span>
          <h1>Ventas por región con contexto y foco comercial.</h1>
          <p>
            Dashboard ejecutivo con datos simulados para comparar ventas contra objetivo,
            navegar por región y profundizar en subregiones, canales y cuentas clave sin
            salir de una sola vista.
          </p>

          <div className="hero-stats">
            <div className="hero-stat">
              <span>Cobertura</span>
              <strong>{filteredRegions.length} regiones activas</strong>
            </div>
            <div className="hero-stat">
              <span>Canal analizado</span>
              <strong>{CHANNELS[channel].label}</strong>
            </div>
            <div className="hero-stat">
              <span>Ventana</span>
              <strong>{PERIODS[period].label}</strong>
            </div>
          </div>
        </section>

        <aside className="hero-panel hero-controls">
          <div className="selection-pill">Filtros en vivo</div>
          <div className="control-group">
            <label htmlFor="period">Periodo</label>
            <select id="period" value={period} onChange={(event) => setPeriod(event.target.value as keyof typeof PERIODS)}>
              {Object.entries(PERIODS).map(([value, option]) => (
                <option key={value} value={value}>
                  {option.label}
                </option>
              ))}
            </select>
          </div>
          <div className="control-group">
            <label htmlFor="channel">Canal</label>
            <select id="channel" value={channel} onChange={(event) => setChannel(event.target.value as keyof typeof CHANNELS)}>
              {Object.entries(CHANNELS).map(([value, option]) => (
                <option key={value} value={value}>
                  {option.label}
                </option>
              ))}
            </select>
          </div>
          <div className="control-group">
            <label htmlFor="health">Filtro de desempeño</label>
            <select id="health" value={health} onChange={(event) => setHealth(event.target.value as keyof typeof HEALTH)}>
              {Object.entries(HEALTH).map(([value, option]) => (
                <option key={value} value={value}>
                  {option.label}
                </option>
              ))}
            </select>
          </div>

          <div className="selection-snapshot">
            <div className="label">Región enfocada</div>
            <strong className="detail-number">{selectedRegion.name}</strong>
            <p className="detail-copy">
              {selectedRegion.manager} lidera la operación. La región marca{' '}
              {Math.round(selectedRegion.performance * 100)}% del objetivo con margen de{' '}
              {formatPercent(selectedRegion.margin)}.
            </p>
          </div>
        </aside>
      </header>

      <nav className="nav-bar" aria-label="Secciones del dashboard">
        {NAV_ITEMS.map((item) => (
          <button
            key={item.id}
            type="button"
            className={`nav-button ${activeSection === item.id ? 'active' : ''}`}
            onClick={() => {
              setActiveSection(item.id)
              scrollToSection(item.id)
            }}
          >
            {item.label}
          </button>
        ))}
      </nav>

      <section id="overview" className="section-grid">
        <div className="section-heading">
          <div>
            <h2>Resumen ejecutivo</h2>
            <p>
              Vista consolidada del portafolio filtrado, con foco en volumen, margen,
              productividad comercial y capacidad de cierre en pipeline.
            </p>
          </div>
          <div className="pill-row">
            <span className="accent-pill">Meta agregada {formatCompactCurrency(totalTarget)}</span>
            <span className={`status-pill ${totalRevenue >= totalTarget ? 'positive' : 'warning'}`}>
              Cumplimiento {Math.round((totalRevenue / Math.max(totalTarget, 1)) * 100)}%
            </span>
          </div>
        </div>

        {filteredRegions.length === 0 ? (
          <div className="empty-state">
            <h3>No hay regiones para este filtro</h3>
            <p className="detail-copy">
              El filtro actual no deja resultados. Restablece el filtro de desempeño para
              volver a la vista completa.
            </p>
            <button type="button" className="reset-button" onClick={() => setHealth('all')}>
              Ver todas las regiones
            </button>
          </div>
        ) : (
          <>
            <div className="metrics-grid">
              <article className="metric-card accent">
                <span className="label">Ventas filtradas</span>
                <strong className="metric-value">{formatCompactCurrency(totalRevenue)}</strong>
                <span className="metric-detail">
                  {filteredRegions.length} regiones y {CHANNELS[channel].label.toLowerCase()}.
                </span>
              </article>
              <article className="metric-card">
                <span className="label">Margen promedio</span>
                <strong className="metric-value">{formatPercent(averageMargin)}</strong>
                <span className="metric-detail">
                  Mejor región: {bestRegion.name} con {formatPercent(bestRegion.margin)}.
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
                      Comparativo horizontal para identificar brechas y sobrecumplimiento por
                      territorio.
                    </p>
                  </div>
                  <span className="selection-pill">Comparativo regional</span>
                </div>
                <PerformanceChart regions={filteredRegions} />
                <div className="chart-legend">
                  <span>
                    <span className="legend-dot" style={{ background: 'rgba(23, 49, 63, 0.12)' }} />
                    Objetivo
                  </span>
                  <span>
                    <span className="legend-dot" style={{ background: '#E27A45' }} />
                    Ventas actuales
                  </span>
                </div>
              </div>

              <aside className="surface-card" style={{ padding: 20 }}>
                <div className="detail-header">
                  <div>
                    <h3>Señales del portafolio</h3>
                    <p className="table-note">
                      Puntos de lectura rápida para la reunión semanal de seguimiento.
                    </p>
                  </div>
                </div>
                <div className="detail-list">
                  <div className="detail-stat">
                    <span className="label">Región líder</span>
                    <strong className="detail-number">{bestRegion.name}</strong>
                    <span className="detail-copy">
                      {formatPercent(bestRegion.margin)} margen y {Math.round(bestRegion.performance * 100)}% del plan.
                    </span>
                  </div>
                  <div className="detail-stat">
                    <span className="label">Foco inmediato</span>
                    <strong className="detail-number">{focusRegion.name}</strong>
                    <span className="detail-copy">
                      Necesita empuje comercial para cerrar la brecha contra objetivo.
                    </span>
                  </div>
                  <div className="detail-stat">
                    <span className="label">Canal dominante</span>
                    <strong className="detail-number">
                      {channel === 'all'
                        ? 'Mix balanceado'
                        : CHANNELS[channel].label}
                    </strong>
                    <span className="detail-copy">
                      Filtro aplicado sobre todos los comparativos y tablas del dashboard.
                    </span>
                  </div>
                </div>
              </aside>
            </div>
          </>
        )}
      </section>

      <section id="regions" className="section-grid">
        <div className="section-heading">
          <div>
            <h2>Navegación por regiones</h2>
            <p>
              Selecciona una región para activar el drill-down. Las tarjetas resaltan ritmo
              comercial, cumplimiento y responsable de cada territorio.
            </p>
          </div>
        </div>

        <div className="regions-grid">
          {filteredRegions.map((region) => (
            <article key={region.id} className={`region-card ${selectedRegion.id === region.id ? 'active' : ''}`}>
              <button
                type="button"
                className="region-select"
                onClick={() => {
                  setSelectedRegionId(region.id)
                  setActiveSection('drilldown')
                  scrollToSection('drilldown')
                }}
              >
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
                  Ventas {formatCompactCurrency(region.revenue)} · Pipeline{' '}
                  {formatCompactCurrency(region.pipeline)}
                </div>
                <div className="mini-progress">
                  <span style={{ width: `${Math.min(region.performance * 100, 100)}%`, background: region.color }} />
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

      <section id="table" className="section-grid">
        <div className="section-heading">
          <div>
            <h2>Tabla operativa</h2>
            <p>
              Desglose por subregión para revisar volumen, objetivo, órdenes, conversión y
              pipeline de la región seleccionada.
            </p>
          </div>
        </div>

        <div className="table-layout">
          <article className="table-card">
            <div className="table-topline">
              <div>
                <h3>{selectedRegion.name} por subregión</h3>
                <p className="table-note">
                  Datos simulados ajustados por periodo y canal.
                </p>
              </div>
              <span className={`status-pill ${selectedRegion.performance >= 1 ? 'positive' : 'warning'}`}>
                {Math.round(selectedRegion.performance * 100)}% cumplimiento
              </span>
            </div>
            <div className="table-scroll">
              <table className="data-table">
                <thead>
                  <tr>
                    <th>Subregión</th>
                    <th>Ventas</th>
                    <th>Objetivo</th>
                    <th>Delta</th>
                    <th>Órdenes</th>
                    <th>Conversión</th>
                    <th>Pipeline</th>
                  </tr>
                </thead>
                <tbody>
                  {selectedRegion.subregions.map((subregion) => (
                    <tr key={subregion.name}>
                      <td>{subregion.name}</td>
                      <td>{formatCompactCurrency(subregion.revenue)}</td>
                      <td>{formatCompactCurrency(subregion.target)}</td>
                      <td className={subregion.delta >= 0 ? 'text-positive' : 'text-warning'}>
                        {subregion.delta >= 0 ? '+' : '-'}
                        {formatCompactCurrency(Math.abs(subregion.delta))}
                      </td>
                      <td>{subregion.orders.toLocaleString('es-MX')}</td>
                      <td>{formatPercent(subregion.conversion)}</td>
                      <td>{formatCompactCurrency(subregion.pipeline)}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </article>

          <aside className="detail-card">
            <div className="detail-topline">
              <div>
                <h3>Lectura táctica</h3>
                <p className="table-note">
                  Indicadores del territorio seleccionado para la siguiente cadencia comercial.
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
              El mix actual favorece {CHANNELS[dominantChannelEntry[0] as keyof typeof CHANNELS].label} y
              el foco operativo está en {focusSubregion.name}.
            </p>
          </aside>
        </div>
      </section>

      <section id="drilldown" className="section-grid">
        <div className="section-heading">
          <div>
            <h2>Drill-down regional</h2>
            <p>
              Tendencia, mix de canales, cuentas destacadas y alertas para profundizar en la
              región seleccionada.
            </p>
          </div>
        </div>

        <div className="detail-layout">
          <article className="detail-card">
            <div className="chart-header">
              <div>
                <h3>Tendencia de {selectedRegion.name}</h3>
                <p className="table-note">
                  Línea de ventas contra objetivo ajustada al filtro activo.
                </p>
              </div>
              <span className="selection-pill">{PERIODS[period].label}</span>
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
                          channel === key || channel === 'all'
                            ? `linear-gradient(90deg, ${selectedRegion.color}, #9ad7cf)`
                            : 'linear-gradient(90deg, rgba(23,49,63,0.18), rgba(23,49,63,0.08))',
                      }}
                    />
                  </div>
                </div>
              ))}
            </div>

            <div className="detail-header" style={{ marginTop: 24 }}>
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
        </div>

        <div className="details-grid split">
          <article className="detail-card">
            <div className="detail-header">
              <div>
                <h3>Acciones sugeridas</h3>
                <p className="table-note">
                  Recomendaciones operativas generadas a partir del desempeño del territorio.
                </p>
              </div>
            </div>
            <ol className="detail-list">
              <li>Reasignar cobertura a la subregión con mayor brecha frente al objetivo.</li>
              <li>Incrementar seguimiento semanal sobre las cuentas enterprise con pipeline abierto.</li>
              <li>Proteger el canal dominante de {selectedRegion.name} para sostener el margen actual.</li>
            </ol>
          </article>

          <article className="detail-card">
            <div className="detail-header">
              <div>
                <h3>Alertas y notas</h3>
                <p className="table-note">
                  Señales de seguimiento comercial para la reunión de forecast.
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
    </main>
  )
}
