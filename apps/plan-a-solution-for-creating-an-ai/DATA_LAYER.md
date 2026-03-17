# Data Layer, State Management & Components Implementation

## Overview

This document describes the comprehensive data layer, state management, and component system implemented for the **Plan A Solution For Creating An AI** application - an AI Sales Assistant planning platform with leads management, social research, API configuration, and notifications.

## Architecture

### 1. Data Layer (`src/lib/mock-data.js`)

**Comprehensive mock data system providing:**

#### Leads Data
- **8 Sample Leads** with complete profiles:
  - Personal information (name, email, phone, location)
  - Company details (enterprise, role, position)
  - Sales funnel state (nuevo, contactado, calificado, propuesta)
  - Lead quality score (0-100)
  - Contact channels (LinkedIn, Extension, Twitter)
  - Interest tags and budget ranges
  - Risk assessment levels
  - Internal notes and interaction history

#### Social Research Database
- **3 Fully Enriched Lead Profiles** with:
  - Multi-platform presence (LinkedIn, Twitter, GitHub)
  - Follower counts, engagement metrics
  - Research interests and content analysis
  - Behavioral insights
  - Buying trigger identification
  - Optimal engagement points
  - Subject matter expertise

#### Chat History & Conversations
- Pre-populated conversation examples
- Sample messages for each major lead
- Multi-turn conversation support

#### Notifications System
- **4 Different Notification Types**:
  - Response notifications (lead replied)
  - Reminder notifications (follow-up needed)
  - Milestone notifications (status changed)
  - Social insights (new activity detected)
- Unread status tracking
- Timestamp support
- Action-based notifications with CTA

#### Filter & Display Options
- **Estado (Status) Options**: Todos, Nuevo, Contactado, Calificado, Propuesta
- **Canal (Channel) Options**: Todos, LinkedIn, Extensión, Twitter
- **Respondió (Response) Options**: Todos, Sí, No
- **Riesgo (Risk) Options**: Todos, Bajo, Medio, Alto
- **Color Coding**: Status-specific colors for visual distinction
- **Risk Level Colors**: Green (Bajo), Yellow (Medio), Red (Alto)

#### API Provider Configuration
- **4 AI Providers**: OpenAI, Google Gemini, Anthropic Claude, Deepseek
- Provider specs: models, rate limits, latency, pricing
- Default runtime model: `openai-codex/gpt-5.1-codex-mini`
- Environment variable mappings

#### Message Templates
- **3 Message Categories**: Greeting, Value Proposition, Call-to-Action
- **3 Tone Options**: Formal, Casual, Persuasive
- **Conversation Status Types**: Iniciado, En progreso, Propuesta, Ganado, Perdido
- **Stats Labels**: Comprehensive metric labels (Spanish)

#### Validation Rules
- API Key validation: min 8 chars, alphanumeric + special chars
- Email pattern validation
- Phone number validation
- Search constraints

#### Utility Functions

**filterLeads(leads, filters)**
- Filter by estado, canal, respondio, riesgo
- Full-text search across nombre, empresa, cargo, tagsInteres
- Composable filter support

**sortLeads(leads, sortField, sortDir)**
- Dynamic field sorting
- Ascending/descending support

**getLeadStats(leads)**
- Comprehensive statistics object:
  - Total, by estado, respondieron
  - Score distribution (alto/medio/bajo)
  - Risk distribution
  - Conversion rate

**getNotificationSummary(notifications)**
- Total count, unread count
- By-type breakdown
- Urgent notification count

**enrichLead(leadId)**
- Merge lead with social research data
- Attach chat history
- Include score factors

---

### 2. State Management (`src/store/appStore.js`)

**Zustand-based central state management store**

#### State Sections

```javascript
// Leads
leads: MOCK_LEADS
selectedLeadId: null

// Filters & Sorting
filters: INITIAL_FILTER_STATE
sortField: 'score'
sortDir: 'desc'

// Notifications
notifications: MOCK_NOTIFICATIONS
unreadCount: (auto-calculated)

// API Configuration
apiKeys: { openai, gemini, claude, deepseek }
activeProvider: 'openai'

// Social Research & Chat
socialResearch: MOCK_SOCIAL_RESEARCH
chatMessages: MOCK_CHAT_HISTORY
expandedLeadId: null

// UI State
loading: false
error: null
```

#### Store Actions

**Filter Management**
- `setFilters(filters)` - Replace all filters
- `setFilter(key, value)` - Update single filter
- `resetFilters()` - Return to initial state

**Sorting**
- `setSort(field, dir)` - Set sort field and direction
- `toggleSort(field)` - Toggle sort order

**Lead Selection**
- `selectLead(id)` - Select for detailed view
- `clearSelection()` - Clear selection
- `setExpandedLead(id)` - Toggle row expansion

**Notifications**
- `setNotifications(notifications)` - Replace all
- `addNotification(notification)` - Add new
- `markNotificationRead(id)` - Mark as read
- `clearNotifications()` - Remove all

