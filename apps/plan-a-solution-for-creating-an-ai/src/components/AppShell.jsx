import React from 'react'
import { SECTIONS } from '../plan.js'

// ─── Design Tokens ──────────────────────────────────────────────────────────
export const T = {
  bg: '#0f1117',
  surface: '#1a1d27',
  surface2: '#222534',
  border: '#2a2d3e',
  text: '#e2e8f0',
  muted: '#94a3b8',
  accent: '#6366f1',
  accentHover: '#818cf8',
}

// ─── AppShell ────────────────────────────────────────────────────────────────
export default function AppShell({ active, onNavigate, children, extraSections = [] }) {
  return (
    <div style={{
      display: 'flex',
      minHeight: '100vh',
      background: T.bg,
      color: T.text,
      fontFamily: 'system-ui, -apple-system, sans-serif',
    }}>
      {/* Sidebar */}
      <aside style={{
        width: 220,
        minHeight: '100vh',
        background: T.surface,
        borderRight: `1px solid ${T.border}`,
        padding: '24px 0',
        position: 'sticky',
        top: 0,
        height: '100vh',
        overflowY: 'auto',
        flexShrink: 0,
      }}>
        {/* Brand */}
        <div style={{ padding: '0 16px 20px', borderBottom: `1px solid ${T.border}` }}>
          <div style={{
            color: T.accent,
            fontWeight: 700,
            fontSize: 13,
            letterSpacing: 0.5,
            textTransform: 'uppercase',
          }}>
            AI Sales Assistant
          </div>
          <div style={{ color: T.muted, fontSize: 11, marginTop: 4 }}>
            Plan de Implementación
          </div>
        </div>

        {/* Navigation */}
        <nav style={{ padding: '12px 8px' }}>
          {[...SECTIONS, ...extraSections].map(s => (
            <button
              key={s.id}
              onClick={() => onNavigate(s.id)}
              style={{
                display: 'block',
                width: '100%',
                textAlign: 'left',
                padding: '8px 12px',
                borderRadius: 6,
                border: 'none',
                cursor: 'pointer',
                background: active === s.id ? T.accent + '22' : 'transparent',
                color: active === s.id ? T.accentHover : T.muted,
                fontSize: 13,
                fontWeight: active === s.id ? 600 : 400,
                marginBottom: 2,
                transition: 'all 0.1s',
                borderLeft: active === s.id
                  ? `2px solid ${T.accent}`
                  : '2px solid transparent',
              }}
            >
              {s.label}
            </button>
          ))}
        </nav>

        {/* Runtime model notice */}
        <div style={{
          padding: '12px 16px',
          borderTop: `1px solid ${T.border}`,
          marginTop: 12,
        }}>
          <div style={{ color: T.muted, fontSize: 11, lineHeight: 1.5 }}>
            <div style={{ marginBottom: 4, color: '#fcd34d', fontWeight: 600 }}>
              ⚠️ Runtime Model
            </div>
            <code style={{ color: T.accentHover, fontSize: 10 }}>
              openai-codex/<br />gpt-5.1-codex-mini
            </code>
          </div>
        </div>
      </aside>

      {/* Main content area */}
      <main style={{
        flex: 1,
        padding: '32px 40px',
        maxWidth: 900,
        overflowY: 'auto',
      }}>
        {children}
      </main>
    </div>
  )
}
