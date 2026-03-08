import type { ReactNode } from 'react'

export const metadata = {
  title: 'Dashboard de ventas',
  description: 'Resumen regional con filtros, gráficos y tabla comparativa por trimestre.',
}

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="es">
      <body
        style={{
          margin: 0,
          minHeight: '100vh',
          backgroundColor: '#050914',
          fontFamily: "'Inter', 'Segoe UI', system-ui, sans-serif",
        }}
      >
        {children}
      </body>
    </html>
  )
}
