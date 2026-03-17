# Plan de Implementación: AI Sales Assistant Agent

> **Modelo de ejecución por defecto:** `openai-codex/gpt-5.1-codex-mini`
> Nota: El runtime usa este modelo por defecto, que difiere del modelo de diseño. Para Claude usa `claude-sonnet-4-6`, para Gemini `gemini-2.0-flash`, para Deepseek `deepseek-chat`.

---

## 1. Objetivo

Construir un asistente de ventas con IA que:
- Genera leads via chat en extensión de navegador
- Notifica cuando leads responden
- Redacta respuestas con IA
- Investiga tomadores de decisiones en redes sociales antes de entrevistas
- Permite configurar API keys para Gemini, OpenAI, Claude y Deepseek

---

## 2. Arquitectura General

```
┌──────────────────────────────────────────────────────┐
│                  React SPA (Vite)                      │
│  ┌──────────┐ ┌──────────┐ ┌──────────┐ ┌─────────┐ │
│  │  Leads   │ │  Alerts  │ │ Research │ │ API Keys│ │
│  │  Panel   │ │  Panel   │ │  Panel   │ │  Config │ │
│  └────┬─────┘ └────┬─────┘ └────┬─────┘ └────┬────┘ │
│       └─────────────┴─────────────┴────────────┘      │
│                     AppContext                          │
│              useLeads | useAI | useAlerts               │
│                    REST API Client                      │
└──────────────────────────────────────────────────────┘
         │                          │
┌────────┴──────┐          ┌────────┴──────────┐
│  Backend API  │          │  AI Provider APIs  │
│  (REST/typed) │          │  OpenAI/Claude/    │
│  /leads       │          │  Gemini/Deepseek   │
│  /alerts      │          └────────────────────┘
│  /research    │
└───────────────┘
```

---

## 3. Stack Tecnológico

| Capa | Tecnología | Justificación |
|------|-----------|---------------|
| UI Framework | React 18 + Vite | Ya en el template, hot-reload rápido |
| Routing | React Router DOM v6 | SPA multi-sección |
| Data Fetching | TanStack Query v5 | Cache, loading states, refetch automático |
| Icons | Lucide React | Lightweight, tree-shakeable |
| Estilos | CSS Modules + variables | Sin dependencias extra de build |
| AI Providers | Fetch directo a APIs | Máxima flexibilidad con múltiples providers |
| Estado Global | React Context + useReducer | Sin Redux overhead para este tamaño |

---

## 4. Estructura de Archivos

```
src/
├── main.jsx                     # Entry point
├── App.jsx                      # Router + layout raíz
├── index.css                    # Variables CSS y reset global
├── context/
│   └── AppContext.jsx            # Estado global: provider activo, leads, alertas
├── api/
│   ├── client.js                # fetch wrapper con baseURL y headers tipados
│   ├── leads.js                 # GET/POST /leads, typed responses
│   ├── alerts.js                # GET /alerts, PATCH /alerts/:id/read
│   └── ai.js                    # POST a provider según config activa
├── hooks/
│   ├── useLeads.js              # useQuery + useMutation para leads
│   ├── useAlerts.js             # useQuery para alertas, polling 30s
│   ├── useSocialResearch.js     # búsqueda de perfil + triggers de compra
│   └── useAIProvider.js         # gestiona proveedor activo + validación key
├── components/
│   ├── Layout/
│   │   ├── Sidebar.jsx          # Navegación lateral
│   │   └── Layout.jsx           # Shell con sidebar + contenido
│   ├── LeadsPanel/
│   │   ├── index.jsx            # Lista de leads + filtros
│   │   ├── LeadCard.jsx         # Tarjeta individual de lead
│   │   └── ExtensionChat.jsx    # Interfaz de chat (integra con extensión)
│   ├── AlertsPanel/
│   │   ├── index.jsx            # Lista de alertas de respuesta
│   │   └── AlertItem.jsx        # Ítem individual con badge
│   ├── SocialResearch/
│   │   ├── index.jsx            # Búsqueda de perfil + resultados
│   │   ├── ProfileCard.jsx      # Perfil del tomador de decisiones
│   │   └── BuyingTriggers.jsx   # Triggers de compra detectados
│   ├── AIReplyComposer/
│   │   ├── index.jsx            # Generador de respuestas con IA
│   │   └── ReplyPreview.jsx     # Preview editable antes de enviar
│   └── ApiKeyConfig/
│       ├── index.jsx            # Sección de configuración de APIs
│       └── ProviderCard.jsx     # Tarjeta por proveedor con input enmascarado
└── utils/
    └── providers.js             # Constantes y config de providers (Gemini/OpenAI/Claude/Deepseek)
```

---

## 5. Flujo de Datos

```
[Browser Extension] → POST /leads → useLeads hook → LeadsPanel
                                          ↓
[Lead responde] → Backend detecta → GET /alerts (polling 30s) → AlertsPanel
                                          ↓
[Usuario abre alert] → AIReplyComposer → POST a AI Provider API
                                          ↓
                    [Usuario acepta reply] → PATCH /leads/:id/messages
```

**Investigación Social:**
```
[SocialResearch] → POST /research { linkedin_url | name + company }
                          ↓
              { profile, interests, buying_triggers }
                          ↓
                    ProfileCard + BuyingTriggers
```

---

## 6. Componentes Clave — Detalle

