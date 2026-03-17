import React from 'react'
import { useApiConfig } from '../hooks/useApiConfig.js'
import { RUNTIME_MODEL } from '../lib/constants.js'

export function ApiConfigView() {
  const { config, updateConfig, validateKey, validating, validationResult, clearConfig, providers } = useApiConfig()
  const currentProvider = providers[config.provider]

  return (
    <div className="view">
      <div className="card-header mb-2">
        <h2 className="card-title">Configuración de API de IA</h2>
      </div>

      {/* Runtime note */}
      <div className="card mb-2" style={{ borderColor: 'var(--warning)', background: 'rgba(245,158,11,0.06)' }}>
        <p className="text-sm">
          ⚠️ <strong>Nota sobre el runtime:</strong> El modelo de desarrollo es <code>claude-sonnet-4-6</code>.
          El modelo de <strong>runtime predeterminado</strong> es <code>{RUNTIME_MODEL}</code> (openai-codex/gpt-5.1-codex-mini),
          que puede diferir según el proveedor configurado aquí.
        </p>
      </div>

      {/* Provider selection */}
      <div className="card mb-2">
        <div className="card-header">
          <span className="card-title">Seleccionar proveedor de IA</span>
        </div>
        <div className="provider-grid">
          {Object.values(providers).map(p => (
            <div
              key={p.id}
              className={`provider-card${config.provider === p.id ? ' selected' : ''}`}
              onClick={() => updateConfig({ provider: p.id })}
            >
              <div className="provider-name">{p.label}</div>
              <div className="provider-models">{p.models.slice(0, 2).join(', ')}</div>
            </div>
          ))}
        </div>
      </div>

      {/* API Key & Model */}
      <div className="card mb-2">
        <div className="card-header">
          <span className="card-title">Credenciales — {currentProvider?.label}</span>
          <a
            href={currentProvider?.docsUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="btn btn-ghost btn-sm"
          >
            Obtener API key →
          </a>
        </div>

        <div className="form-group">
          <label className="form-label">API Key</label>
          <div className="flex gap-1">
            <input
              className="input"
              type="password"
              placeholder={`Ingresa tu ${currentProvider?.label} API key...`}
              value={config.apiKey}
              onChange={e => updateConfig({ apiKey: e.target.value })}
            />
            <button
              className="btn btn-secondary"
              onClick={validateKey}
              disabled={validating || !config.apiKey}
            >
              {validating ? <span className="spinner" /> : 'Validar'}
            </button>
          </div>
          {validationResult && (
            <p className={`text-sm mt-1 ${validationResult.ok ? 'text-success' : 'text-danger'}`}>
              {validationResult.message}
            </p>
          )}
        </div>

        <div className="form-group">
          <label className="form-label">Modelo</label>
          <select
            className="select"
            value={config.model}
            onChange={e => updateConfig({ model: e.target.value })}
          >
            {(currentProvider?.models ?? []).map(m => (
              <option key={m} value={m}>{m}</option>
            ))}
          </select>
        </div>
      </div>

      {/* LangGraph server info */}
      <div className="card mb-2">
        <div className="card-header">
          <span className="card-title">Servidor LangGraph</span>
        </div>
        <div className="form-group">
          <label className="form-label">URL del servidor LangGraph</label>
          <input
            className="input"
            placeholder="http://localhost:2024 o URL de producción"
            defaultValue={import.meta.env.VITE_LANGGRAPH_URL ?? 'http://localhost:2024'}
            onChange={e => localStorage.setItem('langgraph_url', e.target.value)}
          />
          <p className="text-sm text-muted mt-1">
            Servidor LangGraph que orquesta los nodos del agente de ventas.
            Repositorio: <code>/home/juan/Documents/langgraph-agent-server</code>
          </p>
        </div>
      </div>

      {/* Actions */}
      <div className="flex gap-1">
        <button
          className="btn btn-secondary"
          onClick={clearConfig}
          style={{ color: 'var(--danger)' }}
        >
          Limpiar configuración
        </button>
      </div>
    </div>
  )
}
