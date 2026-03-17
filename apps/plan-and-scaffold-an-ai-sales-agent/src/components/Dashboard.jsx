/**
 * Dashboard.jsx — Panel principal del Agente de Ventas con IA
 *
 * Cubre todas las secciones del plan:
 *  1. Métricas KPI del pipeline de ventas
 *  2. Leads recientes (desde extensión de navegador)
 *  3. Alertas en tiempo real
 *  4. Generación de respuestas con IA
 *  5. Investigación social previa a entrevistas
 *  6. Orquestación con LangGraph
 *  7. Configuración de APIs (OpenAI, Gemini, Claude, DeepSeek)
 *  8. Arquitectura, stack tecnológico y cronograma (en español)
 *
 * Runtime model: openai-codex/gpt-5.1-codex-mini
 * (Nota: el modelo de runtime difiere del modelo de desarrollo claude-sonnet-4-6)
 */
import React, { useState } from 'react'
import { Link } from 'react-router-dom'
import { mockLeads } from '../lib/mock-data.js'
import { useAlerts } from '../hooks/useAlerts.js'
import { LEAD_STATUS, RUNTIME_MODEL, AI_PROVIDERS } from '../lib/constants.js'

// Compute metrics from mock data
const leadMetrics = {
  total: mockLeads.length,
  newThisWeek: mockLeads.filter(l => new Date(l.createdAt) > new Date(Date.now() - 7*24*60*60*1000)).length,
  replied: mockLeads.filter(l => l.status === 'replied').length,
  qualified: mockLeads.filter(l => l.status === 'qualified').length,
  conversionRate: Math.round((mockLeads.filter(l => l.status === 'qualified').length / mockLeads.length) * 100),
  avgResponseTime: '2.5h',
  topSource: 'extension',
}

// ─── Paleta de colores ───────────────────────────────────────────────────────
const C = {
  bg:       '#0f172a',
  surface:  '#1e293b',
  border:   '#334155',
  text:     '#e2e8f0',
  muted:    '#94a3b8',
  dim:      '#64748b',
  blue:     '#3b82f6',
  green:    '#22c55e',
  amber:    '#f59e0b',
  purple:   '#8b5cf6',
  red:      '#ef4444',
  teal:     '#14b8a6',
  indigo:   '#6366f1',
}

