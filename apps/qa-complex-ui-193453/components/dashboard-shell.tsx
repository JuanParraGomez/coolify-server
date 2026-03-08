const navSections = [
  { label: 'Visión general', hint: 'KPIs & alertas' },
  { label: 'Ventas por región', hint: 'Mapa territorial' },
  { label: 'Comparativas trimestrales', hint: 'Benchmark' },
  { label: 'Insights predictivos', hint: 'Modelo de demanda' },
]

const regionFilters = ['Norte', 'Centro', 'Sur', 'Internacional']
const channelFilters = ['Retail', 'Mayorista', 'E-commerce']
const scenarioFilters = ['Plan actual', 'Escenario optimizado', 'Escenario conservador']

const kpiCards = [
  {
    label: 'Ingresos TTM',
    value: '$89.3M',
    trend: '+12.5% vs mismo periodo',
    description: 'Por encima del objetivo anual',
  },
  {
    label: 'Ticket promedio',
    value: '$1,240',
    trend: '+4.6% QoQ',
    description: 'Impulsado por e-commerce norteño',
  },
  {
    label: 'Margen operativo',
    value: '28.7%',
    trend: '+220 bps vs plan',
    description: 'Efficiencia logística mejorada',
  },
]

const quarterlyComparisons = [
  { quarter: 'Q4 2025', value: '$27.1M', delta: '+9.3%', context: 'Impulso en exportaciones' },
  { quarter: 'Q3 2025', value: '$24.8M', delta: '+6.1%', context: 'Promociones regionales' },
  { quarter: 'Q2 2025', value: '$22.5M', delta: '-0.6%', context: 'Fuerte competencia UCG' },
  { quarter: 'Q1 2025', value: '$21.0M', delta: '-2.2%', context: 'Tránsito por ajuste de precios' },
]

const drillDownRows = [
  {
    region: 'Norte',
    revenue: '$34.2M',
    growth: '+8.4%',
    depth: 'Nivel 2: Ciudad de México, Monterrey',
  },
  {
    region: 'Centro',
    revenue: '$22.8M',
    growth: '+5.1%',
    depth: 'Nivel 2: Querétaro, Puebla',
  },
  {
    region: 'Sur',
    revenue: '$18.7M',
    growth: '+2.9%',
    depth: 'Nivel 2: Mérida, Oaxaca',
  },
  {
    region: 'Internacional',
    revenue: '$14.1M',
    growth: '+12.0%',
    depth: 'Nivel 2: Miami, Bogotá',
  },
]

