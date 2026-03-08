"use client";

import React, { useMemo } from "react";
import { REGIONS, CATEGORIES, SaleRecord } from "../lib/mock-data";

type Filters = {
  region: string | null;
  category: string | null;
  startDate: string | null;
  endDate: string | null;
  minAmount: number | null;
  q: string;
};

type Props = {
  data: SaleRecord[];
  filters: Filters;
  setFilters: (f: Partial<Filters>) => void;
};

export default function FiltersPanel({ data, filters, setFilters }: Props) {
  const minMax = useMemo(() => {
    const amounts = data.map(d => d.amount);
    return { min: Math.min(...amounts), max: Math.max(...amounts) };
  }, [data]);

  return (
    <aside style={{ padding: 12, border: "1px solid #eee", borderRadius: 8, width: 320 }}>
      <h3 style={{ marginTop: 0 }}>Filtros</h3>

      <label style={{ display: "block", marginBottom: 8 }}>
        Región
        <select
          value={filters.region ?? ""}
          onChange={e => setFilters({ region: e.target.value || null })}
          style={{ width: "100%", padding: 6, marginTop: 6 }}
        >
          <option value="">Todas</option>
          {REGIONS.map(r => (
            <option key={r} value={r}>
              {r}
            </option>
          ))}
        </select>
      </label>

      <label style={{ display: "block", marginBottom: 8 }}>
        Categoría
        <select
          value={filters.category ?? ""}
          onChange={e => setFilters({ category: e.target.value || null })}
          style={{ width: "100%", padding: 6, marginTop: 6 }}
        >
          <option value="">Todas</option>
          {CATEGORIES.map(c => (
            <option key={c} value={c}>
              {c}
            </option>
          ))}
        </select>
      </label>

      <div style={{ display: "flex", gap: 8, marginBottom: 8 }}>
        <label style={{ flex: 1 }}>
          Desde
          <input
            type="date"
            value={filters.startDate ?? ""}
            onChange={e => setFilters({ startDate: e.target.value || null })}
            style={{ width: "100%", padding: 6, marginTop: 6 }}
          />
        </label>
        <label style={{ flex: 1 }}>
          Hasta
          <input
            type="date"
            value={filters.endDate ?? ""}
            onChange={e => setFilters({ endDate: e.target.value || null })}
            style={{ width: "100%", padding: 6, marginTop: 6 }}
          />
        </label>
      </div>

      <label style={{ display: "block", marginBottom: 8 }}>
        Mínimo venta (${minMax.min?.toFixed?.(2) ?? 0})
        <input
          type="range"
          min={Math.floor(minMax.min || 0)}
          max={Math.ceil(minMax.max || 1000)}
          value={filters.minAmount ?? Math.floor(minMax.min || 0)}
          onChange={e => setFilters({ minAmount: Number(e.target.value) })}
          style={{ width: "100%", marginTop: 6 }}
        />
      </label>

      <label style={{ display: "block", marginBottom: 8 }}>
        Buscar (vendedor)
        <input
          type="search"
          placeholder="Nombre de vendedor"
          value={filters.q}
          onChange={e => setFilters({ q: e.target.value })}
          style={{ width: "100%", padding: 6, marginTop: 6 }}
        />
      </label>

      <div style={{ display: "flex", gap: 8, marginTop: 12 }}>
        <button
          onClick={() =>
            setFilters({ region: null, category: null, startDate: null, endDate: null, minAmount: null, q: "" })
          }
          style={{ flex: 1, padding: 8 }}
        >
          Reset
        </button>
      </div>
    </aside>
  );
}
