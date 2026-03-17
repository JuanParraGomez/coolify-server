import React from 'react'
import { TECH_STACK } from '../data/plan.js'

export default function TechStack() {
  return (
    <section>
      <h2 style={s.h2}>Stack Tecnológico</h2>
      <p style={s.lead}>
        Selección tecnológica balanceando velocidad de desarrollo, costo operativo y escalabilidad.
        El modelo de runtime por defecto es{' '}
        <strong style={{ color: '#fbbf24' }}>openai-codex/gpt-5.1-codex-mini</strong> —
        diferente al modelo de generación de este plan.
      </p>

      <div style={s.grid}>
        {TECH_STACK.map(cat => (
          <div key={cat.category} style={{ ...s.catBox, borderTopColor: cat.color }}>
            <div style={{ ...s.catTitle, color: cat.color }}>{cat.category}</div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
              {cat.items.map(item => (
                <div key={item.name} style={s.item}>
                  <div style={s.itemName}>{item.name}</div>
                  <div style={s.itemReason}>{item.reason}</div>
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
  lead: { color: '#94a3b8', fontSize: 14, marginBottom: '2rem', lineHeight: 1.6 },
  grid: { display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(290px, 1fr))', gap: '1rem' },
  catBox: {
    background: '#1e293b',
    border: '1px solid #334155',
    borderTop: '3px solid',
    borderRadius: 8,
    padding: '1rem',
  },
  catTitle: { fontSize: 13, fontWeight: 700, textTransform: 'uppercase', letterSpacing: 0.5, marginBottom: '0.75rem' },
  item: {
    background: '#0f172a',
    borderRadius: 6,
    padding: '0.5rem 0.75rem',
    border: '1px solid #1e293b',
  },
  itemName: { color: '#e2e8f0', fontSize: 13, fontWeight: 600, marginBottom: 2 },
  itemReason: { color: '#64748b', fontSize: 12, lineHeight: 1.4 },
}
