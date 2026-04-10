import { useState, useMemo } from 'react'

/**
 * Hook for managing filter state and applying filters to data
 */
export function useFilters(initialData = [], filterType = 'tasks') {
  const [filters, setFilters] = useState({})

  // Apply filters to data
  const filteredData = useMemo(() => {
    let result = [...initialData]

    // Search filter
    if (filters.search) {
      const query = filters.search.toLowerCase()
      result = result.filter(item =>
        item.title?.toLowerCase().includes(query) ||
        item.description?.toLowerCase().includes(query)
      )
    }

    // Status filter (tasks only)
    if (filters.statuses && filters.statuses.length > 0) {
      result = result.filter(item => filters.statuses.includes(item.status))
    }

    // Priority filter (tasks only)
    if (filters.priorities && filters.priorities.length > 0) {
      result = result.filter(item => filters.priorities.includes(item.priority))
    }

    // Assignee filter (tasks only)
    if (filters.assignees && filters.assignees.length > 0) {
      result = result.filter(item => filters.assignees.includes(item.assignee))
    }

    // Tags filter (tasks only)
    if (filters.tags && filters.tags.length > 0) {
      result = result.filter(item =>
        filters.tags.some(tag => item.tags?.includes(tag))
      )
    }

    // Event type filter (events only)
    if (filters.types && filters.types.length > 0) {
      result = result.filter(item => filters.types.includes(item.type))
    }

    // Date range filter (events)
    if (filters.dateRange) {
      const { start, end } = filters.dateRange
      if (start || end) {
        result = result.filter(item => {
          const itemDate = new Date(item.date || item.dueDate)
          if (start && itemDate < new Date(start)) return false
          if (end && itemDate > new Date(end)) return false
          return true
        })
      }
    }

    return result
  }, [initialData, filters])

  const updateFilters = (newFilters) => {
    setFilters(newFilters)
  }

  const clearFilters = () => {
    setFilters({})
  }

  const toggleFilter = (filterKey, value) => {
    const currentList = filters[filterKey] || []
    const newList = currentList.includes(value)
      ? currentList.filter(v => v !== value)
      : [...currentList, value]
    setFilters({ ...filters, [filterKey]: newList })
  }

  const hasActiveFilters = Object.values(filters).some(
    f => f && (Array.isArray(f) ? f.length > 0 : true)
  )

  return {
    filters,
    filteredData,
    updateFilters,
    clearFilters,
    toggleFilter,
    hasActiveFilters,
    filterCount: Object.values(filters).reduce(
      (count, f) => count + (Array.isArray(f) ? f.length : f ? 1 : 0),
      0
    ),
  }
}
