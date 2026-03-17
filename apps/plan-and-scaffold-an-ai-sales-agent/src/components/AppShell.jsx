import React from 'react'
import { useNavigate, useLocation } from 'react-router-dom'
import { Sidebar } from './layout/Sidebar.jsx'
import { Header } from './layout/Header.jsx'
import { useAlerts } from '../hooks/useAlerts.js'
import { NAV_ITEMS } from '../lib/constants.js'

/**
 * AppShell — envoltura principal de la aplicación.
 *
 * Conecta react-router con la Sidebar y el Header existentes.
 * Usa las clases CSS definidas en styles/index.css (.app-shell, .main-content, .view).
 *
 * Uso en App.jsx:
 *   <AppShell>
 *     <Routes>...</Routes>
 *   </AppShell>
 */
export default function AppShell({ children }) {
  const navigate = useNavigate()
  const location = useLocation()
  const { unread } = useAlerts()

  // Derivar activeView a partir del pathname de react-router
  const activeView = deriveActiveView(location.pathname)

  const handleNavigate = (viewId) => {
    const item = NAV_ITEMS.find(n => n.id === viewId)
    if (item) {
      navigate(`/${viewId}`)
    }
  }

  return (
    <div className="app-shell">
      <Sidebar
        activeView={activeView}
        onNavigate={handleNavigate}
        unreadAlerts={unread}
      />
      <div className="main-content">
        <Header activeView={activeView} />
        <main className="view">
          {children}
        </main>
      </div>
    </div>
  )
}

/**
 * Mapea el pathname de react-router al id de vista usado por la Sidebar.
 * Ejemplo: '/leads' → 'leads', '/settings' → 'apiconfig'
 */
function deriveActiveView(pathname) {
  const segment = pathname.replace(/^\//, '').split('/')[0]
  // Alias para rutas que difieren del id de vista
  const aliases = {
    settings: 'apiconfig',
    dashboard: 'leads', // El dashboard redirige al listado de leads
  }
  return aliases[segment] ?? segment ?? 'leads'
}
