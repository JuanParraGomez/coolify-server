import React from 'react'

const styles = {
  shell: {
    display: 'flex',
    flexDirection: 'column',
    minHeight: '100vh',
    fontFamily: 'system-ui, -apple-system, sans-serif',
    margin: 0,
    padding: 0,
    backgroundColor: '#ffffff',
  },
  header: {
    padding: '16px 32px',
    borderBottom: '1px solid #e5e7eb',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  headerTitle: {
    fontSize: '1rem',
    fontWeight: 600,
    color: '#111827',
    margin: 0,
  },
  healthBadge: {
    fontSize: '0.75rem',
    padding: '2px 10px',
    borderRadius: '9999px',
    backgroundColor: '#d1fae5',
    color: '#065f46',
    fontWeight: 500,
  },
  main: {
    flex: 1,
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
  },
  footer: {
    padding: '12px 32px',
    borderTop: '1px solid #e5e7eb',
    textAlign: 'center',
    fontSize: '0.75rem',
    color: '#9ca3af',
  },
}

export default function AppShell({ children }) {
  return (
    <div style={styles.shell}>
      <header style={styles.header}>
        <p style={styles.headerTitle}>crear-y-desplegar-una-app-web</p>
        <span style={styles.healthBadge}>healthy</span>
      </header>

      <main style={styles.main}>
        {children}
      </main>

      <footer style={styles.footer}>
        Hola Mundo · React + Vite
      </footer>
    </div>
  )
}
