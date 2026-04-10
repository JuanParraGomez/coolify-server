// Advanced State Management and Sync Hooks
// Provides data layer abstraction for components

export {
  getTaskStats,
  getUpcomingEvents,
  groupTasksByAssignee,
  groupTasksByStatus,
  groupEventsByDate,
  getAllTags,
  getTagsWithFrequency,
  searchTasks,
  getTaskById,
  getTasksByUser,
  searchEvents,
  getEventById,
  getEventsByUser,
  detectConflict,
  resolveMerge,
  validateTask,
  validateEvent,
  exportTaskForSync,
  exportEventForSync,
} from './mock-data'

/**
 * State reducer for managing application state
 * Handles all state mutations consistently
 */
export function createAppReducer() {
  return {
    // ========================================================================
    // TASK OPERATIONS
    // ========================================================================

    addTask: (state, task) => ({
      ...state,
      tasks: [
        {
          ...task,
          syncVersion: 1,
          updatedAt: new Date().toISOString(),
        },
        ...state.tasks,
      ],
    }),

    updateTask: (state, id, changes) => ({
      ...state,
      tasks: state.tasks.map(t =>
        t.id === id
          ? {
              ...t,
              ...changes,
              syncVersion: (t.syncVersion || 0) + 1,
              updatedAt: new Date().toISOString(),
            }
          : t
      ),
    }),

    deleteTask: (state, id) => ({
      ...state,
      tasks: state.tasks.filter(t => t.id !== id),
    }),

    bulkUpdateTasks: (state, tasks) => ({
      ...state,
      tasks: state.tasks.map(t => {
        const update = tasks.find(u => u.id === t.id)
        return update
          ? {
              ...t,
              ...update,
              syncVersion: (t.syncVersion || 0) + 1,
              updatedAt: new Date().toISOString(),
            }
          : t
      }),
    }),

    mergeTasks: (state, remoteTasks) => {
      const merged = {}

      // Add existing local tasks
      state.tasks.forEach(t => {
        merged[t.id] = t
      })

      // Merge remote tasks
      remoteTasks.forEach(remote => {
        const local = merged[remote.id]
        if (!local) {
          merged[remote.id] = remote
        } else {
          // Use simple merge strategy: keep newest
          merged[remote.id] =
            (remote.syncVersion || 0) > (local.syncVersion || 0)
              ? remote
              : local
        }
      })

      return {
        ...state,
        tasks: Object.values(merged),
      }
    },

    // ========================================================================
    // EVENT OPERATIONS
    // ========================================================================

    addEvent: (state, event) => ({
      ...state,
      events: [
        {
          ...event,
          syncVersion: 1,
          updatedAt: new Date().toISOString(),
        },
        ...state.events,
      ],
    }),

    updateEvent: (state, id, changes) => ({
      ...state,
      events: state.events.map(e =>
        e.id === id
          ? {
              ...e,
              ...changes,
              syncVersion: (e.syncVersion || 0) + 1,
              updatedAt: new Date().toISOString(),
            }
          : e
      ),
    }),

    deleteEvent: (state, id) => ({
      ...state,
      events: state.events.filter(e => e.id !== id),
    }),

    mergeEvents: (state, remoteEvents) => {
      const merged = {}

      state.events.forEach(e => {
        merged[e.id] = e
      })

      remoteEvents.forEach(remote => {
        const local = merged[remote.id]
        if (!local) {
          merged[remote.id] = remote
        } else {
          merged[remote.id] =
            (remote.syncVersion || 0) > (local.syncVersion || 0)
              ? remote
              : local
        }
      })

      return {
        ...state,
        events: Object.values(merged),
      }
    },

    // ========================================================================
    // STATE SYNCHRONIZATION
    // ========================================================================

    replaceState: (state, newState) => newState,

    resetToDefaults: (state, defaultState) => defaultState,
  }
}

/**
 * Transform reducer object into action dispatcher
 */
export function createDispatcher(state, setStateCallback) {
  const actions = createAppReducer()

  return {
    // Task actions
    addTask: (task) => setStateCallback(actions.addTask(state, task)),
    updateTask: (id, changes) => setStateCallback(actions.updateTask(state, id, changes)),
    deleteTask: (id) => setStateCallback(actions.deleteTask(state, id)),
    bulkUpdateTasks: (tasks) => setStateCallback(actions.bulkUpdateTasks(state, tasks)),
    mergeTasks: (tasks) => setStateCallback(actions.mergeTasks(state, tasks)),

    // Event actions
    addEvent: (event) => setStateCallback(actions.addEvent(state, event)),
    updateEvent: (id, changes) => setStateCallback(actions.updateEvent(state, id, changes)),
    deleteEvent: (id) => setStateCallback(actions.deleteEvent(state, id)),
    mergeEvents: (events) => setStateCallback(actions.mergeEvents(state, events)),

    // State management
    replaceState: (newState) => setStateCallback(actions.replaceState(state, newState)),
    resetToDefaults: (defaults) => setStateCallback(actions.resetToDefaults(state, defaults)),
  }
}

/**
 * Persist state to localStorage
 */
export function persistState(state, storageKey = 'agenda-compartida-v1') {
  try {
    localStorage.setItem(
      storageKey,
      JSON.stringify({
        tasks: state.tasks,
        events: state.events,
        lastSync: new Date().toISOString(),
      })
    )
  } catch (error) {
    console.error('Failed to persist state', error)
  }
}

