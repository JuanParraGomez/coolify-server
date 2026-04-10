import { useMemo, useState } from 'react'

/**
 * Hook for sorting and pagination
 */
export function useSortAndPaginate(data = [], initialSortBy = 'dueDate', pageSize = 20) {
  const [sortColumn, setSortColumn] = useState(initialSortBy)
  const [sortOrder, setSortOrder] = useState('asc')
  const [currentPage, setCurrentPage] = useState(1)

  const sorted = useMemo(() => {
    const result = [...data]

    // Sorting logic
    if (sortColumn === 'dueDate' || sortColumn === 'date') {
      result.sort((a, b) => {
        const dateA = new Date(a[sortColumn] || 0)
        const dateB = new Date(b[sortColumn] || 0)
        return sortOrder === 'asc' ? dateA - dateB : dateB - dateA
      })
    } else if (sortColumn === 'priority') {
      const priorityOrder = { high: 0, medium: 1, low: 2 }
      result.sort((a, b) => {
        const orderA = priorityOrder[a.priority] ?? 3
        const orderB = priorityOrder[b.priority] ?? 3
        return sortOrder === 'asc' ? orderA - orderB : orderB - orderA
      })
    } else if (sortColumn === 'status') {
      const statusOrder = { pending: 0, 'in-progress': 1, done: 2, blocked: 3 }
      result.sort((a, b) => {
        const orderA = statusOrder[a.status] ?? 4
        const orderB = statusOrder[b.status] ?? 4
        return sortOrder === 'asc' ? orderA - orderB : orderB - orderA
      })
    } else if (sortColumn === 'title') {
      result.sort((a, b) => {
        const valA = a.title || ''
        const valB = b.title || ''
        return sortOrder === 'asc' ? valA.localeCompare(valB) : valB.localeCompare(valA)
      })
    }

    return result
  }, [data, sortColumn, sortOrder])

  // Pagination
  const paginated = useMemo(() => {
    const startIdx = (currentPage - 1) * pageSize
    return sorted.slice(startIdx, startIdx + pageSize)
  }, [sorted, currentPage, pageSize])

  const totalPages = Math.ceil(sorted.length / pageSize)

  const handleSort = (column) => {
    if (sortColumn === column) {
      setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc')
    } else {
      setSortColumn(column)
      setSortOrder('asc')
    }
    setCurrentPage(1)
  }

  return {
    sorted,
    paginated,
    sortColumn,
    sortOrder,
    currentPage,
    pageSize,
    totalPages,
    totalItems: sorted.length,
    handleSort,
    setCurrentPage,
  }
}
