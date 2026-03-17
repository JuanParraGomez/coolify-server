import axios from 'axios'
import type {
  Lead,
  Notification,
  AIReplyRequest,
  AIReplyResponse,
  ResearchRequest,
  SocialProfile,
} from '../types'

const BASE_URL = import.meta.env.VITE_API_BASE_URL || '/api'

export const http = axios.create({
  baseURL: BASE_URL,
  timeout: 30_000,
  headers: { 'Content-Type': 'application/json' },
})

// Interceptor: adjuntar API key activa si está disponible
http.interceptors.request.use((config) => {
  const stored = localStorage.getItem('ai_provider_config')
  if (stored) {
    try {
      const parsed = JSON.parse(stored)
      if (parsed.activeProvider && parsed.keys?.[parsed.activeProvider]) {
        config.headers['X-AI-Provider'] = parsed.activeProvider
        config.headers['X-AI-Key'] = parsed.keys[parsed.activeProvider]
      }
    } catch {
      // ignorar si el JSON está corrupto
    }
  }
  return config
})

// Interceptor: manejo de errores centralizado
http.interceptors.response.use(
  (res) => res,
  (err) => {
    const message = err.response?.data?.message || err.message || 'Error de red'
    return Promise.reject(new Error(message))
  }
)

// ─── Endpoints tipados ────────────────────────────────────────────────────────

export const leadsApi = {
  list: () => http.get<Lead[]>('/leads').then((r) => r.data),
  create: (data: Omit<Lead, 'id' | 'messages' | 'lastActivity'>) =>
    http.post<Lead>('/leads', data).then((r) => r.data),
  update: (id: string, data: Partial<Lead>) =>
    http.put<Lead>(`/leads/${id}`, data).then((r) => r.data),
  delete: (id: string) => http.delete(`/leads/${id}`),
}

export const notificationsApi = {
  list: () => http.get<Notification[]>('/notifications').then((r) => r.data),
  markRead: (id: string) =>
    http.patch<Notification>(`/notifications/${id}/read`).then((r) => r.data),
  markAllRead: () => http.post('/notifications/mark-all-read'),
}

export const aiApi = {
  generateReply: (req: AIReplyRequest) =>
    http.post<AIReplyResponse>('/ai/reply', req).then((r) => r.data),
  researchProfile: (req: ResearchRequest) =>
    http.post<SocialProfile>('/ai/research', req).then((r) => r.data),
  testConnection: (provider: string, apiKey: string) =>
    http
      .post<{ ok: boolean; model: string }>('/ai/test', { provider, apiKey })
      .then((r) => r.data),
}
