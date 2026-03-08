import React from 'react';
import { AggregatedRegion } from '../lib/mock-data';

type Props = {
  data: AggregatedRegion[];
};

function Sparkline({ points }: { points: number[] }) {
  if (!points || points.length === 0) return <svg width={100} height={30} />;
  const w = 100;
  const h = 30;
  const max = Math.max(...points);
  const min = Math.min(...points);
  const range = max - min || 1;
  const step = w / Math.max(1, points.length - 1);
  const d = points
    .map((v, i) => `${i === 0 ? 'M' : 'L'} ${i * step} ${h - ((v - min) / range) * h}`)
    .join(' ');
  return (
    <svg width={w} height={h} style={{ overflow: 'visible' }}>
      <path d={d} fill="none" stroke="#3b82f6" strokeWidth={1.5} />
    </svg>
  );
}

export default function RegionTable({ data }: Props) {
  return (
    <table style={{ width: '100%', borderCollapse: 'collapse' }}>
      <thead>
        <tr>
          <th style={{ textAlign: 'left', padding: 8 }}>Region</th>
          <th style={{ textAlign: 'right', padding: 8 }}>Total Sales</th>
          <th style={{ textAlign: 'right', padding: 8 }}>Orders</th>
          <th style={{ textAlign: 'right', padding: 8 }}>Avg Order</th>
          <th style={{ textAlign: 'center', padding: 8 }}>Trend</th>
        </tr>
      </thead>
      <tbody>
        {data.map((r) => (
          <tr key={r.region} style={{ borderTop: '1px solid #f0f0f0' }}>
            <td style={{ padding: 8 }}>{r.region}</td>
            <td style={{ padding: 8, textAlign: 'right' }}>{r.totalSales.toLocaleString(undefined, { style: 'currency', currency: 'USD' })}</td>
            <td style={{ padding: 8, textAlign: 'right' }}>{r.totalOrders}</td>
            <td style={{ padding: 8, textAlign: 'right' }}>{r.avgOrderValue.toLocaleString(undefined, { style: 'currency', currency: 'USD' })}</td>
            <td style={{ padding: 8, textAlign: 'center' }}>
              <Sparkline points={r.timeseries.map((t) => t.sales)} />
            </td>
          </tr>
        ))}
      </tbody>
    </table>
  );
}
