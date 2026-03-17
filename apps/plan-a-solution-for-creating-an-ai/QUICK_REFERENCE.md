# Quick Reference Guide

**AI Sales Assistant Planning Application**
Data Layer, State Management & Components

---

## 📂 File Locations

```
src/
├── lib/
│   ├── mock-data.js              ← MAIN DATA LAYER ⭐
│   └── DATA_LAYER_GUIDE.md       ← Comprehensive docs
│
├── components/
│   ├── DataTable.jsx             ← REUSABLE TABLE ⭐
│   ├── FiltersPanel.jsx          ← REUSABLE FILTERS ⭐
│   └── [other components...]
│
├── main.jsx                       ← Entry point
└── App.jsx
```

---

## ⚡ Quick Start

### 1. Import Everything You Need

```javascript
import {
  MOCK_LEADS,
  filterLeads,
  sortLeads,
  getLeadStats,
  API_PROVIDERS,
  INITIAL_FILTER_STATE,
  INITIAL_APP_STATE,
  DEFAULT_RUNTIME_MODEL,
} from './lib/mock-data'

import FiltersPanel from './components/FiltersPanel'
import DataTable, {
  ScoreRenderer,
  StatusRenderer,
  ResponseRenderer,
  RiskRenderer,
  BudgetRenderer,
  TagsRenderer,
  DateRenderer,
  ActionsRenderer,
} from './components/DataTable'
```

### 2. Setup Component State

```javascript
function MyLeadsComponent() {
  const [filters, setFilters] = useState(INITIAL_FILTER_STATE)
  const [expandedId, setExpandedId] = useState(null)

  const filtered = filterLeads(MOCK_LEADS, filters)
  const sorted = sortLeads(filtered, filters.sortField, filters.sortDir)
  const stats = getLeadStats(MOCK_LEADS)

  return (
    <>
      <FiltersPanel {...filters} onChange={setFilters} />
      <DataTable
        data={sorted}
        columns={COLUMNS}
        expandedRowId={expandedId}
        onExpandChange={setExpandedId}
      />
    </>
  )
}
```

---

## 🎯 Common Tasks

### Filter Leads
```javascript
// By status
const nuevos = filterLeads(MOCK_LEADS, { estado: 'nuevo' })

// By multiple criteria
const filtered = filterLeads(MOCK_LEADS, {
  estado: 'contactado',
  canal: 'LinkedIn',
  respondio: 'si',
  riesgo: 'Bajo',
  q: 'Carlos'  // search query
})
```

### Sort Leads
```javascript
// By score descending
const sorted = sortLeads(filtered, 'score', 'desc')

// By name ascending
const sorted = sortLeads(filtered, 'nombre', 'asc')
```

### Get Statistics
```javascript
const stats = getLeadStats(MOCK_LEADS)
// Returns: {
//   total, nuevos, contactados, calificados, propuestas,
//   respondieron, noRespondieron, scorePromedio,
//   scoreAlto, scoreMedio, scoreBajo,
//   tasaConversion, riesgoBajo, riesgoMedio, riesgoAlto
// }
```

### Get Single Lead
```javascript
const lead = MOCK_LEADS.find(l => l.id === 1)
const enriched = enrichLead(1)  // With social research & chat
```

---

## 🧩 Component Props

### FiltersPanel

```jsx
<FiltersPanel
  // Current values
  query=""
  estado="todos"
  canal="todos"
  respondio="todos"
  riesgo="todos"

  // Callbacks
  onQueryChange={(q) => {}}
  onEstadoChange={(e) => {}}
  onCanalChange={(c) => {}}
  onRespondioChange={(r) => {}}
  onRiesgoChange={(ri) => {}}
  onReset={() => {}}
/>
```

### DataTable

```jsx
<DataTable
  // Data
  data={leads}
  columns={[
    {
      key: 'nombre',
      label: 'Nombre',
      render: (value, row) => <strong>{value}</strong>,
      sortable: true  // optional
    }
  ]}

  // State
  expandedRowId={null}
  sortField="score"
  sortDir="desc"
  loading={false}

  // Callbacks
  onExpandChange={(id) => {}}
  onSortChange={(field, dir) => {}}
  renderExpandedRow={(row) => <Details row={row} />}

  // Options
  emptyMessage="No hay datos"
/>
```

---

## 🎨 Built-in Renderers

All renderers are exported from DataTable:

