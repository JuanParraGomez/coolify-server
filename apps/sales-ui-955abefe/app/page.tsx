import React from 'react'

export default function Page() {
  return (
    <div>
      <h1 style={{ margin: 0, marginBottom: 12 }}>Ventas por región</h1>

      <section style={{ display: 'flex', gap: 20, marginBottom: 20 }}>
        <div style={{ flex: '0 0 300px', padding: 12, border: '1px solid #e5e7eb', borderRadius: 8, background: '#fff' }}>
          <h3 style={{ marginTop: 0 }}>Filtros</h3>

          <div style={{ marginBottom: 8 }}>
            <label style={{ display: 'block', fontSize: 13, marginBottom: 4 }}>Región</label>
            <select style={{ width: '100%', padding: 8 }}>
              <option>Todos</option>
              <option>Norte</option>
              <option>Sur</option>
              <option>Este</option>
              <option>Oeste</option>
            </select>
          </div>

          <div>
            <label style={{ display: 'block', fontSize: 13, marginBottom: 4 }}>Periodo</label>
            <select style={{ width: '100%', padding: 8 }}>
              <option>Últimos 30 días</option>
              <option>Últimos 90 días</option>
              <option>Este año</option>
            </select>
          </div>
        </div>

        <div style={{ flex: 1 }}>
          <div style={{ padding: 12, border: '1px solid #e5e7eb', borderRadius: 8, background: '#fff' }}>
            <h3 style={{ marginTop: 0 }}>Gráficos</h3>
            <div style={{ height: 220, background: '#eef2ff', borderRadius: 6, display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#4c1d95' }}>Placeholder: Mapa/Heatmap por región</div>
            <div style={{ height: 220, marginTop: 12, background: '#ecfeff', borderRadius: 6, display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#065f46' }}>Placeholder: Serie temporal de ventas</div>
          </div>
        </div>
      </section>

      <section>
        <h3>Resumen por región</h3>
        <table style={{ width: '100%', borderCollapse: 'collapse', background: '#fff', border: '1px solid #e5e7eb', borderRadius: 8 }}>
          <thead>
            <tr>
              <th style={{ textAlign: 'left', padding: 8 }}>Región</th>
              <th style={{ textAlign: 'right', padding: 8 }}>Ventas</th>
              <th style={{ textAlign: 'right', padding: 8 }}>Cambio</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td style={{ padding: 8 }}>Norte</td>
              <td style={{ padding: 8, textAlign: 'right' }}>€12,345</td>
              <td style={{ padding: 8, textAlign: 'right' }}>+5%</td>
            </tr>
            <tr style={{ background: '#f8fafc' }}>
              <td style={{ padding: 8 }}>Sur</td>
              <td style={{ padding: 8, textAlign: 'right' }}>€9,876</td>
              <td style={{ padding: 8, textAlign: 'right' }}>-2%</td>
            </tr>
          </tbody>
        </table>
      </section>
    </div>
  )
}
