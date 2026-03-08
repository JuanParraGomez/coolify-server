import DashboardShell from '../components/dashboard-shell';

export default function Page() {
  return (
    <DashboardShell>
      <div style={{ padding: 12 }}>
        <h2>Detalles</h2>
        <p>Esta aplicación muestra ventas por región con filtros interactivos y un gráfico de barras simple.</p>
        <p>Usar los controles a la izquierda para filtrar por región o por mínimo de ventas.</p>
      </div>
    </DashboardShell>
  );
}
