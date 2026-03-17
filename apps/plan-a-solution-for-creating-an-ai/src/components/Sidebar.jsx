import React from 'react'
import { NAV_SECTIONS } from '../data/plan.js'

export default function Sidebar({ active, onSelect }) {
  return (
    <aside style={{
      width: 240,
      minHeight: '100vh',
      background: '#0f172a',
      borderRight: '1px solid #1e293b',
      display: 'flex',
      flexDirection: 'column',
      flexShrink: 0,
    }}>
      <div style={{ padding: '1.5rem 1rem 1rem', borderBottom: '1px solid #1e293b' }}>
        <div style={{ fontSize: 11, color: '#64748b', textTransform: 'uppercase', letterSpacing: 1, marginBottom: 6 }}>
          AI Sales Assistant
        </div>
        <div style={{ fontSize: 14, color: '#f1f5f9', fontWeight: 600, lineHeight: 1.4 }}>
          Plan de Implementación
        </div>
      </div>
      <nav style={{ flex: 1, padding: '0.5rem 0' }}>
        {NAV_SECTIONS.map(s => (
          <button
            key={s.id}
            onClick={() => onSelect(s.id)}
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: 10,
              width: '100%',
              padding: '0.6rem 1rem',
              background: active === s.id ? '#1e40af' : 'transparent',
              border: 'none',
              borderLeft: active === s.id ? '3px solid #3b82f6' : '3px solid transparent',
              color: active === s.id ? '#e0f2fe' : '#94a3b8',
              fontSize: 13,
              cursor: 'pointer',
              textAlign: 'left',
              transition: 'background 0.15s',
            }}
          >
            <span style={{ fontSize: 16 }}>{s.icon}</span>
            <span>{s.label}</span>
          </button>
        ))}
      </nav>
      <div style={{ padding: '1rem', borderTop: '1px solid #1e293b' }}>
        <div style={{ fontSize: 10, color: '#475569', lineHeight: 1.5 }}>
          Runtime: <span style={{ color: '#fbbf24' }}>openai-codex/<br />gpt-5.1-codex-mini</span>
        </div>
      </div>
    </aside>
  )
}