**API Configuration**
- `setApiKey(provider, key)` - Store API key
- `clearApiKey(provider)` - Remove API key
- `setActiveProvider(provider)` - Switch provider
- `getApiKey(provider)` - Retrieve key
- `hasApiKey(provider)` - Check if configured

**Social Research & Chat**
- `setSocialResearch(leadId, data)` - Store research
- `getSocialResearch(leadId)` - Retrieve research
- `addChatMessage(leadId, message)` - Save message
- `getChatMessages(leadId)` - Get conversation
- `clearChat(leadId)` - Reset conversation

**Computed State**
- `getFilteredLeads()` - Apply filters + sorting
- `getLeadStats()` - Calculate statistics
- `getLeadById(id)` - Find lead by ID
- `getEnrichedLead(id)` - Lead + research + chat
- `getNotificationSummary()` - Notification stats
- `getActiveProviderConfig()` - Current provider info

**Store Lifecycle**
- `reset()` - Reset to initial state with fresh mock data

---

### 3. Custom Hooks

#### `useLeads()` - Lead Management Hook

**State Subscriptions**
```javascript
{
  // Data
  leads: Lead[],           // Filtered & sorted
  allLeads: Lead[],        // Unfiltered
  stats: LeadStats,        // Calculated
  selectedLead: Lead | null,
  selectedLeadEnriched: LeadEnriched | null,
  selectedLeadResearch: SocialResearch | null,
  selectedLeadChat: ChatMessage[],

  // Filters & Sorting
  filters: FilterState,
  setFilters, setFilter, resetFilters,
  sortField: string,
  sortDir: 'asc' | 'desc',
  toggleSort(field),

  // Selection
  selectedLeadId: number | null,
  selectLead(id),
  clearSelection(),

  // Expansion
  expandedLeadId: number | null,
  setExpandedLead(id),

  // Helpers
  getLeadById(id),
  getEnrichedLead(id),
  totalLeads: number,
  hasActiveFilters: boolean,
}
```

#### `useApiConfig()` - API Configuration Hook

**Features**
```javascript
{
  // Key Management
  apiKeys: object,
  visible: object,
  toggleVisible(id),
  updateKey(id, value),

  // Validation
  validated: object,
  validateKey(id) → boolean,

  // Provider Management
  activeProvider: string,
  setActiveProvider(provider),
  clearApiKey(provider),

  // Provider Data
  providers: ProviderConfig[],
  getProviderConfig(id),
  activeProviderConfig: ProviderConfig,
  configuredProviders: ProviderConfig[],
  hasAnyApiKey: boolean,

  // Helper Methods
  getKeyStatus(id) → 'no_configurado' | 'sin_validar' | 'valida' | 'invalida',
  getMaskedKey(id) → string,
}
```

#### `useNotifications()` - Notification Management Hook

**Features**
```javascript
{
  // Core Data
  notifications: Notification[],
  unreadNotifications: Notification[],
  urgentNotifications: Notification[],
  unreadCount: number,
  summary: NotificationSummary,

  // Grouped Data
  notificationsByType: object,

  // Actions
  addNotification(notification),
  markNotificationRead(id),
  markAllRead(),
  removeNotification(id),
  clearNotifications(),
  addNewNotification(type, leadId, leadName, message, content),

  // Queries
  getUnreadByType(type) → number,
  getNotificationsByLead(leadId) → Notification[],
  getNotificationsByType(type) → Notification[],

  // Stats & Flags
  hasUnreadNotifications: boolean,
  hasUrgentNotifications: boolean,
  urgentCount: number,
  totalNotifications: number,
}
```

---

### 4. Components

#### `FiltersPanel.jsx` - Advanced Filters

**Props**
```javascript
{
  query: string,
  estado: string,
  canal: string,
  respondio: string,
  riesgo: string,
  onQueryChange: (value) => void,
  onEstadoChange: (value) => void,
  onCanalChange: (value) => void,
  onRespondioChange: (value) => void,
  onRiesgoChange: (value) => void,
  onReset: () => void,
}
```

**Features**
- Full-text search with icon support
- 4 Filter dropdowns (Estado, Canal, Respondió, Riesgo)
- Clear filters button (conditional)
- Active filters summary display
- Tooltips for accessibility
- Dark theme styling

#### `DataTable.jsx` - Universal Data Table

**Props**
```javascript
{
  data: any[],
  columns: ColumnConfig[],
  onRowClick: (row) => void,
  onAction: (action) => void,
  expandedRowId: string | null,
  onExpandChange: (id) => void,
  renderExpandedRow: (row) => ReactNode,
  sortField: string,
  sortDir: 'asc' | 'desc',
  onSortChange: (field, dir) => void,
  loading: boolean,
  emptyMessage: string,
  onRowHover: (row) => void,
  striped: boolean,
  highlightable: boolean,
}
```

