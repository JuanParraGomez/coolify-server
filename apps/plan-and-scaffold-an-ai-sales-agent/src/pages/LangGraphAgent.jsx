import React, { useState, useEffect } from 'react'
import { useLangGraph } from '../hooks/useLangGraph.js'
import { RUNTIME_MODEL } from '../lib/constants.js'

/**
 * Página de orquestación del agente de ventas con LangGraph.
 *
 * Flujo del agente:
 *   [START] → qualify_lead → research_social → draft_message → review_tone → [END]
 *                                                                  ↓ (si falla)
 *                                                             revise_draft → review_tone
 *
 * Runtime predeterminado: openai-codex/gpt-5.1-codex-mini
 * (el runtime difiere del modelo de desarrollo: claude-sonnet-4-6)
 *
 * Servidor LangGraph: /home/juan/Documents/langgraph-agent-server
 */

const STATUS_INFO = {
  pending:   { color: '#64748b', label: 'Pendiente' },
  running:   { color: '#f59e0b', label: 'Ejecutando' },
  completed: { color: '#22c55e', label: 'Completado' },
  failed:    { color: '#ef4444', label: 'Fallido' },
}

const S = {
  h1:      { fontSize: '1.4rem', fontWeight: 700, marginBottom: '0.25rem' },
  sub:     { color: '#64748b', fontSize: '0.875rem', marginBottom: '1.5rem' },
  grid:    { display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1.25rem' },
  panel:   { background: '#1e293b', borderRadius: 10, border: '1px solid #334155', padding: '1.25rem', marginBottom: '1.25rem' },
  panelT:  { fontSize: '0.8rem', fontWeight: 600, color: '#94a3b8', textTransform: 'uppercase', letterSpacing: '0.05em', marginBottom: '0.875rem' },
  flow:    { display: 'flex', alignItems: 'center', gap: '0.35rem', flexWrap: 'wrap', marginBottom: '0.75rem' },
  node:    (active) => ({
    padding: '3px 10px', borderRadius: 999, fontSize: '0.75rem', fontWeight: 600,
    background: active ? '#3b82f620' : '#334155',
    color: active ? '#3b82f6' : '#94a3b8',
    border: `1px solid ${active ? '#3b82f6' : 'transparent'}`,
  }),
  arrow:   { color: '#475569', fontSize: '0.875rem' },
  label:   { fontSize: '0.8rem', color: '#94a3b8', marginBottom: 4, display: 'block' },
  textarea: { width: '100%', background: '#0f172a', border: '1px solid #334155', borderRadius: 8, padding: '0.5rem 0.75rem', color: '#e2e8f0', fontSize: '0.875rem', resize: 'vertical', minHeight: 80, fontFamily: 'inherit' },
  btn:     (disabled) => ({
    background: disabled ? '#334155' : '#3b82f6',
    color: disabled ? '#64748b' : '#fff',
    border: 'none', borderRadius: 8, padding: '0.6rem 1.25rem',
    cursor: disabled ? 'not-allowed' : 'pointer', fontSize: '0.875rem', width: '100%', marginTop: '0.75rem',
  }),
  step:    { display: 'flex', gap: '0.75rem', padding: '0.6rem 0.75rem', background: '#0f172a', borderRadius: 8, marginBottom: '0.5rem', alignItems: 'flex-start' },
  stepN:   { fontWeight: 600, fontSize: '0.78rem', color: '#3b82f6', minWidth: 140, paddingTop: 1 },
  output:  { background: '#0f172a', border: '1px solid #22c55e', borderRadius: 8, padding: '1rem', fontSize: '0.875rem', lineHeight: 1.6, color: '#e2e8f0', whiteSpace: 'pre-wrap', marginTop: '0.75rem' },
  pill:    (c) => ({ display: 'inline-block', background: `${c}22`, color: c, borderRadius: 6, padding: '2px 8px', fontSize: '0.75rem', fontWeight: 600, marginLeft: '0.5rem' }),
  info:    { background: '#0f172a', border: '1px solid #334155', borderRadius: 8, padding: '0.75rem 1rem', fontSize: '0.8rem', color: '#64748b', lineHeight: 1.7, marginTop: '0.75rem' },
  copy:    { background: 'transparent', border: '1px solid #334155', color: '#94a3b8', borderRadius: 6, padding: '0.3rem 0.75rem', cursor: 'pointer', fontSize: '0.78rem', marginTop: '0.5rem' },
}

const FLOW_NODES = ['START', 'qualify_lead', 'research_social', 'draft_message', 'review_tone', 'END']

export default function LangGraphAgent() {
  const { currentRun, history, running, error, startRun, loadHistory } = useLangGraph()
  const [input, setInput] = useState('')
  const [copied, setCopied] = useState(false)

  useEffect(() => { loadHistory() }, [loadHistory])

  const activeNode = running && currentRun?.steps
    ? FLOW_NODES[Math.min(currentRun.steps.length, FLOW_NODES.length - 1)]
    : null

  const handleRun = () => {
    if (!input.trim() || running) return
    startRun(input)
    setInput('')
  }

  return (
    <div>
      <h1 style={S.h1}>Agente LangGraph</h1>
      <p style={S.sub}>
        Orquesta el pipeline completo de ventas con IA. Runtime:{' '}
        <strong style={{ color: '#3b82f6' }}>{RUNTIME_MODEL}</strong>
        <span style={{ color: '#64748b', fontSize: '0.8rem' }}> · difiere del modelo de desarrollo</span>
      </p>

      <div style={S.grid}>
        {/* Izquierda: entrada y flujo */}
        <div>
          <div style={S.panel}>
            <div style={S.panelT}>Flujo del Agente</div>
            <div style={S.flow}>
              {FLOW_NODES.map((node, i) => (
                <React.Fragment key={node}>
                  <span style={S.node(node === activeNode)}>
                    {node === activeNode && running ? '⏳ ' : ''}{node}
                  </span>
                  {i < FLOW_NODES.length - 1 && <span style={S.arrow}>→</span>}
                </React.Fragment>
              ))}
            </div>
            <div style={S.info}>
              <strong style={{ color: '#cbd5e1' }}>qualify_lead</strong> — evalúa ICP y score<br />
              <strong style={{ color: '#cbd5e1' }}>research_social</strong> — extrae datos públicos LinkedIn/web<br />
              <strong style={{ color: '#cbd5e1' }}>draft_message</strong> — redacta mensaje personalizado<br />
              <strong style={{ color: '#cbd5e1' }}>review_tone</strong> — valida tono; reenvía a <strong>revise_draft</strong> si falla
            </div>
          </div>

          <div style={S.panel}>
            <div style={S.panelT}>Ejecutar Agente</div>
            <label style={S.label}>Instrucción</label>
            <textarea
              style={S.textarea}
              rows={3}
              placeholder="Ej: Generar mensaje personalizado para Sofía Ramírez, CTO de StartupAI, enfocado en automatización de pipeline..."
              value={input}
              onChange={e => setInput(e.target.value)}
            />
            {error && <div style={{ fontSize: '0.8rem', color: '#f59e0b', marginTop: '0.5rem' }}>⚠ Backend no disponible — datos de ejemplo.</div>}
            <button style={S.btn(running || !input.trim())} onClick={handleRun} disabled={running || !input.trim()}>
              {running ? '⏳ Ejecutando agente...' : '▶ Ejecutar agente'}
            </button>
          </div>

          {history.length > 0 && (
            <div style={S.panel}>
              <div style={S.panelT}>Historial</div>
              {history.map(run => {
                const st = STATUS_INFO[run.status] ?? STATUS_INFO.pending
                return (
                  <div key={run.run_id} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '0.5rem 0.75rem', background: '#0f172a', borderRadius: 8, marginBottom: '0.4rem' }}>
                    <span style={{ fontSize: '0.8rem', flex: 1, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap', marginRight: '0.75rem', color: '#e2e8f0' }}>{run.input}</span>
                    <span style={S.pill(st.color)}>{st.label}</span>
                  </div>
                )
              })}
            </div>
          )}
        </div>

        {/* Derecha: resultado */}
        <div style={S.panel}>
          <div style={S.panelT}>
            Resultado del Run
            {currentRun && (
              <span style={S.pill(STATUS_INFO[currentRun.status]?.color ?? '#64748b')}>
                {STATUS_INFO[currentRun.status]?.label ?? currentRun.status}
              </span>
            )}
          </div>

          {!currentRun && !running && (
            <div style={{ color: '#64748b', fontSize: '0.875rem', padding: '3rem 0', textAlign: 'center' }}>
              Ejecuta el agente para ver los pasos aquí.
            </div>
          )}

          {(currentRun?.steps ?? []).map((step, i) => (
            <div key={i} style={S.step}>
              <span style={S.stepN}>{step.node}</span>
              <div>
                <div style={{ fontSize: '0.75rem', color: '#64748b' }}>{step.action}</div>
                {step.result && <div style={{ fontSize: '0.8rem', color: '#cbd5e1' }}>✓ {step.result}</div>}
                <div style={{ fontSize: '0.7rem', color: '#475569', marginTop: 2 }}>{step.duration_ms}ms</div>
              </div>
            </div>
          ))}

          {running && (
            <div style={{ ...S.step, borderLeft: '2px solid #f59e0b' }}>
              <span style={{ ...S.stepN, color: '#f59e0b' }}>⏳ procesando...</span>
            </div>
          )}

          {currentRun?.output && (
            <>
              <div style={{ ...S.panelT, marginTop: '1rem' }}>Mensaje generado</div>
              <div style={S.output}>{currentRun.output}</div>
              <button style={S.copy} onClick={() => { navigator.clipboard.writeText(currentRun.output); setCopied(true); setTimeout(() => setCopied(false), 2000) }}>
                {copied ? '✓ Copiado' : '📋 Copiar mensaje'}
              </button>
            </>
          )}

          <div style={S.info}>
            Servidor: <code>/home/juan/Documents/langgraph-agent-server</code><br />
            Configura la URL en: <strong>Config API → Servidor LangGraph</strong>
          </div>
        </div>
      </div>
    </div>
  )
}
