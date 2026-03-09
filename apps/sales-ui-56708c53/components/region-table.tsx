'use client'

import React, { useMemo } from 'react';
import type { Sale, RegionAggregate } from '../lib/mock-data';
import { aggregateByRegion } from '../lib/mock-data';

type Props = {
  sales: Sale[];
  showChart?: boolean;
};

export default function RegionTable({ sales, showChart = true }: Props) {
  const rows: RegionAggregate[] = useMemo(() => aggregateByRegion(sales), [sales]);
  const max = rows.length > 0 ? Math.max(...rows.map((r) => r.totalSales)) : 0;

  return (
    <div style={{ border: '1px solid #e2e8f0', borderRadius: 6, overflow: 'hidden' }}>
      <table style={{ width: '100%', borderCollapse: 'collapse' }}>
        <thead style={{ background: '#f8fafc' }}>
          <tr>
            <th style={{ textAlign: 'left', padding: 8 }}>Region</th>
            <th style={{ textAlign: 'right', padding: 8 }}>Total sales</th>
            <th style={{ textAlign: 'right', padding: 8 }}>Transactions</th>
            {showChart && <th style={{ textAlign: 'left', padding: 8 }}>Chart</th>}
          </tr>
        </thead>
        <tbody>
          {rows.map((r) => (
            <tr key={r.region}>
              <td style={{ padding: 8, borderTop: '1px solid #e6edf3' }}>{r.region}</td>
              <td style={{ padding: 8, borderTop: '1px solid #e6edf3', textAlign: 'right' }}>
                ${r.totalSales.toFixed(2)}
              </td>
              <td style={{ padding: 8, borderTop: '1px solid #e6edf3', textAlign: 'right' }}>{r.transactions}</td>
              {showChart && (
                <td style={{ padding: 8, borderTop: '1px solid #e6edf3' }}>
                  <div style={{ background: '#f1f5f9', height: 12, width: 200, borderRadius: 6, overflow: 'hidden' }}>
                    <div
                      style={{
                        height: '100%',
                        width: `${max > 0 ? (r.totalSales / max) * 100 : 0}%`,
                        background: '#38bdf8',
                      }}
                    />
                  </div>
                </td>
              )}
            </tr>
          ))}
          {rows.length === 0 && (
            <tr>
              <td colSpan={showChart ? 4 : 3} style={{ padding: 12, textAlign: 'center' }}>
                No data
              </td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  );
}
