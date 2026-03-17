import React, { useState } from 'react'
import { SCREENS } from '../data/plan.js'

export default function Screens() {
  const [expanded, setExpanded] = useState(SCREENS[0].id)

  return (
    <section>
      <h2 style={s.h2}>Pantallas & Jerarquía de Navegación</h2>
      <p style={s.lead}>6 pantallas principales con navegación lateral. Estrategia de datos: REST con clientes tipados.</p>

      <div style={s.navHierarchy}>
        <div style={s.navLabel}>Navegación Principal</div>
        <div style={s.navItems}>
          {SCREENS.map((sc, i) => (
            <React.Fragment key={sc.id}>
              <span
                style={{ ...s.navItem, background: expanded === sc.id ? '#1e40af' : '#1e293b', cursor: 'pointer' }}
                onClick={() => setExpanded(sc.id)}
              >
                {sc.path}
              </span>
              {i < SCREENS.length - 1 && <span style={{ color: '#475569' }}> → </span>}
            </React.Fragment>
          ))}
        </div>
      </div>

      <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
        {SCREENS.map(sc => (
          <div
            key={sc.id}
            style={{ ...s.screen, borderColor: expanded === sc.id ? '#3b82f6' : '#334155' }}
          >
            <button
              style={s.screenHeader}
              onClick={() => setExpanded(expanded === sc.id ? null : sc.id)}
            >
              <span style={s.screenTitle}>{sc.title}</span>
              <span style={{ ...s.path, marginLeft: 'auto' }}>{sc.path}</span>
              <span style={{ color: '#64748b', fontSize: 12, marginLeft: 8 }}>
                {expanded === sc.id ? '▲' : '▼'}
              </span>
            </button>
            {expanded === sc.id && (
              <div style={s.screenBody}>
                <p style={s.screenDesc}>{sc.description}</p>
                <div style={s.childGrid}>
                  {sc.children.map(c => (
                    <div key={c.name} style={s.child}>
                      <div style={s.childName}>{c.name}</div>
                      <div style={s.childDesc}>{c.desc}</div>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        ))}
      </div>
    </section>
  )
}

const s = {
  h2: { fontSize: 22, color: '#f1f5f9', margin: '0 0 0.5rem' },
  lead: { color: '#94a3b8', fontSize: 14, marginBottom: '1.5rem' },
  navHierarchy: {
    background: '#0f172a',
    border: '1px solid #1e293b',
    borderRadius: 8,
    padding: '0.75rem 1rem',
    marginBottom: '1.5rem',
  },
  navLabel: { fontSize: 10, color: '#64748b', textTransform: 'uppercase', letterSpacing: 1, marginBottom: 8 },
  navItems: { display: 'flex', flexWrap: 'wrap', alignItems: 'center', gap: 4 },
  navItem: {
    padding: '2px 8px',
    borderRadius: 4,
    fontSize: 11,
    color: '#94a3b8',
    fontFamily: 'monospace',
  },
  screen: {
    background: '#1e293b',
    border: '1px solid #334155',
    borderRadius: 8,
    overflow: 'hidden',
    transition: 'border-color 0.15s',
  },
  screenHeader: {
    display: 'flex',
    alignItems: 'center',
    gap: 8,
    width: '100%',
    padding: '0.9rem 1.25rem',
    background: 'transparent',
    border: 'none',
    cursor: 'pointer',
    textAlign: 'left',
  },
  screenTitle: { color: '#e2e8f0', fontSize: 14, fontWeight: 600 },
  path: { color: '#38bdf8', fontSize: 11, fontFamily: 'monospace', background: '#0f172a', padding: '2px 6px', borderRadius: 4 },
  screenBody: { padding: '0 1.25rem 1.25rem', borderTop: '1px solid #334155' },
  screenDesc: { color: '#94a3b8', fontSize: 13, margin: '1rem 0' },
  childGrid: { display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(220px, 1fr))', gap: 8 },
  child: { background: '#0f172a', borderRadius: 6, padding: '0.75rem', border: '1px solid #334155' },
  childName: { color: '#7dd3fc', fontSize: 12, fontWeight: 600, marginBottom: 4 },
  childDesc: { color: '#64748b', fontSize: 12, lineHeight: 1.5 },
}
