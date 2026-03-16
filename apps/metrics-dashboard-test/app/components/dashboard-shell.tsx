const NAV_ITEMS = [
  { label: 'Resumen', href: '/' },
  { label: 'Regiones', href: '#regions' },
  { label: 'Configuración', href: '#settings' },
]

export default function DashboardShell({ children }: { children: React.ReactNode }) {
  return (
    <div style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column' }}>
      {/* Top header */}
      <header
        style={{
          background: '#1e293b',
          color: '#f8fafc',
          padding: '0 2rem',
          height: '60px',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          boxShadow: '0 2px 8px rgba(0,0,0,0.15)',
          position: 'sticky',
          top: 0,
          zIndex: 100,
        }}
      >
        {/* Brand */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
          <div
            style={{
              width: '32px',
              height: '32px',
              background: 'linear-gradient(135deg, #3b82f6 0%, #06b6d4 100%)',
              borderRadius: '8px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              fontSize: '1rem',
              fontWeight: 700,
            }}
          >
            M
          </div>
          <span style={{ fontWeight: 700, fontSize: '1.05rem', letterSpacing: '-0.01em' }}>
            Metrics Dashboard
          </span>
        </div>

        {/* Nav links */}
        <nav style={{ display: 'flex', gap: '0.25rem' }}>
          {NAV_ITEMS.map(({ label, href }) => (
            <a
              key={href}
              href={href}
              style={{
                color: '#cbd5e1',
                textDecoration: 'none',
                padding: '0.4rem 0.875rem',
                borderRadius: '6px',
                fontSize: '0.875rem',
                fontWeight: 500,
                transition: 'background 0.15s, color 0.15s',
              }}
              onMouseEnter={(e) => {
                (e.currentTarget as HTMLAnchorElement).style.background = 'rgba(255,255,255,0.1)'
                ;(e.currentTarget as HTMLAnchorElement).style.color = '#f8fafc'
              }}
              onMouseLeave={(e) => {
                ;(e.currentTarget as HTMLAnchorElement).style.background = 'transparent'
                ;(e.currentTarget as HTMLAnchorElement).style.color = '#cbd5e1'
              }}
            >
              {label}
            </a>
          ))}
        </nav>

        {/* Right side: last updated badge */}
        <div
          style={{
            fontSize: '0.75rem',
            color: '#94a3b8',
            display: 'flex',
            alignItems: 'center',
            gap: '0.5rem',
          }}
        >
          <span
            style={{
              width: '8px',
              height: '8px',
              borderRadius: '50%',
              background: '#22c55e',
              display: 'inline-block',
            }}
          />
          En vivo
        </div>
      </header>

      {/* Page body */}
      <main style={{ flex: 1, maxWidth: '1400px', width: '100%', margin: '0 auto', padding: '2rem' }}>
        {children}
      </main>

      {/* Footer */}
      <footer
        style={{
          background: '#f8fafc',
          borderTop: '1px solid #e2e8f0',
          padding: '1rem 2rem',
          textAlign: 'center',
          fontSize: '0.75rem',
          color: '#94a3b8',
        }}
      >
        Metrics Dashboard &copy; 2026 — datos actualizados en tiempo real
      </footer>
    </div>
  )
}
