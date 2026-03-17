/**
 * Central Application State Store (Zustand)
 * Manages leads, filters, notifications, API configuration, and social research data
 */

import { create } from 'zustand'
import {
  MOCK_LEADS,
  MOCK_NOTIFICATIONS,
  MOCK_SOCIAL_RESEARCH,
  MOCK_CHAT_HISTORY,
  INITIAL_FILTER_STATE,
  filterLeads,
  sortLeads,
  getLeadStats,
  getNotificationSummary,
  enrichLead,
  MOCK_API_RESPONSES,
  API_PROVIDERS,
} from '../lib/mock-data'

export const useAppStore = create((set, get) => ({
  // ─── Leads State ────────────────────────────────────────────────────────
  leads: MOCK_LEADS,
  selectedLeadId: null,

  // ─── Filters State ──────────────────────────────────────────────────────
  filters: INITIAL_FILTER_STATE,
  sortField: 'score',
  sortDir: 'desc',

  // ─── Notifications State ────────────────────────────────────────────────
  notifications: MOCK_NOTIFICATIONS,
  unreadCount: MOCK_NOTIFICATIONS.filter(n => !n.read).length,

  // ─── API Configuration ──────────────────────────────────────────────────
  apiKeys: {
    openai: null,
    gemini: null,
    claude: null,
    deepseek: null,
  },
  activeProvider: 'openai',

  // ─── Social Research State ──────────────────────────────────────────────
  socialResearch: MOCK_SOCIAL_RESEARCH,

  // ─── Chat State ─────────────────────────────────────────────────────────
  chatMessages: MOCK_CHAT_HISTORY,
  expandedLeadId: null,

  // ─── Loading & Error State ─────────────────────────────────────────────
  loading: false,
  error: null,

  // ─── Computed/Filtered Leads ────────────────────────────────────────────
  getFilteredLeads() {
    const state = get()
    let filtered = filterLeads(state.leads, state.filters)
    filtered = sortLeads(filtered, state.sortField, state.sortDir)
    return filtered
  },

  getLeadStats() {
    return getLeadStats(get().leads)
  },

  getLeadById(id) {
    return get().leads.find(l => l.id === id)
  },

  getEnrichedLead(id) {
    return enrichLead(id)
  },

  getNotificationSummary() {
    return getNotificationSummary(get().notifications)
  },

  getActiveProviderConfig() {
    return API_PROVIDERS.find(p => p.id === get().activeProvider)
  },

  // ─── Filter Actions ────────────────────────────────────────────────────
  setFilters(filters) {
    set({ filters })
  },

  setFilter(key, value) {
    set((state) => ({
      filters: { ...state.filters, [key]: value },
    }))
  },

  resetFilters() {
    set({ filters: INITIAL_FILTER_STATE })
  },

  setSort(field, dir) {
    set({ sortField: field, sortDir: dir })
  },

  toggleSort(field) {
    const state = get()
    if (state.sortField === field) {
      set({ sortDir: state.sortDir === 'asc' ? 'desc' : 'asc' })
    } else {
      set({ sortField: field, sortDir: 'desc' })
    }
  },

  // ─── Lead Selection ────────────────────────────────────────────────────
  selectLead(id) {
    set({ selectedLeadId: id })
  },

  clearSelection() {
    set({ selectedLeadId: null })
  },

  setExpandedLead(id) {
    set((state) => ({
      expandedLeadId: state.expandedLeadId === id ? null : id,
    }))
  },

  // ─── Notification Actions ──────────────────────────────────────────────
  setNotifications(notifications) {
    set({
      notifications,
      unreadCount: notifications.filter(n => !n.read).length,
    })
  },

  addNotification(notification) {
    set((state) => {
      const newNotifications = [...state.notifications, notification]
      return {
        notifications: newNotifications,
        unreadCount: newNotifications.filter(n => !n.read).length,
      }
    })
  },

  markNotificationRead(id) {
    set((state) => {
      const newNotifications = state.notifications.map(n =>
        n.id === id ? { ...n, read: true } : n
      )
      return {
        notifications: newNotifications,
        unreadCount: newNotifications.filter(n => !n.read).length,
      }
    })
  },

  clearNotifications() {
    set({ notifications: [], unreadCount: 0 })
  },

  // ─── API Key Management ────────────────────────────────────────────────
  setApiKey(provider, key) {
    set((state) => ({
      apiKeys: { ...state.apiKeys, [provider]: key },
    }))
  },

  getApiKey(provider) {
    return get().apiKeys[provider]
  },

  hasApiKey(provider) {
    return !!get().apiKeys[provider]
  },

  setActiveProvider(provider) {
    set({ activeProvider: provider })
  },

  clearApiKey(provider) {
    set((state) => ({
      apiKeys: { ...state.apiKeys, [provider]: null },
    }))
  },

  // ─── Social Research ────────────────────────────────────────────────────
  setSocialResearch(leadId, data) {
    set((state) => ({
      socialResearch: {
        ...state.socialResearch,
        [leadId]: data,
      },
    }))
  },

  getSocialResearch(leadId) {
    return get().socialResearch[leadId]
  },

  // ─── Chat Messages ─────────────────────────────────────────────────────
  addChatMessage(leadId, message) {
    set((state) => ({
      chatMessages: {
        ...state.chatMessages,
        [leadId]: [...(state.chatMessages[leadId] || []), message],
      },
    }))
  },

  getChatMessages(leadId) {
    return get().chatMessages[leadId] || []
  },

  clearChat(leadId) {
    set((state) => ({
      chatMessages: {
        ...state.chatMessages,
        [leadId]: [],
      },
    }))
  },

  // ─── Loading & Error ───────────────────────────────────────────────────
  setLoading(loading) {
    set({ loading })
  },

  setError(error) {
    set({ error })
  },

  clearError() {
    set({ error: null })
  },

  // ─── Reset Store ───────────────────────────────────────────────────────
  reset() {
    set({
      leads: MOCK_LEADS,
      selectedLeadId: null,
      filters: INITIAL_FILTER_STATE,
      sortField: 'score',
      sortDir: 'desc',
      notifications: MOCK_NOTIFICATIONS,
      unreadCount: MOCK_NOTIFICATIONS.filter(n => !n.read).length,
      apiKeys: {
        openai: null,
        gemini: null,
        claude: null,
        deepseek: null,
      },
      activeProvider: 'openai',
      socialResearch: MOCK_SOCIAL_RESEARCH,
      chatMessages: MOCK_CHAT_HISTORY,
      expandedLeadId: null,
      loading: false,
      error: null,
    })
  },
}))
