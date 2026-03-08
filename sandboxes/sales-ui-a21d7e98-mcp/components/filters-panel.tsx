"use client";
import React, { useState } from "react";
import type { Filters } from "../lib/mock-data";

type Props = {
  availableRegions: string[];
  initial?: Filters;
  onChange?: (filters: Filters) => void;
};

export default function FiltersPanel({ availableRegions, initial, onChange }: Props) {
  const [regions, setRegions] = useState<string[]>(initial?.regions ?? []);
  const [dateFrom, setDateFrom] = useState<string | null>(initial?.dateFrom ?? null);
  const [dateTo, setDateTo] = useState<string | null>(initial?.dateTo ?? null);
  const [minAmount, setMinAmount] = useState<number | null>(initial?.minAmount ?? null);

  function toggleRegion(r: string) {
    setRegions((prev) => (prev.includes(r) ? prev.filter((x) => x !== r) : [...prev, r]));
  }

  function apply() {
    const f: Filters = { regions, dateFrom, dateTo, minAmount };
    onChange?.(f);
  }

  function clearAll() {
    setRegions([]);
    setDateFrom(null);
    setDateTo(null);
    setMinAmount(null);
    onChange?.({});
  }

  return (
    <div style={{ border: "1px solid #ddd", padding: 12, borderRadius: 6 }}>
      <div style={{ marginBottom: 8 }}>
        <strong>Regiones</strong>
        <div style={{ display: "flex", gap: 8, flexWrap: "wrap", marginTop: 6 }}>
          {availableRegions.map((r) => (
            <label key={r} style={{ display: "flex", alignItems: "center", gap: 6 }}>
              <input type="checkbox" checked={regions.includes(r)} onChange={() => toggleRegion(r)} />
              <span>{r}</span>
            </label>
          ))}
        </div>
      </div>

      <div style={{ marginBottom: 8 }}>
        <strong>Rango de fechas</strong>
        <div style={{ display: "flex", gap: 8, marginTop: 6 }}>
          <input type="date" value={dateFrom ?? ""} onChange={(e) => setDateFrom(e.target.value || null)} />
          <input type="date" value={dateTo ?? ""} onChange={(e) => setDateTo(e.target.value || null)} />
        </div>
      </div>

      <div style={{ marginBottom: 8 }}>
        <strong>Mínimo monto</strong>
        <div style={{ marginTop: 6 }}>
          <input
            type="number"
            min={0}
            placeholder="0"
            value={minAmount ?? ""}
            onChange={(e) => setMinAmount(e.target.value ? Number(e.target.value) : null)}
          />
        </div>
      </div>

      <div style={{ display: "flex", gap: 8, marginTop: 10 }}>
        <button onClick={apply} style={{ padding: "6px 10px" }}>
          Aplicar
        </button>
        <button onClick={clearAll} style={{ padding: "6px 10px" }}>
          Limpiar
        </button>
      </div>
    </div>
  );
}
