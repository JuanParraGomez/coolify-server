import React from 'react';

type Props = { children?: React.ReactNode };

export default function DashboardShell({ children }: Props) {
  return (
    <div style={{ display: 'grid', gridTemplateColumns: '220px 1fr', gap: '1rem', alignItems: 'start' }}>
      <aside style={{ padding: '1rem', background: 'white', borderRadius: 8, boxShadow: '0 1px 2px rgba(0,0,0,0.06)' }}>
        <h3 style={{ marginTop: 0 }}>Filtros</h3>
        <div style={{ marginTop: 8 }}>
          <label style={{ fontSize: 12 }}>Región</label>
          <select style={{ width: '100%', marginTop: 6 }}>
            <option value="">Todas</option>
            <option>América</option>
            <option>Europa</option>
            <option>Asia</option>
            <option>África</option>
          </select>
        </div>
        <div style={{ marginTop: 12 }}>
          <label style={{ fontSize: 12 }}>Fecha inicio</label>
          <input type="date" style={{ width: '100%', marginTop: 6 }} />
        </div>
        <div style={{ marginTop: 12 }}>
          <label style={{ fontSize: 12 }}>Fecha fin</label>
          <input type="date" style={{ width: '100%', marginTop: 6 }} />
        </div>
      </aside>
      <section style={{ padding: '1rem' }}>
        <div style={{ display: 'flex', gap: '1rem', marginBottom: '1rem' }}>
          <div style={{ flex: 1, minHeight: 140, background: 'white', borderRadius: 8, boxShadow: '0 1px 2px rgba(0,0,0,0.06)', padding: 16 }}>
            <h4 style={{ marginTop: 0 }}>Ventas por Región (gráfico)</h4>
            <div style={{ height: 80, background: 'linear-gradient(90deg,#e2e8f0,#cbd5e1)', borderRadius: 6 }} />
          </div>
          <div style={{ width: 260, background: 'white', borderRadius: 8, padding: 16, boxShadow: '0 1px 2px rgba(0,0,0,0.06)' }}>
            <h4 style={{ marginTop: 0 }}>Resumen</h4>
            <p style={{ margin: '4px 0' }}>Total ventas: $123,456</p>
            <p style={{ margin: '4px 0' }}>Periodo: 01/01 - 31/01</p>
          </div>
        </div>
        <div style={{ background: 'white', borderRadius: 8, minHeight: 200, padding: 16, boxShadow: '0 1px 2px rgba(0,0,0,0.06)' }}>
          {children ?? <p style={{ margin: 0 }}>Seleccione filtros para ver gráficos.</p>}
        </div>
      </section>
    </div>
  );
}
