"use client";

import React, { useMemo, useState } from "react";
import {
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  Tooltip,
  Legend,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
} from "recharts";

// Types
export type Sale = {
  id: string;
  date: string; // ISO
  region: string;
  city: string;
  product: string;
  amount: number;
};

const COLORS = ["#8884d8", "#82ca9d", "#ffc658", "#ff8042", "#8dd1e1", "#a4de6c"];

// Small sample data if none provided (medium complexity dataset)
const sampleData: Sale[] = [
  { id: "1", date: "2026-03-01", region: "North", city: "Bogota", product: "Widgets", amount: 1200 },
  { id: "2", date: "2026-03-02", region: "South", city: "Medellin", product: "Gadgets", amount: 800 },
  { id: "3", date: "2026-03-02", region: "East", city: "Cali", product: "Widgets", amount: 450 },
  { id: "4", date: "2026-03-03", region: "West", city: "Barranquilla", product: "Gizmos", amount: 1500 },
  { id: "5", date: "2026-03-04", region: "North", city: "Bogota", product: "Gizmos", amount: 700 },
  { id: "6", date: "2026-03-05", region: "South", city: "Pereira", product: "Widgets", amount: 300 },
  { id: "7", date: "2026-03-06", region: "East", city: "Cali", product: "Gadgets", amount: 950 },
  { id: "8", date: "2026-03-07", region: "North", city: "Tunja", product: "Widgets", amount: 200 },
  { id: "9", date: "2026-03-07", region: "West", city: "Cartagena", product: "Gadgets", amount: 650 },
  { id: "10", date: "2026-03-08", region: "South", city: "Medellin", product: "Gizmos", amount: 1100 },
  // add a few more for a richer sample
  { id: "11", date: "2026-03-09", region: "North", city: "Bogota", product: "Widgets", amount: 980 },
  { id: "12", date: "2026-03-10", region: "East", city: "Bucaramanga", product: "Gizmos", amount: 420 },
  { id: "13", date: "2026-03-11", region: "West", city: "Cali", product: "Widgets", amount: 760 },
  { id: "14", date: "2026-03-12", region: "South", city: "Pasto", product: "Gizmos", amount: 230 },
];

// Helpers
function formatCurrency(n: number) {
  return n.toLocaleString(undefined, { style: "currency", currency: "USD", maximumFractionDigits: 0 });
}

function withinRange(dateStr: string, from?: string, to?: string) {
  if (!from && !to) return true;
  const d = new Date(dateStr).setHours(0, 0, 0, 0);
  if (from) {
    const f = new Date(from).setHours(0, 0, 0, 0);
    if (d < f) return false;
  }
  if (to) {
    const t = new Date(to).setHours(0, 0, 0, 0);
    if (d > t) return false;
  }
  return true;
}

