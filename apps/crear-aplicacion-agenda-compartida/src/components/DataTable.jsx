import React, { useState, useMemo } from 'react'
import { TASK_STATUSES, PRIORITY_LEVELS, USERS, sortTasksByDueDate, sortTasksByPriority } from '../lib/mock-data'
import '../styles/DataTable.css'

export default function DataTable({
  data = [],
  columns = [],
  type = 'tasks',
  onRowClick = () => {},
  onStatusChange = () => {},
  sortBy = 'dueDate',
  filters = {},
  selectable = false,
  onSelectionChange = () => {},
}) {
  const [selectedRows, setSelectedRows] = useState(new Set())
  const [sortOrder, setSortOrder] = useState('asc')
  const [sortColumn, setSortColumn] = useState(sortBy)

  // Filter data
  const filteredData = useMemo(() => {
    let result = [...data]

    // Apply search filter
    if (filters.search) {
      const searchLower = filters.search.toLowerCase()
      result = result.filter(item =>
        item.title?.toLowerCase().includes(searchLower) ||
        item.description?.toLowerCase().includes(searchLower)
      )
    }

    // Apply status filter
    if (filters.statuses && filters.statuses.length > 0) {
      result = result.filter(item => filters.statuses.includes(item.status))
    }

    // Apply priority filter
    if (filters.priorities && filters.priorities.length > 0) {
      result = result.filter(item => filters.priorities.includes(item.priority))
    }

    // Apply assignee filter
    if (filters.assignees && filters.assignees.length > 0) {
      result = result.filter(item => filters.assignees.includes(item.assignee))
    }

    // Apply tags filter
    if (filters.tags && filters.tags.length > 0) {
      result = result.filter(item =>
        filters.tags.some(tag => item.tags?.includes(tag))
      )
    }

    // Apply event type filter
    if (filters.types && filters.types.length > 0) {
      result = result.filter(item => filters.types.includes(item.type))
    }

    return result
  }, [data, filters])

  // Sort data
  const sortedData = useMemo(() => {
    const sorted = [...filteredData]
    
    if (sortColumn === 'dueDate' || sortColumn === 'date') {
      sorted.sort((a, b) => {
        const dateA = new Date(a[sortColumn] || 0)
        const dateB = new Date(b[sortColumn] || 0)
        return sortOrder === 'asc' ? dateA - dateB : dateB - dateA
      })
    } else if (sortColumn === 'priority') {
      const priorityOrder = { high: 0, medium: 1, low: 2 }
      sorted.sort((a, b) => {
        const orderA = priorityOrder[a.priority] ?? 3
        const orderB = priorityOrder[b.priority] ?? 3
        return sortOrder === 'asc' ? orderA - orderB : orderB - orderA
      })
    } else if (sortColumn === 'status') {
      const statusOrder = { pending: 0, 'in-progress': 1, done: 2, blocked: 3 }
      sorted.sort((a, b) => {
        const orderA = statusOrder[a.status] ?? 4
        const orderB = statusOrder[b.status] ?? 4
        return sortOrder === 'asc' ? orderA - orderB : orderB - orderA
      })
    } else {
      sorted.sort((a, b) => {
        const valA = a[sortColumn]
        const valB = b[sortColumn]
        if (typeof valA === 'string') {
          return sortOrder === 'asc' ? valA.localeCompare(valB) : valB.localeCompare(valA)
        }
        return sortOrder === 'asc' ? valA - valB : valB - valA
      })
    }

    return sorted
  }, [filteredData, sortColumn, sortOrder])

  const handleSort = (columnKey) => {
    if (sortColumn === columnKey) {
      setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc')
    } else {
      setSortColumn(columnKey)
      setSortOrder('asc')
    }
  }

  const handleSelectAll = () => {
    if (selectedRows.size === sortedData.length) {
      setSelectedRows(new Set())
      onSelectionChange([])
    } else {
      const newSelected = new Set(sortedData.map(item => item.id))
      setSelectedRows(newSelected)
      onSelectionChange(Array.from(newSelected))
    }
  }

  const handleSelectRow = (id) => {
    const newSelected = new Set(selectedRows)
    if (newSelected.has(id)) {
      newSelected.delete(id)
    } else {
      newSelected.add(id)
    }
    setSelectedRows(newSelected)
    onSelectionChange(Array.from(newSelected))
  }

  const renderCellContent = (item, column) => {
    const value = item[column.key]

    switch (column.type) {
      case 'status':
        const status = TASK_STATUSES[value]
        return (
          <select
            value={value}
            onChange={(e) => onStatusChange(item.id, e.target.value)}
            className="status-select"
            style={{ borderColor: status?.color }}
            onClick={(e) => e.stopPropagation()}
          >
            {Object.entries(TASK_STATUSES).map(([key, st]) => (
              <option key={key} value={key}>
                {st.label}
              </option>
            ))}
          </select>
        )

      case 'priority':
        const priority = PRIORITY_LEVELS[value]
        return (
          <span className="priority-badge" style={{ backgroundColor: priority?.color }}>
            {priority?.label}
          </span>
        )

      case 'date':
        if (!value) return '—'
        return new Date(value).toLocaleDateString('es-ES', {
          month: 'short',
          day: 'numeric',
          year: 'numeric',
        })

      case 'user':
        const user = USERS[value]
        if (!user) return value || '—'
        return (
          <div className="user-cell">
            <span className="user-avatar" style={{ backgroundColor: user.color }}>
              {user.initials}
            </span>
            <span>{user.name}</span>
          </div>
        )

      case 'tags':
        if (!Array.isArray(value) || value.length === 0) return '—'
        return (
          <div className="tags-cell">
            {value.slice(0, 2).map((tag, idx) => (
              <span key={idx} className="tag-badge">
                {tag}
              </span>
            ))}
            {value.length > 2 && <span className="tag-more">+{value.length - 2}</span>}
          </div>
        )

      case 'time':
        return value || '—'

      default:
        if (typeof value === 'string' && value.length > 50) {
          return <span title={value}>{value.substring(0, 50)}...</span>
        }
        return value || '—'
    }
  }

  if (sortedData.length === 0) {
    return (
      <div className="data-table-empty">
        <p>No hay datos que mostrar</p>
        {Object.keys(filters).length > 0 && <p className="empty-hint">Intenta cambiar los filtros</p>}
      </div>
    )
  }

  return (
    <div className="data-table-container">
      <table className="data-table">
        <thead>
          <tr>
            {selectable && (
              <th className="checkbox-column">
                <input
                  type="checkbox"
                  checked={sortedData.length > 0 && selectedRows.size === sortedData.length}
                  onChange={handleSelectAll}
                  aria-label="Seleccionar todo"
                />
              </th>
            )}
            {columns.map(column => (
              <th key={column.key} className={`column-${column.key}`}>
                {column.sortable !== false ? (
                  <button
                    className={`sort-button ${sortColumn === column.key ? `sort-${sortOrder}` : ''}`}
                    onClick={() => handleSort(column.key)}
                    title={`Ordenar por ${column.label}`}
                  >
                    {column.label}
                    {sortColumn === column.key && (
                      <span className="sort-indicator">{sortOrder === 'asc' ? '▲' : '▼'}</span>
                    )}
                  </button>
                ) : (
                  <span>{column.label}</span>
                )}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {sortedData.map(item => (
            <tr
              key={item.id}
              className={`data-row ${selectedRows.has(item.id) ? 'selected' : ''}`}
              onClick={() => onRowClick(item)}
            >
              {selectable && (
                <td className="checkbox-column">
                  <input
                    type="checkbox"
                    checked={selectedRows.has(item.id)}
                    onChange={() => handleSelectRow(item.id)}
                    onClick={(e) => e.stopPropagation()}
                    aria-label={`Seleccionar ${item.title}`}
                  />
                </td>
              )}
              {columns.map(column => (
                <td key={column.key} className={`cell-${column.type || 'text'}`}>
                  {renderCellContent(item, column)}
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
      <div className="table-footer">
        <p className="result-count">
          Mostrando {sortedData.length} de {data.length} registros
        </p>
      </div>
    </div>
  )
}
