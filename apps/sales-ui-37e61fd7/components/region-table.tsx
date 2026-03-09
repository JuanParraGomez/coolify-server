"use client";

import React from 'react';
import { RegionData } from '../lib/mock-data';

type Props = {
  data: RegionData[];
};

function Sparkline({ values }: { values: number[] }) {
  const w = 120;
  const h = 36;
  const max = Math.max(...values, 1);
  const min = Math.min(...values, 0);
  const step = w / (values.length - 1 || 1);
  const points = values
    .map((v, i) => `${i * step},${h - ((v - min) / (max - min || 1)) * h}`)
    .join(' ');

  return (
    <svg width={w} height={h} viewBox={`0 0 ${w} ${h}`}>
      <polyline
        fill="none"
        stroke="#2563eb"
        strokeWidth={2}
        points={points}
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

export default function RegionTable({ data }: Props) {
  return (
    <table style={{ width: '100%', borderCollapse: 'collapse' }}>
      <thead>
        <tr style={{ textAlign: 'left', borderBottom: '1px solid #eee' }}>
          <th style={{ padding: 8 }}>Region</th>
          <th style={{ padding: 8 }}>Countries</th>
          <th style={{ padding: 8 }}>Total Sales</th>
          <th style={{ padding: 8 }}>Trend (12mo)</th>
        </tr>
      </thead>
      <tbody>
        {data.map((row) => (
          <tr key={row.id} style={{ borderBottom: '1px solid #fafafa' }}>
            <td style={{ padding: 8 }}>{row.region}</td>
            <td style={{ padding: 8 }}>{row.countries.length}</td>
            <td style={{ padding: 8 }}>${row.totalSales.toLocaleString()}</td>
            <td style={{ padding: 8 }}>
              <Sparkline values={row.salesByMonth} />
            </td>
          </tr>
        ))}
      </tbody>
    </table>
  );
}
