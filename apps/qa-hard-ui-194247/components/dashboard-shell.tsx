'use client'

import { useMemo, useState } from 'react'

type Tab = 'resumen' | 'detalle'

const regionStats = [
  { name: 'Norte', sales: 312, target: 290, growth: 0.08 },
  { name: 'Centro', sales: 276, target: 250, growth: 0.12 },
  { name: 'Sur', sales: 198, target: 210, growth: -0.06 },
  { name: 'Occidente', sales: 240, target: 230, growth: 0.04 },
]

const quarterComparison = [
  { region: 'Norte', Q1: 88, Q2: 96, Q3: 105, Q4: 123 },
  { region: 'Centro', Q1: 72, Q2: 80, Q3: 95, Q4: 109 },
  { region: 'Sur', Q1: 55, Q2: 63, Q3: 71, Q4: 59 },
  { region: 'Occidente', Q1: 64, Q2: 70, Q3: 75, Q4: 89 },
]

const quarterlyTrend = [
  { label: 'Q1 2025', value: 75 },
  { label: 'Q2 2025', value: 82 },
  { label: 'Q3 2025', value: 98 },
  { label: 'Q4 2025', value: 115 },
]

const maxTrendValue = Math.max(...quarterlyTrend.map((point) => point.value))

const detailHighlights = [
  { title: 'Oportunidad en Centro', body: 'Prospectos con ciclo corto y alto ticket listos para cerrar en 30 días.' },
  { title: 'Acciones para Sur', body: 'Campañas de retención y descuentos en paquetes premium para recuperar participación.' },
  { title: 'Iniciativa Occidente', body: 'Alinear con socio logístico clave para reducir tiempos y aumentar volumen.' },
]

const formatCurrency = (value: number) => `${value.toLocaleString('es-ES')}k`

