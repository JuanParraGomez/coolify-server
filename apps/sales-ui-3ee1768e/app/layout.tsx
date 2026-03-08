import React from 'react';

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="es">
      <head />
      <body style={{ margin: 0, fontFamily: 'Inter, system-ui, sans-serif', background: '#f7fafc' }}>
        <header style={{ background: '#111827', color: 'white', padding: '1rem 2rem', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          <div style={{ fontWeight: 700 }}>Ventas por Región</div>
          <nav>
            <a href="#" style={{ color: 'rgba(255,255,255,0.9)', marginRight: '1rem', textDecoration: 'none' }}>Dashboard</a>
            <a href="#" style={{ color: 'rgba(255,255,255,0.9)', textDecoration: 'none' }}>Acerca</a>
          </nav>
        </header>
        <main style={{ padding: '1.5rem' }}>{children}</main>
      </body>
    </html>
  );
}
