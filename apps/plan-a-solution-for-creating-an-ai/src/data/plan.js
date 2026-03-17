export const NAV_SECTIONS = [
  { id: 'resumen',       label: 'Resumen Ejecutivo',       icon: '📋' },
  { id: 'arquitectura',  label: 'Arquitectura del Sistema', icon: '🏗️' },
  { id: 'pantallas',     label: 'Pantallas & Navegación',  icon: '🖥️' },
  { id: 'flujos',        label: 'Flujos de Usuario',        icon: '🔄' },
  { id: 'stack',         label: 'Stack Tecnológico',        icon: '⚙️' },
  { id: 'api-config',    label: 'Configuración de APIs',   icon: '🔑' },
  { id: 'cronograma',    label: 'Cronograma',              icon: '📅' },
  { id: 'riesgos',       label: 'Riesgos & Mitigación',   icon: '⚠️' },
]

export const OVERVIEW = {
  title: 'AI Sales Assistant Agent',
  subtitle: 'Agente inteligente de ventas con extensión de navegador, investigación social y generación de leads',
  model_note: '⚠️ Modelo de runtime predeterminado: openai-codex / gpt-5.1-codex-mini (difiere del modelo de ejecución actual claude-sonnet-4-6)',
  description: `Este plan describe la arquitectura e implementación de un asistente de ventas basado en IA que opera
a través de una extensión de navegador con chat integrado. El sistema permite generar leads, recibir notificaciones
cuando un lead responde, componer respuestas asistidas por IA, e investigar perfiles de decisores en redes sociales
antes de entrevistas. Incluye una sección para conectar claves API de múltiples proveedores de IA (Gemini, OpenAI, Claude, Deepseek).`,
  highlights: [
    { label: 'Extensión de Chat', desc: 'Chrome/Firefox con Manifest V3 para captación de leads en tiempo real' },
    { label: 'Notificaciones', desc: 'Alertas push cuando un lead responde (WebSocket + Service Worker)' },
    { label: 'Compositor IA', desc: 'Sugerencias de respuesta generadas por el modelo configurado' },
    { label: 'Investigación Social', desc: 'Perfil automático de decisores: intereses, cargo, disparadores de compra' },
    { label: 'Multi-modelo', desc: 'Soporte para Gemini, OpenAI (gpt-5.1-codex-mini), Claude, Deepseek' },
    { label: 'Dashboard de Leads', desc: 'Gestión centralizada con estados, historial y métricas' },
  ],
}

export const ARCHITECTURE = {
  layers: [
    {
      name: 'Capa de Presentación',
      color: '#3b82f6',
      items: [
        'React Dashboard (Next.js 14) — gestión de leads, configuración, reportes',
        'Chrome Extension (Manifest V3) — chat embebido en páginas de LinkedIn/web',
        'Panel de Notificaciones — bandeja de respuestas y alertas',
      ],
    },
    {
      name: 'Capa de Orquestación IA (LangGraph)',
      color: '#8b5cf6',
      items: [
        'Agente de generación de leads — extrae contexto y califica prospectos',
        'Agente de investigación social — busca y resume perfiles de decisores',
        'Agente compositor — genera respuestas personalizadas con historial de conversación',
        'Router de modelos — selecciona Gemini / OpenAI / Claude / Deepseek según config',
      ],
    },
    {
      name: 'Capa de Backend (FastAPI)',
      color: '#10b981',
      items: [
        'REST API tipada — endpoints para leads, conversaciones, perfiles, config',
        'WebSocket server — notificaciones en tiempo real',
        'Cola de tareas (Celery + Redis) — procesamiento asíncrono de investigaciones',
        'Gestor de API keys — almacenamiento seguro cifrado de credenciales IA',
      ],
    },
    {
      name: 'Capa de Datos',
      color: '#f59e0b',
      items: [
        'PostgreSQL — leads, conversaciones, perfiles, config de usuario',
        'Redis — sesiones, caché de perfiles sociales, colas de trabajo',
        'Vector DB (pgvector) — embeddings para búsqueda semántica de leads similares',
      ],
    },
    {
      name: 'Servicios Externos',
      color: '#ef4444',
      items: [
        'LinkedIn API / scraping controlado — datos de decisores',
        'Twitter/X API — actividad reciente y tendencias del prospecto',
        'OpenAI / Gemini / Claude / Deepseek — inferencia de IA',
        'Push Notifications (FCM/VAPID) — alertas de respuesta',
      ],
    },
  ],
  dataFlow: [
    'Extensión captura contexto de página → envía al backend via REST',
    'Backend encola tarea de calificación → agente LangGraph procesa',
    'Agente consulta modelo IA configurado (router) → genera respuesta sugerida',
    'Si lead responde → webhook/polling → WebSocket notifica al usuario',
    'Pre-entrevista: usuario solicita perfil → agente investiga redes → resumen estructurado',
    'Usuario confirma respuesta → extensión la envía en el chat original',
  ],
}

