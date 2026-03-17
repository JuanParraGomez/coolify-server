import React, { useState } from 'react'
import { useAppStore } from '../store'
import { useTestConnection } from '../hooks/useAIProvider'
import { API_KEY_PATTERNS, PROVIDER_LABELS, DEFAULT_MODELS, DEFAULT_RUNTIME_MODEL } from '../types'
import type { AIProviderName } from '../types'

const providers: AIProviderName[] = ['openai', 'gemini', 'claude', 'deepseek']

export default function ApiKeyConfig() {
  const { activeProvider, providerKeys, providerModels, setActiveProvider, setProviderKey, setProviderModel } = useAppStore()
  const testConn = useTestConnection()
  const [testResults, setTestResults] = useState<Record<string, string>>({})

  function validateKey(provider: AIProviderName, key: string): boolean {
    if (!key) return false
    return API_KEY_PATTERNS[provider].test(key)
  }

  async function handleTest(provider: AIProviderName) {
    const key = providerKeys[provider]
    if (!validateKey(provider, key)) {
      setTestResults((r) => ({ ...r, [provider]: '❌ Formato de key inválido' }))
      return
    }
    setTestResults((r) => ({ ...r, [provider]: '⏳ Probando...' }))
    try {
      const result = await testConn.mutateAsync({ provider, apiKey: key })
      setTestResults((r) => ({ ...r, [provider]: `✅ Conectado — modelo: ${result.model}` }))
    } catch (e: unknown) {
      const msg = e instanceof Error ? e.message : 'Error desconocido'
      setTestResults((r) => ({ ...r, [provider]: `❌ ${msg}` }))
    }
  }

  return (
    <div style={{ maxWidth: 700 }}>
      <h2 style={{ margin: '0 0 0.5rem', fontSize: 20, color: '#1e293b' }}>Configuración de API Keys</h2>
      <p style={{ color: '#64748b', margin: '0 0 1.5rem', fontSize: 14 }}>
        Runtime del sistema: <code style={{ background: '#f1f5f9', padding: '2px 6px', borderRadius: 4 }}>{DEFAULT_RUNTIME_MODEL}</code>
      </p>

      {/* Selector de proveedor activo */}
      <div style={{ marginBottom: '1.5rem' }}>
        <label style={{ fontSize: 13, color: '#475569', display: 'block', marginBottom: 8 }}>
          Proveedor activo
        </label>
        <div style={{ display: 'flex', gap: 8 }}>
          {providers.map((p) => (
            <button
              key={p}
              onClick={() => setActiveProvider(p)}
              style={{
                padding: '6px 14px',
                borderRadius: 6,
                border: '1px solid',
                borderColor: activeProvider === p ? '#3b82f6' : '#e2e8f0',
                background: activeProvider === p ? '#eff6ff' : 'white',
                color: activeProvider === p ? '#1d4ed8' : '#64748b',
                cursor: 'pointer',
                fontSize: 13,
                fontWeight: activeProvider === p ? 600 : 400,
              }}
            >
              {PROVIDER_LABELS[p]}
            </button>
          ))}
        </div>
      </div>

      {/* Formulario por proveedor */}
      {providers.map((p) => {
        const key = providerKeys[p]
        const isValid = validateKey(p, key)
        const isActive = activeProvider === p

        return (
          <div
            key={p}
            style={{
              border: '1px solid',
              borderColor: isActive ? '#3b82f6' : '#e2e8f0',
              borderRadius: 8,
              padding: '1rem',
              marginBottom: '1rem',
              background: isActive ? '#f8fbff' : 'white',
            }}
          >
            <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 12 }}>
              <span style={{ fontWeight: 600, color: '#1e293b', fontSize: 15 }}>{PROVIDER_LABELS[p]}</span>
              {isActive && (
                <span style={{ fontSize: 11, background: '#dbeafe', color: '#1d4ed8', padding: '2px 8px', borderRadius: 999 }}>
                  Activo
                </span>
              )}
            </div>

            <div style={{ display: 'flex', gap: 8, marginBottom: 8 }}>
              <input
                type="password"
                placeholder={`API Key de ${PROVIDER_LABELS[p]}`}
                value={key}
                onChange={(e) => setProviderKey(p, e.target.value)}
                style={{
                  flex: 1,
                  padding: '8px 12px',
                  border: '1px solid',
                  borderColor: key ? (isValid ? '#22c55e' : '#ef4444') : '#e2e8f0',
                  borderRadius: 6,
                  fontSize: 13,
                  outline: 'none',
                }}
              />
              <button
                onClick={() => handleTest(p)}
                disabled={!key}
                style={{
                  padding: '8px 14px',
                  borderRadius: 6,
                  border: '1px solid #e2e8f0',
                  background: 'white',
                  cursor: key ? 'pointer' : 'not-allowed',
                  fontSize: 13,
                  color: '#475569',
                  opacity: key ? 1 : 0.5,
                }}
              >
                Probar
              </button>
            </div>

            <div style={{ display: 'flex', gap: 8, alignItems: 'center', marginBottom: 8 }}>
              <label style={{ fontSize: 12, color: '#64748b', width: 60 }}>Modelo:</label>
              <input
                type="text"
                value={providerModels[p]}
                onChange={(e) => setProviderModel(p, e.target.value)}
                placeholder={DEFAULT_MODELS[p]}
                style={{
                  flex: 1,
                  padding: '6px 10px',
                  border: '1px solid #e2e8f0',
                  borderRadius: 6,
                  fontSize: 12,
                  outline: 'none',
                }}
              />
            </div>

            {testResults[p] && (
              <div style={{ fontSize: 12, color: '#475569', marginTop: 4 }}>{testResults[p]}</div>
            )}

            {key && !isValid && (
              <div style={{ fontSize: 11, color: '#ef4444', marginTop: 4 }}>
                Formato incorrecto. Patrón esperado: {API_KEY_PATTERNS[p].source.substring(0, 20)}...
              </div>
            )}
          </div>
        )
      })}
    </div>
  )
}
