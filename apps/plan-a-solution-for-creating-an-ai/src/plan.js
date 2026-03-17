export const SECTIONS = [
  { id: 'resumen', label: '📋 Resumen' },
  { id: 'arquitectura', label: '🏗️ Arquitectura' },
  { id: 'pantallas', label: '🖥️ Pantallas' },
  { id: 'flujos', label: '🔄 Flujos de Usuario' },
  { id: 'stack', label: '⚙️ Tech Stack' },
  { id: 'datos', label: '📡 Flujo de Datos' },
  { id: 'ia', label: '🤖 Integración IA' },
  { id: 'tiempos', label: '⏱️ Tiempos' },
  { id: 'leads', label: '👥 Leads (Mock)' },
  { id: 'riesgos', label: '⚠️ Riesgos' },
]

export const PLAN = {
  resumen: {
    title: 'Resumen del Proyecto',
    subtitle: 'AI Sales Assistant Agent',
    content: [
      {
        type: 'intro',
        text: 'Este documento presenta el plan de implementación para un agente de ventas basado en IA que integra generación de leads, chat con extensión de navegador, notificaciones inteligentes, e investigación de decisores en redes sociales.',
      },
      {
        type: 'note',
        text: '⚠️ Modelo de runtime por defecto: openai-codex/gpt-5.1-codex-mini — este difiere del modelo de desarrollo. Considerar diferencias de capacidades al diseñar prompts.',
      },
      {
        type: 'cards',
        items: [
          {
            icon: '🎯',
            title: 'Generación de Leads',
            desc: 'Captura leads desde cualquier sitio web a través de una extensión de navegador con chat flotante.',
          },
          {
            icon: '🔔',
            title: 'Notificaciones en Tiempo Real',
            desc: 'Alertas cuando un lead responde, con contexto del historial de conversación.',
          },
          {
            icon: '✍️',
            title: 'Respuestas IA',
            desc: 'Generación de respuestas personalizadas con el LLM elegido por el usuario.',
          },
          {
            icon: '🔍',
            title: 'Investigación Social',
            desc: 'Perfil automático de decisores: intereses, rol, triggers de compra antes de entrevistas.',
          },
          {
            icon: '🔑',
            title: 'Multi-Proveedor IA',
            desc: 'Soporte para Gemini, OpenAI, Claude y Deepseek con configuración de API keys.',
          },
          {
            icon: '📊',
            title: 'Dashboard de Ventas',
            desc: 'Vista unificada de todos los leads, estado, métricas y conversaciones activas.',
          },
        ],
      },
    ],
  },

  arquitectura: {
    title: 'Arquitectura del Sistema',
    content: [
      {
        type: 'diagram',
        title: 'Capas del Sistema',
        layers: [
          {
            name: 'Capa de Presentación',
            color: '#3b82f6',
            items: ['React SPA (Dashboard)', 'Chrome/Firefox Extension (Chat)', 'Notificaciones (SSE)'],
          },
          {
            name: 'Capa de Lógica / API Gateway',
            color: '#8b5cf6',
            items: ['FastAPI REST Backend', 'Auth (JWT)', 'Rate Limiting', 'WebSocket Hub'],
          },
          {
            name: 'Capa de Agentes IA (LangGraph)',
            color: '#10b981',
            items: [
              'Agente de Generación de Respuestas',
              'Agente de Investigación Social',
              'Agente de Análisis de Leads',
              'Router Multi-Proveedor (Gemini / OpenAI / Claude / Deepseek)',
            ],
          },
          {
            name: 'Capa de Datos',
            color: '#f59e0b',
            items: ['PostgreSQL (leads, conversaciones, usuarios)', 'Redis (caché, sesiones, SSE)', 'Object Storage (adjuntos)'],
          },
          {
            name: 'Integraciones Externas',
            color: '#ef4444',
            items: ['LinkedIn API / Scraper', 'Twitter/X API', 'OpenAI API', 'Google Gemini API', 'Anthropic Claude API', 'Deepseek API'],
          },
        ],
      },
      {
        type: 'note',
        text: 'Estrategia de datos: REST con clientes tipados (TypeScript interfaces). El frontend consume endpoints REST; las actualizaciones en tiempo real usan Server-Sent Events (SSE).',
      },
    ],
  },

  pantallas: {
    title: 'Jerarquía de Pantallas',
    content: [
      {
        type: 'tree',
        title: 'Mapa de Navegación',
        nodes: [
          {
            label: '🏠 App Shell (layout con sidebar)',
            children: [
              {
                label: '📊 /dashboard — Panel Principal',
                desc: 'KPIs, leads recientes, conversaciones activas, alertas',
                children: [],
              },
              {
                label: '👥 /leads — Gestión de Leads',
                children: [
                  { label: '/leads (lista) — Tabla filtrable de leads con estado', children: [] },
                  { label: '/leads/:id — Detalle del lead + historial de chat', children: [] },
                  { label: '/leads/:id/reply — Editor de respuesta con sugerencia IA', children: [] },
                ],
              },
              {
                label: '🔔 /notifications — Centro de Notificaciones',
                desc: 'Feed de respuestas de leads, acceso rápido a responder',
                children: [],
              },
              {
                label: '🔍 /research — Investigación Social',
                children: [
                  { label: '/research — Búsqueda de decisor (nombre, empresa)', children: [] },
                  { label: '/research/:id — Perfil: intereses, cargo, triggers de compra, resumen IA', children: [] },
                ],
              },
              {
                label: '⚙️ /settings — Configuración',
                children: [
                  { label: '/settings/api-keys — API Keys (Gemini, OpenAI, Claude, Deepseek)', children: [] },
                  { label: '/settings/agent — Preferencias del agente (tono, idioma, instrucciones)', children: [] },
                  { label: '/settings/notifications — Canales y frecuencia de alertas', children: [] },
                ],
              },
            ],
          },
          {
            label: '🔌 Extensión de Navegador (UI independiente)',
            children: [
              { label: 'Popup flotante — Chat con el lead en página activa', children: [] },
              { label: 'Panel lateral — Historial de conversación + sugerencia de respuesta', children: [] },
              { label: 'Badge de notificaciones — Contador de leads sin responder', children: [] },
            ],
          },
        ],
      },
    ],
  },

  flujos: {
    title: 'Flujos de Usuario Principales',
    content: [
      {
        type: 'flows',
        items: [
          {
            id: 'F1',
            title: 'Generación de Lead desde Extensión',
            color: '#3b82f6',
            steps: [
              'Usuario abre extensión en sitio web del prospecto',
              'Extension detecta datos del sitio (nombre, empresa, URL)',
              'Usuario inicia chat flotante con el prospecto',
              'Conversación se guarda automáticamente como nuevo lead en el backend',
              'Dashboard muestra el nuevo lead con estado "Activo"',
            ],
          },
          {
            id: 'F2',
            title: 'Notificación de Respuesta + Reply IA',
            color: '#10b981',
            steps: [
              'Lead responde al chat (desde extensión o email)',
              'Backend emite evento SSE al dashboard del agente de ventas',
              'Notificación aparece en tiempo real con preview del mensaje',
              'Usuario abre /leads/:id/reply',
              'IA genera sugerencia de respuesta contextualizada',
              'Usuario edita (opcional) y envía la respuesta',
            ],
          },
          {
            id: 'F3',
            title: 'Investigación Pre-Entrevista',
            color: '#8b5cf6',
            steps: [
              'Usuario va a /research y busca nombre + empresa del decisor',
              'Agente LangGraph inicia investigación en LinkedIn, Twitter/X, web pública',
              'Se genera perfil: cargo actual, intereses, historial profesional',
              'IA identifica posibles triggers de compra y pain points',
              'Usuario descarga o copia resumen antes de la entrevista/demo',
            ],
          },
          {
            id: 'F4',
            title: 'Configuración de API Keys',
            color: '#f59e0b',
            steps: [
              'Usuario va a /settings/api-keys',
              'Selecciona proveedor (Gemini, OpenAI, Claude, Deepseek)',
              'Ingresa API key (se cifra en frontend antes de enviar)',
              'Sistema valida la key realizando una llamada de prueba',
              'Proveedor queda disponible para selección en respuestas IA',
            ],
          },
        ],
      },
    ],
  },

  stack: {
    title: 'Stack Tecnológico',
    content: [
      {
        type: 'stack_table',
        categories: [
          {
            name: 'Frontend (Dashboard)',
            color: '#3b82f6',
            items: [
              { tech: 'React 18 + Vite', role: 'UI framework y build tool' },
              { tech: 'TanStack Query v5', role: 'Fetching REST, caché, estado de servidor' },
              { tech: 'Zustand', role: 'Estado global ligero (sesión, API keys activas)' },
              { tech: 'React Router v6', role: 'Navegación SPA' },
              { tech: 'TypeScript', role: 'Tipos para clientes REST' },
              { tech: 'Tailwind CSS', role: 'Estilos utilitarios' },
            ],
          },
          {
            name: 'Extensión de Navegador',
            color: '#8b5cf6',
            items: [
              { tech: 'Plasmo Framework', role: 'Scaffolding MV3 (Chrome + Firefox)' },
              { tech: 'React + TypeScript', role: 'UI del popup y panel lateral' },
              { tech: 'Messaging API (MV3)', role: 'Comunicación background ↔ content script' },
            ],
          },
          {
            name: 'Backend',
            color: '#10b981',
            items: [
              { tech: 'FastAPI (Python)', role: 'REST API, auth JWT, SSE' },
              { tech: 'LangGraph', role: 'Orquestación de agentes IA' },
              { tech: 'SQLAlchemy + Alembic', role: 'ORM y migraciones' },
              { tech: 'Celery + Redis', role: 'Tareas asíncronas y caché' },
            ],
          },
          {
            name: 'Base de Datos',
            color: '#f59e0b',
            items: [
              { tech: 'PostgreSQL 16', role: 'Datos estructurados (leads, chats, usuarios)' },
              { tech: 'Redis 7', role: 'Caché, sesiones SSE, rate limiting' },
            ],
          },
          {
            name: 'IA / LLMs',
            color: '#ef4444',
            items: [
              { tech: 'openai-codex / gpt-5.1-codex-mini', role: '⚠️ Modelo por defecto en RUNTIME' },
              { tech: 'OpenAI API', role: 'GPT-4o, o3 — configurable por usuario' },
              { tech: 'Google Gemini API', role: 'Gemini 2.0 Flash — configurable' },
              { tech: 'Anthropic Claude API', role: 'Claude Sonnet 4.6 — configurable' },
              { tech: 'Deepseek API', role: 'Deepseek-V3 — configurable' },
            ],
          },
          {
            name: 'DevOps',
            color: '#6b7280',
            items: [
              { tech: 'Docker + Docker Compose', role: 'Contenedores locales y producción' },
              { tech: 'Coolify', role: 'Deployment provider (UI Factory)' },
              { tech: 'GitHub Actions', role: 'CI/CD — lint, test, build, deploy' },
            ],
          },
        ],
      },
    ],
  },

  datos: {
    title: 'Flujo de Datos',
    content: [
      {
        type: 'note',
        text: 'Modo: REST API con clientes tipados (TypeScript). Todo el frontend consume endpoints REST; SSE para actualizaciones en tiempo real.',
      },
      {
        type: 'data_flows',
        items: [
          {
            title: 'Leads',
            endpoints: [
              { method: 'GET', path: '/api/leads', desc: 'Listar leads con filtros y paginación' },
              { method: 'GET', path: '/api/leads/:id', desc: 'Detalle del lead + historial de mensajes' },
              { method: 'POST', path: '/api/leads', desc: 'Crear lead (desde extensión)' },
              { method: 'PATCH', path: '/api/leads/:id', desc: 'Actualizar estado / notas' },
            ],
          },
          {
            title: 'Mensajes / Chat',
            endpoints: [
              { method: 'GET', path: '/api/leads/:id/messages', desc: 'Historial de conversación' },
              { method: 'POST', path: '/api/leads/:id/messages', desc: 'Enviar mensaje' },
              { method: 'POST', path: '/api/leads/:id/suggest', desc: 'Solicitar sugerencia IA para responder' },
            ],
          },
          {
            title: 'Investigación Social',
            endpoints: [
              { method: 'POST', path: '/api/research/start', desc: 'Iniciar investigación de decisor (async)' },
              { method: 'GET', path: '/api/research/:jobId', desc: 'Obtener resultado del perfil' },
            ],
          },
          {
            title: 'Notificaciones',
            endpoints: [
              { method: 'GET', path: '/api/notifications/stream', desc: 'SSE stream de eventos en tiempo real' },
              { method: 'PATCH', path: '/api/notifications/:id/read', desc: 'Marcar como leída' },
            ],
          },
          {
            title: 'Configuración',
            endpoints: [
              { method: 'GET', path: '/api/settings/providers', desc: 'Listar proveedores IA configurados' },
              { method: 'PUT', path: '/api/settings/providers/:provider', desc: 'Guardar / actualizar API key' },
              { method: 'POST', path: '/api/settings/providers/:provider/test', desc: 'Validar API key' },
            ],
          },
        ],
      },
    ],
  },

  ia: {
    title: 'Integración Multi-Proveedor IA',
    content: [
      {
        type: 'note',
        text: '⚠️ El modelo de runtime por defecto es openai-codex/gpt-5.1-codex-mini — difiere del modelo de desarrollo. Diseñar prompts que funcionen con modelos de capacidades variables.',
      },
      {
        type: 'providers',
        items: [
          {
            name: 'OpenAI',
            logo: '🟢',
            models: ['gpt-5.1-codex-mini (runtime default)', 'gpt-4o', 'o3-mini'],
            use: 'Respuestas de ventas, análisis de leads',
            key_env: 'OPENAI_API_KEY',
          },
          {
            name: 'Google Gemini',
            logo: '🔵',
            models: ['gemini-2.0-flash', 'gemini-2.0-pro'],
            use: 'Investigación social, resúmenes de perfil',
            key_env: 'GEMINI_API_KEY',
          },
          {
            name: 'Anthropic Claude',
            logo: '🟣',
            models: ['claude-sonnet-4-6', 'claude-haiku-4-5'],
            use: 'Redacción de respuestas de alta calidad',
            key_env: 'ANTHROPIC_API_KEY',
          },
          {
            name: 'Deepseek',
            logo: '🟡',
            models: ['deepseek-v3', 'deepseek-r1'],
            use: 'Alternativa costo-eficiente',
            key_env: 'DEEPSEEK_API_KEY',
          },
        ],
      },
      {
        type: 'subsection',
        title: 'Router de Proveedores (LangGraph)',
        items: [
          'El backend usa un nodo de routing en LangGraph que selecciona el proveedor según la preferencia del usuario.',
          'Si la key del proveedor preferido falla, hace fallback al siguiente disponible.',
          'Las API keys se cifran con AES-256 antes de guardarse en PostgreSQL.',
          'Nunca se envían keys al frontend; el frontend solo conoce el proveedor activo.',
        ],
      },
    ],
  },

  tiempos: {
    title: 'Tiempos Estimados de Implementación',
    content: [
      {
        type: 'timeline',
        total: '~7–8 semanas',
        phases: [
          {
            phase: 'Fase 1',
            name: 'Base + Dashboard',
            duration: '1 semana',
            color: '#3b82f6',
            tasks: [
              'Setup repo monorepo (frontend + backend)',
              'Auth JWT + login screen',
              'Layout principal con sidebar',
              'Dashboard con KPIs mock',
              'Tipos REST TypeScript (leads, messages)',
            ],
          },
          {
            phase: 'Fase 2',
            name: 'Extensión de Navegador + Chat',
            duration: '2 semanas',
            color: '#8b5cf6',
            tasks: [
              'Setup Plasmo (MV3)',
              'Popup flotante con UI de chat',
              'Content script para captura de datos del sitio',
              'Integración con API de backend (crear lead, enviar mensaje)',
              'Badge de notificaciones',
            ],
          },
          {
            phase: 'Fase 3',
            name: 'Notificaciones en Tiempo Real',
            duration: '1 semana',
            color: '#10b981',
            tasks: [
              'SSE endpoint en FastAPI',
              'Hook useSSE en React',
              '/notifications screen',
              'Toast notifications',
              'Sincronización estado leads tras respuesta',
            ],
          },
          {
            phase: 'Fase 4',
            name: 'Investigación Social (LangGraph)',
            duration: '1.5 semanas',
            color: '#f59e0b',
            tasks: [
              'Agente LangGraph de búsqueda (LinkedIn, web)',
              '/research screen (búsqueda + perfil)',
              'UI de perfil de decisor: intereses, triggers, resumen',
              'Export a PDF / copiar al portapapeles',
            ],
          },
          {
            phase: 'Fase 5',
            name: 'Integración IA Multi-Proveedor',
            duration: '1 semana',
            color: '#ef4444',
            tasks: [
              '/settings/api-keys screen (4 proveedores)',
              'Router LangGraph con fallback',
              'Sugerencias de respuesta en /leads/:id/reply',
              'Validación y cifrado de API keys',
            ],
          },
          {
            phase: 'Fase 6',
            name: 'QA, Pulido y Deploy',
            duration: '1 semana',
            color: '#6b7280',
            tasks: [
              'Tests E2E (Playwright)',
              'Ajuste de prompts para gpt-5.1-codex-mini',
              'Docker Compose producción',
              'CI/CD GitHub Actions',
              'Deploy en Coolify',
            ],
          },
        ],
      },
    ],
  },

  leads: {
    title: 'Leads — Datos Mock e Interactivos',
    subtitle: 'Demo del contrato REST con clientes tipados, filtros, estado y drill-down',
    content: [
      { type: 'leads_table' },
    ],
  },

  riesgos: {
    title: 'Riesgos y Mitigaciones',
    content: [
      {
        type: 'risks',
        items: [
          {
            level: 'Alto',
            color: '#ef4444',
            risk: 'Limitaciones de LinkedIn API',
            desc: 'LinkedIn restringe el scraping y su API oficial tiene acceso limitado.',
            mitigation: 'Usar proxies rotativos + rate limiting conservador. Tener alternativa con búsqueda web pública (SerpAPI).',
          },
          {
            level: 'Alto',
            color: '#ef4444',
            risk: 'Diferencia de capacidades: runtime vs desarrollo',
            desc: 'gpt-5.1-codex-mini (runtime) puede tener comportamientos diferentes a modelos de desarrollo.',
            mitigation: 'Probar todos los prompts explícitamente contra gpt-5.1-codex-mini. Diseñar prompts simples y directos.',
          },
          {
            level: 'Medio',
            color: '#f59e0b',
            risk: 'Seguridad de API Keys del usuario',
            desc: 'Almacenar keys de terceros implica responsabilidad de seguridad.',
            mitigation: 'Cifrado AES-256 en reposo. Keys nunca en logs ni en frontend. Opción de key de sesión (no persistida).',
          },
          {
            level: 'Medio',
            color: '#f59e0b',
            risk: 'Compatibilidad cross-browser de la extensión',
            desc: 'Chrome MV3 y Firefox tienen diferencias en APIs de background.',
            mitigation: 'Plasmo abstrae la mayoría. Pruebas en ambos navegadores en Fase 2.',
          },
          {
            level: 'Bajo',
            color: '#10b981',
            risk: 'Latencia en investigación social',
            desc: 'El agente puede tardar 10–30s en generar el perfil.',
            mitigation: 'UI con estado de carga progresivo. Polling del endpoint de resultado cada 2s.',
          },
          {
            level: 'Bajo',
            color: '#10b981',
            risk: 'Costos de APIs de IA',
            desc: 'Uso intensivo puede generar costos inesperados.',
            mitigation: 'Rate limiting por usuario. Dashboard de uso de tokens en /settings.',
          },
        ],
      },
    ],
  },
}
