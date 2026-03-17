import React, { useState } from 'react'
import { PLAN } from '../plan.js'
import AppShell, { T } from './AppShell.jsx'
import { MOCK_LEADS, ESTADO_COLOR, ESTADO_OPTIONS, CANAL_OPTIONS, RESPONDIO_OPTIONS } from '../lib/mock-data.js'

// ─── Helpers ────────────────────────────────────────────────────────────────
const badge = (color, text) => (
  <span style={{
    background: color + '22',
    color,
    border: `1px solid ${color}44`,
    borderRadius: 4,
    padding: '2px 8px',
    fontSize: 11,
    fontWeight: 700,
    letterSpacing: 0.5,
    textTransform: 'uppercase',
  }}>{text}</span>
)

// ─── Block Renderers ─────────────────────────────────────────────────────────
function IntroBlock({ text }) {
  return (
    <p style={{ color: T.text, fontSize: 16, lineHeight: 1.7, marginBottom: 24 }}>{text}</p>
  )
}

function NoteBlock({ text }) {
  return (
    <div style={{
      background: '#f59e0b11',
      border: '1px solid #f59e0b44',
      borderRadius: 8,
      padding: '12px 16px',
      color: '#fcd34d',
      fontSize: 14,
      marginBottom: 24,
    }}>{text}</div>
  )
}

function CardsBlock({ items }) {
  return (
    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(260px, 1fr))', gap: 16, marginBottom: 24 }}>
      {items.map((c, i) => (
        <div key={i} style={{
          background: T.surface2,
          border: `1px solid ${T.border}`,
          borderRadius: 10,
          padding: 20,
        }}>
          <div style={{ fontSize: 28, marginBottom: 8 }}>{c.icon}</div>
          <div style={{ color: T.text, fontWeight: 600, marginBottom: 6 }}>{c.title}</div>
          <div style={{ color: T.muted, fontSize: 14, lineHeight: 1.5 }}>{c.desc}</div>
        </div>
      ))}
    </div>
  )
}

function DiagramBlock({ title, layers }) {
  return (
    <div style={{ marginBottom: 24 }}>
      {title && <div style={{ color: T.muted, fontSize: 13, marginBottom: 12, textTransform: 'uppercase', letterSpacing: 1 }}>{title}</div>}
      <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
        {layers.map((layer, i) => (
          <div key={i} style={{
            background: layer.color + '12',
            border: `1px solid ${layer.color}44`,
            borderRadius: 8,
            padding: 16,
          }}>
            <div style={{ color: layer.color, fontWeight: 600, marginBottom: 10, fontSize: 14 }}>{layer.name}</div>
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8 }}>
              {layer.items.map((item, j) => (
                <div key={j} style={{
                  background: layer.color + '18',
                  color: T.text,
                  border: `1px solid ${layer.color}33`,
                  borderRadius: 6,
                  padding: '4px 12px',
                  fontSize: 13,
                }}>{item}</div>
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}

function TreeNode({ node, depth = 0 }) {
  const [open, setOpen] = useState(true)
  const hasChildren = node.children && node.children.length > 0
  return (
    <div style={{ marginLeft: depth * 20 }}>
      <div
        onClick={() => hasChildren && setOpen(o => !o)}
        style={{
          display: 'flex',
          alignItems: 'flex-start',
          gap: 8,
          padding: '6px 10px',
          borderRadius: 6,
          cursor: hasChildren ? 'pointer' : 'default',
          background: depth === 0 ? T.surface2 : 'transparent',
          border: depth === 0 ? `1px solid ${T.border}` : 'none',
          marginBottom: 4,
        }}
      >
        {hasChildren && (
          <span style={{ color: T.accent, fontFamily: 'monospace', fontSize: 12, marginTop: 2 }}>
            {open ? '▼' : '▶'}
          </span>
        )}
        {!hasChildren && <span style={{ color: T.muted, fontFamily: 'monospace', fontSize: 12, marginTop: 2 }}>└</span>}
        <div>
          <div style={{ color: T.text, fontSize: 14, fontWeight: depth === 0 ? 600 : 400 }}>{node.label}</div>
          {node.desc && <div style={{ color: T.muted, fontSize: 12, marginTop: 2 }}>{node.desc}</div>}
        </div>
      </div>
      {hasChildren && open && (
        <div style={{ marginLeft: 10, borderLeft: `1px dashed ${T.border}`, paddingLeft: 10 }}>
          {node.children.map((child, i) => <TreeNode key={i} node={child} depth={depth + 1} />)}
        </div>
      )}
    </div>
  )
}

function TreeBlock({ title, nodes }) {
  return (
    <div style={{ marginBottom: 24 }}>
      {title && <div style={{ color: T.muted, fontSize: 13, marginBottom: 12, textTransform: 'uppercase', letterSpacing: 1 }}>{title}</div>}
      {nodes.map((node, i) => <TreeNode key={i} node={node} depth={0} />)}
    </div>
  )
}

function FlowsBlock({ items }) {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 20, marginBottom: 24 }}>
      {items.map((flow, i) => (
        <div key={i} style={{
          background: T.surface2,
          border: `1px solid ${T.border}`,
          borderLeft: `3px solid ${flow.color}`,
          borderRadius: 8,
          padding: 20,
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 14 }}>
            <span style={{
              background: flow.color + '22',
              color: flow.color,
              borderRadius: 4,
              padding: '2px 8px',
              fontSize: 11,
              fontWeight: 700,
            }}>{flow.id}</span>
            <span style={{ color: T.text, fontWeight: 600, fontSize: 15 }}>{flow.title}</span>
          </div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
            {flow.steps.map((step, j) => (
              <div key={j} style={{ display: 'flex', alignItems: 'flex-start', gap: 10 }}>
                <div style={{
                  minWidth: 22,
                  height: 22,
                  borderRadius: '50%',
                  background: flow.color + '22',
                  color: flow.color,
                  fontSize: 11,
                  fontWeight: 700,
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  marginTop: 1,
                }}>{j + 1}</div>
                <div style={{ color: T.text, fontSize: 14, lineHeight: 1.5 }}>{step}</div>
              </div>
            ))}
          </div>
        </div>
      ))}
    </div>
  )
}

function StackTableBlock({ categories }) {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 16, marginBottom: 24 }}>
      {categories.map((cat, i) => (
        <div key={i} style={{
          background: T.surface2,
          border: `1px solid ${T.border}`,
          borderRadius: 8,
          overflow: 'hidden',
        }}>
          <div style={{
            background: cat.color + '18',
            borderBottom: `1px solid ${cat.color}33`,
            padding: '8px 16px',
            color: cat.color,
            fontWeight: 600,
            fontSize: 13,
          }}>{cat.name}</div>
          <table style={{ width: '100%', borderCollapse: 'collapse' }}>
            <tbody>
              {cat.items.map((item, j) => (
                <tr key={j} style={{ borderBottom: j < cat.items.length - 1 ? `1px solid ${T.border}` : 'none' }}>
                  <td style={{ padding: '8px 16px', color: T.accent, fontFamily: 'monospace', fontSize: 13, whiteSpace: 'nowrap', width: '35%' }}>{item.tech}</td>
                  <td style={{ padding: '8px 16px', color: T.muted, fontSize: 13 }}>{item.role}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      ))}
    </div>
  )
}

function DataFlowsBlock({ items }) {
  const methodColor = { GET: '#10b981', POST: '#3b82f6', PUT: '#f59e0b', PATCH: '#8b5cf6', DELETE: '#ef4444' }
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 16, marginBottom: 24 }}>
      {items.map((group, i) => (
        <div key={i} style={{ background: T.surface2, border: `1px solid ${T.border}`, borderRadius: 8, overflow: 'hidden' }}>
          <div style={{ padding: '8px 16px', borderBottom: `1px solid ${T.border}`, color: T.text, fontWeight: 600, fontSize: 13 }}>{group.title}</div>
          {group.endpoints.map((ep, j) => (
            <div key={j} style={{
              display: 'flex',
              alignItems: 'center',
              gap: 12,
              padding: '8px 16px',
              borderBottom: j < group.endpoints.length - 1 ? `1px solid ${T.border}` : 'none',
            }}>
              <span style={{
                background: (methodColor[ep.method] || T.accent) + '22',
                color: methodColor[ep.method] || T.accent,
                border: `1px solid ${(methodColor[ep.method] || T.accent)}44`,
                borderRadius: 4,
                padding: '1px 7px',
                fontSize: 11,
                fontWeight: 700,
                minWidth: 50,
                textAlign: 'center',
              }}>{ep.method}</span>
              <code style={{ color: T.accentHover, fontSize: 13, flex: '0 0 auto' }}>{ep.path}</code>
              <span style={{ color: T.muted, fontSize: 13 }}>{ep.desc}</span>
            </div>
          ))}
        </div>
      ))}
    </div>
  )
}