```javascript
// Score: 0-100 with progress bar
ScoreRenderer(85)
// → [████████░░░░░] 85

// Status: Colored badge
StatusRenderer('nuevo')
// → [🆕 nuevo]

// Response: Checkmark or dash
ResponseRenderer(true)
// → ✅ Sí

// Risk: Color + emoji icon
RiskRenderer('Bajo')
// → [🟢 Bajo]

// Budget: Color-coded range
BudgetRenderer('$50k-100k')
// → [$50k-100k]

// Tags: Show first 2, +N more
TagsRenderer(['IA', 'Automatización', 'DevOps'])
// → [IA] [Automatización] +1

// Date: Relative format
DateRenderer('2026-03-14')
// → 2d (Ayer, Hoy, 2d, 1w, 2m, etc.)

// Actions: Button grid
ActionsRenderer(1, [
  { label: 'Editar', color: '#3b82f6', onClick: edit },
  { label: 'Eliminar', color: '#ef4444', onClick: delete }
])
```

---

## 📊 Data Structures

### Lead Object

```javascript
{
  id: number,
  nombre: string,
  empresa: string,
  cargo: string,
  estado: 'nuevo' | 'contactado' | 'calificado' | 'propuesta',
  canal: 'LinkedIn' | 'Extension' | 'Twitter',
  score: number,           // 0-100
  respondio: boolean,
  fechaContacto: string,   // YYYY-MM-DD
  interes: string,
  presupuesto: string,
  email: string,
  telefono: string,
  ubicacion: string,
  siguiendo: boolean,
  ultimaInteraccion: string,
  notasInternas: string,
  tagsInteres: string[],
  tipoDecision: string,
  nivelRiesgo: 'Bajo' | 'Medio' | 'Alto' | 'Muy Bajo',
  faseVenta: string,
}
```

### Filter Object

```javascript
{
  q: string,                    // Search query
  estado: 'todos' | string,
  canal: 'todos' | string,
  respondio: 'todos' | 'si' | 'no',
  riesgo: 'todos' | string,
  sortField: string,            // 'nombre', 'score', etc.
  sortDir: 'asc' | 'desc',
  page: number,
  limit: number,
}
```

### Statistics Object

```javascript
{
  total: number,
  nuevos: number,
  contactados: number,
  calificados: number,
  propuestas: number,
  respondieron: number,
  noRespondieron: number,
  scorePromedio: number,
  scoreAlto: number,
  scoreMedio: number,
  scoreBajo: number,
  tasaConversion: string,       // "62.5%"
  riesgoBajo: number,
  riesgoMedio: number,
  riesgoAlto: number,
}
```

---

## 🔗 Data Flow Example

```
Component mounts
    ↓
Initialize: const [filters, setFilters] = useState(INITIAL_FILTER_STATE)
    ↓
User changes filter
    ↓
setFilters({ ...filters, estado: 'nuevo' })
    ↓
Component re-renders with new filters
    ↓
filterLeads(MOCK_LEADS, filters) → filtered array
    ↓
sortLeads(filtered, sortField, sortDir) → sorted array
    ↓
Pass to DataTable
    ↓
Table displays with sort indicators
    ↓
User clicks header to sort
    ↓
onSortChange(field, dir) callback
    ↓
Update filters: setFilters({ ...filters, sortField, sortDir })
    ↓
Back to step 4
```

---

## 🚀 Mock API Usage

All endpoints available in `MOCK_API_RESPONSES`:

```javascript
import { MOCK_API_RESPONSES } from './lib/mock-data'

// GET /api/leads
const response = MOCK_API_RESPONSES.getLeads({
  estado: 'nuevo',
  canal: 'LinkedIn',
  page: 1,
  limit: 10
})
// Response: { status: 200, data: { items: Lead[], total, page, limit } }

// GET /api/leads/:id
const lead = MOCK_API_RESPONSES.getLeadDetail(1)
// Response: { status: 200, data: Lead }

// POST /api/leads/:id/suggest
const suggestion = MOCK_API_RESPONSES.generateSuggestion(1, 'openai')
// Response: { status: 200, data: { suggestion, provider, tokens } }

// GET /api/social-research/:id
const research = MOCK_API_RESPONSES.getSocialResearch(1)
// Response: { status: 200, data: { sources, insights } }

// GET /api/notifications
const notifications = MOCK_API_RESPONSES.getNotifications()
// Response: { status: 200, data: { items, unread } }
```

---

## 🎯 Utility Functions

```javascript
// Filter
filterLeads(leads, filters) → Lead[]

// Sort
sortLeads(leads, field, direction) → Lead[]

// Statistics
getLeadStats(leads) → Stats

// Notifications
getNotificationSummary(notifications) → Summary

// Score Factors
getLeadScoreFactors(lead) → Factor[]

// Enrich
enrichLead(leadId) → EnrichedLead

// Custom: Get all leads from CEO role
MOCK_LEADS.filter(l => l.cargo.includes('CEO'))
```

---

## 🔌 AI Providers

