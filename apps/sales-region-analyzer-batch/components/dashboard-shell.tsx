'use client'

import { useEffect, useState } from 'react'

import FiltersPanel from './filters-panel'
import RegionChart, { type RegionChartRegion } from './region-chart'
import RegionTable from './region-table'
import {
  ALL_MONTHS,
  DEFAULT_FILTERS,
  type Category,
  type FilterState,
  type Region,
  type SaleRecord,
  buildRegionSummaries,
  getFilteredSales,
} from '../lib/mock-data'

const navigationItems = [
  { href: '#overview', label: 'Resumen' },
  { href: '#filters', label: 'Filtros' },
  { href: '#regions', label: 'Regiones' },
  { href: '#table', label: 'Tabla' },
  { href: '#drilldown', label: 'Drill-down' },
]

const monthFormatter = new Intl.DateTimeFormat('es-MX', { month: 'short' })

const categoryLabels: Record<Category, string> = {
  Electronics: 'Electronica',
  Clothing: 'Moda',
  Food: 'Alimentos',
  Home: 'Hogar',
  Sports: 'Deportes',
}

const regionConfig: Record<
  Region,
  {
    label: string
    manager: string
    color: string
    subregions: string[]
    accounts: string[]
  }
> = {
  North: {
    label: 'North',
    manager: 'Ana Suarez',
    color: '#e27a45',
    subregions: ['Monterrey', 'Saltillo', 'Chihuahua'],
    accounts: ['Grupo Atlas', 'Retail Nova', 'Distribuciones Roca'],
  },
  South: {
    label: 'South',
    manager: 'Maria Nolasco',
    color: '#869c50',
    subregions: ['Merida', 'Tuxtla', 'Oaxaca'],
    accounts: ['Hotelaria Azul', 'Cadena Sol', 'Mayab Connect'],
  },
  East: {
    label: 'East',
    manager: 'Carlos Perez',
    color: '#2d8f85',
    subregions: ['CDMX', 'Puebla', 'Queretaro'],
    accounts: ['Mercado Capital', 'Farmacias Uno', 'Servicios Plaza'],
  },
  West: {
    label: 'West',
    manager: 'Diego Ramirez',
    color: '#5c6bc0',
    subregions: ['Guadalajara', 'Leon', 'Culiacan'],
    accounts: ['Consumax', 'Logistica Horizonte', 'Canal Cinco'],
  },
  Central: {
    label: 'Central',
    manager: 'Sofia Herrera',
    color: '#c05c7a',
    subregions: ['Toluca', 'Aguascalientes', 'San Luis'],
    accounts: ['Nodo Centro', 'Impulso Retail', 'Mercados Unidos'],
  },
}

const subregionWeights = [0.42, 0.33, 0.25]

function formatMoney(value: number) {
  return new Intl.NumberFormat('es-MX', {
    style: 'currency',
    currency: 'USD',
    maximumFractionDigits: 0,
  }).format(value)
}

function formatCompactMoney(value: number) {
  return new Intl.NumberFormat('es-MX', {
    style: 'currency',
    currency: 'USD',
    notation: 'compact',
    maximumFractionDigits: 1,
  }).format(value)
}

function formatMonthLabel(month: string) {
  const [year, monthNumber] = month.split('-')
  const date = new Date(`${year}-${monthNumber}-01T00:00:00Z`)
  const label = monthFormatter.format(date)
  return label.charAt(0).toUpperCase() + label.slice(1, 3)
}

function sumRecords(records: SaleRecord[], pick: (record: SaleRecord) => number) {
  return records.reduce((total, record) => total + pick(record), 0)
}

function groupByMonth(
  records: SaleRecord[],
  months: string[],
  pick: (record: SaleRecord) => number,
) {
  return months.map((month) =>
    records
      .filter((record) => record.month === month)
      .reduce((total, record) => total + pick(record), 0),
  )
}

