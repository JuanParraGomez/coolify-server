/**
 * Comprehensive Mock Data Layer
 * Provides all mock data for the AI Sales Assistant planning application
 * Includes leads, API endpoints, configurations, and state structures
 * Spanish language support with real, functional data
 */

// ─── Leads Data (Enhanced with social research) ─────────────────────────────

export const MOCK_LEADS = [
  {
    id: 1,
    nombre: 'Carlos Mendoza',
    empresa: 'TechMX SA',
    cargo: 'CTO',
    estado: 'nuevo',
    canal: 'LinkedIn',
    score: 92,
    respondio: false,
    fechaContacto: '2026-03-10',
    interes: 'Automatización IA',
    presupuesto: '$50k-100k',
    email: 'carlos.mendoza@techmx.com',
    telefono: '+52-555-0101',
    ubicacion: 'Ciudad de México',
    siguiendo: true,
    ultimaInteraccion: '2026-03-14 14:32',
    notasInternas: 'Alto interés en automatización. Presupuesto confirmado. Ha mencionado transformación digital.',
    tagsInteres: ['IA', 'Automatización', 'DevOps', 'Cloud'],
    tipoDecision: 'Técnico-Estratégico',
    nivelRiesgo: 'Bajo',
    faseVenta: 'Calificación',
  },
  {
    id: 2,
    nombre: 'Ana Rodríguez',
    empresa: 'Fintech Norte',
    cargo: 'CEO',
    estado: 'contactado',
    canal: 'Extension',
    score: 85,
    respondio: true,
    fechaContacto: '2026-03-12',
    interes: 'CRM con IA',
    presupuesto: '$100k+',
    email: 'ana.rodriguez@fintechnorte.mx',
    telefono: '+52-816-0202',
    ubicacion: 'Monterrey',
    siguiendo: true,
    ultimaInteraccion: '2026-03-15 09:15',
    notasInternas: 'Interesada en demostración. Próxima llamada: viernes. Decision maker confirmada.',
    tagsInteres: ['CRM', 'IA Conversacional', 'Analítica', 'Compliance'],
    tipoDecision: 'Ejecutivo',
    nivelRiesgo: 'Muy Bajo',
    faseVenta: 'Demostración',
  },
  {
    id: 3,
    nombre: 'Luis Torres',
    empresa: 'LogiCorp',
    cargo: 'VP Ventas',
    estado: 'calificado',
    canal: 'LinkedIn',
    score: 78,
    respondio: true,
    fechaContacto: '2026-03-13',
    interes: 'Generación de leads',
    presupuesto: '$20k-50k',
    email: 'luis.torres@logicorp.com',
    telefono: '+52-333-0303',
    ubicacion: 'Guadalajara',
    siguiendo: false,
    ultimaInteraccion: '2026-03-14 16:45',
    notasInternas: 'Equipo está evaluando. Necesita más ROI metrics. Evaluación técnica en progreso.',
    tagsInteres: ['Leads', 'Integración', 'Métricas', 'Reporting'],
    tipoDecision: 'Comercial',
    nivelRiesgo: 'Medio',
    faseVenta: 'Evaluación',
  },
  {
    id: 4,
    nombre: 'María González',
    empresa: 'RetailPlus',
    cargo: 'CMO',
    estado: 'propuesta',
    canal: 'Extension',
    score: 95,
    respondio: true,
    fechaContacto: '2026-03-14',
    interes: 'Asistente de ventas',
    presupuesto: '$100k+',
    email: 'maria.gonzalez@retailplus.mx',
    telefono: '+52-222-0404',
    ubicacion: 'Puebla',
    siguiendo: true,
    ultimaInteraccion: '2026-03-15 11:20',
    notasInternas: 'Propuesta enviada. Espera feedback del CFO. Presupuesto aprobado en reunión de directiva.',
    tagsInteres: ['Ventas', 'Marketing Automation', 'Personalization', 'Analytics'],
    tipoDecision: 'Ejecutivo',
    nivelRiesgo: 'Muy Bajo',
    faseVenta: 'Propuesta',
  },
  {
    id: 5,
    nombre: 'Pedro Ruiz',
    empresa: 'SaaS Global',
    cargo: 'Director IT',
    estado: 'nuevo',
    canal: 'Twitter',
    score: 60,
    respondio: false,
    fechaContacto: '2026-03-15',
    interes: 'Integración API',
    presupuesto: '$10k-20k',
    email: 'pedro.ruiz@saasglobal.io',
    telefono: '+52-444-0505',
    ubicacion: 'Querétaro',
    siguiendo: false,
    ultimaInteraccion: '2026-03-10 08:00',
    notasInternas: 'Contacto inicial vía Twitter. Requiere follow-up. Interesado en webinar de integración.',
    tagsInteres: ['Integración', 'API', 'Escalabilidad', 'Seguridad'],
    tipoDecision: 'Técnico',
    nivelRiesgo: 'Alto',
    faseVenta: 'Prospección',
  },
  {
    id: 6,
    nombre: 'Sofía Herrera',
    empresa: 'MedTech DF',
    cargo: 'COO',
    estado: 'contactado',
    canal: 'LinkedIn',
    score: 88,
    respondio: false,
    fechaContacto: '2026-03-15',
    interes: 'Automatización',
    presupuesto: '$50k-100k',
    email: 'sofia.herrera@medtechdf.com',
    telefono: '+52-555-0606',
    ubicacion: 'Ciudad de México',
    siguiendo: true,
    ultimaInteraccion: '2026-03-12 13:30',
    notasInternas: 'Interés moderado. Enviado link de demostración. Espera respuesta sobre compliance.',
    tagsInteras: ['Automatización', 'Healthcare', 'Compliance', 'Análisis'],
    tipoDecision: 'Operacional',
    nivelRiesgo: 'Bajo',
    faseVenta: 'Educación',
  },
  {
    id: 7,
    nombre: 'Jorge Castillo',
    empresa: 'EduSoft',
    cargo: 'CEO',
    estado: 'calificado',
    canal: 'Extension',
    score: 74,
    respondio: true,
    fechaContacto: '2026-03-11',
    interes: 'Chatbot de ventas',
    presupuesto: '$20k-50k',
    email: 'jorge.castillo@edusoft.mx',
    telefono: '+52-777-0707',
    ubicacion: 'Cuernavaca',
    siguiendo: true,
    ultimaInteraccion: '2026-03-13 10:00',
    notasInternas: 'Sector educativo. Presupuesto limitado pero potencial alto. Ciclo de venta 2-3 meses.',
    tagsInteres: ['Chatbot', 'Educación', 'Engagement', 'Scalability'],
    tipoDecision: 'Estratégico',
    nivelRiesgo: 'Medio',
    faseVenta: 'Evaluación',
  },
  {
    id: 8,
    nombre: 'Valentina Cortés',
    empresa: 'InnovaLab',
    cargo: 'VP Producto',
    estado: 'nuevo',
    canal: 'LinkedIn',
    score: 81,
    respondio: false,
    fechaContacto: '2026-03-16',
    interes: 'Investigación de Usuario',
    presupuesto: '$75k-150k',
    email: 'valentina.cortes@innovalab.mx',
    telefono: '+52-666-0808',
    ubicacion: 'Guadalajara',
    siguiendo: true,
    ultimaInteraccion: '2026-03-16 10:45',
    notasInternas: 'Startup en crecimiento. Buscando soluciones de IA para investigación. Inversión reciente de $5M.',
    tagsInteres: ['Investigación IA', 'Producto', 'Analytics', 'UX'],
    tipoDecision: 'Ejecutivo',
    nivelRiesgo: 'Bajo',
    faseVenta: 'Calificación',
  },
]

