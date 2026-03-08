'use client'

import React from 'react'
import Link from 'next/link'

type Props = { children: React.ReactNode }

export default function DashboardShell({ children }: Props) {
  return (
    <div style={{ display: 'flex', height: '100vh', fontFamily: 'Inter, system-ui, -apple-system, "Segoe UI", Roboto, "Helvetica Neue", Arial' }}>
      <aside style={{ width: 260, background: '#0f172a', color: '#fff', padding: 20, boxSizing: 'border-box' }}>
        <h2 style={{ fontSize: 18, marginBottom: 12 }}>Sales Dashboard</h2>
        <nav>
          <ul style={{ listStyle: 'none', padding: 0, margin: 0 }}>
            <li style={{ marginBottom: 8 }}><Link href="/" style={{ color: '#93c5fd', textDecoration: 'none' }}>Overview</Link></li>
            <li style={{ marginBottom: 8 }}><a href="#" style={{ color: '#c7d2fe', textDecoration: 'none' }}>Por región</a></li>
            <li style={{ marginBottom: 8 }}><a href="#" style={{ color: '#c7d2fe', textDecoration: 'none' }}>Ajustes</a></li>
          </ul>
        </nav>
      </aside>

      <main style={{ flex: 1, background: '#f8fafc', padding: 24, boxSizing: 'border-box', overflow: 'auto' }}>
        {children}
      </main>
    </div>
  )
}
