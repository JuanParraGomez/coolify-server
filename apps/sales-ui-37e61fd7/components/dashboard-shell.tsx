"use client";

import React, { useMemo, useState } from "react";
import FiltersPanel from "./filters-panel";
import RegionTable from "./region-table";
import { generateMockData, filterRegions, Filters, RegionData } from "../lib/mock-data";

export default function DashboardShell({
  children,
  title = "Ventas por región",
}: {
  children?: React.ReactNode;
  title?: string;
}) {
  const [filters, setFilters] = useState<Filters>({ region: "All", minSales: undefined, maxSales: undefined, lastNMonths: 12 });

  // Generate mock data once on client
  const data = useMemo<RegionData[]>(() => generateMockData(1), []);

  const filtered = useMemo(() => filterRegions(data, filters), [data, filters]);

  const totalSales = useMemo(() => filtered.reduce((s, r) => s + r.totalSales, 0), [filtered]);

  return (
    <div style={styles.container}>
      <aside style={styles.sidebar}>
        <h2 style={{ marginTop: 0 }}>{title}</h2>
        <section style={styles.filterSection}>
          <h3>Filtros</h3>
          <FiltersPanel filters={filters} onChange={setFilters} />
        </section>

        <nav style={styles.nav}>
          <a style={styles.navLink} href="#">Dashboard</a>
          <a style={styles.navLink} href="#">Reportes</a>
          <a style={styles.navLink} href="#">Ajustes</a>
        </nav>
      </aside>

      <main style={styles.main}>
        <header style={styles.header}>
          <div style={{ fontSize: 18, fontWeight: 600 }}>Panel de ventas</div>
          <div style={{ color: "#666" }}>Selecciona filtros a la izquierda para actualizar</div>
        </header>

        <section style={styles.content}>
          <div style={{ marginBottom: 12, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <div>
              <div style={{ fontSize: 12, color: '#666' }}>Ventas totales (filtradas)</div>
              <div style={{ fontSize: 18, fontWeight: 700 }}>€{totalSales.toLocaleString()}</div>
            </div>
          </div>

          {children ?? (
            <div>
              <RegionTable data={filtered} />
            </div>
          )}
        </section>
      </main>
    </div>
  );
}

const styles: { [k: string]: React.CSSProperties } = {
  container: { display: "flex", minHeight: "100vh", fontFamily: "Inter, system-ui, Arial, sans-serif" },
  sidebar: {
    width: 320,
    padding: 20,
    borderRight: "1px solid #eee",
    background: "#fff",
  },
  main: { flex: 1, padding: 20, background: "#fafafa" },
  header: { display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 12 },
  content: { background: "#fff", padding: 16, borderRadius: 8, boxShadow: "0 1px 2px rgba(0,0,0,0.03)" },
  filterSection: { marginTop: 12 },
  nav: { marginTop: 24, borderTop: "1px solid #f0f0f0", paddingTop: 12, display: "flex", flexDirection: "column" },
  navLink: { color: "#1f2937", textDecoration: "none", padding: "6px 0" },
};
