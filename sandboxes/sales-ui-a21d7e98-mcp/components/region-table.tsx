"use client";
import React, { useMemo, useState } from "react";
import FiltersPanel from "./filters-panel";
import { generateMockSales, AVAILABLE_REGIONS, filterSales, aggregateByRegion, type Sale, type Filters } from "../lib/mock-data";

export default function RegionTable() {
  // generate mock sales once
  const sales = useMemo<Sale[]>(() => generateMockSales(300), []);
  const [filters, setFilters] = useState<Filters>({});

  const filtered = useMemo(() => filterSales(sales, filters), [sales, filters]);
  const agg = useMemo(() => aggregateByRegion(filtered), [filtered]);
  const max = agg.reduce((m, a) => Math.max(m, a.total), 0) || 1;

  return (
    <div style={{ display: "grid", gridTemplateColumns: "320px 1fr", gap: 16 }}>
      <div>
        <FiltersPanel availableRegions={AVAILABLE_REGIONS} initial={filters} onChange={(f) => setFilters(f)} />
      </div>

      <div>
        <h2>Ventas por región</h2>
        <div style={{ display: "flex", gap: 24 }}>
          <div style={{ flex: 1 }}>
            <table style={{ width: "100%", borderCollapse: "collapse" }}>
              <thead>
                <tr>
                  <th style={{ textAlign: "left", borderBottom: "1px solid #ddd", padding: 8 }}>Región</th>
                  <th style={{ textAlign: "right", borderBottom: "1px solid #ddd", padding: 8 }}>Total</th>
                  <th style={{ textAlign: "right", borderBottom: "1px solid #ddd", padding: 8 }}>Ventas</th>
                </tr>
              </thead>
              <tbody>
                {agg.map((r) => (
                  <tr key={r.region}>
                    <td style={{ padding: 8, borderBottom: "1px solid #f3f3f3" }}>{r.region}</td>
                    <td style={{ padding: 8, textAlign: "right", borderBottom: "1px solid #f3f3f3" }}>${r.total.toFixed(2)}</td>
                    <td style={{ padding: 8, textAlign: "right", borderBottom: "1px solid #f3f3f3" }}>{r.count}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          <div style={{ width: 300 }}>
            <svg width={300} height={200} viewBox={`0 0 300 200`} style={{ border: "1px solid #eee", background: "#fff" }}>
              {agg.map((a, i) => {
                const barMaxWidth = 250;
                const barHeight = 28;
                const x = 40;
                const y = 10 + i * (barHeight + 6);
                const w = Math.max(2, Math.round((a.total / max) * barMaxWidth));
                return (
                  <g key={a.region}>
                    <text x={0} y={y + barHeight / 2 + 5} fontSize={11} fill="#333">
                      {a.region}
                    </text>
                    <rect x={x} y={y} width={w} height={barHeight} fill="#4f46e5" rx={4} />
                    <text x={x + w + 6} y={y + barHeight / 2 + 5} fontSize={11} fill="#111">
                      ${a.total.toFixed(0)}
                    </text>
                  </g>
                );
              })}
            </svg>
          </div>
        </div>

        <div style={{ marginTop: 12 }}>
          <strong>Ventas filtradas:</strong> {filtered.length}
        </div>
      </div>
    </div>
  );
}
