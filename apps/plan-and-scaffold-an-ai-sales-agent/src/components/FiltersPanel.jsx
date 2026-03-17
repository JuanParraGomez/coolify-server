/**
 * FiltersPanel Component - Reusable filter UI for leads, alerts, and responses
 * Provides dynamic filter controls based on configuration
 */

import React, { useState, useCallback } from 'react'

const S = {
  container: {
    display: 'flex',
    gap: '0.75rem',
    marginBottom: '1.5rem',
    flexWrap: 'wrap',
    padding: '0.75rem',
    background: '#0f172a',
    borderRadius: 10,
    border: '1px solid #1e293b',
  },
  searchInput: {
    flex: 1,
    minWidth: 250,
    background: '#1e293b',
    border: '1px solid #334155',
    borderRadius: 8,
    padding: '0.6rem 0.75rem',
    color: '#e2e8f0',
    fontSize: '0.875rem',
    fontFamily: 'inherit',
    transition: 'border-color 0.2s',
  },
  filterGroup: {
    display: 'flex',
    gap: '0.5rem',
    alignItems: 'center',
    flexWrap: 'wrap',
  },
  filterLabel: {
    fontSize: '0.75rem',
    color: '#94a3b8',
    textTransform: 'uppercase',
    fontWeight: 600,
    whiteSpace: 'nowrap',
  },
  select: {
    background: '#1e293b',
    border: '1px solid #334155',
    borderRadius: 8,
    padding: '0.5rem 0.75rem',
    color: '#e2e8f0',
    fontSize: '0.875rem',
    cursor: 'pointer',
    fontFamily: 'inherit',
    transition: 'border-color 0.2s',
  },
  button: {
    background: '#3b82f6',
    color: '#fff',
    border: 'none',
    borderRadius: 7,
    padding: '0.5rem 0.75rem',
    fontSize: '0.875rem',
    cursor: 'pointer',
    fontWeight: 500,
    transition: 'background 0.2s',
  },
  buttonSecondary: {
    background: '#334155',
    color: '#e2e8f0',
    border: 'none',
    borderRadius: 7,
    padding: '0.5rem 0.75rem',
    fontSize: '0.875rem',
    cursor: 'pointer',
    transition: 'background 0.2s',
  },
  buttonDanger: {
    background: '#ef4444',
    color: '#fff',
    border: 'none',
    borderRadius: 7,
    padding: '0.5rem 0.75rem',
    fontSize: '0.875rem',
    cursor: 'pointer',
    transition: 'background 0.2s',
  },
  badge: {
    display: 'inline-block',
    background: '#3b82f6',
    color: '#fff',
    borderRadius: 20,
    padding: '0.25rem 0.5rem',
    fontSize: '0.7rem',
    fontWeight: 600,
    marginLeft: '0.25rem',
  },
  activeFiltersContainer: {
    display: 'flex',
    gap: '0.5rem',
    flexWrap: 'wrap',
    alignItems: 'center',
  },
  activeFilter: {
    display: 'inline-flex',
    alignItems: 'center',
    gap: '0.5rem',
    background: '#1e293b',
    border: '1px solid #3b82f6',
    borderRadius: 6,
    padding: '0.4rem 0.6rem',
    fontSize: '0.75rem',
    color: '#93c5fd',
  },
  clearButton: {
    background: 'transparent',
    border: 'none',
    color: '#93c5fd',
    cursor: 'pointer',
    fontSize: '0.9rem',
    padding: 0,
  },
}

/**
 * FiltersPanel Component
 * @param {Object} props
 * @param {string} props.searchValue - Current search query
 * @param {Function} props.onSearchChange - Handler for search changes
 * @param {Object} props.filters - Current filter values { filterKey: value }
 * @param {Function} props.onFilterChange - Handler for filter changes (filterKey, value)
 * @param {Array} props.filterConfigs - Filter configuration array
 * @param {Function} props.onRefresh - Optional refresh handler
 * @param {Function} props.onReset - Optional reset handler
 * @param {boolean} props.showRefresh - Show refresh button
 * @param {boolean} props.showActiveFilters - Show active filters display
 * @param {string} props.placeholder - Search input placeholder
 * @param {Object} props.customStyles - Optional custom styles override
 *
 * @example
 * const configs = [
 *   {
 *     key: 'status',
 *     label: 'Estado',
 *     options: [
 *       { value: 'all', label: 'Todos' },
 *       { value: 'new', label: 'Nuevo' }
 *     ]
 *   }
 * ]
 * <FiltersPanel
 *   searchValue={search}
 *   onSearchChange={setSearch}
 *   filters={{ status: 'new' }}
 *   onFilterChange={(key, val) => setFilter(key, val)}
 *   filterConfigs={configs}
 * />
 */
