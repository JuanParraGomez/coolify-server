"use client";
import React, { useMemo, useState } from "react";

type Sale = {
  id?: string;
  region: string;
  sales: number;
  date: string; // ISO date
  category?: string;
};

type Props = {
  data: Sale[];
  width?: number;
  height?: number;
  initialCategory?: string | "all";
};

const formatCurrency = (n: number) =>
  n.toLocaleString(undefined, { style: "currency", currency: "USD", maximumFractionDigits: 0 });

export default function RegionChart({ data, width = 800, height = 360, initialCategory = "all" }: Props) {
  const [category, setCategory] = useState<string | "all">(initialCategory || "all");
  const [startDate, setStartDate] = useState<string | null>(null);
  const [endDate, setEndDate] = useState<string | null>(null);
  const [selectedRegion, setSelectedRegion] = useState<string | null>(null);

  // derive categories and date extents
  const categories = useMemo(() => {
    const s = new Set<string>();
    data.forEach((d) => d.category && s.add(d.category));
    return Array.from(s).sort();
  }, [data]);

  const filtered = useMemo(() => {
    return data.filter((d) => {
      if (category !== "all" && d.category !== category) return false;
      if (startDate && new Date(d.date) < new Date(startDate)) return false;
      if (endDate && new Date(d.date) > new Date(endDate)) return false;
      return true;
    });
  }, [data, category, startDate, endDate]);

  const totalSales = useMemo(() => filtered.reduce((s, r) => s + r.sales, 0), [filtered]);

  const byRegion = useMemo(() => {
    const map = new Map<string, number>();
    filtered.forEach((d) => {
      map.set(d.region, (map.get(d.region) || 0) + d.sales);
    });
    return Array.from(map.entries()).sort((a, b) => b[1] - a[1]);
  }, [filtered]);

  const topRegion = byRegion[0]?.[0] ?? "—";

  // monthly series for selected region
  const monthlyForSelected = useMemo(() => {
    if (!selectedRegion) return [] as [string, number][];
    const map = new Map<string, number>();
    filtered
      .filter((d) => d.region === selectedRegion)
      .forEach((d) => {
        const key = new Date(d.date).toISOString().slice(0, 7); // YYYY-MM
        map.set(key, (map.get(key) || 0) + d.sales);
      });
    const arr = Array.from(map.entries()).sort((a, b) => a[0].localeCompare(b[0]));
    return arr;
  }, [filtered, selectedRegion]);

  // simple layout math for bar chart
  const margin = { top: 20, right: 20, bottom: 60, left: 80 };
  const chartW = width - margin.left - margin.right;
  const chartH = height - margin.top - margin.bottom;

  const maxRegionValue = byRegion.length ? Math.max(...byRegion.map(([, v]) => v)) : 0;

  return (
    <div style={{ fontFamily: "Inter, Roboto, system-ui, -apple-system, 'Segoe UI', sans-serif" }}>
      {/* Controls and summaries */}
      <div style={{ display: "flex", justifyContent: "space-between", gap: 16, marginBottom: 12, alignItems: "center" }}>
        <div style={{ display: "flex", gap: 8, alignItems: "center" }}>
          <label>
            Category:
            <select value={category} onChange={(e) => setCategory(e.target.value)} style={{ marginLeft: 8 }}>
              <option value="all">All</option>
              {categories.map((c) => (
                <option key={c} value={c}>{c}</option>
              ))}
            </select>
          </label>
          <label>
            From:
            <input type="date" onChange={(e) => setStartDate(e.target.value || null)} style={{ marginLeft: 8 }} />
          </label>
          <label>
            To:
            <input type="date" onChange={(e) => setEndDate(e.target.value || null)} style={{ marginLeft: 8 }} />
          </label>
          <button onClick={() => { setCategory("all"); setStartDate(null); setEndDate(null); setSelectedRegion(null); }} style={{ marginLeft: 8 }}>
            Reset
          </button>
        </div>
        <div style={{ display: "flex", gap: 12 }}>
          <div style={{ textAlign: "right" }}>
            <div style={{ fontSize: 12, color: "#666" }}>Total Sales</div>
            <div style={{ fontWeight: 700 }}>{formatCurrency(totalSales)}</div>
          </div>
          <div style={{ textAlign: "right" }}>
            <div style={{ fontSize: 12, color: "#666" }}>Regions</div>
            <div style={{ fontWeight: 700 }}>{byRegion.length}</div>
          </div>
          <div style={{ textAlign: "right" }}>
            <div style={{ fontSize: 12, color: "#666" }}>Top Region</div>
            <div style={{ fontWeight: 700 }}>{topRegion}</div>
          </div>
        </div>
      </div>

      {/* Chart area */}
      <div style={{ border: "1px solid #eee", padding: 12, borderRadius: 8 }}>
        {!selectedRegion ? (
          <svg width={width} height={height}>
            <g transform={`translate(${margin.left},${margin.top})`}>
              {/* y axis labels */}
              <g>
                {[0, 0.25, 0.5, 0.75, 1].map((t) => {
                  const y = chartH - t * chartH;
                  const val = Math.round(maxRegionValue * t);
                  return (
                    <g key={t}>
                      <line x1={-6} x2={chartW} y1={y} y2={y} stroke="#eee" />
                      <text x={-10} y={y + 4} fontSize={11} textAnchor="end" fill="#666">
                        {formatCurrency(val)}
                      </text>
                    </g>
                  );
                })}
              </g>

              {/* bars */}
              <g transform="translate(0,0)">
                {byRegion.map(([r, v], i) => {
                  const barHeight = chartH / byRegion.length * 0.6;
                  const gap = chartH / byRegion.length * 0.4;
                  const y = i * (barHeight + gap) + gap / 2;
                  const w = maxRegionValue ? (v / maxRegionValue) * chartW : 0;
                  return (
                    <g key={r} onClick={() => setSelectedRegion(r)} style={{ cursor: "pointer" }}>
                      <rect x={0} y={y} width={w} height={barHeight} fill="#4f46e5" rx={4} />
                      <text x={Math.min(w + 8, chartW)} y={y + barHeight / 2 + 4} fontSize={12} fill="#111">
                        {r}
                      </text>
                      <text x={Math.max(w - 8, 4)} y={y + barHeight / 2 + 4} fontSize={12} fill="#fff" textAnchor={w > 40 ? "end" : "start"}>
                        {formatCurrency(v)}
                      </text>
                    </g>
                  );
                })}
              </g>

              {/* x-axis labels */}
              <g transform={`translate(0,${chartH + 18})`}>
                <text x={0} y={0} fontSize={11} fill="#666">Click a bar to drill into region</text>
              </g>
            </g>
          </svg>
        ) : (
          <div>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 8 }}>
              <div style={{ fontWeight: 700 }}>{selectedRegion} — Monthly Sales</div>
              <div>
                <button onClick={() => setSelectedRegion(null)} style={{ marginRight: 8 }}>← Back</button>
              </div>
            </div>
            <svg width={width} height={height}>
              <g transform={`translate(${margin.left},${margin.top})`}>
                {/* x ticks are months */}
                {monthlyForSelected.length === 0 ? (
                  <text x={20} y={20} fill="#666">No data for this region with current filters.</text>
                ) : (
                  (() => {
                    const xs = monthlyForSelected.map((m) => m[0]);
                    const ys = monthlyForSelected.map((m) => m[1]);
                    const maxY = Math.max(...ys);
                    const pointX = (i: number) => (i / (xs.length - 1 || 1)) * chartW;
                    const pointY = (v: number) => chartH - (v / maxY) * chartH;
                    const path = ys.map((v, i) => `${i === 0 ? "M" : "L"} ${pointX(i)} ${pointY(v)}`).join(" ");
                    return (
                      <g>
                        {/* grid + y labels */}
                        {[0, 0.25, 0.5, 0.75, 1].map((t) => {
                          const y = chartH - t * chartH;
                          const val = Math.round(maxY * t);
                          return (
                            <g key={t}>
                              <line x1={0} x2={chartW} y1={y} y2={y} stroke="#eee" />
                              <text x={-10} y={y + 4} fontSize={11} textAnchor="end" fill="#666">{formatCurrency(val)}</text>
                            </g>
                          );
                        })}

                        {/* line area */}
                        <path d={path} stroke="#10b981" strokeWidth={2.5} fill="none" />
                        {/* points */}
                        {ys.map((v, i) => (
                          <g key={i}>
                            <circle cx={pointX(i)} cy={pointY(v)} r={4} fill="#fff" stroke="#10b981" strokeWidth={2} />
                            <text x={pointX(i)} y={pointY(v) - 8} fontSize={11} fill="#111" textAnchor="middle">{formatCurrency(v)}</text>
                          </g>
                        ))}

                        {/* x labels */}
                        {xs.map((label, i) => (
                          <text key={label} x={pointX(i)} y={chartH + 18} fontSize={11} textAnchor="middle" fill="#444">
                            {label}
                          </text>
                        ))}
                      </g>
                    );
                  })()
                )}
              </g>
            </svg>
          </div>
        )}
      </div>
    </div>
  );
}
