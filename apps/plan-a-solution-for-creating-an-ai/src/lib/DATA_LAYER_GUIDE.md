# Data Layer, State Management & Mock Data Guide

## Overview

This document describes the complete data layer, state management system, and mock data infrastructure for the **Plan A Solution For Creating An AI Sales Assistant**.

## Project Structure

```
src/
├── lib/
│   ├── mock-data.js           ← Central mock data and state management
│   └── DATA_LAYER_GUIDE.md    ← This file
├── components/
│   ├── FiltersPanel.jsx       ← Reusable filter component
│   ├── DataTable.jsx          ← Reusable data table component
│   └── [other components...]
├── main.jsx                   ← Entry point (uses all components)
└── ...
```

## Mock Data Layer (`src/lib/mock-data.js`)

### 1. Leads Data Structure

The `MOCK_LEADS` array contains 7 realistic sales leads with complete profiles:

```javascript
{
  id: 1,
  nombre: 'Carlos Mendoza',
  empresa: 'TechMX SA',
  cargo: 'CTO',
  estado: 'nuevo',              // nuevo, contactado, calificado, propuesta
  canal: 'LinkedIn',            // LinkedIn, Extension, Twitter
  score: 92,                    // 0-100 qualification score
  respondio: false,
  fechaContacto: '2026-03-10',
  interes: 'Automatización IA',
  presupuesto: '$50k-100k',
  email: 'carlos.mendoza@techmx.com',
  telefono: '+52-555-0101',
  ubicacion: 'Ciudad de México',
  siguiendo: true,
  ultimaInteraccion: '2026-03-14 14:32',
  notasInternas: 'Alto interés en automatización. Presupuesto confirmado.',
}
```

### 2. Filter Options

Pre-defined filter options for UI controls:

- **ESTADO_OPTIONS**: Todos, Nuevo, Contactado, Calificado, Propuesta
- **CANAL_OPTIONS**: Todos, LinkedIn, Extensión, Twitter
- **RESPONDIO_OPTIONS**: Todos, Sí, No

### 3. Status Colors

Color mapping for visual indicators:

```javascript
ESTADO_COLOR = {
  nuevo: '#3b82f6',         // Blue
  contactado: '#f59e0b',    // Amber
  calificado: '#10b981',    // Green
  propuesta: '#8b5cf6',     // Purple
}
```

### 4. Mock API Responses

Simulated REST API endpoints:

#### GET /api/leads
```javascript
{
  status: 200,
  data: {
    items: Lead[],
    total: number,
    page: number,
    limit: number,
  }
}
```

#### POST /api/leads/:id/suggest
Generates AI suggestions using selected provider:
```javascript
{
  leadId: number,
  provider: 'openai' | 'gemini' | 'claude' | 'deepseek',
  suggestion: string,
  timestamp: ISO8601,
  tokens: number,
}
```

#### GET /api/social-research/:id
Social media research data:
```javascript
{
  leadId: number,
  sources: [
    {
      platform: 'LinkedIn' | 'Twitter' | 'GitHub',
      profile: string,
      followers: number,
      interests: string[],
      ...
    }
  ],
  insights: string[],
  lastUpdated: ISO8601,
}
```

#### POST /api/chat/message
Chat messages for extension communication:
```javascript
{
  conversationId: string,
  role: 'assistant' | 'user',
  content: string,
  timestamp: ISO8601,
  provider: string,
}
```

### 5. Initial State Structure

```javascript
INITIAL_FILTER_STATE = {
  q: '',                    // Search query
  estado: 'todos',
  canal: 'todos',
  respondio: 'todos',
  sortField: 'score',
  sortDir: 'desc',
  page: 1,
  limit: 10,
}

INITIAL_APP_STATE = {
  leads: Lead[],
  filters: FilterState,
  selectedLeadId: null,
  notifications: Notification[],
  apiKeys: {
    openai: null | string,
    gemini: null | string,
    claude: null | string,
    deepseek: null | string,
  },
  chatMessages: ChatMessage[],
  socialResearch: Record<string, SocialResearch>,
  loading: boolean,
  error: null | string,
}
```

### 6. API Providers Configuration

Four providers configured with models and rate limits:

