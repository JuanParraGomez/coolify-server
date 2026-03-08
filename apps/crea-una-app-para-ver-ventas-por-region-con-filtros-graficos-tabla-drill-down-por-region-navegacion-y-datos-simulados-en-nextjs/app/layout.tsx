import type { ReactNode } from 'react'

import './globals.css'

export const metadata = {
  title: 'Pulse Regional | Ventas por región',
  description:
    'Dashboard de ventas por región con filtros, gráficas, tabla y drill-down usando datos simulados en Next.js.',
}

export default function RootLayout({
  children,
}: Readonly<{
  children: ReactNode
}>) {
  return (
    <html lang="es">
      <body>{children}</body>
    </html>
  )
}
