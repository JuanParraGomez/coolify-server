# Data Layer Architecture

## Overview

The data layer is designed to support a shared tablet agenda application with real-time synchronization. It consists of:

1. **mock-data.js** — Constants, initial data, and core utility functions
2. **api-service.js** — API client, real-time sync service, and sync coordination
3. **state-management.js** — State management utilities and derived selectors

## Module Structure

### src/lib/mock-data.js

Provides:
- **Constants**: `USERS`, `PRIORITY_LEVELS`, `TASK_STATUSES`, `EVENT_TYPES`
- **Initial Data**: `INITIAL_TASKS`, `INITIAL_EVENTS` (15 tasks, 12 events)
- **Filtering Functions**: By status, priority, assignee, tags, type, date
- **Sorting Functions**: By due date, priority, time
- **Analytics**: Task stats, upcoming events, grouping utilities
- **Tag Management**: Frequency analysis and extraction
- **Search & Query**: Task and event search functions
- **Sync Utilities**: Conflict detection, merge strategies, validation
- **Data Export**: Format data for API transmission

**Usage:**
```javascript
import {
  USERS, PRIORITY_LEVELS, TASK_STATUSES, EVENT_TYPES,
  INITIAL_TASKS, INITIAL_EVENTS,
  filterTasksByPriority, sortTasksByDueDate,
  getTaskStats, getUpcomingEvents,
} from '../lib/mock-data'
```

### src/lib/api-service.js

**APIClient** — HTTP communication
```javascript
const api = getAPIClient()
await api.getTasks()
await api.createTask(taskData)
await api.updateTask(id, changes)
await api.deleteTask(id)
await api.syncChanges(lastSyncAt)
```

**RealtimeSyncService** — WebSocket for real-time updates
```javascript
const realtime = getRealtimeService()
await realtime.connect()
realtime.on('task-updated', handler)
realtime.send('task-update', { taskId, changes })
realtime.disconnect()
```

**SyncCoordinator** — Orchestrates sync between local and remote
```javascript
const sync = getSyncCoordinator()
await sync.initialize()
sync.on('remote-task-updated', handler)
sync.queueChange('tasks', task, 'update')
await sync.pushPendingChanges()
sync.pause()
sync.resume()
```

**Initialization:**
```javascript
import { initializeDataServices } from '../lib/api-service'

const { api, realtime, sync } = await initializeDataServices()
```

### src/lib/state-management.js

**createAppReducer()** — State mutation functions
```javascript
const actions = createAppReducer()
actions.addTask(state, task)
actions.updateTask(state, id, changes)
actions.mergeTasks(state, remoteTasks)
```

**createDispatcher()** — Bound action dispatcher
```javascript
const dispatch = createDispatcher(state, setStateCallback)
dispatch.addTask(taskData)
dispatch.updateTask(id, changes)
dispatch.deleteTask(id)
```

**State Persistence:**
```javascript
import {
  persistState, loadPersistedState,
  computeDerivedState, createSelectors,
} from '../lib/state-management'

persistState(state)
const saved = loadPersistedState()

const derived = computeDerivedState(state)
const selectors = createSelectors(state)
const pendingTasks = selectors.getPendingTasks()
```

## Data Structures

### Task
```javascript
{
  id: 't1',
  title: 'Task title',
  description: 'Detailed description',
  dueDate: '2026-04-10',
  status: 'pending' | 'in-progress' | 'done' | 'blocked',
  priority: 'high' | 'medium' | 'low',
  assignee: 'juan' | 'asistente',
  tags: ['tag1', 'tag2'],
  createdBy: 'juan',
  updatedBy: 'asistente',
  updatedAt: '2026-04-09T10:00:00Z',
  completedAt: '2026-04-09T14:00:00Z' | null,
  syncVersion: 1,
}
```