function ProvidersBlock({ items }) {
  return (
    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(240px, 1fr))', gap: 16, marginBottom: 24 }}>
      {items.map((p, i) => (
        <div key={i} style={{ background: T.surface2, border: `1px solid ${T.border}`, borderRadius: 10, padding: 20 }}>
          <div style={{ fontSize: 28, marginBottom: 8 }}>{p.logo}</div>
          <div style={{ color: T.text, fontWeight: 700, fontSize: 16, marginBottom: 10 }}>{p.name}</div>
          <div style={{ marginBottom: 10 }}>
            {p.models.map((m, j) => (
              <div key={j} style={{ display: 'flex', alignItems: 'center', gap: 6, marginBottom: 4 }}>
                <span style={{ color: T.accent, fontFamily: 'monospace', fontSize: 12 }}>◈</span>
                <span style={{ color: j === 0 && p.models[0].includes('runtime') ? '#fcd34d' : T.muted, fontSize: 13 }}>{m}</span>
              </div>
            ))}
          </div>
          <div style={{ color: T.muted, fontSize: 12, marginBottom: 10 }}>{p.use}</div>
          <code style={{ color: T.accentHover, fontSize: 11, background: T.surface, borderRadius: 4, padding: '2px 6px', display: 'inline-block', marginBottom: 12 }}>{p.key_env}</code>
          <ProviderKeyInput name={p.name} />
        </div>
      ))}
    </div>
  )
}

function ProviderKeyInput({ name }) {
  const [key, setKey] = useState('')
  const [saved, setSaved] = useState(false)
  const [testing, setTesting] = useState(false)
  const [testResult, setTestResult] = useState(null)

  const handleTest = () => {
    if (!key) return
    setTesting(true)
    setTestResult(null)
    setTimeout(() => {
      setTestResult(key.length > 10 ? 'ok' : 'error')
      setTesting(false)
    }, 1400)
  }

  const handleSave = () => {
    if (!key) return
    setSaved(true)
    setTimeout(() => setSaved(false), 2500)
  }

  return (
    <div>
      <input
        type="password"
        placeholder="Pegar API Key aquí..."
        value={key}
        onChange={e => { setKey(e.target.value); setTestResult(null) }}
        style={{
          width: '100%',
          background: T.surface,
          border: `1px solid ${testResult === 'ok' ? '#10b981' : testResult === 'error' ? '#ef4444' : T.border}`,
          borderRadius: 6,
          color: T.text,
          padding: '6px 10px',
          fontSize: 12,
          outline: 'none',
          boxSizing: 'border-box',
          marginBottom: 8,
          transition: 'border-color 0.2s',
        }}
      />
      <div style={{ display: 'flex', gap: 6 }}>
        <button
          onClick={handleTest}
          disabled={!key || testing}
          style={{
            flex: 1,
            background: T.surface2,
            border: `1px solid ${T.border}`,
            borderRadius: 6,
            color: T.text,
            padding: '6px 0',
            fontSize: 12,
            cursor: !key ? 'not-allowed' : 'pointer',
            opacity: !key ? 0.5 : 1,
          }}
        >
          {testing ? '⏳ Probando...' : testResult === 'ok' ? '✅ Válida' : testResult === 'error' ? '❌ Inválida' : '🔍 Probar'}
        </button>
        <button
          onClick={handleSave}
          disabled={!key}
          style={{
            flex: 1,
            background: saved ? '#10b981' : T.accent,
            border: 'none',
            borderRadius: 6,
            color: '#fff',
            padding: '6px 0',
            fontSize: 12,
            fontWeight: 600,
            cursor: !key ? 'not-allowed' : 'pointer',
            opacity: !key ? 0.6 : 1,
          }}
        >
          {saved ? '✓ Guardada' : 'Guardar'}
        </button>
      </div>
    </div>
  )
}

