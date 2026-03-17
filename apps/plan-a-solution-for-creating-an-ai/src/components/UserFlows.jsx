import React from 'react'
import { USER_FLOWS } from '../data/plan.js'

export default function UserFlows() {
  return (
    <section>
      <h2 style={s.h2}>Flujos de Usuario</h2>
      <p style={s.lead}>Los tres flujos principales que el sistema debe soportar de extremo a extremo.</p>

      <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
        {USER_FLOWS.map(flow => (
          <div key={flow.title} style={{ ...s.flowBox, borderLeftColor: flow.color }}>
            <div style={{ ...s.flowTitle, color: flow.color }}>{flow.title}</div>
            <div style={s.steps}>
              {flow.steps.map((step, i) => (
                <div key={i} style={s.step}>
                  <div style={{ ...s.dot, background: flow.color }} />
                  <div style={s.stepText}>{step}</div>
                  {i < flow.steps.length - 1 && <div style={{ ...s.connector, background: flow.color + '40' }} />}
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>
    </section>
  )
}

const s = {
  h2: { fontSize: 22, color: '#f1f5f9', margin: '0 0 0.5rem' },
  lead: { color: '#94a3b8', fontSize: 14, marginBottom: '2rem' },
  flowBox: {
    background: '#1e293b',
    border: '1px solid #334155',
    borderLeft: '4px solid',
    borderRadius: 8,
    padding: '1.25rem',
  },
  flowTitle: { fontSize: 15, fontWeight: 700, marginBottom: '1rem' },
  steps: { display: 'flex', flexDirection: 'column', gap: 0 },
  step: { display: 'flex', alignItems: 'flex-start', gap: 12, position: 'relative', paddingBottom: 12 },
  dot: {
    width: 10,
    height: 10,
    borderRadius: '50%',
    flexShrink: 0,
    marginTop: 4,
    position: 'relative',
    zIndex: 1,
  },
  connector: {
    position: 'absolute',
    left: 4,
    top: 14,
    width: 2,
    bottom: 0,
  },
  stepText: { color: '#cbd5e1', fontSize: 13, lineHeight: 1.6 },
}