### Event
```javascript
{
  id: 'e1',
  title: 'Event title',
  date: '2026-04-10',
  time: '14:00',
  endTime: '15:00' | null,
  type: 'meeting' | 'reminder' | 'deadline' | 'personal',
  description: 'Event description',
  createdBy: 'juan',
  attendees: ['juan', 'asistente'],
  location: 'Meeting room',
  syncVersion: 1,
}
```

## Real-Time Sync Strategy

### Architecture
```
┌─────────────────┐
│   React State   │
└────────┬────────┘
         │
    ┌────▼────┐
    │AppContext│
    └────┬────┘
         │
    ┌────▼────────────────┐
    │ SyncCoordinator     │
    │ - Periodic polling  │
    │ - Real-time socket  │
    └────┬─────────────────┘
         │
    ┌────▼──────────────────┐
    │ API / WebSocket       │
    │ Backend (Node.js)     │
    └───────────────────────┘
```

### Sync Conflict Resolution
1. **Version-based**: Uses `syncVersion` field
2. **Timestamp-based**: Fallback to `updatedAt` for concurrent edits
3. **Remote preference**: Remote updates take precedence in conflicts
4. **Merge strategy**: Keeps newest version by syncVersion

### Offline Support
```javascript
import { createOfflineDetector } from '../lib/state-management'

const offline = createOfflineDetector()
if (offline.isOnline()) {
  // Sync immediately
}
offline.onOnline(() => sync.resume())
offline.onOffline(() => sync.pause())
```

## Component Integration

### Using DataTable with Filters
```javascript
import DataTable from '../components/DataTable'
import FiltersPanel from '../components/FiltersPanel'
import { searchTasks } from '../lib/mock-data'

const [filters, setFilters] = useState({})
const filtered = searchTasks(tasks, filters.search)

<FiltersPanel
  tasks={tasks}
  activeFilters={filters}
  onFilterChange={setFilters}
/>
<DataTable
  data={filtered}
  columns={[...]}
  filters={filters}
/>
```

### Batch Updates
```javascript
import { batchUpdates } from '../lib/state-management'

const updates = [
  { type: 'updateTask', payload: { id: 't1', changes: { status: 'done' } } },
  { type: 'updateTask', payload: { id: 't2', changes: { priority: 'high' } } },
]

batchUpdates(updates, state, setState)
```

## API Configuration

Set environment variables for API:
```bash
REACT_APP_API_URL=http://api.example.com/api
REACT_APP_WS_URL=ws://api.example.com
```

Defaults:
- `REACT_APP_API_URL`: http://localhost:3000/api
- `REACT_APP_WS_URL`: ws://localhost:3000

## Validation

```javascript
import { validateTask, validateEvent } from '../lib/mock-data'

const errors = validateTask(taskData)
if (errors.length > 0) {
  console.error('Invalid task:', errors)
}
```

## Performance Considerations

1. **Selector Memoization**: Use `createSelectors()` to derive state
2. **Batch Updates**: Use `batchUpdates()` for multiple changes
3. **Derived State**: Compute heavy operations in `computeDerivedState()`
4. **Lazy Loading**: Load events/tasks as needed by date range
5. **Sync Throttling**: Periodic sync every 30 seconds (configurable)

## Testing

All data operations are pure functions:
```javascript
import {
  filterTasksByPriority,
  sortTasksByDueDate,
  getTaskStats,
  detectConflict,
  resolveMerge,
} from '../lib/mock-data'

// No external dependencies, fully testable
```

## Migration Path

Current: Local storage only → Future: Real-time sync

The architecture is designed to support gradual migration:
1. Phase 1: Local + periodic sync (current)
2. Phase 2: Add WebSocket real-time
3. Phase 3: Offline-first with sync queue
4. Phase 4: Conflict resolution and merging

## Future Enhancements

- [ ] IndexedDB for offline storage
- [ ] Service workers for background sync
- [ ] Encryption for sensitive data
- [ ] Audit trail for changes
- [ ] Advanced filtering with fuzzy search
- [ ] Task templates and recurring tasks
- [ ] Subtasks and dependencies
- [ ] Comments and mentions
- [ ] File attachments
- [ ] Notifications