export const SCREENS = [
  {
    id: 'dashboard',
    title: '1. Dashboard de Leads',
    path: '/',
    description: 'Vista principal. Lista paginada de leads con filtros por estado, fuente y score.',
    children: [
      { name: 'Tabla de Leads', desc: 'Columnas: nombre, empresa, estado (nuevo/contactado/respondió/calificado/cerrado), score IA, última actividad' },
      { name: 'Panel de Filtros', desc: 'Por estado, fuente (LinkedIn/web/manual), rango de fecha, puntuación IA' },
      { name: 'Métricas rápidas', desc: '4 cards: total leads, respondieron hoy, tasa de respuesta, leads calificados' },
      { name: 'Botón "Investigar"', desc: 'Por cada lead → abre modal de investigación social' },
    ],
  },
  {
    id: 'chat-extension',
    title: '2. Panel de la Extensión',
    path: '/extension',
    description: 'Gestión y configuración de la extensión de navegador. Vista de conversaciones activas capturadas.',
    children: [
      { name: 'Lista de conversaciones', desc: 'Capturadas por la extensión, agrupadas por plataforma (LinkedIn, correo, web)' },
      { name: 'Visor de chat', desc: 'Historial de mensajes con el lead + sugerencias IA en sidebar derecho' },
      { name: 'Compositor IA', desc: 'Textarea con botón "Generar respuesta" → muestra 3 variantes, user selecciona o edita' },
      { name: 'Estado de extensión', desc: 'Badge: instalada / no instalada / actualización disponible' },
    ],
  },
  {
    id: 'notifications',
    title: '3. Bandeja de Notificaciones',
    path: '/notificaciones',
    description: 'Centro de alertas: leads que respondieron, tareas pendientes, investigaciones listas.',
    children: [
      { name: 'Feed de alertas', desc: 'Tiempo real (WebSocket). Tipos: "Lead respondió", "Investigación lista", "Calificación actualizada"' },
      { name: 'Acciones rápidas', desc: 'Desde cada notificación: ver conversación, responder, investigar, descartar' },
      { name: 'Filtros', desc: 'Por tipo, leídas/no leídas, rango de fecha' },
    ],
  },
  {
    id: 'research',
    title: '4. Investigación Social',
    path: '/investigacion/:leadId',
    description: 'Perfil completo del decisor antes de entrevistas. Generado automáticamente por agente IA.',
    children: [
      { name: 'Perfil del decisor', desc: 'Foto, cargo, empresa, trayectoria profesional (de LinkedIn/web)' },
      { name: 'Intereses & actividad', desc: 'Posts recientes, temas que comenta, grupos en los que participa' },
      { name: 'Disparadores de compra', desc: 'IA identifica: cambios de cargo recientes, expansiones de empresa, dolor mencionado en posts' },
      { name: 'Perfil ideal de compra', desc: 'Score de fit con ICP (Ideal Customer Profile) definido por el usuario' },
      { name: 'Puntos de conexión', desc: 'Sugerencias de conversación: intereses comunes, contexto de la empresa, eventos recientes' },
    ],
  },
  {
    id: 'api-config',
    title: '5. Configuración de APIs',
    path: '/configuracion/apis',
    description: 'Sección para ingresar y gestionar claves de API de proveedores IA.',
    children: [
      { name: 'Tarjeta Gemini (Google)', desc: 'Input de API key + selector de modelo (gemini-1.5-pro, gemini-flash)' },
      { name: 'Tarjeta OpenAI', desc: 'Input de API key + selector: gpt-5.1-codex-mini (default runtime), gpt-4o, codex' },
      { name: 'Tarjeta Claude (Anthropic)', desc: 'Input de API key + selector: claude-opus-4-6, claude-sonnet-4-6, claude-haiku-4-5' },
      { name: 'Tarjeta Deepseek', desc: 'Input de API key + selector de modelo' },
      { name: 'Modelo activo', desc: 'Selector global del modelo que usará el agente por defecto. Default: openai-codex/gpt-5.1-codex-mini' },
      { name: 'Test de conexión', desc: 'Botón "Probar" por cada proveedor — valida la key con llamada mínima' },
    ],
  },
  {
    id: 'settings',
    title: '6. Configuración General',
    path: '/configuracion',
    description: 'ICP, preferencias de notificación, gestión de equipo.',
    children: [
      { name: 'Ideal Customer Profile (ICP)', desc: 'Define industria, tamaño empresa, cargo del decisor, criterios de calificación' },
      { name: 'Notificaciones', desc: 'Email / push / in-app — frecuencia y tipos de alerta' },
      { name: 'Plantillas de mensajes', desc: 'Mensajes base que usa la IA para personalizar respuestas' },
    ],
  },
]

