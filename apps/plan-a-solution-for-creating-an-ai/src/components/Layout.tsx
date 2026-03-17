import React from 'react'
import { useAppStore } from '../store'
import { useNotifications } from '../hooks/useNotifications'

type Section = 'leads' | 'chat' | 'research' | 'config'

const navItems: { id: Section; label: string; icon: string }[] = [
  { id: 'leads', label: 'Leads', icon: '👥' },
  { id: 'chat', label: 'Chat', icon: '💬' },
  { id: 'research', label: 'Investigación', icon: '🔍' },
  { id: 'config', label: 'API Keys', icon: '🔑' },
]

export default function Layout({ children }: { children: React.ReactNode }) {
  const { activeSection, setActiveSection, unreadCount } = useAppStore()
  useNotifications() // inicializa polling en segundo plano

  return (
    <div style={{ display: 'flex', height: '100vh', fontFamily: 'system-ui, sans-serif', background: '#f8fafc' }}>
      {/* Sidebar */}
      <aside style={{
        width: 220,
        background: '#1e293b',
        color: '#f1f5f9',
        display: 'flex',
        flexDirection: 'column',
        padding: '1rem 0',
        flexShrink: 0,
      }}>
        <div style={{ padding: '0 1rem 1.5rem', borderBottom: '1px solid #334155' }}>
          <div style={{ fontSize: 13, color: '#64748b', marginBottom: 4 }}>AI Sales Assistant</div>
          <div style={{ fontSize: 11, color: '#475569' }}>
            Runtime: <code style={{ color: '#94a3b8' }}>gpt-5.1-codex-mini</code>
          </div>
        </div>

        <nav style={{ flex: 1, paddingTop: '0.5rem' }}>
          {navItems.map((item) => (
            <button
              key={item.id}
              onClick={() => setActiveSection(item.id)}
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: 10,
                width: '100%',
                padding: '0.6rem 1rem',
                background: activeSection === item.id ? '#334155' : 'transparent',
                color: activeSection === item.id ? '#f1f5f9' : '#94a3b8',
                border: 'none',
                cursor: 'pointer',
                fontSize: 14,
                textAlign: 'left',
                position: 'relative',
              }}
            >
              <span>{item.icon}</span>
              <span>{item.label}</span>
              {item.id === 'leads' && unreadCount > 0 && (
                <span style={{
                  marginLeft: 'auto',
                  background: '#ef4444',
                  color: 'white',
                  borderRadius: 999,
                  fontSize: 11,
                  padding: '1px 6px',
                  fontWeight: 700,
                }}>
                  {unreadCount}
                </span>
              )}
            </button>
          ))}
        </nav>
      </aside>

      {/* Main content */}
      <main style={{ flex: 1, overflow: 'auto', padding: '1.5rem' }}>
        {children}
      </main>
    </div>
  )
}
