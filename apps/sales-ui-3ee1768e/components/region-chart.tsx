"use client";

import React, { useMemo, useState } from "react";

type CountryData = {
  name: string;
  sales: number;
  products?: Record<string, number>;
  date?: string; // ISO date
};

export type RegionData = {
  region: string;
  sales: number;
  countries?: CountryData[];
  products?: Record<string, number>;
  date?: string; // ISO date
};

type Props = {
  data?: RegionData[]; // if omitted, sample data is used
  onRegionClick?: (region: RegionData) => void;
};

const sampleData: RegionData[] = [
  {
    region: "North America",
    sales: 120000,
    countries: [
      { name: "USA", sales: 90000 },
      { name: "Canada", sales: 20000 },
      { name: "Mexico", sales: 10000 },
    ],
  },
  {
    region: "Europe",
    sales: 80000,
    countries: [
      { name: "UK", sales: 30000 },
      { name: "Germany", sales: 25000 },
      { name: "France", sales: 25000 },
    ],
  },
  {
    region: "Asia",
    sales: 150000,
    countries: [
      { name: "China", sales: 90000 },
      { name: "Japan", sales: 30000 },
      { name: "India", sales: 30000 },
    ],
  },
  {
    region: "South America",
    sales: 40000,
    countries: [
      { name: "Brazil", sales: 25000 },
      { name: "Argentina", sales: 10000 },
      { name: "Chile", sales: 5000 },
    ],
  },
  {
    region: "Africa",
    sales: 20000,
    countries: [
      { name: "Nigeria", sales: 8000 },
      { name: "South Africa", sales: 7000 },
      { name: "Egypt", sales: 5000 },
    ],
  },
];

