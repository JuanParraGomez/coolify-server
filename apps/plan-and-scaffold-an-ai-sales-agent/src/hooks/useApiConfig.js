import { useState, useCallback } from 'react'
import { AI_PROVIDERS, RUNTIME_MODEL } from '../lib/constants.js'
import { apiClient } from '../lib/api-client.js'

const STORAGE_KEY = 'ai_sales_agent_config'

function loadConfig() {
  try {
    const raw = localStorage.getItem(STORAGE_KEY)
    return raw ? JSON.parse(raw) : defaultConfig()
  } catch {
    return defaultConfig()
  }
}

function defaultConfig() {
  return {
    provider: 'openai',
    apiKey: '',
    model: AI_PROVIDERS.openai.models[0],
    runtimeModel: RUNTIME_MODEL,
  }
}

/**
 * Hook para configuración de proveedor de IA.
 * Persiste en localStorage. Valida la key contra POST /api/config/validate-key.
 *
 * NOTA: El modelo de runtime predeterminado es openai-codex/gpt-5.1-codex-mini,
 * que difiere del modelo de desarrollo (claude-sonnet-4-6).
 */
export function useApiConfig() {
  const [config, setConfig] = useState(loadConfig)
  const [validating, setValidating] = useState(false)
  const [validationResult, setValidationResult] = useState(null)

  const updateConfig = useCallback((updates) => {
    setConfig(prev => {
      const next = { ...prev, ...updates }
      // Resetear modelo si cambia el proveedor
      if (updates.provider && updates.provider !== prev.provider) {
        next.model = AI_PROVIDERS[updates.provider]?.models[0] ?? ''
      }
      localStorage.setItem(STORAGE_KEY, JSON.stringify(next))
      if (next.apiKey) localStorage.setItem('ai_api_key', next.apiKey)
      return next
    })
    setValidationResult(null)
  }, [])

  const validateKey = useCallback(async () => {
    if (!config.apiKey) return
    setValidating(true)
    try {
      const result = await apiClient.validateApiKey(config.provider, config.apiKey)
      setValidationResult({ ok: result.valid, message: result.valid ? 'API key válida ✓' : 'API key inválida' })
    } catch {
      // Validación offline: solo verificar formato
      const valid = config.apiKey.length > 10
      setValidationResult({ ok: valid, message: valid ? 'Formato correcto (sin verificación online)' : 'Key muy corta' })
    } finally {
      setValidating(false)
    }
  }, [config.apiKey, config.provider])

  const clearConfig = useCallback(() => {
    const fresh = defaultConfig()
    setConfig(fresh)
    localStorage.removeItem(STORAGE_KEY)
    localStorage.removeItem('ai_api_key')
    setValidationResult(null)
  }, [])

  return { config, updateConfig, validateKey, validating, validationResult, clearConfig, providers: AI_PROVIDERS }
}
