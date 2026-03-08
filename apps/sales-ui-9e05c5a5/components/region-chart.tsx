import React, { useMemo, useState } from 'react';

export type SalesRecord = {
  region: string;
  subregion?: string;
  date: string; // ISO date
  amount: number;
};

type Props = {
  data?: SalesRecord[];
};

const sampleData: SalesRecord[] = [
  { region: 'North', subregion: 'N-1', date: '2026-01-15', amount: 12000 },
  { region: 'North', subregion: 'N-2', date: '2026-02-20', amount: 18000 },
  { region: 'South', subregion: 'S-1', date: '2026-01-10', amount: 9000 },
  { region: 'South', subregion: 'S-2', date: '2026-03-08', amount: 16000 },
  { region: 'East', subregion: 'E-1', date: '2026-01-30', amount: 7000 },
  { region: 'West', subregion: 'W-1', date: '2026-02-14', amount: 20000 },
  { region: 'West', subregion: 'W-2', date: '2026-03-02', amount: 5000 },
  { region: 'East', subregion: 'E-2', date: '2026-03-12', amount: 12000 }
];

function formatCurrency(v: number) {
  return v.toLocaleString(undefined, { style: 'currency', currency: 'USD', maximumFractionDigits: 0 });
}

function monthKey(dateStr: string) {
  const d = new Date(dateStr);
  return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}`;
}

export default function RegionChart({ data = sampleData }: Props) {
  const [startDate, setStartDate] = useState<string>('2026-01-01');
  const [endDate, setEndDate] = useState<string>('2026-12-31');
  const [selectedRegion, setSelectedRegion] = useState<string | null>(null);
  const [view, setView] = useState<'region' | 'subregion' | 'monthly'>('region');

  const filtered = useMemo(() => {
    const s = new Date(startDate);
    const e = new Date(endDate);
    return data.filter((r) => {
      const d = new Date(r.date);
      return d >= s && d <= e;
    });
  }, [data, startDate, endDate]);

  const totalsByRegion = useMemo(() => {
    const map = new Map<string, number>();
    for (const r of filtered) {
      map.set(r.region, (map.get(r.region) || 0) + r.amount);
    }
    return Array.from(map.entries()).map(([region, total]) => ({ region, total })).sort((a, b) => b.total - a.total);
  }, [filtered]);

  const totalsBySubregion = useMemo(() => {
    if (!selectedRegion) return [];
    const map = new Map<string, number>();
    for (const r of filtered.filter((f) => f.region === selectedRegion)) {
      const key = r.subregion || 'Unknown';
      map.set(key, (map.get(key) || 0) + r.amount);
    }
    return Array.from(map.entries()).map(([subregion, total]) => ({ subregion, total })).sort((a, b) => b.total - a.total);
  }, [filtered, selectedRegion]);

  const monthlySeries = useMemo(() => {
    const map = new Map<string, number>();
    const source = selectedRegion ? filtered.filter((f) => f.region === selectedRegion) : filtered;
    for (const r of source) {
      const key = monthKey(r.date);
      map.set(key, (map.get(key) || 0) + r.amount);
    }
    const arr = Array.from(map.entries()).map(([month, total]) => ({ month, total }));
    arr.sort((a, b) => a.month.localeCompare(b.month));
    return arr;
  }, [filtered, selectedRegion]);

  const totalSales = useMemo(() => filtered.reduce((s, r) => s + r.amount, 0), [filtered]);
  const topRegion = totalsByRegion[0]?.region || '—';

  const chartWidth = 700;
  const chartHeight = 320;
  const padding = 40;

  function renderBars(items: { key: string; value: number }[], onBarClick?: (k: string) => void) {
    const max = Math.max(...items.map((i) => i.value), 1);
    const barWidth = (chartWidth - padding * 2) / items.length - 12;
    return (
      <svg width={chartWidth} height={chartHeight} style={{ border: '1px solid #eee', background: '#fff' }}>
        <g transform={`translate(${padding},10)`}>
          {items.map((it, idx) => {
            const x = idx * (barWidth + 12);
            const h = (it.value / max) * (chartHeight - padding - 30);
            const y = chartHeight - padding - h - 10;
            return (
              <g key={it.key}>
                <rect
                  x={x}
                  y={y}
                  width={barWidth}
                  height={h}
                  fill="#4f46e5"
                  style={{ cursor: onBarClick ? 'pointer' : 'default' }}
                  onClick={() => onBarClick && onBarClick(it.key)}
                />
                <text x={x + barWidth / 2} y={chartHeight - padding + 14} fontSize={12} textAnchor="middle">
                  {it.key}
                </text>
                <text x={x + barWidth / 2} y={y - 6} fontSize={12} textAnchor="middle" fill="#111">
                  {formatCurrency(it.value)}
                </text>
              </g>
            );
          })}
        </g>
      </svg>
    );
  }

  function renderLine(series: { month: string; total: number }[]) {
    if (series.length === 0) return <div style={{ padding: 20 }}>No data to display</div>;
    const max = Math.max(...series.map((s) => s.total));
    const w = chartWidth - padding * 2;
    const h = chartHeight - padding - 20;
    const stepX = w / Math.max(series.length - 1, 1);
    const points = series
      .map((s, i) => {
        const x = padding + i * stepX;
        const y = 10 + (1 - s.total / max) * h;
        return `${x},${y}`;
      })
      .join(' ');

    return (
      <svg width={chartWidth} height={chartHeight} style={{ border: '1px solid #eee', background: '#fff' }}>
        <polyline fill="none" stroke="#ef4444" strokeWidth={3} points={points} />
        {series.map((s, i) => {
          const x = padding + i * stepX;
          const y = 10 + (1 - s.total / max) * h;
          return (
            <g key={s.month}>
              <circle cx={x} cy={y} r={4} fill="#ef4444" />
              <text x={x} y={y - 8} fontSize={11} textAnchor="middle">
                {formatCurrency(s.total)}
              </text>
              <text x={x} y={chartHeight - 6} fontSize={11} textAnchor="middle">
                {s.month}
              </text>
            </g>
          );
        })}
      </svg>
    );
  }

  return (
    <div style={{ fontFamily: 'Inter, system-ui, Arial', maxWidth: chartWidth }}>
      <h3>Ventas por región</h3>

      <div style={{ display: 'flex', gap: 12, marginBottom: 12, alignItems: 'center' }}>
        <label>
          Desde:{' '}
          <input type="date" value={startDate} onChange={(e) => setStartDate(e.target.value)} />
        </label>
        <label>
          Hasta:{' '}
          <input type="date" value={endDate} onChange={(e) => setEndDate(e.target.value)} />
        </label>
        <label>
          Ver:{' '}
          <select
            value={view}
            onChange={(e) => {
              const v = e.target.value as any;
              setView(v);
            }}
          >
            <option value="region">Región</option>
            <option value="monthly">Mensual</option>
            <option value="subregion">Subregión (seleccionar)</option>
          </select>
        </label>
        <div style={{ marginLeft: 'auto', textAlign: 'right' }}>
          <div style={{ fontSize: 14 }}>Total ventas</div>
          <div style={{ fontWeight: 700, fontSize: 18 }}>{formatCurrency(totalSales)}</div>
          <div style={{ fontSize: 12, color: '#555' }}>Top: {topRegion}</div>
        </div>
      </div>

      <div style={{ marginBottom: 12 }}>
        {view === 'region' && (
          <div>
            {renderBars(totalsByRegion.map((t) => ({ key: t.region, value: t.total })), (k) => {
              setSelectedRegion(k);
              setView('subregion');
            }))}
          </div>
        )}

        {view === 'subregion' && selectedRegion && (
          <div>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 8 }}>
              <div>
                <button onClick={() => { setView('region'); setSelectedRegion(null); }}>← Volver</button>
                <strong style={{ marginLeft: 8 }}>{selectedRegion} — Subregiones</strong>
              </div>
              <div style={{ fontSize: 14 }}>{formatCurrency(totalsBySubregion.reduce((s, r) => s + r.total, 0))}</div>
            </div>
            {renderBars(totalsBySubregion.map((t) => ({ key: t.subregion, value: t.total })))}
            <div style={{ marginTop: 8 }}>
              <button onClick={() => setView('monthly')}>Ver serie mensual</button>
            </div>
          </div>
        )}

        {view === 'monthly' && (
          <div>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 8 }}>
              <div>
                <button onClick={() => { setView('region'); setSelectedRegion(null); }}>← Volver</button>
                <strong style={{ marginLeft: 8 }}>{selectedRegion ? `${selectedRegion} — Mensual` : 'Mensual'}</strong>
              </div>
              <div style={{ fontSize: 14 }}>{formatCurrency(monthlySeries.reduce((s, r) => s + r.total, 0))}</div>
            </div>
            {renderLine(monthlySeries)}
          </div>
        )}
      </div>

      <div style={{ color: '#666', fontSize: 13 }}>
        Haz clic en una barra para ver subregiones. Usa los filtros de fecha para acotar el periodo.
      </div>
    </div>
  );
}
