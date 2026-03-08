import React, { useMemo, useState } from 'react';
import type { RegionSales } from '../lib/mock-data';

type Props = {
  data: RegionSales[];
};

function Sparkline({ values }: { values: number[] }) {
  const w = 120;
  const h = 30;
  const max = Math.max(...values, 1);
  const points = values
    .map((v, i) => `${(i / (values.length - 1)) * w},${h - (v / max) * h}`)
    .join(' ');
  return (
    <svg width={w} height={h} viewBox={`0 0 ${w} ${h}`}>
      <polyline fill="none" stroke="#2563eb" strokeWidth={2} points={points} />
    </svg>
  );
}

export default function RegionTable({ data }: Props) {
  const [sortBy, setSortBy] = useState<'total' | 'name'>('total');
  const [desc, setDesc] = useState(true);

  const sorted = useMemo(() => {
    const copy = [...data];
    copy.sort((a, b) => {
      if (sortBy === 'total') return desc ? b.totalSales - a.totalSales : a.totalSales - b.totalSales;
      return desc ? b.region.localeCompare(a.region) : a.region.localeCompare(b.region);
    });
    return copy;
  }, [data, sortBy, desc]);

  return (
    <div style={{ border: '1px solid #eee', borderRadius: 6, overflow: 'hidden' }}>
      <div style={{ display: 'flex', gap: 8, padding: 8, background: '#fafafa', alignItems: 'center' }}>
        <div style={{ fontWeight: 600 }}>Sales by Region</div>
        <div style={{ marginLeft: 'auto', display: 'flex', gap: 8 }}>
          <button onClick={() => { setSortBy('total'); setDesc((d) => (sortBy === 'total' ? !d : true)); }}>Sort by Total</button>
          <button onClick={() => { setSortBy('name'); setDesc((d) => (sortBy === 'name' ? !d : true)); }}>Sort by Name</button>
        </div>
      </div>

      <table style={{ width: '100%', borderCollapse: 'collapse' }}>
        <thead>
          <tr style={{ textAlign: 'left', background: '#fff' }}>
            <th style={{ padding: 8, borderBottom: '1px solid #eee' }}>Region</th>
            <th style={{ padding: 8, borderBottom: '1px solid #eee' }}>Total Sales</th>
            <th style={{ padding: 8, borderBottom: '1px solid #eee' }}>Top Category</th>
            <th style={{ padding: 8, borderBottom: '1px solid #eee' }}>Trend</th>
            <th style={{ padding: 8, borderBottom: '1px solid #eee' }}>Updated</th>
          </tr>
        </thead>
        <tbody>
          {sorted.map((r) => {
            const topCat = Object.entries(r.categoryBreakdown).sort((a, b) => b[1] - a[1])[0]?.[0] ?? '-';
            return (
              <tr key={r.region}>
                <td style={{ padding: 8, borderBottom: '1px solid #f5f5f5' }}>{r.region}</td>
                <td style={{ padding: 8, borderBottom: '1px solid #f5f5f5' }}>${r.totalSales.toLocaleString()}</td>
                <td style={{ padding: 8, borderBottom: '1px solid #f5f5f5' }}>{topCat}</td>
                <td style={{ padding: 8, borderBottom: '1px solid #f5f5f5' }}><Sparkline values={r.monthly.slice(-6)} /></td>
                <td style={{ padding: 8, borderBottom: '1px solid #f5f5f5', fontSize: 12, color: '#666' }}>{new Date(r.lastUpdated).toLocaleDateString()}</td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
}