// ─── Social Research Data ────────────────────────────────────────────────────

export const MOCK_SOCIAL_RESEARCH = {
  1: {
    leadId: 1,
    nombre: 'Carlos Mendoza',
    sources: [
      {
        platform: 'LinkedIn',
        profile: 'https://linkedin.com/in/carlmendoza-cto',
        followers: 5240,
        connections: 2100,
        headline: 'CTO en TechMX | Innovación en IA | Cloud Architecture',
        interests: ['Machine Learning', 'Cloud Architecture', 'DevOps', 'Transformación Digital'],
        recentPosts: [
          'Implementando arquitectura serverless en proyectos con IA',
          'La importancia de la automatización en DevOps',
          'Tendencias en Machine Learning para 2026',
        ],
        engagement: 'Alto',
      },
      {
        platform: 'Twitter',
        profile: 'https://twitter.com/carlmendoza_mx',
        followers: 3150,
        following: 450,
        bio: 'CTO @TechMX | Tech Speaker | Investor en Startups de IA',
        keywords: ['#AI', '#DevOps', '#CloudArchitecture', '#StartupMexico'],
        recentTweets: [
          'Integración de IA en procesos empresariales = futuro',
          'OpenAI API: Revolucionando desarrollo backend',
        ],
      },
      {
        platform: 'GitHub',
        profile: 'https://github.com/carlmendoza',
        repos: 23,
        stars: 1250,
        contributions: 2340,
        languages: ['Python', 'JavaScript', 'Go', 'TypeScript'],
        recentProjects: ['ai-automation-framework', 'ml-pipeline-orchestrator'],
      },
    ],
    insights: [
      'Activo en redes: 3-5 posts por semana',
      'Líder de opinión en comunidad tech mexicana',
      'Ha mencionado automatización IA 12 veces en últimos 30 días',
      'Participa en webinars sobre arquitectura cloud',
      'Interés específico en soluciones que escalen',
    ],
    triggerCompra: ['Presupuesto asignado', 'Nuevo proyecto iniciado', 'Problema técnico urgente'],
    perfil: 'Innovador técnico, decision maker, busca líderes de opinión en su campo',
    mejorMomento: 'Después de webinar sobre caso de uso similar',
    puntosAbordaje: [
      'Hablar sobre arquitectura escalable',
      'Mencionar automatización de DevOps',
      'Casos de uso con Python/Go',
    ],
  },
  2: {
    leadId: 2,
    nombre: 'Ana Rodríguez',
    sources: [
      {
        platform: 'LinkedIn',
        profile: 'https://linkedin.com/in/ana-rodriguez-ceo',
        followers: 8450,
        connections: 4200,
        headline: 'CEO de Fintech Norte | Transformación Digital | Women in Tech',
        interests: ['Fintech', 'Transformación Digital', 'Liderazgo', 'Innovación'],
        recentPosts: [
          'Futuro de la banca digital en México',
          'Por qué la IA es crítica para fintech',
          'Equipo diverso = mejor innovación',
        ],
        engagement: 'Muy Alto',
      },
      {
        platform: 'Twitter',
        profile: 'https://twitter.com/anarodriguez_ceo',
        followers: 12500,
        following: 320,
        bio: 'CEO @FinTechNorte | Innovadora | Speaker en TechSummit',
        keywords: ['#Fintech', '#Innovation', '#Leadership', '#WomenInTech'],
        recentTweets: [
          'La IA es el diferenciador competitivo en fintech',
          'Inversión en tecnología = inversión en futuro',
        ],
      },
    ],
    insights: [
      'Muy influyente en ecosistema fintech mexicano',
      'Toma decisiones rápido (ciclo de decisión: 2-4 semanas)',
      'Presupuesto asignado para innovación 2026',
      'Busca partners estratégicos, no solo proveedores',
      'Ha mencionado soluciones de IA 8 veces este mes',
    ],
    triggerCompra: ['Competidor implementó solución similar', 'Necesidad operacional urgente', 'Presión de junta directiva'],
    perfil: 'Ejecutiva estratégica, orientada a resultados, buscadora de innovación',
    mejorMomento: 'En reunión con CFO (jueves), después de demostración éxito',
    puntosAbordaje: [
      'ROI y impacto en línea de negocio',
      'Cómo compiten con bancos tradicionales',
      'Casos de éxito en fintech',
    ],
  },
  3: {
    leadId: 3,
    nombre: 'Luis Torres',
    sources: [
      {
        platform: 'LinkedIn',
        profile: 'https://linkedin.com/in/luis-torres-vp-sales',
        followers: 3800,
        connections: 1850,
        headline: 'VP Ventas en LogiCorp | B2B Sales | Revenue Growth',
        interests: ['Sales', 'Leads Generation', 'CRM', 'Revenue Growth'],
        recentPosts: [
          'Cómo aumentar conversión de leads un 40%',
          'Tools que transformaron mi equipo de ventas',
          'La importancia de datos en decisiones',
        ],
        engagement: 'Moderado',
      },
      {
        platform: 'Twitter',
        profile: 'https://twitter.com/luistorres_sales',
        followers: 2100,
        following: 580,
        bio: 'VP Sales @LogiCorp | Revenue focused | Sales automation advocate',
        keywords: ['#Sales', '#Leads', '#SalesAutomation', '#Revenue'],
      },
    ],
    insights: [
      'Enfocado en métricas y ROI',
      'Busca automatización para aumentar productivity',
      'Ciclo de decisión: 3-6 semanas',
      'Ha evaluado 3 soluciones similares',
      'Presupuesto disponible si se demuestra ROI',
    ],
    triggerCompra: ['Competidor obtuvo leads de su mercado', 'Rotación en equipo', 'Cambio de objetivo de ventas'],
    perfil: 'Sales leader pragmático, data-driven, enfocado en números',
    mejorMomento: 'Al final del trimestre (después de revisar números)',
    puntosAbordaje: [
      'Mostrar ROI con números específicos',
      'Casos de éxito en su industria',
      'Implementación rápida sin disruption',
    ],
  },
}

