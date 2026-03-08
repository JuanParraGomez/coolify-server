import React, { useMemo, useState } from 'react';

// Simple, dependency-free region sales chart with drill-down and filters.
// Props: data: Array<{ region, country?, amount, date }>

type Sale = {
  region: string;
  country?: string;
  amount: number;
  date: string | Date;
};

type Props = {
  data: Sale[];
  width?: number;
  height?: number;
};

function parseDate(d: string | Date) {
  return d instanceof Date ? d : new Date(d);
}

function formatCurrency(n: number) {
  return n.toLocaleString(undefined, { style: 'currency', currency: 'USD', maximumFractionDigits: 0 });
}

export default function RegionChart({ data, width = 800, height = 320 }: Props) {
  const [selectedRegion, setSelectedRegion] = useState<string | null>(null);
  const [minAmount, setMinAmount] = useState<number>(0);
  const [dateFrom, setDateFrom] = useState<string>('');
  const [dateTo, setDateTo] = useState<string>('');

  // normalize data: ensure dates
  const normalized = useMemo(() => {
    return data.map((s) => ({ ...s, date: parseDate(s.date) }));
  }, [data]);

  // apply filters
  const filtered = useMemo(() => {
    return normalized.filter((s) => {
      if (s.amount < minAmount) return false;
      if (dateFrom) {
        const from = new Date(dateFrom);
        if (s.date < from) return false;
      }
      if (dateTo) {
        const to = new Date(dateTo);
        // include entire day
        to.setHours(23, 59, 59, 999);
        if (s.date > to) return false;
      }
      return true;
    });
  }, [normalized, minAmount, dateFrom, dateTo]);

  // aggregated sales by region
  const regionAggregates = useMemo(() => {
    const map = new Map<string, number>();
    filtered.forEach((s) => {
      const r = s.region || 'Unknown';
      map.set(r, (map.get(r) || 0) + s.amount);
    });
    const arr = Array.from(map.entries()).map(([region, total]) => ({ region, total }));
    arr.sort((a, b) => b.total - a.total);
    return arr;
  }, [filtered]);

  const totalSales = useMemo(() => regionAggregates.reduce((a, b) => a + b.total, 0), [regionAggregates]);

  // when a region is selected, compute country breakdown
  const countryBreakdown = useMemo(() => {
    if (!selectedRegion) return [] as { country: string; total: number }[];
    const map = new Map<string, number>();
    filtered
      .filter((s) => (s.region || 'Unknown') === selectedRegion)
      .forEach((s) => {
        const c = s.country || 'Unknown';
        map.set(c, (map.get(c) || 0) + s.amount);
      });
    const arr = Array.from(map.entries()).map(([country, total]) => ({ country, total }));
    arr.sort((a, b) => b.total - a.total);
    return arr;
  }, [filtered, selectedRegion]);

  // simple color palette
  const colors = [
    '#3B82F6',
    '#10B981',
    '#F59E0B',
    '#EF4444',
    '#8B5CF6',
    '#06B6D4',
    '#F472B6',
  ];

  // SVG bar chart sizing
  const padding = { top: 20, right: 20, bottom: 60, left: 80 };
  const chartW = width - padding.left - padding.right;
  const chartH = height - padding.top - padding.bottom;
  const maxValue = Math.max(...regionAggregates.map((r) => r.total), 1);
  const barGap = 12;
  const barWidth = regionAggregates.length > 0 ? Math.max(16, (chartW - (regionAggregates.length - 1) * barGap) / regionAggregates.length) : 0;

  return (
    <div style={{ fontFamily: 'Inter, system-ui, -apple-system, Segoe UI, Roboto, sans-serif', width }}>
      <h3 style={{ margin: '8px 0' }}>Ventas por Región</h3>

      <div style={{ display: 'flex', gap: 12, alignItems: 'center', marginBottom: 12 }}>
        <label>
          Desde:{' '}
          <input type="date" value={dateFrom} onChange={(e) => setDateFrom(e.target.value)} />
        </label>
        <label>
          Hasta:{' '}
          <input type="date" value={dateTo} onChange={(e) => setDateTo(e.target.value)} />
        </label>
        <label>
          Mínimo:{' '}
          <input type="number" min={0} value={minAmount} onChange={(e) => setMinAmount(Number(e.target.value || 0))} style={{ width: 100 }} />
        </label>
        <button onClick={() => { setMinAmount(0); setDateFrom(''); setDateTo(''); setSelectedRegion(null); }}>Reset</button>
        <div style={{ marginLeft: 'auto', textAlign: 'right' }}>
          <div style={{ fontSize: 12, color: '#666' }}>Total ventas</div>
          <div style={{ fontWeight: 700 }}>{formatCurrency(totalSales)}</div>
        </div>
      </div>

      <svg width={width} height={height} role="img" aria-label="Gráfico de ventas por región">
        <g transform={`translate(${padding.left},${padding.top})`}>
          {/* Y axis labels */}
          {Array.from({ length: 4 }).map((_, i) => {
            const val = Math.round((maxValue * i) / 3);
            const y = chartH - (chartH * i) / 3;
            return (
              <g key={i}>
                <line x1={-6} x2={chartW} y1={y} y2={y} stroke={i === 0 ? '#eee' : '#f5f5f5'} />
                <text x={-10} y={y + 4} fontSize={11} textAnchor="end" fill="#333">
                  {formatCurrency(val)}
                </text>
              </g>
            );
          })}

          {/* Bars */}
          {regionAggregates.map((r, idx) => {
            const x = idx * (barWidth + barGap);
            const h = (r.total / maxValue) * chartH;
            const y = chartH - h;
            const color = colors[idx % colors.length];
            const isSelected = selectedRegion === r.region;
            return (
              <g key={r.region} transform={`translate(${x},0)`}> 
                <rect
                  x={0}
                  y={y}
                  width={barWidth}
                  height={h}
                  fill={color}
                  opacity={isSelected ? 1 : 0.9}
                  style={{ cursor: 'pointer', transition: 'opacity 150ms' }}
                  onClick={() => setSelectedRegion(isSelected ? null : r.region)}
                />
                <text x={barWidth / 2} y={chartH + 16} fontSize={12} textAnchor="middle" fill="#111">
                  {r.region}
                </text>
                <title>{`${r.region}: ${formatCurrency(r.total)}`}</title>
              </g>
            );
          })}
        </g>
      </svg>

      {/* Drill-down and summary */}
      <div style={{ display: 'flex', gap: 16, marginTop: 12 }}>
        <div style={{ flex: 1 }}>
          <h4 style={{ margin: '6px 0' }}>{selectedRegion ? `Detalle: ${selectedRegion}` : 'Resumen por Región'}</h4>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 120px', gap: 8, alignItems: 'center' }}>
            {regionAggregates.map((r, idx) => (
              <div key={r.region} style={{ display: 'contents' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                  <span style={{ width: 12, height: 12, background: colors[idx % colors.length], display: 'inline-block', borderRadius: 2 }} />
                  <div style={{ fontWeight: 600 }}>{r.region}</div>
                </div>
                <div style={{ textAlign: 'right' }}>{formatCurrency(r.total)}</div>
              </div>
            ))}
          </div>
        </div>

        <div style={{ width: 320 }}>
          {selectedRegion ? (
            <div>
              <h5 style={{ margin: '6px 0' }}>Top países en {selectedRegion}</h5>
              {countryBreakdown.length === 0 ? (
                <div style={{ color: '#666' }}>No hay datos con los filtros actuales.</div>
              ) : (
                <ul style={{ margin: 0, padding: 0, listStyle: 'none' }}>
                  {countryBreakdown.map((c, i) => (
                    <li key={c.country} style={{ display: 'flex', justifyContent: 'space-between', padding: '6px 0', borderBottom: '1px solid #f3f3f3' }}>
                      <div style={{ display: 'flex', gap: 8, alignItems: 'center' }}>
                        <span style={{ width: 10, height: 10, background: colors[i % colors.length], display: 'inline-block', borderRadius: 2 }} />
                        <div>{c.country}</div>
                      </div>
                      <div>{formatCurrency(c.total)}</div>
                    </li>
                  ))}
                </ul>
              )}
              <div style={{ marginTop: 8, fontSize: 13 }}>
                <strong>Total:</strong> {formatCurrency(countryBreakdown.reduce((a, b) => a + b.total, 0))}
              </div>
            </div>
          ) : (
            <div>
              <h5 style={{ margin: '6px 0' }}>Resumen rápido</h5>
              <div style={{ color: '#555' }}>Haz clic en una barra para ver detalle por país.</div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
