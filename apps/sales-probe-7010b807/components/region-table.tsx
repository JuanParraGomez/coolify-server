"use client";

import React, { useMemo, useState } from "react";
import { SaleRecord, aggregateByRegion } from "../lib/mock-data";

type Props = {
  data: SaleRecord[];
};

export default function RegionTable({ data }: Props) {
  const [sortBy, setSortBy] = useState<"region" | "totalSales" | "units">("totalSales");
  const [desc, setDesc] = useState(true);
  const [page, setPage] = useState(0);
  const pageSize = 10;

  const rows = useMemo(() => {
    const agg = aggregateByRegion(data);
    const sorted = agg.sort((a, b) => {
      const v1 = sortBy === "region" ? a.region : sortBy === "totalSales" ? a.totalSales : a.units;
      const v2 = sortBy === "region" ? b.region : sortBy === "totalSales" ? b.totalSales : b.units;
      if (typeof v1 === "string") return desc ? v2.localeCompare(v1) : v1.localeCompare(v2);
      return desc ? (v2 as number) - (v1 as number) : (v1 as number) - (v2 as number);
    });
    return sorted;
  }, [data, sortBy, desc]);

  const totalPages = Math.max(1, Math.ceil(rows.length / pageSize));
  const pageRows = rows.slice(page * pageSize, (page + 1) * pageSize);

  return (
    <div style={{ border: "1px solid #eee", borderRadius: 8, padding: 12, flex: 1 }}>
      <h3 style={{ marginTop: 0 }}>Ventas por Región</h3>
      <div style={{ display: "flex", gap: 8, marginBottom: 8 }}>
        <label>
          Ordenar por:
          <select value={sortBy} onChange={e => setSortBy(e.target.value as any)} style={{ marginLeft: 8 }}>
            <option value="totalSales">Total ventas</option>
            <option value="units">Unidades</option>
            <option value="region">Región</option>
          </select>
        </label>
        <label style={{ marginLeft: "auto" }}>
          Dirección:
          <button onClick={() => setDesc(s => !s)} style={{ marginLeft: 8 }}>
            {desc ? "Desc" : "Asc"}
          </button>
        </label>
      </div>

      <table style={{ width: "100%", borderCollapse: "collapse" }}>
        <thead>
          <tr>
            <th style={{ textAlign: "left", padding: 8 }}>Región</th>
            <th style={{ textAlign: "right", padding: 8 }}>Total ventas</th>
            <th style={{ textAlign: "right", padding: 8 }}>Unidades</th>
            <th style={{ textAlign: "right", padding: 8 }}>Promedio</th>
          </tr>
        </thead>
        <tbody>
          {pageRows.map(r => (
            <tr key={r.region} style={{ borderTop: "1px solid #f0f0f0" }}>
              <td style={{ padding: 8 }}>{r.region}</td>
              <td style={{ padding: 8, textAlign: "right" }}>${r.totalSales.toFixed(2)}</td>
              <td style={{ padding: 8, textAlign: "right" }}>{r.units}</td>
              <td style={{ padding: 8, textAlign: "right" }}>${(r.avgSale ?? 0).toFixed(2)}</td>
            </tr>
          ))}
        </tbody>
      </table>

      <div style={{ display: "flex", justifyContent: "space-between", marginTop: 12, alignItems: "center" }}>
        <div>
          Página {page + 1} de {totalPages}
        </div>
        <div style={{ display: "flex", gap: 8 }}>
          <button onClick={() => setPage(0)} disabled={page === 0}>
            « Primero
          </button>
          <button onClick={() => setPage(p => Math.max(0, p - 1))} disabled={page === 0}>
            ‹ Anterior
          </button>
          <button onClick={() => setPage(p => Math.min(totalPages - 1, p + 1))} disabled={page >= totalPages - 1}>
            Siguiente ›
          </button>
          <button onClick={() => setPage(totalPages - 1)} disabled={page >= totalPages - 1}>
            Último »
          </button>
        </div>
      </div>
    </div>
  );
}
