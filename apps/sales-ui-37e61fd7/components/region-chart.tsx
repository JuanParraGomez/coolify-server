"use client";

import React, { useMemo, useState } from "react";

type Sale = {
  region: string;
  product: string;
  amount: number;
  date: string; // ISO date string
};

type Props = {
  data: Sale[];
  initialRegion?: string | null;
};

export default function RegionChart({ data, initialRegion = null }: Props) {
  const [startDate, setStartDate] = useState<string | null>(null);
  const [endDate, setEndDate] = useState<string | null>(null);
  const [query, setQuery] = useState("");
  const [selectedRegion, setSelectedRegion] = useState<string | null>(initialRegion);

  // Filter data by date and search query
  const filtered = useMemo(() => {
    return data.filter((s) => {
      if (startDate && s.date < startDate) return false;
      if (endDate && s.date > endDate) return false;
      if (query && !s.region.toLowerCase().includes(query.toLowerCase())) return false;
      return true;
    });
  }, [data, startDate, endDate, query]);

  // Aggregations
  const totalsByRegion = useMemo(() => {
    const map = new Map<string, number>();
    for (const s of filtered) {
      map.set(s.region, (map.get(s.region) || 0) + s.amount);
    }
    return Array.from(map.entries()).sort((a, b) => b[1] - a[1]);
  }, [filtered]);

  const totalsByProductForSelected = useMemo(() => {
    if (!selectedRegion) return [] as Array<[string, number]>;
    const map = new Map<string, number>();
    for (const s of filtered) {
      if (s.region !== selectedRegion) continue;
      map.set(s.product, (map.get(s.product) || 0) + s.amount);
    }
    return Array.from(map.entries()).sort((a, b) => b[1] - a[1]);
  }, [filtered, selectedRegion]);

  const grandTotal = useMemo(() => filtered.reduce((acc, s) => acc + s.amount, 0), [filtered]);

  // Simple SVG bar chart dimensions
  const width = 700;
  const height = 300;
  const padding = 40;

  const maxRegionTotal = totalsByRegion.length ? Math.max(...totalsByRegion.map((t) => t[1])) : 0;

  return (
    <div style={{ fontFamily: "Inter, Roboto, system-ui, sans-serif", color: "#111" }}>
      <h2 style={{ margin: "0 0 12px 0" }}>Ventas por región</h2>

      <div style={{ display: "flex", gap: 12, flexWrap: "wrap", marginBottom: 12 }}>
        <div>
          <label style={{ display: "block", fontSize: 12 }}>Desde</label>
          <input type="date" onChange={(e) => setStartDate(e.target.value || null)} />
        </div>
        <div>
          <label style={{ display: "block", fontSize: 12 }}>Hasta</label>
          <input type="date" onChange={(e) => setEndDate(e.target.value || null)} />
        </div>
        <div style={{ minWidth: 220 }}>
          <label style={{ display: "block", fontSize: 12 }}>Buscar región</label>
          <input
            placeholder="ej. Norte"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            style={{ width: "100%" }}
          />
        </div>
        <div style={{ marginLeft: "auto", display: "flex", gap: 8 }}>
          <div style={{ textAlign: "right" }}>
            <div style={{ fontSize: 12, color: "#666" }}>Total ventas</div>
            <div style={{ fontWeight: 700, fontSize: 18 }}>€{grandTotal.toFixed(2)}</div>
          </div>
          <div style={{ textAlign: "right" }}>
            <div style={{ fontSize: 12, color: "#666" }}>Regiones</div>
            <div style={{ fontWeight: 700, fontSize: 18 }}>{totalsByRegion.length}</div>
          </div>
        </div>
      </div>

      <div style={{ display: "flex", gap: 24, alignItems: "flex-start", flexWrap: "wrap" }}>
        <div>
          <svg width={width} height={height} role="img" aria-label="Gráfico de barras por región">
            <rect x={0} y={0} width={width} height={height} fill="#fff" />

            {/* Axis labels */}
            <line x1={padding} y1={height - padding} x2={width - padding / 2} y2={height - padding} stroke="#ccc" />

            {totalsByRegion.map(([region, total], i) => {
              const n = totalsByRegion.length;
              const barGap = 10;
              const chartWidth = width - padding * 1.5;
              const barWidth = Math.max(16, (chartWidth - barGap * (n - 1)) / n);
              const x = padding + i * (barWidth + barGap);
              const barHeight = maxRegionTotal ? (total / maxRegionTotal) * (height - padding * 1.4) : 0;
              const y = height - padding - barHeight;
              const isSelected = selectedRegion === region;

              return (
                <g key={region} style={{ cursor: "pointer" }} onClick={() => setSelectedRegion(isSelected ? null : region)}>
                  <rect x={x} y={y} width={barWidth} height={barHeight} fill={isSelected ? "#2563eb" : "#60a5fa"} />
                  <text x={x + barWidth / 2} y={height - padding + 14} fontSize={11} textAnchor="middle">
                    {region}
                  </text>
                  <title>{region + ": €" + total.toFixed(2)}</title>
                </g>
              );
            })}
          </svg>

          <div style={{ marginTop: 8, fontSize: 13, color: "#444" }}>
            Haz clic en una barra para ver el desglose por producto (drill-down). Haz clic de nuevo para volver.
          </div>
        </div>

        <div style={{ minWidth: 260, maxWidth: 420 }}>
          <div style={{ border: "1px solid #eee", padding: 12, borderRadius: 8 }}>
            <div style={{ fontSize: 13, color: "#666" }}>Resumen</div>
            <div style={{ marginTop: 8 }}>
              <div style={{ display: "flex", justifyContent: "space-between" }}>
                <div style={{ color: "#333" }}>Total filtrado</div>
                <div style={{ fontWeight: 700 }}>€{grandTotal.toFixed(2)}</div>
              </div>
              <div style={{ display: "flex", justifyContent: "space-between", marginTop: 6 }}>
                <div style={{ color: "#333" }}>Regiones</div>
                <div style={{ fontWeight: 700 }}>{totalsByRegion.length}</div>
              </div>

              {selectedRegion ? (
                <div style={{ marginTop: 12 }}>
                  <div style={{ fontSize: 13, color: "#666" }}>Desglose — {selectedRegion}</div>
                  <div style={{ marginTop: 8 }}>
                    {totalsByProductForSelected.length ? (
                      totalsByProductForSelected.map(([product, amt]) => {
                        const pct = grandTotal ? (amt / grandTotal) * 100 : 0;
                        return (
                          <div key={product} style={{ marginBottom: 8 }}>
                            <div style={{ display: "flex", justifyContent: "space-between", fontSize: 13 }}>
                              <div>{product}</div>
                              <div style={{ fontWeight: 700 }}>€{amt.toFixed(2)}</div>
                            </div>
                            <div style={{ background: "#f1f5f9", height: 8, borderRadius: 4, marginTop: 6 }}>
                              <div style={{ width: `${Math.round(pct)}%`, height: 8, background: "#60a5fa", borderRadius: 4 }} />
                            </div>
                          </div>
                        );
                      })
                    ) : (
                      <div style={{ color: "#777", fontSize: 13, marginTop: 8 }}>No hay ventas para esta región en los filtros seleccionados.</div>
                    )}
                  </div>
                </div>
              ) : (
                <div style={{ marginTop: 12 }}>
                  <div style={{ fontSize: 13, color: "#666" }}>Top regiones</div>
                  <ol style={{ paddingLeft: 18, marginTop: 8 }}>
                    {totalsByRegion.slice(0, 5).map(([r, t]) => (
                      <li key={r} style={{ marginBottom: 6 }}>
                        <div style={{ display: "flex", justifyContent: "space-between" }}>
                          <span>{r}</span>
                          <strong>€{t.toFixed(2)}</strong>
                        </div>
                      </li>
                    ))}
                  </ol>
                </div>
              )}

              <div style={{ marginTop: 12 }}>
                <button
                  onClick={() => {
                    setStartDate(null);
                    setEndDate(null);
                    setQuery("");
                    setSelectedRegion(null);
                  }}
                  style={{
                    background: "#111827",
                    color: "#fff",
                    border: "none",
                    padding: "8px 12px",
                    borderRadius: 6,
                    cursor: "pointer",
                  }}
                >
                  Reset filtros
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
