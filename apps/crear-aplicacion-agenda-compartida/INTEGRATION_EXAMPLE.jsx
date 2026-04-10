// Example: Complete Integration of Data Layer, State Management, and UI Components

import React, { useState } from 'react'
import { useApp } from '../context/AppContext'
import { useFilters, useDataQueries, useStats, useSyncManager } from '../hooks'
import FiltersPanel from '../components/FiltersPanel'
import DataTable from '../components/DataTable'

/**
 * Example page showing how all pieces work together:
 * 1. Global state (AppContext)
 * 2. Filtering (useFilters)
 * 3. Data queries (useDataQueries)
 * 4. Statistics (useStats)
 * 5. Synchronization (useSyncManager)
 * 6. UI Components (FiltersPanel, DataTable)
 */

export default function TasksPageExample() {
  const { state, dispatch } = useApp()

  // 1. Setup filtering
  const {
    filters,
    filteredData,
    updateFilters,
    clearFilters,
    filterCount,
  } = useFilters(state.tasks, 'tasks')

  // 2. Access common queries
  const { tasksByStatus, overdueTasks, highPriorityPending } = useDataQueries(
    state.tasks,
    state.events
  )

  // 3. Get statistics
  const { taskStats } = useStats(state.tasks, state.events)

  // 4. Setup sync manager
  const {
    syncStatus,
    hasPendingChanges,
    queueTaskChange,
    performSync,
  } = useSyncManager(
    state.tasks,
    state.events,
    (tasks) => dispatch({ type: 'SYNC_TASKS', payload: tasks }),
    (events) => dispatch({ type: 'SYNC_EVENTS', payload: events })
  )

  // 5. Handle status change with sync queue
  const handleStatusChange = (taskId, newStatus) => {
    const task = state.tasks.find(t => t.id === taskId)
    if (task) {
      dispatch({
        type: 'UPDATE_TASK',
        payload: { id: taskId, changes: { status: newStatus } },
      })
      queueTaskChange({ ...task, status: newStatus }, 'update')
    }
  }

  // 6. Define columns for DataTable
  const columns = [
    { key: 'title', label: 'Título', sortable: true },
    { key: 'dueDate', label: 'Vencimiento', type: 'date', sortable: true },
    { key: 'priority', label: 'Prioridad', type: 'priority', sortable: true },
    { key: 'status', label: 'Estado', type: 'status', sortable: true },
    { key: 'assignee', label: 'Asignado', type: 'user', sortable: true },
  ]

  return (
    <div className="tasks-page">
      {/* Statistics summary */}
      <div className="stats-summary">
        <div>Total: {taskStats.total}</div>
        <div>Pendientes: {taskStats.pending}</div>
        <div>En progreso: {taskStats.inProgress}</div>
        <div>Completadas: {taskStats.done}</div>
        <div>Vencidas: {taskStats.overdue}</div>
      </div>

      {/* Sync status indicator */}
      {syncStatus !== 'idle' && (
        <div className={`sync-indicator sync-${syncStatus}`}>
          {syncStatus === 'syncing' && 'Sincronizando...'}
          {syncStatus === 'synced' && '✓ Sincronizado'}
          {syncStatus === 'error' && '✗ Error de sincronización'}
          {syncStatus === 'offline' && '⚠ Sin conexión'}
        </div>
      )}

      {/* Filters panel */}
      <FiltersPanel
        tasks={state.tasks}
        activeFilters={filters}
        onFilterChange={updateFilters}
        filterType="tasks"
      />

      {/* Data table with filtered data */}
      <DataTable
        data={filteredData}
        columns={columns}
        type="tasks"
        filters={filters}
        onStatusChange={handleStatusChange}
        selectable={true}
      />

      {/* Action buttons */}
      <div className="actions">
        {hasPendingChanges && (
          <button onClick={performSync} className="btn-sync">
            Sincronizar cambios
          </button>
        )}
        {filterCount > 0 && (
          <button onClick={clearFilters} className="btn-clear">
            Limpiar filtros
          </button>
        )}
      </div>
    </div>
  )
}