// ─── Filter Options ─────────────────────────────────────────────────────────

export const ESTADO_OPTIONS = [
  { value: 'todos', label: '📊 Todos los estados' },
  { value: 'nuevo', label: '🆕 Nuevo' },
  { value: 'contactado', label: '📞 Contactado' },
  { value: 'calificado', label: '✅ Calificado' },
  { value: 'propuesta', label: '📄 Propuesta' },
]

export const CANAL_OPTIONS = [
  { value: 'todos', label: '🔄 Todos los canales' },
  { value: 'LinkedIn', label: '💼 LinkedIn' },
  { value: 'Extension', label: '🧩 Extensión' },
  { value: 'Twitter', label: '🐦 Twitter' },
]

export const RESPONDIO_OPTIONS = [
  { value: 'todos', label: '💬 Todos' },
  { value: 'si', label: '✅ Respondió: Sí' },
  { value: 'no', label: '❌ Respondió: No' },
]

export const RISK_OPTIONS = [
  { value: 'todos', label: 'Todos los niveles' },
  { value: 'Bajo', label: '🟢 Bajo' },
  { value: 'Medio', label: '🟡 Medio' },
  { value: 'Alto', label: '🔴 Alto' },
]

// ─── Status Colors ──────────────────────────────────────────────────────────

