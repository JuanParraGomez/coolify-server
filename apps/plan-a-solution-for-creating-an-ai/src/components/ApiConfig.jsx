import { useState } from 'react'

const PROVIDERS = [
  {
    id: 'openai',
    name: 'OpenAI',
    color: '#10a37f',
    models: ['gpt-5.1-codex-mini (default)', 'gpt-4o', 'gpt-4o-mini', 'o3'],
    keyPrefix: 'sk-',
    keyPlaceholder: 'sk-proj-...',
    docUrl: 'https://platform.openai.com/api-keys',
  },
  {
    id: 'claude',
    name: 'Anthropic Claude',
    color: '#cc785c',
    models: ['claude-sonnet-4-6', 'claude-opus-4-6', 'claude-haiku-4-5'],
    keyPrefix: 'sk-ant-',
    keyPlaceholder: 'sk-ant-api03-...',
    docUrl: 'https://console.anthropic.com/settings/keys',
  },
  {
    id: 'gemini',
    name: 'Google Gemini',
    color: '#4285f4',
    models: ['gemini-2.0-flash', 'gemini-2.5-pro', 'gemini-1.5-flash'],
    keyPrefix: 'AIza',
    keyPlaceholder: 'AIzaSy...',
    docUrl: 'https://aistudio.google.com/app/apikey',
  },
  {
    id: 'deepseek',
    name: 'Deepseek',
    color: '#0ea5e9',
    models: ['deepseek-chat (V3)', 'deepseek-reasoner (R1)'],
    keyPrefix: 'sk-',
    keyPlaceholder: 'sk-...',
    docUrl: 'https://platform.deepseek.com/api_keys',
  },
]

function maskKey(key) {
  if (!key) return ''
  if (key.length <= 8) return '•'.repeat(key.length)
  return key.substring(0, 8) + '•'.repeat(Math.min(key.length - 8, 20))
}

export default function ApiConfig() {
  const [keys, setKeys] = useState({})
  const [activeProvider, setActiveProvider] = useState('openai')
  const [activeModel, setActiveModel] = useState('gpt-5.1-codex-mini (default)')
  const [saved, setSaved] = useState({})
  const [showKey, setShowKey] = useState({})

  const handleSave = (providerId) => {
    setSaved(prev => ({ ...prev, [providerId]: true }))
    setTimeout(() => setSaved(prev => ({ ...prev, [providerId]: false })), 2000)
    // En producción: POST /api/config/keys { provider: providerId, key: keys[providerId] }
  }

  return (
    <section>
      <h2 className="section-title">Configuración de API Keys</h2>
      <p className="section-desc">
        Las claves API se almacenan cifradas en el servidor (nunca en localStorage ni en el frontend).
        El frontend solo indica qué proveedor y modelo usar en cada petición.
        El modelo de runtime por defecto es <strong>openai-codex/gpt-5.1-codex-mini</strong>.
      </p>

      <div className="api-model-selector">
        <h3 className="subsection-title">Modelo Activo</h3>
        <div className="model-selector-grid">
          {PROVIDERS.map(p => (
            <div
              key={p.id}
              className={`model-provider-card${activeProvider === p.id ? ' selected' : ''}`}
              style={{ borderColor: activeProvider === p.id ? p.color : 'transparent' }}
              onClick={() => {
                setActiveProvider(p.id)
                setActiveModel(p.models[0])
              }}
            >
              <div className="provider-dot" style={{ background: p.color }} />
              <span className="provider-name">{p.name}</span>
            </div>
          ))}
        </div>
        <div style={{ marginTop: '0.75rem' }}>
          <label className="form-label">Modelo seleccionado para este proveedor:</label>
          <select
            className="form-select"
            value={activeModel}
            onChange={e => setActiveModel(e.target.value)}
          >
            {PROVIDERS.find(p => p.id === activeProvider)?.models.map(m => (
              <option key={m} value={m}>{m}</option>
            ))}
          </select>
        </div>
        <div className="callout callout-green" style={{ marginTop: '0.75rem' }}>
          Configuración activa: <strong>{PROVIDERS.find(p => p.id === activeProvider)?.name}</strong> → <code>{activeModel}</code>
        </div>
      </div>

      <h3 className="subsection-title">Claves API por Proveedor</h3>

      <div className="api-keys-grid">
        {PROVIDERS.map(p => (
          <div key={p.id} className="api-key-card" style={{ borderTopColor: p.color }}>
            <div className="api-key-header">
              <span className="provider-dot" style={{ background: p.color }} />
              <strong>{p.name}</strong>
              {saved[p.id] && <span className="saved-badge">✓ Guardado</span>}
            </div>

            <div className="api-models-list">
              {p.models.map((m, i) => (
                <span key={i} className="model-chip">{m}</span>
              ))}
            </div>

            <div className="api-key-input-wrap">
              <label className="form-label">API Key ({p.keyPlaceholder})</label>
              <div className="key-input-row">
                <input
                  type={showKey[p.id] ? 'text' : 'password'}
                  className="form-input"
                  placeholder={p.keyPlaceholder}
                  value={keys[p.id] || ''}
                  onChange={e => setKeys(prev => ({ ...prev, [p.id]: e.target.value }))}
                />
                <button
                  className="btn-icon"
                  onClick={() => setShowKey(prev => ({ ...prev, [p.id]: !prev[p.id] }))}
                  title={showKey[p.id] ? 'Ocultar' : 'Mostrar'}
                >
                  {showKey[p.id] ? '🙈' : '👁'}
                </button>
              </div>
              {keys[p.id] && (
                <div className="key-preview">Almacenado como: {maskKey(keys[p.id])}</div>
              )}
            </div>

            <div className="api-key-actions">
              <button
                className="btn-save"
                style={{ background: p.color }}
                onClick={() => handleSave(p.id)}
                disabled={!keys[p.id]}
              >
                Guardar clave
              </button>
              <a
                className="btn-link"
                href={p.docUrl}
                target="_blank"
                rel="noopener noreferrer"
              >
                Obtener clave →
              </a>
            </div>
          </div>
        ))}
      </div>

      <div className="callout" style={{ marginTop: '1.5rem' }}>
        <strong>Seguridad:</strong> En producción, las claves se envían vía HTTPS a
        <code> POST /api/config/keys</code> y se cifran con AES-256 antes de almacenarlas.
        Nunca se devuelven al frontend completas — solo se indica si están configuradas (✓/✗).
        Usa Vault o AWS Secrets Manager en entornos productivos.
      </div>
    </section>
  )
}
