import React from 'react'

export default function Page() {
  return (
    <div>
      <section style={{ marginBottom: 20, padding: 12, background: 'white', borderRadius: 8 }}>
        <h2>Filtros</h2>
        <div style={{ display: 'flex', gap: 8 }}>
          <select>
            <option>Últimos 30 días</option>
            <option>Últimos 90 días</option>
            <option>Este año</option>
          </select>
          <select>
            <option>Todas las regiones</option>
            <option>América</option>
            <option>Europa</option>
            <option>Asia</option>
          </select>
          <button>Aplicar</button>
        </div>
      </section>

      <section style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16 }}>
        <div style={{ background: 'white', padding: 16, borderRadius: 8, minHeight: 200 }}>
          Gráfico de barras (placeholder)
        </div>
        <div style={{ background: 'white', padding: 16, borderRadius: 8, minHeight: 200 }}>
          Mapa/Gráfico de pastel (placeholder)
        </div>
        <div style={{ gridColumn: '1 / -1', background: 'white', padding: 16, borderRadius: 8 }}>
          Tabla de ventas por región (placeholder)
        </div>
      </section>
    </div>
  )
}

