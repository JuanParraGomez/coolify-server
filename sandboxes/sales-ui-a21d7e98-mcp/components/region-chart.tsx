import React, { useMemo, useState } from 'react';

export type SalesRecord = {
  region: string;
  subregion?: string;
  product?: string;
  date: string; // ISO date
  sales: number;
};

type Props = {
  salesData?: SalesRecord[];
};

// Simple currency formatter
const fmt = (v: number) =>
  v.toLocaleString(undefined, { style: 'currency', currency: 'USD', maximumFractionDigits: 0 });

// Aggregate helper
function aggregate(records: SalesRecord[], key: (r: SalesRecord) => string) {
  const map = new Map<string, number>();
  for (const r of records) {
    const k = key(r) || 'Unknown';
    map.set(k, (map.get(k) || 0) + r.sales);
  }
  return Array.from(map.entries()).map(([label, value]) => ({ label, value }));
}

const sampleData: SalesRecord[] = [
  { region: 'North', subregion: 'N-1', product: 'Widget A', date: '2026-01-05', sales: 12000 },
  { region: 'North', subregion: 'N-2', product: 'Widget B', date: '2026-01-06', sales: 8000 },
  { region: 'South', subregion: 'S-1', product: 'Widget A', date: '2026-02-01', sales: 15000 },
  { region: 'South', subregion: 'S-2', product: 'Widget C', date: '2026-02-10', sales: 4000 },
  { region: 'East', subregion: 'E-1', product: 'Widget B', date: '2026-03-03', sales: 7000 },
  { region: 'West', subregion: 'W-1', product: 'Widget A', date: '2026-03-10', sales: 20000 },
];

