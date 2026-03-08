"use client"
import React from 'react'

const NavItem = ({ children }: { children: React.ReactNode }) => (
  <div style={{ padding: '0.5rem 1rem', cursor: 'pointer' }}>{children}</div>
)

export default function DashboardShell({ children }: { children: React.ReactNode }) {
  return (
    <div style={{ display: 'flex', minHeight: '100vh', fontFamily: 'Inter, system-ui, sans-serif' }}>
      <aside style={{ width: 240, background: '#0f172a', color: '#fff', padding: '1rem 0' }}>
        <div style={{ padding: '0 1rem', fontWeight: 700, fontSize: 18 }}>Sales Probe</div>
        <nav style={{ marginTop: 20 }}>
          <NavItem>Dashboard</NavItem>
          <NavItem>Regiones</NavItem>
          <NavItem>Reportes</NavItem>
          <NavItem>Configuración</NavItem>
        </nav>
      </aside>

      <div style={{ flex: 1, display: 'flex', flexDirection: 'column' }}>
        <header style={{ height: 64, borderBottom: '1px solid #e6edf3', display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '0 1rem' }}>
          <div style={{ fontSize: 16, fontWeight: 600 }}>Ventas por región</div>
          <div style={{ display: 'flex', gap: 12 }}>
            <input placeholder="Buscar..." style={{ padding: '6px 10px', borderRadius: 6, border: '1px solid #ccd' }} />
            <button style={{ padding: '6px 10px', borderRadius: 6 }}>Nuevo filtro</button>
          </div>
        </header>

        <main style={{ padding: 16 }}>
          <section style={{ display: 'flex', gap: 16, marginBottom: 16 }}>
            <div style={{ flex: 1, padding: 12, border: '1px solid #e5e7eb', borderRadius: 8, background: '#fff' }}>
              <h3 style={{ margin: '0 0 8px 0' }}>Filtros</h3>
              <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap' }}>
                <select style={{ padding: 8, borderRadius: 6 }}>
                  <option>Todos</option>
                  <option>Norte</option>
                  <option>Sur</option>
                  <option>Este</option>
                  <option>Oeste</option>
                </select>

                <select style={{ padding: 8, borderRadius: 6 }}>
                  <option>Últimos 7 días</option>
                  <option>Últimos 30 días</option>
                  <option>Último año</option>
                </select>

                <button style={{ padding: '8px 12px', borderRadius: 6 }}>Aplicar</button>
              </div>
            </div>

            <div style={{ width: 320, padding: 12, border: '1px solid #e5e7eb', borderRadius: 8, background: '#fff' }}>
              <h3 style={{ margin: '0 0 8px 0' }}>Resumen</h3>
              <div>Ingresos: $—</div>
              <div>Órdenes: —</div>
            </div>
          </section>

          <section style={{ display: 'grid', gridTemplateColumns: '2fr 1fr', gap: 16 }}>
            <div style={{ padding: 12, border: '1px solid #e5e7eb', borderRadius: 8, background: '#fff', minHeight: 320 }}>
              <h3>Gráfico de ventas</h3>
              <div style={{ height: 260, background: 'linear-gradient(90deg,#f8fafc,#fff)', borderRadius: 6, display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#334155' }}>
                Placeholder for chart
              </div>
            </div>

            <div style={{ padding: 12, border: '1px solid #e5e7eb', borderRadius: 8, background: '#fff', minHeight: 320 }}>
              <h3>Detalle por región</h3>
              <ul>
                <li>Norte — $—</li>
                <li>Sur — $—</li>
                <li>Este — $—</li>
                <li>Oeste — $—</li>
              </ul>
            </div>
          </section>

          {children}
        </main>
      </div>
    </div>
  )
}
