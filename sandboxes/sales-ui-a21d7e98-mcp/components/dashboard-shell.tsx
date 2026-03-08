"use client";
import React from "react";
import RegionTable from "./region-table";

export default function DashboardShell(): JSX.Element {
  return (
    <div style={{ display: "flex", height: "100vh", fontFamily: "Inter, Arial, sans-serif" }}>
      <aside style={{ width: 260, padding: 20, background: "#f8fafc", borderRight: "1px solid #e6e9ef" }}>
        <h2 style={{ margin: 0, marginBottom: 12 }}>Sales Dashboard</h2>
        <nav>
          <ul style={{ listStyle: "none", padding: 0, margin: 0 }}>
            <li style={{ padding: "8px 0", color: "#1f2937" }}>Overview</li>
            <li style={{ padding: "8px 0", color: "#1f2937" }}>By Region</li>
            <li style={{ padding: "8px 0", color: "#1f2937" }}>Reports</li>
          </ul>
        </nav>

        <div style={{ marginTop: 20 }}>
          <h3 style={{ margin: "0 0 8px 0" }}>Filters</h3>
          <p style={{ margin: 0, color: "#6b7280", fontSize: 13 }}>Use the filters panel in the main view to adjust the displayed data.</p>
        </div>
      </aside>

      <main style={{ flex: 1, padding: 24, overflowY: "auto", background: "#f3f4f6" }}>
        <header style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 20 }}>
          <div>
            <h1 style={{ margin: 0 }}>Ventas por región</h1>
            <p style={{ margin: 0, color: "#6b7280" }}>Panel interactivo con filtros y gráficos</p>
          </div>
        </header>

        <section style={{ paddingTop: 12 }}>
          {/* RegionTable contains its own FiltersPanel and chart/table */}
          <RegionTable />
        </section>
      </main>
    </div>
  );
}
