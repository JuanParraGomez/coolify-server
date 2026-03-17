# Plan: AI Sales Assistant Agent

> **Modelo de ejecución por defecto:** `openai-codex/gpt-5.1-codex-mini`
> (Este modelo difiere del runtime estándar; se especifica aquí para claridad)

---

## ✅ Integration Status

All three UI subtasks have been successfully integrated and unified:

### 1. **UI Shell** (AppShell.jsx)
- ✅ Navigation sidebar with all 10 plan sections + 2 new sections (social research, notifications)
- ✅ Design tokens (`T`) for consistent styling across all components
- ✅ Runtime model notice footer
- ✅ Responsive dark theme (slate/indigo color scheme)

### 2. **Data Layer** (src/lib/mock-data.js + src/store/appStore.js)
- ✅ 7 realistic Spanish leads with full contact info and engagement data
- ✅ Zustand store (useAppStore) for centralized state management
- ✅ 5 custom hooks: useLeads, useApiConfig, useNotifications, useSocialResearch, useChat
- ✅ Mock API client with 8 REST endpoints + configurable delays
- ✅ Filter options, sorting utilities, and lead enrichment functions
- ✅ Dashboard now imports MOCK_LEADS and filter options from data layer (no duplicate constants)

### 3. **UI Components** (Dashboard.jsx)
- ✅ **LeadDrillDown** — Expandable lead details with AI suggestion buttons
- ✅ **SocialResearchBlock** — Search decision-makers, animated LangGraph progress, profile display
- ✅ **NotificationsBlock** — SSE notification feed with unread indicators and inline replies
- ✅ **LeadsTableBlock** — Interactive table with filters, sorting, stats, and expandable rows

### Build & Type Safety
- ✅ `npm run build`: 34 modules, 197.90 KB (61.15 KB gzipped)
- ✅ `npm run type-check`: 0 TypeScript errors
- ✅ All imports unified and consistent

---

## Integration Verification (2026-03-16)

**All UI subtasks successfully integrated and tested:**

### Build Status ✅
```
npm run type-check     → 0 errors
npm run build         → 34 modules, 197.90 KB (61.15 KB gzipped)
```

### Data Layer ✅
- Dashboard now imports MOCK_LEADS, ESTADO_COLOR, and filter options from `src/lib/mock-data.js`
- No duplicate constants (removed inline definitions)
- Single source of truth for all data
- Ready for API integration

### Navigation ✅
- 12 sections total: 10 original + 2 new (Social Research, Notifications)
- AppShell properly renders SECTIONS + extraSections
- All navigation links functional
- Active state highlighting working

### Components ✅
- **LeadsTableBlock** — Filters, stats, sortable table, expandable rows
- **LeadDrillDown** — Detailed lead info with AI suggestion generators
- **SocialResearchBlock** — Decision-maker research with animated progress
- **NotificationsBlock** — Real-time notification feed with inline replies

---

## Objetivo

Construir un **Agente Asistente de Ventas con IA** que:

1. **Genera leads** a través de un chat de extensión de navegador
2. **Notifica** cuando un lead responde
3. **Ayuda a redactar respuestas** generadas por IA
4. **Investiga tomadores de decisiones** en redes sociales antes de entrevistas (intereses, perfil, desencadenantes de compra)
5. Permite **configurar la API key** de Gemini, OpenAI, Claude o Deepseek

---

## Arquitectura General

```
┌─────────────────────────────────────────────────────────────────┐
│                     AI Sales Assistant                          │
├──────────────┬──────────────┬──────────────┬───────────────────┤
│  Leads Panel │  Chat Panel  │  Research    │  API Config       │
│  (REST API)  │  (WS/REST)  │  (Social AI) │  (Local Storage)  │
├──────────────┴──────────────┴──────────────┴───────────────────┤
│                   AI Provider Layer                              │
│         OpenAI | Gemini | Claude | Deepseek                     │
├─────────────────────────────────────────────────────────────────┤
│              REST API Client (typed, React Query)               │
├─────────────────────────────────────────────────────────────────┤
│               Zustand Store (estado global)                      │
└─────────────────────────────────────────────────────────────────┘
```