### 6.1 ApiKeyConfig
- Input `type="password"` por proveedor (enmascarado)
- Persistencia en `localStorage` (nunca se envía al backend)
- Validación de formato: OpenAI (`sk-...`), Anthropic (`sk-ant-...`), Google (`AIza...`)
- Toggle de proveedor activo con indicador visual

### 6.2 ExtensionChat
- Iframe o postMessage bridge con la extensión de Chrome
- Cola de mensajes entrantes con timestamp
- Botón "Generar respuesta con IA" que abre AIReplyComposer

### 6.3 AIReplyComposer
- Selecciona provider activo del AppContext
- Prompt system configurable por usuario
- Streaming de respuesta si el provider lo soporta (OpenAI, Claude, Gemini)
- ReplyPreview editable antes de confirmar envío

### 6.4 SocialResearch
- Input de URL de LinkedIn o nombre + empresa
- Resultados: resumen de perfil, intereses, rol, señales de compra
- Exportable como nota adjunta al lead

---

## 7. Estrategia de Build

### Fase 1 — Scaffold base (½ día)
- [ ] Actualizar `package.json` con deps
- [ ] Crear `src/index.css` con variables
- [ ] Crear `App.jsx` con React Router
- [ ] Crear `AppContext.jsx`
- [ ] Crear `Layout` + `Sidebar`

### Fase 2 — API Client y Hooks (½ día)
- [ ] `api/client.js` — fetch wrapper tipado
- [ ] `api/leads.js`, `api/alerts.js`, `api/ai.js`
- [ ] `hooks/useLeads.js`, `hooks/useAlerts.js`
- [ ] `hooks/useAIProvider.js`

### Fase 3 — Componentes de datos (1 día)
- [ ] `LeadsPanel` con `LeadCard`
- [ ] `AlertsPanel` con badge de no leídas
- [ ] `ApiKeyConfig` con `ProviderCard` para los 4 providers

### Fase 4 — IA y Research (1 día)
- [ ] `AIReplyComposer` con streaming
- [ ] `SocialResearch` + `ProfileCard` + `BuyingTriggers`
- [ ] `ExtensionChat` con postMessage bridge

### Fase 5 — QA y despliegue (½ día)
- [ ] Validación E2E de flujos principales
- [ ] Build de producción (`vite build`)
- [ ] Push → Coolify autodeploy

**Total estimado: ~3 días de desarrollo**

---

## 8. Validación

| Check | Herramienta | Criterio de éxito |
|-------|------------|-------------------|
| Build | `npm run build` | 0 errores, warnings solo en deps externas |
| Types | JSDoc + runtime checks | Sin `undefined` en props críticas |
| API keys | Validación de formato | Rechazo inmediato de keys mal formadas |
| Alertas | Polling test manual | Notificación en <30s de respuesta del lead |
| AI reply | Test con cada provider | Respuesta coherente con contexto del lead |
| Extensión | Test con extensión dummy | postMessage recibido y mostrado |

---

## 9. Notas de Despliegue

- **Autodeploy:** `deploy.meta.yaml` tiene `autodeploy: true` — cada push a `main` despliega
- **Dominio:** `plan-a-solution-for-creating-an-ai.apps.uniflexa.cloud`
- **Variables de entorno:** `VITE_API_BASE_URL` para apuntar al backend REST
- **API Keys:** Se guardan en localStorage del usuario, **nunca** en el servidor ni en env vars
- **CORS:** El backend debe permitir el dominio de la app en producción
- **Extensión:** La extensión de Chrome debe declarar `externally_connectable` para el dominio de la app

---

## 10. Riesgos

| Riesgo | Probabilidad | Impacto | Mitigación |
|--------|-------------|---------|-----------|
| CORS entre extensión y app | Alta | Alto | Configurar `externally_connectable` en manifest.json de la extensión |
| Rate limiting de AI providers | Media | Medio | Implementar retry con backoff exponencial en `api/ai.js` |
| Keys en localStorage vulnerables a XSS | Media | Alto | Sanitizar todo input, CSP headers en el servidor |
| Latencia de investigación social | Alta | Medio | Caché en AppContext, spinners en UI, timeout de 10s |
| Extensión no instalada | Alta | Medio | Fallback: mostrar instrucciones de instalación |
| Modelo por defecto (gpt-5.1-codex-mini) sin clave | Alta | Alto | Validar key presente antes de cualquier llamada AI, redirigir a ApiKeyConfig |

---

## 11. Providers AI — Configuración

```javascript
// src/utils/providers.js
export const AI_PROVIDERS = {
  openai: {
    name: 'OpenAI',
    model: 'gpt-5.1-codex-mini', // modelo runtime por defecto
    endpoint: 'https://api.openai.com/v1/chat/completions',
    keyPrefix: 'sk-',
    keyPlaceholder: 'sk-...',
  },
  claude: {
    name: 'Claude (Anthropic)',
    model: 'claude-sonnet-4-6',
    endpoint: 'https://api.anthropic.com/v1/messages',
    keyPrefix: 'sk-ant-',
    keyPlaceholder: 'sk-ant-...',
  },
  gemini: {
    name: 'Google Gemini',
    model: 'gemini-2.0-flash',
    endpoint: 'https://generativelanguage.googleapis.com/v1beta/models',
    keyPrefix: 'AIza',
    keyPlaceholder: 'AIza...',
  },
  deepseek: {
    name: 'Deepseek',
    model: 'deepseek-chat',
    endpoint: 'https://api.deepseek.com/v1/chat/completions',
    keyPrefix: 'sk-',
    keyPlaceholder: 'sk-...',
  },
}
```
