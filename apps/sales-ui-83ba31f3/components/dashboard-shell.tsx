import React from 'react'

type Props = {
  children: React.ReactNode
}

export default function DashboardShell({ children }: Props) {
  return (
    <div style={{ display: 'flex', minHeight: '100vh', fontFamily: 'Inter, system-ui, sans-serif' }}>
      <aside style={{ width: 240, padding: 20, background: '#0f172a', color: '#fff' }}>
        <h2 style={{ marginTop: 0 }}>Ventas</h2>
        <nav style={{ display: 'flex', flexDirection: 'column', gap: 8, marginTop: 16 }}>
          <a href="#" style={{ color: '#cbd5e1', textDecoration: 'none' }}>Dashboard</a>
          <a href="#" style={{ color: '#cbd5e1', textDecoration: 'none' }}>Por Región</a>
          <a href="#" style={{ color: '#cbd5e1', textDecoration: 'none' }}>Exportar</a>
        </nav>
        <div style={{ marginTop: 24, fontSize: 12, color: '#94a3b8' }}>
          <div>Usuario: Analista</div>
          <div style={{ marginTop: 8 }}>Rol: Viewer</div>
        </div>
      </aside>

      <div style={{ flex: 1, padding: 20, background: '#f8fafc' }}>
        <header style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 20 }}>
          <h1 style={{ margin: 0 }}>Ventas por Región</h1>
          <div style={{ color: '#334155' }}>Resumen • Últimos 30 días</div>
        </header>

        <main>{children}</main>

        <footer style={{ marginTop: 40, fontSize: 12, color: '#94a3b8' }}>
          <div>© {new Date().getFullYear()} Sales Dashboard</div>
        </footer>
      </div>
    </div>
  )
}
