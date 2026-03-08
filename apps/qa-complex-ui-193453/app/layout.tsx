import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Atlas Ventas · Análisis regional',
  description: 'Dashboard avanzado para explorar ventas por región con filtros, KPIs y comparativas trimestrales.',
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="es">
      <body>{children}</body>
      <style jsx global>{`
        :root {
          color-scheme: dark;
          font-family: 'Inter', 'Segoe UI', system-ui, sans-serif;
          background-color: #090b12;
          color: #f8fafc;
        }

        * {
          box-sizing: border-box;
        }

        body {
          margin: 0;
          min-height: 100vh;
          background: radial-gradient(circle at top, rgba(59, 130, 246, 0.15), transparent 40%),
            #030712;
        }

        ::selection {
          background: rgba(59, 130, 246, 0.35);
        }

        button {
          font-family: inherit;
        }

        html,
        body {
          scroll-behavior: smooth;
        }
      `}</style>
    </html>
  )
}
