import { api } from './client.js'

export function fetchAlerts() {
  return api.get('/alerts')
}

export function markAlertRead(alertId) {
  return api.patch(`/alerts/${alertId}/read`, {})
}
