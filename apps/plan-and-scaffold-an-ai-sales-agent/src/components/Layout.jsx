import React from 'react'
import { NavLink } from 'react-router-dom'
import { useAlerts } from '../hooks/useAlerts.js'
import { RUNTIME_MODEL } from '../lib/constants.js'

const NAV = [
  { to: '/dashboard',     icon: '📊', label: 'Dashboard' },
  { to: '/leads',         icon: '👥', label: 'Leads' },
  { to: '/chat',          icon: '💬', label: 'Chat Extensión' },
  { to: '/responses',     icon: '✍️',  label: 'Respuestas IA' },
  { to: '/research',      icon: '🔍', label: 'Investigación' },
  { to: '/alerts',        icon: '🔔', label: 'Alertas' },
  { to: '/langgraph',     icon: '🤖', label: 'Agente LangGraph' },
  { to: '/settings',      icon: '⚙️',  label: 'Config API' },
]

const S = {
  root:    { display: 'flex', height: '100vh', background: '#0f172a', color: '#e2e8f0', fontFamily: 'system-ui,sans-serif' },
  sidebar: { width: 224, minWidth: 224, background: '#1e293b', display: 'flex', flexDirection: 'column', borderRight: '1px solid #334155' },
  logo:    { padding: '1.25rem 1rem', borderBottom: '1px solid #334155' },
  logoTitle: { fontSize: '1rem', fontWeight: 700, color: '#3b82f6' },
  logoSub:   { fontSize: '0.7rem', color: '#64748b', marginTop: 3 },
  nav:     { flex: 1, padding: '0.5rem 0', overflowY: 'auto' },
  link: (a) => ({
    display: 'flex', alignItems: 'center', gap: '0.6rem',
    padding: '0.65rem 1rem', textDecoration: 'none', fontSize: '0.85rem',
    color: a ? '#e2e8f0' : '#94a3b8',
    background: a ? '#3b82f620' : 'transparent',
    borderLeft: `3px solid ${a ? '#3b82f6' : 'transparent'}`,
  }),
  badge: { marginLeft: 'auto', background: '#ef4444', color: '#fff', borderRadius: 10, padding: '1px 6px', fontSize: '0.7rem', fontWeight: 700 },
  main:    { flex: 1, display: 'flex', flexDirection: 'column', overflow: 'hidden' },
  topbar:  { padding: '0.65rem 1.5rem', borderBottom: '1px solid #1e293b', display: 'flex', alignItems: 'center', justifyContent: 'space-between', background: '#0f172a', fontSize: '0.8rem' },
  modelPill: { background: '#1e293b', border: '1px solid #334155', borderRadius: 6, padding: '3px 9px', color: '#94a3b8', fontSize: '0.7rem' },
  content: { flex: 1, overflowY: 'auto', padding: '1.5rem' },
}

export default function Layout({ children }) {
  const { unread } = useAlerts()

  return (
    <div style={S.root}>
      <aside style={S.sidebar}>
        <div style={S.logo}>
          <div style={S.logoTitle}>🤖 AI Sales Agent</div>
          <div style={S.logoSub}>LangGraph · REST API</div>
        </div>
        <nav style={S.nav}>
          {NAV.map(({ to, icon, label }) => (
            <NavLink key={to} to={to} style={({ isActive }) => S.link(isActive)}>
              <span>{icon}</span>
              <span style={{ flex: 1 }}>{label}</span>
              {to === '/alerts' && unread > 0 && <span style={S.badge}>{unread}</span>}
            </NavLink>
          ))}
        </nav>
      </aside>

      <div style={S.main}>
        <div style={S.topbar}>
          <span style={{ color: '#64748b' }}>Agente de Ventas con IA · datos vía REST</span>
          <span style={S.modelPill}>runtime: {RUNTIME_MODEL}</span>
        </div>
        <main style={S.content}>{children}</main>
      </div>
    </div>
  )
}
