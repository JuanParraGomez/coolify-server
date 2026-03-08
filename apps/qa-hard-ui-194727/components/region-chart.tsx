'use client'

import { useEffect, useMemo, useState } from 'react'

type QuarterSnapshot = {
  quarter: string
  value: number
  change: string
  focus: string
  comparison: number
}

type DetailRow = {
  account: string
  amount: number
  stage: string
  closes: string
  priority: string
  description: string
  progress: string
}

type DetailTemplate = {
  accountSuffix: string
  amount: number
  stage: string
  closes: string
  priority: string
  description: string
  progress: string
}

type RegionEntry = {
  region: string
  year: number
  goal: number
  yearlyTrend: string
  pulse: string
  quarterly: QuarterSnapshot[]
  details: Record<string, DetailRow[]>
}

const detailTemplates: Record<string, DetailTemplate[]> = {
  Q1: [
    {
      accountSuffix: 'Laboratorio Áureo',
      amount: 125,
      stage: 'Ganado',
      closes: '15/03',
      priority: 'Alta',
      description: 'Expansión cross-border con garantía 24/7 en soporte técnico.',
      progress: 'Pipeline 82%',
    },
    {
      accountSuffix: 'Distribuidora Solarix',
      amount: 110,
      stage: 'En negociación',
      closes: '28/03',
      priority: 'Media',
      description: 'Logística optimizada para el canal retail.',
      progress: 'Pipeline 63%',
    },
    {
      accountSuffix: 'Distrito Industrial Norte',
      amount: 105,
      stage: 'Ganado',
      closes: '05/03',
      priority: 'Alta',
      description: 'Contrato marco con despliegue en 4 plantas.',
      progress: 'Pipeline 91%',
    },
  ],
  Q2: [
    {
      accountSuffix: 'Constructora Altura',
      amount: 140,
      stage: 'Ganado',
      closes: '14/06',
      priority: 'Alta',
      description: 'Integración de servicios administrados de energía.',
      progress: 'Pipeline 87%',
    },
    {
      accountSuffix: 'Retail Connect',
      amount: 118,
      stage: 'En negociación',
      closes: '26/05',
      priority: 'Media',
      description: 'Campañas regionales omnicanal.',
      progress: 'Pipeline 70%',
    },
    {
      accountSuffix: 'Servicios Norte Sur',
      amount: 110,
      stage: 'Propuesta',
      closes: '03/06',
      priority: 'Media',
      description: 'Servicios financieros digitales para flotillas.',
      progress: 'Pipeline 59%',
    },
  ],
  Q3: [
    {
      accountSuffix: 'Agroindustrias Boreal',
      amount: 150,
      stage: 'Ganado',
      closes: '11/09',
      priority: 'Alta',
      description: 'Digitalización de cadena de frío y sensores.',
      progress: 'Pipeline 96%',
    },
    {
      accountSuffix: 'ElectroLíneas',
      amount: 125,
      stage: 'En negociación',
      closes: '20/08',
      priority: 'Alta',
      description: 'Infraestructura para micro redes.',
      progress: 'Pipeline 74%',
    },
    {
      accountSuffix: 'Frontera Tech',
      amount: 115,
      stage: 'Propuesta',
      closes: '02/09',
      priority: 'Media',
      description: 'Transformación cloud para operaciones nocturnas.',
      progress: 'Pipeline 66%',
    },
  ],
  Q4: [
    {
      accountSuffix: 'Aeropuertos del Norte',
      amount: 160,
      stage: 'Ganado',
      closes: '17/12',
      priority: 'Alta',
      description: 'Modernización de salas VIP y data rooms.',
      progress: 'Pipeline 91%',
    },
    {
      accountSuffix: 'Minera Esmeralda',
      amount: 140,
      stage: 'En negociación',
      closes: '05/12',
      priority: 'Alta',
      description: 'Automatización de planta y telemetría.',
      progress: 'Pipeline 73%',
    },
    {
      accountSuffix: 'Puerto Central Norte',
      amount: 130,
      stage: 'Propuesta',
      closes: '28/11',
      priority: 'Media',
      description: 'Solución de trazabilidad para exportaciones.',
      progress: 'Pipeline 65%',
    },
  ],
}

