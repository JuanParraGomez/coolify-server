export const AI_PROVIDERS = {
  openai: {
    id: 'openai',
    name: 'OpenAI',
    model: 'gpt-5.1-codex-mini', // modelo runtime por defecto
    endpoint: 'https://api.openai.com/v1/chat/completions',
    keyPrefix: 'sk-',
    keyPlaceholder: 'sk-...',
    color: '#10a37f',
  },
  claude: {
    id: 'claude',
    name: 'Claude (Anthropic)',
    model: 'claude-sonnet-4-6',
    endpoint: 'https://api.anthropic.com/v1/messages',
    keyPrefix: 'sk-ant-',
    keyPlaceholder: 'sk-ant-...',
    color: '#d97706',
  },
  gemini: {
    id: 'gemini',
    name: 'Google Gemini',
    model: 'gemini-2.0-flash',
    endpoint: 'https://generativelanguage.googleapis.com/v1beta/models',
    keyPrefix: 'AIza',
    keyPlaceholder: 'AIza...',
    color: '#4285f4',
  },
  deepseek: {
    id: 'deepseek',
    name: 'Deepseek',
    model: 'deepseek-chat',
    endpoint: 'https://api.deepseek.com/v1/chat/completions',
    keyPrefix: 'sk-',
    keyPlaceholder: 'sk-...',
    color: '#6366f1',
  },
}

export function validateKey(providerId, key) {
  const provider = AI_PROVIDERS[providerId]
  if (!provider || !key) return false
  return key.startsWith(provider.keyPrefix) && key.length > 20
}

export function getStoredKeys() {
  try {
    return JSON.parse(localStorage.getItem('ai_keys') || '{}')
  } catch {
    return {}
  }
}

export function setStoredKey(providerId, key) {
  const keys = getStoredKeys()
  keys[providerId] = key
  localStorage.setItem('ai_keys', JSON.stringify(keys))
}

export function getActiveProvider() {
  return localStorage.getItem('ai_active_provider') || 'openai'
}

export function setActiveProvider(providerId) {
  localStorage.setItem('ai_active_provider', providerId)
}
