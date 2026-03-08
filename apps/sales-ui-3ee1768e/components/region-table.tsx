import React from 'react';

export default function RegionTable({ data }: { data: any[] }) {
  // Aggregate by region
  const agg = data.reduce<Record<string, { total: number; count: number }>>((acc, cur) => {
    if (!acc[cur.region]) acc[cur.region] = { total: 0, count: 0 };
    acc[cur.region].total += cur.sales;
    acc[cur.region].count += 1;
    return acc;
  }, {});

  const rows = Object.entries(agg).map(([region, stats]) => ({
    region,
    total: stats.total,
    avg: Math.round(stats.total / stats.count),
  })).sort((a,b) => b.total - a.total);

  const max = rows.length ? Math.max(...rows.map(r => r.total)) : 0;

  return (
    <div style={{ border: '1px solid #eee', borderRadius: 6, padding: 12 }}>
      <h3 style={{ marginTop: 0 }}>Ventas por región</h3>
      <table style={{ width: '100%', borderCollapse: 'collapse' }}>
        <thead>
          <tr style={{ textAlign: 'left', borderBottom: '1px solid #ddd' }}>
            <th style={{ padding: '8px 4px' }}>Región</th>
            <th style={{ padding: '8px 4px' }}>Ventas totales</th>
            <th style={{ padding: '8px 4px' }}>Promedio por mes</th>
            <th style={{ padding: '8px 4px' }}>Gráfico</th>
          </tr>
        </thead>
        <tbody>
          {rows.map(r => (
            <tr key={r.region} style={{ borderBottom: '1px solid #f4f4f4' }}>
              <td style={{ padding: '8px 4px' }}>{r.region}</td>
              <td style={{ padding: '8px 4px' }}>{r.total.toLocaleString()}</td>
              <td style={{ padding: '8px 4px' }}>{r.avg.toLocaleString()}</td>
              <td style={{ padding: '8px 4px', width: 240 }}>
                <div style={{ background: '#f3f3f3', height: 14, borderRadius: 6, overflow: 'hidden' }}>
                  <div style={{ height: '100%', background: '#4f46e5', width: `${max ? Math.round((r.total / max) * 100) : 0}%` }} />
                </div>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
