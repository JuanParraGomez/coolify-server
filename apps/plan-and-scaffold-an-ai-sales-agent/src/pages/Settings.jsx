import React, { useState } from 'react'
import { useApiConfig } from '../hooks/useApiConfig.js'
import { AI_PROVIDERS, RUNTIME_MODEL } from '../lib/constants.js'

/**
 * Página de configuración de proveedores de IA y servidor LangGraph.
 * Soporta: OpenAI, Google Gemini, Anthropic Claude, DeepSeek.
 *
 * NOTA DE RUNTIME: modelo de desarrollo = claude-sonnet-4-6
 * Modelo de runtime predeterminado = openai-codex/gpt-5.1-codex-mini
 */

const S = {
  h1:      { fontSize: '1.4rem', fontWeight: 700, marginBottom: '0.25rem' },
  sub:     { color: '#64748b', fontSize: '0.875rem', marginBottom: '1.5rem' },
  grid:    { display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1.25rem' },
  panel:   { background: '#1e293b', borderRadius: 10, border: '1px solid #334155', padding: '1.25rem', marginBottom: '1.25rem' },
  panelT:  { fontSize: '0.85rem', fontWeight: 600, marginBottom: '1rem', color: '#e2e8f0' },
  label:   { fontSize: '0.8rem', color: '#94a3b8', marginBottom: 4, display: 'block' },
  input:   { width: '100%', background: '#0f172a', border: '1px solid #334155', borderRadius: 8, padding: '0.5rem 0.75rem', color: '#e2e8f0', fontSize: '0.875rem' },
  select:  { width: '100%', background: '#0f172a', border: '1px solid #334155', borderRadius: 8, padding: '0.5rem 0.75rem', color: '#e2e8f0', fontSize: '0.875rem' },
  field:   { marginBottom: '1rem' },
  provGrid:{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '0.75rem', marginBottom: '1rem' },
  provCard:(active) => ({
    padding: '0.875rem', borderRadius: 8, cursor: 'pointer',
    border: `2px solid ${active ? '#3b82f6' : '#334155'}`,
    background: active ? '#3b82f610' : 'transparent',
  }),
  provName:{ fontWeight: 600, fontSize: '0.875rem', marginBottom: 2 },
  provMods:{ fontSize: '0.72rem', color: '#64748b' },
  btnRow:  { display: 'flex', gap: '0.75rem', marginTop: '0.75rem' },
  btn:     (c = '#3b82f6', outlined) => ({
    flex: outlined ? 'none' : 1,
    background: outlined ? 'transparent' : c,
    color: outlined ? c : '#fff',
    border: `1px solid ${outlined ? c : 'transparent'}`,
    borderRadius: 8, padding: '0.55rem 1rem', cursor: 'pointer', fontSize: '0.875rem',
  }),
  ok:      { color: '#22c55e', fontSize: '0.8rem', marginTop: '0.4rem' },
  err:     { color: '#ef4444', fontSize: '0.8rem', marginTop: '0.4rem' },
  warn:    { background: '#f59e0b15', border: '1px solid #f59e0b40', borderRadius: 8, padding: '0.75rem 1rem', fontSize: '0.8rem', color: '#fbbf24', marginBottom: '1.25rem', lineHeight: 1.6 },
  code:    { background: '#334155', borderRadius: 4, padding: '1px 5px', fontFamily: 'monospace', fontSize: '0.85em' },
  row:     { display: 'flex', justifyContent: 'space-between', padding: '0.4rem 0', borderBottom: '1px solid #0f172a', fontSize: '0.8rem' },
  rowK:    { color: '#64748b' },
  rowV:    { color: '#e2e8f0', fontFamily: 'monospace', fontSize: '0.78rem' },
  pill:    { background: '#3b82f620', color: '#3b82f6', borderRadius: 6, padding: '2px 8px', fontSize: '0.75rem', fontWeight: 600, marginLeft: '0.5rem' },
}

export default function Settings() {
  const { config, updateConfig, validateKey, validating, validationResult, clearConfig } = useApiConfig()
  const [lgUrl, setLgUrl] = useState(() => localStorage.getItem('langgraph_url') || 'http://localhost:2024')
  const [lgSaved, setLgSaved] = useState(false)

  const currentProvider = AI_PROVIDERS[config.provider]

  const saveLg = () => {
    localStorage.setItem('langgraph_url', lgUrl)
    setLgSaved(true)
    setTimeout(() => setLgSaved(false), 2000)
  }

  return (
    <div>
      <h1 style={S.h1}>Configuración de API</h1>
      <p style={S.sub}>Gestiona las claves de IA y la conexión con el servidor LangGraph.</p>

      <div style={S.warn}>
        ⚠️ <strong>Nota de runtime:</strong>{' '}
        Modelo de desarrollo: <span style={S.code}>claude-sonnet-4-6</span>.{' '}
        Modelo de runtime predeterminado: <span style={S.code}>{RUNTIME_MODEL}</span> (openai-codex/gpt-5.1-codex-mini).
        El runtime puede diferir según el proveedor configurado.
      </div>

      <div style={S.grid}>
        <div>
          <div style={S.panel}>
            <div style={S.panelT}>Proveedor de IA</div>
            <div style={S.provGrid}>
              {Object.values(AI_PROVIDERS).map(p => (
                <div key={p.id} style={S.provCard(config.provider === p.id)} onClick={() => updateConfig({ provider: p.id })}>
                  <div style={S.provName}>{p.label}</div>
                  <div style={S.provMods}>{p.models.slice(0, 2).join(', ')}</div>
                </div>
              ))}
            </div>

            <div style={S.field}>
              <label style={S.label}>
                API Key — {currentProvider?.label}
                {validationResult?.ok && <span style={S.pill}>✓ válida</span>}
              </label>
              <div style={{ display: 'flex', gap: '0.5rem' }}>
                <input style={S.input} type="password"
                  placeholder={`${currentProvider?.label ?? ''} API key...`}
                  value={config.apiKey}
                  onChange={e => updateConfig({ apiKey: e.target.value })}
                />
                <button style={{ ...S.btn(), flex: 'none' }} onClick={validateKey} disabled={validating || !config.apiKey}>
                  {validating ? '⏳' : 'Validar'}
                </button>
              </div>
              {validationResult && (
                <div style={validationResult.ok ? S.ok : S.err}>{validationResult.message}</div>
              )}
              <a href={currentProvider?.docsUrl} target="_blank" rel="noopener noreferrer"
                style={{ display: 'inline-block', marginTop: '0.4rem', fontSize: '0.78rem', color: '#3b82f6' }}>
                Obtener API key →
              </a>
            </div>

            <div style={S.field}>
              <label style={S.label}>Modelo</label>
              <select style={S.select} value={config.model} onChange={e => updateConfig({ model: e.target.value })}>
                {(currentProvider?.models ?? []).map(m => <option key={m} value={m}>{m}</option>)}
              </select>
            </div>

            <div style={S.btnRow}>
              <button style={S.btn('#ef4444', true)} onClick={clearConfig}>Limpiar configuración</button>
            </div>
          </div>
        </div>

        <div>
          <div style={S.panel}>
            <div style={S.panelT}>Servidor LangGraph</div>
            <div style={S.field}>
              <label style={S.label}>URL del servidor</label>
              <div style={{ display: 'flex', gap: '0.5rem' }}>
                <input style={S.input} value={lgUrl} onChange={e => setLgUrl(e.target.value)} placeholder="http://localhost:2024" />
                <button style={{ ...S.btn(), flex: 'none' }} onClick={saveLg}>{lgSaved ? '✓' : 'Guardar'}</button>
              </div>
              <div style={{ fontSize: '0.78rem', color: '#64748b', marginTop: '0.5rem', lineHeight: 1.7 }}>
                Repositorio: <span style={S.code}>/home/juan/Documents/langgraph-agent-server</span><br />
                Iniciar: <span style={S.code}>langgraph dev --port 2024</span>
              </div>
            </div>
          </div>

          <div style={S.panel}>
            <div style={S.panelT}>Resumen de configuración</div>
            {[
              ['Proveedor', AI_PROVIDERS[config.provider]?.label ?? config.provider],
              ['Modelo configurado', config.model],
              ['Runtime predeterminado', RUNTIME_MODEL],
              ['API Key', config.apiKey ? `${'*'.repeat(8)}${config.apiKey.slice(-4)}` : '— no configurada —'],
              ['Servidor LangGraph', lgUrl],
            ].map(([k, v]) => (
              <div key={k} style={S.row}>
                <span style={S.rowK}>{k}</span>
                <span style={S.rowV}>{v}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}
