import { useAppStore } from '../store/appStore'

/**
 * Hook for managing leads, filtering, sorting, and selection
 * Integrates with Zustand central store and mock-data layer
 * Provides comprehensive lead management including enriched data
 */
export function useLeads() {
  const filteredLeads = useAppStore((state) => state.getFilteredLeads())
  const stats = useAppStore((state) => state.getLeadStats())
  const filters = useAppStore((state) => state.filters)
  const sortField = useAppStore((state) => state.sortField)
  const sortDir = useAppStore((state) => state.sortDir)
  const selectedLeadId = useAppStore((state) => state.selectedLeadId)
  const expandedLeadId = useAppStore((state) => state.expandedLeadId)
  const leads = useAppStore((state) => state.leads)
  const socialResearch = useAppStore((state) => state.socialResearch)
  const chatMessages = useAppStore((state) => state.chatMessages)

  const setFilters = useAppStore((state) => state.setFilters)
  const setFilter = useAppStore((state) => state.setFilter)
  const resetFilters = useAppStore((state) => state.resetFilters)
  const toggleSort = useAppStore((state) => state.toggleSort)
  const selectLead = useAppStore((state) => state.selectLead)
  const clearSelection = useAppStore((state) => state.clearSelection)
  const setExpandedLead = useAppStore((state) => state.setExpandedLead)
  const getLeadById = useAppStore((state) => state.getLeadById)
  const getEnrichedLead = useAppStore((state) => state.getEnrichedLead)

  const selectedLead = selectedLeadId ? getLeadById(selectedLeadId) : null
  const selectedLeadEnriched = selectedLeadId ? getEnrichedLead(selectedLeadId) : null
  const selectedLeadResearch = selectedLeadId ? socialResearch[selectedLeadId] : null
  const selectedLeadChat = selectedLeadId ? chatMessages[selectedLeadId] : []

  return {
    // Data
    leads: filteredLeads,
    allLeads: leads,
    stats,
    selectedLead,
    selectedLeadEnriched,
    selectedLeadResearch,
    selectedLeadChat,

    // Filters
    filters,
    setFilters,
    setFilter,
    resetFilters,

    // Sorting
    sortField,
    sortDir,
    toggleSort,

    // Selection
    selectedLeadId,
    selectLead,
    clearSelection,

    // Expansion
    expandedLeadId,
    setExpandedLead,

    // Helpers
    getLeadById,
    getEnrichedLead,
    totalLeads: filteredLeads.length,
    hasActiveFilters: Object.values(filters).some(v => v !== 'todos' && v !== ''),
  }
}
