import './globals.css'
import React from 'react'
import DashboardShell from '../components/dashboard-shell'

export const metadata = {
  title: 'Sales Probe',
  description: 'Ventas por región - dashboard'
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