// ─── Estilos base ────────────────────────────────────────────────────────────
const S = {
  page:         { color: C.text },
  pageTitle:    { fontSize: '1.5rem', fontWeight: 700, marginBottom: '0.2rem' },
  pageSub:      { color: C.dim, fontSize: '0.875rem', marginBottom: '1.75rem', display: 'flex', gap: '0.5rem', alignItems: 'center', flexWrap: 'wrap' },
  runtimePill:  { background: '#3b82f622', color: C.blue, borderRadius: 20, padding: '2px 10px', fontSize: '0.72rem', fontWeight: 600, border: `1px solid ${C.blue}44` },
  section:      { marginBottom: '2rem' },
  sectionHead:  { display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.75rem' },
  sectionTitle: { fontSize: '1rem', fontWeight: 600, color: '#cbd5e1' },
  link:         { color: C.blue, textDecoration: 'none', fontSize: '0.82rem' },
  card:         { background: C.surface, borderRadius: 10, padding: '1rem 1.25rem', border: `1px solid ${C.border}` },
  pill:         (c) => ({ display: 'inline-block', background: `${c}22`, color: c, borderRadius: 6, padding: '2px 8px', fontSize: '0.72rem', fontWeight: 500 }),
  // tables
  table:        { width: '100%', borderCollapse: 'collapse' },
  th:           { textAlign: 'left', padding: '0.5rem 0.75rem', fontSize: '0.72rem', color: C.dim, borderBottom: `1px solid ${C.border}`, textTransform: 'uppercase', letterSpacing: '0.05em' },
  td:           { padding: '0.65rem 0.75rem', fontSize: '0.875rem', borderBottom: `1px solid #0f172a`, verticalAlign: 'middle' },
}

// ─── Sub-componentes utilitarios ─────────────────────────────────────────────
function MetricCard({ value, label, color = C.blue, delta, icon }) {
  return (
    <div style={{ ...S.card, display: 'flex', flexDirection: 'column', gap: 6 }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
        <span style={{ fontSize: '1.9rem', fontWeight: 700, color, lineHeight: 1 }}>{value}</span>
        {icon && <span style={{ fontSize: '1.4rem', opacity: 0.7 }}>{icon}</span>}
      </div>
      <div style={{ fontSize: '0.78rem', color: C.muted }}>{label}</div>
      {delta != null && (
        <div style={{ fontSize: '0.72rem', color: delta >= 0 ? C.green : C.red }}>
          {delta >= 0 ? '▲' : '▼'} {Math.abs(delta)}% vs semana anterior
        </div>
      )}
    </div>
  )
}

function SectionTitle({ title, linkTo, linkLabel }) {
  return (
    <div style={S.sectionHead}>
      <span style={S.sectionTitle}>{title}</span>
      {linkTo && <Link to={linkTo} style={S.link}>{linkLabel || 'Ver todos →'}</Link>}
    </div>
  )
}

// ─── Sección: Métricas KPI ────────────────────────────────────────────────────
function KpiSection({ unread }) {
  return (
    <div style={S.section}>
      <SectionTitle title="Métricas clave del pipeline" />
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(175px, 1fr))', gap: '1rem' }}>
        <MetricCard value={leadMetrics.total}               label="Leads totales"           color={C.blue}   delta={+8}  icon="👥" />
        <MetricCard value={leadMetrics.newThisWeek}         label="Nuevos esta semana"       color={C.green}  delta={+15} icon="✨" />
        <MetricCard value={leadMetrics.replied}             label="Respondieron"             color={C.amber}  delta={+3}  icon="💬" />
        <MetricCard value={leadMetrics.qualified}           label="Calificados"              color={C.purple} delta={+5}  icon="⭐" />
        <MetricCard value={`${leadMetrics.conversionRate}%`} label="Tasa de conversión"      color={C.teal}   delta={+1}  icon="📈" />
        <MetricCard value={leadMetrics.avgResponseTime}     label="Tiempo medio de respuesta" color={C.indigo}             icon="⏱️" />
        <MetricCard value={unread}                          label="Alertas sin leer"         color={C.red}                icon="🔔" />
        <MetricCard value={leadMetrics.topSource}           label="Fuente principal"         color={C.muted}              icon="🌐" />
      </div>
    </div>
  )
}

// ─── Sección: Pipeline funnel ─────────────────────────────────────────────────
function FunnelSection() {
  const stages = [
    { label: 'Nuevo',      count: 38,  color: C.blue,   pct: 100, icon: '🆕' },
    { label: 'Contactado', count: 29,  color: C.amber,  pct: 76,  icon: '📤' },
    { label: 'Respondió',  count: 20,  color: C.green,  pct: 53,  icon: '↩️' },
    { label: 'Calificado', count: 12,  color: C.purple, pct: 32,  icon: '✅' },
    { label: 'Cerrado',    count: 5,   color: C.teal,   pct: 13,  icon: '🏆' },
  ]
  return (
    <div style={S.section}>
      <SectionTitle title="Funnel de conversión" linkTo="/leads" linkLabel="Gestionar leads →" />
      <div style={{ ...S.card, padding: '1.25rem' }}>
        {stages.map((s, i) => (
          <div key={s.label} style={{ marginBottom: i < stages.length - 1 ? '0.75rem' : 0 }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 4, fontSize: '0.82rem' }}>
              <span>{s.icon} {s.label}</span>
              <span style={{ color: C.muted }}>{s.count} leads</span>
            </div>
            <div style={{ height: 8, background: '#0f172a', borderRadius: 4, overflow: 'hidden' }}>
              <div style={{ width: `${s.pct}%`, height: '100%', background: s.color, borderRadius: 4, transition: 'width 0.5s ease' }} />
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}

// ─── Sección: Leads recientes ─────────────────────────────────────────────────
function RecentLeadsSection() {
  const recent = mockLeads.slice(0, 5)
  return (
    <div style={S.section}>
      <SectionTitle title="Leads recientes" linkTo="/leads" />
      <div style={{ ...S.card, padding: 0, overflow: 'hidden' }}>
        <table style={S.table}>
          <thead>
            <tr>
              <th style={S.th}>Nombre</th>
              <th style={S.th}>Empresa</th>
              <th style={S.th}>Cargo</th>
              <th style={S.th}>Fuente</th>
              <th style={S.th}>Estado</th>
              <th style={S.th}>Score</th>
              <th style={S.th}>Acciones</th>
            </tr>
          </thead>
          <tbody>
            {recent.map(lead => {
              const st = LEAD_STATUS[lead.status] || { label: lead.status, color: C.muted }
              const scoreColor = lead.score >= 80 ? C.green : lead.score >= 50 ? C.amber : C.red
              return (
                <tr key={lead.id}>
                  <td style={S.td}>
                    <div style={{ fontWeight: 500 }}>{lead.name}</div>
                    <div style={{ fontSize: '0.72rem', color: C.dim }}>{lead.email}</div>
                  </td>
                  <td style={{ ...S.td, color: C.muted }}>{lead.company}</td>
                  <td style={{ ...S.td, color: C.muted }}>{lead.title}</td>
                  <td style={S.td}>
                    <span style={S.pill(lead.source === 'extension' ? C.blue : C.purple)}>
                      {lead.source === 'extension' ? '🧩 Extensión' : '✍️ Manual'}
                    </span>
                  </td>
                  <td style={S.td}><span style={S.pill(st.color)}>{st.label}</span></td>
                  <td style={{ ...S.td, color: scoreColor, fontWeight: 700 }}>{lead.score}</td>
                  <td style={S.td}>
                    <div style={{ display: 'flex', gap: '0.4rem' }}>
                      <Link to={`/chat?lead=${lead.id}`} style={{ ...S.link, fontSize: '0.75rem' }}>Chat</Link>
                      <Link to={`/research?lead=${lead.id}`} style={{ ...S.link, fontSize: '0.75rem' }}>Research</Link>
                    </div>
                  </td>
                </tr>
              )
            })}
          </tbody>
        </table>
      </div>
    </div>
  )
}

// ─── Sección: Actividad rápida ────────────────────────────────────────────────
function QuickActionsSection() {
  const actions = [
    { label: 'Agregar lead manual', icon: '➕', to: '/leads', color: C.blue },
    { label: 'Abrir chat de extensión', icon: '🧩', to: '/chat', color: C.indigo },
    { label: 'Generar respuesta IA', icon: '✍️', to: '/responses', color: C.teal },
    { label: 'Investigación social', icon: '🔍', to: '/research', color: C.purple },
    { label: 'Ver alertas', icon: '🔔', to: '/alerts', color: C.amber },
    { label: 'Orquestar con LangGraph', icon: '🤖', to: '/langgraph', color: C.green },
    { label: 'Configurar API keys', icon: '⚙️', to: '/settings', color: C.muted },
  ]
  return (
    <div style={S.section}>
      <SectionTitle title="Acciones rápidas" />
      <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.6rem' }}>
        {actions.map(a => (
          <Link key={a.to} to={a.to} style={{
            display: 'flex', alignItems: 'center', gap: '0.4rem',
            background: `${a.color}18`, border: `1px solid ${a.color}44`,
            color: a.color, borderRadius: 8, padding: '0.5rem 0.85rem',
            fontSize: '0.82rem', fontWeight: 500, textDecoration: 'none',
            transition: 'background 0.2s',
          }}>
            {a.icon} {a.label}
          </Link>
        ))}
      </div>
    </div>
  )
}

// ─── Sección: Alertas recientes ───────────────────────────────────────────────
function RecentAlertsSection({ alerts }) {
  const typeIcon = { reply: '↩️', view: '👁️', connection: '🔗', followup: '📅', score_change: '📊', new_lead: '🆕' }
  const priorityColor = { high: C.red, medium: C.amber, low: C.muted }
  return (
    <div style={S.section}>
      <SectionTitle title="Alertas recientes" linkTo="/alerts" />
      <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
        {alerts.slice(0, 4).map(a => (
          <div key={a.id} style={{
            ...S.card,
            borderLeft: `3px solid ${a.read ? C.border : C.blue}`,
            padding: '0.75rem 1rem',
            display: 'flex', gap: '0.75rem', alignItems: 'flex-start',
          }}>
            <span style={{ fontSize: '1.2rem', flexShrink: 0 }}>{typeIcon[a.type] || '📌'}</span>
            <div style={{ flex: 1 }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', gap: '0.5rem', flexWrap: 'wrap' }}>
                <span style={{ fontSize: '0.875rem', fontWeight: a.read ? 400 : 600 }}>{a.message}</span>
                <span style={S.pill(priorityColor[a.priority] || C.muted)}>{a.priority}</span>
              </div>
              <div style={{ fontSize: '0.72rem', color: C.dim, marginTop: 4 }}>
                {a.lead?.name} · {a.lead?.company} · {new Date(a.timestamp ?? a.created_at).toLocaleString('es-MX')}
              </div>
            </div>
            {!a.read && <div style={{ width: 8, height: 8, borderRadius: '50%', background: C.blue, flexShrink: 0, marginTop: 4 }} />}
          </div>
        ))}
      </div>
    </div>
  )
}

// ─── Sección: Arquitectura del sistema ────────────────────────────────────────
function ArchitectureSection() {
  const layers = [
    {
      title: '🧩 Capa de Captura (Extensión de Navegador)',
      color: C.blue,
      items: [
        'Chrome/Firefox Extension — chat embebido en LinkedIn, páginas web',
        'Extrae perfil: nombre, empresa, cargo, URL de LinkedIn',
        'Envía datos al backend vía REST API autenticada',
        'Panel flotante para chatear con leads directamente',
      ],
    },
    {
      title: '🤖 Capa de IA y Orquestación (LangGraph)',
      color: C.purple,
      items: [
        'Grafo de estado: qualify_lead → research_social → draft_message → review_tone',
        'Calificación automática de leads por score (0-100)',
        'Redacción de mensajes con tono personalizable (5 opciones)',
        'Revisión de tono y coherencia antes de enviar',
        'Historial de ejecuciones persistido en backend',
      ],
    },
    {
      title: '🔍 Capa de Investigación Social',
      color: C.teal,
      items: [
        'Scraping ético de LinkedIn (perfil público)',
        'Análisis de publicaciones recientes y actividad',
        'Generación de talking points personalizados (5+)',
        'Resumen ejecutivo del decision-maker',
        'Intereses, tono de comunicación y afinidades',
      ],
    },
    {
      title: '🔔 Capa de Alertas y Notificaciones',
      color: C.amber,
      items: [
        'Polling cada 30 segundos en tiempo real',
        'Tipos: reply, view, connection, followup, score_change, new_lead',
        'Prioridad alta/media/baja con colores diferenciados',
        'Respuesta sugerida con un clic',
        'Badge de no leídos en el sidebar',
      ],
    },
    {
      title: '⚙️ Capa de Configuración Multi-proveedor',
      color: C.indigo,
      items: [
        'Soporta: OpenAI (gpt-4o, gpt-5.1-codex-mini), Gemini (2.5 Pro), Claude (Sonnet 4.6), DeepSeek',
        'Validación de API keys en tiempo real',
        'Selección de modelo por proveedor',
        'Configuración del servidor LangGraph (URL personalizable)',
        'Persistencia en localStorage cifrada',
      ],
    },
  ]

  return (
    <div style={S.section}>
      <SectionTitle title="Arquitectura del sistema" />
      <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
        {layers.map(layer => (
          <div key={layer.title} style={{ ...S.card, borderLeft: `3px solid ${layer.color}` }}>
            <div style={{ fontWeight: 600, marginBottom: '0.5rem', color: layer.color, fontSize: '0.9rem' }}>{layer.title}</div>
            <ul style={{ listStyle: 'none', padding: 0, margin: 0, display: 'flex', flexDirection: 'column', gap: 4 }}>
              {layer.items.map((item, i) => (
                <li key={i} style={{ fontSize: '0.82rem', color: C.muted, paddingLeft: '1rem', position: 'relative' }}>
                  <span style={{ position: 'absolute', left: 0, color: layer.color }}>›</span>
                  {item}
                </li>
              ))}
            </ul>
          </div>
        ))}
      </div>
    </div>
  )
}

// ─── Sección: Flujo de datos ──────────────────────────────────────────────────
function DataFlowSection() {
  const steps = [
    { icon: '🧩', label: 'Extensión captura lead', desc: 'LinkedIn / web → perfil extraído' },
    { icon: '📡', label: 'API REST recibe datos', desc: 'POST /api/leads — autenticado con Bearer token' },
    { icon: '🤖', label: 'LangGraph califica', desc: 'qualify_lead node — score 0-100 basado en perfil' },
    { icon: '🔍', label: 'Investiga social', desc: 'research_social node — scraping ético + análisis' },
    { icon: '✍️', label: 'Redacta mensaje IA', desc: 'draft_message node — modelo configurable (OpenAI/Gemini/Claude/DeepSeek)' },
    { icon: '🎨', label: 'Revisa tono', desc: 'review_tone node — ajusta estilo (profesional/amigable/directo)' },
    { icon: '🔔', label: 'Notifica al vendedor', desc: 'Alert creada → polling frontend → badge unread' },
    { icon: '📤', label: 'Vendedor envía', desc: 'Aprueba y envía desde el chat de extensión o UI' },
  ]

  return (
    <div style={S.section}>
      <SectionTitle title="Flujo de datos" />
      <div style={{ ...S.card, padding: '1.25rem' }}>
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.5rem', alignItems: 'center' }}>
          {steps.map((step, i) => (
            <React.Fragment key={step.label}>
              <div style={{ background: '#0f172a', borderRadius: 8, padding: '0.6rem 0.85rem', border: `1px solid ${C.border}`, minWidth: 120, maxWidth: 160 }}>
                <div style={{ fontSize: '1.1rem', marginBottom: 2 }}>{step.icon}</div>
                <div style={{ fontSize: '0.78rem', fontWeight: 600, color: C.text }}>{step.label}</div>
                <div style={{ fontSize: '0.7rem', color: C.dim, marginTop: 2 }}>{step.desc}</div>
              </div>
              {i < steps.length - 1 && (
                <span style={{ color: C.blue, fontSize: '1.2rem', flexShrink: 0 }}>→</span>
              )}
            </React.Fragment>
          ))}
        </div>
      </div>
    </div>
  )
}

// ─── Sección: Stack tecnológico ───────────────────────────────────────────────
function TechStackSection() {
  const stack = [
    {
      category: '🖥️ Frontend',
      color: C.blue,
      items: ['React 18 + Vite 5', 'react-router-dom v6', 'Inline styles + CSS variables', 'LocalStorage para config'],
    },
    {
      category: '🧩 Extensión de Navegador',
      color: C.indigo,
      items: ['Manifest V3 (Chrome/Firefox)', 'Content Script + Background SW', 'Panel flotante (Shadow DOM)', 'OAuth / Bearer token'],
    },
    {
      category: '⚙️ Backend',
      color: C.teal,
      items: ['FastAPI (Python 3.11+)', 'Pydantic v2 para validación', 'SQLAlchemy + PostgreSQL', 'JWT para autenticación'],
    },
    {
      category: '🤖 IA y Orquestación',
      color: C.purple,
      items: ['LangGraph (StateGraph, nodes, edges)', 'LangChain para prompts y chains', 'Multi-proveedor: OpenAI / Gemini / Claude / DeepSeek', `Runtime model: ${RUNTIME_MODEL}`],
    },
    {
      category: '🔍 Investigación Social',
      color: C.amber,
      items: ['Playwright / Puppeteer (scraping ético)', 'LinkedIn Public API (cuando disponible)', 'NLP con LangChain summarization', 'Cache de perfiles (Redis / TTL 24h)'],
    },
    {
      category: '🚀 Infraestructura',
      color: C.green,
      items: ['Docker + Docker Compose', 'Coolify para despliegue', 'Nginx como proxy inverso', 'Variables de entorno via .env'],
    },
  ]

  return (
    <div style={S.section}>
      <SectionTitle title="Stack tecnológico" />
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(260px, 1fr))', gap: '0.75rem' }}>
        {stack.map(s => (
          <div key={s.category} style={{ ...S.card, borderTop: `3px solid ${s.color}` }}>
            <div style={{ fontWeight: 600, marginBottom: '0.5rem', color: s.color, fontSize: '0.88rem' }}>{s.category}</div>
            <ul style={{ listStyle: 'none', padding: 0, margin: 0 }}>
              {s.items.map((item, i) => (
                <li key={i} style={{ fontSize: '0.78rem', color: C.muted, padding: '2px 0 2px 0.75rem', position: 'relative' }}>
                  <span style={{ position: 'absolute', left: 0, color: s.color }}>·</span>
                  {item}
                </li>
              ))}
            </ul>
          </div>
        ))}
      </div>
    </div>
  )
}

// ─── Sección: Configuración de APIs ──────────────────────────────────────────
function ApiConfigStatusSection() {
  const [activeProvider, setActiveProvider] = useState(null)

  const providers = Object.values(AI_PROVIDERS)
  const providerColors = { openai: C.green, gemini: C.blue, claude: C.amber, deepseek: C.purple }

  return (
    <div style={S.section}>
      <SectionTitle title="Proveedores de IA configurables" linkTo="/settings" linkLabel="Configurar →" />
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(200px, 1fr))', gap: '0.75rem' }}>
        {providers.map(p => {
          const color = providerColors[p.id] || C.blue
          const isActive = activeProvider === p.id
          return (
            <div
              key={p.id}
              onClick={() => setActiveProvider(isActive ? null : p.id)}
              style={{
                ...S.card,
                borderColor: isActive ? color : C.border,
                cursor: 'pointer',
                transition: 'border-color 0.2s',
              }}
            >
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 6 }}>
                <span style={{ fontWeight: 600, color, fontSize: '0.88rem' }}>{p.label}</span>
                <span style={{ fontSize: '0.72rem', color: C.dim }}>
                  {p.models.length} modelos
                </span>
              </div>
              <div style={{ fontSize: '0.72rem', color: C.dim }}>
                {p.models.slice(0, 2).join(', ')}{p.models.length > 2 ? '...' : ''}
              </div>
              {isActive && (
                <div style={{ marginTop: '0.6rem', paddingTop: '0.6rem', borderTop: `1px solid ${C.border}` }}>
                  {p.models.map(m => (
                    <div key={m} style={{ fontSize: '0.75rem', color: C.muted, padding: '1px 0' }}>· {m}</div>
                  ))}
                </div>
              )}
            </div>
          )
        })}
      </div>
      <div style={{ marginTop: '0.75rem', ...S.card, borderColor: `${C.blue}44`, background: `${C.blue}0a`, padding: '0.75rem 1rem' }}>
        <span style={{ fontSize: '0.8rem', color: C.blue }}>
          ⚠️ Modelo de runtime: <strong>{RUNTIME_MODEL}</strong> (difiere del modelo de desarrollo claude-sonnet-4-6).
          Configura tu API key en <Link to="/settings" style={{ color: C.blue }}>Ajustes</Link> para usar el proveedor de tu elección.
        </span>
      </div>
    </div>
  )
}

// ─── Sección: LangGraph — pasos para construir el agente ─────────────────────
function LangGraphSection() {
  const nodes = [
    { id: 'START',          color: C.dim,    icon: '⬤',  label: 'START' },
    { id: 'qualify_lead',   color: C.blue,   icon: '🎯',  label: 'qualify_lead' },
    { id: 'research_social',color: C.teal,   icon: '🔍',  label: 'research_social' },
    { id: 'draft_message',  color: C.purple, icon: '✍️',  label: 'draft_message' },
    { id: 'review_tone',    color: C.amber,  icon: '🎨',  label: 'review_tone' },
    { id: 'END',            color: C.green,  icon: '⬤',  label: 'END' },
  ]

  const steps = [
    {
      step: '1. Instalar dependencias',
      code: 'pip install langgraph langchain-openai langchain-anthropic',
    },
    {
      step: '2. Definir el estado del grafo',
      code: `from langgraph.graph import StateGraph, END
from typing import TypedDict

class SalesAgentState(TypedDict):
    lead: dict
    score: int
    research: dict
    draft: str
    tone: str
    final_message: str`,
    },
    {
      step: '3. Crear los nodos del agente',
      code: `def qualify_lead(state):
    # Califica el lead 0-100 basado en perfil
    return {"score": calculate_score(state["lead"])}

def research_social(state):
    # Investiga LinkedIn y datos sociales
    return {"research": fetch_social_data(state["lead"])}

def draft_message(state):
    # Genera borrador con el modelo configurado
    # Runtime: ${RUNTIME_MODEL}
    return {"draft": llm.invoke(build_prompt(state))}

def review_tone(state):
    # Ajusta tono y retorna mensaje final
    return {"final_message": adjust_tone(state["draft"], state["tone"])}`,
    },
    {
      step: '4. Construir y compilar el grafo',
      code: `graph = StateGraph(SalesAgentState)
graph.add_node("qualify_lead", qualify_lead)
graph.add_node("research_social", research_social)
graph.add_node("draft_message", draft_message)
graph.add_node("review_tone", review_tone)

graph.set_entry_point("qualify_lead")
graph.add_edge("qualify_lead", "research_social")
graph.add_edge("research_social", "draft_message")
graph.add_edge("draft_message", "review_tone")
graph.add_edge("review_tone", END)

app = graph.compile()`,
    },
    {
      step: '5. Exponer vía FastAPI',
      code: `@router.post("/api/agent/run")
async def run_agent(body: AgentRunRequest):
    result = await app.ainvoke({
        "lead": body.lead,
        "tone": body.tone or "profesional"
    })
    return AgentRunResponse(
        run_id=str(uuid4()),
        status="completed",
        output=result["final_message"],
        steps=result
    )`,
    },
  ]

  return (
    <div style={S.section}>
      <SectionTitle title="Orquestación con LangGraph" linkTo="/langgraph" linkLabel="Ejecutar agente →" />

      {/* Diagrama de flujo visual */}
      <div style={{ ...S.card, marginBottom: '1rem', padding: '1.25rem' }}>
        <div style={{ fontSize: '0.8rem', color: C.dim, marginBottom: '0.75rem' }}>Grafo de estado del agente de ventas</div>
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', flexWrap: 'wrap' }}>
          {nodes.map((node, i) => (
            <React.Fragment key={node.id}>
              <div style={{
                background: `${node.color}18`,
                border: `1px solid ${node.color}55`,
                borderRadius: 8,
                padding: '0.4rem 0.75rem',
                fontSize: '0.78rem',
                color: node.color,
                fontWeight: 500,
                display: 'flex', alignItems: 'center', gap: '0.3rem',
              }}>
                {node.icon} {node.label}
              </div>
              {i < nodes.length - 1 && (
                <span style={{ color: C.dim, fontSize: '1rem' }}>→</span>
              )}
            </React.Fragment>
          ))}
        </div>
      </div>

      {/* Pasos de implementación */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: '0.6rem' }}>
        {steps.map(s => (
          <div key={s.step} style={{ ...S.card, padding: '0.85rem 1rem' }}>
            <div style={{ fontSize: '0.82rem', fontWeight: 600, color: C.text, marginBottom: '0.4rem' }}>{s.step}</div>
            <pre style={{
              background: '#0a0f1a',
              borderRadius: 6,
              padding: '0.65rem 0.85rem',
              fontSize: '0.72rem',
              color: '#94a3b8',
              overflowX: 'auto',
              margin: 0,
              border: `1px solid ${C.border}`,
              lineHeight: 1.5,
            }}>{s.code}</pre>
          </div>
        ))}
      </div>
    </div>
  )
}