export const ESTADO_COLOR = {
  nuevo: '#3b82f6',
  contactado: '#f59e0b',
  calificado: '#10b981',
  propuesta: '#8b5cf6',
}

export const RISK_COLOR = {
  'Bajo': '#10b981',
  'Medio': '#f59e0b',
  'Alto': '#ef4444',
}

// ─── Chat Messages Mock Data ────────────────────────────────────────────────

export const MOCK_CHAT_HISTORY = {
  1: [
    {
      id: 1,
      role: 'user',
      content: 'Hola, tengo interés en automatizar nuestros procesos de IA. ¿Pueden ayudarnos?',
      timestamp: '2026-03-14 14:15',
      leadId: 1,
    },
    {
      id: 2,
      role: 'assistant',
      content: 'Por supuesto, Carlos. Especialistas en automatización de procesos con IA. Podemos ayudarte a optimizar tu stack actual. ¿Cuál es tu área principal de enfoque?',
      timestamp: '2026-03-14 14:18',
      provider: 'openai',
    },
  ],
  2: [
    {
      id: 3,
      role: 'user',
      content: 'Buscamos mejorar la experiencia del cliente con CRM inteligente.',
      timestamp: '2026-03-15 09:15',
      leadId: 2,
    },
    {
      id: 4,
      role: 'assistant',
      content: 'Entendido, Ana. Con nuestra solución de CRM con IA, pueden aumentar engagement un 35% y reducir tiempo de atención un 40%. ¿Te gustaría una demostración personalizada?',
      timestamp: '2026-03-15 09:20',
      provider: 'openai',
    },
  ],
}

