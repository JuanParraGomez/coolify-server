import React, { useState } from 'react'

const LAYERS = [
  {
    nombre: 'Capa de Presentación',
    color: '#3b82f6',
    componentes: ['Dashboard React (Leads, Analytics, Config)', 'Chrome Extension MV3 (Chat flotante)', 'Notificaciones Push / Badge'],
    descripcion: 'El usuario interactúa desde el dashboard web o la extensión del navegador. La extensión inyecta un widget de chat en cualquier página (LinkedIn, correo, etc.) y captura la conversación con el lead.',
  },
  {
    nombre: 'API Gateway / BFF',
    color: '#8b5cf6',
    componentes: ['FastAPI REST (v1/leads, v1/ia, v1/config)', 'WebSocket endpoint (notificaciones real-time)', 'JWT Auth middleware', 'Rate limiting por proveedor IA'],
    descripcion: 'Capa intermedia que centraliza autenticación, routing y rate limiting. Expone endpoints tipados con esquemas Pydantic que sirven como contratos de datos con el frontend.',
  },
  {
    nombre: 'Motor de IA (LangGraph)',
    color: '#10b981',
    componentes: ['Agente de generación de respuestas', 'Agente de investigación social (OSINT)', 'RAG: contexto por lead (pgvector)', 'Router multi-proveedor (OpenAI/Gemini/Claude/Deepseek)'],
    descripcion: 'El corazón del sistema. LangGraph orquesta agentes con estado. El agente de ventas usa RAG para incluir historial del lead. El agente OSINT consulta fuentes externas y sintetiza un perfil de comprador.',
  },
  {
    nombre: 'Servicios de Background',
    color: '#f59e0b',
    componentes: ['Celery Workers (scraping, embeddings)', 'Redis (queue, cache de sesiones)', 'Scheduler (polling de respuestas)', 'Webhooks salientes (Slack, email)'],
    descripcion: 'Tareas asíncronas que no bloquean la API. El scraper de LinkedIn/Twitter corre como tarea Celery. El scheduler detecta nuevas respuestas de leads y dispara notificaciones.',
  },
  {
    nombre: 'Persistencia',
    color: '#ef4444',
    componentes: ['PostgreSQL (leads, conversaciones, usuarios)', 'pgvector (embeddings de leads)', 'Redis (cache L2, sesiones)', 'Vault / env cifrados (API keys)'],
    descripcion: 'PostgreSQL es la fuente de verdad. pgvector almacena embeddings para búsqueda semántica de contexto. Las API keys se cifran con AES-256 antes de persistir.',
  },
]

export default function ArchitectureSection() {
  const [expanded, setExpanded] = useState(null)

  return (
    <section style={styles.section}>
      <h2 style={styles.h2}>🏗️ Arquitectura del Sistema</h2>
      <p style={styles.desc}>Click en cada capa para ver detalles de implementación.</p>
      <div style={styles.layers}>
        {LAYERS.map((layer, i) => (
          <div
            key={i}
            style={{ ...styles.layer, borderLeft: `4px solid ${layer.color}`, background: expanded === i ? '#f8fafc' : '#fff' }}
            onClick={() => setExpanded(expanded === i ? null : i)}
          >
            <div style={styles.layerHeader}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                <div style={{ ...styles.dot, background: layer.color }} />
                <strong style={{ fontSize: '1rem' }}>{layer.nombre}</strong>
              </div>
              <div style={styles.chips}>
                {layer.componentes.map((c, j) => (
                  <span key={j} style={{ ...styles.chip, background: layer.color + '15', color: layer.color }}>{c}</span>
                ))}
              </div>
            </div>
            {expanded === i && (
              <div style={styles.layerDetail}>
                <p style={{ margin: 0, lineHeight: 1.7, color: '#374151' }}>{layer.descripcion}</p>
              </div>
            )}
          </div>
        ))}
      </div>
      <div style={styles.flowDiagram}>
        <h3 style={styles.h3}>Flujo principal de datos</h3>
        <div style={styles.flow}>
          {['Lead en LinkedIn', '→', 'Extension captura', '→', 'POST /leads', '→', 'LangGraph genera reply', '→', 'WebSocket notifica', '→', 'Dashboard muestra'].map((step, i) => (
            <span key={i} style={step === '→' ? styles.arrow : styles.flowStep}>{step}</span>
          ))}
        </div>
      </div>
    </section>
  )
}

const styles = {
  section: { background: '#fff', borderRadius: '12px', padding: '1.5rem', marginBottom: '1.5rem', boxShadow: '0 1px 3px rgba(0,0,0,0.08)' },
  h2: { fontSize: '1.3rem', fontWeight: 700, marginTop: 0, marginBottom: '0.5rem', color: '#111827' },
  h3: { fontSize: '1rem', fontWeight: 600, margin: '1.25rem 0 0.75rem', color: '#374151' },
  desc: { color: '#6b7280', fontSize: '0.9rem', marginBottom: '1rem' },
  layers: { display: 'flex', flexDirection: 'column', gap: '0.5rem' },
  layer: { borderRadius: '8px', padding: '0.875rem 1rem', cursor: 'pointer', transition: 'background 0.15s', border: '1px solid #e5e7eb' },
  layerHeader: { display: 'flex', alignItems: 'flex-start', gap: '1rem', flexWrap: 'wrap' },
  dot: { width: 12, height: 12, borderRadius: '50%', flexShrink: 0, marginTop: 3 },
  chips: { display: 'flex', gap: '0.4rem', flexWrap: 'wrap', flex: 1 },
  chip: { fontSize: '0.72rem', padding: '0.15rem 0.5rem', borderRadius: '999px', fontWeight: 500 },
  layerDetail: { marginTop: '0.75rem', paddingTop: '0.75rem', borderTop: '1px solid #e5e7eb' },
  flowDiagram: { background: '#f1f5f9', borderRadius: '8px', padding: '1rem', marginTop: '1.25rem' },
  flow: { display: 'flex', alignItems: 'center', gap: '0.5rem', flexWrap: 'wrap' },
  flowStep: { background: '#fff', border: '1px solid #cbd5e1', borderRadius: '6px', padding: '0.4rem 0.75rem', fontSize: '0.82rem', fontWeight: 500, color: '#1e293b' },
  arrow: { color: '#94a3b8', fontWeight: 700, fontSize: '1.1rem' },
}
