/**
 * Central exports for data layer and utilities
 */

export {
  MOCK_LEADS,
  MOCK_API_RESPONSES,
  ESTADO_OPTIONS,
  CANAL_OPTIONS,
  RESPONDIO_OPTIONS,
  ESTADO_COLOR,
  INITIAL_FILTER_STATE,
  INITIAL_APP_STATE,
  API_PROVIDERS,
  DEFAULT_RUNTIME_MODEL,
  filterLeads,
  sortLeads,
  getLeadStats,
  getNotificationSummary,
} from './mock-data'

export { default as apiClient } from './apiClient'