export default function RegionChart({ data = sampleData, onRegionClick }: Props) {
  const [selectedRegion, setSelectedRegion] = useState<RegionData | null>(null);
  const [productFilter, setProductFilter] = useState("");
  const [dateFrom, setDateFrom] = useState("");
  const [dateTo, setDateTo] = useState("");

  // Basic filtering hooks - data may or may not include product/date fields
  const filtered = useMemo(() => {
    let items = data.slice();
    if (productFilter.trim()) {
      const pf = productFilter.toLowerCase();
      items = items.filter((r) => {
        // check region-level products
        if (r.products) {
          const keys = Object.keys(r.products).map((k) => k.toLowerCase());
          if (keys.some((k) => k.includes(pf))) return true;
        }
        // check countries' products
        if (r.countries) {
          for (const c of r.countries) {
            if (!c.products) continue;
            const keys = Object.keys(c.products).map((k) => k.toLowerCase());
            if (keys.some((k) => k.includes(pf))) return true;
          }
        }
        return false;
      });
    }

    if (dateFrom || dateTo) {
      const from = dateFrom ? new Date(dateFrom) : null;
      const to = dateTo ? new Date(dateTo) : null;
      items = items.filter((r) => {
        const d = r.date ? new Date(r.date) : null;
        if (!d) return true; // keep if no date on record
        if (from && d < from) return false;
        if (to && d > to) return false;
        return true;
      });
    }

    return items;
  }, [data, productFilter, dateFrom, dateTo]);

  const totalSales = useMemo(() => filtered.reduce((s, r) => s + (r.sales || 0), 0), [filtered]);
  const regionCount = filtered.length;
  const topRegion = useMemo(() => {
    if (!filtered.length) return null;
    return filtered.reduce((best, cur) => (cur.sales > (best?.sales ?? 0) ? cur : best), filtered[0]);
  }, [filtered]);

  // chart dimensions
  const CHART_W = 720;
  const CHART_H = 320;
  const PADDING = 40;

  const maxSales = Math.max(...filtered.map((r) => r.sales || 0), 0);

  function handleBarClick(r: RegionData) {
    setSelectedRegion(r);
    if (onRegionClick) onRegionClick(r);
  }

  function renderBars() {
    if (!filtered.length) return null;
    const barWidth = (CHART_W - PADDING * 2) / filtered.length - 12;
    return filtered.map((r, i) => {
      const x = PADDING + i * (barWidth + 12);
      const height = maxSales > 0 ? ((r.sales || 0) / maxSales) * (CHART_H - PADDING * 2) : 0;
      const y = CHART_H - PADDING - height;
      return (
        <g key={r.region}>
          <rect
            x={x}
            y={y}
            width={barWidth}
            height={height}
            fill={selectedRegion?.region === r.region ? "#2b8aef" : "#6ba4ff"}
            style={{ cursor: "pointer", transition: "fill .15s" }}
            onClick={() => handleBarClick(r)}
          />
          <text x={x + barWidth / 2} y={CHART_H - PADDING + 14} fontSize={11} textAnchor="middle">
            {r.region}
          </text>
          <text x={x + barWidth / 2} y={y - 6} fontSize={12} textAnchor="middle">
            {(r.sales || 0).toLocaleString()}
          </text>
        </g>
      );
    });
  }

  function renderDrillDown(region: RegionData) {
    const countries = region.countries || [];
    const maxC = Math.max(...countries.map((c) => c.sales || 0), 0);
    return (
      <div style={{ marginTop: 12 }}>
        <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
          <button onClick={() => setSelectedRegion(null)}>← Back to regions</button>
          <h3 style={{ margin: 0 }}>{region.region} — details</h3>
        </div>
        <div style={{ display: "flex", gap: 16, marginTop: 8 }}>
          <div style={{ flex: 1 }}>
            <svg viewBox={`0 0 ${CHART_W} ${CHART_H / 1.6}`} width="100%" style={{ maxWidth: CHART_W }}>
              <rect x={0} y={0} width={CHART_W} height={CHART_H / 1.6} fill="transparent" />
              {countries.map((c, i) => {
                const barW = (CHART_W - PADDING * 2) / countries.length - 10;
                const x = PADDING + i * (barW + 10);
                const height = maxC > 0 ? ((c.sales || 0) / maxC) * ((CHART_H / 1.6) - PADDING * 2) : 0;
                const y = (CHART_H / 1.6) - PADDING - height;
                return (
                  <g key={c.name}>
                    <rect x={x} y={y} width={barW} height={height} fill="#ff9f40" />
                    <text x={x + barW / 2} y={(CHART_H / 1.6) - PADDING + 14} fontSize={11} textAnchor="middle">
                      {c.name}
                    </text>
                    <text x={x + barW / 2} y={y - 6} fontSize={11} textAnchor="middle">
                      {(c.sales || 0).toLocaleString()}
                    </text>
                  </g>
                );
              })}
            </svg>
          </div>
          <div style={{ width: 260 }}>
            <h4 style={{ marginTop: 0 }}>Top countries</h4>
            <ol>
              {countries
                .slice()
                .sort((a, b) => (b.sales || 0) - (a.sales || 0))
                .map((c) => (
                  <li key={c.name}>
                    {c.name}: <strong>{(c.sales || 0).toLocaleString()}</strong>
                  </li>
                ))}
            </ol>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div style={{ fontFamily: "Inter, system-ui, Arial, sans-serif", maxWidth: 920 }}>
      <h2 style={{ marginTop: 0 }}>Sales by Region</h2>

      <div style={{ display: "flex", gap: 12, marginBottom: 12, alignItems: "center" }}>
        <label>
          Product filter:
          <input
            placeholder="e.g., Widget A"
            value={productFilter}
            onChange={(e) => setProductFilter(e.target.value)}
            style={{ marginLeft: 8 }}
          />
        </label>
        <label>
          From:
          <input type="date" value={dateFrom} onChange={(e) => setDateFrom(e.target.value)} style={{ marginLeft: 8 }} />
        </label>
        <label>
          To:
          <input type="date" value={dateTo} onChange={(e) => setDateTo(e.target.value)} style={{ marginLeft: 8 }} />
        </label>
        <div style={{ marginLeft: "auto", display: "flex", gap: 8 }}>
          <div style={{ padding: 8, background: "#f6f9ff", borderRadius: 6 }}>
            <div style={{ fontSize: 12, color: "#666" }}>Total Sales</div>
            <div style={{ fontWeight: 700, fontSize: 18 }}>${totalSales.toLocaleString()}</div>
          </div>
          <div style={{ padding: 8, background: "#f6f9ff", borderRadius: 6 }}>
            <div style={{ fontSize: 12, color: "#666" }}>Regions</div>
            <div style={{ fontWeight: 700, fontSize: 18 }}>{regionCount}</div>
          </div>
          <div style={{ padding: 8, background: "#f6f9ff", borderRadius: 6 }}>
            <div style={{ fontSize: 12, color: "#666" }}>Top Region</div>
            <div style={{ fontWeight: 700, fontSize: 14 }}>{topRegion ? topRegion.region : "—"}</div>
          </div>
        </div>
      </div>

      <div style={{ border: "1px solid #eee", padding: 12, borderRadius: 8 }}>
        {!selectedRegion && (
          <svg viewBox={`0 0 ${CHART_W} ${CHART_H}`} width="100%" style={{ maxWidth: CHART_W }}>
            <rect x={0} y={0} width={CHART_W} height={CHART_H} fill="transparent" />
            {/* Y axis labels */}
            <g>
              {[0, 0.25, 0.5, 0.75, 1].map((t) => {
                const y = PADDING + (1 - t) * (CHART_H - PADDING * 2);
                const val = Math.round(maxSales * t);
                return (
                  <g key={t}>
                    <line x1={PADDING} x2={CHART_W - PADDING} y1={y} y2={y} stroke="#eee" />
                    <text x={6} y={y + 4} fontSize={10} fill="#666">
                      {val.toLocaleString()}
                    </text>
                  </g>
                );
              })}
            </g>

            {/* Bars */}
            <g>{renderBars()}</g>
          </svg>
        )}

        {selectedRegion && renderDrillDown(selectedRegion)}
      </div>

      <div style={{ marginTop: 12 }}>
        <h4 style={{ marginBottom: 8 }}>Legend & Tips</h4>
        <ul>
          <li>Click a region bar to drill down into country-level sales.</li>
          <li>Use the product and date filters to narrow the dataset (works when data contains product/date metadata).</li>
        </ul>
      </div>
    </div>
  );
}
