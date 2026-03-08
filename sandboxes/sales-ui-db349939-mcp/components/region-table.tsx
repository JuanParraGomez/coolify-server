import React, { useMemo } from 'react';
import type { SalesEntry } from '../lib/mock-data';
import type { Filters } from './filters-panel';

type Props = {
  entries: SalesEntry[];
  filters?: Filters;
};

const applyFilters = (entries: SalesEntry[], filters?: Filters) => {
  if (!filters) return entries;
  const { region, product, dateFrom, dateTo, minAmount } = filters;
  return entries.filter((e) => {
    if (region && region !== 'All' && e.region !== region) return false;
    if (product && product !== 'All' && e.product !== product) return false;
    if (dateFrom && new Date(e.date) < new Date(dateFrom)) return false;
    if (dateTo && new Date(e.date) > new Date(dateTo + 'T23:59:59')) return false;
    if (minAmount !== undefined && e.amount < minAmount) return false;
    return true;
  });
};

const RegionTable: React.FC<Props> = ({ entries, filters }) => {
  const filtered = useMemo(() => applyFilters(entries, filters), [entries, filters]);

  const agg = useMemo(() => {
    const map = new Map<string, { total: number; count: number }>();
    for (const e of filtered) {
      const s = map.get(e.region) ?? { total: 0, count: 0 };
      s.total += e.amount;
      s.count += 1;
      map.set(e.region, s);
    }
    const arr = Array.from(map.entries()).map(([region, { total, count }]) => ({ region, total, count }));
    arr.sort((a, b) => b.total - a.total);
    return arr;
  }, [filtered]);

  const maxTotal = Math.max(0, ...agg.map((a) => a.total));

  return (
    <div>
      <h3>Sales by Region</h3>
      <div style={{ display: 'flex', gap: 24, alignItems: 'flex-start' }}>
        <table style={{ borderCollapse: 'collapse', minWidth: 380 }}>
          <thead>
            <tr>
              <th style={{ textAlign: 'left', borderBottom: '1px solid #ddd', padding: 8 }}>Region</th>
              <th style={{ textAlign: 'right', borderBottom: '1px solid #ddd', padding: 8 }}>Total</th>
              <th style={{ textAlign: 'right', borderBottom: '1px solid #ddd', padding: 8 }}>Orders</th>
            </tr>
          </thead>
          <tbody>
            {agg.map((r) => (
              <tr key={r.region}>
                <td style={{ padding: 8, borderBottom: '1px solid #f3f3f3' }}>{r.region}</td>
                <td style={{ padding: 8, textAlign: 'right', borderBottom: '1px solid #f3f3f3' }}>${r.total.toFixed(2)}</td>
                <td style={{ padding: 8, textAlign: 'right', borderBottom: '1px solid #f3f3f3' }}>{r.count}</td>
              </tr>
            ))}
            {agg.length === 0 && (
              <tr>
                <td colSpan={3} style={{ padding: 8 }}>
                  No data for selected filters.
                </td>
              </tr>
            )}
          </tbody>
        </table>

        <div style={{ width: 300 }}>
          <svg width={300} height={Math.max(100, agg.length * 40)}>
            {agg.map((r, i) => {
              const y = i * 40 + 8;
              const barWidth = maxTotal > 0 ? (r.total / maxTotal) * 220 : 0;
              return (
                <g key={r.region}>
                  <rect x={80} y={y} width={barWidth} height={24} fill="#4f46e5" rx={4} />
                  <text x={76} y={y + 16} textAnchor="end" fontSize={12} fill="#111">
                    {r.region}
                  </text>
                  <text x={80 + barWidth + 8} y={y + 16} fontSize={12} fill="#111">
                    ${r.total.toFixed(0)}
                  </text>
                </g>
              );
            })}
          </svg>
        </div>
      </div>
    </div>
  );
};

export default RegionTable;
