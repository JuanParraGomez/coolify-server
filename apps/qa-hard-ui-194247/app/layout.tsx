import type { ReactNode } from 'react'
import { Inter } from 'next/font/google'

const inter = Inter({ subsets: ['latin'], variable: '--font-inter' })

export const metadata = {
  title: 'Dashboard de Ventas por Región',
  description: 'Resumen de rendimiento trimestral con filtros y controles de navegación entre vistas.',
}

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="es">
      <head />
      <body className={`${inter.className} layout-root`}>
        {children}
        <style jsx global>{`
          :root {
            color-scheme: dark;
          }

          *, *::before, *::after {
            box-sizing: border-box;
          }

          body {
            margin: 0;
            min-height: 100vh;
            background: radial-gradient(circle at top, #1c1f4a 0%, #05070f 45%, #020617 100%);
            color: #f8fafc;
          }

          .layout-root {
            min-height: 100vh;
            padding: 1.5rem;
          }

          body ::selection {
            background: rgba(94, 234, 212, 0.7);
            color: #020617;
          }
        `}</style>
      </body>
    </html>
  )
}
