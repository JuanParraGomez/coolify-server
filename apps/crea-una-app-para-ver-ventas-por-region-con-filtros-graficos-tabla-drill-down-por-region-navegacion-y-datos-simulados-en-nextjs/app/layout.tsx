import type { Metadata } from 'next'
import { Source_Sans_3, Space_Grotesk } from 'next/font/google'
import type { CSSProperties, ReactNode } from 'react'

import './globals.css'

const displayFont = Space_Grotesk({
  subsets: ['latin'],
  variable: '--font-display-face',
  weight: ['500', '700'],
})

const bodyFont = Source_Sans_3({
  subsets: ['latin'],
  variable: '--font-body-face',
  weight: ['400', '500', '600', '700'],
})

export const metadata: Metadata = {
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
      <body
        className={`${displayFont.variable} ${bodyFont.variable}`}
        style={
          {
            '--font-display': 'var(--font-display-face)',
            '--font-body': 'var(--font-body-face)',
          } as CSSProperties
        }
      >
        {children}
      </body>
    </html>
  )
}
