import React from 'react'
import { OVERVIEW } from '../data/plan.js'

export default function Overview() {
  return (
    <section>
      <h2 style={styles.h2}>{OVERVIEW.title}</h2>
      <p style={styles.subtitle}>{OVERVIEW.subtitle}</p>

      <div style={styles.modelBanner}>
        {OVERVIEW.model_note}
      </div>

      <p style={styles.desc}>{OVERVIEW.description}</p>

      <h3 style={styles.h3}>Características Principales</h3>
      <div style={styles.grid}>
        {OVERVIEW.highlights.map(h => (
          <div key={h.label} style={styles.card}>
            <div style={styles.cardTitle}>{h.label}</div>
            <div style={styles.cardDesc}>{h.desc}</div>
          </div>
        ))}
      </div>
    </section>
  )
}

const styles = {
  h2: { fontSize: 24, color: '#f1f5f9', margin: '0 0 0.5rem' },
  subtitle: { color: '#94a3b8', margin: '0 0 1.5rem', fontSize: 15 },
  modelBanner: {
    background: '#422006',
    border: '1px solid #854d0e',
    color: '#fef3c7',
    padding: '0.75rem 1rem',
    borderRadius: 8,
    fontSize: 13,
    marginBottom: '1.5rem',
  },
  desc: { color: '#cbd5e1', fontSize: 14, lineHeight: 1.7, margin: '0 0 2rem' },
  h3: { fontSize: 16, color: '#94a3b8', marginBottom: '1rem', textTransform: 'uppercase', letterSpacing: 0.5 },
  grid: { display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(240px, 1fr))', gap: '1rem' },
  card: {
    background: '#1e293b',
    border: '1px solid #334155',
    borderRadius: 8,
    padding: '1rem',
  },
  cardTitle: { color: '#38bdf8', fontSize: 14, fontWeight: 600, marginBottom: 6 },
  cardDesc: { color: '#94a3b8', fontSize: 13, lineHeight: 1.5 },
}
