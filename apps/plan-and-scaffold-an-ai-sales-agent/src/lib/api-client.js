import { API_BASE_URL } from './constants.js'

/**
 * Cliente REST tipado para consumir los endpoints del servidor.
 * Todas las peticiones incluyen el header Authorization si hay API key configurada.
 */
class ApiClient {
  constructor(baseUrl = API_BASE_URL) {
    this.baseUrl = baseUrl
  }

  /** @private */
  _headers(extra = {}) {
    const apiKey = localStorage.getItem('ai_api_key')
    return {
      'Content-Type': 'application/json',
      ...(apiKey ? { Authorization: `Bearer ${apiKey}` } : {}),
      ...extra,
    }
  }

  /** @private */
  async _request(method, path, body) {
    const res = await fetch(`${this.baseUrl}${path}`, {
      method,
      headers: this._headers(),
      ...(body ? { body: JSON.stringify(body) } : {}),
    })
    if (!res.ok) {
      const err = await res.json().catch(() => ({ message: res.statusText }))
      throw new Error(err.message || `HTTP ${res.status}`)
    }
    return res.json()
  }

  // --- Leads ---
  /** @returns {Promise<Lead[]>} */
  getLeads(params = {}) {
    const qs = new URLSearchParams(params).toString()
    return this._request('GET', `/leads${qs ? `?${qs}` : ''}`)
  }

  /** @returns {Promise<Lead>} */
  getLead(id) { return this._request('GET', `/leads/${id}`) }

  /** @returns {Promise<Lead>} */
  createLead(data) { return this._request('POST', '/leads', data) }

  /** @returns {Promise<Lead>} */
  updateLead(id, data) { return this._request('PATCH', `/leads/${id}`, data) }

  // --- Chat ---
  /** @returns {Promise<Message[]>} */
  getMessages(leadId) { return this._request('GET', `/leads/${leadId}/messages`) }

  /** @returns {Promise<Message>} */
  sendMessage(leadId, content) {
    return this._request('POST', `/leads/${leadId}/messages`, { content })
  }

  /** @returns {Promise<{suggestion: string}>} */
  generateAiResponse(leadId, context) {
    return this._request('POST', `/leads/${leadId}/ai-response`, { context })
  }

  // --- Alerts ---
  /** @returns {Promise<Alert[]>} */
  getAlerts(params = {}) {
    const qs = new URLSearchParams(params).toString()
    return this._request('GET', `/alerts${qs ? `?${qs}` : ''}`)
  }

  /** @returns {Promise<Alert>} */
  markAlertRead(id) { return this._request('PATCH', `/alerts/${id}/read`) }

  // --- Research ---
  /** @returns {Promise<SocialProfile>} */
  researchContact(query) {
    return this._request('POST', '/research/social', { query })
  }

  /** @returns {Promise<ResearchReport>} */
  getResearchReport(leadId) {
    return this._request('GET', `/leads/${leadId}/research`)
  }

  // --- LangGraph Agent ---
  /** @returns {Promise<{run_id: string, status: string}>} */
  startAgentRun(input) {
    return this._request('POST', '/agent/run', { input })
  }

  /** @returns {Promise<AgentRun>} */
  getAgentRun(runId) { return this._request('GET', `/agent/run/${runId}`) }

  /** @returns {Promise<AgentRun[]>} */
  getAgentHistory() { return this._request('GET', '/agent/history') }

  // --- API Config ---
  /** @returns {Promise<{valid: boolean, model: string}>} */
  validateApiKey(provider, apiKey) {
    return this._request('POST', '/config/validate-key', { provider, apiKey })
  }
}

export const apiClient = new ApiClient()