function SubsectionBlock({ title, items }) {
  return (
    <div style={{ marginBottom: 24 }}>
      <div style={{ color: T.text, fontWeight: 600, marginBottom: 10 }}>{title}</div>
      <ul style={{ margin: 0, paddingLeft: 20 }}>
        {items.map((item, i) => (
          <li key={i} style={{ color: T.muted, fontSize: 14, lineHeight: 1.6, marginBottom: 4 }}>{item}</li>
        ))}
      </ul>
    </div>
  )
}

function TimelineBlock({ total, phases }) {
  return (
    <div style={{ marginBottom: 24 }}>
      <div style={{
        background: T.accent + '18',
        border: `1px solid ${T.accent}44`,
        borderRadius: 8,
        padding: '10px 16px',
        color: T.accent,
        fontWeight: 700,
        fontSize: 16,
        marginBottom: 20,
        display: 'inline-block',
      }}>Total estimado: {total}</div>
      <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
        {phases.map((phase, i) => (
          <div key={i} style={{
            background: T.surface2,
            border: `1px solid ${T.border}`,
            borderLeft: `3px solid ${phase.color}`,
            borderRadius: 8,
            padding: 16,
          }}>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 10 }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                {badge(phase.color, phase.phase)}
                <span style={{ color: T.text, fontWeight: 600 }}>{phase.name}</span>
              </div>
              <span style={{ color: phase.color, fontWeight: 700, fontSize: 13 }}>{phase.duration}</span>
            </div>
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: 6 }}>
              {phase.tasks.map((task, j) => (
                <span key={j} style={{
                  background: T.bg,
                  color: T.muted,
                  border: `1px solid ${T.border}`,
                  borderRadius: 4,
                  padding: '3px 10px',
                  fontSize: 12,
                }}>✓ {task}</span>
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}

function RisksBlock({ items }) {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 14, marginBottom: 24 }}>
      {items.map((r, i) => (
        <div key={i} style={{
          background: T.surface2,
          border: `1px solid ${T.border}`,
          borderLeft: `3px solid ${r.color}`,
          borderRadius: 8,
          padding: 16,
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 8 }}>
            {badge(r.color, r.level)}
            <span style={{ color: T.text, fontWeight: 600, fontSize: 14 }}>{r.risk}</span>
          </div>
          <div style={{ color: T.muted, fontSize: 13, marginBottom: 6 }}>{r.desc}</div>
          <div style={{ color: T.text, fontSize: 13 }}>
            <span style={{ color: '#10b981', marginRight: 6 }}>✓ Mitigación:</span>{r.mitigation}
          </div>
        </div>
      ))}
    </div>
  )
}

// ─── Mock Leads Data ─────────────────────────────────────────────────────────
// Constants for filter rendering
const ESTADOS = ESTADO_OPTIONS.map(opt => opt.value)
const CANALES = CANAL_OPTIONS.map(opt => opt.value)

function ScoreBar({ score }) {
  const color = score >= 85 ? '#10b981' : score >= 65 ? '#f59e0b' : '#ef4444'
  return (
    <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
      <div style={{ flex: 1, height: 5, background: T.border, borderRadius: 3, overflow: 'hidden', minWidth: 50 }}>
        <div style={{ width: `${score}%`, height: '100%', background: color, borderRadius: 3 }} />
      </div>
      <span style={{ fontSize: 12, fontWeight: 700, color, minWidth: 24 }}>{score}</span>
    </div>
  )
}

function LeadDrillDown({ lead, onClose }) {
  const [loadingProvider, setLoadingProvider] = useState(null)
  const [suggestion, setSuggestion] = useState(null)

  const SUGGESTIONS = {
    OpenAI: `Hola ${lead.nombre}, vi que en ${lead.empresa} están explorando soluciones de ${lead.interes}. Tenemos casos de éxito con empresas de tu industria que han reducido el ciclo de ventas un 40%. ¿Tienes 20 minutos esta semana para una demo rápida?`,
    Gemini: `${lead.nombre}, como ${lead.cargo} en ${lead.empresa} seguramente valoras el impacto directo en resultados. Nuestra plataforma de ${lead.interes} puede ayudarte a alcanzar tus objetivos con un ROI demostrable en 90 días. ¿Agendamos una llamada?`,
    Claude: `Hola ${lead.nombre}, entiendo que como ${lead.cargo} tu tiempo es valioso. He preparado un análisis breve de cómo nuestras soluciones de ${lead.interes} han ayudado a empresas similares a ${lead.empresa}. ¿Te lo comparto en una sesión de 15 minutos?`,
    Deepseek: `${lead.nombre}, detecté que ${lead.empresa} podría beneficiarse de automatizar ${lead.interes}. Con un presupuesto de ${lead.presupuesto} podemos implementar una solución completa. ¿Coordinamos una presentación técnica esta semana?`,
  }

  const generate = (provider) => {
    setLoadingProvider(provider)
    setSuggestion(null)
    setTimeout(() => {
      setSuggestion({ provider, text: SUGGESTIONS[provider] })
      setLoadingProvider(null)
    }, 1200)
  }

  return (
    <div style={{
      background: T.surface2,
      border: `1px solid ${T.border}`,
      borderLeft: `3px solid ${ESTADO_COLOR[lead.estado] || T.accent}`,
      borderRadius: 8,
      padding: 20,
      marginTop: 4,
    }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 16 }}>
        <div>
          <div style={{ color: T.text, fontWeight: 700, fontSize: 16 }}>{lead.nombre}</div>
          <div style={{ color: T.muted, fontSize: 13 }}>{lead.cargo} · {lead.empresa}</div>
        </div>
        <button onClick={onClose} style={{ background: 'none', border: `1px solid ${T.border}`, color: T.muted, borderRadius: 6, padding: '4px 10px', fontSize: 12, cursor: 'pointer' }}>✕ Cerrar</button>
      </div>
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(150px, 1fr))', gap: 12, marginBottom: 16 }}>
        {[
          { label: 'Canal', value: lead.canal },
          { label: 'Estado', value: lead.estado },
          { label: 'Score', value: `${lead.score}/100` },
          { label: 'Presupuesto', value: lead.presupuesto },
          { label: 'Interés', value: lead.interes },
          { label: 'Contacto', value: lead.fechaContacto },
          { label: 'Respondió', value: lead.respondio ? '✅ Sí' : '❌ No' },
        ].map((item, i) => (
          <div key={i} style={{ background: T.surface, borderRadius: 6, padding: '8px 12px', border: `1px solid ${T.border}` }}>
            <div style={{ fontSize: 11, color: T.muted, textTransform: 'uppercase', letterSpacing: 0.5, marginBottom: 4 }}>{item.label}</div>
            <div style={{ color: T.text, fontWeight: 600, fontSize: 13 }}>{item.value}</div>
          </div>
        ))}
      </div>
      <div style={{ background: T.surface, borderRadius: 8, padding: 16, border: `1px solid ${T.border}` }}>
        <div style={{ color: T.muted, fontSize: 12, marginBottom: 10 }}>
          Endpoint: <code style={{ color: T.accentHover }}>POST /api/leads/{lead.id}/suggest</code>
        </div>
        <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap', marginBottom: suggestion ? 12 : 0 }}>
          {['OpenAI', 'Gemini', 'Claude', 'Deepseek'].map(p => (
            <button
              key={p}
              onClick={() => generate(p)}
              disabled={loadingProvider !== null}
              style={{
                background: loadingProvider === p ? T.accent : T.accent + '22',
                color: loadingProvider === p ? '#fff' : T.accentHover,
                border: `1px solid ${T.accent}44`,
                borderRadius: 6,
                padding: '5px 14px',
                fontSize: 12,
                fontWeight: 600,
                cursor: loadingProvider !== null ? 'wait' : 'pointer',
              }}
            >
              {loadingProvider === p ? '⏳ Generando...' : `💬 Generar con ${p}`}
            </button>
          ))}
        </div>
        {suggestion && (
          <div style={{ background: T.surface2, borderRadius: 6, padding: 12, border: `1px solid ${T.border}` }}>
            <div style={{ color: T.accent, fontSize: 11, fontWeight: 700, marginBottom: 6 }}>
              ✨ Sugerencia generada con {suggestion.provider}:
            </div>
            <div style={{ color: T.text, fontSize: 13, lineHeight: 1.6 }}>{suggestion.text}</div>
          </div>
        )}
      </div>
    </div>
  )
}

