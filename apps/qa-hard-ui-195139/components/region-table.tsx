"use client";

type RegionTableRow = {
  region: string;
  quarterlyRevenue: number[];
  quarterlyMargin: number[];
  conversion: number;
  churn: number;
  pipeline: number;
  deals: number;
};

type RegionTableProps = {
  rows: RegionTableRow[];
  comparison: "QoQ" | "YoY";
};

function money(value: number) {
  return new Intl.NumberFormat("es-AR", {
    style: "currency",
    currency: "USD",
    maximumFractionDigits: 0,
  }).format(value);
}

export default function RegionTable({ rows, comparison }: RegionTableProps) {
  const sortedRows = [...rows].sort((a, b) => {
    const totalA = a.quarterlyRevenue.reduce((acc, val) => acc + val, 0);
    const totalB = b.quarterlyRevenue.reduce((acc, val) => acc + val, 0);
    return totalB - totalA;
  });

  return (
    <section className="table-card">
      <header>
        <h2>Detalle regional y comparativa trimestral ({comparison})</h2>
      </header>
      <div className="table-wrap">
        <table>
          <thead>
            <tr>
              <th>Region</th>
              <th>Q1</th>
              <th>Q2</th>
              <th>Q3</th>
              <th>Q4</th>
              <th>Total</th>
              <th>Var. Q4 vs Q3</th>
              <th>Margen Prom.</th>
              <th>Conversion</th>
              <th>Churn</th>
              <th>Pipeline</th>
            </tr>
          </thead>
          <tbody>
            {sortedRows.map((row) => {
              const total = row.quarterlyRevenue.reduce((acc, val) => acc + val, 0);
              const qoq = ((row.quarterlyRevenue[3] - row.quarterlyRevenue[2]) / row.quarterlyRevenue[2]) * 100;
              const avgMargin =
                row.quarterlyMargin.reduce((acc, val) => acc + val, 0) / row.quarterlyMargin.length;
              return (
                <tr key={row.region}>
                  <td>{row.region}</td>
                  <td>{money(row.quarterlyRevenue[0])}</td>
                  <td>{money(row.quarterlyRevenue[1])}</td>
                  <td>{money(row.quarterlyRevenue[2])}</td>
                  <td>{money(row.quarterlyRevenue[3])}</td>
                  <td>{money(total)}</td>
                  <td className={qoq >= 0 ? "positive" : "negative"}>{qoq.toFixed(1)}%</td>
                  <td>{avgMargin.toFixed(1)}%</td>
                  <td>{row.conversion.toFixed(1)}%</td>
                  <td>{row.churn.toFixed(1)}%</td>
                  <td>{money(row.pipeline)}</td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
      <style jsx>{`
        .table-card {
          background: #0f1838;
          border: 1px solid #283b6f;
          border-radius: 16px;
          padding: 1rem;
        }
        header h2 {
          margin: 0 0 0.8rem;
          font-size: 1rem;
        }
        .table-wrap {
          overflow: auto;
        }
        table {
          width: 100%;
          border-collapse: collapse;
          min-width: 980px;
        }
        th,
        td {
          padding: 0.6rem 0.5rem;
          border-bottom: 1px solid #1e2e59;
          text-align: left;
          font-size: 0.8rem;
          white-space: nowrap;
        }
        th {
          color: #9ab0dd;
          font-size: 0.74rem;
          text-transform: uppercase;
        }
        td {
          color: #ebf1ff;
        }
        tr:hover td {
          background: #101d45;
        }
        .positive {
          color: #32d5a5;
          font-weight: 700;
        }
        .negative {
          color: #ff8da6;
          font-weight: 700;
        }
      `}</style>
    </section>
  );
}