export const USER_FLOWS = [
  {
    title: 'Flujo 1: Generación y seguimiento de lead',
    color: '#3b82f6',
    steps: [
      'Usuario visita perfil de LinkedIn con la extensión activa',
      'Extensión detecta el perfil → muestra botón "Agregar como lead"',
      'Usuario hace clic → backend crea lead y encola calificación IA',
      'Agente LangGraph califica el lead (score 0-100) y sugiere primer mensaje',
      'Usuario envía mensaje desde el chat de la extensión',
      'Lead responde → webhook captura respuesta → WebSocket notifica al usuario',
      'Notificación push: "Juan Pérez respondió tu mensaje"',
      'Usuario abre bandeja, ve contexto, solicita respuesta IA',
      'Compositor genera 3 variantes → usuario elige y envía',
    ],
  },
  {
    title: 'Flujo 2: Investigación pre-entrevista',
    color: '#8b5cf6',
    steps: [
      'Lead calificado agenda entrevista (detectado manualmente o por integración de calendario)',
      'Usuario abre ficha del lead → clic en "Investigar antes de entrevista"',
      'Agente de investigación lanza búsqueda en LinkedIn, Twitter/X y web',
      'Celery worker procesa en segundo plano (1-3 min)',
      'Notificación: "Perfil de Juan Pérez listo"',
      'Usuario lee: intereses, posts recientes, cambios de carrera, disparadores de compra',
      'IA sugiere 5 temas de conversación relevantes para el encuentro',
      'Usuario entra a la entrevista con contexto completo del decisor',
    ],
  },
  {
    title: 'Flujo 3: Configuración de modelo IA',
    color: '#10b981',
    steps: [
      'Usuario va a Configuración → APIs',
      'Ingresa API key de OpenAI (default: gpt-5.1-codex-mini)',
      'Hace clic en "Probar" → sistema valida la key',
      'Opcionalmente agrega Gemini, Claude o Deepseek como alternativas',
      'Selecciona el modelo activo global desde el selector principal',
      'Todas las llamadas del agente usan el modelo seleccionado',
      'Puede cambiar el modelo por conversación individual en el visor de chat',
    ],
  },
]