export default function RegionChart({ salesData = sampleData }: Props) {
  // Filters
  const [startDate, setStartDate] = useState<string | ''>('');
  const [endDate, setEndDate] = useState<string | ''>('');
  const [productFilter, setProductFilter] = useState('');

  // Drill state: null = region view, string = drilled region
  const [drillRegion, setDrillRegion] = useState<string | null>(null);

  // Derived filtered data
  const filtered = useMemo(() => {
    return salesData.filter((r) => {
      if (productFilter && r.product && !r.product.toLowerCase().includes(productFilter.toLowerCase())) return false;
      if (startDate && r.date < startDate) return false;
      if (endDate && r.date > endDate) return false;
      return true;
    });
  }, [salesData, startDate, endDate, productFilter]);

  // Top-level aggregation: by region, or by subregion when drilled
  const aggregated = useMemo(() => {
    if (!drillRegion) {
      return aggregate(filtered, (r) => r.region);
    }
    return aggregate(filtered.filter((r) => r.region === drillRegion), (r) => r.subregion || r.product || 'Unknown');
  }, [filtered, drillRegion]);

  const totalSales = useMemo(() => filtered.reduce((s, r) => s + r.sales, 0), [filtered]);
  const avgSale = useMemo(() => (filtered.length ? Math.round(totalSales / filtered.length) : 0), [totalSales, filtered.length]);

  const topProduct = useMemo(() => {
    const m = new Map<string, number>();
    for (const r of filtered) {
      const p = r.product || 'Unknown';
      m.set(p, (m.get(p) || 0) + r.sales);
    }
    let best = '';
    let bestVal = 0;
    for (const [p, v] of m.entries()) {
      if (v > bestVal) {
        best = p;
        bestVal = v;
      }
    }
    return best ? `${best} (${fmt(bestVal)})` : '—';
  }, [filtered]);

  // Chart dimensions
  const width = 600;
  const barHeight = 28;
  const gap = 8;
  const height = aggregated.length * (barHeight + gap) + 40;
  const maxValue = Math.max(...aggregated.map((a) => a.value), 1);

  return (
    <div style={{ fontFamily: 'Inter, system-ui, Arial', maxWidth: 900 }}>
      <h3>Ventas por Región</h3>

      {/* Filters */}
      <div style={{ display: 'flex', gap: 12, marginBottom: 12, alignItems: 'center' }}>
        <label style={{ display: 'flex', flexDirection: 'column', fontSize: 12 }}>
          Desde
          <input type="date" value={startDate} onChange={(e) => setStartDate(e.target.value)} />
        </label>
        <label style={{ display: 'flex', flexDirection: 'column', fontSize: 12 }}>
          Hasta
          <input type="date" value={endDate} onChange={(e) => setEndDate(e.target.value)} />
        </label>
        <label style={{ display: 'flex', flexDirection: 'column', fontSize: 12, flex: 1 }}>
          Producto
          <input placeholder="Filtrar producto" value={productFilter} onChange={(e) => setProductFilter(e.target.value)} />
        </label>
        <button onClick={() => { setStartDate(''); setEndDate(''); setProductFilter(''); setDrillRegion(null); }} style={{ height: 36 }}>Limpiar</button>
      </div>

      {/* Summary */}
      <div style={{ display: 'flex', gap: 12, marginBottom: 12 }}>
        <div style={{ padding: 12, border: '1px solid #e5e7eb', borderRadius: 8, minWidth: 140 }}>
          <div style={{ fontSize: 12, color: '#6b7280' }}>Total ventas</div>
          <div style={{ fontSize: 18, fontWeight: 600 }}>{fmt(totalSales)}</div>
        </div>
        <div style={{ padding: 12, border: '1px solid #e5e7eb', borderRadius: 8, minWidth: 140 }}>
          <div style={{ fontSize: 12, color: '#6b7280' }}>Venta promedio</div>
          <div style={{ fontSize: 18, fontWeight: 600 }}>{fmt(avgSale)}</div>
        </div>
        <div style={{ padding: 12, border: '1px solid #e5e7eb', borderRadius: 8, minWidth: 220 }}>
          <div style={{ fontSize: 12, color: '#6b7280' }}>Producto top</div>
          <div style={{ fontSize: 16, fontWeight: 600 }}>{topProduct}</div>
        </div>
      </div>

      {/* Drill indicator */}
      <div style={{ marginBottom: 8, display: 'flex', alignItems: 'center', gap: 8 }}>
        {!drillRegion ? (
          <div style={{ fontSize: 13, color: '#374151' }}>Vista por región</div>
        ) : (
          <div style={{ display: 'flex', gap: 8, alignItems: 'center' }}>
            <button onClick={() => setDrillRegion(null)} style={{ fontSize: 12 }}>← Volver</button>
            <div style={{ fontSize: 13, color: '#374151' }}>Desglose: {drillRegion}</div>
          </div>
        )}
      </div>

      {/* Chart */}
      <div style={{ border: '1px solid #eef2f7', padding: 12, borderRadius: 8 }}>
        {aggregated.length === 0 ? (
          <div style={{ padding: 40, textAlign: 'center', color: '#6b7280' }}>No hay datos para los filtros seleccionados.</div>
        ) : (
          <svg width={width} height={height}>
            {aggregated.map((a, i) => {
              const y = i * (barHeight + gap);
              const w = Math.max(2, (a.value / maxValue) * (width - 260));
              return (
                <g key={a.label} transform={`translate(0, ${y})`}>
                  <rect x={160} y={4} width={w} height={barHeight} rx={6} fill="#3b82f6" style={{ cursor: 'pointer' }} onClick={() => !drillRegion && setDrillRegion(a.label)}/>
                  <text x={8} y={barHeight / 2 + 6} fontSize={13} fill="#111827">{a.label}</text>
                  <text x={160 + w + 8} y={barHeight / 2 + 6} fontSize={13} fill="#111827">{fmt(a.value)}</text>
                </g>
              );
            })}
          </svg>
        )}
      </div>

      {/* Footer: simple legend / tips */}
      <div style={{ marginTop: 10, fontSize: 12, color: '#6b7280' }}>Haz clic en una barra para ver el desglose por subregión/producto.</div>
    </div>
  );
}
