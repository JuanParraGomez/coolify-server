/**
 * REST API typed client.
 * Base URL from VITE_API_URL env var (falls back to /api).
 */

const BASE = import.meta.env.VITE_API_URL || '/api'

async function request(method, path, body) {
  const res = await fetch(`${BASE}${path}`, {
    method,
    headers: { 'Content-Type': 'application/json' },
    body: body ? JSON.stringify(body) : undefined,
  })
  if (!res.ok) throw new Error(`${method} ${path} → ${res.status}`)
  return res.json()
}

// ── Leads ──────────────────────────────────────────────────────────────────
export const leadsApi = {
  list:   (params = {}) => request('GET',  `/leads?${new URLSearchParams(params)}`),
  get:    (id)          => request('GET',  `/leads/${id}`),
  create: (payload)     => request('POST', '/leads', payload),
  update: (id, payload) => request('PUT',  `/leads/${id}`, payload),
}

// ── Chat / Extension ───────────────────────────────────────────────────────
export const chatApi = {
  messages: (leadId)    => request('GET',  `/chat/${leadId}/messages`),
  send:     (leadId, m) => request('POST', `/chat/${leadId}/messages`, { content: m }),
}

// ── AI Responses ───────────────────────────────────────────────────────────
export const responsesApi = {
  generate: (payload) => request('POST', '/responses/generate', payload),
  // payload: { leadId, context, provider, tone }
}

// ── Research ───────────────────────────────────────────────────────────────
export const researchApi = {
  lookup: (query) => request('POST', '/research/lookup', { query }),
  // returns: { name, title, company, linkedin, summary, socialSignals[] }
}

// ── Notifications ──────────────────────────────────────────────────────────
export const notificationsApi = {
  list:       ()   => request('GET',  '/notifications'),
  markRead:   (id) => request('PUT',  `/notifications/${id}/read`),
  markAllRead: ()  => request('PUT',  '/notifications/read-all'),
}

// ── Settings / API Keys ────────────────────────────────────────────────────
export const settingsApi = {
  get:  ()        => request('GET',  '/settings'),
  save: (payload) => request('PUT',  '/settings', payload),
  // payload: { provider: 'openai'|'claude'|'gemini'|'deepseek', apiKey, model }
}
