'use client'

import { useMemo, useState } from 'react'

type SectionTab = 'resumen' | 'detalle'

const regions = ['Norte', 'Centro', 'Sur', 'Occidente']
const quarters = ['Q1 2025', 'Q2 2025', 'Q3 2025', 'Q4 2025']

const regionSales = [
  { region: 'Norte', bonus: 4.2, trend: '+6.2%' },
  { region: 'Centro', bonus: 3.8, trend: '+4.6%' },
  { region: 'Sur', bonus: 3.1, trend: '+2.1%' },
  { region: 'Occidente', bonus: 2.6, trend: '+1.8%' },
]

const quarterlyComparison = [
  { region: 'Norte', values: [820000, 910000, 970000, 1040000] },
  { region: 'Centro', values: [710000, 780000, 840000, 910000] },
  { region: 'Sur', values: [590000, 640000, 680000, 720000] },
  { region: 'Occidente', values: [470000, 520000, 560000, 600000] },
]

const detailHighlights = [
  {
    label: 'Canal digital',
    value: '+12.4% vs. anterior',
    description: 'Ventas por eCommerce y tiendas sociales continúan liderando crecimiento en Q4.',
  },
  {
    label: 'Canal retail',
    value: '+3.5% vs. anterior',
    description: 'Tiendas propias se reponen tras campañas de fidelización y mejoras de inventario.',
  },
  {
    label: 'Distribución',
    value: '+18% vs. promedio',
    description: 'Alianzas regionales impulsan volúmenes recurrentes en los corredores logísticos clave.',
  },
]

const summaryStats = [
  { label: 'Ingresos acumulados', value: '$12.4M', delta: '+8.1% vs. 2024' },
  { label: 'Ticket promedio', value: '$413', delta: '+2.9% vs. Q3' },
  { label: 'Cierre de pipeline', value: '82% (riesgo moderado)', delta: 'Generación de leads +14%' },
]