// ─── Notifications Mock Data ────────────────────────────────────────────────

export const MOCK_NOTIFICATIONS = [
  {
    id: 1,
    type: 'response',
    leadId: 2,
    leadName: 'Ana Rodríguez',
    leadCompany: 'Fintech Norte',
    message: 'Nueva respuesta recibida',
    content: 'Excelente propuesta. ¿Cuándo podemos agendar una demostración?',
    timestamp: '2026-03-15 09:15',
    read: false,
    action: 'reply',
  },
  {
    id: 2,
    type: 'reminder',
    leadId: 4,
    leadName: 'María González',
    leadCompany: 'RetailPlus',
    message: 'Seguimiento: propuesta hace 2 días',
    content: 'Recordatorio: propuesta enviada a María González. Considerar follow-up.',
    timestamp: '2026-03-15 14:00',
    read: false,
    action: 'follow-up',
  },
  {
    id: 3,
    type: 'milestone',
    leadId: 3,
    leadName: 'Luis Torres',
    leadCompany: 'LogiCorp',
    message: 'Escalado a Calificado',
    content: 'Luis Torres ha completado la evaluación técnica',
    timestamp: '2026-03-14 16:45',
    read: true,
    action: 'view',
  },
  {
    id: 4,
    type: 'social_insight',
    leadId: 1,
    leadName: 'Carlos Mendoza',
    leadCompany: 'TechMX SA',
    message: 'Nuevo insight social encontrado',
    content: 'Carlos publicó sobre arquitectura serverless. Oportunidad de enganche.',
    timestamp: '2026-03-15 11:30',
    read: false,
    action: 'view',
  },
]

// ─── AI Providers Configuration ──────────────────────────────────────────────

export const API_PROVIDERS = [
  {
    id: 'openai',
    name: 'OpenAI',
    logo: '🤖',
    models: ['gpt-4-turbo', 'gpt-4', 'gpt-3.5-turbo'],
    defaultModel: 'gpt-4',
    use: 'Generación de respuestas de ventas, análisis de leads',
    key_env: 'OPENAI_API_KEY',
    docs: 'https://platform.openai.com/docs',
    rateLimit: '3500 RPM',
    pricing: 'Pay-as-you-go',
    latency: '~1-2s',
  },
  {
    id: 'gemini',
    name: 'Google Gemini',
    logo: '✨',
    models: ['gemini-1.5-pro', 'gemini-1.5-flash', 'gemini-pro-vision'],
    defaultModel: 'gemini-1.5-pro',
    use: 'Análisis multimodal, investigación social',
    key_env: 'GOOGLE_API_KEY',
    docs: 'https://ai.google.dev',
    rateLimit: '1000 RPM',
    pricing: 'Free + Premium',
    latency: '~1-3s',
  },
  {
    id: 'claude',
    name: 'Anthropic Claude',
    logo: '🧠',
    models: ['claude-3-opus', 'claude-3-sonnet', 'claude-3-haiku'],
    defaultModel: 'claude-3-sonnet',
    use: 'Razonamiento complejo, redacción de propuestas',
    key_env: 'ANTHROPIC_API_KEY',
    docs: 'https://docs.anthropic.com',
    rateLimit: '5000 RPM',
    pricing: 'Pay-as-you-go',
    latency: '~2-4s',
  },
  {
    id: 'deepseek',
    name: 'Deepseek',
    logo: '🔍',
    models: ['deepseek-coder-33b', 'deepseek-chat', 'deepseek-llm-67b'],
    defaultModel: 'deepseek-chat',
    use: 'Búsqueda inteligente, procesamiento de contexto',
    key_env: 'DEEPSEEK_API_KEY',
    docs: 'https://deepseek.com/docs',
    rateLimit: '2000 RPM',
    pricing: 'Open Source + API',
    latency: '~1-2s',
  },
]

// ─── Default Runtime Model ──────────────────────────────────────────────────

