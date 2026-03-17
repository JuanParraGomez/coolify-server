import React from 'react'

const RISKS = [
  { nivel: 'Alto', area: 'OSINT / Scraping', riesgo: 'LinkedIn y Twitter bloquean IPs de scrapers. ToS restrictivos.', mitigacion: 'Usar APIs oficiales (LinkedIn API, Twitter v2). Proxies residenciales para scraping público. Cache 24h para no repetir. Rate limiting automático.' },
  { nivel: 'Alto', area: 'Motor IA multi-proveedor', riesgo: 'Cada proveedor tiene latencias, costos y formatos distintos. Cambios de API rompen el agente.', mitigacion: 'Abstracción LangChain con interfaz común. Versionar endpoints de cada proveedor. Circuit breaker con fallback automático.' },
  { nivel: 'Medio', area: 'Extensión Chrome MV3', riesgo: 'MV3 elimina background pages persistentes. Límites en content scripts.', mitigacion: 'Service Worker para la extensión. Polling con alarms API. Almacenamiento local con chrome.storage.' },
  { nivel: 'Medio', area: 'Notificaciones en tiempo real', riesgo: 'WebSockets pueden caerse. El usuario puede no tener el dashboard abierto.', mitigacion: 'Reconexión automática con backoff. Push notifications web como fallback. Alertas por email/Slack via webhook.' },
  { nivel: 'Medio', area: 'Seguridad API keys', riesgo: 'Las API keys son activos críticos. Si se filtran, costo ilimitado para el usuario.', mitigacion: 'AES-256 en reposo. Nunca en logs ni Sentry. Rotación forzada periódica. Alertas de uso anómalo.' },
  { nivel: 'Bajo', area: 'Escalabilidad', riesgo: 'A partir de 1000 leads, consultas lentas sin índices.', mitigacion: 'Índices en PostgreSQL (estado, canal, score). Paginación cursor-based. Caché Redis para queries frecuentes.' },
]

const NIVEL_STYLE = {
  Alto: { bg: '#fef2f2', color: '#7f1d1d', border: '#fca5a5' },
  Medio: { bg: '#fffbeb', color: '#78350f', border: '#fde68a' },
  Bajo: { bg: '#ecfdf5', color: '#065f46', border: '#a7f3d0' },
}

export default function RisksSection() {
  return (
    <section style={styles.section}>
      <h2 style={styles.h2}>⚠️ Riesgos & Mitigaciones</h2>
      <div style={styles.grid}>
        {RISKS.map((r, i) => {
          const s = NIVEL_STYLE[r.nivel]
          return (
            <div key={i} style={{ ...styles.card, borderTop: `3px solid ${s.border}`, background: s.bg }}>
              <div style={styles.cardHeader}>
                <span style={{ ...styles.badge, color: s.color, background: s.border + '50' }}>{r.nivel}</span>
                <strong style={{ fontSize: '0.88rem', color: '#111827' }}>{r.area}</strong>
              </div>
              <p style={styles.riskText}>🔴 {r.riesgo}</p>
              <p style={styles.mitigText}>✅ {r.mitigacion}</p>
            </div>
          )
        })}
      </div>
    </section>
  )
}

const styles = {
  section: { background: '#fff', borderRadius: '12px', padding: '1.5rem', marginBottom: '1.5rem', boxShadow: '0 1px 3px rgba(0,0,0,0.08)' },
  h2: { fontSize: '1.3rem', fontWeight: 700, marginTop: 0, marginBottom: '1rem', color: '#111827' },
  grid: { display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '0.75rem' },
  card: { border: '1px solid #e5e7eb', borderRadius: '8px', padding: '0.875rem' },
  cardHeader: { display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.5rem' },
  badge: { fontSize: '0.7rem', fontWeight: 700, padding: '0.1rem 0.5rem', borderRadius: '4px' },
  riskText: { margin: '0 0 0.5rem', fontSize: '0.8rem', color: '#374151', lineHeight: 1.5 },
  mitigText: { margin: 0, fontSize: '0.8rem', color: '#374151', lineHeight: 1.5 },
}
