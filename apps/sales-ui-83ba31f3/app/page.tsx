export default function Page() {
  return (
    <section style={{ padding: 20 }}>
      <div style={{ maxWidth: 1200, margin: '0 auto' }}>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 320px', gap: 20 }}>
          <div>
            <section style={{ marginBottom: 20 }}>
              <h2>Resumen de ventas</h2>
              <p>Filtra por fecha, producto o canal usando los controles en la barra lateral.</p>
            </section>

            <section style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
              <div style={{ height: 240, background: '#e6eef8', borderRadius: 8, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>Gráfico: Ventas totales</div>
              <div style={{ height: 240, background: '#f6e7ff', borderRadius: 8, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>Gráfico: Crecimiento</div>
            </section>

            <section style={{ marginTop: 12 }}>
              <div style={{ height: 320, background: '#fff4e6', borderRadius: 8, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>Tabla/Mapa por región</div>
            </section>
          </div>

          <aside style={{ padding: 16, background: '#f8fafc', borderRadius: 8 }}>
            <h3>Filtros</h3>
            <div style={{ marginTop: 8 }}>
              <label>Periodo</label>
              <select style={{ width: '100%', padding: 8, marginTop: 4 }}>
                <option>Últimos 7 días</option>
                <option>Últimos 30 días</option>
                <option>Este año</option>
              </select>
            </div>

            <div style={{ marginTop: 12 }}>
              <label>Región</label>
              <select style={{ width: '100%', padding: 8, marginTop: 4 }}>
                <option>Todo</option>
                <option>América</option>
                <option>Europa</option>
                <option>Asia</option>
              </select>
            </div>

            <button style={{ marginTop: 12, width: '100%', padding: 10 }}>Aplicar</button>
          </aside>
        </div>
      </div>
    </section>
  )
}
