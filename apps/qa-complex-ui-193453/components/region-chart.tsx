'use client'

import { useMemo, useState } from 'react'
import type { CSSProperties } from 'react'

const quarterLabels = ['Q1 2025', 'Q2 2025', 'Q3 2025', 'Q4 2025'] as const

type RegionData = {
  region: string
  segment: string
  outlook: string
  sales: number
  yoy: number
  conversion: number
  pipeline: number
  deals: number
  quarter: number[]
  focus: string[]
}

const formatCurrency = (value: number) =>
  new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
    maximumFractionDigits: 0,
  }).format(value)

const dataset: RegionData[] = [
  {
    region: 'North America',
    segment: 'Enterprise',
    outlook: 'Expanding',
    sales: 1_340_000,
    yoy: 0.12,
    conversion: 0.54,
    pipeline: 920_000,
    deals: 48,
    quarter: [310_000, 325_000, 345_000, 370_000],
    focus: ['AI transformation', 'Manufacturing renewals'],
  },
  {
    region: 'Europe',
    segment: 'Enterprise',
    outlook: 'Stabilizing',
    sales: 1_120_000,
    yoy: 0.08,
    conversion: 0.49,
    pipeline: 780_000,
    deals: 41,
    quarter: [270_000, 290_000, 310_000, 360_000],
    focus: ['Public cloud modernization', 'Mid-market upsells'],
  },
  {
    region: 'Latam',
    segment: 'Growth',
    outlook: 'Emerging',
    sales: 620_000,
    yoy: 0.19,
    conversion: 0.38,
    pipeline: 410_000,
    deals: 29,
    quarter: [120_000, 155_000, 175_000, 170_000],
    focus: ['Rural retail networks', 'Channel co-sell acceleration'],
  },
  {
    region: 'APAC',
    segment: 'Growth',
    outlook: 'High Potential',
    sales: 940_000,
    yoy: 0.14,
    conversion: 0.46,
    pipeline: 640_000,
    deals: 37,
    quarter: [210_000, 225_000, 240_000, 260_000],
    focus: ['Fintech expansion', 'Digital manufacturing'],
  },
  {
    region: 'MEA',
    segment: 'Public Sector',
    outlook: 'Rebound',
    sales: 510_000,
    yoy: 0.07,
    conversion: 0.41,
    pipeline: 370_000,
    deals: 21,
    quarter: [105_000, 120_000, 132_000, 153_000],
    focus: ['Border security programs', 'Smart grid initiatives'],
  },
]

const layoutStyles: Record<string, CSSProperties> = {
  wrapper: {
    fontFamily: 'Inter, system-ui, sans-serif',
    padding: '2rem',
    background: '#0f172a',
    color: '#f8fafc',
    minHeight: '100vh',
    display: 'flex',
    flexDirection: 'column',
    gap: '1.75rem',
  },
  header: {
    display: 'flex',
    justifyContent: 'space-between',
    flexWrap: 'wrap',
    gap: '1rem',
    borderBottom: '1px solid rgba(148, 163, 184, 0.4)',
    paddingBottom: '1rem',
  },
  section: {
    background: '#111827',
    borderRadius: '1rem',
    padding: '1.5rem',
    boxShadow: '0 20px 40px rgba(15,23,42,0.35)',
  },
  sectionTitle: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'baseline',
    marginBottom: '1rem',
    flexWrap: 'wrap',
    gap: '0.5rem',
  },
  kpiGrid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))',
    gap: '1rem',
    marginTop: '1rem',
  },
  card: {
    background: '#1f2937',
    borderRadius: '0.75rem',
    padding: '1rem',
    border: '1px solid rgba(148, 163, 184, 0.3)',
  },
  filters: {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
    gap: '1rem',
  },
  nav: {
    display: 'flex',
    gap: '0.75rem',
    flexWrap: 'wrap',
  },
  navLink: {
    padding: '0.4rem 0.85rem',
    borderRadius: '999px',
    background: '#1f2937',
    border: '1px solid rgba(148, 163, 184, 0.4)',
    color: '#e0f2fe',
    textDecoration: 'none',
    fontSize: '0.85rem',
  },
  barChart: {
    display: 'flex',
    flexDirection: 'column',
    gap: '0.75rem',
  },
  barRow: {
    display: 'flex',
    alignItems: 'center',
    gap: '0.75rem',
  },
  barLabel: {
    minWidth: '110px',
    fontSize: '0.85rem',
    color: '#cbd5f5',
  },
  barTrack: {
    flex: 1,
    height: '8px',
    borderRadius: '999px',
    background: '#1e293b',
    overflow: 'hidden',
  },
  barFill: {
    height: '100%',
    borderRadius: '999px',
    background: 'linear-gradient(90deg, #22d3ee, #6366f1)',
  },
  table: {
    width: '100%',
    borderCollapse: 'separate',
    borderSpacing: 0,
  },
  tableRow: {
    borderBottom: '1px solid rgba(148, 163, 184, 0.2)',
    cursor: 'pointer',
  },
  selectedRow: {
    background: 'rgba(59, 130, 246, 0.2)',
  },
  comparisonBar: {
    height: '10px',
    borderRadius: '999px',
    background: '#0f172a',
    overflow: 'hidden',
  },
}

