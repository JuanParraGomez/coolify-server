import React, { useState } from 'react'
import { useLeads } from '../hooks/useLeads.js'
import { apiClient } from '../lib/api-client.js'
import { AI_PROVIDERS } from '../lib/constants.js'

const TONES = ['Profesional', 'Amigable', 'Directo', 'Consultivo', 'Urgente']

const S = {
  h1:     { fontSize: '1.4rem', fontWeight: 700, marginBottom: '0.25rem' },
  sub:    { color: '#64748b', fontSize: '0.875rem', marginBottom: '1.25rem' },
  grid:   { display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1.5rem' },
  panel:  { background: '#1e293b', borderRadius: 10, border: '1px solid #334155', padding: '1.25rem' },
  label:  { fontSize: '0.8rem', color: '#94a3b8', marginBottom: 4, display: 'block' },
  input:  { width: '100%', background: '#0f172a', border: '1px solid #334155', borderRadius: 8, padding: '0.5rem 0.75rem', color: '#e2e8f0', fontSize: '0.875rem' },
  select: { width: '100%', background: '#0f172a', border: '1px solid #334155', borderRadius: 8, padding: '0.5rem 0.75rem', color: '#e2e8f0', fontSize: '0.875rem' },
  textarea: { width: '100%', background: '#0f172a', border: '1px solid #334155', borderRadius: 8, padding: '0.5rem 0.75rem', color: '#e2e8f0', fontSize: '0.875rem', resize: 'vertical', minHeight: 100 },
  tones: { display: 'flex', gap: '0.5rem', flexWrap: 'wrap', marginBottom: '1rem' },
  tonebtn: (a) => ({ border: `1px solid ${a ? '#3b82f6' : '#334155'}`, background: a ? '#3b82f620' : 'transparent', color: a ? '#3b82f6' : '#94a3b8', borderRadius: 6, padding: '0.3rem 0.7rem', cursor: 'pointer', fontSize: '0.8rem' }),
  btn:    { background: '#3b82f6', color: '#fff', border: 'none', borderRadius: 8, padding: '0.6rem 1.2rem', cursor: 'pointer', fontSize: '0.875rem', width: '100%', marginTop: '0.75rem' },
  result: { background: '#0f172a', border: '1px solid #334155', borderRadius: 8, padding: '1rem', fontSize: '0.875rem', lineHeight: 1.6, whiteSpace: 'pre-wrap', color: '#e2e8f0', minHeight: 200 },
  copy:   { background: 'transparent', border: '1px solid #334155', color: '#94a3b8', borderRadius: 6, padding: '0.35rem 0.75rem', cursor: 'pointer', fontSize: '0.8rem', marginTop: '0.5rem' },
  field:  { marginBottom: '0.75rem' },
}

export default function Responses() {
  const { leads } = useLeads()
  const [leadId, setLeadId] = useState('')
  const [tone, setTone] = useState('Profesional')
  const [context, setContext] = useState('')
  const [result, setResult] = useState('')
  const [loading, setLoading] = useState(false)
  const [copied, setCopied] = useState(false)

  const provider = localStorage.getItem('ai_provider') ?? 'openai'

  const handleGenerate = async () => {
    setLoading(true)
    setResult('')
    try {
      const res = await apiClient.generateAiResponse(leadId || 'demo', context || `Tono: ${tone}`)
      setResult(res.suggestion)
    } catch {
      // Demo fallback
      await new Promise(r => setTimeout(r, 800))
      const lead = leads.find(l => l.id === leadId)
      setResult(
        `Hola${lead ? ` ${lead.name.split(' ')[0]}` : ''},\n\n` +
        `Quería hacer seguimiento de nuestra conversación sobre cómo podemos ayudar a ${lead?.company ?? 'tu empresa'}.\n\n` +
        `Dado tu rol como ${lead?.title ?? 'líder'}, creo que nuestra solución podría resolver específicamente los desafíos que comentaste.\n\n` +
        `¿Tienes disponibilidad esta semana para una llamada de 20 minutos?\n\nSaludos,`
      )
    } finally {
      setLoading(false)
    }
  }

  const handleCopy = () => {
    navigator.clipboard.writeText(result)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  return (
    <div>
      <h1 style={S.h1}>Respuestas IA</h1>
      <p style={S.sub}>Genera respuestas personalizadas con IA para cada lead. Proveedor activo: <strong>{AI_PROVIDERS[provider]?.label ?? provider}</strong></p>

      <div style={S.grid}>
        {/* Controles */}
        <div style={S.panel}>
          <div style={S.field}>
            <label style={S.label}>Lead objetivo</label>
            <select style={S.select} value={leadId} onChange={e => setLeadId(e.target.value)}>
              <option value="">— Seleccionar lead —</option>
              {leads.map(l => <option key={l.id} value={l.id}>{l.name} · {l.company}</option>)}
            </select>
          </div>

          <div style={S.field}>
            <label style={S.label}>Tono del mensaje</label>
            <div style={S.tones}>
              {TONES.map(t => (
                <button key={t} style={S.tonebtn(tone === t)} onClick={() => setTone(t)}>{t}</button>
              ))}
            </div>
          </div>

          <div style={S.field}>
            <label style={S.label}>Contexto adicional (opcional)</label>
            <textarea
              style={S.textarea}
              placeholder="Ej: El lead mencionó que tiene presupuesto aprobado y quiere cerrar este mes..."
              value={context}
              onChange={e => setContext(e.target.value)}
            />
          </div>

          <button style={S.btn} onClick={handleGenerate} disabled={loading}>
            {loading ? '⏳ Generando con IA...' : '✨ Generar respuesta'}
          </button>
        </div>

        {/* Resultado */}
        <div style={S.panel}>
          <label style={S.label}>Respuesta generada</label>
          <div style={S.result}>{result || 'La respuesta generada aparecerá aquí...'}</div>
          {result && (
            <button style={S.copy} onClick={handleCopy}>
              {copied ? '✓ Copiado' : '📋 Copiar al portapapeles'}
            </button>
          )}
        </div>
      </div>
    </div>
  )
}
