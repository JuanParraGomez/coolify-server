"use client";

import { useMemo, useState } from "react";
import FiltersPanel, { type DashboardFilters } from "./filters-panel";
import RegionChart from "./region-chart";
import RegionTable from "./region-table";

type BaseRegion = {
  region: string;
  quarterlyRevenue: number[];
  quarterlyMargin: number[];
  conversion: number;
  churn: number;
  pipeline: number;
  deals: number;
};

const BASE_REGIONS: BaseRegion[] = [
  {
    region: "Norte",
    quarterlyRevenue: [1150000, 1230000, 1315000, 1420000],
    quarterlyMargin: [29, 30, 31.5, 33],
    conversion: 26.4,
    churn: 5.2,
    pipeline: 960000,
    deals: 89,
  },
  {
    region: "Sur",
    quarterlyRevenue: [980000, 1010000, 1080000, 1140000],
    quarterlyMargin: [25, 25.5, 26.4, 27],
    conversion: 22.8,
    churn: 7.1,
    pipeline: 770000,
    deals: 73,
  },
  {
    region: "Este",
    quarterlyRevenue: [1240000, 1365000, 1410000, 1530000],
    quarterlyMargin: [30, 31.2, 31.4, 32.8],
    conversion: 27.5,
    churn: 4.8,
    pipeline: 1120000,
    deals: 95,
  },
  {
    region: "Oeste",
    quarterlyRevenue: [1060000, 1095000, 1160000, 1220000],
    quarterlyMargin: [27.4, 27.9, 28.6, 29.2],
    conversion: 24.2,
    churn: 6.4,
    pipeline: 850000,
    deals: 78,
  },
  {
    region: "Centro",
    quarterlyRevenue: [1350000, 1470000, 1590000, 1720000],
    quarterlyMargin: [31.8, 32.1, 33.4, 34.2],
    conversion: 29.4,
    churn: 4.2,
    pipeline: 1280000,
    deals: 103,
  },
];

const CHANNEL_ADJUSTMENT = {
  Todos: { revenue: 1, margin: 0, conversion: 0, churn: 0 },
  Retail: { revenue: 0.92, margin: -1.1, conversion: -1.5, churn: 0.8 },
  "E-commerce": { revenue: 1.14, margin: 0.8, conversion: 1.2, churn: -0.5 },
  B2B: { revenue: 1.08, margin: 1.5, conversion: 0.9, churn: -0.7 },
};

const SEGMENT_ADJUSTMENT = {
  General: { revenue: 1, margin: 0, conversion: 0, churn: 0 },
  Enterprise: { revenue: 1.2, margin: 2.4, conversion: 1.8, churn: -1.1 },
  SMB: { revenue: 0.87, margin: -1.8, conversion: -1.4, churn: 1.3 },
  Distribuidores: { revenue: 1.05, margin: 0.5, conversion: 0.4, churn: 0.1 },
};

const YEAR_ADJUSTMENT = {
  "2026": { revenue: 1, margin: 0, pipeline: 1 },
  "2025": { revenue: 0.91, margin: -1.2, pipeline: 0.9 },
};

type FilterKey = keyof typeof CHANNEL_ADJUSTMENT;
type SegmentKey = keyof typeof SEGMENT_ADJUSTMENT;
type YearKey = keyof typeof YEAR_ADJUSTMENT;

function formatMoney(value: number) {
  return new Intl.NumberFormat("es-AR", {
    style: "currency",
    currency: "USD",
    maximumFractionDigits: 0,
  }).format(value);
}

function formatPct(value: number) {
  return `${value.toFixed(1)}%`;
}

