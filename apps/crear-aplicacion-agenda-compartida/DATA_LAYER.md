# Data Layer, State Management & Mock Data Documentation

## Overview

This shared calendar application uses a comprehensive data layer with:
- **Mock Data**: Deterministic test data for April 2026
- **State Management**: React Context with useReducer for app-wide state
- **Data Queries**: Specialized hooks for accessing and filtering data
- **Sync Management**: Preparation for real-time Socket.io integration
- **Data Validation**: Built-in validation for tasks and events

## Architecture

### 1. Mock Data Layer (`/src/lib/mock-data.js`)

**Constants & Enums:**
```
- USERS: Two users (juan, asistente)
- PRIORITY_LEVELS: High, Medium, Low
- TASK_STATUSES: Pending, In Progress, Done, Blocked
- EVENT_TYPES: Meeting, Reminder, Deadline, Personal
```

**Initial Data:**
- `INITIAL_TASKS`: 15 sample tasks with realistic business scenarios
- `INITIAL_EVENTS`: 12 sample events spanning April 2026

### 2. Data Entities

#### Task Schema
```javascript
{
  id: string,                    // Unique identifier
  title: string,                 // Task title
  description: string,           // Detailed description
  dueDate: string (YYYY-MM-DD),  // Due date
  status: enum,                  // pending | in-progress | done | blocked
  priority: enum,                // high | medium | low
  assignee: string,              // User ID
  tags: string[],                // Category tags
  createdBy: string,             // Creator user ID
  updatedBy: string,             // Last editor user ID
  updatedAt: string (ISO),       // Last update timestamp
  completedAt: string (ISO),     // Completion timestamp
  syncVersion: number            // For conflict resolution
}
```

#### Event Schema
```javascript
{
  id: string,                    // Unique identifier
  title: string,                 // Event title
  date: string (YYYY-MM-DD),     // Event date
  time: string (HH:MM),          // Event time
  endTime: string (HH:MM),       // Optional end time
  type: enum,                    // meeting | reminder | deadline | personal
  description: string,           // Event description
  createdBy: string,             // Creator user ID
  attendees: string[],           // User IDs
  location: string,              // Location or meeting link
  syncVersion: number            // For conflict resolution
}
```

### 3. State Management (`/src/context/AppContext.jsx`)

The AppContext uses useReducer to manage:
- Tasks (add, update, delete, toggle)
- Events (add, update, delete)
- Current user selection
- Persistent localStorage storage

**Actions:**
- `SET_USER`: Switch current user
- `ADD_EVENT` / `UPDATE_EVENT` / `DELETE_EVENT`
- `ADD_TASK` / `UPDATE_TASK` / `DELETE_TASK` / `TOGGLE_TASK`

### 4. Custom Hooks

#### `useFilters(initialData, filterType)`
Manages filtering state and applies multiple filters:
- Search text
- Status (tasks)
- Priority (tasks)
- Assignees (tasks)
- Tags (tasks)
- Event types (events)
- Date ranges

```javascript
const {
  filters,
  filteredData,
  updateFilters,
  clearFilters,
  toggleFilter,
  hasActiveFilters,
  filterCount,
} = useFilters(tasks, 'tasks')
```

#### `useSortAndPaginate(data, sortBy, pageSize)`
Handles sorting and pagination:

```javascript
const {
  sorted,
  paginated,
  sortColumn,
  sortOrder,
  currentPage,
  totalPages,
  handleSort,
  setCurrentPage,
} = useSortAndPaginate(tasks, 'dueDate', 20)
```

#### `useStats(tasks, events)`
Computes statistics:

```javascript
const {
  taskStats,        // total, pending, inProgress, done, blocked, highPriority, overdue, completionRate
  eventStats,       // total, today, thisWeek, meetings, reminders, deadlines
  userStats,        // tasks per user with status breakdown
  priorityDistribution,
  statusDistribution,
} = useStats(tasks, events)
```

#### `useDataQueries(tasks, events)`
Common data access patterns:

```javascript
const {
  tasksByAssignee,
  tasksByStatus,
  eventsByDate,
  upcomingEvents,
  todaysTasks,
  todaysEvents,
  overdueTasks,
  highPriorityPending,
  getTask,
  getEvent,
  getUserTasks,
  getUserEvents,
} = useDataQueries(tasks, events)
```

#### `useSyncManager(localTasks, localEvents, onTasksSync, onEventsSync)`
Manages data synchronization:

```javascript
const {
  syncStatus,        // idle | syncing | synced | error | offline
  lastSyncTime,
  pendingChanges,
  hasPendingChanges,
  queueTaskChange,
  queueEventChange,
  performSync,
  resolveConflict,
} = useSyncManager(tasks, events, onSync, onSync)
```

### 5. Utility Functions

**Filtering:**
- `filterTasksByStatus(tasks, status)`
- `filterTasksByPriority(tasks, priority)`
- `filterTasksByAssignee(tasks, assignee)`
- `filterTasksByTags(tasks, tags)`
- `filterEventsByType(events, type)`
- `filterEventsByDate(events, date)`

**Sorting:**
- `sortTasksByDueDate(tasks)`
- `sortTasksByPriority(tasks)`
- `sortEventsByTime(events)`

**Analytics:**
- `getTaskStats(tasks)`
- `getUpcomingEvents(events, daysAhead)`

