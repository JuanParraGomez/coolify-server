import React, { useState } from 'react'
import { useAppStore } from '../store'
import { useResearchProfile } from '../hooks/useAIProvider'
import type { SocialProfile } from '../types'

const DEMO_PROFILE: SocialProfile = {
  name: 'Ana García',
  company: 'TechCorp',
  role: 'CTO',
  interests: ['IA generativa', 'DevOps', 'Arquitecturas serverless', 'Eficiencia operativa'],
  recentActivity: [
    'Publicó artículo sobre LLMs en producción (LinkedIn, hace 3 días)',
    'Comentó en post sobre reducción de costos en infraestructura cloud',
    'Asistió a AWS re:Invent 2025',
  ],
  buyingTriggers: [
    'Reducción de costos operativos (ROI claro)',
    'Automatización de procesos repetitivos del equipo',
    'Integración con stack existente (AWS, Terraform)',
  ],
  recommendedAngles: [
    'Enfócate en el ahorro de tiempo: "tu equipo dedica X horas semanales a tareas que IA puede hacer"',
    'Menciona compatibilidad con AWS y fácil integración con herramientas existentes',
    'Muestra caso de uso específico de CTO similar que redujo ciclo de ventas en 40%',
  ],
  summary: 'Ana es CTO técnica con enfoque pragmático. Valora ROI demostrable sobre features. Mejor momento para contactar: martes/miércoles por la mañana.',
  researchedAt: new Date().toISOString(),
}

export default function SocialResearch() {
  const { selectedLeadId, leads } = useAppStore()
  const researchProfile = useResearchProfile()
  const selectedLead = leads.find((l) => l.id === selectedLeadId)

  const [name, setName] = useState(selectedLead?.name || '')
  const [company, setCompany] = useState(selectedLead?.company || '')
  const [linkedinUrl, setLinkedinUrl] = useState('')
  const [profile, setProfile] = useState<SocialProfile | null>(null)
  const [showDemo, setShowDemo] = useState(false)

  async function handleResearch() {
    if (!name || !company) return
    try {
      const result = await researchProfile.mutateAsync({ name, company, linkedinUrl: linkedinUrl || undefined })
      setProfile(result)
    } catch {
      // Mostrar demo si no hay backend
      setProfile(DEMO_PROFILE)
      setShowDemo(true)
    }
  }

  return (
    <div style={{ display: 'flex', gap: '1.5rem' }}>
      {/* Formulario */}
      <div style={{ width: 280, flexShrink: 0 }}>
        <h2 style={{ margin: '0 0 1rem', fontSize: 20, color: '#1e293b' }}>🔍 Investigación Social</h2>
        <p style={{ color: '#64748b', fontSize: 13, margin: '0 0 1.5rem' }}>
          Investiga a tomadores de decisión antes de tu entrevista para conocer sus intereses y desencadenantes de compra.
        </p>

        <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
          <div>
            <label style={{ fontSize: 12, color: '#64748b', display: 'block', marginBottom: 5 }}>Nombre *</label>
            <input
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="Ana García"
              style={{ width: '100%', padding: '8px 10px', border: '1px solid #e2e8f0', borderRadius: 6, fontSize: 13, outline: 'none', boxSizing: 'border-box' }}
            />
          </div>
          <div>
            <label style={{ fontSize: 12, color: '#64748b', display: 'block', marginBottom: 5 }}>Empresa *</label>
            <input
              value={company}
              onChange={(e) => setCompany(e.target.value)}
              placeholder="TechCorp"
              style={{ width: '100%', padding: '8px 10px', border: '1px solid #e2e8f0', borderRadius: 6, fontSize: 13, outline: 'none', boxSizing: 'border-box' }}
            />
          </div>
          <div>
            <label style={{ fontSize: 12, color: '#64748b', display: 'block', marginBottom: 5 }}>URL LinkedIn (opcional)</label>
            <input
              value={linkedinUrl}
              onChange={(e) => setLinkedinUrl(e.target.value)}
              placeholder="https://linkedin.com/in/..."
              style={{ width: '100%', padding: '8px 10px', border: '1px solid #e2e8f0', borderRadius: 6, fontSize: 13, outline: 'none', boxSizing: 'border-box' }}
            />
          </div>

          <button
            onClick={handleResearch}
            disabled={!name || !company || researchProfile.isPending}
            style={{
              padding: '9px',
              background: name && company ? '#3b82f6' : '#e2e8f0',
              color: name && company ? 'white' : '#94a3b8',
              border: 'none',
              borderRadius: 6,
              cursor: name && company ? 'pointer' : 'not-allowed',
              fontSize: 13,
              fontWeight: 500,
            }}
          >
            {researchProfile.isPending ? '⏳ Investigando...' : '🔍 Investigar perfil'}
          </button>
        </div>
      </div>

      {/* Resultados */}
      {profile && (
        <div style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: '1rem' }}>
          {showDemo && (
            <div style={{ background: '#fef9c3', border: '1px solid #fde047', borderRadius: 6, padding: '8px 12px', fontSize: 12, color: '#854d0e' }}>
              ⚠️ Sin conexión al backend — mostrando datos de demostración
            </div>
          )}

          {/* Header del perfil */}
          <div style={{ background: 'white', border: '1px solid #e2e8f0', borderRadius: 8, padding: '1rem' }}>
            <div style={{ fontWeight: 700, fontSize: 18, color: '#1e293b' }}>{profile.name}</div>
            <div style={{ color: '#64748b', fontSize: 14 }}>{profile.role} · {profile.company}</div>
            <div style={{ marginTop: '0.75rem', fontSize: 13, color: '#475569', lineHeight: 1.5 }}>{profile.summary}</div>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
            {/* Intereses */}
            <ProfileCard title="🎯 Intereses" items={profile.interests} color="#3b82f6" />
            {/* Desencadenantes de compra */}
            <ProfileCard title="💡 Desencadenantes de compra" items={profile.buyingTriggers} color="#22c55e" />
            {/* Actividad reciente */}
            <ProfileCard title="📰 Actividad reciente" items={profile.recentActivity} color="#f59e0b" />
            {/* Ángulos recomendados */}
            <ProfileCard title="🚀 Ángulos de venta recomendados" items={profile.recommendedAngles} color="#8b5cf6" />
          </div>
        </div>
      )}

      {!profile && (
        <div style={{
          flex: 1,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          color: '#94a3b8',
          fontSize: 14,
          flexDirection: 'column',
          gap: 8,
        }}>
          <div style={{ fontSize: 48 }}>🔍</div>
          <div>Ingresa nombre y empresa para investigar al lead</div>
        </div>
      )}
    </div>
  )
}

function ProfileCard({ title, items, color }: { title: string; items: string[]; color: string }) {
  return (
    <div style={{ background: 'white', border: '1px solid #e2e8f0', borderRadius: 8, padding: '1rem' }}>
      <div style={{ fontWeight: 600, fontSize: 13, color: '#1e293b', marginBottom: '0.75rem', borderLeft: `3px solid ${color}`, paddingLeft: 8 }}>
        {title}
      </div>
      <ul style={{ margin: 0, padding: 0, listStyle: 'none', display: 'flex', flexDirection: 'column', gap: 6 }}>
        {items.map((item, i) => (
          <li key={i} style={{ fontSize: 12, color: '#475569', paddingLeft: 8, position: 'relative' }}>
            <span style={{ position: 'absolute', left: 0, color: color }}>•</span>
            {item}
          </li>
        ))}
      </ul>
    </div>
  )
}