---

## Stack Tecnológico

| Capa | Tecnología | Razón |
|------|-----------|-------|
| UI Framework | React 18 + TypeScript | Ecosistema, type safety |
| Build Tool | Vite 5 | HMR rápido, bundle pequeño |
| Estado Global | Zustand | Ligero, sin boilerplate |
| Data Fetching | React Query (TanStack) | Cache, refetch, loading states |
| HTTP Client | Axios con tipos | Interceptores, TypeScript |
| Estilos | CSS-in-JS (inline + CSS vars) | Sin build extra, portable |
| Runtime IA | openai-codex/gpt-5.1-codex-mini | **Modelo por defecto del sistema** |
| Proveedores IA | OpenAI, Gemini, Claude, Deepseek | Multi-proveedor configurable |

---

## Estructura de Archivos

```
apps/plan-a-solution-for-creating-an-ai/
├── index.html
├── package.json
├── vite.config.ts
├── tsconfig.json
├── src/
│   ├── main.tsx               # Entry point
│   ├── App.tsx                # Router + Layout principal
│   ├── types/
│   │   └── index.ts           # Tipos globales (Lead, Message, AIProvider...)
│   ├── lib/
│   │   └── apiClient.ts       # Cliente REST tipado (Axios + interceptores)
│   ├── store/
│   │   └── index.ts           # Zustand store (leads, notifications, config)
│   ├── hooks/
│   │   ├── useLeads.ts        # React Query: CRUD leads
│   │   ├── useNotifications.ts # Polling/WS notificaciones
│   │   └── useAIProvider.ts   # Abstracción multi-proveedor IA
│   └── components/
│       ├── Layout.tsx         # Shell: sidebar + topbar + main content
│       ├── LeadsList.tsx      # Tabla/cards de leads con estado
│       ├── ChatPanel.tsx      # Panel de chat (extensión simulada)
│       ├── NotificationsPanel.tsx # Alertas de respuestas
│       ├── AIReplyGenerator.tsx   # Generador de respuestas IA
│       ├── SocialResearch.tsx     # Investigación de tomadores de decisión
│       └── ApiKeyConfig.tsx       # Configuración de API keys
```

---

## Flujo de Datos

```
Usuario
  │
  ▼
ChatPanel (extensión simulada)
  │ POST /leads/create
  ▼
REST API → Backend LangGraph Agent
  │
  ▼
Zustand Store ← useLeads (React Query)
  │
  ├── LeadsList (lista/estado)
  ├── NotificationsPanel (polling cada 30s)
  └── AIReplyGenerator
        │ POST /ai/reply
        ▼
      AI Provider Layer
        ├── openai-codex/gpt-5.1-codex-mini (default)
        ├── OpenAI API
        ├── Gemini API
        ├── Claude API
        └── Deepseek API
```

---

## Componentes Clave

### 1. `LeadsList` — Panel de Leads
- Tabla con columnas: nombre, empresa, canal, estado, última actividad
- Estados: `nuevo`, `contactado`, `respondió`, `en_proceso`, `cerrado`
- Filtros por estado y canal
- Acción rápida: "Generar respuesta IA"

### 2. `ChatPanel` — Chat de Extensión
- Simula la interfaz del chat de extensión de navegador
- Permite iniciar conversaciones con leads
- Envía mensajes al backend vía REST
- Indicador de "escribiendo..." en tiempo real

### 3. `NotificationsPanel` — Alertas
- Polling cada 30 segundos a `GET /notifications`
- Toast notifications cuando un lead responde
- Badge contador en el sidebar
- Historial de notificaciones con timestamp

### 4. `AIReplyGenerator` — Generador de Respuestas
- Selección de tono: profesional, amigable, urgente
- Context-aware: incluye historial de conversación
- Botón "Generar" → llama al proveedor IA configurado
- Edición manual antes de enviar

### 5. `SocialResearch` — Investigación Social
- Input: nombre + empresa del lead
- Busca vía API: LinkedIn, Twitter/X, web pública
- Muestra: intereses, historial profesional, perfil de compra
- Genera resumen IA: "Ángulos de venta recomendados"
- Se integra con el contexto del `AIReplyGenerator`

