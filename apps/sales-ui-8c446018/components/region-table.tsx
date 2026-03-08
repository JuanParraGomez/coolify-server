import React from 'react';
import type { RegionAggregate } from '../lib/mock-data';

type Props = {
  data: RegionAggregate[];
};

function Sparkline({ values }: { values: number[] }) {
  const w = 120;
  const h = 28;
  const max = Math.max(...values, 1);
  const points = values.map((v, i) => `${(i / (values.length - 1)) * w},${h - (v / max) * h}`);
  return (
    <svg width={w} height={h} viewBox={`0 0 ${w} ${h}`} style={{ background: 'transparent' }}>
      <polyline fill='none' stroke='#2a9d8f' strokeWidth={2} points={points.join(' ')} />
    </svg>
  );
}

export default function RegionTable({ data }: Props) {
  const sorted = [...data].sort((a, b) => b.total - a.total);
  return (
    <table style={{ width: '100%', borderCollapse: 'collapse' }}>
      <thead>
        <tr>
          <th style={{ textAlign: 'left', padding: '8px 6px' }}>Region</th>
          <th style={{ textAlign: 'right', padding: '8px 6px' }}>Total</th>
          <th style={{ textAlign: 'center', padding: '8px 6px' }}>Last 12 months</th>
        </tr>
      </thead>
      <tbody>
        {sorted.map((r) => (
          <tr key={r.region}>
            <td style={{ padding: '8px 6px' }}>{r.region}</td>
            <td style={{ padding: '8px 6px', textAlign: 'right' }}>${r.total.toLocaleString()}</td>
            <td style={{ padding: '8px 6px', textAlign: 'center' }}>
              <Sparkline values={r.monthly} />
            </td>
          </tr>
        ))}
      </tbody>
    </table>
  );
}
