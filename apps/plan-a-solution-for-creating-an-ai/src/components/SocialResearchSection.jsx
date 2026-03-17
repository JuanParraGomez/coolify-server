import React, { useState } from 'react'
import { MOCK_SOCIAL_PROFILES } from '../data/mockData'

export default function SocialResearchSection() {
  const [selected, setSelected] = useState(0)
  const profile = MOCK_SOCIAL_PROFILES[selected]

  return (
    <section style={styles.section}>
      <h2 style={styles.h2}>🔍 Investigación Social de Decisores (OSINT)</h2>
      <p style={styles.desc}>
        Antes de una entrevista o contacto, el sistema analiza el perfil público del decisor: publicaciones recientes,
        intereses declarados, señales de compra y estructuración de argumentos de venta.
      </p>

      <div style={styles.grid}>
        {/* Selector de perfil */}
        <div style={styles.sidebar}>
          <h3 style={styles.h3}>Perfiles de demo</h3>
          {MOCK_SOCIAL_PROFILES.map((p, i) => (
            <div
              key={i}
              style={{ ...styles.profileBtn, background: selected === i ? '#eff6ff' : '#fff', borderColor: selected === i ? '#3b82f6' : '#e5e7eb' }}
              onClick={() => setSelected(i)}
            >
              <div style={{ fontWeight: 600, fontSize: '0.9rem', color: '#111827' }}>{p.nombre}</div>
              <div style={{ fontSize: '0.78rem', color: '#6b7280' }}>{p.cargo} · {p.empresa}</div>
            </div>
          ))}
          <div style={styles.endpointBox}>
            <span style={styles.endpointLabel}>Endpoint</span>
            <code style={styles.endpoint}>POST /api/v1/leads/:id/investigar</code>
          </div>
        </div>

        {/* Detalle del perfil */}
        <div style={styles.detail}>
          <div style={styles.profileHeader}>
            <div style={styles.avatar}>{profile.nombre[0]}</div>
            <div>
              <h3 style={{ margin: 0, fontSize: '1.1rem' }}>{profile.nombre}</h3>
              <span style={styles.subtitle}>{profile.cargo} · {profile.empresa}</span>
            </div>
          </div>

          <div style={styles.platformGrid}>
            <PlatformCard platform="LinkedIn" icon="in" color="#0077b5" data={profile.linkedin} />
            <PlatformCard platform="Twitter / X" icon="𝕏" color="#000" data={profile.twitter} />
          </div>

          <div style={styles.triggersCard}>
            <h4 style={styles.cardTitle}>🎯 Señales de compra detectadas</h4>
            {profile.triggers.map((t, i) => (
              <div key={i} style={styles.trigger}>{t}</div>
            ))}
          </div>

          <div style={styles.insightGrid}>
            <div style={styles.insightCard}>
              <div style={styles.insightLabel}>Perfil de comprador</div>
              <p style={styles.insightText}>{profile.perfil_compra}</p>
            </div>
            <div style={{ ...styles.insightCard, background: '#ecfdf5', borderColor: '#a7f3d0' }}>
              <div style={{ ...styles.insightLabel, color: '#065f46' }}>Mejor ángulo de venta</div>
              <p style={{ ...styles.insightText, color: '#065f46' }}>{profile.mejor_angulo}</p>
            </div>
          </div>
        </div>
      </div>

      <div style={styles.riskBox}>
        <strong>⚠️ Riesgos de esta fase (Alto):</strong> Rate limiting de LinkedIn/Twitter, bloqueo de IPs,
        términos de servicio. Mitigación: usar APIs oficiales donde existan, proxies rotativos para scraping público,
        y cache agresivo para no repetir consultas.
      </div>
    </section>
  )
}

function PlatformCard({ platform, icon, color, data }) {
  return (
    <div style={{ ...styles.platCard, borderTop: `3px solid ${color}` }}>
      <div style={styles.platHeader}>
        <span style={{ ...styles.platIcon, background: color }}>{icon}</span>
        <strong style={{ fontSize: '0.9rem' }}>{platform}</strong>
        <span style={styles.followers}>{(data.seguidores || 0).toLocaleString()} seguidores</span>
      </div>
      <div style={styles.intereses}>
        {(data.intereses || []).map((int, i) => <span key={i} style={styles.interesChip}>{int}</span>)}
      </div>
      <div style={styles.recentPosts}>
        {(data.posts_recientes || data.tweets_recientes || []).map((p, i) => (
          <div key={i} style={styles.post}>📌 {p}</div>
        ))}
      </div>
    </div>
  )
}