export const DEFAULT_RUNTIME_MODEL = 'openai-codex/gpt-5.1-codex-mini'

// ─── Initial State Structure ─────────────────────────────────────────────────

export const INITIAL_FILTER_STATE = {
  q: '',
  estado: 'todos',
  canal: 'todos',
  respondio: 'todos',
  riesgo: 'todos',
  sortField: 'score',
  sortDir: 'desc',
  page: 1,
  limit: 10,
}

export const INITIAL_APP_STATE = {
  leads: MOCK_LEADS,
  filters: INITIAL_FILTER_STATE,
  selectedLeadId: null,
  selectedLeadSocialResearch: null,
  notifications: MOCK_NOTIFICATIONS,
  apiKeys: {
    openai: null,
    gemini: null,
    claude: null,
    deepseek: null,
  },
  activeProvider: 'openai',
  chatMessages: {},
  socialResearch: MOCK_SOCIAL_RESEARCH,
  loading: false,
  error: null,
  unreadNotifications: 3,
}

// ─── API Mock Responses ──────────────────────────────────────────────────────

export const MOCK_API_RESPONSES = {
  // GET /api/leads
  getLeads: (filters = {}) => ({
    status: 200,
    data: {
      items: filterLeads(MOCK_LEADS, filters),
      total: MOCK_LEADS.length,
      page: filters.page || 1,
      limit: filters.limit || 10,
      timestamp: new Date().toISOString(),
    },
  }),

  // GET /api/leads/:id
  getLeadDetail: (id) => {
    const lead = MOCK_LEADS.find(l => l.id === parseInt(id))
    return {
      status: lead ? 200 : 404,
      data: lead || null,
      timestamp: new Date().toISOString(),
    }
  },

  // POST /api/leads/:id/suggest
  generateSuggestion: (leadId, provider) => {
    const lead = MOCK_LEADS.find(l => l.id === parseInt(leadId))
    const suggestions = {
      openai: `Hola ${lead.nombre}, vi tu perfil en LinkedIn y me encanta tu enfoque en ${lead.interes}. Tenemos una solución que se alinea perfectamente con tu stack. ¿Te gustaría conocer más detalles?`,
      gemini: `${lead.nombre}, como ${lead.cargo} en ${lead.empresa}, seguramente valoras la eficiencia. Nuestro sistema ahorra ~15 horas/semana en tareas repetitivas.`,
      claude: `Estimado ${lead.nombre}, considerando tu experiencia en ${lead.interes} y tu objetivo de $${lead.presupuesto}, tenemos un caso de uso específico para tu industria.`,
      deepseek: `${lead.nombre}, basándome en tu actividad reciente, parece que buscas optimizar ${lead.interes}. Podríamos ayudarte.`,
    }
    return {
      status: 200,
      data: {
        leadId,
        provider,
        suggestion: suggestions[provider] || `Mensaje generado por ${provider}`,
        timestamp: new Date().toISOString(),
        tokens: Math.floor(Math.random() * 200) + 50,
        quality: 'high',
      },
    }
  },

  // POST /api/leads/:id/respond
  createResponse: (leadId, message) => ({
    status: 201,
    data: {
      id: Math.floor(Math.random() * 10000),
      leadId,
      message,
      sentAt: new Date().toISOString(),
      status: 'enviado',
      channel: 'linkedin',
    },
  }),

  // GET /api/social-research/:id
  getSocialResearch: (leadId) => {
    const research = MOCK_SOCIAL_RESEARCH[leadId]
    return {
      status: research ? 200 : 404,
      data: research || null,
      timestamp: new Date().toISOString(),
    }
  },

  // POST /api/chat/message
  sendChatMessage: (conversationId, message) => ({
    status: 200,
    data: {
      id: Math.floor(Math.random() * 10000),
      conversationId,
      role: 'assistant',
      content: `Respuesta contextual a: "${message}"`,
      timestamp: new Date().toISOString(),
      provider: 'openai',
      tokens: Math.floor(Math.random() * 150) + 30,
    },
  }),

  // GET /api/notifications
  getNotifications: () => ({
    status: 200,
    data: {
      items: MOCK_NOTIFICATIONS,
      unread: MOCK_NOTIFICATIONS.filter(n => !n.read).length,
      timestamp: new Date().toISOString(),
    },
  }),

  // POST /api/config/api-keys
  saveApiKeys: (provider, apiKey) => ({
    status: 201,
    data: {
      provider,
      keyPrefix: apiKey.substring(0, 8) + '...',
      status: 'active',
      verified: true,
      createdAt: new Date().toISOString(),
      model: API_PROVIDERS.find(p => p.id === provider)?.defaultModel,
    },
  }),

  // POST /api/leads/:id/qualify
  qualifyLead: (leadId, score, feedback) => ({
    status: 200,
    data: {
      leadId,
      score,
      feedback,
      newState: score > 75 ? 'calificado' : 'contactado',
      timestamp: new Date().toISOString(),
    },
  }),

  // GET /api/analytics/leads-funnel
  getLeadsFunnel: () => ({
    status: 200,
    data: {
      nuevo: MOCK_LEADS.filter(l => l.estado === 'nuevo').length,
      contactado: MOCK_LEADS.filter(l => l.estado === 'contactado').length,
      calificado: MOCK_LEADS.filter(l => l.estado === 'calificado').length,
      propuesta: MOCK_LEADS.filter(l => l.estado === 'propuesta').length,
      conversion: ((MOCK_LEADS.filter(l => l.respondio).length / MOCK_LEADS.length) * 100).toFixed(1) + '%',
    },
  }),
}

