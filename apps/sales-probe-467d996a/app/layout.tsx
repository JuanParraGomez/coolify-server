import React from 'react'
import DashboardShell from '../components/dashboard-shell'

export const metadata = {
  title: 'Ventas por Región',
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="es">
      <body style={{ margin: 0, fontFamily: 'Inter, system-ui, -apple-system, "Segoe UI", Roboto, "Helvetica Neue", Arial' }}>
        <DashboardShell>{children}</DashboardShell>
      </body>
    </html>
  )
}
