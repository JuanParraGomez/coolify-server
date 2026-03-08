import React from 'react'
import DashboardShell from '../components/dashboard-shell'

export const metadata = {
  title: 'Sales Dashboard',
  description: 'Aplicación para visualizar ventas por región con filtros y gráficos',
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="es">
      <body>
        <DashboardShell>{children}</DashboardShell>
      </body>
    </html>
  )
}
