/**
 * DataTable Component - Reusable, flexible data table for leads, alerts, and other data
 * Supports sorting, row actions, custom cell rendering, and pagination
 */

import React, { useState, useMemo, useCallback } from 'react'

const S = {
  container: {
    background: '#1e293b',
    borderRadius: 10,
    border: '1px solid #334155',
    overflow: 'hidden',
    marginBottom: '1.5rem',
  },
  table: {
    width: '100%',
    borderCollapse: 'collapse',
    fontSize: '0.875rem',
  },
  thead: {
    background: '#0f172a',
    borderBottom: '2px solid #334155',
  },
  th: {
    textAlign: 'left',
    padding: '0.75rem',
    fontSize: '0.75rem',
    color: '#94a3b8',
    textTransform: 'uppercase',
    fontWeight: 600,
    cursor: 'pointer',
    userSelect: 'none',
    whiteSpace: 'nowrap',
  },
  thSortable: {
    cursor: 'pointer',
  },
  thSortIndicator: {
    marginLeft: '0.35rem',
    fontSize: '0.7rem',
  },
  tbody: {
    background: '#1e293b',
  },
  tr: {
    borderBottom: '1px solid #1e293b',
    transition: 'background 0.15s',
  },
  trHover: {
    background: '#0f172a',
  },
  td: {
    padding: '0.75rem',
    color: '#e2e8f0',
    verticalAlign: 'middle',
  },
  emptyState: {
    textAlign: 'center',
    padding: '2rem',
    color: '#64748b',
    fontSize: '0.875rem',
  },
  loadingState: {
    textAlign: 'center',
    padding: '2rem',
    color: '#94a3b8',
    fontSize: '0.875rem',
  },
  pagination: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: '1rem',
    background: '#0f172a',
    borderTop: '1px solid #334155',
    fontSize: '0.875rem',
    color: '#94a3b8',
  },
  paginationButton: {
    background: '#334155',
    color: '#e2e8f0',
    border: 'none',
    borderRadius: 6,
    padding: '0.4rem 0.75rem',
    cursor: 'pointer',
    fontSize: '0.8rem',
    transition: 'background 0.2s',
  },
  badge: {
    display: 'inline-block',
    padding: '0.25rem 0.6rem',
    borderRadius: 4,
    fontSize: '0.7rem',
    fontWeight: 500,
    whiteSpace: 'nowrap',
  },
  actionButton: {
    background: 'transparent',
    border: 'none',
    color: '#3b82f6',
    cursor: 'pointer',
    fontSize: '0.8rem',
    textDecoration: 'none',
    transition: 'color 0.2s',
    padding: '0.25rem 0.5rem',
    marginRight: '0.5rem',
  },
  skeleton: {
    background: 'linear-gradient(90deg, #1e293b 25%, #334155 50%, #1e293b 75%)',
    backgroundSize: '200% 100%',
    animation: 'skeleton 1.5s infinite',
  },
}

/**
 * DataTable Component
 * @param {Object} props
 * @param {Array} props.data - Array of data objects to display
 * @param {Array} props.columns - Column definitions
 * @param {Function} props.onRowClick - Handler when row is clicked
 * @param {boolean} props.loading - Show loading state
 * @param {boolean} props.sortable - Enable column sorting
 * @param {boolean} props.pagination - Enable pagination
 * @param {number} props.rowsPerPage - Rows per page for pagination
 * @param {Function} props.renderCell - Custom cell renderer (column, value, row) => ReactNode
 * @param {Function} props.rowKey - Function to get unique key for row (row) => string
 * @param {Array} props.rowActions - Array of action objects { label, onClick, icon, color }
 * @param {boolean} props.striped - Show striped rows
 * @param {string} props.emptyMessage - Message when data is empty
 * @param {Object} props.customStyles - Custom style overrides
 *
 * @example
 * const columns = [
 *   { key: 'name', label: 'Nombre', width: '20%' },
 *   { key: 'company', label: 'Empresa', width: '25%' },
 *   { key: 'score', label: 'Score', width: '15%', sortable: true }
 * ]
 * <DataTable
 *   data={leads}
 *   columns={columns}
 *   sortable
 *   pagination
 *   rowsPerPage={10}
 * />
 */
