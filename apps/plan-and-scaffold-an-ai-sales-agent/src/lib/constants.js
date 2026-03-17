// Modelo de runtime predeterminado (nota: el runtime difiere del modelo de desarrollo)
// Modelo de desarrollo: claude-sonnet-4-6
// Modelo de runtime: openai-codex/gpt-5.1-codex-mini
export const RUNTIME_MODEL = 'openai-codex/gpt-5.1-codex-mini'

export const AI_PROVIDERS = {
  openai: {
    id: 'openai',
    label: 'OpenAI',
    models: ['gpt-4o', 'gpt-4o-mini', 'gpt-5.1-codex-mini'],
    baseUrl: 'https://api.openai.com/v1',
    docsUrl: 'https://platform.openai.com/api-keys',
  },
  gemini: {
    id: 'gemini',
    label: 'Google Gemini',
    models: ['gemini-2.0-flash', 'gemini-2.5-pro', 'gemini-1.5-pro'],
    baseUrl: 'https://generativelanguage.googleapis.com/v1beta',
    docsUrl: 'https://aistudio.google.com/app/apikey',
  },
  claude: {
    id: 'claude',
    label: 'Anthropic Claude',
    models: ['claude-opus-4-6', 'claude-sonnet-4-6', 'claude-haiku-4-5'],
    baseUrl: 'https://api.anthropic.com/v1',
    docsUrl: 'https://console.anthropic.com/settings/keys',
  },
  deepseek: {
    id: 'deepseek',
    label: 'DeepSeek',
    models: ['deepseek-chat', 'deepseek-reasoner'],
    baseUrl: 'https://api.deepseek.com/v1',
    docsUrl: 'https://platform.deepseek.com/api_keys',
  },
}

export const LEAD_STATUS = {
  new: { label: 'Nuevo', color: '#3b82f6' },
  contacted: { label: 'Contactado', color: '#f59e0b' },
  replied: { label: 'Respondió', color: '#10b981' },
  qualified: { label: 'Calificado', color: '#8b5cf6' },
  closed: { label: 'Cerrado', color: '#6b7280' },
}

export const NAV_ITEMS = [
  { id: 'leads', label: 'Leads', icon: '👥' },
  { id: 'chat', label: 'Chat Extension', icon: '💬' },
  { id: 'alerts', label: 'Alertas', icon: '🔔' },
  { id: 'research', label: 'Investigación', icon: '🔍' },
  { id: 'langgraph', label: 'Agente LangGraph', icon: '🤖' },
  { id: 'apiconfig', label: 'Config API', icon: '⚙️' },
]

// Endpoints base de la API REST
export const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || '/api'