// ─── Utility Functions ───────────────────────────────────────────────────────

/**
 * Filter leads based on multiple criteria
 */
export function filterLeads(leads, filters = {}) {
  return leads.filter(lead => {
    if (filters.estado && filters.estado !== 'todos' && lead.estado !== filters.estado) return false
    if (filters.canal && filters.canal !== 'todos' && lead.canal !== filters.canal) return false
    if (filters.respondio === 'si' && !lead.respondio) return false
    if (filters.respondio === 'no' && lead.respondio) return false
    if (filters.riesgo && filters.riesgo !== 'todos' && lead.nivelRiesgo !== filters.riesgo) return false
    if (filters.q) {
      const lq = filters.q.toLowerCase()
      return (
        lead.nombre.toLowerCase().includes(lq) ||
        lead.empresa.toLowerCase().includes(lq) ||
        lead.cargo.toLowerCase().includes(lq) ||
        (lead.tagsInteres && lead.tagsInteres.some(t => t.toLowerCase().includes(lq)))
      )
    }
    return true
  })
}

/**
 * Sort leads by field and direction
 */
export function sortLeads(leads, sortField = 'score', sortDir = 'desc') {
  return [...leads].sort((a, b) => {
    const av = a[sortField]
    const bv = b[sortField]
    const d = sortDir === 'asc' ? 1 : -1
    if (av < bv) return -d
    if (av > bv) return d
    return 0
  })
}

/**
 * Get comprehensive statistics from leads
 */
export function getLeadStats(leads) {
  return {
    total: leads.length,
    nuevos: leads.filter(l => l.estado === 'nuevo').length,
    contactados: leads.filter(l => l.estado === 'contactado').length,
    calificados: leads.filter(l => l.estado === 'calificado').length,
    propuestas: leads.filter(l => l.estado === 'propuesta').length,
    respondieron: leads.filter(l => l.respondio).length,
    noRespondieron: leads.filter(l => !l.respondio).length,
    scorePromedio: Math.round(leads.reduce((s, l) => s + l.score, 0) / leads.length),
    scoreAlto: leads.filter(l => l.score >= 85).length,
    scoreMedio: leads.filter(l => l.score >= 65 && l.score < 85).length,
    scoreBajo: leads.filter(l => l.score < 65).length,
    tasaConversion: ((leads.filter(l => l.respondio).length / leads.length) * 100).toFixed(1) + '%',
    riesgoBajo: leads.filter(l => l.nivelRiesgo === 'Bajo').length,
    riesgoMedio: leads.filter(l => l.nivelRiesgo === 'Medio').length,
    riesgoAlto: leads.filter(l => l.nivelRiesgo === 'Alto').length,
  }
}

