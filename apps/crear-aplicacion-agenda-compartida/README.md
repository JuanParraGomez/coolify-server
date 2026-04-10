# Crear Aplicacion Agenda Compartida

## Purpose
Crear aplicación agenda compartida tablet para Juan y asistente. Hosting Hostinger. Features: calendarios, seguimiento, modificación mutua pendientes, intuitiva, fácil usar. Deploy con Coolify. App debe funcionar en tablet (responsive), permitir edición mutua entre Juan y asistente, tener calendarios, seguimiento de tareas, interfaz simple.

## Project Identity
- slug: `crear-aplicacion-agenda-compartida`
- project_type: `long_lived`
- template: `react-starter`
- project_root: `apps/crear-aplicacion-agenda-compartida`
- deployment_provider: `coolify`
- domain: `crear-aplicacion-agenda-compartida.apps.uniflexa.cloud`

## Architecture

### Key Features
- **Dual-user system**: Juan (owner, blue) and Asistente (collaborator, purple)
- **Task management**: Create, update, delete tasks with priority and status tracking
- **Calendar view**: Monthly calendar with event display and real-time updates
- **Event tracking**: Schedule meetings, reminders, deadlines
- **Real-time sync**: LocalStorage persistence for client-side state
- **Responsive design**: Optimized for tablet, mobile, and desktop
- **Shared state**: AppContext manages global tasks, events, and user state

### Technology Stack
- React 18.3.1
- React Router 6.26.1
- Vite 5.4.2
- date-fns 3.6.0
- CSS3 (no build framework)

### Directory Structure
```
src/
├── App.jsx                 # Main app layout and routing
├── main.jsx                # React entry point
├── index.css               # Global styles and variables
├── context/
│   └── AppContext.jsx      # Global state management
├── components/
│   ├── Header.jsx          # Page header with user toggle
│   ├── BottomNav.jsx       # Tab navigation (72px fixed)
│   ├── TaskList.jsx        # Task display component
│   ├── TaskForm.jsx        # New/edit task modal
│   ├── TaskModal.jsx       # Task details modal
│   ├── EventForm.jsx       # New/edit event modal
│   ├── CalendarView.jsx    # Calendar grid renderer
│   ├── TrackingView.jsx    # Progress/analytics view
│   ├── FiltersPanel.jsx    # Advanced filters UI
│   └── DataTable.jsx       # Generic data table
├── pages/
│   ├── TodayPage.jsx       # Today's tasks and events
│   ├── CalendarPage.jsx    # Month calendar view
│   ├── TasksPage.jsx       # Task list with filters
│   └── TrackingPage.jsx    # Progress tracking
├── hooks/
│   ├── useAgenda.js        # Agenda utilities hook
│   ├── useFilters.js       # Multi-filter hook
│   ├── useSortAndPaginate.js # Sort/pagination hook
│   ├── useStats.js         # Statistics computations
│   ├── useSyncManager.js   # Sync state management
│   ├── useDataQueries.js   # Data query utilities
│   └── index.js            # Barrel exports
├── lib/
│   ├── mock-data.js        # Seed data, constants, and 35+ utilities
│   ├── api-service.js      # API client and WebSocket sync service
│   ├── state-management.js # Reducers and state utilities
│   ├── index.js            # Barrel exports
│   └── README.md           # Detailed API documentation
└── styles/
    ├── FiltersPanel.css    # Filter component styles
    └── DataTable.css       # Data table component styles
```

### Data Model

**Task:**
```javascript
{
  id: string,
  title: string,
  description: string,
  dueDate: "YYYY-MM-DD",
  status: "pending" | "in-progress" | "done" | "blocked",
  priority: "high" | "medium" | "low",
  tags: string[],
  assignee: string (user id),
  createdBy: string,
  updatedBy: string,
  updatedAt: ISO8601,
  completedAt: ISO8601 | null
}
```

**Event:**
```javascript
{
  id: string,
  title: string,
  date: "YYYY-MM-DD",
  time: "HH:MM",
  endTime: "HH:MM" | null,
  type: "meeting" | "reminder" | "deadline" | "personal",
  description: string,
  createdBy: string,
  attendees: string[],
  location: string | null
}
```

## How It Should Be Managed
- This project lives inside the `coolify-server` monorepo.
- Update this README whenever purpose, architecture, deployment or usage changes.
- Keep `app.meta.yaml` and `deploy.meta.yaml` aligned with this file.

## Development
- `npm run dev` - Start Vite dev server on :5173
- `npm run build` - Build for production (output: dist/)
- `npm run preview` - Preview built app locally

## Deployment
- Auto-deployed via Coolify on push
- Domain: crear-aplicacion-agenda-compartida.apps.uniflexa.cloud
- Hosting: Hostinger (managed by Coolify)

## Current Status
✅ Core UI complete with 4 main pages (Today, Calendar, Tasks, Tracking)
✅ State management with AppContext + LocalStorage
✅ Data layer unified: single mock-data.js
✅ Responsive design for tablet/mobile
✅ Build validated and working
⏳ Backend API integration (next phase)
