import React from 'react';

type Props = {
  children: React.ReactNode;
};

export default function DashboardShell({ children }: Props) {
  return (
    <div style={{ display: 'flex', minHeight: '100vh', fontFamily: 'Inter, system-ui, -apple-system, "Segoe UI", Roboto, "Helvetica Neue", Arial' }}>
      <aside style={{ width: 260, background: '#0f172a', color: '#e6eef8', padding: '1.5rem 1rem', boxSizing: 'border-box' }}>
        <div style={{ fontSize: 20, fontWeight: 700, marginBottom: 24 }}>Ventas por Región</div>
        <nav>
          <a href="#" style={navLink}>Resumen</a>
          <a href="#" style={navLink}>Regiones</a>
          <a href="#" style={navLink}>Filtros</a>
          <a href="#" style={navLink}>Exportar</a>
        </nav>
        <div style={{ marginTop: 24, fontSize: 12, color: '#9fb0d6' }}>
          © {new Date().getFullYear()} Sales UI
        </div>
      </aside>

      <div style={{ flex: 1, background: '#f8fafc', color: '#0f172a', display: 'flex', flexDirection: 'column' }}>
        <header style={{ height: 64, display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '0 1.5rem', borderBottom: '1px solid #e6eef8', background: '#fff' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
            <button style={iconButton}>☰</button>
            <div style={{ fontWeight: 700 }}>Sales Dashboard</div>
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
            <input placeholder="Buscar" style={{ padding: '8px 10px', borderRadius: 8, border: '1px solid #e6eef8' }} />
            <button style={primaryButton}>Actualizar</button>
          </div>
        </header>

        <main style={{ padding: '1.5rem' }}>{children}</main>
      </div>
    </div>
  );
}

const navLink: React.CSSProperties = {
  display: 'block',
  padding: '10px 12px',
  borderRadius: 8,
  color: 'inherit',
  textDecoration: 'none',
  marginBottom: 8,
  background: 'transparent'
};

const iconButton: React.CSSProperties = {
  background: 'transparent',
  border: 'none',
  fontSize: 18,
  cursor: 'pointer'
};

const primaryButton: React.CSSProperties = {
  background: '#0ea5e9',
  color: '#fff',
  border: 'none',
  padding: '8px 12px',
  borderRadius: 8,
  cursor: 'pointer'
};