export default function DashboardShell() {
  const [activeTab, setActiveTab] = useState<Tab>('resumen')
  const [selectedRegion, setSelectedRegion] = useState('Todas las regiones')
  const [selectedQuarter, setSelectedQuarter] = useState('Q4 2025')

  const totals = useMemo(
    () => regionStats.reduce((acc, region) => acc + region.sales, 0),
    [],
  )

  const highlightedRegion = useMemo(
    () =>
      selectedRegion === 'Todas las regiones'
        ? { name: 'Todas', sales: totals, target: 970, growth: 0.05 }
        : regionStats.find((region) => region.name === selectedRegion) ?? null,
    [selectedRegion, totals],
  )

  const trendValue = quarterlyTrend.find((item) => item.label === selectedQuarter)?.value ?? 0

  const viewContent =
    activeTab === 'resumen' ? (
      <>
        <section className="metrics-grid">
          <article>
            <p className="label">Ventas activas</p>
            <p className="value">{formatCurrency(highlightedRegion?.sales ?? totals)}</p>
            <p className="sub">vs objetivo {formatCurrency(highlightedRegion?.target ?? 970)}</p>
          </article>
          <article>
            <p className="label">Crecimiento</p>
            <p className="value">
              {Math.sign((highlightedRegion?.growth ?? 0) * 100) >= 0 ? '+' : ''}
              {((highlightedRegion?.growth ?? 0) * 100).toFixed(1)}%
            </p>
            <p className="sub">Últimos 12 meses</p>
          </article>
          <article>
            <p className="label">Tendencia {selectedQuarter}</p>
            <p className="value">{trendValue} pts</p>
            <p className="sub">Relativo a Q1</p>
          </article>
        </section>

        <section className="chart-panel">
          <header>
            <div>
              <p className="title">Radar trimestral</p>
              <p className="desc">Muestra la evolución acumulada por trimestre.</p>
            </div>
            <span>{selectedQuarter}</span>
          </header>
          <div className="chart">
            {quarterlyTrend.map((point) => (
              <div key={point.label} className="bar">
                <div style={{ height: `${(point.value / maxTrendValue) * 100}%` }} />
                <span>{point.label}</span>
              </div>
            ))}
          </div>
        </section>

        <section className="table-panel">
          <header>
            <p className="title">Comparativa trimestral por región</p>
            <p className="desc">Valores en miles (k)</p>
          </header>
          <table>
            <thead>
              <tr>
                <th>Región</th>
                <th>Q1</th>
                <th>Q2</th>
                <th>Q3</th>
                <th>Q4</th>
              </tr>
            </thead>
            <tbody>
              {quarterComparison.map((row) => (
                <tr key={row.region}>
                  <td>{row.region}</td>
                  <td>{row.Q1}</td>
                  <td>{row.Q2}</td>
                  <td>{row.Q3}</td>
                  <td>{row.Q4}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </section>
      </>
    ) : (
      <section className="detail-view">
        {detailHighlights.map((item) => (
          <article key={item.title}>
            <header>
              <h3>{item.title}</h3>
              <p>{selectedRegion}</p>
            </header>
            <p>{item.body}</p>
            <div className="chip">Prioridad alta</div>
          </article>
        ))}
          <div className="detail-chart">
            <p className="title">Proyección para {selectedRegion}</p>
            <div className="mini-chart">
              {quarterlyTrend.map((point, index) => (
                <span
                  key={point.label}
                  className="dot"
                  style={{
                    left: `${(index / (quarterlyTrend.length - 1)) * 100}%`,
                    bottom: `${(point.value / maxTrendValue) * 100}%`,
                  }}
                />
              ))}
            </div>
          </div>
      </section>
    )

  return (
    <>
      <div className="dashboard-shell">
        <nav className="top-nav">
          <div>
            <p className="eyebrow">Centro comercial</p>
            <h1>Ventas por región</h1>
          </div>
          <div className="tab-group" role="tablist">
            {(['resumen', 'detalle'] as Tab[]).map((tab) => (
              <button
                key={tab}
                role="tab"
                aria-selected={activeTab === tab}
                className={activeTab === tab ? 'active' : ''}
                onClick={() => setActiveTab(tab)}
              >
                {tab === 'resumen' ? 'Resumen' : 'Detalle'}
              </button>
            ))}
          </div>
        </nav>

        <div className="layout-body">
          <aside className="filters-panel">
            <h2>Filtros</h2>
            <p>Selecciona la región o el trimestre para adaptar la vista.</p>
            <div className="filter-group">
              <p>Región</p>
              <div className="filter-chips">
                {['Todas las regiones', ...regionStats.map((region) => region.name)].map((option) => (
                  <button
                    key={option}
                    className={selectedRegion === option ? 'selected' : ''}
                    onClick={() => setSelectedRegion(option)}
                  >
                    {option}
                  </button>
                ))}
              </div>
            </div>
            <div className="filter-group">
              <p>Trimestre</p>
              <div className="filter-chips">
                {quarterlyTrend.map((quarter) => (
                  <button
                    key={quarter.label}
                    className={selectedQuarter === quarter.label ? 'selected' : ''}
                    onClick={() => setSelectedQuarter(quarter.label)}
                  >
                    {quarter.label}
                  </button>
                ))}
              </div>
            </div>
          </aside>

          <main className="workspace">{viewContent}</main>
        </div>
      </div>
      <style jsx>{`
        .dashboard-shell {
          background: rgba(15, 23, 42, 0.9);
          border-radius: 32px;
          padding: 2rem;
          box-shadow: 0 20px 60px rgba(2, 6, 23, 0.6);
          max-width: 1200px;
          margin: 0 auto;
        }

        .top-nav {
          display: flex;
          align-items: center;
          justify-content: space-between;
          gap: 1rem;
          border-bottom: 1px solid rgba(148, 163, 184, 0.3);
          padding-bottom: 1rem;
        }

        .top-nav h1 {
          margin: 0.15rem 0 0;
          font-size: 2rem;
        }

        .eyebrow {
          letter-spacing: 0.2em;
          text-transform: uppercase;
          font-size: 0.75rem;
          color: #4ade80;
        }

        .tab-group {
          display: flex;
          gap: 0.5rem;
        }

        .tab-group button {
          border: none;
          border-radius: 999px;
          padding: 0.35rem 1.25rem;
          background: rgba(148, 163, 184, 0.2);
          color: #dbeafe;
          font-weight: 600;
          cursor: pointer;
        }

        .tab-group button.active {
          background: linear-gradient(135deg, #22d3ee, #06b6d4);
          color: #020617;
        }

        .layout-body {
          display: grid;
          grid-template-columns: 260px 1fr;
          gap: 1.5rem;
          padding-top: 1.5rem;
        }

        .filters-panel {
          background: rgba(15, 23, 42, 0.7);
          border-radius: 24px;
          padding: 1.5rem;
          border: 1px solid rgba(148, 163, 184, 0.2);
        }

        .filters-panel h2 {
          margin: 0 0 0.3rem;
        }

        .filter-group {
          margin-top: 1rem;
        }

        .filter-chips {
          display: flex;
          flex-wrap: wrap;
          gap: 0.5rem;
          margin-top: 0.5rem;
        }

        .filter-chips button {
          border: 1px solid rgba(148, 163, 184, 0.3);
          background: transparent;
          border-radius: 999px;
          padding: 0.35rem 0.85rem;
          color: #e2e8f0;
          font-size: 0.85rem;
          cursor: pointer;
        }

        .filter-chips button.selected {
          background: #22d3ee;
          color: #020617;
          border-color: transparent;
        }

        .title {
          margin: 0;
          font-weight: 600;
          color: #e2e8f0;
        }

        .desc {
          margin: 0.2rem 0 0;
          color: #94a3b8;
          font-size: 0.85rem;
        }

        .workspace {
          display: flex;
          flex-direction: column;
          gap: 1.5rem;
        }

        .metrics-grid {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(180px, 1fr));
          gap: 1rem;
        }

        .metrics-grid article {
          background: #0f172a;
          border-radius: 20px;
          padding: 1rem;
          border: 1px solid rgba(148, 163, 184, 0.2);
        }

        .label {
          text-transform: uppercase;
          font-size: 0.75rem;
          color: #94a3b8;
          letter-spacing: 0.15em;
          margin: 0;
        }

        .value {
          font-size: 1.75rem;
          font-weight: 700;
          margin: 0.35rem 0;
        }

        .sub {
          margin: 0;
          font-size: 0.9rem;
          color: #cbd5f5;
        }

        .chart-panel,
        .table-panel {
          background: #0b1226;
          border-radius: 24px;
          padding: 1.5rem;
          border: 1px solid rgba(148, 163, 184, 0.2);
        }

        .chart-panel header,
        .table-panel header {
          display: flex;
          justify-content: space-between;
          align-items: center;
          margin-bottom: 1rem;
        }

        .chart {
          display: grid;
          grid-template-columns: repeat(4, minmax(0, 1fr));
          gap: 1rem;
          align-items: end;
        }

        .bar {
          display: flex;
          flex-direction: column;
          align-items: center;
          gap: 0.35rem;
        }

        .bar div {
          width: 100%;
          background: linear-gradient(180deg, #22d3ee, #0ea5e9);
          border-radius: 16px 16px 0 0;
        }

        .bar span {
          font-size: 0.8rem;
          color: #cbd5f5;
        }

        table {
          width: 100%;
          border-collapse: collapse;
          font-size: 0.95rem;
        }

        th,
        td {
          padding: 0.55rem 0.25rem;
          text-align: left;
          border-bottom: 1px solid rgba(148, 163, 184, 0.2);
        }

        th {
          font-size: 0.8rem;
          letter-spacing: 0.2em;
          text-transform: uppercase;
          color: #94a3b8;
        }

        .detail-view {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(220px, 1fr));
          gap: 1rem;
        }

        .detail-view article {
          background: #0f172a;
          padding: 1.25rem;
          border-radius: 18px;
          border: 1px solid rgba(148, 163, 184, 0.2);
          position: relative;
        }

        .detail-view header h3 {
          margin: 0;
          font-size: 1rem;
        }

        .detail-view header p {
          margin: 0.3rem 0 1rem 0;
          color: #94a3b8;
          font-size: 0.85rem;
        }

        .detail-view p {
          margin: 0;
          color: #e2e8f0;
        }

        .chip {
          margin-top: 1rem;
          display: inline-flex;
          padding: 0.25rem 0.85rem;
          border-radius: 999px;
          background: rgba(34, 211, 238, 0.1);
          border: 1px solid rgba(34, 211, 238, 0.4);
          font-size: 0.75rem;
        }

        .detail-chart {
          grid-column: 1 / -1;
          background: #020617;
          padding: 1.25rem;
          border-radius: 20px;
          border: 1px solid rgba(148, 163, 184, 0.2);
        }

        .mini-chart {
          position: relative;
          height: 140px;
          margin-top: 0.5rem;
          background: linear-gradient(180deg, rgba(14, 165, 233, 0.2), rgba(2, 6, 23, 0));
          border-radius: 12px;
        }

        .mini-chart .dot {
          position: absolute;
          width: 16px;
          height: 16px;
          border-radius: 999px;
          background: #22d3ee;
          border: 2px solid #0f172a;
        }

        @media (max-width: 960px) {
          .layout-body {
            grid-template-columns: 1fr;
          }

          .filters-panel {
            order: 2;
          }
        }
      `}</style>
    </>
  )
}\n*** End Patch
