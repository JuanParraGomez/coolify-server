// ─── Proveedores de IA ────────────────────────────────────────────────────────

export type AIProviderName = 'openai' | 'gemini' | 'claude' | 'deepseek'

export const DEFAULT_RUNTIME_MODEL = 'openai-codex/gpt-5.1-codex-mini'

export interface AIProviderConfig {
  name: AIProviderName
  label: string
  apiKey: string
  model: string
  baseUrl?: string
}

// ─── Leads ────────────────────────────────────────────────────────────────────

export type LeadStatus = 'nuevo' | 'contactado' | 'respondio' | 'en_proceso' | 'cerrado'
export type LeadChannel = 'linkedin' | 'email' | 'twitter' | 'whatsapp' | 'web'

export interface Lead {
  id: string
  name: string
  email?: string
  company: string
  role?: string
  channel: LeadChannel
  status: LeadStatus
  lastActivity: string // ISO date string
  messages: Message[]
  socialProfile?: SocialProfile
  notes?: string
}

// ─── Mensajes ─────────────────────────────────────────────────────────────────

export type MessageSender = 'agent' | 'lead'

export interface Message {
  id: string
  leadId: string
  sender: MessageSender
  content: string
  timestamp: string
  isAIGenerated?: boolean
}

// ─── Notificaciones ───────────────────────────────────────────────────────────

export type NotificationType = 'lead_responded' | 'new_lead' | 'follow_up_due' | 'research_complete'

export interface Notification {
  id: string
  type: NotificationType
  leadId?: string
  leadName?: string
  message: string
  timestamp: string
  read: boolean
}

// ─── Investigación Social ─────────────────────────────────────────────────────

export interface SocialProfile {
  name: string
  company: string
  role?: string
  interests: string[]
  recentActivity: string[]
  buyingTriggers: string[]
  recommendedAngles: string[]
  linkedinUrl?: string
  twitterUrl?: string
  summary: string
  researchedAt: string
}

// ─── API Responses ────────────────────────────────────────────────────────────

export interface AIReplyRequest {
  leadId: string
  tone: 'profesional' | 'amigable' | 'urgente'
  context?: string
  provider: AIProviderName
}

export interface AIReplyResponse {
  reply: string
  model: string
  tokens: number
}

export interface ResearchRequest {
  name: string
  company: string
  linkedinUrl?: string
  provider: AIProviderName
}

// ─── Validación de API Keys ───────────────────────────────────────────────────

export const API_KEY_PATTERNS: Record<AIProviderName, RegExp> = {
  openai: /^sk-(proj-)?[A-Za-z0-9_-]{20,}/,
  gemini: /^[A-Za-z0-9_-]{39}$/,
  claude: /^sk-ant-[A-Za-z0-9_-]{20,}/,
  deepseek: /^sk-[A-Za-z0-9]{20,}/,
}

export const PROVIDER_LABELS: Record<AIProviderName, string> = {
  openai: 'OpenAI',
  gemini: 'Google Gemini',
  claude: 'Anthropic Claude',
  deepseek: 'Deepseek',
}

export const DEFAULT_MODELS: Record<AIProviderName, string> = {
  openai: 'gpt-4o-mini',
  gemini: 'gemini-1.5-flash',
  claude: 'claude-haiku-4-5-20251001',
  deepseek: 'deepseek-chat',
}