### 6. `ApiKeyConfig` — Configuración de API
- Formulario por proveedor: OpenAI, Gemini, Claude, Deepseek
- Validación básica de formato de key
- Almacenamiento en `localStorage` (encriptado con btoa + salt)
- Selector de proveedor activo
- Test de conectividad ("Probar key")

---

## Estrategia de Datos (REST)

```typescript
// src/lib/apiClient.ts
// Cliente tipado con Axios, interceptores de auth y error handling

// Endpoints principales:
GET    /api/leads              → Lead[]
POST   /api/leads              → Lead
PUT    /api/leads/:id          → Lead
GET    /api/notifications      → Notification[]
POST   /api/ai/reply           → { reply: string }
POST   /api/ai/research        → { profile: SocialProfile }
```

---

## Validaciones

| Campo | Regla |
|-------|-------|
| API Key OpenAI | Inicia con `sk-` o `sk-proj-` |
| API Key Gemini | Longitud 39 chars |
| API Key Claude | Inicia con `sk-ant-` |
| API Key Deepseek | Inicia con `sk-` |
| Lead email | Formato RFC 5322 |
| Lead nombre | Min 2 chars, max 100 |
| Mensaje chat | Max 2000 chars |

---

## Plan de Implementación y Tiempos

| Fase | Tarea | Tiempo estimado |
|------|-------|----------------|
| **Fase 1** | Setup TypeScript, Zustand, React Query, Axios | 2h |
| **Fase 2** | Tipos globales + cliente REST + store Zustand | 3h |
| **Fase 3** | Layout + navegación + sidebar | 2h |
| **Fase 4** | LeadsList con React Query + filtros | 4h |
| **Fase 5** | ChatPanel + polling de respuestas | 4h |
| **Fase 6** | NotificationsPanel | 2h |
| **Fase 7** | AIReplyGenerator + integración multi-proveedor | 5h |
| **Fase 8** | SocialResearch panel | 4h |
| **Fase 9** | ApiKeyConfig + validaciones + test conectividad | 3h |
| **Fase 10** | Testing, polish, despliegue | 3h |
| **Total** | | **~32 horas** |

---

## Extensión de Navegador (Scope Separado)

La extensión de Chrome/Edge se plantea como proyecto independiente:
- **Manifest V3** con content scripts
- Inyecta botón de chat en LinkedIn, Gmail, web
- Comunica con el backend vía `chrome.runtime.sendMessage`
- Tiempo estimado: +20h adicionales

---

## Riesgos

| Riesgo | Probabilidad | Mitigación |
|--------|-------------|------------|
| Rate limits de APIs de IA | Alta | Retry con backoff exponencial, caché de respuestas |
| Scraping de redes sociales bloqueado | Alta | Usar APIs oficiales (LinkedIn API, Twitter API v2) |
| API keys expuestas en cliente | Media | Nunca enviar a logs, usar proxy backend para llamadas IA |
| Latencia alta en investigación social | Media | Loading skeletons, request en background |
| CORS en llamadas directas a APIs IA | Media | Enrutar todo a través del backend LangGraph |

---

## Notas de Despliegue

- **Provider:** Coolify (ui-factory-prod)
- **Dominio:** `plan-a-solution-for-creating-an-ai.apps.uniflexa.cloud`
- **Auto-deploy:** activado al push a `main`
- **Variables de entorno:** `VITE_API_BASE_URL` apunta al backend LangGraph
- **Build:** `vite build` → directorio `dist/`
- **Runtime IA default:** `openai-codex/gpt-5.1-codex-mini`

---

## Project Identity
- slug: `plan-a-solution-for-creating-an-ai`
- project_type: `long_lived`
- template: `react-starter`
- project_root: `apps/plan-a-solution-for-creating-an-ai`
- deployment_provider: `coolify`
- domain: `plan-a-solution-for-creating-an-ai.apps.uniflexa.cloud`

## How It Should Be Managed
- This project lives inside the `coolify-server` monorepo.
- Update this README whenever purpose, architecture, deployment or usage changes.
- Keep `app.meta.yaml` and `deploy.meta.yaml` aligned with this file.
