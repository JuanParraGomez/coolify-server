import React from 'react'

export default function Page() {
  return (
    <div>
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 12, marginBottom: 16 }}>
        <div style={{ background: '#fff', padding: 16, borderRadius: 8 }}>
          <h3 style={{ margin: 0 }}>Ingresos</h3>
          <p style={{ marginTop: 8, fontSize: 20 }}>$124,320</p>
        </div>

        <div style={{ background: '#fff', padding: 16, borderRadius: 8 }}>
          <h3 style={{ margin: 0 }}>Órdenes</h3>
          <p style={{ marginTop: 8, fontSize: 20 }}>4,212</p>
        </div>

        <div style={{ background: '#fff', padding: 16, borderRadius: 8 }}>
          <h3 style={{ margin: 0 }}>Ticket medio</h3>
          <p style={{ marginTop: 8, fontSize: 20 }}>$29.50</p>
        </div>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '2fr 1fr', gap: 12 }}>
        <div style={{ background: '#f8fafc', padding: 18, borderRadius: 8, minHeight: 320 }}>
          <h2>Gráfico de ventas por región</h2>
          <div style={{ height: 240, borderRadius: 8, background: 'linear-gradient(90deg,#e6eefc,#f9fbff)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#3b82f6' }}>
            Gráfico placeholder
          </div>
        </div>

        <aside style={{ background: '#fff', padding: 16, borderRadius: 8 }}>
          <h3>Top regiones</h3>
          <ol>
            <li>North — $41,200</li>
            <li>East — $32,100</li>
            <li>West — $27,300</li>
          </ol>
        </aside>
      </div>
    </div>
  )
}