function LeadsTableBlock() {
  const [q, setQ] = useState('')
  const [estado, setEstado] = useState('todos')
  const [canal, setCanal] = useState('todos')
  const [respondio, setRespondio] = useState('todos')
  const [sortField, setSortField] = useState('score')
  const [sortDir, setSortDir] = useState('desc')
  const [expandedId, setExpandedId] = useState(null)

  const filtered = MOCK_LEADS.filter(l => {
    if (estado !== 'todos' && l.estado !== estado) return false
    if (canal !== 'todos' && l.canal !== canal) return false
    if (respondio === 'si' && !l.respondio) return false
    if (respondio === 'no' && l.respondio) return false
    if (q) {
      const lq = q.toLowerCase()
      if (!l.nombre.toLowerCase().includes(lq) && !l.empresa.toLowerCase().includes(lq) && !l.cargo.toLowerCase().includes(lq)) return false
    }
    return true
  }).sort((a, b) => {
    const av = a[sortField], bv = b[sortField]
    const d = sortDir === 'asc' ? 1 : -1
    return av < bv ? -d : av > bv ? d : 0
  })

  const stats = {
    total: MOCK_LEADS.length,
    nuevos: MOCK_LEADS.filter(l => l.estado === 'nuevo').length,
    respondieron: MOCK_LEADS.filter(l => l.respondio).length,
    scorePromedio: Math.round(MOCK_LEADS.reduce((s, l) => s + l.score, 0) / MOCK_LEADS.length),
  }

  const toggleSort = (field) => {
    if (sortField === field) setSortDir(d => d === 'asc' ? 'desc' : 'asc')
    else { setSortField(field); setSortDir('desc') }
  }

  const inputStyle = {
    background: T.surface,
    border: `1px solid ${T.border}`,
    borderRadius: 6,
    color: T.text,
    padding: '6px 10px',
    fontSize: 13,
    outline: 'none',
  }

  const thStyle = {
    padding: '8px 12px',
    textAlign: 'left',
    color: T.muted,
    fontWeight: 600,
    fontSize: 12,
    textTransform: 'uppercase',
    letterSpacing: 0.5,
    cursor: 'pointer',
    whiteSpace: 'nowrap',
    borderBottom: `1px solid ${T.border}`,
    background: T.surface,
  }

  const tdStyle = {
    padding: '10px 12px',
    color: T.text,
    fontSize: 13,
    verticalAlign: 'middle',
    borderBottom: `1px solid ${T.border}`,
  }

  return (
    <div style={{ marginBottom: 24 }}>
      {/* Contrato REST */}
      <div style={{ background: T.surface2, border: `1px solid ${T.border}`, borderRadius: 8, padding: '10px 16px', marginBottom: 16, fontSize: 13 }}>
        <span style={{ color: T.muted }}>Contrato REST: </span>
        <code style={{ color: '#10b981' }}>GET</code>
        <code style={{ color: T.accentHover, marginLeft: 8 }}>/api/leads?estado=&canal=&respondio=&q=&page=&limit=</code>
        <span style={{ color: T.muted, marginLeft: 12 }}>→ {'{ items: Lead[], total: number }'}</span>
      </div>

      {/* Stats */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 12, marginBottom: 16 }}>
        {[
          { label: 'Total leads', value: stats.total, color: '#3b82f6' },
          { label: 'Nuevos', value: stats.nuevos, color: '#6366f1' },
          { label: 'Respondieron', value: stats.respondieron, color: '#10b981' },
          { label: 'Score promedio', value: stats.scorePromedio, color: '#f59e0b' },
        ].map((s, i) => (
          <div key={i} style={{ background: T.surface2, border: `1px solid ${T.border}`, borderTop: `3px solid ${s.color}`, borderRadius: 8, padding: 14, textAlign: 'center' }}>
            <div style={{ fontSize: 22, fontWeight: 700, color: s.color }}>{s.value}</div>
            <div style={{ fontSize: 12, color: T.muted, marginTop: 2 }}>{s.label}</div>
          </div>
        ))}
      </div>

      {/* Filters */}
      <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap', marginBottom: 12 }}>
        <input
          style={{ ...inputStyle, flex: 2, minWidth: 180 }}
          placeholder="🔍 Buscar nombre, empresa, cargo..."
          value={q}
          onChange={e => setQ(e.target.value)}
        />
        <select style={{ ...inputStyle, cursor: 'pointer' }} value={estado} onChange={e => setEstado(e.target.value)}>
          {ESTADO_OPTIONS.map(opt => <option key={opt.value} value={opt.value}>{opt.label}</option>)}
        </select>
        <select style={{ ...inputStyle, cursor: 'pointer' }} value={canal} onChange={e => setCanal(e.target.value)}>
          {CANAL_OPTIONS.map(opt => <option key={opt.value} value={opt.value}>{opt.label}</option>)}
        </select>
        <select style={{ ...inputStyle, cursor: 'pointer' }} value={respondio} onChange={e => setRespondio(e.target.value)}>
          {RESPONDIO_OPTIONS.map(opt => <option key={opt.value} value={opt.value}>{opt.label}</option>)}
        </select>
      </div>

      {/* Table */}
      <div style={{ overflowX: 'auto', border: `1px solid ${T.border}`, borderRadius: 8 }}>
        <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: 13 }}>
          <thead>
            <tr>
              {[
                { key: 'nombre', label: 'Nombre' },
                { key: 'empresa', label: 'Empresa' },
                { key: 'cargo', label: 'Cargo' },
                { key: 'estado', label: 'Estado' },
                { key: 'canal', label: 'Canal' },
                { key: 'score', label: 'Score' },
                { key: 'respondio', label: 'Respondió' },
              ].map(col => (
                <th key={col.key} style={thStyle} onClick={() => toggleSort(col.key)}>
                  {col.label}
                  {sortField === col.key ? (
                    <span style={{ color: T.accent, marginLeft: 4 }}>{sortDir === 'asc' ? '↑' : '↓'}</span>
                  ) : (
                    <span style={{ color: T.border, marginLeft: 4 }}>↕</span>
                  )}
                </th>
              ))}
              <th style={{ ...thStyle, cursor: 'default' }}>Acciones</th>
            </tr>
          </thead>
          <tbody>
            {filtered.map((lead, idx) => (
              <React.Fragment key={lead.id}>
                <tr
                  style={{ background: expandedId === lead.id ? T.accent + '11' : idx % 2 === 0 ? T.surface : T.surface2, cursor: 'pointer' }}
                  onClick={() => setExpandedId(expandedId === lead.id ? null : lead.id)}
                >
                  <td style={tdStyle}><strong>{lead.nombre}</strong></td>
                  <td style={tdStyle}>{lead.empresa}</td>
                  <td style={tdStyle}>
                    <span style={{ background: T.surface, border: `1px solid ${T.border}`, borderRadius: 4, padding: '2px 8px', fontSize: 12 }}>{lead.cargo}</span>
                  </td>
                  <td style={tdStyle}>
                    <span style={{ background: (ESTADO_COLOR[lead.estado] || T.accent) + '22', color: ESTADO_COLOR[lead.estado] || T.accent, border: `1px solid ${(ESTADO_COLOR[lead.estado] || T.accent)}44`, borderRadius: 12, padding: '2px 8px', fontSize: 11, fontWeight: 700 }}>
                      {lead.estado}
                    </span>
                  </td>
                  <td style={tdStyle}>{lead.canal}</td>
                  <td style={{ ...tdStyle, minWidth: 100 }}><ScoreBar score={lead.score} /></td>
                  <td style={{ ...tdStyle, textAlign: 'center' }}>{lead.respondio ? '✅' : '—'}</td>
                  <td style={tdStyle}>
                    <span style={{ color: T.accent, fontWeight: 600, fontSize: 12 }}>
                      {expandedId === lead.id ? '▲ Cerrar' : '▼ Ver'}
                    </span>
                  </td>
                </tr>
                {expandedId === lead.id && (
                  <tr>
                    <td colSpan={8} style={{ padding: '8px 12px', background: T.surface2 }}>
                      <LeadDrillDown lead={lead} onClose={() => setExpandedId(null)} />
                    </td>
                  </tr>
                )}
              </React.Fragment>
            ))}
            {filtered.length === 0 && (
              <tr>
                <td colSpan={8} style={{ ...tdStyle, textAlign: 'center', color: T.muted, padding: 32 }}>
                  No hay leads que coincidan con los filtros
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
      <div style={{ color: T.muted, fontSize: 12, marginTop: 8 }}>
        {filtered.length} de {MOCK_LEADS.length} leads · Hook: <code style={{ color: T.accentHover }}>useLeads(filters)</code> → <code style={{ color: T.accentHover }}>{'{ items, total, loading }'}</code>
      </div>
    </div>
  )
}