function buildRegionMetrics(
  records: SaleRecord[],
  filters: FilterState,
): RegionChartRegion[] {
  const months = filters.months.length ? filters.months : ALL_MONTHS
  const summaries = buildRegionSummaries(records).sort(
    (left, right) => right.totalRevenue - left.totalRevenue,
  )

  return summaries.map((summary) => {
    const regionRecords = summary.records
    const config = regionConfig[summary.region]
    const revenueTrend = groupByMonth(regionRecords, months, (record) => record.revenue)
    const targetTrend = groupByMonth(regionRecords, months, (record) => record.target)
    const categoryTotals = Object.entries(categoryLabels)
      .map(([category, label]) => ({
        key: category,
        label,
        revenue: sumRecords(
          regionRecords.filter((record) => record.category === category),
          (record) => record.revenue,
        ),
      }))
      .filter((entry) => entry.revenue > 0)
      .sort((left, right) => right.revenue - left.revenue)
    const totalCategoryRevenue =
      categoryTotals.reduce((total, entry) => total + entry.revenue, 0) || 1
    const topCategory = categoryTotals[0]?.label ?? 'Sin categoria'
    const averageUnitValue =
      summary.totalUnits > 0 ? summary.totalRevenue / summary.totalUnits : 0
    const pipeline = Math.round(
      Math.max(summary.totalTarget - summary.totalRevenue, 0) +
        summary.totalRevenue * 0.22,
    )
    const subregions = config.subregions.map((name, index) => {
      const weight = subregionWeights[index]
      const revenue = Math.round(summary.totalRevenue * weight)
      const target = Math.round(summary.totalTarget * weight)
      const orders = Math.max(1, Math.round(summary.totalUnits * weight * 0.18))
      const conversion = Number((22 + index * 2.4 + summary.achievementPct / 12).toFixed(1))
      const localPipeline = Math.round(pipeline * (weight + index * 0.03))

      return {
        name,
        revenue,
        target,
        orders,
        conversion,
        pipeline: localPipeline,
        delta: revenue - target,
      }
    })
    const accounts = categoryTotals.slice(0, 3).map((entry, index) => ({
      name: config.accounts[index] ?? `${config.label} Account ${index + 1}`,
      segment: entry.label,
      revenue: Math.round(entry.revenue * 0.52),
      delta: Math.round(summary.achievementPct - 100 + 6 - index * 4),
    }))
    const alerts = [
      `${config.label} mantiene foco en ${topCategory.toLowerCase()} con ${summary.achievementPct}% del objetivo.`,
      summary.achievementPct >= 100
        ? `La region puede acelerar pipeline en ${config.subregions[0]}.`
        : `La brecha contra objetivo exige reforzar cierre en ${config.subregions[0]}.`,
      `${months.length} meses visibles sostienen un ticket medio de ${formatMoney(Math.round(averageUnitValue))}.`,
    ]

    return {
      id: summary.region,
      name: config.label,
      manager: config.manager,
      color: config.color,
      revenue: summary.totalRevenue,
      target: summary.totalTarget,
      margin: Number((14 + summary.achievementPct / 7).toFixed(1)),
      orders: summary.totalUnits,
      pipeline,
      avgTicket:
        summary.totalUnits > 0
          ? Math.round(summary.totalRevenue / summary.totalUnits)
          : 0,
      performance:
        summary.totalTarget > 0 ? summary.totalRevenue / summary.totalTarget : 0,
      labels: months.map(formatMonthLabel),
      scaledTrend: revenueTrend,
      targetTrend,
      channels: Object.fromEntries(
        categoryTotals.map((entry) => [entry.label, entry.revenue / totalCategoryRevenue]),
      ),
      subregions,
      accounts,
      alerts,
    }
  })
}

