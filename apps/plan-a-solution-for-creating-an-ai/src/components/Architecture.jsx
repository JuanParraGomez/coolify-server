import React from 'react'
import { ARCHITECTURE } from '../data/plan.js'

export default function Architecture() {
  return (
    <section>
      <h2 style={s.h2}>Arquitectura del Sistema</h2>
      <p style={s.lead}>Diseño en capas con LangGraph como motor de orquestación y FastAPI como gateway REST tipado.</p>

      <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem', marginBottom: '2.5rem' }}>
        {ARCHITECTURE.layers.map(layer => (
          <div key={layer.name} style={{ ...s.layer, borderLeftColor: layer.color }}>
            <div style={{ ...s.layerTitle, color: layer.color }}>{layer.name}</div>
            <ul style={s.ul}>
              {layer.items.map(item => (
                <li key={item} style={s.li}>{item}</li>
              ))}
            </ul>
          </div>
        ))}
      </div>

      <h3 style={s.h3}>Flujo de Datos</h3>
      <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
        {ARCHITECTURE.dataFlow.map((step, i) => (
          <div key={i} style={s.flowStep}>
            <span style={s.stepNum}>{i + 1}</span>
            <span style={s.stepText}>{step}</span>
          </div>
        ))}
      </div>
    </section>
  )
}

const s = {
  h2: { fontSize: 22, color: '#f1f5f9', margin: '0 0 0.5rem' },
  lead: { color: '#94a3b8', fontSize: 14, marginBottom: '2rem' },
  h3: { fontSize: 15, color: '#94a3b8', textTransform: 'uppercase', letterSpacing: 0.5, marginBottom: '1rem' },
  layer: {
    background: '#1e293b',
    border: '1px solid #334155',
    borderLeft: '4px solid #3b82f6',
    borderRadius: 8,
    padding: '1rem 1.25rem',
  },
  layerTitle: { fontSize: 14, fontWeight: 700, marginBottom: 8 },
  ul: { margin: 0, paddingLeft: 18 },
  li: { color: '#cbd5e1', fontSize: 13, lineHeight: 1.7 },
  flowStep: {
    display: 'flex',
    alignItems: 'flex-start',
    gap: 12,
    background: '#1e293b',
    border: '1px solid #334155',
    borderRadius: 6,
    padding: '0.6rem 1rem',
  },
  stepNum: {
    background: '#334155',
    color: '#94a3b8',
    borderRadius: '50%',
    width: 22,
    height: 22,
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    fontSize: 11,
    fontWeight: 700,
    flexShrink: 0,
    lineHeight: '22px',
    textAlign: 'center',
  },
  stepText: { color: '#cbd5e1', fontSize: 13, lineHeight: 1.6 },
}