export default function DashboardShell() {
  const [filters, setFilters] = useState<DashboardFilters>({
    region: "Todas las regiones",
    channel: "Todos",
    segment: "General",
    year: "2026",
    comparison: "QoQ",
  });

  const regions = useMemo(() => {
    const channelFactor = CHANNEL_ADJUSTMENT[filters.channel as FilterKey];
    const segmentFactor = SEGMENT_ADJUSTMENT[filters.segment as SegmentKey];
    const yearFactor = YEAR_ADJUSTMENT[filters.year as YearKey];
    const scope =
      filters.region === "Todas las regiones"
        ? BASE_REGIONS
        : BASE_REGIONS.filter((region) => region.region === filters.region);

    return scope.map((region) => ({
      ...region,
      quarterlyRevenue: region.quarterlyRevenue.map((quarter) =>
        Math.round(quarter * channelFactor.revenue * segmentFactor.revenue * yearFactor.revenue),
      ),
      quarterlyMargin: region.quarterlyMargin.map((quarterMargin) =>
        Math.max(15, Math.min(45, quarterMargin + channelFactor.margin + segmentFactor.margin + yearFactor.margin)),
      ),
      conversion: Math.max(10, region.conversion + channelFactor.conversion + segmentFactor.conversion),
      churn: Math.max(1, region.churn + channelFactor.churn + segmentFactor.churn),
      pipeline: Math.round(region.pipeline * channelFactor.revenue * segmentFactor.revenue * yearFactor.pipeline),
      deals: Math.round(region.deals * channelFactor.revenue * segmentFactor.revenue),
    }));
  }, [filters]);

  const summary = useMemo(() => {
    const quarterlyTotals = [0, 0, 0, 0].map((_, quarter) =>
      regions.reduce((acc, region) => acc + region.quarterlyRevenue[quarter], 0),
    );
    const annualRevenue = quarterlyTotals.reduce((acc, value) => acc + value, 0);
    const avgMargin =
      regions.reduce(
        (acc, region) => acc + region.quarterlyMargin.reduce((inner, margin) => inner + margin, 0) / 4,
        0,
      ) / Math.max(regions.length, 1);
    const avgConversion =
      regions.reduce((acc, region) => acc + region.conversion, 0) / Math.max(regions.length, 1);
    const avgChurn = regions.reduce((acc, region) => acc + region.churn, 0) / Math.max(regions.length, 1);
    const pipeline = regions.reduce((acc, region) => acc + region.pipeline, 0);
    const deals = regions.reduce((acc, region) => acc + region.deals, 0);
    const qoq = ((quarterlyTotals[3] - quarterlyTotals[2]) / quarterlyTotals[2]) * 100;
    const yoy = ((quarterlyTotals[3] - quarterlyTotals[3] * 0.9) / (quarterlyTotals[3] * 0.9)) * 100;
    const topRegion = [...regions].sort(
      (a, b) =>
        b.quarterlyRevenue.reduce((acc, value) => acc + value, 0) -
        a.quarterlyRevenue.reduce((acc, value) => acc + value, 0),
    )[0];
    return {
      annualRevenue,
      avgMargin,
      avgConversion,
      avgChurn,
      pipeline,
      deals,
      qoq,
      yoy,
      topRegion: topRegion?.region ?? "-",
    };
  }, [regions]);

  const riskAlerts = useMemo(
    () =>
      regions
        .filter((region) => region.churn > 7 || region.quarterlyMargin[3] < 27)
        .map((region) => ({
          region: region.region,
          reason:
            region.churn > 7
              ? `Churn en ${formatPct(region.churn)}`
              : `Margen Q4 en ${formatPct(region.quarterlyMargin[3])}`,
        })),
    [regions],
  );

  const regionOptions = ["Todas las regiones", ...BASE_REGIONS.map((region) => region.region)];
  const growthMetric = filters.comparison === "QoQ" ? summary.qoq : summary.yoy;

  return (
    <main className="dashboard">
      <header className="hero">
        <div>
          <p className="eyebrow">Analitica Comercial para Gerencia</p>
          <h1>Dashboard regional de rendimiento comercial</h1>
          <p className="subtitle">
            Controla KPIs estrategicos, compara trimestres y detecta desviaciones por region.
          </p>
        </div>
        <div className="hero-kpi">
          <span>Region lider</span>
          <strong>{summary.topRegion}</strong>
          <small>Mayor facturacion acumulada del periodo</small>
        </div>
      </header>

      <FiltersPanel filters={filters} regionOptions={regionOptions} onChange={setFilters} />

      <section className="kpi-grid">
        <article className="kpi-card">
          <h3>Ingresos acumulados</h3>
          <strong>{formatMoney(summary.annualRevenue)}</strong>
          <small>{formatPct(growthMetric)} comparativa {filters.comparison}</small>
        </article>
        <article className="kpi-card">
          <h3>Margen bruto promedio</h3>
          <strong>{formatPct(summary.avgMargin)}</strong>
          <small>Objetivo corporativo: 30.0%</small>
        </article>
        <article className="kpi-card">
          <h3>Conversion comercial</h3>
          <strong>{formatPct(summary.avgConversion)}</strong>
          <small>{summary.deals} acuerdos cerrados en cartera activa</small>
        </article>
        <article className="kpi-card">
          <h3>Churn de clientes</h3>
          <strong>{formatPct(summary.avgChurn)}</strong>
          <small>Meta anual: mantener debajo de 6.0%</small>
        </article>
        <article className="kpi-card">
          <h3>Pipeline proximo trimestre</h3>
          <strong>{formatMoney(summary.pipeline)}</strong>
          <small>Oportunidades ponderadas por probabilidad</small>
        </article>
        <article className="kpi-card">
          <h3>Ritmo trimestral</h3>
          <strong>{formatPct(summary.qoq)}</strong>
          <small>Variacion consolidada de Q4 frente a Q3</small>
        </article>
      </section>

      <section className="split">
        <RegionChart regions={regions} />
        <section className="alerts-card">
          <h2>Alertas de gestion</h2>
          <p>Regiones que requieren seguimiento inmediato por riesgo comercial.</p>
          <ul>
            {riskAlerts.length === 0 ? (
              <li>Sin alertas criticas para el escenario seleccionado.</li>
            ) : (
              riskAlerts.map((alert) => (
                <li key={alert.region}>
                  <strong>{alert.region}:</strong> {alert.reason}
                </li>
              ))
            )}
          </ul>
        </section>
      </section>

      <RegionTable rows={regions} comparison={filters.comparison} />

      <style jsx>{`
        .dashboard {
          min-height: 100vh;
          padding: 1.25rem;
          background: radial-gradient(circle at top left, #19274f, #060c1f 55%);
          color: #f4f7ff;
          font-family:
            Inter,
            -apple-system,
            BlinkMacSystemFont,
            "Segoe UI",
            sans-serif;
          display: grid;
          gap: 1rem;
        }
        .hero {
          background: linear-gradient(145deg, #13265a, #0a1533);
          border: 1px solid #2b4178;
          border-radius: 18px;
          padding: 1rem;
          display: flex;
          align-items: center;
          justify-content: space-between;
          gap: 1rem;
          flex-wrap: wrap;
        }
        .eyebrow {
          margin: 0;
          color: #7fb0ff;
          text-transform: uppercase;
          font-size: 0.76rem;
          letter-spacing: 0.04em;
        }
        h1 {
          margin: 0.25rem 0 0.45rem;
          font-size: clamp(1.3rem, 2vw, 2rem);
        }
        .subtitle {
          margin: 0;
          color: #b2c4ec;
          font-size: 0.92rem;
          max-width: 740px;
        }
        .hero-kpi {
          background: #0c1a3f;
          border: 1px solid #2a437f;
          border-radius: 12px;
          padding: 0.8rem;
          min-width: 220px;
        }
        .hero-kpi span,
        .hero-kpi small {
          color: #99b1df;
          display: block;
          font-size: 0.78rem;
        }
        .hero-kpi strong {
          display: block;
          margin: 0.2rem 0;
          font-size: 1.35rem;
        }
        .kpi-grid {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(190px, 1fr));
          gap: 0.75rem;
        }
        .kpi-card {
          background: #0f1838;
          border: 1px solid #273d72;
          border-radius: 14px;
          padding: 0.9rem;
        }
        .kpi-card h3 {
          margin: 0;
          font-size: 0.86rem;
          color: #a9bee7;
          font-weight: 500;
        }
        .kpi-card strong {
          display: block;
          margin: 0.45rem 0 0.35rem;
          font-size: 1.28rem;
        }
        .kpi-card small {
          color: #95addb;
          font-size: 0.76rem;
        }
        .split {
          display: grid;
          grid-template-columns: minmax(0, 2fr) minmax(260px, 1fr);
          gap: 0.75rem;
        }
        .alerts-card {
          background: #0f1838;
          border: 1px solid #283b6f;
          border-radius: 16px;
          padding: 1rem;
        }
        .alerts-card h2 {
          margin: 0;
          font-size: 1rem;
        }
        .alerts-card p {
          margin: 0.35rem 0 0.8rem;
          font-size: 0.84rem;
          color: #9eb3dd;
        }
        .alerts-card ul {
          margin: 0;
          padding-left: 1rem;
          display: grid;
          gap: 0.5rem;
          color: #e5ebff;
          font-size: 0.82rem;
        }
        @media (max-width: 980px) {
          .split {
            grid-template-columns: 1fr;
          }
        }
      `}</style>
    </main>
  );
}
