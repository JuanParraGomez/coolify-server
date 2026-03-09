'use client'

import React, { useMemo, useState } from 'react';

export type SaleRecord = {
  region: string;
  subregion?: string;
  amount: number;
  date: string; // ISO date string
  category?: string;
};

type Props = {
  data: SaleRecord[];
  height?: number;
  width?: number;
  initialCategory?: string | 'All';
};

const formatCurrency = (n: number) =>
  n.toLocaleString(undefined, { style: 'currency', currency: 'USD', maximumFractionDigits: 0 });

export default function RegionChart({ data, height = 300, width = 700, initialCategory = 'All' }: Props) {
  const [dateFrom, setDateFrom] = useState<string>('');
  const [dateTo, setDateTo] = useState<string>('');
  const [category, setCategory] = useState<string | 'All'>(initialCategory);
  const [drillRegion, setDrillRegion] = useState<string | null>(null);

  const categories = useMemo(() => {
    const c = new Set<string>();
    data.forEach((d) => d.category && c.add(d.category));
    return ['All', ...Array.from(c).sort()];
  }, [data]);

  const filtered = useMemo(() => {
    return data.filter((r) => {
      if (category !== 'All' && r.category !== category) return false;
      if (dateFrom && new Date(r.date) < new Date(dateFrom)) return false;
      if (dateTo && new Date(r.date) > new Date(dateTo)) return false;
      return true;
    });
  }, [data, category, dateFrom, dateTo]);

  const byRegion = useMemo(() => {
    const map = new Map<string, number>();
    filtered.forEach((r) => {
      map.set(r.region, (map.get(r.region) || 0) + r.amount);
    });
    return Array.from(map.entries()).map(([region, amount]) => ({ region, amount })).sort((a, b) => b.amount - a.amount);
  }, [filtered]);

  const bySubregion = useMemo(() => {
    if (!drillRegion) return [] as { subregion: string; amount: number }[];
    const map = new Map<string, number>();
    filtered
      .filter((r) => r.region === drillRegion)
      .forEach((r) => {
        const key = r.subregion || 'Unknown';
        map.set(key, (map.get(key) || 0) + r.amount);
      });
    return Array.from(map.entries()).map(([subregion, amount]) => ({ subregion, amount })).sort((a, b) => b.amount - a.amount);
  }, [filtered, drillRegion]);

  const padding = 40;
  const chartWidth = width - padding * 2;
  const chartHeight = height - padding * 2;

  const maxRegion = Math.max(1, ...byRegion.map((r) => r.amount));
  const maxSub = Math.max(1, ...bySubregion.map((s) => s.amount));

  return (
    <div style={{ fontFamily: 'Inter, system-ui, -apple-system, sans-serif', maxWidth: width }}>
      <h3 style={{ margin: '0 0 8px 0' }}>Ventas por región</h3>

      <div style={{ display: 'flex', gap: 12, marginBottom: 12, alignItems: 'center' }}>
        <label style={{ display: 'flex', flexDirection: 'column', fontSize: 12 }}>
          Desde
          <input type="date" value={dateFrom} onChange={(e) => setDateFrom(e.target.value)} />
        </label>
        <label style={{ display: 'flex', flexDirection: 'column', fontSize: 12 }}>
          Hasta
          <input type="date" value={dateTo} onChange={(e) => setDateTo(e.target.value)} />
        </label>
        <label style={{ display: 'flex', flexDirection: 'column', fontSize: 12 }}>
          Categoría
          <select value={category} onChange={(e) => setCategory(e.target.value)}>
            {categories.map((c) => (
              <option key={c} value={c}>
                {c}
              </option>
            ))}
          </select>
        </label>
        <div style={{ marginLeft: 'auto', fontSize: 14 }}>
          Total: {formatCurrency(filtered.reduce((s, r) => s + r.amount, 0))}
        </div>
      </div>

      <svg width={width} height={height} role="img" aria-label="Ventas por región">
        <g transform={`translate(${padding}, ${padding})`}>
          {/* Bars for regions */}
          {byRegion.map((r, i) => {
            const barHeight = chartHeight / Math.max(1, byRegion.length) - 8;
            const y = i * (chartHeight / Math.max(1, byRegion.length));
            const barWidth = (r.amount / maxRegion) * chartWidth;
            return (
              <g key={r.region} style={{ cursor: 'pointer' }} onClick={() => setDrillRegion(r.region)}>
                <rect x={0} y={y} width={barWidth} height={barHeight} rx={4} fill="#4f46e5" opacity={0.9}></rect>
                <text x={Math.max(6, barWidth + 6)} y={y + barHeight / 2 + 5} fontSize={12} fill="#111">
                  {r.region} — {formatCurrency(r.amount)}
                </text>
              </g>
            );
          })}

          {/* Labels on left */}
          <g>
            {byRegion.map((r, i) => {
              const barHeight = chartHeight / Math.max(1, byRegion.length) - 8;
              const y = i * (chartHeight / Math.max(1, byRegion.length));
              return (
                <text key={r.region + '-label'} x={-10} y={y + barHeight / 2 + 5} fontSize={12} textAnchor="end" fill="#333">
                  {r.region}
                </text>
              );
            })}
          </g>
        </g>
      </svg>

      {drillRegion && (
        <div style={{ marginTop: 12 }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <h4 style={{ margin: 0 }}>Detalle: {drillRegion}</h4>
            <div>
              <button
                onClick={() => setDrillRegion(null)}
                style={{ padding: '6px 10px', borderRadius: 6, border: '1px solid #ddd', background: '#fff' }}
              >
                ← Volver
              </button>
            </div>
          </div>

          <div style={{ display: 'flex', gap: 12, marginTop: 8 }}>
            <div style={{ flex: 1 }}>
              {bySubregion.length === 0 ? (
                <div style={{ padding: 12, border: '1px dashed #ddd' }}>No hay datos para esta región con los filtros actuales.</div>
              ) : (
                <svg width={width} height={Math.max(120, bySubregion.length * 40)} role="img" aria-label={`Subregiones de ${drillRegion}`}>
                  <g transform={`translate(${padding}, 10)`}>
                    {bySubregion.map((s, i) => {
                      const barHeight = 24;
                      const y = i * 36;
                      const barWidth = (s.amount / maxSub) * (chartWidth * 0.9);
                      return (
                        <g key={s.subregion}>
                          <rect x={0} y={y} width={barWidth} height={barHeight} rx={4} fill="#06b6d4" />
                          <text x={Math.max(6, barWidth + 8)} y={y + barHeight / 2 + 5} fontSize={12} fill="#111">
                            {s.subregion} — {formatCurrency(s.amount)}
                          </text>
                        </g>
                      );
                    })}
                  </g>
                </svg>
              )}
            </div>

            <div style={{ width: 220, padding: 12, border: '1px solid #f1f1f1', borderRadius: 8 }}>
              <h5 style={{ margin: '0 0 8px 0' }}>Resumen</h5>
              <div style={{ fontSize: 14 }}>
                Regiones: {byRegion.length}
                <br />
                Subregiones (seleccionadas): {bySubregion.length}
                <br />
                Total región: {formatCurrency(byRegion.find((b) => b.region === drillRegion)?.amount || 0)}
              </div>
            </div>
          </div>
        </div>
      )}

      <div style={{ marginTop: 8, fontSize: 12, color: '#666' }}>Haz clic en una barra para ver el detalle por subregión.</div>
    </div>
  );
}
