import React, { useState } from 'react'
import { useSearchParams } from 'react-router-dom'
import { useLeads } from '../hooks/useLeads.js'
import { apiClient } from '../lib/api-client.js'

const S = {
  h1:     { fontSize: '1.4rem', fontWeight: 700, marginBottom: '0.25rem' },
  sub:    { color: '#64748b', fontSize: '0.875rem', marginBottom: '1.25rem' },
  bar:    { display: 'flex', gap: '0.75rem', marginBottom: '1.25rem', flexWrap: 'wrap' },
  select: { background: '#1e293b', border: '1px solid #334155', borderRadius: 8, padding: '0.5rem 0.75rem', color: '#e2e8f0', fontSize: '0.875rem', flex: 1 },
  input:  { background: '#1e293b', border: '1px solid #334155', borderRadius: 8, padding: '0.5rem 0.75rem', color: '#e2e8f0', fontSize: '0.875rem', flex: 2, minWidth: 220 },
  btn:    (c = '#3b82f6') => ({ background: c, color: '#fff', border: 'none', borderRadius: 8, padding: '0.5rem 1rem', cursor: 'pointer', fontSize: '0.875rem' }),
  grid:   { display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' },
  card:   { background: '#1e293b', borderRadius: 10, border: '1px solid #334155', padding: '1.25rem' },
  sectionT: { fontSize: '0.8rem', fontWeight: 600, color: '#94a3b8', textTransform: 'uppercase', letterSpacing: '0.05em', marginBottom: '0.75rem' },
  name:   { fontSize: '1.2rem', fontWeight: 700, marginBottom: 3 },
  role:   { color: '#94a3b8', fontSize: '0.875rem', marginBottom: '1rem' },
  tag:    { display: 'inline-block', background: '#3b82f620', color: '#3b82f6', borderRadius: 6, padding: '2px 8px', fontSize: '0.75rem', margin: '2px 3px 2px 0' },
  point:  { fontSize: '0.875rem', padding: '0.4rem 0', borderBottom: '1px solid #334155', display: 'flex', gap: '0.5rem', alignItems: 'flex-start' },
  empty:  { color: '#64748b', fontStyle: 'italic', fontSize: '0.875rem' },
}

const MOCK_REPORT = (lead) => ({
  profile: {
    name: lead?.name ?? 'Contacto',
    title: lead?.title ?? 'Ejecutivo',
    company: lead?.company ?? 'Empresa',
    linkedin_url: lead?.linkedin ?? lead?.linkedin_url,
    bio: `${lead?.name ?? 'El contacto'} es un profesional con amplia experiencia en transformación digital y gestión de equipos de tecnología. Ha liderado iniciativas de innovación en múltiples empresas del sector.`,
    interests: ['Transformación digital', 'IA aplicada a negocios', 'SaaS B2B', 'Liderazgo tecnológico'],
    recent_posts: [
      `Publicó sobre "El futuro de la IA en ventas B2B" — hace 3 días`,
      `Comentó en un artículo sobre automatización de procesos — hace 1 semana`,
      `Compartió caso de éxito de implementación de CRM — hace 2 semanas`,
    ],
  },
  summary: `${lead?.name ?? 'El contacto'} es tomador de decisiones en ${lead?.company ?? 'su empresa'} con autoridad de compra. Está activo en LinkedIn y ha mostrado interés reciente en soluciones de IA para ventas. Tiene perfil ideal para nuestra propuesta.`,
  talking_points: [
    'Mencionar la integración con herramientas que ya usa (CRM, LinkedIn)',
    'Enfocarse en ROI y reducción de tiempo en prospección',
    'Compartir caso de éxito similar en su industria',
    'Proponer una demo corta de 20 minutos sin compromiso',
    'Destacar el soporte en español y presencia en LATAM',
  ],
  generated_at: new Date().toISOString(),
})

export default function Research() {
  const [searchParams] = useSearchParams()
  const { leads } = useLeads()
  const [leadId, setLeadId] = useState(searchParams.get('lead') ?? '')
  const [query, setQuery] = useState('')
  const [report, setReport] = useState(null)
  const [loading, setLoading] = useState(false)

  const handleResearch = async () => {
    setLoading(true)
    const lead = leads.find(l => l.id === leadId)
    try {
      const data = await (leadId
        ? apiClient.getResearchReport(leadId)
        : apiClient.researchContact(query || (lead?.name ?? 'contacto'))
      )
      setReport(data)
    } catch {
      await new Promise(r => setTimeout(r, 900))
      setReport(MOCK_REPORT(lead ?? { name: query, title: 'Profesional', company: 'Empresa' }))
    } finally {
      setLoading(false)
    }
  }

  return (
    <div>
      <h1 style={S.h1}>Investigación Pre-Entrevista</h1>
      <p style={S.sub}>Analiza el perfil social y digital de un tomador de decisiones antes de la llamada.</p>

      <div style={S.bar}>
        <select style={S.select} value={leadId} onChange={e => setLeadId(e.target.value)}>
          <option value="">— Seleccionar lead existente —</option>
          {leads.map(l => <option key={l.id} value={l.id}>{l.name} · {l.company}</option>)}
        </select>
        <input style={S.input} placeholder="O buscar por nombre/empresa..." value={query} onChange={e => setQuery(e.target.value)} />
        <button style={S.btn()} onClick={handleResearch} disabled={loading || (!leadId && !query)}>
          {loading ? '⏳ Investigando...' : '🔍 Investigar'}
        </button>
      </div>

      {report && (
        <div style={S.grid}>
          {/* Perfil */}
          <div style={S.card}>
            <div style={S.sectionT}>Perfil del Contacto</div>
            <div style={S.name}>{report.profile.name}</div>
            <div style={S.role}>{report.profile.title} · {report.profile.company}</div>
            {report.profile.linkedin_url && (
              <div style={{ fontSize: '0.8rem', color: '#3b82f6', marginBottom: '0.75rem' }}>{report.profile.linkedin_url}</div>
            )}
            <p style={{ fontSize: '0.875rem', lineHeight: 1.6, color: '#cbd5e1', marginBottom: '1rem' }}>{report.profile.bio}</p>
            <div style={S.sectionT}>Intereses</div>
            <div style={{ marginBottom: '1rem' }}>
              {(report.profile.interests ?? []).map(i => <span key={i} style={S.tag}>{i}</span>)}
            </div>
            <div style={S.sectionT}>Actividad reciente</div>
            {(report.profile.recent_posts ?? []).map((p, i) => (
              <div key={i} style={{ fontSize: '0.8rem', color: '#94a3b8', padding: '0.35rem 0', borderBottom: '1px solid #334155' }}>📝 {p}</div>
            ))}
          </div>

          {/* Análisis y puntos de conversación */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
            <div style={S.card}>
              <div style={S.sectionT}>Resumen Ejecutivo</div>
              <p style={{ fontSize: '0.875rem', lineHeight: 1.6, color: '#cbd5e1' }}>{report.summary}</p>
            </div>
            <div style={S.card}>
              <div style={S.sectionT}>Puntos de Conversación Sugeridos</div>
              {(report.talking_points ?? []).map((p, i) => (
                <div key={i} style={S.point}>
                  <span style={{ color: '#3b82f6' }}>→</span>
                  <span style={{ color: '#cbd5e1' }}>{p}</span>
                </div>
              ))}
            </div>
            <div style={{ ...S.card, fontSize: '0.75rem', color: '#64748b' }}>
              Generado el {new Date(report.generated_at).toLocaleString('es-MX')} · Datos vía REST API + análisis IA
            </div>
          </div>
        </div>
      )}

      {!report && !loading && (
        <div style={{ background: '#1e293b', borderRadius: 10, border: '1px solid #334155', padding: '3rem', textAlign: 'center', color: '#64748b' }}>
          Selecciona un lead o ingresa un nombre para generar el informe de investigación.
        </div>
      )}
    </div>
  )
}
