"use client";

import React, { useMemo } from 'react';
import { RegionSale, aggregateByRegion } from '../lib/mock-data';

export default function RegionTable({ data }: { data: RegionSale[] }) {
  const rows = useMemo(() => aggregateByRegion(data), [data]);

  return (
    <div style={{ marginTop: 12, border: '1px solid #eee', borderRadius: 6, overflow: 'auto' }}>
      <table style={{ width: '100%', borderCollapse: 'collapse' }}>
        <thead>
          <tr style={{ textAlign: 'left', background: '#fafafa' }}>
            <th style={{ padding: 8, borderBottom: '1px solid #eee' }}>Region</th>
            <th style={{ padding: 8, borderBottom: '1px solid #eee' }}>Sales</th>
            <th style={{ padding: 8, borderBottom: '1px solid #eee' }}>Orders</th>
            <th style={{ padding: 8, borderBottom: '1px solid #eee' }}>Avg Order</th>
          </tr>
        </thead>
        <tbody>
          {rows.map((r) => (
            <tr key={r.region}>
              <td style={{ padding: 8, borderBottom: '1px solid #f3f3f3' }}>{r.region}</td>
              <td style={{ padding: 8, borderBottom: '1px solid #f3f3f3' }}>€{r.sales.toLocaleString()}</td>
              <td style={{ padding: 8, borderBottom: '1px solid #f3f3f3' }}>{r.orders}</td>
              <td style={{ padding: 8, borderBottom: '1px solid #f3f3f3' }}>€{(r.avgOrder || 0).toFixed(2)}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
