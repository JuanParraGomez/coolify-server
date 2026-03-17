// Datos de demostración para el plan del AI Sales Assistant

export const MOCK_LEADS = [
  { id: 1, nombre: 'Carlos Mendoza', empresa: 'TechMX SA', cargo: 'CTO', estado: 'nuevo', canal: 'LinkedIn', score: 92, respondio: false, fechaContacto: '2026-03-10', interes: 'Automatización', presupuesto: '$50k-100k' },
  { id: 2, nombre: 'Ana Rodríguez', empresa: 'Fintech Norte', cargo: 'CEO', estado: 'contactado', canal: 'Extension', score: 85, respondio: true, fechaContacto: '2026-03-12', interes: 'CRM IA', presupuesto: '$100k+' },
  { id: 3, nombre: 'Luis Torres', empresa: 'LogiCorp', cargo: 'VP Ventas', estado: 'calificado', canal: 'LinkedIn', score: 78, respondio: true, fechaContacto: '2026-03-13', interes: 'Generación leads', presupuesto: '$20k-50k' },
  { id: 4, nombre: 'María González', empresa: 'RetailPlus', cargo: 'CMO', estado: 'propuesta', canal: 'Extension', score: 95, respondio: true, fechaContacto: '2026-03-14', interes: 'Asistente ventas', presupuesto: '$100k+' },
  { id: 5, nombre: 'Pedro Ruiz', empresa: 'SaaS Global', cargo: 'Director IT', estado: 'nuevo', canal: 'Twitter', score: 60, respondio: false, fechaContacto: '2026-03-15', interes: 'Integración API', presupuesto: '$10k-20k' },
  { id: 6, nombre: 'Sofía Herrera', empresa: 'MedTech DF', cargo: 'COO', estado: 'contactado', canal: 'LinkedIn', score: 88, respondio: false, fechaContacto: '2026-03-15', interes: 'Automatización', presupuesto: '$50k-100k' },
  { id: 7, nombre: 'Jorge Castillo', empresa: 'EduSoft', cargo: 'CEO', estado: 'calificado', canal: 'Extension', score: 74, respondio: true, fechaContacto: '2026-03-11', interes: 'Chatbot ventas', presupuesto: '$20k-50k' },
];

export const MOCK_SOCIAL_PROFILES = [
  {
    nombre: 'Carlos Mendoza',
    empresa: 'TechMX SA',
    cargo: 'CTO',
    linkedin: { seguidores: 3400, posts_recientes: ['Publicó sobre IA en manufactura', 'Comentó sobre automatización RPA'], intereses: ['Machine Learning', 'DevOps', 'Cloud AWS'] },
    twitter: { seguidores: 1200, tweets_recientes: ['Thread sobre arquitectura microservicios', 'RT de artículo ChatGPT enterprise'] },
    triggers: ['Contrató 2 developers IA hace 1 mes', 'La empresa creció 40% YoY', 'Publicó vacante de "AI Engineer"'],
    perfil_compra: 'Decisor técnico con presupuesto aprobado. Busca soluciones escalables. Abierto a demos.',
    mejor_angulo: 'Mostrar integración con AWS y capacidades de fine-tuning.',
  },
  {
    nombre: 'Ana Rodríguez',
    empresa: 'Fintech Norte',
    cargo: 'CEO',
    linkedin: { seguidores: 8900, posts_recientes: ['Habló en evento Fintech Latam', 'Artículo sobre transformación digital'], intereses: ['Fintech', 'RegTech', 'Liderazgo'] },
    twitter: { seguidores: 4200, tweets_recientes: ['Mencionó buscar herramientas de eficiencia', 'RT sobre IA en banca'] },
    triggers: ['Levantó Serie A hace 3 meses', 'Mencionó en entrevista reducir costos ops', 'Abrió oficina en CDMX'],
    perfil_compra: 'Visión estratégica, delega evaluación técnica. Prioriza ROI y cumplimiento regulatorio.',
    mejor_angulo: 'Pitch ejecutivo en 10 min. Énfasis en ROI medible y compliance.',
  },
];

export const TIMELINE_PHASES = [
  { fase: 1, nombre: 'Infraestructura base & Auth', semanas: '1-2', duracion: 2, descripcion: 'Setup repo, CI/CD, autenticación JWT, diseño DB, API Gateway', riesgo: 'bajo', equipo: 'Backend + DevOps' },
  { fase: 2, nombre: 'Extensión de navegador (MVP)', semanas: '3-5', duracion: 3, descripcion: 'Chrome Extension con chat flotante, captura de leads, comunicación con backend via REST', riesgo: 'medio', equipo: 'Frontend' },
  { fase: 3, nombre: 'Motor de IA & generación de respuestas', semanas: '4-7', duracion: 4, descripcion: 'Integración multi-proveedor (OpenAI/Gemini/Claude/Deepseek), LangGraph agent, RAG para contexto de lead', riesgo: 'alto', equipo: 'IA + Backend' },
  { fase: 4, nombre: 'Dashboard de leads & CRM lite', semanas: '6-9', duracion: 4, descripcion: 'UI React: tabla leads, filtros, scoring, historial de conversaciones, drill-down por lead', riesgo: 'bajo', equipo: 'Frontend' },
  { fase: 5, nombre: 'Investigación social (OSINT)', semanas: '8-11', duracion: 4, descripcion: 'Scrapers LinkedIn/Twitter, análisis perfil con IA, detección de triggers de compra', riesgo: 'alto', equipo: 'IA + Backend' },
  { fase: 6, nombre: 'Notificaciones & alertas en tiempo real', semanas: '10-12', duracion: 3, descripcion: 'WebSockets, push notifications browser, sistema de alertas por email/Slack', riesgo: 'medio', equipo: 'Backend + Frontend' },
  { fase: 7, nombre: 'Configuración API keys & multi-tenant', semanas: '11-13', duracion: 3, descripcion: 'UI para gestión de API keys por proveedor, cifrado en reposo, rate limiting', riesgo: 'medio', equipo: 'Full Stack' },
  { fase: 8, nombre: 'Testing, hardening & despliegue', semanas: '13-15', duracion: 3, descripcion: 'E2E tests, security audit, performance tuning, documentación, go-live', riesgo: 'bajo', equipo: 'QA + DevOps' },
];