export default function DataTable({
  data = [],
  columns = [],
  onRowClick = null,
  loading = false,
  sortable = true,
  pagination = true,
  rowsPerPage = 10,
  renderCell = null,
  rowKey = (row, idx) => row.id || idx,
  rowActions = [],
  striped = false,
  emptyMessage = 'No hay datos para mostrar',
  customStyles = {},
}) {
  const [sortConfig, setSortConfig] = useState({ key: null, direction: 'asc' })
  const [currentPage, setCurrentPage] = useState(1)

  const mergedS = { ...S, ...customStyles }

  // Handle sorting
  const handleSort = useCallback((columnKey) => {
    if (!sortable || !columns.find(c => c.key === columnKey)?.sortable !== false) {
      setSortConfig(prev => ({
        key: columnKey,
        direction: prev.key === columnKey && prev.direction === 'asc' ? 'desc' : 'asc',
      }))
      setCurrentPage(1)
    }
  }, [sortable, columns])

  // Sort data
  const sortedData = useMemo(() => {
    if (!sortConfig.key || !sortable) return data

    const sorted = [...data].sort((a, b) => {
      const aVal = a[sortConfig.key]
      const bVal = b[sortConfig.key]

      if (aVal == null) return 1
      if (bVal == null) return -1

      if (typeof aVal === 'number' && typeof bVal === 'number') {
        return sortConfig.direction === 'asc' ? aVal - bVal : bVal - aVal
      }

      const aStr = String(aVal).toLowerCase()
      const bStr = String(bVal).toLowerCase()
      return sortConfig.direction === 'asc'
        ? aStr.localeCompare(bStr)
        : bStr.localeCompare(aStr)
    })

    return sorted
  }, [data, sortConfig, sortable])

  // Paginate data
  const paginatedData = useMemo(() => {
    if (!pagination) return sortedData

    const start = (currentPage - 1) * rowsPerPage
    const end = start + rowsPerPage
    return sortedData.slice(start, end)
  }, [sortedData, currentPage, rowsPerPage, pagination])

  const totalPages = Math.ceil(sortedData.length / rowsPerPage)

  // Render cell with custom renderer or default
  const renderCellContent = (column, row) => {
    if (renderCell) {
      return renderCell(column, row[column.key], row)
    }

    const value = row[column.key]

    // Handle different data types
    if (typeof value === 'number') {
      return column.format ? column.format(value) : value
    }

    if (typeof value === 'boolean') {
      return value ? '✓' : '—'
    }

    if (Array.isArray(value)) {
      return value.join(', ')
    }

    if (value instanceof Date) {
      return value.toLocaleDateString('es-MX')
    }

    return value || '—'
  }

  if (loading) {
    return (
      <div style={mergedS.container}>
        <div style={mergedS.loadingState}>
          <div style={{ animation: 'spin 1s linear infinite' }}>⟳</div>
          <p style={{ marginTop: '0.5rem' }}>Cargando datos...</p>
        </div>
      </div>
    )
  }

  if (!sortedData || sortedData.length === 0) {
    return (
      <div style={mergedS.container}>
        <div style={mergedS.emptyState}>
          {emptyMessage}
        </div>
      </div>
    )
  }

  return (
    <div style={mergedS.container}>
      <div style={{ overflowX: 'auto' }}>
        <table style={mergedS.table}>
          <thead style={mergedS.thead}>
            <tr>
              {columns.map(column => (
                <th
                  key={column.key}
                  style={{
                    ...mergedS.th,
                    width: column.width,
                    cursor: sortable && column.sortable !== false ? 'pointer' : 'default',
                  }}
                  onClick={() => {
                    if (sortable && column.sortable !== false) {
                      handleSort(column.key)
                    }
                  }}
                  title={sortable && column.sortable !== false ? 'Click para ordenar' : ''}
                >
                  <span style={{ display: 'flex', alignItems: 'center' }}>
                    {column.label}
                    {sortable && column.sortable !== false && sortConfig.key === column.key && (
                      <span style={mergedS.thSortIndicator}>
                        {sortConfig.direction === 'asc' ? '▲' : '▼'}
                      </span>
                    )}
                  </span>
                </th>
              ))}
              {rowActions.length > 0 && (
                <th style={{ ...mergedS.th, width: 'auto' }}>Acciones</th>
              )}
            </tr>
          </thead>
          <tbody style={mergedS.tbody}>
            {paginatedData.map((row, idx) => (
              <tr
                key={rowKey(row, idx)}
                style={{
                  ...mergedS.tr,
                  background: striped && idx % 2 === 1 ? '#0f172a' : '#1e293b',
                  cursor: onRowClick ? 'pointer' : 'default',
                }}
                onClick={() => onRowClick?.(row)}
                onMouseEnter={(e) => {
                  if (onRowClick) {
                    e.currentTarget.style.background = mergedS.trHover.background
                  }
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.background = striped && idx % 2 === 1 ? '#0f172a' : '#1e293b'
                }}
              >
                {columns.map(column => (
                  <td
                    key={`${rowKey(row, idx)}-${column.key}`}
                    style={{
                      ...mergedS.td,
                      width: column.width,
                      textAlign: column.align || 'left',
                    }}
                  >
                    {renderCellContent(column, row)}
                  </td>
                ))}
                {rowActions.length > 0 && (
                  <td style={mergedS.td}>
                    <div style={{ display: 'flex', gap: '0.5rem', flexWrap: 'wrap' }}>
                      {rowActions.map(action => (
                        <button
                          key={action.label}
                          style={{
                            ...mergedS.actionButton,
                            color: action.color || '#3b82f6',
                          }}
                          onClick={(e) => {
                            e.stopPropagation()
                            action.onClick(row)
                          }}
                          title={action.label}
                          onMouseEnter={(e) => {
                            e.target.style.opacity = '0.8'
                          }}
                          onMouseLeave={(e) => {
                            e.target.style.opacity = '1'
                          }}
                        >
                          {action.icon && <span>{action.icon} </span>}
                          {action.label}
                        </button>
                      ))}
                    </div>
                  </td>
                )}
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {pagination && totalPages > 1 && (
        <div style={mergedS.pagination}>
          <div>
            Mostrando {((currentPage - 1) * rowsPerPage) + 1} a{' '}
            {Math.min(currentPage * rowsPerPage, sortedData.length)} de {sortedData.length}
          </div>
          <div style={{ display: 'flex', gap: '0.5rem' }}>
            <button
              style={mergedS.paginationButton}
              onClick={() => setCurrentPage(prev => Math.max(1, prev - 1))}
              disabled={currentPage === 1}
              onMouseEnter={(e) => {
                if (currentPage > 1) e.target.style.background = '#475569'
              }}
              onMouseLeave={(e) => {
                e.target.style.background = '#334155'
              }}
            >
              ← Anterior
            </button>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
              <span>Página {currentPage} de {totalPages}</span>
            </div>
            <button
              style={mergedS.paginationButton}
              onClick={() => setCurrentPage(prev => Math.min(totalPages, prev + 1))}
              disabled={currentPage === totalPages}
              onMouseEnter={(e) => {
                if (currentPage < totalPages) e.target.style.background = '#475569'
              }}
              onMouseLeave={(e) => {
                e.target.style.background = '#334155'
              }}
            >
              Siguiente →
            </button>
          </div>
        </div>
      )}

      <style>{`
        @keyframes skeleton {
          0% { background-position: 200% 0; }
          100% { background-position: -200% 0; }
        }
        @keyframes spin {
          0% { transform: rotate(0deg); }
          100% { transform: rotate(360deg); }
        }
      `}</style>
    </div>
  )
}

/**
 * ExpandableDataTable - DataTable with expandable row details
 */
export function ExpandableDataTable({
  data = [],
  columns = [],
  renderExpandedRow = null,
  ...props
}) {
  const [expandedRows, setExpandedRows] = useState(new Set())

  const toggleRowExpanded = (rowKey) => {
    setExpandedRows(prev => {
      const next = new Set(prev)
      if (next.has(rowKey)) {
        next.delete(rowKey)
      } else {
        next.add(rowKey)
      }
      return next
    })
  }

  const expandColumn = {
    key: '_expand',
    label: '',
    width: '40px',
    sortable: false,
  }

  const updatedColumns = [expandColumn, ...columns]

  return (
    <DataTable
      {...props}
      data={data}
      columns={updatedColumns}
      renderCell={(column, value, row) => {
        if (column.key === '_expand') {
          const rowId = row.id || row
          return (
            <button
              style={{
                background: 'transparent',
                border: 'none',
                color: '#3b82f6',
                cursor: 'pointer',
                fontSize: '1rem',
                padding: 0,
              }}
              onClick={() => toggleRowExpanded(rowId)}
            >
              {expandedRows.has(rowId) ? '▼' : '▶'}
            </button>
          )
        }
        return props.renderCell?.(column, value, row) || value
      }}
      rowActions={[
        ...(props.rowActions || []),
      ]}
    />
  )
}

/**
 * CompactDataTable - Minimalist version for dashboards
 */
export function CompactDataTable({
  data = [],
  columns = [],
  maxRows = 5,
  ...props
}) {
  const compactData = data.slice(0, maxRows)

  return (
    <DataTable
      {...props}
      data={compactData}
      columns={columns}
      pagination={false}
      sortable={false}
    />
  )
}
