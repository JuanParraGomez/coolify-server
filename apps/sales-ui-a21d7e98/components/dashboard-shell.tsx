import React from 'react'

type Props = { children?: React.ReactNode }

export default function DashboardShell({ children }: Props) {
  return (
    <div style={{ display: 'flex', minHeight: '100vh', fontFamily: 'Arial, sans-serif' }}>
      <aside style={{ width: 240, background: '#0f172a', color: 'white', padding: 20 }}>
        <h2 style={{ marginTop: 0 }}>Ventas</h2>
        <nav>
          <a style={{ display: 'block', color: '#cbd5e1', margin: '8px 0' }}>Resumen</a>
          <a style={{ display: 'block', color: '#cbd5e1', margin: '8px 0' }}>Por región</a>
          <a style={{ display: 'block', color: '#cbd5e1', margin: '8px 0' }}>Reportes</a>
        </nav>
      </aside>

      <main style={{ flex: 1, padding: 24, background: '#f8fafc' }}>
        <header style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 24 }}>
          <h1 style={{ margin: 0 }}>Ventas por región</h1>
          <div>Usuario</div>
        </header>

        <section>{children}</section>
      </main>
    </div>
  )
}