const navSections = [
  { id: 'overview', label: 'Resumen' },
  { id: 'filters', label: 'Filtros' },
  { id: 'drilldown', label: 'Drill-down' },
  { id: 'comparatives', label: 'Comparativas trimestrales' },
]

export default function RegionChart() {
  const [selectedSegment, setSelectedSegment] = useState('All')
  const [selectedOutlook, setSelectedOutlook] = useState('All')
  const [minSalesMillions, setMinSalesMillions] = useState(0.5)
  const [showHighGrowthOnly, setShowHighGrowthOnly] = useState(false)
  const [drillRegion, setDrillRegion] = useState(dataset[0].region)

  const segments = useMemo(() => ['All', ...new Set(dataset.map((region) => region.segment))], [])
  const outlooks = useMemo(() => ['All', ...new Set(dataset.map((region) => region.outlook))], [])

  const filteredRegions = useMemo(() => {
    return dataset.filter((region) => {
      const meetsSegment = selectedSegment === 'All' || region.segment === selectedSegment
      const meetsOutlook = selectedOutlook === 'All' || region.outlook === selectedOutlook
      const meetsSales = region.sales >= minSalesMillions * 1_000_000
      const meetsGrowth = !showHighGrowthOnly || region.yoy >= 0.12
      return meetsSegment && meetsOutlook && meetsSales && meetsGrowth
    })
  }, [selectedSegment, selectedOutlook, minSalesMillions, showHighGrowthOnly])

  const visibleRegions = filteredRegions.length > 0 ? filteredRegions : dataset
  const activeRegion = visibleRegions.find((region) => region.region === drillRegion) ?? visibleRegions[0]

  const totalSales = visibleRegions.reduce((sum, r) => sum + r.sales, 0)
  const avgGrowth =
    visibleRegions.reduce((sum, r) => sum + r.yoy, 0) /
    Math.max(1, visibleRegions.length)
  const avgConversion =
    visibleRegions.reduce((sum, r) => sum + r.conversion, 0) /
    Math.max(1, visibleRegions.length)

  const quarterSums = quarterLabels.map((_, index) =>
    visibleRegions.reduce((sum, region) => sum + region.quarter[index], 0),
  )

  const maxSales = Math.max(...dataset.map((region) => region.sales))
  const maxQuarter = Math.max(...quarterSums, 1)

  const latestQuarterIndex = quarterLabels.length - 1
  const previousQuarterIndex = Math.max(latestQuarterIndex - 1, 0)
  const latestQuarterValue = quarterSums[latestQuarterIndex]
  const previousQuarterValue = quarterSums[previousQuarterIndex]
  const quarterDelta = latestQuarterValue - previousQuarterValue
  const quarterDeltaPercent = previousQuarterValue
    ? (quarterDelta / previousQuarterValue) * 100
    : 0

  return (
    <section style={layoutStyles.wrapper}>
      <header style={layoutStyles.header}>
        <div>
          <p style={{ fontSize: '0.9rem', color: '#94a3b8' }}>Sales intelligence</p>
          <h1 style={{ margin: 0, fontSize: '2rem' }}>Análisis por región</h1>
        </div>
        <nav style={layoutStyles.nav} aria-label="Secciones del tablero">
          {navSections.map((section) => (
            <a key={section.id} style={layoutStyles.navLink} href={`#${section.id}`}>
              {section.label}
            </a>
          ))}
        </nav>
      </header>

      <section id="overview" style={layoutStyles.section}>
        <div style={layoutStyles.sectionTitle}>
          <h2 style={{ margin: 0 }}>Resumen KPI</h2>
          <span style={{ color: '#94a3b8', fontSize: '0.9rem' }}>
            Última actualización 08 marzo 2026
          </span>
        </div>
        <div style={layoutStyles.kpiGrid}>
          <div style={layoutStyles.card}>
            <p style={{ margin: 0, fontSize: '0.85rem', color: '#94a3b8' }}>Ventas filtradas</p>
            <p style={{ fontSize: '1.35rem', margin: 0 }}>{formatCurrency(totalSales)}</p>
            <p style={{ margin: 0, color: '#38bdf8', fontSize: '0.85rem' }}>YoY {Math.round(avgGrowth * 100)}%</p>
          </div>
          <div style={layoutStyles.card}>
            <p style={{ margin: 0, fontSize: '0.85rem', color: '#94a3b8' }}>Tasa de conversión</p>
            <p style={{ fontSize: '1.35rem', margin: 0 }}>{Math.round(avgConversion * 100)}%</p>
            <p style={{ margin: 0, color: '#a5b4fc', fontSize: '0.85rem' }}>Basado en {visibleRegions.length} regiones</p>
          </div>
          <div style={layoutStyles.card}>
            <p style={{ margin: 0, fontSize: '0.85rem', color: '#94a3b8' }}>Oportunidades clave</p>
            <p style={{ fontSize: '1.35rem', margin: 0 }}>{visibleRegions.reduce((sum, r) => sum + r.deals, 0)}</p>
            <p style={{ margin: 0, color: '#c7d2fe', fontSize: '0.85rem' }}>Focus pipeline ${formatCurrency(visibleRegions.reduce((sum, r) => sum + r.pipeline, 0))}</p>
          </div>
        </div>
      </section>

      <section id="filters" style={layoutStyles.section}>
        <div style={layoutStyles.sectionTitle}>
          <h2 style={{ margin: 0 }}>Filtros avanzados</h2>
          <p style={{ margin: 0, color: '#94a3b8', fontSize: '0.9rem' }}>
            Personaliza el panel para ver sólo lo que necesitas.
          </p>
        </div>
        <div style={layoutStyles.filters}>
          <label style={{ display: 'flex', flexDirection: 'column', gap: '0.35rem', fontSize: '0.9rem' }}>
            Segmento
            <select
              value={selectedSegment}
              onChange={(event) => setSelectedSegment(event.target.value)}
              style={{ borderRadius: '0.5rem', padding: '0.5rem', background: '#111827', color: '#f8fafc', border: '1px solid rgba(148, 163, 184, 0.6)' }}
            >
              {segments.map((segment) => (
                <option key={segment} value={segment}>
                  {segment}
                </option>
              ))}
            </select>
          </label>

          <label style={{ display: 'flex', flexDirection: 'column', gap: '0.35rem', fontSize: '0.9rem' }}>
            Perspectiva
            <select
              value={selectedOutlook}
              onChange={(event) => setSelectedOutlook(event.target.value)}
              style={{ borderRadius: '0.5rem', padding: '0.5rem', background: '#111827', color: '#f8fafc', border: '1px solid rgba(148, 163, 184, 0.6)' }}
            >
              {outlooks.map((outlook) => (
                <option key={outlook} value={outlook}>
                  {outlook}
                </option>
              ))}
            </select>
          </label>

          <label style={{ display: 'flex', flexDirection: 'column', gap: '0.35rem', fontSize: '0.9rem' }}>
            Ventas mínimas (millones USD)
            <input
              type="range"
              min={0}
              max={2}
              step={0.1}
              value={minSalesMillions}
              onChange={(event) => setMinSalesMillions(Number(event.target.value))}
              style={{ accentColor: '#38bdf8' }}
            />
            <span style={{ fontSize: '0.8rem', color: '#cbd5f5' }}>{minSalesMillions.toFixed(1)}M USD</span>
          </label>

          <label style={{ display: 'flex', flexDirection: 'column', gap: '0.35rem', fontSize: '0.9rem' }}>
            Alto crecimiento
            <button
              type="button"
              onClick={() => setShowHighGrowthOnly((value) => !value)}
              style={{
                borderRadius: '999px',
                padding: '0.5rem 1rem',
                border: showHighGrowthOnly ? '1px solid #38bdf8' : '1px solid rgba(148, 163, 184, 0.6)',
                background: showHighGrowthOnly ? 'rgba(56, 189, 248, 0.15)' : '#111827',
                color: '#e0f2fe',
              }}
            >
              {showHighGrowthOnly ? 'Solo > 12% YOY' : 'Mostrar todo'}
            </button>
          </label>
        </div>
        {filteredRegions.length === 0 && (
          <p style={{ color: '#fda4af', marginTop: '1rem' }}>
            Ninguna región cumple con los filtros actuales. Se muestran los datos base para mantener continuidad.
          </p>
        )}
      </section>

      <section id="overview-charts" style={layoutStyles.section}>
        <div style={layoutStyles.sectionTitle}>
          <h2 style={{ margin: 0 }}>Gráfico de ventas por región</h2>
          <span style={{ color: '#94a3b8' }}>Clic en una fila para ver detalles</span>
        </div>
        <div style={layoutStyles.barChart}>
          {visibleRegions.map((region) => {
            const width = (region.sales / maxSales) * 100
            return (
              <div key={region.region} style={layoutStyles.barRow}>
                <span style={layoutStyles.barLabel}>{region.region}</span>
                <div style={layoutStyles.barTrack}>
                  <div
                    style={{
                      ...layoutStyles.barFill,
                      width: `${width}%`,
                    }}
                  />
                </div>
                <span style={{ fontSize: '0.9rem', color: '#cbd5f5' }}>{formatCurrency(region.sales)}</span>
              </div>
            )
          })}
        </div>
      </section>

      <section id="drilldown" style={layoutStyles.section}>
        <div style={layoutStyles.sectionTitle}>
          <h2 style={{ margin: 0 }}>Tabla con drill-down</h2>
          <span style={{ color: '#94a3b8' }}>Selecciona la fila para ver detalles adicionales</span>
        </div>
        <div style={{ overflowX: 'auto' }}>
          <table style={layoutStyles.table}>
            <thead>
              <tr>
                <th style={{ textAlign: 'left', paddingBottom: '0.5rem', color: '#94a3b8' }}>Región</th>
                <th style={{ textAlign: 'right', paddingBottom: '0.5rem', color: '#94a3b8' }}>Segmento</th>
                <th style={{ textAlign: 'right', paddingBottom: '0.5rem', color: '#94a3b8' }}>Ventas</th>
                <th style={{ textAlign: 'right', paddingBottom: '0.5rem', color: '#94a3b8' }}>YoY</th>
                <th style={{ textAlign: 'right', paddingBottom: '0.5rem', color: '#94a3b8' }}>Deals</th>
              </tr>
            </thead>
            <tbody>
              {visibleRegions.map((region) => (
                <tr
                  key={region.region}
                  style={{
                    ...layoutStyles.tableRow,
                    ...(activeRegion.region === region.region ? layoutStyles.selectedRow : {}),
                  }}
                  onClick={() => setDrillRegion(region.region)}
                >
                  <td style={{ padding: '0.75rem 0' }}>{region.region}</td>
                  <td style={{ padding: '0.75rem 0', textAlign: 'right' }}>{region.segment}</td>
                  <td style={{ padding: '0.75rem 0', textAlign: 'right' }}>{formatCurrency(region.sales)}</td>
                  <td style={{ padding: '0.75rem 0', textAlign: 'right' }}>{Math.round(region.yoy * 100)}%</td>
                  <td style={{ padding: '0.75rem 0', textAlign: 'right' }}>{region.deals}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <div style={{ marginTop: '1.25rem', display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: '1rem' }}>
          <div style={layoutStyles.card}>
            <p style={{ margin: 0, fontSize: '0.85rem', color: '#94a3b8' }}>Detalle activo</p>
            <h3 style={{ margin: '0.25rem 0 0.5rem 0' }}>{activeRegion.region}</h3>
            <p style={{ margin: 0 }}>Outlook: {activeRegion.outlook}</p>
            <p style={{ margin: 0 }}>Pipeline: {formatCurrency(activeRegion.pipeline)}</p>
            <p style={{ margin: '0.25rem 0 0', color: '#cbd5f5' }}>{activeRegion.focus.join(' · ')}</p>
          </div>
          <div style={layoutStyles.card}>
            <p style={{ margin: 0, fontSize: '0.85rem', color: '#94a3b8' }}>Distribución trimestral</p>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem', marginTop: '0.75rem' }}>
              {quarterLabels.map((label, index) => {
                const value = activeRegion.quarter[index]
                const width = (value / Math.max(...activeRegion.quarter, 1)) * 100
                return (
                  <div key={label} style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                    <span style={{ width: '70px', fontSize: '0.8rem', color: '#cbd5f5' }}>{label}</span>
                    <div style={layoutStyles.barTrack}>
                      <div
                        style={{
                          ...layoutStyles.barFill,
                          width: `${width}%`,
                          background: 'linear-gradient(90deg, #f97316, #facc15)',
                        }}
                      />
                    </div>
                    <span style={{ fontSize: '0.85rem', color: '#fbbf24' }}>{formatCurrency(value)}</span>
                  </div>
                )
              })}
            </div>
          </div>
        </div>
      </section>

      <section id="comparatives" style={layoutStyles.section}>
        <div style={layoutStyles.sectionTitle}>
          <h2 style={{ margin: 0 }}>Comparativas trimestrales</h2>
          <p style={{ margin: 0, color: '#94a3b8', fontSize: '0.9rem' }}>
            Últimos dos trimestres sobre el total filtrado
          </p>
        </div>
        <div style={{ display: 'grid', gap: '1rem' }}>
          {quarterLabels.map((label, index) => {
            const value = quarterSums[index]
            const width = (value / maxQuarter) * 100
            return (
              <div key={label} style={{ display: 'flex', flexDirection: 'column', gap: '0.4rem' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.9rem' }}>
                  <span>{label}</span>
                  <span>{formatCurrency(value)}</span>
                </div>
                <div style={layoutStyles.comparisonBar}>
                  <div
                    style={{
                      width: `${width}%`,
                      height: '100%',
                      background: index === latestQuarterIndex ? 'linear-gradient(90deg, #34d399, #10b981)' : '#2563eb',
                      borderRadius: '999px',
                    }}
                  />
                </div>
              </div>
            )
          })}
        </div>
        <div style={{ marginTop: '1rem', padding: '1rem', borderRadius: '0.75rem', background: '#1e293b' }}>
          <p style={{ margin: 0, fontSize: '0.9rem', color: '#bbf7d0' }}>
            Q4 supera a Q3 por {formatCurrency(quarterDelta)} ({quarterDeltaPercent.toFixed(1)}%).
          </p>
        </div>
      </section>
    </section>
  )
}