export default function FiltersPanel({
  searchValue = '',
  onSearchChange = () => {},
  filters = {},
  onFilterChange = () => {},
  filterConfigs = [],
  onRefresh = null,
  onReset = null,
  showRefresh = true,
  showActiveFilters = true,
  placeholder = 'Buscar...',
  customStyles = {},
}) {
  const [expandedFilters, setExpandedFilters] = useState({})

  const mergedS = { ...S, ...customStyles }

  const handleSearchChange = useCallback((e) => {
    onSearchChange(e.target.value)
  }, [onSearchChange])

  const handleFilterChange = useCallback((filterKey, value) => {
    onFilterChange(filterKey, value)
  }, [onFilterChange])

  const toggleFilterExpanded = useCallback((filterKey) => {
    setExpandedFilters(prev => ({
      ...prev,
      [filterKey]: !prev[filterKey],
    }))
  }, [])

  // Count active filters (excluding 'all' values)
  const activeFilterCount = Object.entries(filters).filter(
    ([_, value]) => value && value !== 'all'
  ).length

  const hasActiveFilters = searchValue || activeFilterCount > 0

  return (
    <div style={mergedS.container}>
      {/* Search Input */}
      <input
        type="text"
        style={mergedS.searchInput}
        placeholder={placeholder}
        value={searchValue}
        onChange={handleSearchChange}
        onFocus={(e) => {
          e.target.style.borderColor = '#3b82f6'
        }}
        onBlur={(e) => {
          e.target.style.borderColor = '#334155'
        }}
      />

      {/* Filter Selects */}
      <div style={mergedS.filterGroup}>
        {filterConfigs.map(config => (
          <div key={config.key} style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            {config.label && (
              <label style={mergedS.filterLabel}>{config.label}:</label>
            )}
            <select
              style={mergedS.select}
              value={filters[config.key] || 'all'}
              onChange={(e) => handleFilterChange(config.key, e.target.value)}
              onFocus={(e) => {
                e.target.style.borderColor = '#3b82f6'
              }}
              onBlur={(e) => {
                e.target.style.borderColor = '#334155'
              }}
            >
              {config.options.map(option => (
                <option key={option.value} value={option.value}>
                  {option.label}
                </option>
              ))}
            </select>
          </div>
        ))}
      </div>

      {/* Action Buttons */}
      <div style={mergedS.filterGroup}>
        {showRefresh && onRefresh && (
          <button
            style={mergedS.button}
            onClick={onRefresh}
            title="Actualizar datos"
            onMouseEnter={(e) => {
              e.target.style.background = '#2563eb'
            }}
            onMouseLeave={(e) => {
              e.target.style.background = '#3b82f6'
            }}
          >
            ↻ Actualizar
          </button>
        )}

        {hasActiveFilters && onReset && (
          <button
            style={mergedS.buttonSecondary}
            onClick={onReset}
            title="Limpiar todos los filtros"
            onMouseEnter={(e) => {
              e.target.style.background = '#475569'
            }}
            onMouseLeave={(e) => {
              e.target.style.background = '#334155'
            }}
          >
            ✕ Limpiar
          </button>
        )}

        {hasActiveFilters && (
          <span style={mergedS.badge}>
            {(searchValue ? 1 : 0) + activeFilterCount} filtro{activeFilterCount + (searchValue ? 1 : 0) !== 1 ? 's' : ''}
          </span>
        )}
      </div>

      {/* Active Filters Display */}
      {showActiveFilters && hasActiveFilters && (
        <div style={{ width: '100%' }}>
          <div style={mergedS.activeFiltersContainer}>
            {searchValue && (
              <div style={mergedS.activeFilter}>
                <span>🔍 "{searchValue}"</span>
                <button
                  style={mergedS.clearButton}
                  onClick={() => onSearchChange('')}
                  title="Limpiar búsqueda"
                >
                  ✕
                </button>
              </div>
            )}

            {filterConfigs.map(config => {
              const value = filters[config.key]
              if (!value || value === 'all') return null

              const option = config.options.find(o => o.value === value)
              const label = option?.label || value

              return (
                <div key={config.key} style={mergedS.activeFilter}>
                  <span>{config.label}: {label}</span>
                  <button
                    style={mergedS.clearButton}
                    onClick={() => handleFilterChange(config.key, 'all')}
                    title="Limpiar este filtro"
                  >
                    ✕
                  </button>
                </div>
              )
            })}
          </div>
        </div>
      )}
    </div>
  )
}