// ─── Sección: Cronograma de implementación ───────────────────────────────────
function TimelineSection() {
  const phases = [
    {
      phase: 'Semana 1–2',
      title: 'Infraestructura base',
      color: C.blue,
      tasks: [
        'Scaffolding del proyecto (React + FastAPI + Docker)',
        'Autenticación JWT y gestión de usuarios',
        'Modelo de datos: leads, mensajes, alertas',
        'Extensión de navegador MVP (captura de perfil)',
      ],
      status: 'completado',
    },
    {
      phase: 'Semana 3–4',
      title: 'Pipeline de IA con LangGraph',
      color: C.purple,
      tasks: [
        'Integración multi-proveedor (OpenAI, Gemini, Claude, DeepSeek)',
        'Grafo de calificación y redacción de mensajes',
        `Modelo de runtime: ${RUNTIME_MODEL}`,
        'API de investigación social (scraping ético)',
      ],
      status: 'en progreso',
    },
    {
      phase: 'Semana 5–6',
      title: 'UI completa y alertas',
      color: C.teal,
      tasks: [
        'Dashboard, Leads, Chat, Responses, Research, Alerts',
        'Sistema de alertas con polling en tiempo real',
        'Configuración de API keys multi-proveedor',
        'Panel de orquestación LangGraph con logs',
      ],
      status: 'en progreso',
    },
    {
      phase: 'Semana 7–8',
      title: 'Despliegue y optimización',
      color: C.green,
      tasks: [
        'CI/CD con GitHub Actions',
        'Despliegue en Coolify (auto-deploy en push)',
        'Pruebas de integración y carga',
        'Documentación técnica y guía de uso',
      ],
      status: 'pendiente',
    },
  ]

  const statusColor = { completado: C.green, 'en progreso': C.amber, pendiente: C.dim }

  return (
    <div style={S.section}>
      <SectionTitle title="Cronograma de implementación" />
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))', gap: '0.75rem' }}>
        {phases.map(p => (
          <div key={p.phase} style={{ ...S.card, borderTop: `3px solid ${p.color}` }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '0.5rem' }}>
              <div>
                <div style={{ fontSize: '0.72rem', color: p.color, fontWeight: 600, marginBottom: 2 }}>{p.phase}</div>
                <div style={{ fontSize: '0.88rem', fontWeight: 600 }}>{p.title}</div>
              </div>
              <span style={S.pill(statusColor[p.status])}>{p.status}</span>
            </div>
            <ul style={{ listStyle: 'none', padding: 0, margin: 0 }}>
              {p.tasks.map((t, i) => (
                <li key={i} style={{ fontSize: '0.78rem', color: C.muted, padding: '2px 0 2px 0.75rem', position: 'relative' }}>
                  <span style={{ position: 'absolute', left: 0, color: p.color }}>·</span>
                  {t}
                </li>
              ))}
            </ul>
          </div>
        ))}
      </div>
    </div>
  )
}

