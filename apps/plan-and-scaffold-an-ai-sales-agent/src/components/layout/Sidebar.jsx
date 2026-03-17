import React from 'react'
import { NAV_ITEMS } from '../../lib/constants.js'

export function Sidebar({ activeView, onNavigate, unreadAlerts }) {
  return (
    <aside className="sidebar">
      <div className="sidebar-brand">
        🤖 <span>Agente Ventas IA</span>
      </div>
      <nav className="sidebar-nav">
        {NAV_ITEMS.map(item => (
          <button
            key={item.id}
            className={`nav-item${activeView === item.id ? ' active' : ''}`}
            onClick={() => onNavigate(item.id)}
          >
            <span>{item.icon}</span>
            <span>{item.label}</span>
            {item.id === 'alerts' && unreadAlerts > 0 && (
              <span className="badge">{unreadAlerts}</span>
            )}
          </button>
        ))}
      </nav>
      <div style={{ padding: '0.75rem 1rem', borderTop: '1px solid var(--border)', fontSize: '11.5px', color: 'var(--text-muted)' }}>
        Runtime: gpt-5.1-codex-mini
      </div>
    </aside>
  )
}