/**
 * Load state from localStorage
 */
export function loadPersistedState(storageKey = 'agenda-compartida-v1') {
  try {
    const raw = localStorage.getItem(storageKey)
    if (raw) {
      return JSON.parse(raw)
    }
  } catch (error) {
    console.error('Failed to load persisted state', error)
  }
  return null
}

/**
 * Detect offline status
 */
export function createOfflineDetector() {
  return {
    isOnline: () => navigator.onLine,
    onOnline: (callback) => window.addEventListener('online', callback),
    onOffline: (callback) => window.addEventListener('offline', callback),
    offOnline: (callback) => window.removeEventListener('online', callback),
    offOffline: (callback) => window.removeEventListener('offline', callback),
  }
}

/**
 * Batch multiple state mutations together
 */
export function batchUpdates(updates, state, setStateCallback) {
  let newState = state
  const dispatcher = createDispatcher(newState, (s) => {
    newState = s
  })

  updates.forEach(({ type, payload }) => {
    if (type === 'addTask') dispatcher.addTask(payload)
    else if (type === 'updateTask')
      dispatcher.updateTask(payload.id, payload.changes)
    else if (type === 'deleteTask') dispatcher.deleteTask(payload)
    else if (type === 'addEvent') dispatcher.addEvent(payload)
    else if (type === 'updateEvent')
      dispatcher.updateEvent(payload.id, payload.changes)
    else if (type === 'deleteEvent') dispatcher.deleteEvent(payload)
  })

  setStateCallback(newState)
  return newState
}

/**
 * Compute derived state efficiently
 */
export function computeDerivedState(state) {
  return {
    taskStats: (() => {
      const { tasks } = state
      return {
        total: tasks.length,
        pending: tasks.filter(t => t.status === 'pending').length,
        inProgress: tasks.filter(t => t.status === 'in-progress').length,
        done: tasks.filter(t => t.status === 'done').length,
        blocked: tasks.filter(t => t.status === 'blocked').length,
        overdue: tasks.filter(
          t => new Date(t.dueDate) < new Date() && t.status !== 'done'
        ).length,
      }
    })(),

    eventsByDate: (() => {
      const grouped = {}
      state.events.forEach(e => {
        if (!grouped[e.date]) grouped[e.date] = []
        grouped[e.date].push(e)
      })
      return grouped
    })(),

    tasksByAssignee: (() => {
      const grouped = {}
      state.tasks.forEach(t => {
        const assignee = t.assignee || 'unassigned'
        if (!grouped[assignee]) grouped[assignee] = []
        grouped[assignee].push(t)
      })
      return grouped
    })(),

    availableTags: (() => {
      const tags = new Set()
      state.tasks.forEach(t => {
        t.tags?.forEach(tag => tags.add(tag))
      })
      return Array.from(tags).sort()
    })(),
  }
}

/**
 * Create selector for specific data
 */
export function createSelectors(state) {
  return {
    // Simple selectors
    getTasks: () => state.tasks,
    getEvents: () => state.events,
    getTask: (id) => state.tasks.find(t => t.id === id),
    getEvent: (id) => state.events.find(e => e.id === id),

    // Filter selectors
    getPendingTasks: () => state.tasks.filter(t => t.status === 'pending'),
    getCompletedTasks: () => state.tasks.filter(t => t.status === 'done'),
    getInProgressTasks: () =>
      state.tasks.filter(t => t.status === 'in-progress'),
    getBlockedTasks: () => state.tasks.filter(t => t.status === 'blocked'),

    getHighPriorityTasks: () =>
      state.tasks.filter(t => t.priority === 'high'),
    getMediumPriorityTasks: () =>
      state.tasks.filter(t => t.priority === 'medium'),
    getLowPriorityTasks: () => state.tasks.filter(t => t.priority === 'low'),

    // Date-based selectors
    getTasksDueToday: () => {
      const today = new Date().toISOString().split('T')[0]
      return state.tasks.filter(t => t.dueDate === today)
    },

    getOverdueTerms: () => {
      const today = new Date()
      return state.tasks.filter(
        t => new Date(t.dueDate) < today && t.status !== 'done'
      )
    },

    getTasksDueThisWeek: () => {
      const today = new Date()
      const weekEnd = new Date(today)
      weekEnd.setDate(weekEnd.getDate() + 7)
      return state.tasks.filter(
        t =>
          new Date(t.dueDate) >= today &&
          new Date(t.dueDate) <= weekEnd
      )
    },

    // Event selectors
    getTodayEvents: () => {
      const today = new Date().toISOString().split('T')[0]
      return state.events
        .filter(e => e.date === today)
        .sort((a, b) => (a.time || '').localeCompare(b.time || ''))
    },

    getUpcomingEvents: (days = 7) => {
      const today = new Date()
      const cutoff = new Date(today)
      cutoff.setDate(cutoff.getDate() + days)
      return state.events
        .filter(
          e =>
            new Date(e.date) >= today &&
            new Date(e.date) <= cutoff
        )
        .sort((a, b) => a.date.localeCompare(b.date))
    },

    // Assignment selectors
    getTasksForUser: (userId) =>
      state.tasks.filter(t => t.assignee === userId),
    getEventsForUser: (userId) =>
      state.events.filter(e => e.attendees.includes(userId)),
  }
}