// ─── Componente principal Dashboard ──────────────────────────────────────────
export default function Dashboard() {
  const { alerts } = useAlerts()
  const { leads } = useLeads()

  const unread = alerts.filter(a => !a.read).length

  return (
    <div style={S.page}>
      {/* Encabezado */}
      <h1 style={S.pageTitle}>Panel de Control — Agente de Ventas con IA</h1>
      <p style={S.pageSub}>
        <span>Resumen completo del pipeline · AI Sales Agent</span>
        <span style={S.runtimePill}>Runtime: {RUNTIME_MODEL}</span>
        <span style={{ ...S.runtimePill, background: '#8b5cf622', color: C.purple, borderColor: `${C.purple}44` }}>
          Dev: claude-sonnet-4-6
        </span>
      </p>

      {/* Secciones principales */}
      <KpiSection unread={unread} />
      <QuickActionsSection />

      {/* Dos columnas: leads + alertas */}
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 380px', gap: '1.5rem', marginBottom: '2rem' }}>
        <div>
          <FunnelSection />
          <RecentLeadsSection leads={leads} />
        </div>
        <div>
          <RecentAlertsSection alerts={alerts} />
          <ApiConfigStatusSection />
        </div>
      </div>

      {/* Secciones de arquitectura y plan */}
      <LangGraphSection />
      <DataFlowSection />
      <ArchitectureSection />
      <TechStackSection />
      <TimelineSection />
    </div>
  )
}