const createDetailRows = (
  region: string,
  year: number,
  quarter: string,
  offset: number,
): DetailRow[] => {
  const templates = detailTemplates[quarter] ?? []
  return templates.map((template) => ({
    account: `${region} · ${template.accountSuffix}`,
    amount: Math.max(80, Math.round(template.amount + offset + (year === 2025 ? 6 : -4))),
    stage: template.stage,
    closes: `${template.closes} ${year}`,
    priority: template.priority,
    description: template.description,
    progress: template.progress,
  }))
}

const regionSales: RegionEntry[] = [
  {
    region: 'Norte',
    year: 2025,
    goal: 2050,
    yearlyTrend: 'Crecimiento sostenido en retail, manufactura ligera y energía verde.',
    pulse: 'Cierres cortos en accounts clave y alta demanda en servicios administrados.',
    quarterly: [
      { quarter: 'Q1', value: 480, change: '+12%', focus: 'Retail & Distribución', comparison: 445 },
      { quarter: 'Q2', value: 520, change: '+8%', focus: 'Servicios logísticos', comparison: 470 },
      { quarter: 'Q3', value: 560, change: '+5%', focus: 'Manufactura ligera', comparison: 515 },
      { quarter: 'Q4', value: 540, change: '+2%', focus: 'Energías limpias', comparison: 502 },
    ],
    details: {
      Q1: createDetailRows('Norte', 2025, 'Q1', 8),
      Q2: createDetailRows('Norte', 2025, 'Q2', 4),
      Q3: createDetailRows('Norte', 2025, 'Q3', 5),
      Q4: createDetailRows('Norte', 2025, 'Q4', 2),
    },
  },
  {
    region: 'Norte',
    year: 2024,
    goal: 1900,
    yearlyTrend: 'Consolidación de canales híbridos y despliegues de nuevas cuentas.',
    pulse: 'Pipeline estable con foco en manufactura y salud.',
    quarterly: [
      { quarter: 'Q1', value: 430, change: '+9%', focus: 'Retail & Distribución', comparison: 420 },
      { quarter: 'Q2', value: 460, change: '+6%', focus: 'Servicios logísticos', comparison: 440 },
      { quarter: 'Q3', value: 500, change: '+4%', focus: 'Manufactura ligera', comparison: 470 },
      { quarter: 'Q4', value: 480, change: '+1%', focus: 'Energías limpias', comparison: 455 },
    ],
    details: {
      Q1: createDetailRows('Norte', 2024, 'Q1', -4),
      Q2: createDetailRows('Norte', 2024, 'Q2', -6),
      Q3: createDetailRows('Norte', 2024, 'Q3', -3),
      Q4: createDetailRows('Norte', 2024, 'Q4', -5),
    },
  },
  {
    region: 'Centro',
    year: 2025,
    goal: 1980,
    yearlyTrend: 'Estrategia omnicanal con foco en capital humano y servicios financieros.',
    pulse: 'Up-sell agresivo y squads dedicados a cuentas contrastadas.',
    quarterly: [
      { quarter: 'Q1', value: 420, change: '+11%', focus: 'Fintech y servicios compartidos', comparison: 395 },
      { quarter: 'Q2', value: 470, change: '+9%', focus: 'Capital humano y BPO', comparison: 430 },
      { quarter: 'Q3', value: 510, change: '+7%', focus: 'Retail urbano', comparison: 460 },
      { quarter: 'Q4', value: 525, change: '+3%', focus: 'Gobierno y salud', comparison: 490 },
    ],
    details: {
      Q1: createDetailRows('Centro', 2025, 'Q1', 5),
      Q2: createDetailRows('Centro', 2025, 'Q2', 6),
      Q3: createDetailRows('Centro', 2025, 'Q3', 4),
      Q4: createDetailRows('Centro', 2025, 'Q4', 3),
    },
  },
  {
    region: 'Centro',
    year: 2024,
    goal: 1820,
    yearlyTrend: 'Fortalecimiento de relaciones con aliados clave y cierres estratégicos.',
    pulse: 'Flujo constante en sectores público y salud, menos presión en retail.',
    quarterly: [
      { quarter: 'Q1', value: 385, change: '+5%', focus: 'Fintech', comparison: 370 },
      { quarter: 'Q2', value: 430, change: '+4%', focus: 'BPO', comparison: 400 },
      { quarter: 'Q3', value: 470, change: '+3%', focus: 'Retail urbano', comparison: 435 },
      { quarter: 'Q4', value: 500, change: '+2%', focus: 'Gobierno', comparison: 455 },
    ],
    details: {
      Q1: createDetailRows('Centro', 2024, 'Q1', -5),
      Q2: createDetailRows('Centro', 2024, 'Q2', -3),
      Q3: createDetailRows('Centro', 2024, 'Q3', -2),
      Q4: createDetailRows('Centro', 2024, 'Q4', -4),
    },
  },
  {
    region: 'Sur',
    year: 2025,
    goal: 1750,
    yearlyTrend: 'Transición hacia energías limpias y proyectos de infraestructura social.',
    pulse: 'Creciente inversión en energía solar y manejo de cadenas largas.',
    quarterly: [
      { quarter: 'Q1', value: 390, change: '+10%', focus: 'Infraestructura social', comparison: 360 },
      { quarter: 'Q2', value: 435, change: '+8%', focus: 'Energía solar', comparison: 400 },
      { quarter: 'Q3', value: 470, change: '+6%', focus: 'Logística portuaria', comparison: 430 },
      { quarter: 'Q4', value: 495, change: '+4%', focus: 'Turismo y movilidad', comparison: 450 },
    ],
    details: {
      Q1: createDetailRows('Sur', 2025, 'Q1', 3),
      Q2: createDetailRows('Sur', 2025, 'Q2', 2),
      Q3: createDetailRows('Sur', 2025, 'Q3', 1),
      Q4: createDetailRows('Sur', 2025, 'Q4', 0),
    },
  },
  {
    region: 'Sur',
    year: 2024,
    goal: 1600,
    yearlyTrend: 'Proyectos de impacto comunitario y despliegues turísticos.',
    pulse: 'Más contratos públicos, menos volumen privado.',
    quarterly: [
      { quarter: 'Q1', value: 360, change: '+7%', focus: 'Infraestructura social', comparison: 340 },
      { quarter: 'Q2', value: 400, change: '+5%', focus: 'Energía solar', comparison: 375 },
      { quarter: 'Q3', value: 430, change: '+3%', focus: 'Logística portuaria', comparison: 400 },
      { quarter: 'Q4', value: 460, change: '+2%', focus: 'Turismo y movilidad', comparison: 422 },
    ],
    details: {
      Q1: createDetailRows('Sur', 2024, 'Q1', -2),
      Q2: createDetailRows('Sur', 2024, 'Q2', -3),
      Q3: createDetailRows('Sur', 2024, 'Q3', -1),
      Q4: createDetailRows('Sur', 2024, 'Q4', -4),
    },
  },
]

