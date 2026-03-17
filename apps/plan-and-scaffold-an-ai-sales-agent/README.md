# Plan And Scaffold An Ai Sales Agent

## Purpose
Plan and scaffold an AI Sales agent application that uses a browser extension chat to generate leads, notifies when leads reply, crafts AI-generated responses, and pre-interview research on decision makers via social data. Include a configurable API key section supporting Gemini, OpenAI, Claude, or Deepseek. Provide architecture, components, data flow, tech stack, and timeline in Spanish; mention default runtime model openai-codex/gpt-5.1-codex-mini in response because runtime differs; include steps to use LangGraph for building or orchestrating the app.

## Project Identity
- slug: `plan-and-scaffold-an-ai-sales-agent`
- project_type: `long_lived`
- template: `react-starter`
- project_root: `apps/plan-and-scaffold-an-ai-sales-agent`
- deployment_provider: `coolify`
- domain: `plan-and-scaffold-an-ai-sales-agent.apps.uniflexa.cloud`

## How It Should Be Managed
- This project lives inside the `coolify-server` monorepo.
- Update this README whenever purpose, architecture, deployment or usage changes.
- Keep `app.meta.yaml` and `deploy.meta.yaml` aligned with this file.

## Arquitectura del Sistema (en español)

### Stack Tecnológico
| Capa | Tecnología |
|------|-----------|
| Frontend | React 18 + Vite 5, inline styles, React Router v6 |
| Orquestación IA | **LangGraph** (nodos: qualify_lead → research_social → draft_message → review_tone) |
| Backend API | FastAPI (Python) — REST endpoints tipados |
| Base de datos | PostgreSQL + Redis (caché y cola de mensajes) |
| Extensión navegador | Chrome Extension MV3 + content script |
| Modelo de runtime | **`openai-codex/gpt-5.1-codex-mini`** ⚠️ (difiere del modelo de desarrollo `claude-sonnet-4-6`) |

### Componentes principales

```
src/
├── pages/
│   ├── Dashboard.jsx       # Métricas KPI: total leads, tasa conversión, alertas
│   ├── Leads.jsx           # Tabla de leads con filtros por estado, score, fuente
│   ├── Chat.jsx            # Interfaz chat extensión de navegador (por lead)
│   ├── Responses.jsx       # Generación de respuestas IA personalizadas
│   ├── Research.jsx        # Investigación social pre-entrevista (LinkedIn/Twitter)
│   ├── Alerts.jsx          # Notificaciones en tiempo real (polling 30s)
│   ├── LangGraphAgent.jsx  # Panel de orquestación LangGraph
│   └── Settings.jsx        # Configuración de API keys (OpenAI/Gemini/Claude/DeepSeek)
├── hooks/
│   ├── useLeads.js         # GET /api/leads — filtrado, paginación, actualización
│   ├── useAlerts.js        # GET /api/alerts — polling, markRead, markAllRead
│   ├── useChat.js          # GET/POST /api/leads/:id/messages + AI draft
│   ├── useResearch.js      # GET /api/leads/:id/research + POST /api/research/social
│   ├── useLangGraph.js     # POST /api/agent/run + polling de estado
│   └── useApiConfig.js     # localStorage config: proveedor, apiKey, modelo
├── views/                  # Componentes avanzados reutilizables
│   ├── LangGraphView.jsx   # Diagrama de flujo + ejecución interactiva del agente
│   └── ApiConfigView.jsx   # Formulario de configuración multi-proveedor
└── lib/
    ├── api-client.js       # Cliente REST tipado (Leads, Chat, Alerts, Research, Agent)
    ├── constants.js        # Proveedores IA, estados de leads, modelo de runtime
    └── types.js            # Tipos JSDoc: Lead, Message, Alert, AgentRun, etc.
```

### Flujo de Datos (REST)

```
Extensión de navegador
    │ captura lead desde LinkedIn/web
    ▼
POST /api/leads              ← crea lead
    │
    ▼
LangGraph Agent Server       ← /home/juan/Documents/langgraph-agent-server
    ├─ qualify_lead           analiza si cumple criterios ICP
    ├─ research_social        extrae datos de LinkedIn/Twitter vía API
    ├─ draft_message          genera mensaje personalizado (openai-codex/gpt-5.1-codex-mini)
    └─ review_tone            revisa tono → bucle revise_draft si es necesario
    │
    ▼
POST /api/leads/:id/messages ← guarda mensaje generado
    │
    ▼
GET  /api/alerts (polling)   ← notifica cuando el lead responde
    │
    ▼
Frontend React               ← muestra alerta + respuesta sugerida IA
```

### Pasos para usar LangGraph

1. **Instalar el servidor LangGraph:**
   ```bash
   cd /home/juan/Documents/langgraph-agent-server
   pip install langgraph langchain-openai fastapi uvicorn
   ```

2. **Definir el grafo del agente** (`agents/sales_agent.py`):
   ```python
   from langgraph.graph import StateGraph, START, END

   workflow = StateGraph(AgentState)
   workflow.add_node("qualify_lead", qualify_lead_node)
   workflow.add_node("research_social", research_social_node)
   workflow.add_node("draft_message", draft_message_node)
   workflow.add_node("review_tone", review_tone_node)
   workflow.add_node("revise_draft", revise_draft_node)

   workflow.add_edge(START, "qualify_lead")
   workflow.add_edge("qualify_lead", "research_social")
   workflow.add_edge("research_social", "draft_message")
   workflow.add_edge("draft_message", "review_tone")
   workflow.add_conditional_edges("review_tone", check_tone,
       {"approved": END, "revise": "revise_draft"})
   workflow.add_edge("revise_draft", "review_tone")

   app = workflow.compile()
   ```

