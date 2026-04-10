// Barrel export for all data layer modules

// ============================================================================
// MOCK DATA & UTILITIES
// ============================================================================

export {
  USERS,
  PRIORITY_LEVELS,
  TASK_STATUSES,
  EVENT_TYPES,
  INITIAL_TASKS,
  INITIAL_EVENTS,
  // Filtering
  filterTasksByStatus,
  filterTasksByPriority,
  filterTasksByAssignee,
  filterTasksByTags,
  filterEventsByType,
  filterEventsByDate,
  // Sorting
  sortTasksByDueDate,
  sortTasksByPriority,
  sortEventsByTime,
  // Analytics
  getTaskStats,
  getUpcomingEvents,
  // Grouping
  groupTasksByAssignee,
  groupTasksByStatus,
  groupEventsByDate,
  // Tags
  getAllTags,
  getTagsWithFrequency,
  // Search
  searchTasks,
  getTaskById,
  getTasksByUser,
  searchEvents,
  getEventById,
  getEventsByUser,
  // Sync
  detectConflict,
  resolveMerge,
  // Validation
  validateTask,
  validateEvent,
  // Export
  exportTaskForSync,
  exportEventForSync,
} from './mock-data'

// ============================================================================
// API & REAL-TIME SERVICES
// ============================================================================

export {
  APIClient,
  RealtimeSyncService,
  SyncCoordinator,
  initializeDataServices,
  getAPIClient,
  getRealtimeService,
  getSyncCoordinator,
} from './api-service'

// ============================================================================
// STATE MANAGEMENT
// ============================================================================

export {
  createAppReducer,
  createDispatcher,
  persistState,
  loadPersistedState,
  createOfflineDetector,
  batchUpdates,
  computeDerivedState,
  createSelectors,
} from './state-management'