// ─── Block: Social Research ──────────────────────────────────────────────────
function SocialResearchBlock() {
  const [nombre, setNombre] = useState('')
  const [empresa, setEmpresa] = useState('')
  const [loading, setLoading] = useState(false)
  const [progress, setProgress] = useState(0)
  const [profile, setProfile] = useState(null)
  const [copied, setCopied] = useState(false)

  const startResearch = () => {
    if (!nombre && !empresa) return
    setLoading(true)
    setProgress(0)
    setProfile(null)
    let p = 0
    const iv = setInterval(() => {
      p += 25
      setProgress(p)
      if (p >= 100) {
        clearInterval(iv)
        setLoading(false)
        setProfile({
          nombre: nombre || 'Carlos Mendoza',
          empresa: empresa || 'TechMX SA',
          cargo: 'CTO',
          ubicacion: 'Ciudad de México',
          intereses: ['Inteligencia Artificial', 'Cloud Computing', 'Automatización de procesos', 'Startup Ecosystems'],
          experiencia: ['CTO en TechMX SA (2021–presente)', 'VP Engineering en DataCorp (2018–2021)', 'Senior Dev en Softlabs (2015–2018)'],
          triggers: [
            { tipo: 'Crecimiento', desc: 'Su empresa creció 3x en headcount en 2025 → posible necesidad de herramientas de escala.' },
            { tipo: 'Publicación', desc: 'Publicó artículo sobre "IA en ventas B2B" hace 2 semanas → interés activo en el tema.' },
            { tipo: 'Evento', desc: 'Asistirá a SaaStr Mexico en abril → oportunidad de reunión presencial.' },
          ],
          resumen: `Es un CTO técnico con visión de negocio, activamente interesado en automatización con IA. Ha liderado equipos de 40+ personas y valora soluciones que reducen fricción operativa. El mejor ángulo de venta es mostrar ROI concreto en reducción del ciclo de ventas.`,
          fuentes: ['LinkedIn', 'Twitter/X', 'Google News', 'GitHub'],
        })
      }
    }, 450)
  }

  const copyResumen = () => {
    if (!profile) return
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  return (
    <div style={{ marginBottom: 24 }}>
      {/* Search form */}
      <div style={{ background: T.surface2, border: `1px solid ${T.border}`, borderRadius: 8, padding: 20, marginBottom: 16 }}>
        <div style={{ color: T.text, fontWeight: 600, marginBottom: 12, fontSize: 15 }}>🔍 Investigar Decisor Antes de Entrevista</div>
        <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap', marginBottom: 10 }}>
          <input
            placeholder="Nombre del decisor"
            value={nombre}
            onChange={e => setNombre(e.target.value)}
            style={{ flex: 1, minWidth: 160, background: T.surface, border: `1px solid ${T.border}`, borderRadius: 6, color: T.text, padding: '8px 12px', fontSize: 13, outline: 'none' }}
          />
          <input
            placeholder="Empresa"
            value={empresa}
            onChange={e => setEmpresa(e.target.value)}
            style={{ flex: 1, minWidth: 140, background: T.surface, border: `1px solid ${T.border}`, borderRadius: 6, color: T.text, padding: '8px 12px', fontSize: 13, outline: 'none' }}
          />
          <button
            onClick={startResearch}
            disabled={loading || (!nombre && !empresa)}
            style={{
              background: (nombre || empresa) && !loading ? T.accent : T.surface,
              color: (nombre || empresa) && !loading ? '#fff' : T.muted,
              border: `1px solid ${T.border}`, borderRadius: 6,
              padding: '8px 20px', fontSize: 13, fontWeight: 600,
              cursor: (nombre || empresa) && !loading ? 'pointer' : 'default',
            }}
          >
            {loading ? '⏳ Investigando…' : '🔍 Investigar'}
          </button>
        </div>
        <div style={{ color: T.muted, fontSize: 12 }}>
          Endpoint: <code style={{ color: T.accentHover }}>POST /api/research/start</code> → polling <code style={{ color: T.accentHover }}>GET /api/research/:jobId</code> cada 2s
        </div>
      </div>

      {/* Progress */}
      {loading && (
        <div style={{ background: T.surface2, border: `1px solid ${T.border}`, borderRadius: 8, padding: 20, marginBottom: 16 }}>
          <div style={{ color: T.muted, fontSize: 14, marginBottom: 14 }}>Agente LangGraph investigando en redes sociales…</div>
          <div style={{ height: 4, background: T.border, borderRadius: 2, marginBottom: 14, overflow: 'hidden' }}>
            <div style={{ width: `${progress}%`, height: '100%', background: T.accent, borderRadius: 2, transition: 'width 0.3s' }} />
          </div>
          {['Buscando en LinkedIn', 'Analizando Twitter/X', 'Revisando noticias recientes', 'Generando perfil con IA'].map((step, i) => (
            <div key={i} style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 6, opacity: progress >= (i + 1) * 25 ? 1 : 0.3 }}>
              <span style={{ color: progress >= (i + 1) * 25 ? T.accent : T.muted, fontSize: 12 }}>{progress >= (i + 1) * 25 ? '✓' : '○'}</span>
              <span style={{ color: T.text, fontSize: 13 }}>{step}</span>
            </div>
          ))}
        </div>
      )}

      {/* Profile result */}
      {profile && (
        <div style={{ background: T.surface2, border: `1px solid ${T.border}`, borderRadius: 8, padding: 20 }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 16 }}>
            <div>
              <div style={{ color: T.text, fontWeight: 700, fontSize: 18 }}>{profile.nombre}</div>
              <div style={{ color: T.muted, fontSize: 14 }}>{profile.cargo} · {profile.empresa}</div>
              <div style={{ color: T.muted, fontSize: 13, marginTop: 2 }}>📍 {profile.ubicacion}</div>
            </div>
            <button onClick={copyResumen} style={{
              background: copied ? '#10b981' : T.surface, color: copied ? '#fff' : T.muted,
              border: `1px solid ${T.border}`, borderRadius: 6, padding: '6px 14px', fontSize: 12, fontWeight: 600, cursor: 'pointer',
            }}>{copied ? '✓ Copiado' : '📋 Copiar resumen'}</button>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 14 }}>
            <div style={{ background: T.surface, borderRadius: 8, padding: 14, border: `1px solid ${T.border}` }}>
              <div style={{ color: T.accent, fontWeight: 600, fontSize: 13, marginBottom: 10 }}>💡 Intereses Profesionales</div>
              <div style={{ display: 'flex', flexWrap: 'wrap', gap: 6 }}>
                {profile.intereses.map((int, i) => (
                  <span key={i} style={{ background: T.accent + '18', color: T.accentHover, border: `1px solid ${T.accent}33`, borderRadius: 12, padding: '2px 10px', fontSize: 12 }}>{int}</span>
                ))}
              </div>
            </div>
            <div style={{ background: T.surface, borderRadius: 8, padding: 14, border: `1px solid ${T.border}` }}>
              <div style={{ color: '#3b82f6', fontWeight: 600, fontSize: 13, marginBottom: 10 }}>💼 Trayectoria</div>
              {profile.experiencia.map((exp, i) => (
                <div key={i} style={{ color: T.muted, fontSize: 13, marginBottom: 5, display: 'flex', gap: 6 }}>
                  <span style={{ color: '#3b82f6' }}>▸</span>{exp}
                </div>
              ))}
            </div>
            <div style={{ background: T.surface, borderRadius: 8, padding: 14, border: `1px solid ${T.border}`, gridColumn: '1 / -1' }}>
              <div style={{ color: '#10b981', fontWeight: 600, fontSize: 13, marginBottom: 10 }}>🎯 Triggers de Compra Identificados</div>
              {profile.triggers.map((t, i) => (
                <div key={i} style={{ display: 'flex', gap: 10, marginBottom: 10 }}>
                  <span style={{ background: '#10b98122', color: '#10b981', border: '1px solid #10b98144', borderRadius: 4, padding: '1px 8px', fontSize: 11, fontWeight: 700, whiteSpace: 'nowrap', alignSelf: 'flex-start' }}>{t.tipo}</span>
                  <div style={{ color: T.text, fontSize: 13, lineHeight: 1.5 }}>{t.desc}</div>
                </div>
              ))}
            </div>
            <div style={{ background: T.accent + '0d', borderRadius: 8, padding: 14, border: `1px solid ${T.accent}33`, gridColumn: '1 / -1' }}>
              <div style={{ color: T.accent, fontWeight: 600, fontSize: 13, marginBottom: 8 }}>🤖 Resumen IA para la entrevista</div>
              <div style={{ color: T.text, fontSize: 13, lineHeight: 1.7 }}>{profile.resumen}</div>
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: 8, gridColumn: '1 / -1' }}>
              <span style={{ color: T.muted, fontSize: 12 }}>Fuentes:</span>
              {profile.fuentes.map((f, i) => (
                <span key={i} style={{ background: T.surface, color: T.muted, border: `1px solid ${T.border}`, borderRadius: 4, padding: '2px 8px', fontSize: 11 }}>{f}</span>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

// ─── Block: Notifications ────────────────────────────────────────────────────
function NotificationsBlock() {
  const [notifications, setNotifications] = useState([
    { id: 1, lead: 'Ana Rodríguez', empresa: 'Fintech Norte', msg: 'Me gustaría saber más sobre sus soluciones de IA.', time: 'hace 5 min', read: false, type: 'reply' },
    { id: 2, lead: 'Luis Torres', empresa: 'LogiCorp', msg: '¿Pueden agendar una demo para el equipo?', time: 'hace 23 min', read: false, type: 'reply' },
    { id: 3, lead: 'Jorge Castillo', empresa: 'EduSoft', msg: 'Gracias por la información, la revisaré con el equipo.', time: 'hace 1h', read: true, type: 'reply' },
    { id: 4, lead: 'Sistema', empresa: '', msg: 'Nuevo lead capturado desde extensión: Pedro Ruiz (SaaS Global)', time: 'hace 2h', read: true, type: 'new_lead' },
    { id: 5, lead: 'María González', empresa: 'RetailPlus', msg: 'Estamos listos para proceder con la propuesta.', time: 'hace 3h', read: true, type: 'reply' },
  ])
  const [replyingTo, setReplyingTo] = useState(null)
  const [replyText, setReplyText] = useState('')

  const markRead = (id) => setNotifications(prev => prev.map(n => n.id === id ? { ...n, read: true } : n))
  const markAllRead = () => setNotifications(prev => prev.map(n => ({ ...n, read: true })))
  const sendReply = (id) => {
    if (!replyText.trim()) return
    markRead(id)
    setReplyingTo(null)
    setReplyText('')
  }

  const unread = notifications.filter(n => !n.read).length

  return (
    <div style={{ marginBottom: 24 }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 14 }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
          <span style={{ color: T.text, fontWeight: 600, fontSize: 15 }}>🔔 Feed de Notificaciones en Tiempo Real</span>
          {unread > 0 && (
            <span style={{ background: '#ef444422', color: '#ef4444', border: '1px solid #ef444444', borderRadius: 10, padding: '1px 8px', fontSize: 11, fontWeight: 700 }}>{unread} sin leer</span>
          )}
        </div>
        <div style={{ display: 'flex', gap: 8 }}>
          {unread > 0 && (
            <button onClick={markAllRead} style={{ background: 'none', border: `1px solid ${T.border}`, color: T.muted, borderRadius: 6, padding: '4px 12px', fontSize: 12, cursor: 'pointer' }}>
              Marcar todas como leídas
            </button>
          )}
        </div>
      </div>

      {/* SSE info */}
      <div style={{ background: T.surface2, border: `1px solid ${T.border}`, borderRadius: 8, padding: '10px 16px', marginBottom: 14, fontSize: 13 }}>
        <span style={{ color: T.muted }}>SSE stream: </span>
        <code style={{ color: '#10b981' }}>GET</code>
        <code style={{ color: T.accentHover, marginLeft: 8 }}>/api/notifications/stream</code>
        <span style={{ color: T.muted, marginLeft: 10 }}>· PATCH</span>
        <code style={{ color: T.accentHover, marginLeft: 6 }}>/api/notifications/:id/read</code>
      </div>

      <div style={{ background: T.surface2, border: `1px solid ${T.border}`, borderRadius: 8, overflow: 'hidden' }}>
        {notifications.map((n, i) => (
          <div key={n.id}>
            <div style={{
              display: 'flex', gap: 12, padding: '14px 16px',
              borderBottom: i < notifications.length - 1 ? `1px solid ${T.border}` : 'none',
              background: !n.read ? T.accent + '08' : 'transparent',
            }}>
              <div style={{
                width: 8, height: 8, borderRadius: '50%', marginTop: 6, flexShrink: 0,
                background: !n.read ? (n.type === 'new_lead' ? '#3b82f6' : '#10b981') : T.border,
              }} />
              <div style={{ flex: 1 }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 4, flexWrap: 'wrap', gap: 4 }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                    <span style={{ color: T.text, fontWeight: 600, fontSize: 13 }}>{n.lead}</span>
                    {n.empresa && <span style={{ color: T.muted, fontSize: 12 }}>· {n.empresa}</span>}
                    {n.type === 'new_lead' && <span style={{ background: '#3b82f622', color: '#3b82f6', border: '1px solid #3b82f644', borderRadius: 4, padding: '1px 6px', fontSize: 10, fontWeight: 700, textTransform: 'uppercase' }}>nuevo lead</span>}
                    {n.type === 'reply' && <span style={{ background: '#10b98122', color: '#10b981', border: '1px solid #10b98144', borderRadius: 4, padding: '1px 6px', fontSize: 10, fontWeight: 700, textTransform: 'uppercase' }}>respondió</span>}
                  </div>
                  <span style={{ color: T.muted, fontSize: 11 }}>{n.time}</span>
                </div>
                <div style={{ color: T.muted, fontSize: 13, lineHeight: 1.4, marginBottom: n.type === 'reply' && !n.read ? 8 : 0 }}>
                  "{n.msg}"
                </div>
                {n.type === 'reply' && !n.read && replyingTo !== n.id && (
                  <div style={{ display: 'flex', gap: 6 }}>
                    <button onClick={() => { setReplyingTo(n.id); markRead(n.id) }} style={{ background: T.accent, color: '#fff', border: 'none', borderRadius: 5, padding: '4px 12px', fontSize: 11, fontWeight: 600, cursor: 'pointer' }}>💬 Responder</button>
                    <button onClick={() => markRead(n.id)} style={{ background: 'none', border: `1px solid ${T.border}`, color: T.muted, borderRadius: 5, padding: '4px 10px', fontSize: 11, cursor: 'pointer' }}>Marcar leída</button>
                  </div>
                )}
              </div>
            </div>
            {replyingTo === n.id && (
              <div style={{ padding: '10px 16px 14px', background: T.accent + '08', borderBottom: i < notifications.length - 1 ? `1px solid ${T.border}` : 'none' }}>
                <div style={{ display: 'flex', gap: 8 }}>
                  <input
                    autoFocus
                    value={replyText}
                    onChange={e => setReplyText(e.target.value)}
                    onKeyDown={e => e.key === 'Enter' && sendReply(n.id)}
                    placeholder={`Responder a ${n.lead}…`}
                    style={{ flex: 1, background: T.surface, border: `1px solid ${T.border}`, borderRadius: 6, color: T.text, padding: '6px 10px', fontSize: 13, outline: 'none' }}
                  />
                  <button onClick={() => sendReply(n.id)} style={{ background: replyText ? T.accent : T.surface, color: replyText ? '#fff' : T.muted, border: `1px solid ${T.border}`, borderRadius: 6, padding: '6px 14px', fontSize: 12, fontWeight: 600, cursor: replyText ? 'pointer' : 'default' }}>Enviar</button>
                  <button onClick={() => setReplyingTo(null)} style={{ background: 'none', border: `1px solid ${T.border}`, color: T.muted, borderRadius: 6, padding: '6px 10px', fontSize: 12, cursor: 'pointer' }}>✕</button>
                </div>
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  )
}

// ─── Block Router ─────────────────────────────────────────────────────────────
function renderBlock(block, i) {
  switch (block.type) {
    case 'intro': return <IntroBlock key={i} text={block.text} />
    case 'note': return <NoteBlock key={i} text={block.text} />
    case 'cards': return <CardsBlock key={i} items={block.items} />
    case 'diagram': return <DiagramBlock key={i} title={block.title} layers={block.layers} />
    case 'tree': return <TreeBlock key={i} title={block.title} nodes={block.nodes} />
    case 'flows': return <FlowsBlock key={i} items={block.items} />
    case 'stack_table': return <StackTableBlock key={i} categories={block.categories} />
    case 'data_flows': return <DataFlowsBlock key={i} items={block.items} />
    case 'providers': return <ProvidersBlock key={i} items={block.items} />
    case 'subsection': return <SubsectionBlock key={i} title={block.title} items={block.items} />
    case 'timeline': return <TimelineBlock key={i} total={block.total} phases={block.phases} />
    case 'risks': return <RisksBlock key={i} items={block.items} />
    case 'leads_table': return <LeadsTableBlock key={i} />
    case 'social_research': return <SocialResearchBlock key={i} />
    case 'notifications': return <NotificationsBlock key={i} />
    default: return null
  }
}

// ─── Extended sections & plan data for interactive demos ─────────────────────
const EXTRA_SECTIONS = [
  { id: 'investigacion', label: '🔍 Investigación Social' },
  { id: 'notificaciones', label: '🔔 Notificaciones' },
]

const EXTRA_PLAN = {
  investigacion: {
    title: 'Investigación Social Pre-Entrevista',
    subtitle: 'Perfil de decisores: intereses, trayectoria y triggers de compra',
    content: [
      { type: 'note', text: 'El agente LangGraph busca en LinkedIn, Twitter/X y web pública. Genera un resumen accionable antes de la entrevista.' },
      { type: 'social_research' },
    ],
  },
  notificaciones: {
    title: 'Centro de Notificaciones en Tiempo Real',
    subtitle: 'SSE stream — alertas cuando leads responden',
    content: [
      { type: 'note', text: 'Notificaciones vía Server-Sent Events (SSE). El badge de la extensión de navegador también se actualiza en tiempo real.' },
      { type: 'notifications' },
    ],
  },
}

// ─── Dashboard ───────────────────────────────────────────────────────────────
export default function Dashboard() {
  const [active, setActive] = useState('resumen')

  const allSections = [...SECTIONS, ...EXTRA_SECTIONS]
  const allPlan = { ...PLAN, ...EXTRA_PLAN }
  const section = allPlan[active]

  return (
    <AppShell active={active} onNavigate={setActive} extraSections={EXTRA_SECTIONS}>
      <h1 style={{ color: T.text, fontSize: 24, fontWeight: 700, marginBottom: 6, marginTop: 0 }}>
        {section.title}
      </h1>
      {section.subtitle && (
        <div style={{ color: T.muted, fontSize: 15, marginBottom: 24 }}>{section.subtitle}</div>
      )}
      <div style={{ borderBottom: `1px solid ${T.border}`, marginBottom: 28 }} />
      {section.content.map((block, i) => renderBlock(block, i))}
    </AppShell>
  )
}
