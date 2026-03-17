import { useState, useCallback, useMemo } from 'react'
import { useAppStore } from '../store/appStore'
import { API_PROVIDERS, VALIDATION } from '../lib/mock-data'

/**
 * Hook for managing API provider configuration
 * Handles API key storage, visibility toggling, validation, and provider selection
 * Provides comprehensive API key management for multi-provider support
 */
export function useApiConfig() {
  const apiKeys = useAppStore((state) => state.apiKeys)
  const activeProvider = useAppStore((state) => state.activeProvider)
  const setApiKey = useAppStore((state) => state.setApiKey)
  const setActiveProvider = useAppStore((state) => state.setActiveProvider)
  const clearApiKey = useAppStore((state) => state.clearApiKey)
  const getActiveProviderConfig = useAppStore((state) => state.getActiveProviderConfig)
  const hasApiKey = useAppStore((state) => state.hasApiKey)

  const [visible, setVisible] = useState({
    openai: false,
    gemini: false,
    claude: false,
    deepseek: false,
  })
  const [validated, setValidated] = useState({})

  const updateKey = useCallback((id, value) => {
    setApiKey(id, value)
    // Clear validation when key is modified
    setValidated((v) => ({ ...v, [id]: null }))
  }, [setApiKey])

  const toggleVisible = useCallback((id) => {
    setVisible((v) => ({ ...v, [id]: !v[id] }))
  }, [])

  const validateKey = useCallback((id) => {
    const key = apiKeys[id]
    if (!key) {
      setValidated((v) => ({ ...v, [id]: 'vacio' }))
      return
    }

    const isValidLength = key.length >= VALIDATION.API_KEY.minLength
    const matchesPattern = VALIDATION.API_KEY.pattern.test(key)
    const isValid = isValidLength && matchesPattern

    setValidated((v) => ({ ...v, [id]: isValid ? 'valida' : 'invalida' }))
    return isValid
  }, [apiKeys])

  const getProviderConfig = useCallback((id) => {
    return API_PROVIDERS.find((p) => p.id === id)
  }, [])

  const activeProviderConfig = useMemo(() => {
    return getActiveProviderConfig()
  }, [activeProvider, getActiveProviderConfig])

  const hasAnyApiKey = useMemo(() => {
    return Object.values(apiKeys).some((key) => !!key)
  }, [apiKeys])

  const configuredProviders = useMemo(() => {
    return API_PROVIDERS.filter((p) => hasApiKey(p.id))
  }, [hasApiKey])

  return {
    // Keys and visibility
    apiKeys,
    visible,
    toggleVisible,
    updateKey,

    // Validation
    validated,
    validateKey,

    // Provider management
    activeProvider,
    setActiveProvider,
    clearApiKey,

    // Provider data
    providers: API_PROVIDERS,
    getProviderConfig,
    activeProviderConfig,
    configuredProviders,
    hasAnyApiKey,

    // Helper methods
    getKeyStatus: (id) => {
      if (!apiKeys[id]) return 'no_configurado'
      return validated[id] || 'sin_validar'
    },

    getMaskedKey: (id) => {
      const key = apiKeys[id]
      if (!key) return null
      return key.substring(0, 8) + '...' + key.substring(key.length - 4)
    },
  }
}
