"use client";

import React, { useMemo, useState } from 'react';

export type Sale = {
  region: string;
  subregion?: string;
  month?: string; // yyyy-mm
  value: number;
};

type Props = {
  data?: Sale[];
  initialRegion?: string | null;
};

// Small, dependency-free interactive region sales chart with drill-down.
export default function RegionChart({ data, initialRegion = null }: Props) {
  // Demo fallback data when none provided
  const demoData: Sale[] = [
    { region: 'North', subregion: 'North-A', month: '2026-01', value: 12000 },
    { region: 'North', subregion: 'North-B', month: '2026-01', value: 8000 },
    { region: 'South', subregion: 'South-A', month: '2026-01', value: 15000 },
    { region: 'East', subregion: 'East-A', month: '2026-01', value: 5000 },
    { region: 'West', subregion: 'West-A', month: '2026-01', value: 22000 },
    { region: 'West', subregion: 'West-B', month: '2026-02', value: 18000 },
    { region: 'South', subregion: 'South-B', month: '2026-02', value: 7000 },
  ];

  const dataset = data && data.length > 0 ? data : demoData;

  const [regionFilter, setRegionFilter] = useState<string | 'all'>(initialRegion || 'all');
  const [selectedRegion, setSelectedRegion] = useState<string | null>(null);
  const [monthFilter, setMonthFilter] = useState<string | 'all'>('all');

  // Unique lists
  const regions = useMemo(() => {
    const s = new Set<string>();
    dataset.forEach((d) => s.add(d.region));
    return Array.from(s).sort();
  }, [dataset]);

  const months = useMemo(() => {
    const s = new Set<string>();
    dataset.forEach((d) => d.month && s.add(d.month));
    return Array.from(s).sort();
  }, [dataset]);

  // Aggregated totals per region (respecting filters)
  const totalsByRegion = useMemo(() => {
    const map = new Map<string, number>();
    dataset
      .filter((d) => (regionFilter === 'all' ? true : d.region === regionFilter))
      .filter((d) => (monthFilter === 'all' ? true : d.month === monthFilter))
      .forEach((d) => map.set(d.region, (map.get(d.region) || 0) + d.value));
    return Array.from(map.entries()).map(([region, total]) => ({ region, total }));
  }, [dataset, regionFilter, monthFilter]);

  const totalSales = totalsByRegion.reduce((s, r) => s + r.total, 0);
  const topRegion = totalsByRegion.slice().sort((a, b) => b.total - a.total)[0]?.region || null;
  const maxValue = totalsByRegion.reduce((m, r) => Math.max(m, r.total), 0) || 1;

  // Drill-down data for selected region
  const drillDown = useMemo(() => {
    if (!selectedRegion) return [];
    const map = new Map<string, number>();
    dataset
      .filter((d) => d.region === selectedRegion)
      .filter((d) => (monthFilter === 'all' ? true : d.month === monthFilter))
      .forEach((d) => {
        const key = d.subregion || d.month || 'Other';
        map.set(key, (map.get(key) || 0) + d.value);
      });
    return Array.from(map.entries()).map(([key, total]) => ({ key, total }));
  }, [dataset, selectedRegion, monthFilter]);

  // Render helpers
  const svgWidth = 700;
  const barHeight = 28;
  const gap = 8;
  const chartHeight = totalsByRegion.length * (barHeight + gap) + 40;

  return (
    <div style={{ fontFamily: 'Inter, system-ui, Arial', color: '#111' }}>
      <h3 style={{ margin: '0 0 12px 0' }}>Ventas por Región</h3>

      <div style={{ display: 'flex', gap: 12, marginBottom: 12, alignItems: 'center' }}>
        <label>
          Región:
          <select
            value={regionFilter}
            onChange={(e) => {
              const v = e.target.value as string;
              setRegionFilter(v as any);
              setSelectedRegion(null);
            }}
            style={{ marginLeft: 8 }}
          >
            <option value="all">Todas</option>
            {regions.map((r) => (
              <option key={r} value={r}>
                {r}
              </option>
            ))}
          </select>
        </label>

        <label>
          Mes:
          <select
            value={monthFilter}
            onChange={(e) => {
              const v = e.target.value as string;
              setMonthFilter(v as any);
              setSelectedRegion(null);
            }}
            style={{ marginLeft: 8 }}
          >
            <option value="all">Todos</option>
            {months.map((m) => (
              <option key={m} value={m}>
                {m}
              </option>
            ))}
          </select>
        </label>

        <div style={{ marginLeft: 'auto', display: 'flex', gap: 8, alignItems: 'center' }}>
          <div style={{ fontSize: 12, color: '#666' }}>Total:</div>
          <div style={{ fontWeight: 700 }}>{totalSales.toLocaleString()} €</div>
          <div style={{ fontSize: 12, color: '#666', marginLeft: 12 }}>Top:</div>
          <div style={{ background: '#eef6ff', padding: '4px 8px', borderRadius: 6 }}>{topRegion || '—'}</div>
        </div>
      </div>

      <div style={{ display: 'flex', gap: 20 }}>
        <div>
          {totalsByRegion.length === 0 ? (
            <div style={{ color: '#666' }}>No hay datos para los filtros seleccionados.</div>
          ) : (
            <svg width={svgWidth} height={chartHeight} role="img" aria-label="Bar chart of sales by region">
              {totalsByRegion.map((r, i) => {
                const y = i * (barHeight + gap) + 20;
                const width = (r.total / maxValue) * (svgWidth - 200);
                const isSelected = selectedRegion === r.region;
                return (
                  <g key={r.region} transform={`translate(0, ${y})`}>
                    <rect
                      x={140}
                      y={0}
                      rx={6}
                      height={barHeight}
                      width={Math.max(6, width)}
                      fill={isSelected ? '#2563eb' : '#60a5fa'}
                      style={{ cursor: 'pointer' }}
                      onClick={() => setSelectedRegion(isSelected ? null : r.region)}
                    />
                    <text x={0} y={barHeight / 2} dy={'.35em'} style={{ fontSize: 12 }}>
                      {r.region}
                    </text>
                    <text x={140 + Math.max(6, width) + 8} y={barHeight / 2} dy={'.35em'} style={{ fontSize: 12, fill: '#111' }}>
                      {r.total.toLocaleString()} €
                    </text>
                  </g>
                );
              })}

              {/* axis label */}
              <text x={0} y={chartHeight - 6} style={{ fontSize: 11, fill: '#666' }}>
                Haga clic en una barra para ver el desglose (drill-down)
              </text>
            </svg>
          )}
        </div>

        <div style={{ minWidth: 260 }}>
          <div style={{ fontWeight: 600, marginBottom: 8 }}>Resumen</div>
          <div style={{ fontSize: 14, marginBottom: 8 }}>Regiones mostradas: {totalsByRegion.length}</div>
          <div style={{ fontSize: 13, color: '#444' }}>
            {totalsByRegion.slice(0, 5).map((r) => (
              <div key={r.region} style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 6 }}>
                <div>{r.region}</div>
                <div style={{ fontWeight: 700 }}>{r.total.toLocaleString()} €</div>
              </div>
            ))}
            {totalsByRegion.length > 5 && <div style={{ color: '#666' }}>...and {totalsByRegion.length - 5} more</div>}
          </div>

          <div style={{ marginTop: 16 }}>
            <div style={{ fontWeight: 600 }}>Interacciones</div>
            <div style={{ fontSize: 13, color: '#666', marginTop: 6 }}>
              Haz clic en una barra para mostrar el desglose por subregión/mes.
            </div>

            {selectedRegion && (
              <div style={{ marginTop: 12, border: '1px solid #eee', padding: 8, borderRadius: 6 }}>
                <div style={{ fontWeight: 700 }}>{selectedRegion} — Desglose</div>
                {drillDown.length === 0 ? (
                  <div style={{ color: '#666', marginTop: 8 }}>No hay datos de desglose.</div>
                ) : (
                  <div style={{ marginTop: 8 }}>
                    {drillDown.map((d) => (
                      <div key={d.key} style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 6 }}>
                        <div style={{ color: '#333' }}>{d.key}</div>
                        <div style={{ fontWeight: 700 }}>{d.total.toLocaleString()} €</div>
                      </div>
                    ))}
                  </div>
                )}
                <div style={{ textAlign: 'right', marginTop: 8 }}>
                  <button
                    onClick={() => setSelectedRegion(null)}
                    style={{ background: '#f3f4f6', border: 'none', padding: '6px 10px', borderRadius: 6 }}
                  >
                    Cerrar
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
