import { api } from './client.js'

/** @returns {Promise<Array<{id:string, name:string, company:string, status:string, lastMessage:string, createdAt:string}>>} */
export function fetchLeads(filters = {}) {
  const params = new URLSearchParams(filters).toString()
  return api.get(`/leads${params ? '?' + params : ''}`)
}

export function createLead(data) {
  return api.post('/leads', data)
}

export function sendMessage(leadId, message) {
  return api.post(`/leads/${leadId}/messages`, { content: message })
}

export function updateLead(leadId, data) {
  return api.patch(`/leads/${leadId}`, data)
}
