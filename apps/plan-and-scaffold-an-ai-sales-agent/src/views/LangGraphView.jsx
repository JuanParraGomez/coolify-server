import React, { useState, useEffect } from 'react'
import { useLangGraph } from '../hooks/useLangGraph.js'

const STATUS_COLORS = {
  pending: 'var(--text-muted)',
  running: 'var(--warning)',
  completed: 'var(--success)',
  failed: 'var(--danger)',
}

export function LangGraphView() {
  const { currentRun, history, running, error, startRun, loadHistory } = useLangGraph()
  const [input, setInput] = useState('')

  useEffect(() => { loadHistory() }, [])

  const handleRun = async () => {
    if (!input.trim()) return
    await startRun(input)
    setInput('')
  }

  return (
    <div className="view">
      <div className="card-header mb-2">
        <h2 className="card-title">Agente LangGraph — Orquestación IA</h2>
      </div>

      {/* Architecture diagram */}
      <div className="card mb-2" style={{ background: 'rgba(99,102,241,0.04)' }}>
        <div className="card-header">
          <span className="card-title">Flujo del Agente</span>
          <span className="text-sm text-muted">Runtime: openai-codex/gpt-5.1-codex-mini</span>
        </div>
        <div className="flex items-center gap-1 text-sm" style={{ flexWrap: 'wrap', gap: '0.25rem 0.5rem' }}>
          {['START', 'qualify_lead', 'research_social', 'draft_message', 'review_tone', 'END'].map((node, i, arr) => (
            <React.Fragment key={node}>
              <span style={{
                padding: '4px 10px',
                borderRadius: 999,
                background: node === 'START' || node === 'END' ? 'var(--surface2)' : 'rgba(99,102,241,0.15)',
                color: node === 'START' || node === 'END' ? 'var(--text-muted)' : 'var(--primary)',
                fontSize: 12,
                fontWeight: 500,
              }}>{node}</span>
              {i < arr.length - 1 && <span className="text-muted">→</span>}
            </React.Fragment>
          ))}
        </div>
        <p className="text-sm text-muted mt-2">
          El nodo <code>review_tone</code> puede redirigir a <code>revise_draft</code> si el tono no es adecuado.
          Implementado con <strong>LangGraph</strong> en <code>/home/juan/Documents/langgraph-agent-server</code>.
        </p>
      </div>

      {/* Run form */}
      <div className="card mb-2">
        <div className="card-header">
          <span className="card-title">Ejecutar agente</span>
        </div>
        <div className="form-group">
          <label className="form-label">Instrucción para el agente</label>
          <textarea
            className="textarea"
            placeholder="Ej: Generar mensaje personalizado para María González, CTO de TechCorp, enfocado en escalabilidad de infraestructura..."
            value={input}
            onChange={e => setInput(e.target.value)}
            rows={3}
          />
        </div>
        {error && <p className="text-sm text-warning mb-1">⚠ {error} — mostrando ejecución de ejemplo.</p>}
        <button
          className="btn btn-primary"
          onClick={handleRun}
          disabled={running || !input.trim()}
        >
          {running ? <><span className="spinner" /> Ejecutando...</> : '▶ Ejecutar agente'}
        </button>
      </div>

      {/* Current run result */}
      {currentRun && (
        <div className="card mb-2">
          <div className="card-header">
            <span className="card-title">Resultado del run</span>
            <span className="badge-status" style={{
              background: `${STATUS_COLORS[currentRun.status]}22`,
              color: STATUS_COLORS[currentRun.status],
            }}>
              {currentRun.status}
            </span>
          </div>

          {/* Steps */}
          <div className="flow-steps mb-2">
            {currentRun.steps?.map((step, i) => (
              <React.Fragment key={i}>
                <div className="flow-step">
                  <span className="step-node">{step.node}</span>
                  <div className="step-result">
                    <div className="text-sm text-muted">{step.action}</div>
                    {step.result && <div className="text-sm" style={{ marginTop: 2 }}>✓ {step.result}</div>}
                  </div>
                  <span className="step-duration">{step.duration_ms}ms</span>
                </div>
                {i < currentRun.steps.length - 1 && <div className="step-connector" />}
              </React.Fragment>
            ))}
          </div>

          {currentRun.output && (
            <div style={{ padding: '0.75rem', background: 'var(--surface2)', borderRadius: 'var(--radius)', borderLeft: '3px solid var(--success)' }}>
              <div className="text-sm text-muted mb-1">Mensaje generado:</div>
              <p style={{ lineHeight: 1.6 }}>{currentRun.output}</p>
            </div>
          )}
        </div>
      )}

      {/* History */}
      {history.length > 0 && (
        <div className="card">
          <div className="card-header">
            <span className="card-title">Historial de runs</span>
          </div>
          <div className="flex flex-col gap-1">
            {history.map(run => (
              <div key={run.run_id} style={{ padding: '0.5rem 0.75rem', background: 'var(--surface2)', borderRadius: 'var(--radius)', fontSize: '13.5px' }}>
                <div className="flex justify-between items-center">
                  <span className="text-muted text-sm">{run.run_id}</span>
                  <span className="badge-status" style={{ background: `${STATUS_COLORS[run.status]}22`, color: STATUS_COLORS[run.status] }}>
                    {run.status}
                  </span>
                </div>
                <p className="mt-1" style={{ overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{run.input}</p>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  )
}