```javascript
API_PROVIDERS = [
  {
    id: 'openai',
    name: 'OpenAI',
    logo: '🤖',
    models: ['gpt-4', 'gpt-3.5-turbo', 'davinci-003'],
    defaultModel: 'gpt-4',
    key_env: 'OPENAI_API_KEY',
    rateLimit: '3500 RPM',
  },
  // ... gemini, claude, deepseek
]
```

### 7. Default Runtime Model

```javascript
DEFAULT_RUNTIME_MODEL = 'openai-codex/gpt-5.1-codex-mini'
```

## Utility Functions

### filterLeads(leads, filters)

Filters leads by search query, estado, canal, and respondio status:

```javascript
const filtered = filterLeads(MOCK_LEADS, {
  q: 'Carlos',
  estado: 'nuevo',
  canal: 'LinkedIn',
  respondio: 'todos',
})
```

### sortLeads(leads, sortField, sortDir)

Sorts leads by any field in ascending or descending order:

```javascript
const sorted = sortLeads(filtered, 'score', 'desc')
```

### getLeadStats(leads)

Calculates comprehensive statistics from leads:

```javascript
const stats = getLeadStats(MOCK_LEADS)
// Returns: {
//   total: 7,
//   nuevos: 2,
//   contactados: 2,
//   calificados: 2,
//   propuestas: 1,
//   respondieron: 5,
//   noRespondieron: 2,
//   scorePromedio: 81,
//   scoreAlto: 4,
//   scoreBajo: 1,
// }
```

### getNotificationSummary(notifications)

Summarizes notifications by count and type.

## Reusable Components

### FiltersPanel Component

Location: `src/components/FiltersPanel.jsx`

A complete, self-contained filter panel with search, dropdowns, and reset button.

#### Props

```jsx
<FiltersPanel
  query={string}
  estado={string}
  canal={string}
  respondio={string}
  onQueryChange={(value: string) => void}
  onEstadoChange={(value: string) => void}
  onCanalChange={(value: string) => void}
  onRespondioChange={(value: string) => void}
  onReset={() => void}
/>
```

#### Features

- Real-time search input
- Dropdown filters for estado, canal, respondio
- Active filters summary display
- Clean reset button
- Responsive layout

#### Usage Example

```jsx
import FiltersPanel from './components/FiltersPanel'

function MyComponent() {
  const [filters, setFilters] = useState({
    q: '',
    estado: 'todos',
    canal: 'todos',
    respondio: 'todos',
  })

  return (
    <FiltersPanel
      query={filters.q}
      estado={filters.estado}
      canal={filters.canal}
      respondio={filters.respondio}
      onQueryChange={(q) => setFilters({ ...filters, q })}
      onEstadoChange={(estado) => setFilters({ ...filters, estado })}
      onCanalChange={(canal) => setFilters({ ...filters, canal })}
      onRespondioChange={(respondio) => setFilters({ ...filters, respondio })}
      onReset={() => setFilters({
        q: '', estado: 'todos', canal: 'todos', respondio: 'todos'
      })}
    />
  )
}
```

### DataTable Component

Location: `src/components/DataTable.jsx`

A flexible, reusable data table with sorting, expansion, and custom renderers.

#### Props

```jsx
<DataTable
  data={object[]}
  columns={Column[]}
  onRowClick={(row: object) => void}
  onAction={(action: string, row: object) => void}
  expandedRowId={string | number | null}
  onExpandChange={(id: string | number | null) => void}
  renderExpandedRow={(row: object) => React.ReactNode}
  sortField={string}
  sortDir={'asc' | 'desc'}
  onSortChange={(field: string, dir: string) => void}
  loading={boolean}
  emptyMessage={string}
/>
```

#### Column Definition

```javascript
const columns = [
  {
    key: 'nombre',                    // Data field key
    label: 'Nombre',                  // Header label
    render: (value, row) => ...,      // Optional custom renderer
    sortable: true,                   // Optional, defaults to true
  },
  // ... more columns
]
```

#### Built-in Renderers

- **ScoreRenderer(score)**: Displays progress bar with percentage
- **StatusRenderer(status)**: Colored status badge
- **ResponseRenderer(responded)**: Checkmark or dash
- **TitleRenderer(title, row)**: Bold text
- **RoleRenderer(role)**: Badge-styled role display

#### Usage Example