export default function DashboardShell() {
  const [activeSection, setActiveSection] = useState<SectionTab>('resumen')
  const [selectedRegion, setSelectedRegion] = useState(regions[0])
  const [selectedQuarter, setSelectedQuarter] = useState(quarters[3])

  const regionDetail = useMemo(
    () => quarterlyComparison.find((entry) => entry.region === selectedRegion),
    [selectedRegion]
  )

  const salesTrend = useMemo(() => {
    const values = regionDetail?.values ?? []
    const max = Math.max(...values, 1)
    return values.map((value) => Math.round((value / max) * 100))
  }, [regionDetail])

  return (
    <main
      style={{
        minHeight: '100vh',
        padding: '2rem clamp(1rem, 3vw, 2.25rem)',
        background: 'linear-gradient(180deg, #050914, #0f172a)',
        color: '#f8fafc',
      }}
    >
      <div
        style={{
          maxWidth: '1200px',
          margin: '0 auto',
          display: 'flex',
          flexDirection: 'column',
          gap: '1.5rem',
        }}
      >
        <section style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end' }}>
          <div>
            <p style={{ margin: 0, color: '#94a3b8', textTransform: 'uppercase', letterSpacing: '0.2em' }}>
              Reporte comercial
            </p>
            <h1 style={{ margin: '0.25rem 0 0', fontSize: 'clamp(2rem, 3vw, 2.75rem)' }}>
              Dashboard de ventas por región
            </h1>
          </div>
          <div
            style={{
              padding: '0.6rem 1rem',
              borderRadius: 99,
              border: '1px solid rgba(255,255,255,0.2)',
              fontSize: '0.9rem',
              color: '#e0f2fe',
            }}
          >
            Actualizado {new Date().toLocaleDateString('es-ES', { month: 'long', day: 'numeric', year: 'numeric' })}
          </div>
        </section>

        <div
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
            gap: '1rem',
          }}
        >
          {summaryStats.map((stat) => (
            <article
              key={stat.label}
              style={{
                padding: '1.25rem',
                borderRadius: '1rem',
                background: 'rgba(15, 23, 42, 0.85)',
                border: '1px solid rgba(148, 163, 184, 0.3)',
                display: 'flex',
                flexDirection: 'column',
                gap: '0.5rem',
              }}
            >
              <span style={{ fontSize: '0.8rem', color: '#94a3b8' }}>{stat.label}</span>
              <strong style={{ fontSize: '1.9rem', lineHeight: 1 }}>{stat.value}</strong>
              <span style={{ fontSize: '0.85rem', color: '#a5f3fc' }}>{stat.delta}</span>
            </article>
          ))}
        </div>

        <div
          style={{
            padding: '1rem',
            borderRadius: '1.25rem',
            background: 'rgba(15, 23, 42, 0.7)',
            border: '1px solid rgba(148, 163, 184, 0.25)',
            display: 'flex',
            flexDirection: 'column',
            gap: '1rem',
          }}
        >
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: '1rem', justifyContent: 'space-between' }}>
            <label style={{ display: 'flex', flexDirection: 'column', gap: '0.35rem', minWidth: '180px' }}>
              Región
              <select
                value={selectedRegion}
                onChange={(event) => setSelectedRegion(event.target.value)}
                style={{
                  borderRadius: '0.75rem',
                  padding: '0.65rem 0.8rem',
                  border: '1px solid rgba(148, 163, 184, 0.4)',
                  background: '#0f172a',
                  color: '#f8fafc',
                  fontSize: '1rem',
                }}
              >
                {regions.map((region) => (
                  <option key={region} value={region}>
                    {region}
                  </option>
                ))}
              </select>
            </label>

            <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.5rem', alignItems: 'center' }}>
              <span style={{ color: '#94a3b8' }}>Trimestre</span>
              {quarters.map((quarter) => (
                <button
                  key={quarter}
                  onClick={() => setSelectedQuarter(quarter)}
                  style={{
                    padding: '0.5rem 1rem',
                    borderRadius: '0.75rem',
                    border: 'none',
                    background:
                      selectedQuarter === quarter ? 'linear-gradient(135deg, #22d3ee, #6366f1)' : 'rgba(148, 163, 184, 0.12)',
                    color: selectedQuarter === quarter ? '#030712' : '#f8fafc',
                    cursor: 'pointer',
                  }}
                >
                  {quarter}
                </button>
              ))}
            </div>
          </div>

          <nav style={{ display: 'flex', gap: '0.75rem' }}>
            {[{ id: 'resumen', label: 'Resumen regional' }, { id: 'detalle', label: 'Detalle por canal' }].map((tab) => (
              <button
                key={tab.id}
                type="button"
                onClick={() => setActiveSection(tab.id as SectionTab)}
                style={{
                  flex: 1,
                  padding: '0.75rem 1rem',
                  borderRadius: '0.75rem',
                  border: activeSection === tab.id ? '1px solid #22d3ee' : '1px solid transparent',
                  background: activeSection === tab.id ? 'rgba(34, 211, 238, 0.15)' : 'transparent',
                  color: '#f8fafc',
                  fontWeight: 500,
                  cursor: 'pointer',
                }}
              >
                {tab.label}
              </button>
            ))}
          </nav>

          {activeSection === 'resumen' ? (
            <section style={{ display: 'grid', gap: '1rem' }}>
              <div
                style={{
                  display: 'grid',
                  gridTemplateColumns: 'repeat(auto-fit, minmax(230px, 1fr))',
                  gap: '1rem',
                }}
              >
                <article
                  style={{
                    padding: '1rem',
                    borderRadius: '1rem',
                    background: 'rgba(30, 41, 59, 0.8)',
                    border: '1px solid rgba(148, 163, 184, 0.3)',
                  }}
                >
                  <p style={{ margin: 0, color: '#94a3b8', fontSize: '0.85rem' }}>Tendencia trimestral</p>
                  <div style={{ margin: '0.5rem 0 0', display: 'flex', gap: '0.5rem', height: '110px', alignItems: 'flex-end' }}>
                    {salesTrend.map((value, index) => (
                      <div
                        key={index}
                        style={{
                          flex: 1,
                          minHeight: `${value}%`,
                          background: 'linear-gradient(180deg, #22d3ee, #6366f1)',
                          borderRadius: '0.65rem',
                        }}
                        title={`
${quarters[index]} · ${regionDetail?.values[index]?.toLocaleString('es-ES')} USD
`}
                      />
                    ))}
                  </div>
                  <p style={{ margin: '0.75rem 0 0', fontSize: '0.85rem', color: '#cbd5f5' }}>
                    {selectedRegion} · Trimestre seleccionado: {selectedQuarter}
                  </p>
                </article>

                <article
                  style={{
                    padding: '1rem',
                    borderRadius: '1rem',
                    background: 'rgba(30, 41, 59, 0.8)',
                    border: '1px solid rgba(148, 163, 184, 0.3)',
                    display: 'flex',
                    flexDirection: 'column',
                    gap: '0.35rem',
                  }}
                >
                  <p style={{ margin: 0, color: '#94a3b8', fontSize: '0.85rem' }}>Performance regional</p>
                  <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.75rem', marginTop: '0.5rem' }}>
                    {regionSales.map((region) => (
                      <div
                        key={region.region}
                        style={{
                          flex: '1 1 120px',
                          padding: '0.5rem 0.75rem',
                          borderRadius: '0.8rem',
                          background: '#01030a',
                          border: '1px solid rgba(148, 163, 184, 0.25)',
                        }}
                      >
                        <p style={{ margin: 0, fontSize: '0.75rem', color: '#94a3b8' }}>{region.region}</p>
                        <p style={{ margin: '0.25rem 0 0', fontWeight: 600, fontSize: '1.2rem' }}>${region.bonus}M</p>
                        <p style={{ margin: 0, fontSize: '0.8rem', color: '#a5f3fc' }}>{region.trend}</p>
                      </div>
                    ))}
                  </div>
                </article>
              </div>

              <article
                style={{
                  padding: '1rem',
                  borderRadius: '1.25rem',
                  background: 'rgba(15, 23, 42, 0.75)',
                  border: '1px solid rgba(148, 163, 184, 0.25)',
                }}
              >
                <h2 style={{ margin: '0 0 0.75rem', fontSize: '1.2rem' }}>Tabla comparativa por trimestre</h2>
                <div style={{ overflowX: 'auto' }}>
                  <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '0.9rem' }}>
                    <thead>
                      <tr>
                        <th style={{ textAlign: 'left', padding: '0.75rem 0.5rem', color: '#94a3b8' }}>Región</th>
                        {quarters.map((quarter) => (
                          <th key={quarter} style={{ padding: '0.75rem 0.5rem', color: '#94a3b8' }}>
                            {quarter}
                          </th>
                        ))}
                      </tr>
                    </thead>
                    <tbody>
                      {quarterlyComparison.map((entry) => (
                        <tr
                          key={entry.region}
                          style={{ borderTop: '1px solid rgba(148, 163, 184, 0.2)' }}
                        >
                          <td style={{ padding: '0.65rem 0.5rem' }}>{entry.region}</td>
                          {entry.values.map((value, index) => (
                            <td key={`${entry.region}-${index}`} style={{ padding: '0.65rem 0.5rem', textAlign: 'center' }}>
                              {value.toLocaleString('es-ES', { maximumFractionDigits: 0 })}
                            </td>
                          ))}
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </article>
            </section>
          ) : (
            <section style={{ display: 'grid', gap: '1rem' }}>
              <article
                style={{
                  padding: '1.25rem',
                  borderRadius: '1.25rem',
                  background: 'rgba(15, 23, 42, 0.75)',
                  border: '1px solid rgba(148, 163, 184, 0.25)',
                  display: 'grid',
                  gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))',
                  gap: '1rem',
                }}
              >
                {detailHighlights.map((highlight) => (
                  <div key={highlight.label}>
                    <p style={{ margin: 0, color: '#94a3b8', fontSize: '0.85rem' }}>{highlight.label}</p>
                    <p style={{ margin: '0.35rem 0', fontSize: '1.4rem', fontWeight: 600 }}>{highlight.value}</p>
                    <p style={{ margin: 0, color: '#cbd5f5', fontSize: '0.9rem' }}>{highlight.description}</p>
                  </div>
                ))}
              </article>

              <article
                style={{
                  padding: '1.25rem',
                  borderRadius: '1.25rem',
                  background: 'rgba(15, 23, 42, 0.75)',
                  border: '1px solid rgba(148, 163, 184, 0.25)',
                }}
              >
                <p style={{ margin: 0, color: '#94a3b8' }}>KPIs del trimestre</p>
                <ul style={{ margin: '0.75rem 0 0', paddingLeft: '1.1rem', display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                  <li>Presupuesto de marketing +5% para Q1 2026 en respuesta al aumento digital.</li>
                  <li>Índice de cobertura logística: 98%, con prioridad para centros del Norte y Centro.</li>
                  <li>Promoción de canal retail: 28 tiendas con campañas conjuntas hasta abril.</li>
                </ul>
              </article>
            </section>
          )}
        </div>
      </div>
    </main>
  )
}