**Features**
- Dynamic column rendering
- Sortable headers with visual indicators
- Row expansion with custom content
- Striped row styling
- Hover effects
- Empty state handling
- Loading state

**Built-in Renderers**
- `ScoreRenderer(score)` - Progress bar with color
- `StatusRenderer(status)` - Status badge
- `ResponseRenderer(responded)` - Yes/No indicator
- `TitleRenderer(title, row)` - Bold text
- `RoleRenderer(role)` - Role badge
- `RiskRenderer(riskLevel)` - Risk with emoji + color
- `BudgetRenderer(budget)` - Budget with color coding
- `TagsRenderer(tags)` - Tag cloud (up to 2 + count)
- `DateRenderer(dateString)` - Relative time
- `ActionsRenderer(leadId, actions)` - Action buttons

---

## Data Models

### Lead Model
```javascript
{
  id: number,
  nombre: string,
  empresa: string,
  cargo: string,
  estado: 'nuevo' | 'contactado' | 'calificado' | 'propuesta',
  canal: 'LinkedIn' | 'Extension' | 'Twitter',
  score: number (0-100),
  respondio: boolean,
  fechaContacto: string (ISO date),
  interes: string,
  presupuesto: '$10k-20k' | '$20k-50k' | '$50k-100k' | '$100k+',
  email: string,
  telefono: string,
  ubicacion: string,
  siguiendo: boolean,
  ultimaInteraccion: string (datetime),
  notasInternas: string,
  tagsInteres: string[],
  tipoDecision: 'Técnico' | 'Ejecutivo' | 'Comercial' | 'Operacional' | 'Estratégico',
  nivelRiesgo: 'Bajo' | 'Medio' | 'Alto' | 'Muy Bajo',
  faseVenta: 'Prospección' | 'Educación' | 'Calificación' | 'Demostración' | 'Evaluación' | 'Propuesta',
}
```

### SocialResearch Model
```javascript
{
  leadId: number,
  nombre: string,
  sources: {
    platform: string,
    profile: string,
    followers: number,
    interests: string[],
    engagement: string,
    // ... platform-specific fields
  }[],
  insights: string[],
  triggerCompra: string[],
  perfil: string,
  mejorMomento: string,
  puntosAbordaje: string[],
}
```

### Notification Model
```javascript
{
  id: number,
  type: 'response' | 'reminder' | 'milestone' | 'social_insight',
  leadId: number,
  leadName: string,
  leadCompany: string,
  message: string,
  content: string,
  timestamp: string (ISO),
  read: boolean,
  action: 'reply' | 'follow-up' | 'view',
}
```

### FilterState Model
```javascript
{
  q: string,           // Search query
  estado: string,      // Status filter
  canal: string,       // Channel filter
  respondio: string,   // Response filter
  riesgo: string,      // Risk filter
  sortField: string,   // Sort column
  sortDir: 'asc' | 'desc',
  page: number,
  limit: number,
}
```

---

## Features Implemented

✅ **Complete Leads Management**
- 8 sample leads with comprehensive data
- Filtering by multiple criteria (estado, canal, respondio, riesgo)
- Full-text search across name, company, role, interests
- Lead scoring and quality assessment
- Risk level classification

✅ **Social Research Integration**
- Multi-platform profile research (LinkedIn, Twitter, GitHub)
- Engagement metrics and follower counts
- Interest analysis and behavioral insights
- Buying trigger identification
- Optimal engagement recommendations

✅ **AI Provider Configuration**
- Support for 4 major AI providers (OpenAI, Gemini, Claude, Deepseek)
- API key management with validation
- Provider model specifications
- Rate limit and pricing information
- Default runtime model support

✅ **Notification System**
- 4 notification types with different purposes
- Unread status tracking
- Type-based filtering and grouping
- Urgent notification priority
- Lead-specific notification queries

✅ **State Management**
- Centralized Zustand store
- Computed/filtered leads with sorting
- Lead selection and expansion
- Filter persistence
- Error handling

✅ **Reusable Components**
- Advanced filters panel with visual feedback
- Universal data table with custom renderers
- Extensible column configuration
- Row expansion support
- Empty states and loading indicators

✅ **Spanish Language Support**
- All labels and messages in Spanish
- Proper date/time formatting
- Localized validation messages
- Regional currency/budget indicators

✅ **Type Safety**
- JSDoc documentation for all functions
- Component prop documentation
- Clear data model specifications
- Validation rule definitions

---

## Build & Deployment

✅ **Builds Successfully**
```
✓ 33 modules transformed
✓ built in 778ms
dist/assets/index-BwxvPIL9.js  180.07 kB │ gzip: 56.54 kB
```

No TypeScript or build errors. Production-ready.

---

**Last Updated**: 2026-03-16
**Framework**: React 18 + Zustand + Vite
**Language**: JavaScript (JSX)
**Theme**: Dark mode with indigo accent