```javascript
import { API_PROVIDERS, DEFAULT_RUNTIME_MODEL } from './lib/mock-data'

// All providers
API_PROVIDERS[0]  // OpenAI: gpt-4, gpt-3.5-turbo
API_PROVIDERS[1]  // Gemini: gemini-1.5-pro, gemini-1.5-flash
API_PROVIDERS[2]  // Claude: claude-3-opus, claude-3-sonnet
API_PROVIDERS[3]  // Deepseek: deepseek-chat, deepseek-coder

// Default runtime
DEFAULT_RUNTIME_MODEL  // "openai-codex/gpt-5.1-codex-mini"
```

---

## 🎨 Color Reference

```javascript
// Estado Colors
{
  nuevo: '#3b82f6',        // Blue
  contactado: '#f59e0b',   // Amber
  calificado: '#10b981',   // Green
  propuesta: '#8b5cf6',    // Purple
}

// Risk Colors
{
  'Bajo': '#10b981',       // Green
  'Medio': '#f59e0b',      // Amber
  'Alto': '#ef4444',       // Red
}

// Theme Tokens
const T = {
  bg: '#0f1117',           // Background
  surface: '#1a1d27',      // Card/Surface
  surface2: '#222534',     // Slightly lighter
  border: '#2a2d3e',       // Borders
  text: '#e2e8f0',         // Text
  muted: '#94a3b8',        // Muted text
  accent: '#6366f1',       // Primary accent
  accentHover: '#818cf8',  // Hover state
}
```

---

## 📋 Sample Column Definitions

```javascript
const columns = [
  {
    key: 'nombre',
    label: 'Nombre',
    render: TitleRenderer,
  },
  {
    key: 'empresa',
    label: 'Empresa',
  },
  {
    key: 'cargo',
    label: 'Cargo',
    render: RoleRenderer,
  },
  {
    key: 'estado',
    label: 'Estado',
    render: StatusRenderer,
  },
  {
    key: 'canal',
    label: 'Canal',
  },
  {
    key: 'score',
    label: 'Score',
    render: ScoreRenderer,
  },
  {
    key: 'respondio',
    label: 'Respondió',
    render: ResponseRenderer,
    sortable: false,
  },
  {
    key: 'nivelRiesgo',
    label: 'Riesgo',
    render: RiskRenderer,
  },
  {
    key: 'presupuesto',
    label: 'Presupuesto',
    render: BudgetRenderer,
  },
  {
    key: 'tagsInteres',
    label: 'Intereses',
    render: TagsRenderer,
  },
  {
    key: 'fechaContacto',
    label: 'Contacto',
    render: DateRenderer,
  },
]
```

---

## 🔍 Search Examples

```javascript
// Search by name
filterLeads(MOCK_LEADS, { q: 'Carlos' })

// Search by company
filterLeads(MOCK_LEADS, { q: 'TechMX' })

// Search by role
filterLeads(MOCK_LEADS, { q: 'CEO' })

// Search by tag/interest
filterLeads(MOCK_LEADS, { q: 'Automatización' })

// Complex search
filterLeads(MOCK_LEADS, {
  q: 'automatización',
  estado: 'nuevo',
  riesgo: 'Bajo',
  respondio: 'no'
})
```

---

## ✅ Testing Examples

```javascript
// Test filters
console.log(filterLeads(MOCK_LEADS, { estado: 'nuevo' }))

// Test sort
console.log(sortLeads(MOCK_LEADS, 'score', 'asc'))

// Test stats
console.log(getLeadStats(MOCK_LEADS))

// Test API response
console.log(MOCK_API_RESPONSES.getLeads({}))

// Test lead enrichment
console.log(enrichLead(1))
```

---

## 📚 Documentation Files

| File | Purpose |
|------|---------|
| `mock-data.js` | Main data layer with all data & utilities |
| `FiltersPanel.jsx` | Reusable filter component |
| `DataTable.jsx` | Reusable table component + renderers |
| `DATA_LAYER_GUIDE.md` | Comprehensive technical documentation |
| `IMPLEMENTATION_SUMMARY.md` | Implementation details & checklist |
| `QUICK_REFERENCE.md` | This file - quick lookup guide |

---

## 🎯 Next Steps

1. **Replace Mock Data**: Connect to real API endpoints
2. **Add State Management**: Implement Zustand store
3. **Error Handling**: Add try-catch and error boundaries
4. **Caching**: Use React Query for API responses
5. **Real-time**: Implement WebSocket for notifications
6. **Analytics**: Track user interactions
7. **Testing**: Add unit & integration tests
8. **Deployment**: Deploy to production

---

**Framework**: React 18.3.1
**Build Tool**: Vite 5.4.2
**Runtime Model**: openai-codex/gpt-5.1-codex-mini
**Last Updated**: 2026-03-16

---

For detailed documentation, see `DATA_LAYER_GUIDE.md`