export function DashboardShell() {
  const [filters, setFilters] = useState<FilterState>(DEFAULT_FILTERS)
  const [selectedRegion, setSelectedRegion] = useState<Region | null>(
    DEFAULT_FILTERS.regions[0] ?? null,
  )

  const filteredSales = getFilteredSales(filters)
  const summaries = buildRegionSummaries(filteredSales).sort(
    (left, right) => right.totalRevenue - left.totalRevenue,
  )
  const regionMetrics = buildRegionMetrics(filteredSales, filters)
  const activeRegion = summaries.some((summary) => summary.region === selectedRegion)
    ? selectedRegion
    : summaries[0]?.region ?? null
  const monthsLabel = filters.months.length
    ? `${filters.months.length} meses`
    : 'Sin meses activos'
  const categoriesLabel = filters.categories.length
    ? `${filters.categories.length} categorias`
    : 'Sin categorias activas'
  const totalRevenue = summaries.reduce(
    (total, summary) => total + summary.totalRevenue,
    0,
  )
  const totalTarget = summaries.reduce(
    (total, summary) => total + summary.totalTarget,
    0,
  )
  const totalUnits = summaries.reduce(
    (total, summary) => total + summary.totalUnits,
    0,
  )
  const leadingRegion = summaries[0]
  const trailingRegion = summaries[summaries.length - 1]

  useEffect(() => {
    if (!summaries.length) {
      if (selectedRegion !== null) {
        setSelectedRegion(null)
      }
      return
    }

    const stillVisible = summaries.some((summary) => summary.region === selectedRegion)
    if (!stillVisible) {
      setSelectedRegion(summaries[0].region)
    }
  }, [selectedRegion, summaries])

  return (
    <div className="shell">
      <aside className="sidebar">
        <div className="sidebarTop">
          <div className="brandBadge">SRA</div>
          <h1 className="brandTitle">Sales Region Analyzer Batch</h1>
          <p className="brandCopy">
            Dashboard de ventas regionales con filtros activos, graficos, tabla
            y drill-down sobre datos simulados.
          </p>
        </div>

        <nav aria-label="Primary navigation" className="nav">
          {navigationItems.map((item) => (
            <a key={item.href} className="navLink" href={item.href}>
              {item.label}
            </a>
          ))}
        </nav>

        <div className="sidebarCard">
          <span className="eyebrow">Estado</span>
          <strong>Datos simulados integrados</strong>
          <p>
            {filteredSales.length} registros visibles, {summaries.length} regiones
            en pantalla y seleccion actual {activeRegion ?? 'sin datos'}.
          </p>
        </div>
      </aside>

      <main className="content">
        <section className="hero">
          <div>
            <span className="eyebrow">Panel ejecutivo</span>
            <h2 className="heroTitle">
              Ventas por region con lectura rapida y accionable
            </h2>
            <p className="heroCopy">
              La UI conecta filtros reales, comparativo por region, tabla
              ordenable y drill-down sintetico sobre un mismo modelo de datos.
            </p>
          </div>

          <div className="heroStats">
            <div>
              <span className="mutedLabel">Revenue visible</span>
              <strong>{formatCompactMoney(totalRevenue)}</strong>
            </div>
            <div>
              <span className="mutedLabel">Cumplimiento</span>
              <strong>
                {totalTarget > 0 ? Math.round((totalRevenue / totalTarget) * 100) : 0}%
              </strong>
            </div>
            <div>
              <span className="mutedLabel">Unidades</span>
              <strong>{totalUnits.toLocaleString('es-MX')}</strong>
            </div>
          </div>
        </section>

        <section className="highlights">
          <article className="panel card">
            <span className="eyebrow">Region lider</span>
            <strong className="cardValue">{leadingRegion?.region ?? 'N/A'}</strong>
            <p>
              {leadingRegion
                ? `${formatCompactMoney(leadingRegion.totalRevenue)} y ${leadingRegion.achievementPct}% del target.`
                : 'No hay datos visibles con la combinacion actual.'}
            </p>
          </article>
          <article className="panel card">
            <span className="eyebrow">Cobertura activa</span>
            <strong className="cardValue">{monthsLabel}</strong>
            <p>{categoriesLabel} filtradas sobre el dataset completo.</p>
          </article>
          <article className="panel card">
            <span className="eyebrow">Region a vigilar</span>
            <strong className="cardValue">{trailingRegion?.region ?? 'N/A'}</strong>
            <p>
              {trailingRegion
                ? `Queda en ${trailingRegion.achievementPct}% y requiere seguimiento en la tabla.`
                : 'Activa mas filtros para recuperar comparativos regionales.'}
            </p>
          </article>
        </section>

        <section className="panel filtersSection" id="filters">
          <div className="sectionHeader">
            <div>
              <span className="eyebrow">Control de vista</span>
              <h3>Filtros conectados al dataset</h3>
            </div>
            <span className="miniBadge">{filteredSales.length} filas</span>
          </div>

          <div className="filtersLayout">
            <FiltersPanel filters={filters} onChange={setFilters} />
            <div className="filtersSummary">
              <div className="filterFact">
                <span className="mutedLabel">Regiones activas</span>
                <strong>{filters.regions.length}</strong>
              </div>
              <div className="filterFact">
                <span className="mutedLabel">Categorias activas</span>
                <strong>{filters.categories.length}</strong>
              </div>
              <div className="filterFact">
                <span className="mutedLabel">Meses activos</span>
                <strong>{filters.months.length}</strong>
              </div>
              <p className="filtersCopy">
                La seleccion impacta charts, tabla y drill-down. Si limpias todos
                los filtros veras el estado vacio para validar la integracion.
              </p>
            </div>
          </div>
        </section>

        <RegionChart
          regions={regionMetrics}
          periodLabel={monthsLabel}
          channelLabel={categoriesLabel}
          activeChannel={
            filters.categories.length === 1
              ? categoryLabels[filters.categories[0]]
              : 'all'
          }
          selectedRegionId={activeRegion ?? undefined}
          onSelectRegion={(regionId) => setSelectedRegion(regionId as Region)}
          sectionIds={{
            overview: 'overview',
            regions: 'regions',
            drilldown: 'drilldown',
          }}
        />

        <section className="panel tableSection" id="table">
          <div className="sectionHeader">
            <div>
              <span className="eyebrow">Tabla consolidada</span>
              <h3>Resumen por region</h3>
            </div>
            <span className="miniBadge">
              {activeRegion ? `Seleccion: ${activeRegion}` : 'Sin seleccion'}
            </span>
          </div>

          <RegionTable
            summaries={summaries}
            selectedRegion={activeRegion}
            onSelectRegion={(region) => setSelectedRegion(region)}
          />
        </section>
      </main>

      <style jsx>{`
        .shell {
          display: grid;
          grid-template-columns: 280px minmax(0, 1fr);
          gap: 24px;
          min-height: 100vh;
          padding: 24px;
          box-sizing: border-box;
        }

        .sidebar,
        .panel,
        .hero {
          border: 1px solid rgba(148, 163, 184, 0.24);
          box-shadow: 0 18px 40px rgba(15, 23, 42, 0.06);
        }

        .sidebar {
          position: sticky;
          top: 24px;
          align-self: start;
          display: flex;
          flex-direction: column;
          gap: 24px;
          min-height: calc(100vh - 48px);
          padding: 24px;
          border-radius: 28px;
          background: rgba(15, 23, 42, 0.94);
          color: #f8fafc;
        }

        .sidebarTop {
          display: grid;
          gap: 14px;
        }

        .brandBadge,
        .miniBadge,
        .navLink {
          display: inline-flex;
          align-items: center;
          justify-content: center;
          border-radius: 999px;
        }

        .brandBadge {
          width: 56px;
          height: 56px;
          background: linear-gradient(135deg, #f97316, #facc15);
          color: #111827;
          font-weight: 800;
          letter-spacing: 0.12em;
        }

        .brandTitle,
        .heroTitle,
        h3 {
          margin: 0;
          font-family:
            "Iowan Old Style", "Palatino Linotype", "Book Antiqua", serif;
          letter-spacing: -0.03em;
        }

        .brandTitle {
          font-size: 1.9rem;
          line-height: 1.02;
        }

        .brandCopy,
        .heroCopy,
        .card p,
        .filtersCopy,
        .sidebarCard p {
          margin: 0;
          line-height: 1.6;
          opacity: 0.82;
        }

        .nav {
          display: grid;
          gap: 10px;
        }

        .navLink {
          justify-content: flex-start;
          padding: 12px 14px;
          background: rgba(255, 255, 255, 0.06);
          color: inherit;
          text-decoration: none;
          font-weight: 600;
        }

        .navLink:hover {
          background: rgba(255, 255, 255, 0.12);
        }

        .sidebarCard,
        .panel,
        .hero {
          border-radius: 28px;
          background:
            radial-gradient(circle at top right, rgba(255, 255, 255, 0.72), transparent 36%),
            linear-gradient(180deg, rgba(255, 255, 255, 0.96), rgba(248, 250, 252, 0.94));
        }

        .sidebarCard {
          padding: 18px;
          background: rgba(255, 255, 255, 0.08);
        }

        .content {
          display: grid;
          gap: 24px;
          padding-bottom: 24px;
        }

        .hero,
        .panel {
          padding: 24px;
        }

        .hero {
          display: flex;
          align-items: flex-start;
          justify-content: space-between;
          gap: 24px;
        }

        .heroTitle {
          font-size: clamp(2rem, 4vw, 3.1rem);
          line-height: 0.98;
          max-width: 12ch;
        }

        .heroStats,
        .highlights,
        .filtersLayout {
          display: grid;
          gap: 16px;
        }

        .heroStats {
          grid-template-columns: repeat(3, minmax(120px, 1fr));
          min-width: min(100%, 420px);
        }

        .heroStats > div,
        .card,
        .filterFact,
        .filtersSummary {
          border: 1px solid rgba(148, 163, 184, 0.24);
          border-radius: 22px;
          background: rgba(255, 255, 255, 0.76);
          padding: 18px;
        }

        .heroStats strong,
        .cardValue {
          display: block;
          margin-top: 6px;
          font-size: 1.7rem;
          line-height: 1.05;
        }

        .highlights {
          grid-template-columns: repeat(3, minmax(0, 1fr));
        }

        .sectionHeader {
          display: flex;
          align-items: flex-start;
          justify-content: space-between;
          gap: 16px;
          margin-bottom: 18px;
        }

        .filtersLayout {
          grid-template-columns: minmax(0, 1.35fr) minmax(260px, 0.65fr);
          align-items: start;
        }

        .filtersSummary {
          display: grid;
          gap: 14px;
          min-height: 100%;
        }

        .filterFact strong {
          display: block;
          margin-top: 6px;
          font-size: 1.45rem;
        }

        .eyebrow,
        .mutedLabel {
          display: inline-block;
          text-transform: uppercase;
          letter-spacing: 0.08em;
          font-size: 0.75rem;
          font-weight: 700;
        }

        .eyebrow {
          color: #9a4f1d;
        }

        .mutedLabel {
          color: rgba(15, 23, 42, 0.56);
        }

        .miniBadge {
          padding: 0.45rem 0.75rem;
          background: rgba(226, 122, 69, 0.14);
          color: #9a4f1d;
          font-size: 0.8rem;
          font-weight: 700;
          white-space: nowrap;
        }

        @media (max-width: 1100px) {
          .shell {
            grid-template-columns: 1fr;
          }

          .sidebar {
            position: static;
            min-height: auto;
          }

          .hero,
          .filtersLayout {
            grid-template-columns: 1fr;
            display: grid;
          }

          .heroStats,
          .highlights {
            grid-template-columns: 1fr;
          }
        }

        @media (max-width: 720px) {
          .shell {
            padding: 16px;
          }

          .sidebar,
          .panel,
          .hero {
            padding: 18px;
            border-radius: 22px;
          }

          .heroTitle {
            max-width: none;
          }

          .heroStats {
            min-width: 0;
          }
        }
      `}</style>
    </div>
  )
}