export const TECH_STACK = [
  {
    category: 'Frontend Dashboard',
    color: '#3b82f6',
    items: [
      { name: 'Next.js 14 (App Router)', reason: 'SSR para SEO, layouts anidados, caching de datos' },
      { name: 'React 18 + TypeScript', reason: 'Tipado estricto para clientes REST generados' },
      { name: 'Tailwind CSS + shadcn/ui', reason: 'Componentes accesibles, diseño consistente' },
      { name: 'React Query (TanStack)', reason: 'Caché, polling automático para notificaciones, typed REST hooks' },
      { name: 'Zustand', reason: 'Estado global liviano (modelo activo, user session)' },
      { name: 'Recharts', reason: 'Gráficos de leads, tasas de respuesta' },
    ],
  },
  {
    category: 'Extensión de Navegador',
    color: '#f59e0b',
    items: [
      { name: 'Chrome Extension Manifest V3', reason: 'Compatible con Chrome y Edge. Firefox con MV3 polyfill' },
      { name: 'React + Vite (popup)', reason: 'UI del popup y sidebar de la extensión' },
      { name: 'Background Service Worker', reason: 'Polling de notificaciones, inyección de content scripts' },
      { name: 'Content Scripts', reason: 'Detecta perfiles de LinkedIn, inyecta chat bubble' },
    ],
  },
  {
    category: 'Backend',
    color: '#10b981',
    items: [
      { name: 'FastAPI (Python 3.12)', reason: 'REST tipado, generación automática de OpenAPI, async nativo' },
      { name: 'LangGraph', reason: 'Orquestación de agentes IA con estado, retries, supervisión' },
      { name: 'Celery + Redis', reason: 'Cola de tareas para investigación social asíncrona' },
      { name: 'WebSocket (FastAPI WS)', reason: 'Notificaciones en tiempo real al dashboard' },
      { name: 'SQLAlchemy + Alembic', reason: 'ORM tipado + migraciones de base de datos' },
    ],
  },
  {
    category: 'Base de Datos',
    color: '#8b5cf6',
    items: [
      { name: 'PostgreSQL 16 + pgvector', reason: 'Almacén principal + búsqueda semántica de leads' },
      { name: 'Redis 7', reason: 'Sesiones, caché de perfiles, broker de Celery' },
    ],
  },
  {
    category: 'IA & Modelos',
    color: '#ef4444',
    items: [
      { name: 'openai-codex / gpt-5.1-codex-mini', reason: '⚠️ Modelo runtime predeterminado del sistema' },
      { name: 'LangChain / LangGraph', reason: 'Abstracción de llamadas a múltiples proveedores' },
      { name: 'Gemini 1.5 Pro / Flash', reason: 'Alternativa Google de alto contexto' },
      { name: 'Claude Opus/Sonnet 4.6', reason: 'Alternativa Anthropic para razonamiento complejo' },
      { name: 'Deepseek V3', reason: 'Alternativa open-source económica' },
    ],
  },
  {
    category: 'Infraestructura',
    color: '#6b7280',
    items: [
      { name: 'Coolify (self-hosted)', reason: 'Despliegue en uniflexa.cloud, CI/CD automático desde repo' },
      { name: 'Docker Compose', reason: 'Orquestación local y producción: app + db + redis + worker' },
      { name: 'GitHub Actions', reason: 'Tests, lint, build y push a Coolify' },
    ],
  },
]

export const API_PROVIDERS = [
  {
    name: 'OpenAI',
    logo: '🟢',
    default: true,
    models: ['gpt-5.1-codex-mini (runtime default)', 'gpt-4o', 'gpt-4o-mini', 'o1-preview'],
    envKey: 'OPENAI_API_KEY',
    docsUrl: 'platform.openai.com',
  },
  {
    name: 'Google Gemini',
    logo: '🔵',
    default: false,
    models: ['gemini-1.5-pro', 'gemini-1.5-flash', 'gemini-2.0-flash'],
    envKey: 'GEMINI_API_KEY',
    docsUrl: 'ai.google.dev',
  },
  {
    name: 'Anthropic Claude',
    logo: '🟠',
    default: false,
    models: ['claude-opus-4-6', 'claude-sonnet-4-6', 'claude-haiku-4-5'],
    envKey: 'ANTHROPIC_API_KEY',
    docsUrl: 'console.anthropic.com',
  },
  {
    name: 'Deepseek',
    logo: '🟣',
    default: false,
    models: ['deepseek-chat', 'deepseek-coder', 'deepseek-r1'],
    envKey: 'DEEPSEEK_API_KEY',
    docsUrl: 'platform.deepseek.com',
  },
]

