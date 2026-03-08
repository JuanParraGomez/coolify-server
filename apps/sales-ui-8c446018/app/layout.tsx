import React from 'react'

export const metadata = {
  title: 'Sales Dashboard',
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="es">
      <body style={{ margin: 0, fontFamily: 'Inter, system-ui, sans-serif', background: '#f5f7fb' }}>
        <div style={{ display: 'flex', minHeight: '100vh' }}>
          <aside style={{ width: 220, background: '#0f172a', color: '#fff', padding: '1.25rem' }}>
            <h2 style={{ margin: 0, fontSize: '1.25rem' }}>Ventas</h2>
            <nav style={{ marginTop: '1rem' }}>
              <a href="#" style={{ color: '#cbd5e1', display: 'block', padding: '0.5rem 0' }}>Resumen</a>
              <a href="#" style={{ color: '#cbd5e1', display: 'block', padding: '0.5rem 0' }}>Regiones</a>
              <a href="#" style={{ color: '#cbd5e1', display: 'block', padding: '0.5rem 0' }}>Comparar</a>
            </nav>
          </aside>

          <main style={{ flex: 1, padding: '1.25rem' }}>{children}</main>
        </div>
      </body>
    </html>
  )
}
