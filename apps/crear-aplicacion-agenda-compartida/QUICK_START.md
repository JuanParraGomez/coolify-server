# Quick Start Guide — Data Layer

## For Component Developers

### Import Mock Data
```javascript
import {
  USERS,
  PRIORITY_LEVELS,
  TASK_STATUSES,
  EVENT_TYPES,
  INITIAL_TASKS,
  INITIAL_EVENTS,
} from '../lib/mock-data'
```

### Use Utility Functions
```javascript
import {
  filterTasksByPriority,
  sortTasksByDueDate,
  getTaskStats,
  searchTasks,
  getUpcomingEvents,
} from '../lib/mock-data'

// Filter tasks by priority
const highPriority = filterTasksByPriority(tasks, 'high')

// Get statistics
const stats = getTaskStats(tasks)
console.log(`Pending: ${stats.pending}, Done: ${stats.done}`)

// Search across all tasks
const results = searchTasks(tasks, 'client proposal')

// Get events for next 7 days
const upcoming = getUpcomingEvents(events, 7)
```

### State Management
```javascript
import {
  createDispatcher,
  persistState,
  loadPersistedState,
  createSelectors,
} from '../lib/state-management'

// Create action dispatcher
const dispatch = createDispatcher(state, setState)
dispatch.addTask(newTask)
dispatch.updateTask(taskId, { status: 'done' })
dispatch.deleteTask(taskId)

// Persist to localStorage
persistState(state)

// Load from localStorage
const saved = loadPersistedState()

// Create selectors
const selectors = createSelectors(state)
const pending = selectors.getPendingTasks()
const thisWeek = selectors.getTasksDueThisWeek()
```

## For Backend Integration

### Initialize Services
```javascript
import { initializeDataServices } from '../lib/api-service'

// In your App setup
useEffect(() => {
  const setup = async () => {
    const { api, realtime, sync } = await initializeDataServices()
    
    // Listen for real-time updates
    sync.on('remote-task-updated', (task) => {
      dispatch.updateTask(task.id, task)
    })
    
    // Handle sync completion
    sync.on('sync-completed', (changes) => {
      console.log('Synced with server', changes)
    })
  }
  
  setup()
}, [])
```

### Use API Client
```javascript
import { getAPIClient } from '../lib/api-service'

const api = getAPIClient()

// Fetch data
const tasks = await api.getTasks()

// Create task
const newTask = await api.createTask({
  title: 'New task',
  dueDate: '2026-04-15',
  priority: 'high',
  assignee: 'juan',
  tags: ['important'],
})

// Update task
await api.updateTask('t1', { status: 'done' })

// Delete task
await api.deleteTask('t1')
```

### Handle Offline
```javascript
import { createOfflineDetector } from '../lib/state-management'
import { getSyncCoordinator } from '../lib/api-service'

const offline = createOfflineDetector()
const sync = getSyncCoordinator()

offline.onOnline(() => {
  console.log('Online - resuming sync')
  sync.resume()
})

offline.onOffline(() => {
  console.log('Offline - pausing sync')
  sync.pause()
})
```

## Data Validation

```javascript
import { validateTask, validateEvent } from '../lib/mock-data'

// Validate before saving
const errors = validateTask({
  title: 'My task',
  dueDate: '2026-04-15',
  priority: 'high',
  assignee: 'juan',
})

if (errors.length > 0) {
  console.error('Validation errors:', errors)
} else {
  // Save to database
}
```

## Component Example