**Grouping:**
- `groupTasksByAssignee(tasks)`
- `groupTasksByStatus(tasks)`
- `groupEventsByDate(events)`

**Search & Query:**
- `searchTasks(tasks, query)`
- `getTaskById(tasks, id)`
- `getTasksByUser(tasks, userId)`
- `searchEvents(events, query)`
- `getEventById(events, id)`
- `getEventsByUser(events, userId)`

**Validation:**
- `validateTask(task)` → returns errors array
- `validateEvent(event)` → returns errors array

**Sync & Conflict Resolution:**
- `detectConflict(local, remote)` → identifies conflicts
- `resolveMerge(local, remote)` → resolves based on timestamps
- `exportTaskForSync(task)` → strips internal fields
- `exportEventForSync(event)` → strips internal fields

### 6. API Service Layer (`/src/lib/api-service.js`)

**APIClient:**
- HTTP requests with authentication
- Task CRUD operations
- Event CRUD operations
- Bulk updates and sync endpoints

**RealtimeSyncService:**
- WebSocket connection management
- Message broadcasting
- Auto-reconnect with exponential backoff
- Event listener pattern

**SyncCoordinator:**
- Orchestrates API and real-time services
- Periodic sync (30s interval)
- Change queuing and batching
- Offline/online detection

### 7. State Management Utils (`/src/lib/state-management.js`)

**createAppReducer():**
Creates reducer functions for:
- Task operations (add, update, delete, bulk, merge)
- Event operations (add, update, delete, merge)
- State replacement and reset

**createDispatcher(state, setStateCallback):**
Transforms reducer into action dispatcher

**createSelectors(state):**
Memoized selectors for:
- Task queries (by status, priority, date)
- Event queries (upcoming, today)
- User-based queries

**Utilities:**
- `persistState(state)` / `loadPersistedState()` - localStorage
- `createOfflineDetector()` - online/offline events
- `batchUpdates()` - batch multiple mutations
- `computeDerivedState()` - cached derived state

## Integration Example

```javascript
import { useApp } from '../context/AppContext'
import { useFilters, useDataQueries, useStats } from '../hooks'

export default function TasksPage() {
  const { state, dispatch } = useApp()
  const { filteredData } = useFilters(state.tasks, 'tasks')
  const { taskStats, overdueTasks } = useDataQueries(state.tasks, state.events)
  
  return (
    <>
      <h2>Tasks Overview</h2>
      <p>Total: {taskStats.total}, Pending: {taskStats.pending}</p>
      <p>Overdue: {overdueTasks.length}</p>
    </>
  )
}
```

## Real-Time Sync Architecture (Future)

The app is prepared for Socket.io integration:

1. **Local Changes Queue** → `useSyncManager.queueChange()`
2. **Periodic Sync** → `performSync()` every 30s
3. **Real-time Updates** → Socket.io listeners
4. **Conflict Detection** → `detectConflict()`
5. **Merge Resolution** → `resolveMerge()` strategy
6. **State Update** → Redux-like actions

## Data Flow

```
User Action
    ↓
Component (FiltersPanel, DataTable, etc)
    ↓
Custom Hook (useFilters, useDataQueries, etc)
    ↓
State Management (AppContext reducer)
    ↓
Mock Data Functions (filtering, sorting, grouping)
    ↓
localStorage persistence
    ↓
[Future: API/Socket.io → Server]
```

## Best Practices

1. **Use custom hooks** for data access instead of direct state manipulation
2. **Keep filters in component state** for responsiveness
3. **Leverage selectors** for memoized derived state
4. **Validate data** before mutations (validateTask, validateEvent)
5. **Queue changes** before sync for offline support
6. **Use mock data** to seed initial state

## File Structure

```
src/
├── lib/
│   ├── mock-data.js          # Mock data + utility functions
│   ├── api-service.js        # API client + real-time services
│   ├── state-management.js   # Reducer factory + selectors
│   └── index.js              # Barrel export
├── hooks/
│   ├── useAgenda.js          # Basic state management
│   ├── useFilters.js         # Filtering logic
│   ├── useSortAndPaginate.js # Sorting + pagination
│   ├── useStats.js           # Statistics computation
│   ├── useSyncManager.js     # Data sync + conflict resolution
│   ├── useDataQueries.js     # Data access patterns
│   └── index.js              # Barrel export
├── components/
│   ├── FiltersPanel.jsx      # Multi-filter UI
│   ├── DataTable.jsx         # Sortable table with selection
│   └── ...
├── context/
│   └── AppContext.jsx        # Global app state
└── pages/
    ├── TodayPage.jsx
    ├── TasksPage.jsx
    ├── CalendarPage.jsx
    └── TrackingPage.jsx
```

## Configuration

**Storage Key:** `agenda-compartida-v1`
**API Base URL:** `process.env.REACT_APP_API_URL || http://localhost:3000/api`
**WebSocket URL:** `process.env.REACT_APP_WS_URL || ws://localhost:3000`
**Sync Interval:** 30 seconds
**Reconnect Max Attempts:** 5
**Reconnect Delay:** 1 second (exponential backoff)

## Future Enhancements

- [ ] Real-time sync via Socket.io
- [ ] Conflict resolution UI
- [ ] Advanced filtering with saved presets
- [ ] Data export (CSV, JSON, PDF)
- [ ] Recurring tasks/events
- [ ] Task dependencies
- [ ] Activity timeline
- [ ] Notifications/reminders
- [ ] Multi-device synchronization
