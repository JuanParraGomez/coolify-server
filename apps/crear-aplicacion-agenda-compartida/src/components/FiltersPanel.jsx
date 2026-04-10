import React, { useState } from 'react'
import { TASK_STATUSES, PRIORITY_LEVELS, EVENT_TYPES, USERS, getAllTags } from '../lib/mock-data'
import '../styles/FiltersPanel.css'

export default function FiltersPanel({
  tasks = [],
  events = [],
  activeFilters = {},
  onFilterChange = () => {},
  filterType = 'tasks',
}) {
  const [expanded, setExpanded] = useState(false)
  const [searchText, setSearchText] = useState('')

  const handleStatusToggle = (status) => {
    const currentStatuses = activeFilters.statuses || []
    const newStatuses = currentStatuses.includes(status)
      ? currentStatuses.filter(s => s !== status)
      : [...currentStatuses, status]
    onFilterChange({ ...activeFilters, statuses: newStatuses })
  }

  const handlePriorityToggle = (priority) => {
    const currentPriorities = activeFilters.priorities || []
    const newPriorities = currentPriorities.includes(priority)
      ? currentPriorities.filter(p => p !== priority)
      : [...currentPriorities, priority]
    onFilterChange({ ...activeFilters, priorities: newPriorities })
  }

  const handleAssigneeToggle = (assignee) => {
    const currentAssignees = activeFilters.assignees || []
    const newAssignees = currentAssignees.includes(assignee)
      ? currentAssignees.filter(a => a !== assignee)
      : [...currentAssignees, assignee]
    onFilterChange({ ...activeFilters, assignees: newAssignees })
  }

  const handleTagToggle = (tag) => {
    const currentTags = activeFilters.tags || []
    const newTags = currentTags.includes(tag)
      ? currentTags.filter(t => t !== tag)
      : [...currentTags, tag]
    onFilterChange({ ...activeFilters, tags: newTags })
  }

  const handleTypeToggle = (type) => {
    const currentTypes = activeFilters.types || []
    const newTypes = currentTypes.includes(type)
      ? currentTypes.filter(t => t !== type)
      : [...currentTypes, type]
    onFilterChange({ ...activeFilters, types: newTypes })
  }

  const handleSearchChange = (e) => {
    const text = e.target.value
    setSearchText(text)
    onFilterChange({ ...activeFilters, search: text || null })
  }

  const handleClearFilters = () => {
    setSearchText('')
    onFilterChange({})
    setExpanded(false)
  }

  const activeFilterCount = Object.values(activeFilters).filter(f => f && (Array.isArray(f) ? f.length > 0 : true)).length

  const uniqueTags = getAllTags(tasks)
  const hasActiveFilters = activeFilterCount > 0

  return (
    <div className="filters-panel">
      {/* Search bar */}
      <div className="filters-search">
        <input
          type="text"
          placeholder="Buscar tareas, eventos..."
          value={searchText}
          onChange={handleSearchChange}
          className="search-input"
        />
        <button
          className="filters-toggle"
          onClick={() => setExpanded(!expanded)}
          title={expanded ? 'Cerrar filtros' : 'Abrir filtros'}
        >
          <span className="filter-icon">⚙️</span>
          {activeFilterCount > 0 && <span className="filter-badge">{activeFilterCount}</span>}
        </button>
      </div>

      {/* Expandable filters */}
      {expanded && (
        <div className="filters-content">
          {filterType === 'tasks' && (
            <>
              {/* Status filters */}
              <div className="filter-group">
                <h4 className="filter-title">Estado</h4>
                <div className="filter-options">
                  {Object.entries(TASK_STATUSES).map(([key, status]) => (
                    <label key={key} className="filter-option">
                      <input
                        type="checkbox"
                        checked={(activeFilters.statuses || []).includes(key)}
                        onChange={() => handleStatusToggle(key)}
                      />
                      <span className="status-label" style={{ color: status.color }}>
                        {status.label}
                      </span>
                    </label>
                  ))}
                </div>
              </div>

              {/* Priority filters */}
              <div className="filter-group">
                <h4 className="filter-title">Prioridad</h4>
                <div className="filter-options">
                  {Object.entries(PRIORITY_LEVELS).map(([key, priority]) => (
                    <label key={key} className="filter-option">
                      <input
                        type="checkbox"
                        checked={(activeFilters.priorities || []).includes(key)}
                        onChange={() => handlePriorityToggle(key)}
                      />
                      <span className="priority-label" style={{ color: priority.color }}>
                        {priority.label}
                      </span>
                    </label>
                  ))}
                </div>
              </div>

              {/* Assignee filters */}
              <div className="filter-group">
                <h4 className="filter-title">Asignado a</h4>
                <div className="filter-options">
                  {Object.entries(USERS).map(([key, user]) => (
                    <label key={key} className="filter-option">
                      <input
                        type="checkbox"
                        checked={(activeFilters.assignees || []).includes(key)}
                        onChange={() => handleAssigneeToggle(key)}
                      />
                      <span className="user-label">
                        <span className="user-avatar" style={{ backgroundColor: user.color }}>
                          {user.initials}
                        </span>
                        {user.name}
                      </span>
                    </label>
                  ))}
                </div>
              </div>

              {/* Tags filters */}
              {uniqueTags.length > 0 && (
                <div className="filter-group">
                  <h4 className="filter-title">Etiquetas</h4>
                  <div className="filter-options">
                    {uniqueTags.map(tag => (
                      <label key={tag} className="filter-option">
                        <input
                          type="checkbox"
                          checked={(activeFilters.tags || []).includes(tag)}
                          onChange={() => handleTagToggle(tag)}
                        />
                        <span className="tag-label">{tag}</span>
                      </label>
                    ))}
                  </div>
                </div>
              )}
            </>
          )}

          {filterType === 'events' && (
            <>
              {/* Event type filters */}
              <div className="filter-group">
                <h4 className="filter-title">Tipo de evento</h4>
                <div className="filter-options">
                  {Object.entries(EVENT_TYPES).map(([key, eventType]) => (
                    <label key={key} className="filter-option">
                      <input
                        type="checkbox"
                        checked={(activeFilters.types || []).includes(key)}
                        onChange={() => handleTypeToggle(key)}
                      />
                      <span className="event-label" style={{ color: eventType.color }}>
                        {eventType.icon} {eventType.label}
                      </span>
                    </label>
                  ))}
                </div>
              </div>
            </>
          )}

          {/* Clear filters button */}
          {hasActiveFilters && (
            <button className="clear-filters-btn" onClick={handleClearFilters}>
              Limpiar filtros
            </button>
          )}
        </div>
      )}
    </div>
  )
}