export const TIMELINE = [
  {
    phase: 'Fase 1',
    title: 'Extensión de Navegador Base',
    duration: '2–3 semanas',
    color: '#3b82f6',
    tasks: [
      'Scaffold de Chrome Extension Manifest V3',
      'Content script para detectar perfiles LinkedIn',
      'Popup UI con React + Vite',
      'Chat bubble inyectable en páginas',
      'REST client tipado hacia backend (mock inicial)',
      'Build y empaquetado de extensión',
    ],
  },
  {
    phase: 'Fase 2',
    title: 'Backend + Leads + Notificaciones',
    duration: '2–3 semanas',
    color: '#10b981',
    tasks: [
      'FastAPI con endpoints de leads (CRUD)',
      'Modelos SQLAlchemy + migraciones Alembic',
      'WebSocket server para notificaciones',
      'Polling / webhook de respuestas de leads',
      'Autenticación JWT + gestión de API keys (cifrado)',
      'Docker Compose: app + postgres + redis',
    ],
  },
  {
    phase: 'Fase 3',
    title: 'Dashboard React + Orquestación LangGraph',
    duration: '2–3 semanas',
    color: '#8b5cf6',
    tasks: [
      'Next.js App Router con layout y navegación',
      'Pantalla Dashboard de Leads (tabla, filtros, métricas)',
      'Pantalla Bandeja de Notificaciones (real-time)',
      'Pantalla Visor de Chat con historial',
      'Agente LangGraph: calificación de leads',
      'Router de modelos IA (selecciona proveedor por config)',
      'Compositor IA: genera 3 variantes de respuesta',
    ],
  },
  {
    phase: 'Fase 4',
    title: 'Investigación Social',
    duration: '2–3 semanas',
    color: '#f59e0b',
    tasks: [
      'Agente de investigación: scraping/API LinkedIn + Twitter',
      'Celery workers para procesamiento asíncrono',
      'Pantalla de Perfil del Decisor (intereses, disparadores, score fit)',
      'Sugerencias de puntos de conversación pre-entrevista',
      'Caché de perfiles en Redis (TTL 24h)',
      'Integración con pgvector para búsqueda de leads similares',
    ],
  },
  {
    phase: 'Fase 5',
    title: 'Configuración de APIs & Pulido',
    duration: '1–2 semanas',
    color: '#ef4444',
    tasks: [
      'Pantalla Configuración de APIs (Gemini, OpenAI, Claude, Deepseek)',
      'Validación de keys con llamada de prueba',
      'Selector de modelo global + por conversación',
      'ICP configuración (Ideal Customer Profile)',
      'Plantillas de mensajes personalizables',
      'Tests E2E (Playwright) para flujos críticos',
      'Documentación de despliegue en Coolify',
    ],
  },
  {
    phase: 'Total',
    title: 'Tiempo estimado',
    duration: '9–14 semanas',
    color: '#6b7280',
    tasks: [
      'Equipo sugerido: 1 full-stack + 1 IA engineer',
      'MVP funcional en ~6 semanas (Fases 1-3)',
      'Producto completo en ~12 semanas',
    ],
  },
]

export const RISKS = [
  {
    level: 'Alto',
    color: '#ef4444',
    risk: 'Restricciones de LinkedIn scraping',
    mitigation: 'Usar LinkedIn API oficial (requiere aprobación) o scraping muy controlado con rate limiting. Plan B: entrada manual enriquecida con IA.',
  },
  {
    level: 'Alto',
    color: '#ef4444',
    risk: 'Costos de API IA en producción',
    mitigation: 'Implementar caché agresivo (Redis) para respuestas similares. Usar gpt-5.1-codex-mini / gemini-flash como defaults económicos. Alertas de gasto por umbral.',
  },
  {
    level: 'Medio',
    color: '#f59e0b',
    risk: 'Aprobación de extensión en Chrome Web Store',
    mitigation: 'Distribución privada en inicio (URL de instalación manual). Preparar política de privacidad antes de publicación.',
  },
  {
    level: 'Medio',
    color: '#f59e0b',
    risk: 'Latencia en investigación social (1-3 min)',
    mitigation: 'UI con progress bar. Pre-investigación automática cuando un lead sube de estado. Notificación cuando esté lista.',
  },
  {
    level: 'Medio',
    color: '#f59e0b',
    risk: 'Gestión segura de API keys de IA',
    mitigation: 'Cifrado AES-256 en BD. Nunca exponer keys en frontend. Variables de entorno para keys del sistema.',
  },
  {
    level: 'Bajo',
    color: '#10b981',
    risk: 'Compatibilidad cross-browser de la extensión',
    mitigation: 'Usar webextension-polyfill para compatibilidad Firefox/Edge. Tests en 3 navegadores desde el inicio.',
  },
  {
    level: 'Bajo',
    color: '#10b981',
    risk: 'Cambios en APIs de IA (deprecaciones)',
    mitigation: 'Capa de abstracción LangChain/LangGraph aísla cambios. Los modelos son configurables sin cambios de código.',
  },
]