// Component
export default function RegionChart({ data }: { data?: Sale[] }) {
  const [from, setFrom] = useState<string | undefined>(undefined);
  const [to, setTo] = useState<string | undefined>(undefined);
  const [productFilter, setProductFilter] = useState<string>("All");
  const [regionFilter, setRegionFilter] = useState<string>("All");
  const [drillRegion, setDrillRegion] = useState<string | null>(null);

  const source = data && data.length ? data : sampleData;

  // Derived lists
  const regions = useMemo(() => {
    const s = new Set<string>();
    source.forEach((r) => s.add(r.region));
    return ["All", ...Array.from(s).sort()];
  }, [source]);

  const products = useMemo(() => {
    const s = new Set<string>();
    source.forEach((r) => s.add(r.product));
    return ["All", ...Array.from(s).sort()];
  }, [source]);

  // Filtered data
  const filtered = useMemo(() => {
    return source.filter((row) => {
      if (!withinRange(row.date, from, to)) return false;
      if (productFilter !== "All" && row.product !== productFilter) return false;
      if (regionFilter !== "All" && row.region !== regionFilter) return false;
      return true;
    });
  }, [source, from, to, productFilter, regionFilter]);

  // Aggregations
  const summary = useMemo(() => {
    const total = filtered.reduce((s, r) => s + r.amount, 0);
    const orders = filtered.length;
    const avg = orders ? Math.round(total / orders) : 0;
    return { total, orders, avg };
  }, [filtered]);

  const salesByRegion = useMemo(() => {
    const map = new Map<string, number>();
    filtered.forEach((r) => map.set(r.region, (map.get(r.region) || 0) + r.amount));
    return Array.from(map.entries()).map(([region, value]) => ({ region, value }));
  }, [filtered]);

  const topCitiesInDrill = useMemo(() => {
    if (!drillRegion) return [];
    const map = new Map<string, number>();
    filtered
      .filter((r) => r.region === drillRegion)
      .forEach((r) => map.set(r.city, (map.get(r.city) || 0) + r.amount));
    const arr = Array.from(map.entries()).map(([city, value]) => ({ city, value }));
    arr.sort((a, b) => b.value - a.value);
    return arr.slice(0, 10);
  }, [drillRegion, filtered]);

  const topProducts = useMemo(() => {
    const map = new Map<string, number>();
    filtered.forEach((r) => map.set(r.product, (map.get(r.product) || 0) + r.amount));
    const arr = Array.from(map.entries()).map(([product, value]) => ({ product, value }));
    arr.sort((a, b) => b.value - a.value);
    return arr.slice(0, 6);
  }, [filtered]);

  // Handlers
  function onPieClick(data: any, index: number) {
    if (!data) return;
    setDrillRegion(data.region || data.name);
  }

  function resetDrill() {
    setDrillRegion(null);
  }

  return (
    <div style={{ padding: 12, fontFamily: "Inter, ui-sans-serif, system-ui, -apple-system" }}>
      <h3 style={{ margin: "6px 0" }}>Ventas por región</h3>

      {/* Filters */}
      <div style={{ display: "flex", gap: 12, flexWrap: "wrap", marginBottom: 12 }}>
        <label>
          Desde: <input type="date" value={from ?? ""} onChange={(e) => setFrom(e.target.value || undefined)} />
        </label>
        <label>
          Hasta: <input type="date" value={to ?? ""} onChange={(e) => setTo(e.target.value || undefined)} />
        </label>
        <label>
          Región:
          <select value={regionFilter} onChange={(e) => setRegionFilter(e.target.value)} style={{ marginLeft: 6 }}>
            {regions.map((r) => (
              <option key={r} value={r}>
                {r}
              </option>
            ))}
          </select>
        </label>
        <label>
          Producto:
          <select value={productFilter} onChange={(e) => setProductFilter(e.target.value)} style={{ marginLeft: 6 }}>
            {products.map((p) => (
              <option key={p} value={p}>
                {p}
              </option>
            ))}
          </select>
        </label>
        <button onClick={() => { setFrom(undefined); setTo(undefined); setProductFilter("All"); setRegionFilter("All"); resetDrill(); }} style={{ marginLeft: 6 }}>
          Limpiar filtros
        </button>
      </div>

      {/* Summary cards */}
      <div style={{ display: "flex", gap: 12, marginBottom: 12, flexWrap: "wrap" }}>
        <div style={{ padding: 12, borderRadius: 8, background: "#f5f7fb", minWidth: 160 }}>
          <div style={{ fontSize: 12, color: "#666" }}>Total ventas</div>
          <div style={{ fontSize: 20, fontWeight: 600 }}>{formatCurrency(summary.total)}</div>
        </div>
        <div style={{ padding: 12, borderRadius: 8, background: "#f5f7fb", minWidth: 160 }}>
          <div style={{ fontSize: 12, color: "#666" }}>Ordenes</div>
          <div style={{ fontSize: 20, fontWeight: 600 }}>{summary.orders}</div>
        </div>
        <div style={{ padding: 12, borderRadius: 8, background: "#f5f7fb", minWidth: 160 }}>
          <div style={{ fontSize: 12, color: "#666" }}>Promedio</div>
          <div style={{ fontSize: 20, fontWeight: 600 }}>{formatCurrency(summary.avg)}</div>
        </div>
      </div>

      <div style={{ display: "flex", gap: 16, alignItems: "stretch", flexWrap: "wrap" }}>
        <div style={{ flex: 1, minWidth: 320, height: 320, background: "white", padding: 12, borderRadius: 8, boxShadow: "0 1px 2px rgba(0,0,0,0.04)" }}>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
            <strong>{drillRegion ? `Detalle: ${drillRegion}` : "Ventas por región"}</strong>
            {drillRegion ? <button onClick={resetDrill}>Volver</button> : null}
          </div>

          <ResponsiveContainer width="100%" height={260}>
            {drillRegion ? (
              <BarChart data={topCitiesInDrill} margin={{ top: 12, right: 12, left: 0, bottom: 6 }}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="city" />
                <YAxis />
                <Tooltip formatter={(value: number) => formatCurrency(value)} />
                <Bar dataKey="value" fill="#82ca9d" />
              </BarChart>
            ) : (
              <PieChart>
                <Pie
                  dataKey="value"
                  isAnimationActive={false}
                  data={salesByRegion}
                  cx="50%"
                  cy="50%"
                  outerRadius={90}
                  label={(entry: any) => `${entry.region}: ${Math.round((entry.value || 0) / 1000)}k`}
                  onClick={onPieClick}
                >
                  {salesByRegion.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip formatter={(value: number) => formatCurrency(value)} />
                <Legend />
              </PieChart>
            )}
          </ResponsiveContainer>
        </div>

        <div style={{ width: 360, minWidth: 320, height: 320, background: "white", padding: 12, borderRadius: 8, boxShadow: "0 1px 2px rgba(0,0,0,0.04)" }}>
          <strong>Top productos</strong>
          <div style={{ marginTop: 8 }}>
            <ResponsiveContainer width="100%" height={260}>
              <BarChart data={topProducts} layout="vertical" margin={{ left: 20 }}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis type="number" />
                <YAxis dataKey="product" type="category" />
                <Tooltip formatter={(value: number) => formatCurrency(value)} />
                <Bar dataKey="value" fill="#8884d8" />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>

      {/* Small table-like list for quick drill */}
      <div style={{ marginTop: 12 }}>
        <strong>Detalle de ordenes (muestra)</strong>
        <div style={{ marginTop: 8, maxHeight: 220, overflow: "auto", background: "white", borderRadius: 8, padding: 8 }}>
          <table style={{ width: "100%", borderCollapse: "collapse", fontSize: 13 }}>
            <thead>
              <tr style={{ textAlign: "left", color: "#666", borderBottom: "1px solid #eee" }}>
                <th style={{ padding: 6 }}>Fecha</th>
                <th style={{ padding: 6 }}>Region</th>
                <th style={{ padding: 6 }}>Ciudad</th>
                <th style={{ padding: 6 }}>Producto</th>
                <th style={{ padding: 6 }}>Monto</th>
              </tr>
            </thead>
            <tbody>
              {filtered.slice(0, 40).map((r) => (
                <tr key={r.id} style={{ borderBottom: "1px solid #fafafa" }}>
                  <td style={{ padding: 6 }}>{r.date}</td>
                  <td style={{ padding: 6 }}>{r.region}</td>
                  <td style={{ padding: 6 }}>{r.city}</td>
                  <td style={{ padding: 6 }}>{r.product}</td>
                  <td style={{ padding: 6 }}>{formatCurrency(r.amount)}</td>
                </tr>
              ))}
              {filtered.length === 0 ? (
                <tr>
                  <td colSpan={5} style={{ padding: 12, textAlign: "center", color: "#999" }}>
                    Sin datos para los filtros seleccionados
                  </td>
                </tr>
              ) : null}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
