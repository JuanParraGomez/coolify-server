"use client";

type RegionSeries = {
  region: string;
  quarterlyRevenue: number[];
  quarterlyMargin: number[];
};

type RegionChartProps = {
  regions: RegionSeries[];
};

const QUARTERS = ["Q1", "Q2", "Q3", "Q4"];

export default function RegionChart({ regions }: RegionChartProps) {
  const totals = QUARTERS.map((_, quarterIdx) =>
    regions.reduce((acc, region) => acc + region.quarterlyRevenue[quarterIdx], 0),
  );
  const previousYear = totals.map((value) => Math.round(value * 0.9));
  const target = totals.map((value) => Math.round(value * 1.08));
  const max = Math.max(...totals, ...previousYear, ...target, 1);

  return (
    <section className="chart-card">
      <header>
        <h2>Comparativa trimestral consolidada</h2>
        <p>Seguimiento de ingresos actuales versus anio anterior y objetivo gerencial.</p>
      </header>
      <div className="chart-grid">
        {QUARTERS.map((quarter, index) => (
          <article key={quarter} className="column">
            <strong>{quarter}</strong>
            <div className="bars">
              <div
                className="bar current"
                style={{ height: `${(totals[index] / max) * 100}%` }}
                title={`Actual: ${totals[index].toLocaleString("es-AR")}`}
              />
              <div
                className="bar previous"
                style={{ height: `${(previousYear[index] / max) * 100}%` }}
                title={`Anio anterior: ${previousYear[index].toLocaleString("es-AR")}`}
              />
              <div
                className="bar target"
                style={{ height: `${(target[index] / max) * 100}%` }}
                title={`Objetivo: ${target[index].toLocaleString("es-AR")}`}
              />
            </div>
            <small>
              {((totals[index] / target[index]) * 100).toFixed(1)}% cumplimiento
            </small>
          </article>
        ))}
      </div>
      <div className="legend">
        <span>
          <i className="current" /> Actual
        </span>
        <span>
          <i className="previous" /> Anio anterior
        </span>
        <span>
          <i className="target" /> Objetivo
        </span>
      </div>
      <style jsx>{`
        .chart-card {
          background: #0f1838;
          border: 1px solid #283b6f;
          border-radius: 16px;
          padding: 1rem;
        }
        header h2 {
          margin: 0;
          font-size: 1rem;
        }
        header p {
          margin: 0.35rem 0 1rem;
          color: #9fb3df;
          font-size: 0.84rem;
        }
        .chart-grid {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(140px, 1fr));
          gap: 0.7rem;
        }
        .column {
          background: #0b1430;
          border: 1px solid #1f3266;
          border-radius: 12px;
          padding: 0.7rem;
          display: flex;
          flex-direction: column;
          gap: 0.5rem;
        }
        strong {
          font-size: 0.85rem;
          color: #d6e1ff;
        }
        .bars {
          height: 140px;
          display: flex;
          align-items: flex-end;
          gap: 0.35rem;
        }
        .bar {
          flex: 1;
          border-radius: 8px 8px 3px 3px;
          min-height: 8px;
        }
        .bar.current {
          background: linear-gradient(#43d9ad, #26b58b);
        }
        .bar.previous {
          background: linear-gradient(#8bb4ff, #4f83e5);
        }
        .bar.target {
          background: linear-gradient(#8d79ff, #6858d4);
        }
        small {
          color: #9bb0dc;
          font-size: 0.75rem;
        }
        .legend {
          margin-top: 0.8rem;
          display: flex;
          gap: 1rem;
          font-size: 0.75rem;
          color: #9db3df;
        }
        .legend span {
          display: inline-flex;
          align-items: center;
          gap: 0.35rem;
        }
        .legend i {
          width: 10px;
          height: 10px;
          border-radius: 999px;
          display: inline-block;
        }
        .legend i.current {
          background: #2ec99a;
        }
        .legend i.previous {
          background: #6797ef;
        }
        .legend i.target {
          background: #7a66e9;
        }
      `}</style>
    </section>
  );
}
