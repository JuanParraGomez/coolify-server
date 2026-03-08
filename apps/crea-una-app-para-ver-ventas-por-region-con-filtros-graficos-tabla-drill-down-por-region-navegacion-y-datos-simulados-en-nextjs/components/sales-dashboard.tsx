'use client'

import { useEffect, useState } from 'react'

import FiltersPanel from './filters-panel'
import RegionChart from './region-chart'
import RegionTable from './region-table'
import {
  CHANNELS,
  HEALTH,
  NAV_ITEMS,
  PERIODS,
  REGIONS,
  deriveRegion,
  formatCompactCurrency,
  formatPercent,
  type ChannelKey,
  type HealthKey,
  type PeriodKey,
} from '../lib/mock-data'

function scrollToSection(id: string) {
  document.getElementById(id)?.scrollIntoView({ behavior: 'smooth', block: 'start' })
}

export default function SalesDashboard() {
  const [period, setPeriod] = useState<PeriodKey>('ytd')
  const [channel, setChannel] = useState<ChannelKey>('all')
  const [health, setHealth] = useState<HealthKey>('all')
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
  }, [filteredRegions, selectedRegionId])

  const selectedRegion =
    filteredRegions.find((region) => region.id === selectedRegionId) ??
    derivedRegions.find((region) => region.id === selectedRegionId) ??
    derivedRegions[0]

  const focusSubregion =
    [...selectedRegion.subregions].sort((left, right) => left.delta - right.delta)[0] ??
    selectedRegion.subregions[0]
  const dominantChannelEntry =
    Object.entries(selectedRegion.channels).sort((left, right) => right[1] - left[1])[0] ??
    ['all', 1]
  const dominantChannelKey = dominantChannelEntry[0] as keyof typeof CHANNELS

  function handleSectionChange(sectionId: string) {
    setActiveSection(sectionId)
    scrollToSection(sectionId)
  }

  function handleRegionSelect(regionId: string, nextSection?: string) {
    setSelectedRegionId(regionId)

    if (nextSection) {
      setActiveSection(nextSection)
      scrollToSection(nextSection)
    }
  }

  return (
    <main className="dashboard-shell">
      <header className="hero">
        <section className="hero-panel">
          <span className="eyebrow">Pulse Regional • Next.js UI</span>
          <h1>Ventas por región con contexto y foco comercial.</h1>
          <p>
            Dashboard ejecutivo con datos simulados para comparar ventas contra objetivo,
            navegar por región y profundizar en gráficas, tablas y drill-down desde una sola vista.
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
          <div className="selection-pill">Filtros compartidos</div>
          <FiltersPanel
            period={period}
            channel={channel}
            health={health}
            onPeriodChange={setPeriod}
            onChannelChange={setChannel}
            onHealthChange={setHealth}
          />

          <div className="selection-snapshot">
            <div className="label">Región enfocada</div>
            <strong className="detail-number">{selectedRegion.name}</strong>
            <p className="detail-copy">
              {selectedRegion.manager} lidera la operación. La región marca{' '}
              {Math.round(selectedRegion.performance * 100)}% del objetivo con margen de{' '}
              {formatPercent(selectedRegion.margin)}.
            </p>
            <p className="detail-copy">
              Vista actual: {HEALTH[health].label} en {CHANNELS[channel].label.toLowerCase()}.
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
            onClick={() => handleSectionChange(item.id)}
          >
            {item.label}
          </button>
        ))}
      </nav>

      {filteredRegions.length === 0 ? (
        <section id="overview" className="section-grid">
          <div className="empty-state">
            <h3>No hay regiones para este filtro</h3>
            <p className="detail-copy">
              El filtro actual no deja resultados. Restablece el desempeño visible para volver a la vista completa.
            </p>
            <button
              type="button"
              className="reset-button"
              onClick={() => {
                setHealth('all')
                setActiveSection('overview')
              }}
            >
              Ver todas las regiones
            </button>
          </div>
        </section>
      ) : (
        <>
          <RegionChart
            regions={filteredRegions}
            periodLabel={PERIODS[period].label}
            channelLabel={CHANNELS[channel].label}
            activeChannel={channel}
            selectedRegionId={selectedRegion.id}
            onSelectRegion={(regionId) => handleRegionSelect(regionId, 'drilldown')}
            sectionIds={{
              overview: 'overview',
              regions: 'regions',
              drilldown: 'drilldown',
            }}
          />

          <section id="table" className="section-grid">
            <div className="section-heading">
              <div>
                <h2>Tabla operativa</h2>
                <p>
                  Vista tabular integrada para comparar regiones filtradas y luego revisar el detalle
                  por subregión del territorio activo.
                </p>
              </div>
            </div>

            <div className="table-layout">
              <article className="table-card">
                <div className="table-topline">
                  <div>
                    <h3>Comparativo por región</h3>
                    <p className="table-note">
                      Selecciona una fila para sincronizar la lectura del resto del dashboard.
                    </p>
                  </div>
                  <span className="selection-pill">{filteredRegions.length} visibles</span>
                </div>
                <RegionTable
                  regions={filteredRegions}
                  selectedRegionId={selectedRegion.id}
                  onSelectRegion={(regionId) => handleRegionSelect(regionId, 'table')}
                />
              </article>

              <aside className="detail-card">
                <div className="detail-topline">
                  <div>
                    <h3>Lectura táctica</h3>
                    <p className="table-note">
                      Indicadores del territorio activo para la siguiente cadencia comercial.
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
              </aside>
            </div>

            <article className="table-card">
              <div className="table-topline">
                <div>
                  <h3>{selectedRegion.name} por subregión</h3>
                  <p className="table-note">
                    Datos simulados ajustados por periodo y canal para revisar brechas operativas.
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
          </section>
        </>
      )}
    </main>
  )
}