/**
 * Advanced Filter with Collapsible Groups
 * For more complex filtering scenarios
 */
export function AdvancedFiltersPanel({
  filters = {},
  onFilterChange = () => {},
  filterGroups = [], // Array of { label, filters: [...] }
  onReset = null,
  customStyles = {},
}) {
  const [expanded, setExpanded] = useState({})
  const mergedS = { ...S, ...customStyles }

  const toggleGroup = (groupId) => {
    setExpanded(prev => ({
      ...prev,
      [groupId]: !prev[groupId],
    }))
  }

  return (
    <div style={{ ...mergedS.container, flexDirection: 'column' }}>
      {filterGroups.map((group, idx) => (
        <div key={idx} style={{ borderBottom: '1px solid #334155', paddingBottom: '0.75rem', marginBottom: '0.75rem' }}>
          <button
            style={{
              ...mergedS.buttonSecondary,
              width: '100%',
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
              padding: '0.5rem 0.75rem',
              textAlign: 'left',
            }}
            onClick={() => toggleGroup(idx)}
          >
            <span>{group.label}</span>
            <span>{expanded[idx] ? '▼' : '▶'}</span>
          </button>

          {expanded[idx] && (
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '0.75rem', marginTop: '0.75rem' }}>
              {group.filters.map(config => (
                <div key={config.key}>
                  {config.label && (
                    <label style={mergedS.filterLabel}>{config.label}</label>
                  )}
                  <select
                    style={{ ...mergedS.select, width: '100%' }}
                    value={filters[config.key] || 'all'}
                    onChange={(e) => onFilterChange(config.key, e.target.value)}
                  >
                    {config.options.map(option => (
                      <option key={option.value} value={option.value}>
                        {option.label}
                      </option>
                    ))}
                  </select>
                </div>
              ))}
            </div>
          )}
        </div>
      ))}

      {onReset && (
        <button
          style={mergedS.buttonDanger}
          onClick={onReset}
        >
          Limpiar todos los filtros
        </button>
      )}
    </div>
  )
}

/**
 * Quick Filter Pills
 * For simple preset filter options
 */
export function QuickFilters({
  selectedFilter = '',
  onFilterSelect = () => {},
  filters = [],
  customStyles = {},
}) {
  const mergedS = { ...S, ...customStyles }

  return (
    <div style={{ display: 'flex', gap: '0.5rem', flexWrap: 'wrap', marginBottom: '1rem' }}>
      {filters.map(filter => (
        <button
          key={filter.value}
          style={{
            ...mergedS.button,
            background: selectedFilter === filter.value ? '#3b82f6' : '#334155',
            color: selectedFilter === filter.value ? '#fff' : '#e2e8f0',
          }}
          onClick={() => onFilterSelect(filter.value)}
          onMouseEnter={(e) => {
            if (selectedFilter !== filter.value) {
              e.target.style.background = '#475569'
            }
          }}
          onMouseLeave={(e) => {
            if (selectedFilter !== filter.value) {
              e.target.style.background = '#334155'
            }
          }}
        >
          {filter.icon && <span>{filter.icon} </span>}
          {filter.label}
          {filter.count && <span style={mergedS.badge}>{filter.count}</span>}
        </button>
      ))}
    </div>
  )
}