/**
 * Get notification summary
 */
export function getNotificationSummary(notifications) {
  return {
    total: notifications.length,
    unread: notifications.filter(n => !n.read).length,
    byType: notifications.reduce((acc, n) => {
      acc[n.type] = (acc[n.type] || 0) + 1
      return acc
    }, {}),
    urgent: notifications.filter(n => !n.read && (n.type === 'response' || n.type === 'milestone')).length,
  }
}

/**
 * Get lead scoring factors
 */
export function getLeadScoreFactors(lead) {
  const factors = []
  if (lead.respondio) factors.push({ name: 'Respondió', value: +20 })
  if (lead.presupuesto.includes('100k+')) factors.push({ name: 'Presupuesto alto', value: +15 })
  if (lead.cargo.includes('CEO') || lead.cargo.includes('VP')) factors.push({ name: 'Nivel ejecutivo', value: +10 })
  if (lead.nivelRiesgo === 'Muy Bajo') factors.push({ name: 'Riesgo muy bajo', value: +10 })
  if (lead.siguiendo) factors.push({ name: 'En seguimiento', value: +5 })
  return factors
}

/**
 * Format lead for display with all enrichments
 */
export function enrichLead(leadId) {
  const lead = MOCK_LEADS.find(l => l.id === leadId)
  if (!lead) return null
  return {
    ...lead,
    socialResearch: MOCK_SOCIAL_RESEARCH[leadId],
    chatHistory: MOCK_CHAT_HISTORY[leadId] || [],
    scoreFactors: getLeadScoreFactors(lead),
  }
}

// ─── Chat & Message Templates ──────────────────────────────────────────

export const MESSAGE_TEMPLATES = {
  greeting: [
    '¡Hola! 👋 Vi tu perfil en LinkedIn y me encantó tu trabajo en {empresa}.',
    'Hola {nombre}, nos cruzamos en el ecosistema de startups tech. Quisiera conectar.',
    '¡Saludos! Tu enfoque en {interes} es alineado a lo que hacemos.',
  ],
  value_proposition: [
    'Estamos ayudando a equipos como el tuyo a {interes} con IA.',
    'Creo que tu rol en {cargo} se beneficiaría de automaticar {interes}.',
    'Nuestro asistente de IA ha ayudado a empresas como {empresa} a mejorar eficiencia en {interes}.',
  ],
  cta: [
    '¿Te vendría bien una breve demo de 15 minutos?',
    'Podríamos tener una llamada rápida. ¿Te viene bien?',
    '¿Nos tomamos un café virtual? Quiero saber más de tu visión.',
  ],
}

export const SUGGESTION_TONES = [
  { id: 'formal', label: 'Formal', description: 'Profesional y corporativo' },
  { id: 'casual', label: 'Casual', description: 'Amigable y relajado' },
  { id: 'persuasive', label: 'Persuasivo', description: 'Convencedor y orientado a CTA' },
]

export const CONVERSATION_STATUSES = {
  iniciado: 'Iniciado',
  en_progreso: 'En progreso',
  propuesta: 'Propuesta enviada',
  ganado: 'Ganado',
  perdido: 'Perdido',
}

// ─── Dashboard Stats Templates ─────────────────────────────────────────

export const STATS_LABELS = {
  total: 'Total de leads',
  nuevos: 'Leads nuevos',
  contactados: 'Contactados',
  calificados: 'Calificados',
  propuestas: 'Propuestas',
  respondieron: 'Respondieron',
  scorePromedio: 'Score promedio',
  tasa_conversion: 'Tasa de conversión',
  valor_pipeline: 'Valor del pipeline',
}

// ─── Validation Rules ──────────────────────────────────────────────────

export const VALIDATION = {
  API_KEY: {
    minLength: 8,
    pattern: /^[a-zA-Z0-9\-_.]+$/,
  },
  EMAIL: {
    pattern: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
  },
  PHONE: {
    pattern: /^\+?[0-9]{10,15}$/,
  },
  SEARCH_MIN_LENGTH: 1,
  SEARCH_MAX_LENGTH: 100,
}