export default function DashboardShell() {
  return (
    <div className="dashboard-shell">
      <aside className="sidebar">
        <div className="brand">
          <span>Atlas Ventas</span>
          <small>Analítica por región</small>
        </div>
        <nav>
          {navSections.map((item) => (
            <button key={item.label} className="nav-link">
              <span>{item.label}</span>
              <small>{item.hint}</small>
            </button>
          ))}
        </nav>
        <div className="filters">
          <p className="filters__label">Filtros avanzados</p>
          <div>
            <p>Región</p>
            <div className="chip-row">
              {regionFilters.map((region) => (
                <span key={region} className="chip">
                  {region}
                </span>
              ))}
            </div>
          </div>
          <div>
            <p>Canal</p>
            <div className="chip-row">
              {channelFilters.map((channel) => (
                <span key={channel} className="chip">
                  {channel}
                </span>
              ))}
            </div>
          </div>
          <div>
            <p>Escenario</p>
            <div className="chip-row">
              {scenarioFilters.map((scenario) => (
                <span key={scenario} className="chip">
                  {scenario}
                </span>
              ))}
            </div>
          </div>
        </div>
      </aside>
      <main className="main">
        <header className="main__header">
          <div>
            <p className="eyebrow">Actualizado hace 12 min</p>
            <h1>Analítica regional en tiempo real</h1>
            <p className="subhead">
              Monitorea ventas por región, analiza comparativas trimestrales y desglosa las rutas de crecimiento.
            </p>
          </div>
          <div className="header-actions">
            <button className="ghost">Compartir reporte</button>
            <button className="primary">Exportar insights</button>
          </div>
        </header>
        <section className="kpi-grid">
          {kpiCards.map((card) => (
            <article key={card.label} className="kpi-card">
              <p className="kpi-label">{card.label}</p>
              <h2>{card.value}</h2>
              <p className="kpi-trend">{card.trend}</p>
              <p className="kpi-desc">{card.description}</p>
            </article>
          ))}
        </section>
        <section className="content-grid">
          <article className="panel chart-panel">
            <div className="panel__header">
              <h3>Proyección de ventas por región</h3>
              <span>Comparativa mensual</span>
            </div>
            <div className="chart-bars">
              {[80, 65, 90, 55].map((width, index) => (
                <div key={index} className="bar" style={{ width: `${width}%` }}>
                  <span>Region {index + 1}</span>
                </div>
              ))}
            </div>
          </article>
          <article className="panel chart-panel">
            <div className="panel__header">
              <h3>Alertas predictivas</h3>
              <span>Modelos de demanda</span>
            </div>
            <div className="sparkline">
              <span />
              <span />
              <span />
              <span />
              <span />
              <span />
            </div>
            <p className="sparkline__desc">El modelo espera +6% en el Norte si se mantiene el ritmo de descuento.</p>
          </article>
        </section>
        <section className="grid-with-table">
          <article className="panel table-panel">
            <div className="panel__header">
              <h3>Ventas con drill-down</h3>
              <span>Profundiza hasta la ciudad</span>
            </div>
            <table>
              <thead>
                <tr>
                  <th>Región</th>
                  <th>Ingresos</th>
                  <th>Crecimiento</th>
                  <th>Profundidad</th>
                  <th>Acciones</th>
                </tr>
              </thead>
              <tbody>
                {drillDownRows.map((row) => (
                  <tr key={row.region}>
                    <td>{row.region}</td>
                    <td>{row.revenue}</td>
                    <td>{row.growth}</td>
                    <td>
                      <small>{row.depth}</small>
                    </td>
                    <td>
                      <button aria-label={`Explorar ${row.region}`} className="link-button">
                        Ver detalle →
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </article>
          <article className="panel compare-panel">
            <div className="panel__header">
              <h3>Comparativas trimestrales</h3>
              <span>Cartera y benchmarks</span>
            </div>
            <ul>
              {quarterlyComparisons.map((item) => (
                <li key={item.quarter}>
                  <div>
                    <p>{item.quarter}</p>
                    <h4>{item.value}</h4>
                  </div>
                  <div>
                    <span className="delta">{item.delta}</span>
                    <small>{item.context}</small>
                  </div>
                </li>
              ))}
            </ul>
          </article>
        </section>
      </main>
      <style jsx>{`
        .dashboard-shell {
          display: grid;
          grid-template-columns: 280px 1fr;
          min-height: 100vh;
          gap: 1.5rem;
          padding: 1.5rem;
        }

        .sidebar {
          background: rgba(12, 18, 40, 0.85);
          border: 1px solid rgba(255, 255, 255, 0.05);
          border-radius: 1rem;
          padding: 1.5rem;
          display: flex;
          flex-direction: column;
          gap: 1.5rem;
        }

        .brand {
          font-weight: 700;
          text-transform: uppercase;
          letter-spacing: 0.1em;
        }

        .brand small {
          display: block;
          margin-top: 0.25rem;
          color: rgba(255, 255, 255, 0.65);
          text-transform: none;
        }

        nav {
          display: flex;
          flex-direction: column;
          gap: 0.5rem;
        }

        .nav-link {
          background: rgba(255, 255, 255, 0.02);
          color: inherit;
          border-radius: 0.75rem;
          border: none;
          padding: 0.9rem 1.1rem;
          text-align: left;
          display: flex;
          flex-direction: column;
          gap: 0.25rem;
          cursor: pointer;
          transition: background 0.2s ease;
        }

        .nav-link:hover {
          background: rgba(255, 255, 255, 0.08);
        }

        .nav-link small {
          font-size: 0.7rem;
          color: rgba(255, 255, 255, 0.6);
        }

        .filters {
          display: flex;
          flex-direction: column;
          gap: 1rem;
        }

        .filters__label {
          letter-spacing: 0.2em;
          font-size: 0.75rem;
          color: rgba(255, 255, 255, 0.55);
        }

        .chip-row {
          display: flex;
          flex-wrap: wrap;
          gap: 0.5rem;
          margin-top: 0.35rem;
        }

        .chip {
          padding: 0.35rem 0.75rem;
          border-radius: 999px;
          border: 1px solid rgba(255, 255, 255, 0.2);
          font-size: 0.75rem;
          background: transparent;
        }

        .main {
          display: flex;
          flex-direction: column;
          gap: 1.5rem;
        }

        .main__header {
          display: flex;
          justify-content: space-between;
          align-items: flex-start;
          gap: 2rem;
        }

        .main__header h1 {
          margin: 0.5rem 0;
          font-size: clamp(1.75rem, 2vw, 2.25rem);
        }

        .eyebrow {
          text-transform: uppercase;
          letter-spacing: 0.2em;
          font-size: 0.7rem;
          color: rgba(255, 255, 255, 0.6);
          margin: 0;
        }

        .subhead {
          margin: 0;
          max-width: 520px;
          color: rgba(255, 255, 255, 0.65);
        }

        .header-actions {
          display: flex;
          gap: 0.75rem;
        }

        .ghost,
        .primary,
        .link-button {
          border-radius: 999px;
          border: 1px solid rgba(255, 255, 255, 0.3);
          padding: 0.65rem 1.25rem;
          background: transparent;
          color: inherit;
          font-weight: 600;
          cursor: pointer;
        }

        .primary {
          background: linear-gradient(135deg, #5eead4, #38bdf8);
          border: none;
          color: #0f172a;
        }

        .kpi-grid {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
          gap: 1rem;
        }

        .kpi-card {
          background: rgba(15, 23, 42, 0.85);
          border-radius: 1rem;
          padding: 1.25rem;
          border: 1px solid rgba(255, 255, 255, 0.05);
          min-height: 150px;
        }

        .kpi-label {
          margin: 0;
          text-transform: uppercase;
          letter-spacing: 0.25em;
          font-size: 0.7rem;
          color: rgba(255, 255, 255, 0.5);
        }

        .kpi-card h2 {
          margin: 0.5rem 0 0.25rem;
          font-size: 1.6rem;
        }

        .kpi-trend {
          margin: 0;
          color: #0ec2e0;
        }

        .kpi-desc {
          margin: 0.5rem 0 0;
          font-size: 0.85rem;
          color: rgba(255, 255, 255, 0.55);
        }

        .content-grid {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(280px, 1fr));
          gap: 1rem;
        }

        .panel {
          background: rgba(15, 23, 42, 0.85);
          border-radius: 1rem;
          border: 1px solid rgba(255, 255, 255, 0.08);
          padding: 1.25rem;
          display: flex;
          flex-direction: column;
          gap: 1rem;
        }

        .panel__header {
          display: flex;
          justify-content: space-between;
          align-items: center;
          gap: 1rem;
        }

        .panel__header h3 {
          margin: 0;
        }

        .panel__header span {
          color: rgba(255, 255, 255, 0.6);
          font-size: 0.85rem;
        }

        .chart-bars {
          display: flex;
          flex-direction: column;
          gap: 0.75rem;
        }

        .bar {
          height: 1.75rem;
          border-radius: 0.75rem;
          background: linear-gradient(135deg, rgba(59, 130, 246, 0.2), rgba(59, 130, 246, 0.8));
          display: flex;
          align-items: center;
          justify-content: space-between;
          padding: 0 1rem;
          font-size: 0.85rem;
        }

        .sparkline {
          display: flex;
          justify-content: space-between;
          gap: 0.5rem;
        }

        .sparkline span {
          flex: 1;
          height: 60px;
          border-radius: 10px;
          background: linear-gradient(180deg, rgba(16, 185, 129, 0.8), rgba(16, 185, 129, 0.2));
        }

        .sparkline__desc {
          margin: 0;
          color: rgba(255, 255, 255, 0.6);
          font-size: 0.85rem;
        }

        .grid-with-table {
          display: grid;
          grid-template-columns: 2fr 1fr;
          gap: 1rem;
        }

        .table-panel table {
          width: 100%;
          border-collapse: collapse;
          color: inherit;
          font-size: 0.9rem;
        }

        th,
        td {
          padding: 0.6rem 0;
          border-bottom: 1px solid rgba(255, 255, 255, 0.05);
        }

        th {
          text-transform: uppercase;
          font-size: 0.65rem;
          letter-spacing: 0.2em;
          color: rgba(255, 255, 255, 0.5);
        }

        .link-button {
          background: transparent;
          border: none;
          padding: 0;
          color: #38bdf8;
          font-weight: 600;
        }

        .compare-panel ul {
          list-style: none;
          padding: 0;
          margin: 0;
          display: flex;
          flex-direction: column;
          gap: 0.75rem;
        }

        .compare-panel li {
          display: flex;
          justify-content: space-between;
          align-items: center;
          gap: 1rem;
          padding: 0.75rem 0;
          border-bottom: 1px solid rgba(255, 255, 255, 0.05);
        }

        .compare-panel li:last-child {
          border-bottom: none;
        }

        .compare-panel h4 {
          margin: 0;
          font-size: 1.25rem;
        }

        .delta {
          color: #4ade80;
          font-weight: 600;
        }

        @media (max-width: 960px) {
          .dashboard-shell {
            grid-template-columns: 1fr;
          }

          .grid-with-table {
            grid-template-columns: 1fr;
          }

          .main__header {
            flex-direction: column;
          }
        }
      `}</style>
    </div>
  )
}
