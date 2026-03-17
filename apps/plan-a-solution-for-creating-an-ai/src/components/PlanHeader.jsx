import React from 'react'

export default function PlanHeader() {
  return (
    <header style={styles.header}>
      <div style={styles.badge}>⚠️ Modelo runtime: <strong>openai-codex / gpt-5.1-codex-mini</strong> — difiere del modelo de desarrollo (claude-sonnet-4-6)</div>
      <h1 style={styles.title}>🤖 Plan de Implementación: AI Sales Assistant Agent</h1>
      <p style={styles.subtitle}>
        Asistente de ventas con IA que genera leads vía extensión de navegador, notifica respuestas
        y redacta replies. Incluye investigación social de decisores y configuración multi-proveedor de IA.
      </p>
      <div style={styles.meta}>
        <span style={styles.tag}>React 18 + Vite</span>
        <span style={styles.tag}>FastAPI + LangGraph</span>
        <span style={styles.tag}>Chrome Extension MV3</span>
        <span style={styles.tag}>Multi-LLM</span>
        <span style={styles.tag}>PostgreSQL + pgvector</span>
        <span style={{ ...styles.tag, background: '#fef3c7', color: '#92400e' }}>~15 semanas</span>
      </div>
    </header>
  )
}

const styles = {
  header: { background: 'linear-gradient(135deg, #1e1b4b 0%, #312e81 100%)', color: '#fff', padding: '2rem', borderRadius: '12px', marginBottom: '1.5rem' },
  badge: { background: '#fef3c7', color: '#92400e', padding: '0.5rem 1rem', borderRadius: '6px', fontSize: '0.8rem', marginBottom: '1rem', display: 'inline-block' },
  title: { fontSize: '1.8rem', fontWeight: 700, margin: '0.5rem 0', lineHeight: 1.2 },
  subtitle: { color: '#c7d2fe', margin: '0.5rem 0 1rem', lineHeight: 1.6, maxWidth: '800px' },
  meta: { display: 'flex', gap: '0.5rem', flexWrap: 'wrap' },
  tag: { background: 'rgba(255,255,255,0.15)', padding: '0.25rem 0.75rem', borderRadius: '999px', fontSize: '0.78rem', fontWeight: 500 },
}
