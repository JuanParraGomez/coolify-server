import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Metrics Dashboard',
  description: 'Dashboard de métricas con usuarios activos, ingresos del mes y tickets pendientes.',
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="es">
      <body
        style={{
          margin: 0,
          padding: 0,
          fontFamily: 'system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif',
          background: '#f1f5f9',
          color: '#1e293b',
          lineHeight: 1.5,
          WebkitFontSmoothing: 'antialiased',
          MozOsxFontSmoothing: 'grayscale',
        }}
      >
        {children}
      </body>
    </html>
  )
}
