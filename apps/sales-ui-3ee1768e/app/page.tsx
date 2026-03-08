import React from 'react';
import DashboardShell from '../components/dashboard-shell';

export default function Page() {
  return (
    <DashboardShell>
      <div>
        <h2>Gráfico de ventas por región</h2>
        <p>Este panel mostrará gráficos interactivos y tablas filtrables para analizar ventas por región.</p>
      </div>
    </DashboardShell>
  );
}