```javascript
import React, { useState, useEffect } from 'react'
import DataTable from './components/DataTable'
import FiltersPanel from './components/FiltersPanel'
import {
  INITIAL_TASKS,
  filterTasksByPriority,
  getTaskStats,
} from '../lib/mock-data'
import { createSelectors } from '../lib/state-management'

export default function TasksPage() {
  const [tasks, setTasks] = useState(INITIAL_TASKS)
  const [filters, setFilters] = useState({})

  // Get selectors
  const selectors = createSelectors({ tasks, events: [] })

  // Apply filters
  let filtered = tasks
  if (filters.search) {
    filtered = filtered.filter(t =>
      t.title.toLowerCase().includes(filters.search.toLowerCase())
    )
  }
  if (filters.statuses?.length) {
    filtered = filtered.filter(t => filters.statuses.includes(t.status))
  }

  // Get stats
  const stats = getTaskStats(filtered)

  return (
    <div className="space-y-4">
      {/* Header with stats */}
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold">Tareas</h1>
        <div className="text-sm text-gray-600">
          {stats.done}/{stats.total} completadas
        </div>
      </div>

      {/* Filters */}
      <FiltersPanel
        tasks={tasks}
        activeFilters={filters}
        onFilterChange={setFilters}
        filterType="tasks"
      />

      {/* Data table */}
      <DataTable
        data={filtered}
        columns={[
          { key: 'title', label: 'Título' },
          { key: 'dueDate', label: 'Vencimiento', type: 'date' },
          { key: 'status', label: 'Estado', type: 'status' },
          { key: 'priority', label: 'Prioridad', type: 'priority' },
          { key: 'assignee', label: 'Asignado', type: 'user' },
        ]}
        filters={filters}
        sortBy="dueDate"
      />
    </div>
  )
}
```

## Common Patterns

### Batch Update Multiple Tasks
```javascript
import { batchUpdates } from '../lib/state-management'

const updates = [
  { type: 'updateTask', payload: { id: 't1', changes: { status: 'done' } } },
  { type: 'updateTask', payload: { id: 't2', changes: { priority: 'high' } } },
  { type: 'addTask', payload: newTaskData },
]

batchUpdates(updates, state, setState)
```

### Get Derived State
```javascript
import { computeDerivedState } from '../lib/state-management'

const derived = computeDerivedState(state)
console.log('Task stats:', derived.taskStats)
console.log('Events by date:', derived.eventsByDate)
console.log('Tasks by assignee:', derived.tasksByAssignee)
console.log('Available tags:', derived.availableTags)
```

### Search Tasks with Filters
```javascript
import { searchTasks, filterTasksByPriority } from '../lib/mock-data'

let results = searchTasks(tasks, 'client')
results = filterTasksByPriority(results, 'high')
```

## Environment Setup

### Development
```bash
npm run dev
# Opens http://localhost:5173
```

### Production Build
```bash
npm run build
npm run preview
```

### Configuration
Create `.env.local` to customize API endpoints:
```
REACT_APP_API_URL=http://your-api.com/api
REACT_APP_WS_URL=ws://your-api.com
```

## Troubleshooting

### "Cannot find module" errors
- Verify import paths use `../lib/mock-data`
- Check file exists in `/src/lib/`
- Clear node_modules if needed: `rm -rf node_modules && npm install`

### State not updating
- Use dispatcher from `createDispatcher()` for all mutations
- Call `setState` callback with new state
- Don't mutate state directly

### Sync not working
- Check API_URL and WS_URL in console
- Verify backend is running
- Check browser console for errors

### Performance issues
- Use `createSelectors()` for derived state
- Use `batchUpdates()` for multiple changes
- Avoid filtering in render, filter in effects

## File Structure
```
src/
├── lib/
│   ├── index.js              (Barrel exports)
│   ├── mock-data.js          (Constants + Utilities)
│   ├── api-service.js        (API + Sync)
│   ├── state-management.js   (State + Selectors)
│   └── README.md             (Full documentation)
├── components/
│   ├── FiltersPanel.jsx
│   ├── DataTable.jsx
│   └── ...
├── context/
│   └── AppContext.jsx
├── hooks/
│   └── useAgenda.js
└── App.jsx
```

## Next Steps

1. **Review** `/src/lib/README.md` for complete architecture
2. **Integrate** with your backend API
3. **Setup** real-time sync with WebSocket
4. **Test** offline scenarios
5. **Deploy** to production

## Support

Refer to `/src/lib/README.md` for:
- Full API reference
- Data structure definitions
- Sync strategy details
- Component integration examples
- Future enhancement roadmap