```jsx
import DataTable, { ScoreRenderer, StatusRenderer } from './components/DataTable'

function MyComponent() {
  const [expandedId, setExpandedId] = useState(null)
  const [sort, setSort] = useState({ field: 'score', dir: 'desc' })

  const columns = [
    { key: 'nombre', label: 'Nombre' },
    { key: 'empresa', label: 'Empresa' },
    { key: 'estado', label: 'Estado', render: StatusRenderer },
    { key: 'score', label: 'Score', render: ScoreRenderer },
  ]

  return (
    <DataTable
      data={filteredLeads}
      columns={columns}
      expandedRowId={expandedId}
      onExpandChange={setExpandedId}
      renderExpandedRow={(lead) => (
        <div>Lead details for {lead.nombre}</div>
      )}
      sortField={sort.field}
      sortDir={sort.dir}
      onSortChange={(field, dir) => setSort({ field, dir })}
    />
  )
}
```

## State Management Pattern

### Hook-based State Management

Use React's `useState` hook for local component state:

```jsx
const [filters, setFilters] = useState(INITIAL_FILTER_STATE)
const [leads, setLeads] = useState(MOCK_LEADS)
const [expandedId, setExpandedId] = useState(null)
```

### Data Flow

```
User Input (FiltersPanel)
    ↓
Update Filters State
    ↓
Filter & Sort Data (mock-data.js utilities)
    ↓
Pass to DataTable
    ↓
Render Results
```

## Integration with Real APIs

To integrate with real APIs, follow this pattern:

```javascript
// Replace mock data with API calls
async function fetchLeads(filters) {
  const response = await fetch(
    `/api/leads?estado=${filters.estado}&...`
  )
  return response.json()
}

// Use in component
const [leads, setLeads] = useState([])
const [loading, setLoading] = useState(false)

useEffect(() => {
  setLoading(true)
  fetchLeads(filters).then(data => {
    setLeads(data.items)
    setLoading(false)
  })
}, [filters])
```

## API Keys Configuration

The application supports four AI providers with configurable API keys:

```javascript
// Save API key
const saveApiKey = async (provider, apiKey) => {
  const response = await mockApiResponse('POST', '/api/config/api-keys', {
    provider, apiKey
  })
  // Store in app state
}

// Use API key
const generateSuggestion = async (leadId, provider) => {
  const apiKey = appState.apiKeys[provider]
  // Make request with apiKey header
}
```

## Performance Considerations

1. **Data Filtering**: Filtering is done client-side using `filterLeads()`
2. **Pagination**: Implement server-side pagination by adding `page` and `limit` to filters
3. **Memoization**: Use `React.memo` for DataTable rows if dealing with large lists
4. **Lazy Loading**: Load social research data on demand, not on mount

## Testing

### Mock Data Examples

```javascript
// Test with all leads
getLeadStats(MOCK_LEADS)

// Test filters
const filtered = filterLeads(MOCK_LEADS, { estado: 'nuevo' })

// Test sorting
const sorted = sortLeads(filtered, 'score', 'asc')

// Test API responses
const response = MOCK_API_RESPONSES.getLeads({ estado: 'nuevo' })
```

## Future Enhancements

1. Implement real REST API client using axios
2. Add Zustand store for global state management
3. Implement WebSocket for real-time notifications
4. Add caching layer for API responses
5. Implement optimistic updates for better UX
6. Add error boundaries and error handling
7. Implement data validation schemas

## File Structure Summary

| File | Purpose | Type |
|------|---------|------|
| `mock-data.js` | Data, state structures, utilities | Library |
| `FiltersPanel.jsx` | Reusable filter UI component | Component |
| `DataTable.jsx` | Reusable table display component | Component |
| `main.jsx` | App entry point, integrates all | App |

## Quick Reference

```javascript
// Import mock data
import {
  MOCK_LEADS,
  ESTADO_OPTIONS,
  CANAL_OPTIONS,
  API_PROVIDERS,
  filterLeads,
  sortLeads,
  getLeadStats,
} from './lib/mock-data'

// Import components
import FiltersPanel from './components/FiltersPanel'
import DataTable, { ScoreRenderer, StatusRenderer } from './components/DataTable'

// Use in component
const [filters, setFilters] = useState(INITIAL_FILTER_STATE)
const filtered = filterLeads(MOCK_LEADS, filters)
const sorted = sortLeads(filtered, filters.sortField, filters.sortDir)
```

---

**Last Updated**: 2026-03-16
**Build Status**: ✅ Successful
**Runtime Model**: openai-codex/gpt-5.1-codex-mini
