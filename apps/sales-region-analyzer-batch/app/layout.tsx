import type { Metadata } from 'next'
import type { ReactNode } from 'react'

export const metadata: Metadata = {
  title: 'Sales Region Analyzer Batch',
  description:
    'Dashboard de ventas por region con filtros, graficos, tabla y drill-down sobre datos simulados.',
}

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="es">
      <body
        style={{
          margin: 0,
          minHeight: '100vh',
          background:
            'radial-gradient(circle at top, rgba(219, 110, 70, 0.2), transparent 28%), linear-gradient(180deg, #fffaf2 0%, #f4efe5 100%)',
          color: '#1f2937',
          fontFamily:
            '"Avenir Next", "Segoe UI", "Helvetica Neue", sans-serif',
        }}
      >
        {children}
      </body>
    </html>
  )
}
