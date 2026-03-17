/**
 * Mock API Client
 * Simulates REST API endpoints using mock-data
 * In production, this would connect to actual backend endpoints
 */

import { MOCK_API_RESPONSES } from './mock-data'

/**
 * Simulate network delay
 */
function delay(ms = 300) {
  return new Promise((resolve) => setTimeout(resolve, ms))
}

/**
 * API Response wrapper
 */
function createResponse(status, data, error = null) {
  return {
    status,
    data,
    error,
    ok: status >= 200 && status < 300,
  }
}

/**
 * API Client instance
 */
const apiClient = {
  // ─── Leads API ──────────────────────────────────────────────────────

  /**
   * GET /api/leads
   * Fetch leads with optional filters
   */
  async getLeads(filters = {}) {
    await delay(400)
    try {
      const response = MOCK_API_RESPONSES.getLeads(filters)
      return createResponse(response.status, response.data)
    } catch (error) {
      return createResponse(500, null, error.message)
    }
  },

  /**
   * GET /api/leads/:id
   * Fetch single lead details
   */
  async getLeadDetail(id) {
    await delay(300)
    try {
      const response = MOCK_API_RESPONSES.getLeadDetail(id)
      if (response.data) {
        return createResponse(response.status, response.data)
      } else {
        return createResponse(404, null, 'Lead not found')
      }
    } catch (error) {
      return createResponse(500, null, error.message)
    }
  },

  // ─── AI Generation API ──────────────────────────────────────────────

  /**
   * POST /api/leads/:id/suggest
   * Generate AI suggestion for a lead response
   */
  async generateSuggestion(leadId, provider = 'openai') {
    await delay(600)
    try {
      const response = MOCK_API_RESPONSES.generateSuggestion(leadId, provider)
      return createResponse(response.status, response.data)
    } catch (error) {
      return createResponse(500, null, error.message)
    }
  },

  /**
   * POST /api/leads/:id/respond
   * Send response to a lead
   */
  async createResponse(leadId, message) {
    await delay(400)
    try {
      const response = MOCK_API_RESPONSES.createResponse(leadId, message)
      return createResponse(response.status, response.data)
    } catch (error) {
      return createResponse(500, null, error.message)
    }
  },

  // ─── Social Research API ────────────────────────────────────────────

  /**
   * GET /api/social-research/:id
   * Fetch social research data for a lead
   */
  async getSocialResearch(leadId) {
    await delay(800)
    try {
      const response = MOCK_API_RESPONSES.getSocialResearch(leadId)
      return createResponse(response.status, response.data)
    } catch (error) {
      return createResponse(500, null, error.message)
    }
  },

  // ─── Chat API ───────────────────────────────────────────────────────

  /**
   * POST /api/chat/message
   * Send chat message and get response
   */
  async sendChatMessage(conversationId, message) {
    await delay(500)
    try {
      const response = MOCK_API_RESPONSES.sendChatMessage(conversationId, message)
      return createResponse(response.status, response.data)
    } catch (error) {
      return createResponse(500, null, error.message)
    }
  },

  // ─── Notifications API ──────────────────────────────────────────────

  /**
   * GET /api/notifications
   * Fetch notifications
   */
  async getNotifications() {
    await delay(300)
    try {
      const response = MOCK_API_RESPONSES.getNotifications()
      return createResponse(response.status, response.data)
    } catch (error) {
      return createResponse(500, null, error.message)
    }
  },

  // ─── Configuration API ──────────────────────────────────────────────

  /**
   * PUT /api/config/api-keys
   * Save/update API keys
   */
  async saveApiKeys(provider, apiKey) {
    await delay(400)
    try {
      // Validate key format
      if (!provider || !apiKey) {
        return createResponse(400, null, 'Provider and API key required')
      }
      const response = MOCK_API_RESPONSES.saveApiKeys(provider, apiKey)
      return createResponse(response.status, response.data)
    } catch (error) {
      return createResponse(500, null, error.message)
    }
  },
}

export default apiClient
