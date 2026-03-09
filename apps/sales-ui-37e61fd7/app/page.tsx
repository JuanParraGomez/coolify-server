import React from "react";
import DashboardShell from "../components/dashboard-shell";

export default function Page() {
  return (
    <DashboardShell>
      <div style={{ display: "grid", gridTemplateColumns: "2fr 1fr", gap: 12 }}>
        <section style={{ padding: 12 }}>
          <h3>Gráfico principal</h3>
          <div style={{ height: 260, display: "flex", alignItems: "center", justifyContent: "center", background: "linear-gradient(90deg,#fff,#fafafa)", borderRadius: 8 }}>
            <div style={{ color: "#999" }}>Aquí se mostrará el gráfico de ventas (placeholder)</div>
          </div>
        </section>

        <aside style={{ padding: 12 }}>
          <h3>Detalles</h3>
          <div style={{ background: "#fff", padding: 12, borderRadius: 8 }}>
            <p style={{ margin: 0 }}>Tabla de ventas por región y datos resumidos.</p>
          </div>
        </aside>
      </div>
    </DashboardShell>
  );
}