export const TECH_STACK = {
  frontend: [
    { capa: 'UI Framework', tecnologia: 'React 18 + Vite', razon: 'SPA performante, ecosystem maduro' },
    { capa: 'Estado global', tecnologia: 'Zustand', razon: 'Ligero, sin boilerplate, ideal para estado de leads/notificaciones' },
    { capa: 'Data fetching', tecnologia: 'TanStack Query v5', razon: 'Cache, sincronización, invalidación automática' },
    { capa: 'Estilos', tecnologia: 'Tailwind CSS', razon: 'Utilidades rápidas, consistencia visual' },
    { capa: 'Tablas', tecnologia: 'TanStack Table v8', razon: 'Virtualización, filtros, sorting, drill-down' },
    { capa: 'Gráficas', tecnologia: 'Recharts', razon: 'Ligero, composable, compatible React' },
    { capa: 'Extensión', tecnologia: 'Chrome Extension MV3', razon: 'Estándar actual, content scripts + service worker' },
  ],
  backend: [
    { capa: 'API Server', tecnologia: 'FastAPI (Python)', razon: 'Async nativo, tipado con Pydantic, generación OpenAPI automática' },
    { capa: 'Orquestación IA', tecnologia: 'LangGraph', razon: 'Agentes con estado, multi-step reasoning, soporte multi-LLM' },
    { capa: 'Base de datos', tecnologia: 'PostgreSQL + pgvector', razon: 'Relacional + búsqueda vectorial para RAG' },
    { capa: 'Cache/Queues', tecnologia: 'Redis + Celery', razon: 'Cola de tareas para scraping, notificaciones asíncronas' },
    { capa: 'Auth', tecnologia: 'JWT + OAuth2', razon: 'Stateless, compatible con extensión y dashboard' },
    { capa: 'Tiempo real', tecnologia: 'WebSockets (FastAPI)', razon: 'Notificaciones push de respuestas de leads' },
  ],
  ia: [
    { capa: 'Modelo principal (runtime)', tecnologia: 'openai-codex / gpt-5.1-codex-mini', razon: '⚠️ Modelo por defecto del runtime — diferente al modelo de desarrollo' },
    { capa: 'Proveedor alternativo', tecnologia: 'Google Gemini 2.0 Flash', razon: 'Costo-eficiente, multimodal, contexto 1M tokens' },
    { capa: 'Proveedor alternativo', tecnologia: 'Anthropic Claude Sonnet', razon: 'Excelente para redacción persuasiva y análisis' },
    { capa: 'Proveedor alternativo', tecnologia: 'Deepseek V3', razon: 'Open-source, costo bajo, alta calidad en razonamiento' },
    { capa: 'Embeddings', tecnologia: 'text-embedding-3-small', razon: 'Vectores para búsqueda semántica de leads/contexto' },
    { capa: 'Framework agente', tecnologia: 'LangGraph + LangChain', razon: 'Grafos de estado para flujos complejos de ventas' },
  ],
  infra: [
    { capa: 'Contenedores', tecnologia: 'Docker + Coolify', razon: 'Self-hosted PaaS, despliegue desde git' },
    { capa: 'CI/CD', tecnologia: 'GitHub Actions', razon: 'Pipelines de test + build + deploy automático' },
    { capa: 'Monitoreo', tecnologia: 'Sentry + Prometheus', razon: 'Errores en tiempo real + métricas de uso IA' },
    { capa: 'Secretos', tecnologia: 'Vault / env cifrados', razon: 'API keys cifradas en reposo, rotación automática' },
  ],
};

export const DATA_CONTRACTS = {
  lead: {
    endpoint: 'GET /api/v1/leads',
    params: 'estado, canal, score_min, score_max, fecha_desde, fecha_hasta, q (búsqueda)',
    response: '{ items: Lead[], total: number, page: number, per_page: number }',
    lead_schema: '{ id, nombre, empresa, cargo, email, canal, estado, score, respondio, fechaContacto, interes, presupuesto, conversacion_id }',
  },
  social: {
    endpoint: 'POST /api/v1/leads/{id}/investigar',
    body: '{ plataformas: ["linkedin", "twitter"], profundidad: "basica" | "completa" }',
    response: '{ perfil: SocialProfile, triggers: string[], perfil_compra: string, mejor_angulo: string }',
  },
  ia_respuesta: {
    endpoint: 'POST /api/v1/leads/{id}/generar-respuesta',
    body: '{ contexto: string, tono: "formal" | "casual" | "persuasivo", proveedor: "openai" | "gemini" | "claude" | "deepseek" }',
    response: '{ respuesta: string, tokens_usados: number, costo_estimado: number, modelo_usado: string }',
  },
  api_keys: {
    endpoint: 'PUT /api/v1/config/api-keys',
    body: '{ proveedor: string, api_key: string (cifrada en tránsito) }',
    response: '{ ok: boolean, proveedor: string, valida: boolean, modelos_disponibles: string[] }',
  },
};
