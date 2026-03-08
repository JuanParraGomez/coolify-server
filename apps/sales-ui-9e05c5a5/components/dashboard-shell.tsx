"use client";
import React, { useMemo, useState } from 'react';

type Props = { children?: React.ReactNode };

const SAMPLE_DATA: Record<string, number> = {
  Norte: 120,
  Sur: 80,
  Este: 200,
  Oeste: 50,
  Centro: 140,
};

export default function DashboardShell({ children }: Props) {
  const [region, setRegion] = useState<'Todas' | string>('Todas');
  const [minSales, setMinSales] = useState<number | ''>('');

  const regions = useMemo(() => ['Todas', ...Object.keys(SAMPLE_DATA)], []);

  const filtered = useMemo(() => {
    const entries = Object.entries(SAMPLE_DATA).filter(([r, v]) => {
      if (region !== 'Todas' && r !== region) return false;
      if (minSales !== '' && v < Number(minSales)) return false;
      return true;
    });
    return Object.fromEntries(entries);
  }, [region, minSales]);

  return (
    <div style={{ display: 'flex', minHeight: '100vh' }}>
      <aside style={{ width: 260, padding: 20, borderRight: '1px solid #eee', background: '#fafafa' }}>
        <h2 style={{ marginTop: 0 }}>Filtros</h2>

        <label style={{ display: 'block', marginBottom: 12 }}>
          Región
          <select value={region} onChange={(e) => setRegion(e.target.value)} style={{ width: '100%', marginTop: 6 }}>
            {regions.map((r) => (
              <option key={r} value={r}>
                {r}
              </option>
            ))}
          </select>
        </label>

        <label style={{ display: 'block', marginBottom: 12 }}>
          Mínimo ventas
          <input
            type="number"
            placeholder="e.g. 50"
            value={minSales}
            onChange={(e) => setMinSales(e.target.value === '' ? '' : Number(e.target.value))}
            style={{ width: '100%', marginTop: 6 }}
          />
        </label>

        <div style={{ marginTop: 24 }}>
          <strong>Resumen</strong>
          <div style={{ marginTop: 8 }}>
            Total regiones: {Object.keys(filtered).length}
          </div>
          <div>Ventas totales: {Object.values(filtered).reduce((a, b) => a + b, 0)}</div>
        </div>
      </aside>

      <main style={{ flex: 1, padding: 24 }}>
        <header style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 20 }}>
          <h1 style={{ margin: 0 }}>Ventas por Región</h1>
          <div style={{ color: '#666' }}>Interfaz minimal para visualización</div>
        </header>

        <section style={{ marginBottom: 20 }}>
          <h3>Gráfico (barras)</h3>
          <div style={{ display: 'flex', alignItems: 'flex-end', gap: 12, height: 180, padding: 12, border: '1px solid #eee', borderRadius: 6 }}>
            {Object.entries(filtered).length === 0 ? (
              <div style={{ color: '#666' }}>No hay datos</div>
            ) : (
              Object.entries(filtered).map(([r, v]) => {
                const max = Math.max(...Object.values(filtered), 1);
                const height = (v / max) * 100;
                return (
                  <div key={r} style={{ textAlign: 'center', width: 60 }}>
                    <div style={{ height: `${height}%`, background: '#3b82f6', borderRadius: 4 }} />
                    <div style={{ marginTop: 6 }}>{r}</div>
                    <div style={{ fontSize: 12, color: '#333' }}>{v}</div>
                  </div>
                );
              })
            )}
          </div>
        </section>

        <section>
          {children ?? <p>Seleccione filtros para actualizar los gráficos.</p>}
        </section>
      </main>
    </div>
  );
}
