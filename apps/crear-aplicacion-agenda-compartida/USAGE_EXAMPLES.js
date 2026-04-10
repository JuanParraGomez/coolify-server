// Example: Using DataTable and FiltersPanel together

import React, { useState } from 'react'
import { useApp } from '../context/AppContext'
import FiltersPanel from '../components/FiltersPanel'
import DataTable from '../components/DataTable'

export default function TaskTableView() {
  const { state, dispatch } = useApp()
  const [filters, setFilters] = useState({})
  const [selectedTasks, setSelectedTasks] = useState([])

  // Define which columns to display
  const taskColumns = [
    { key: 'title', label: 'Tarea', type: 'text' },
    { key: 'dueDate', label: 'Vencimiento', type: 'date' },
    { key: 'priority', label: 'Prioridad', type: 'priority' },
    { key: 'status', label: 'Estado', type: 'status' },
    { key: 'assignee', label: 'Asignado', type: 'user' },
    { key: 'tags', label: 'Etiquetas', type: 'tags' },
  ]

  // Handle status change
  const handleStatusChange = (taskId, newStatus) => {
    dispatch({
      type: 'UPDATE_TASK',
      payload: { id: taskId, status: newStatus }
    })
  }

  // Handle row click
  const handleRowClick = (task) => {
    console.log('Task clicked:', task)
    // Could open detail modal or navigate to task detail page
  }

  return (
    <div style={{ padding: '20px' }}>
      <h1>Mis Tareas</h1>
      
      <FiltersPanel
        tasks={state.tasks}
        activeFilters={filters}
        onFilterChange={setFilters}
        filterType="tasks"
      />
      
      <DataTable
        data={state.tasks}
        columns={taskColumns}
        type="tasks"
        filters={filters}
        onRowClick={handleRowClick}
        onStatusChange={handleStatusChange}
        sortBy="dueDate"
        selectable={true}
        onSelectionChange={setSelectedTasks}
      />
      
      {selectedTasks.length > 0 && (
        <div style={{ marginTop: '20px', padding: '10px', backgroundColor: '#e0e7ff', borderRadius: '6px' }}>
          <p>{selectedTasks.length} tarea(s) seleccionada(s)</p>
          <button onClick={() => setSelectedTasks([])}>Limpiar selección</button>
        </div>
      )}
    </div>
  )
}

// ============================================

// Example: Using filters programmatically

import { 
  filterTasksByStatus, 
  filterTasksByPriority,
  getTaskStats,
  getAllTags 
} from '../lib/mock-data'

// Get high priority pending tasks
const highPriorityPending = filterTasksByStatus(
  filterTasksByPriority(state.tasks, 'high'),
  'pending'
)

// Get statistics
const stats = getTaskStats(state.tasks)
console.log(`${stats.pending} pending, ${stats.done} done, ${stats.overdue} overdue`)

// Get all available tags for filter options
const availableTags = getAllTags(state.tasks)

// ============================================

// Example: Building an events calendar

import FiltersPanel from '../components/FiltersPanel'
import DataTable from '../components/DataTable'

export default function EventsCalendarView() {
  const { state } = useApp()
  const [filters, setFilters] = useState({})

  const eventColumns = [
    { key: 'title', label: 'Evento', type: 'text' },
    { key: 'date', label: 'Fecha', type: 'date' },
    { key: 'time', label: 'Hora', type: 'time' },
    { key: 'type', label: 'Tipo', type: 'text' },
    { key: 'location', label: 'Ubicación', type: 'text' },
  ]

  return (
    <div>
      <FiltersPanel
        events={state.events}
        activeFilters={filters}
        onFilterChange={setFilters}
        filterType="events"
      />
      
      <DataTable
        data={state.events}
        columns={eventColumns}
        type="events"
        filters={filters}
        sortBy="date"
      />
    </div>
  )
}

// ============================================

// Example: Bulk operations with selected items

function handleBulkStatusUpdate(selectedIds, newStatus) {
  selectedIds.forEach(id => {
    dispatch({
      type: 'UPDATE_TASK',
      payload: { id, status: newStatus }
    })
  })
}

// In UI:
{selectedTasks.length > 0 && (
  <div style={{ display: 'flex', gap: '10px', marginTop: '20px' }}>
    <button onClick={() => handleBulkStatusUpdate(selectedTasks, 'in-progress')}>
      Marcar como En Progreso
    </button>
    <button onClick={() => handleBulkStatusUpdate(selectedTasks, 'done')}>
      Marcar como Completo
    </button>
  </div>
)}