const formatValue = (value: number) =>
  new Intl.NumberFormat('es-MX', {
    maximumFractionDigits: 0,
  }).format(value)

export default function RegionChartDashboard() {
  const regions = useMemo(() => Array.from(new Set(regionSales.map((entry) => entry.region))), [])
  const years = useMemo(
    () => Array.from(new Set(regionSales.map((entry) => entry.year))).sort((a, b) => b - a),
    [],
  )
  const [selectedRegion, setSelectedRegion] = useState(regions[0] ?? 'Norte')
  const [selectedYear, setSelectedYear] = useState(years[0] ?? new Date().getFullYear())
  const [viewMode, setViewMode] = useState<'summary' | 'detail'>('summary')
  const [activeQuarter, setActiveQuarter] = useState('Q1')

  const snapshot = useMemo(
    () => regionSales.find((entry) => entry.region === selectedRegion && entry.year === selectedYear),
    [selectedRegion, selectedYear],
  )

  useEffect(() => {
    if (!snapshot) {
      return
    }
    if (!snapshot.quarterly.some((quarter) => quarter.quarter === activeQuarter)) {
      setActiveQuarter(snapshot.quarterly[0]?.quarter ?? 'Q1')
    }
  }, [snapshot, activeQuarter])

  const totalSales = snapshot?.quarterly.reduce((sum, quarter) => sum + quarter.value, 0) ?? 0
  const avgQuarterValue = snapshot ? Math.round(totalSales / snapshot.quarterly.length) : 0
  const goalProgress = snapshot ? Math.min(100, Math.round((totalSales / snapshot.goal) * 100)) : 0
  const maxQuarterValue = snapshot ? Math.max(...snapshot.quarterly.map((quarter) => quarter.value)) : 0
  const activeQuarterEntry =
    snapshot?.quarterly.find((quarter) => quarter.quarter === activeQuarter) ?? snapshot?.quarterly[0]
  const activeDetails = snapshot?.details[activeQuarter] ?? []

  const tableRows =
    snapshot?.quarterly.map((quarter) => ({
      quarter: quarter.quarter,
      own: quarter.value,
      benchmark: quarter.comparison,
      delta: quarter.value - quarter.comparison,
      change: quarter.change,
    })) ?? []

  if (!snapshot) {
    return <p>Datos de venta no disponibles.</p>
  }

  return (
    <section className="region-dashboard">
      <header className="dashboard-heading">
        <div>
          <p className="eyebrow">Ventas por región</p>
          <h1>Resumen {snapshot.region} — {snapshot.year}</h1>
          <p className="subhead">Filtros, gráficos y tabla comparativa por trimestre con navegación entre resumen y detalle.</p>
        </div>
        <div className="filters">
          <label>
            Región
            <select value={selectedRegion} onChange={(event) => setSelectedRegion(event.target.value)}>
              {regions.map((region) => (
                <option key={region}>{region}</option>
              ))}
            </select>
          </label>
          <label>
            Año
            <select value={selectedYear} onChange={(event) => setSelectedYear(Number(event.target.value))}>
              {years.map((year) => (
                <option key={year} value={year}>
                  {year}
                </option>
              ))}
            </select>
          </label>
        </div>
      </header>

      <div className="view-toggle">
        <button
          type="button"
          className={viewMode === 'summary' ? 'active' : ''}
          onClick={() => setViewMode('summary')}
        >
          Resumen
        </button>
        <button
          type="button"
          className={viewMode === 'detail' ? 'active' : ''}
          onClick={() => setViewMode('detail')}
        >
          Detalle
        </button>
      </div>

      {viewMode === 'summary' ? (
        <>
          <div className="summary-grid">
            <div className="chart-panel">
              <div className="panel-heading">
                <h2>Volumen trimestral</h2>
                <p>Selecciona un trimestre para filtrar el sabor del detalle.</p>
              </div>
              <div className="chart-bars">
                {snapshot.quarterly.map((quarter) => {
                  const width = maxQuarterValue ? (quarter.value / maxQuarterValue) * 100 : 0
                  const isActive = activeQuarter === quarter.quarter
                  return (
                    <button
                      key={quarter.quarter}
                      type="button"
                      className={`bar-row ${isActive ? 'active' : ''}`}
                      onClick={() => setActiveQuarter(quarter.quarter)}
                    >
                      <span className="quarter-label">{quarter.quarter}</span>
                      <div className="bar-outer">
                        <div className="bar-inner" style={{ width: `${width}%` }} />
                      </div>
                      <span className="value">{formatValue(quarter.value)}k</span>
                      <span className="change">{quarter.change}</span>
                    </button>
                  )
                })}
              </div>
              <p className="chart-footnote">Foco: {activeQuarterEntry?.focus}</p>
            </div>

            <div className="table-panel">
              <div className="panel-heading">
                <h2>Comparativa trimestral</h2>
                <p>Frente al promedio regional esperado.</p>
              </div>
              <div className="table-wrapper">
                <table>
                  <thead>
                    <tr>
                      <th>Trimestre</th>
                      <th>Mío</th>
                      <th>Benchmark</th>
                      <th>Delta</th>
                      <th>Variación</th>
                    </tr>
                  </thead>
                  <tbody>
                    {tableRows.map((row) => (
                      <tr
                        key={row.quarter}
                        className={row.quarter === activeQuarter ? 'active' : ''}
                        onClick={() => setActiveQuarter(row.quarter)}
                      >
                        <td>{row.quarter}</td>
                        <td>{formatValue(row.own)}k</td>
                        <td>{formatValue(row.benchmark)}k</td>
                        <td className={row.delta >= 0 ? 'positive' : 'negative'}>
                          {row.delta >= 0 ? '+' : ''}{formatValue(row.delta)}k
                        </td>
                        <td>{row.change}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>

          <div className="summary-highlights">
            <div className="summary-card">
              <p className="label">Cumplimiento de meta</p>
              <p className="value">{goalProgress}%</p>
              <p className="detail">
                {formatValue(totalSales)}k de {formatValue(snapshot.goal)}k previstos
              </p>
            </div>
            <div className="summary-card">
              <p className="label">Ticket promedio trimestral</p>
              <p className="value">{formatValue(avgQuarterValue)}k</p>
              <p className="detail">Average de {snapshot.quarterly.length} trimestres</p>
            </div>
            <div className="summary-card">
              <p className="label">Pulso regional</p>
              <p className="value">{snapshot.pulse}</p>
              <p className="detail">{snapshot.yearlyTrend}</p>
            </div>
          </div>
        </>
      ) : (
        <div className="detail-grid">
          <div className="detail-column">
            <div className="panel-heading">
              <h2>Detalle por trimestre</h2>
              <p>Saca insights accionables para {activeQuarter}.</p>
            </div>
            <p className="detail-summary">
              {activeQuarterEntry?.focus ?? 'Sin foco asignado'} | Meta del trimestre: {formatValue(activeQuarterEntry?.value ?? 0)}k
            </p>
            <ul className="detail-list">
              {activeDetails.map((detail) => (
                <li key={`${detail.account}-${detail.closes}`}>
                  <div>
                    <p className="account">{detail.account}</p>
                    <p className="stage">{detail.stage} · {detail.priority}</p>
                    <p className="description">{detail.description}</p>
                  </div>
                  <div className="detail-meta">
                    <span className="amount">${formatValue(detail.amount)}k</span>
                    <span className="closes">Cierre {detail.closes}</span>
                    <span className="progress">{detail.progress}</span>
                  </div>
                </li>
              ))}
            </ul>
          </div>
          <div className="detail-column metrics">
            <div className="panel-heading">
              <h3>Resumen rápido</h3>
            </div>
            <div className="detail-metrics">
              <div>
                <p className="label">Total trimestral</p>
                <p className="value">{formatValue(activeQuarterEntry?.value ?? 0)}k</p>
              </div>
              <div>
                <p className="label">Cambio frente a benchmark</p>
                <p className="value">
                  {activeQuarterEntry
                    ? `${activeQuarterEntry.value - (tableRows.find((row) => row.quarter === activeQuarter)?.benchmark ?? 0) >= 0 ? '+' : ''}${formatValue(
                        activeQuarterEntry.value -
                          (tableRows.find((row) => row.quarter === activeQuarter)?.benchmark ?? 0),
                      )}k`
                    : '—'}
                </p>
              </div>
              <div>
                <p className="label">Tendencia</p>
                <p className="value">{activeQuarterEntry?.change}</p>
              </div>
            </div>
            <div className="detail-metrics timeline">
              <p className="label">Narrativa</p>
              <p>{snapshot.yearlyTrend}</p>
              <p className="detail">Switch entre resumen y detalle para navegar entre ambos niveles.</p>
            </div>
          </div>
        </div>
      )}

      <style jsx>{`
        .region-dashboard {
          margin: 0 auto;
          max-width: 1100px;
          padding: 2.5rem;
          border-radius: 1.5rem;
          background: #ffffff;
          box-shadow: 0 10px 35px rgba(15, 23, 42, 0.1);
          font-family: 'Inter', system-ui, sans-serif;
          color: #0f172a;
        }

        .dashboard-heading {
          display: flex;
          justify-content: space-between;
          gap: 1.5rem;
          margin-bottom: 1.5rem;
        }

        .eyebrow {
          letter-spacing: 0.2em;
          text-transform: uppercase;
          color: #475569;
          font-size: 0.75rem;
          margin-bottom: 0.35rem;
        }

        h1 {
          margin: 0;
          font-size: 1.9rem;
        }

        .subhead {
          color: #475569;
          margin: 0.35rem 0 0;
        }

        .filters {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(140px, 1fr));
          gap: 0.75rem;
          align-items: end;
        }

        label {
          font-size: 0.9rem;
          color: #475569;
        }

        select {
          width: 100%;
          margin-top: 0.3rem;
          border: 1px solid #e2e8f0;
          border-radius: 0.75rem;
          padding: 0.55rem 0.8rem;
          font-size: 0.95rem;
          background: #f8fafc;
          color: #0f172a;
        }

        .view-toggle {
          display: inline-flex;
          border-radius: 999px;
          border: 1px solid #e2e8f0;
          overflow: hidden;
          margin-bottom: 1.5rem;
        }

        .view-toggle button {
          border: none;
          background: none;
          padding: 0.45rem 1.2rem;
          font-size: 0.95rem;
          cursor: pointer;
          transition: background 0.2s ease;
        }

        .view-toggle button.active {
          background: #0f172a;
          color: #fff;
        }

        .summary-grid {
          display: grid;
          grid-template-columns: 1.4fr 1fr;
          gap: 1.5rem;
          margin-bottom: 1.5rem;
        }

        .chart-panel,
        .table-panel {
          background: #f8fafc;
          border-radius: 1rem;
          padding: 1.25rem;
          border: 1px solid #e2e8f0;
        }

        .panel-heading h2 {
          margin: 0;
          font-size: 1.15rem;
        }

        .panel-heading p {
          margin: 0.25rem 0 0;
          color: #475569;
          font-size: 0.85rem;
        }

        .chart-bars {
          display: flex;
          flex-direction: column;
          gap: 0.85rem;
          margin-top: 1rem;
        }

        .bar-row {
          display: grid;
          grid-template-columns: 80px 1fr 80px 70px;
          align-items: center;
          gap: 0.75rem;
          background: #fff;
          border-radius: 0.75rem;
          padding: 0.6rem 0.8rem;
          border: 1px solid transparent;
          cursor: pointer;
        }

        .bar-row.active {
          border-color: #0f172a;
        }

        .bar-outer {
          height: 10px;
          border-radius: 999px;
          background: #e2e8f0;
          overflow: hidden;
        }

        .bar-inner {
          height: 100%;
          background: linear-gradient(90deg, #2563eb, #1e40af);
          border-radius: 999px;
        }

        .quarter-label {
          font-weight: 600;
        }

        .value {
          font-weight: 600;
          color: #0f172a;
        }

        .change {
          color: #2563eb;
          font-size: 0.85rem;
        }

        .chart-footnote {
          font-size: 0.85rem;
          color: #475569;
          margin-top: 0.85rem;
        }

        .table-wrapper {
          overflow-x: auto;
        }

        table {
          width: 100%;
          border-collapse: collapse;
          font-size: 0.85rem;
        }

        th,
        td {
          padding: 0.65rem 0.35rem;
          text-align: left;
          border-bottom: 1px solid #e2e8f0;
        }

        tbody tr:hover {
          background: #fff;
        }

        tbody tr.active {
          background: #e0f2fe;
        }

        td.positive {
          color: #16a34a;
        }

        td.negative {
          color: #dc2626;
        }

        .summary-highlights {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
          gap: 1rem;
        }

        .summary-card {
          padding: 1rem;
          border-radius: 1rem;
          border: 1px solid #e2e8f0;
          background: #fff;
        }

        .summary-card .label {
          text-transform: uppercase;
          font-size: 0.75rem;
          color: #64748b;
          margin: 0;
        }

        .summary-card .value {
          margin: 0.35rem 0;
          font-size: 1.3rem;
          font-weight: 600;
        }

        .summary-card .detail {
          margin: 0;
          color: #475569;
          font-size: 0.85rem;
        }

        .detail-grid {
          margin-top: 1.25rem;
          display: grid;
          grid-template-columns: 1.3fr 0.8fr;
          gap: 1rem;
        }

        .detail-column {
          background: #f8fafc;
          border-radius: 1rem;
          padding: 1.2rem;
          border: 1px solid #e2e8f0;
        }

        .detail-summary {
          font-size: 0.9rem;
          color: #475569;
          margin-bottom: 1rem;
        }

        .detail-list {
          list-style: none;
          padding: 0;
          margin: 0;
          display: flex;
          flex-direction: column;
          gap: 0.9rem;
        }

        .detail-list li {
          display: flex;
          justify-content: space-between;
          gap: 1rem;
          padding: 0.9rem;
          border-radius: 0.9rem;
          background: #fff;
          border: 1px solid #e2e8f0;
        }

        .account {
          margin: 0;
          font-weight: 600;
        }

        .stage,
        .description {
          margin: 0;
          color: #475569;
          font-size: 0.85rem;
        }

        .detail-meta {
          text-align: right;
          display: flex;
          flex-direction: column;
          gap: 0.25rem;
          font-size: 0.85rem;
          color: #0f172a;
        }

        .detail-column.metrics .detail-metrics {
          background: #fff;
          padding: 1rem;
          border-radius: 0.9rem;
          border: 1px solid #e2e8f0;
          display: flex;
          flex-direction: column;
          gap: 0.75rem;
          margin-bottom: 1rem;
        }

        .detail-column.metrics .detail-metrics div {
          display: flex;
          flex-direction: column;
        }

        .detail-column.metrics .detail-metrics .label {
          margin: 0;
          color: #475569;
          font-size: 0.75rem;
        }

        .detail-column.metrics .detail-metrics .value {
          margin: 0.15rem 0 0;
          font-size: 1rem;
          font-weight: 600;
        }

        .detail-column.metrics .timeline {
          background: #fff;
          border-radius: 0.9rem;
          border: 1px solid #e2e8f0;
          padding: 1rem;
        }

        .detail-column.metrics .timeline .detail {
          margin-top: 0.4rem;
        }

        @media (max-width: 960px) {
          .summary-grid,
          .detail-grid {
            grid-template-columns: 1fr;
          }

          .detail-column.metrics .detail-metrics {
            flex-direction: column;
          }
        }
      `}</style>
    </section>
  )
}