const styles = {
  section: { background: '#fff', borderRadius: '12px', padding: '1.5rem', marginBottom: '1.5rem', boxShadow: '0 1px 3px rgba(0,0,0,0.08)' },
  h2: { fontSize: '1.3rem', fontWeight: 700, marginTop: 0, marginBottom: '0.5rem', color: '#111827' },
  h3: { fontSize: '0.9rem', fontWeight: 700, color: '#374151', margin: '0 0 0.75rem' },
  desc: { color: '#6b7280', fontSize: '0.88rem', marginBottom: '1.25rem', lineHeight: 1.6 },
  grid: { display: 'grid', gridTemplateColumns: '220px 1fr', gap: '1.25rem', marginBottom: '1rem' },
  sidebar: { display: 'flex', flexDirection: 'column', gap: '0.5rem' },
  profileBtn: { border: '1px solid', borderRadius: '8px', padding: '0.75rem', cursor: 'pointer', transition: 'all 0.15s' },
  endpointBox: { marginTop: 'auto', background: '#f1f5f9', borderRadius: '6px', padding: '0.6rem', marginTop: '0.5rem' },
  endpointLabel: { display: 'block', fontSize: '0.65rem', color: '#64748b', fontWeight: 600, textTransform: 'uppercase', marginBottom: '0.25rem' },
  endpoint: { fontSize: '0.7rem', color: '#0f172a', wordBreak: 'break-all', fontFamily: 'monospace' },
  detail: { display: 'flex', flexDirection: 'column', gap: '1rem' },
  profileHeader: { display: 'flex', alignItems: 'center', gap: '0.875rem' },
  avatar: { width: 44, height: 44, borderRadius: '50%', background: '#6366f1', color: '#fff', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 700, fontSize: '1.2rem', flexShrink: 0 },
  subtitle: { color: '#6b7280', fontSize: '0.83rem' },
  platformGrid: { display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.75rem' },
  platCard: { border: '1px solid #e5e7eb', borderRadius: '8px', padding: '0.875rem' },
  platHeader: { display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.5rem' },
  platIcon: { width: 22, height: 22, borderRadius: '4px', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#fff', fontSize: '0.7rem', fontWeight: 700, flexShrink: 0, textAlign: 'center', lineHeight: '22px' },
  followers: { marginLeft: 'auto', fontSize: '0.72rem', color: '#9ca3af' },
  intereses: { display: 'flex', flexWrap: 'wrap', gap: '0.3rem', marginBottom: '0.5rem' },
  interesChip: { background: '#ede9fe', color: '#5b21b6', padding: '0.1rem 0.4rem', borderRadius: '4px', fontSize: '0.7rem', fontWeight: 500 },
  recentPosts: { display: 'flex', flexDirection: 'column', gap: '0.25rem' },
  post: { fontSize: '0.75rem', color: '#374151', lineHeight: 1.5 },
  triggersCard: { background: '#fffbeb', border: '1px solid #fde68a', borderRadius: '8px', padding: '0.875rem' },
  cardTitle: { margin: '0 0 0.625rem', fontSize: '0.88rem', color: '#92400e' },
  trigger: { background: '#fef3c7', color: '#78350f', padding: '0.3rem 0.6rem', borderRadius: '5px', fontSize: '0.8rem', marginBottom: '0.35rem' },
  insightGrid: { display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.75rem' },
  insightCard: { background: '#f0f9ff', border: '1px solid #bae6fd', borderRadius: '8px', padding: '0.875rem' },
  insightLabel: { fontSize: '0.72rem', fontWeight: 700, color: '#0369a1', textTransform: 'uppercase', letterSpacing: '0.05em', marginBottom: '0.4rem' },
  insightText: { margin: 0, fontSize: '0.83rem', color: '#0c4a6e', lineHeight: 1.6 },
  riskBox: { background: '#fef2f2', border: '1px solid #fca5a5', borderRadius: '8px', padding: '0.875rem', fontSize: '0.82rem', color: '#7f1d1d', lineHeight: 1.6 },
}