3. **Exponer como REST API** con FastAPI en puerto 2024.

4. **Configurar en Settings** → ingresar URL del servidor LangGraph + API key del proveedor elegido.

5. **Modelo de runtime:** Por defecto el agente usa `openai-codex/gpt-5.1-codex-mini`. Esto es independiente del modelo de planificación (`claude-sonnet-4-6`).

### Cronograma de implementación

| Semana | Entregable |
|--------|-----------|
| 1 | Extensión de Chrome MV3 + captura de leads desde LinkedIn |
| 2 | Backend FastAPI + PostgreSQL: CRUD de leads y mensajes |
| 3 | Integración LangGraph: grafo qualify→research→draft→review |
| 4 | Sistema de alertas: polling + notificaciones push |
| 5 | Módulo de investigación social: perfil + puntos de conversación |
| 6 | Generación de respuestas IA + panel de revisión |
| 7 | Configuración multi-proveedor + validación de API keys |
| 8 | QA, pruebas E2E, despliegue en producción vía Coolify |

### Contratos de datos REST

```typescript
// GET /api/leads
{ leads: Lead[], total: number, page: number }

// Lead
{ id, name, company, title, email, linkedin_url, status, score, source, created_at, notes }

// GET /api/alerts
{ alerts: Alert[], unread: number }

// POST /api/agent/run  →  { run_id, status, input }
// GET  /api/agent/run/:id  →  { run_id, status, steps, output }
```

### Riesgos y mitigaciones

| Riesgo | Mitigación |
|--------|-----------|
| API de LinkedIn bloqueada | Usar scraping ético vía extensión propia; respetar ToS |
| Latencia del agente LangGraph >5s | Streaming SSE + indicador de progreso en UI |
| Costos de inferencia a escala | Cachear respuestas similares con Redis; usar modelos más ligeros |
| Runtime `gpt-5.1-codex-mini` difiere del dev `claude-sonnet-4-6` | Probar prompts en ambos modelos; documentar diferencias |

## Scaffold generado

### Estructura principal
```
src/
├── components/
│   ├── AppShell.jsx           # Envoltura principal: Sidebar + Header + Router
│   ├── Dashboard.jsx          # Panel de control con métricas y acciones rápidas
│   ├── FiltersPanel.jsx       # Componente reutilizable de filtros (search + selects)
│   ├── DataTable.jsx          # Componente reutilizable de tabla (sortable, paginated)
│   ├── layout/
│   │   ├── Sidebar.jsx        # Barra lateral con navegación
│   │   └── Header.jsx         # Encabezado de la página
├── pages/
│   ├── Leads.jsx              # Gestor de leads con FiltersPanel + DataTable
│   ├── Chat.jsx               # Interfaz de chat con extensión
│   ├── Responses.jsx          # Panel de respuestas IA
│   ├── Research.jsx           # Investigación social pre-entrevista
│   ├── Alerts.jsx             # Notificaciones en tiempo real
│   ├── LangGraphAgent.jsx     # Orquestación LangGraph
│   ├── Settings.jsx           # Configuración de API keys
│   └── Dashboard.jsx          # Dashboard alternativo (legacy)
├── hooks/
│   ├── useLeads.js            # GET /api/leads
│   ├── useAlerts.js           # GET /api/alerts + polling
│   ├── useChat.js             # GET/POST /api/leads/:id/messages
│   ├── useResearch.js         # GET /api/leads/:id/research
│   ├── useLangGraph.js        # POST /api/agent/run
│   └── useApiConfig.js        # localStorage: provider, apiKey, model
├── views/
│   ├── LangGraphView.jsx      # Diagrama de flujo + ejecución interactiva
│   └── ApiConfigView.jsx      # Formulario multi-proveedor
├── lib/
│   ├── mock-data.js           # Datos de desarrollo: leads, alerts, research, chat (850 líneas)
│   ├── api-client.js          # Cliente REST tipado
│   ├── constants.js           # Proveedores IA, estados, modelo runtime
│   └── types.js               # Tipos JSDoc
├── data/ (legacy — use lib/mock-data.js instead)
│   ├── mockLeads.js
│   ├── mockAlerts.js
│   └── mockResearch.js
├── styles/
│   └── index.css              # Tema oscuro: variables CSS + clases globales
├── App.jsx                    # Rutas principales + AppShell
└── main.jsx                   # Entry point
```

### Componentes reutilizables

**FiltersPanel** — Filtros dinámicos
- Búsqueda por texto (search)
- Selectores de filtros (dropdown)
- Botones de acción (refresh, clear)
- 3 variantes: FiltersPanel, AdvancedFiltersPanel, QuickFilters

**DataTable** — Tabla flexible
- Sortable columns (click headers)
- Pagination con rows configurable
- Row actions (custom buttons)
- Custom cell rendering
- 3 variantes: DataTable, ExpandableDataTable, CompactDataTable

### Data layer
- **Fuente única de verdad:** `src/lib/mock-data.js` (850 líneas)
- Contiene: mockLeads, mockAlerts, mockResearch, mockChatMessages, mockResponses, mockAgentRuns
- 20+ funciones helper: filterByStatus(), searchLeads(), getAlertsByPriority(), etc.
- Compatible con hooks REST (useLeads, useAlerts, etc.)
