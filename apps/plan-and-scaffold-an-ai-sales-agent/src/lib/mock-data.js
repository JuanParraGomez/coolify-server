/**
 * Mock Data Layer - AI Sales Agent
 * Provides realistic sample data for development and demonstration.
 * This file contains leads, alerts, research, chat messages, responses, and agent runs.
 */

// ============================================================================
// LEADS DATA
// ============================================================================

export const mockLeads = [
  {
    id: 'lead_001',
    name: 'Ana García',
    title: 'VP de Ventas',
    company: 'TechCorp México',
    email: 'ana.garcia@techcorp.mx',
    linkedin: 'linkedin.com/in/anagarcia',
    status: 'replied',
    score: 87,
    source: 'extension',
    lastActivity: '2026-03-16T14:30:00Z',
    createdAt: '2026-02-15T08:00:00Z',
    tags: ['enterprise', 'hot', 'decision-maker'],
    responseTime: '2h',
    notes: 'Interesada en automatización de pipeline de ventas. Presupuesto Q2.',
    website: 'techcorp.mx',
    department: 'Ventas',
    industryType: 'Tech/Software',
  },
  {
    id: 'lead_002',
    name: 'Carlos Mendoza',
    title: 'Director de Operaciones',
    company: 'Finanzas Digital S.A.',
    email: 'carlos.m@findigital.com',
    linkedin: 'linkedin.com/in/carlosmendoza',
    status: 'contacted',
    score: 72,
    source: 'extension',
    lastActivity: '2026-03-15T09:00:00Z',
    createdAt: '2026-03-01T10:00:00Z',
    tags: ['mid-market', 'financial'],
    responseTime: null,
    notes: 'Demo agendada para próxima semana. Muy interesado en integración Salesforce.',
    website: 'findigital.com',
    department: 'Operaciones',
    industryType: 'Fintech',
  },
  {
    id: 'lead_003',
    name: 'Sofía Ramírez',
    title: 'CTO',
    company: 'StartupAI',
    email: 'sofia@startupai.io',
    linkedin: 'linkedin.com/in/sofiaramirez',
    status: 'qualified',
    score: 95,
    source: 'manual',
    lastActivity: '2026-03-16T11:00:00Z',
    createdAt: '2026-01-20T14:00:00Z',
    tags: ['enterprise', 'decision-maker', 'hot'],
    responseTime: '30m',
    notes: 'Presupuesto aprobado. Listo para propuesta. CTO técnico y con poder de decisión.',
    website: 'startupai.io',
    department: 'Tecnología',
    industryType: 'AI/ML',
  },
  {
    id: 'lead_004',
    name: 'Miguel Torres',
    title: 'Gerente de TI',
    company: 'RetailPlus',
    email: 'mtorres@retailplus.com',
    linkedin: 'linkedin.com/in/migueltorres',
    status: 'new',
    score: 45,
    source: 'extension',
    lastActivity: '2026-03-16T16:00:00Z',
    createdAt: '2026-03-16T16:00:00Z',
    tags: ['smb', 'retail'],
    responseTime: null,
    notes: 'Lead recién capturado. Visita frecuente a sitio de precios.',
    website: 'retailplus.mx',
    department: 'TI',
    industryType: 'Retail',
  },
  {
    id: 'lead_005',
    name: 'Laura Vega',
    title: 'Chief Revenue Officer',
    company: 'SaaS Global',
    email: 'lvega@saasglobal.com',
    linkedin: 'linkedin.com/in/lauravega',
    status: 'replied',
    score: 91,
    source: 'extension',
    lastActivity: '2026-03-16T13:15:00Z',
    createdAt: '2026-02-28T11:00:00Z',
    tags: ['enterprise', 'hot', 'decision-maker'],
    responseTime: '1h',
    notes: 'Solicita integración con Salesforce. CRO con presupuesto disponible.',
    website: 'saasglobal.com',
    department: 'Ventas/Ingresos',
    industryType: 'SaaS',
  },
  {
    id: 'lead_006',
    name: 'Roberto Fuentes',
    title: 'Director Comercial',
    company: 'BancoNorte',
    email: 'rfuentes@banconorte.mx',
    linkedin: 'linkedin.com/in/robertofuentes',
    status: 'closed',
    score: 60,
    source: 'manual',
    lastActivity: '2026-03-10T10:00:00Z',
    createdAt: '2026-01-05T09:00:00Z',
    tags: ['financial', 'enterprise'],
    responseTime: '24h',
    notes: 'Cerrado por presupuesto insuficiente Q1. Posible reabrir en Q3.',
    website: 'banconorte.mx',
    department: 'Comercial',
    industryType: 'Finanzas/Banca',
  },
  {
    id: 'lead_007',
    name: 'Patricia López',
    title: 'Manager Proyectos TI',
    company: 'Constructor Digital',
    email: 'plopez@constructordigital.com',
    linkedin: 'linkedin.com/in/patrilopez',
    status: 'qualified',
    score: 82,
    source: 'extension',
    lastActivity: '2026-03-14T15:45:00Z',
    createdAt: '2026-03-05T12:00:00Z',
    tags: ['mid-market', 'construction'],
    responseTime: '3h',
    notes: 'Muy responsiva. Equipo de 8 personas. Evaluando herramientas Q2.',
    website: 'constructordigital.com',
    department: 'Proyectos',
    industryType: 'Construcción',
  },
  {
    id: 'lead_008',
    name: 'Juan Hernández',
    title: 'Head of Growth',
    company: 'MarketingCloud Latam',
    email: 'juan.h@marketingcloud.mx',
    linkedin: 'linkedin.com/in/juanhernandez',
    status: 'contacted',
    score: 68,
    source: 'manual',
    lastActivity: '2026-03-12T14:20:00Z',
    createdAt: '2026-02-20T10:00:00Z',
    tags: ['marketing', 'mid-market'],
    responseTime: null,
    notes: 'Contacto inicial fuerte. Esperar follow-up.',
    website: 'marketingcloud.mx',
    department: 'Crecimiento',
    industryType: 'Marketing/Publicidad',
  },
]

export const leadMetrics = {
  total: 128,
  newThisWeek: 23,
  replied: 41,
  qualified: 17,
  conversionRate: 13.3,
  avgResponseTime: '3.2h',
  topSource: 'Extensión de Navegador',
  hotLeads: 12,
  byIndustry: {
    'Tech/Software': 34,
    'Fintech': 28,
    'AI/ML': 12,
    'SaaS': 21,
    'Retail': 15,
    'Finanzas/Banca': 8,
    'Construcción': 5,
    'Marketing/Publicidad': 5,
  },
  byStatus: {
    new: 28,
    contacted: 32,
    replied: 41,
    qualified: 17,
    closed: 10,
  },
}

// ============================================================================
// ALERTS DATA
// ============================================================================

export const mockAlerts = [
  {
    id: 'alert_001',
    type: 'reply',
    lead: { id: 'lead_001', name: 'Ana García', company: 'TechCorp México' },
    message: '¡Ana García respondió a tu mensaje! Dice: "Me interesa mucho la propuesta, ¿podemos agendar una llamada?"',
    timestamp: '2026-03-16T14:30:00Z',
    read: false,
    priority: 'high',
    suggestedReply: 'Hola Ana, me alegra que te interese. ¿Te viene bien el jueves a las 3pm para una llamada de 30 minutos?',
    details: {
      leadResponse: 'Me interesa mucho la propuesta, ¿podemos agendar una llamada?',
      sentiment: 'positive',
      keywords: ['llamada', 'interesa', 'propuesta'],
    },
  },
  {
    id: 'alert_002',
    type: 'reply',
    lead: { id: 'lead_005', name: 'Laura Vega', company: 'SaaS Global' },
    message: 'Laura Vega respondió: "¿Tienen integración nativa con Salesforce? Es un requisito indispensable."',
    timestamp: '2026-03-16T13:15:00Z',
    read: false,
    priority: 'high',
    suggestedReply: 'Hola Laura, sí tenemos integración bidireccional con Salesforce. Puedo enviarte la documentación técnica ahora mismo.',
    details: {
      leadResponse: '¿Tienen integración nativa con Salesforce? Es un requisito indispensable.',
      sentiment: 'neutral',
      keywords: ['Salesforce', 'integración', 'requisito'],
    },
  },
  {
    id: 'alert_003',
    type: 'followup',
    lead: { id: 'lead_002', name: 'Carlos Mendoza', company: 'Finanzas Digital' },
    message: 'Han pasado 48h sin respuesta de Carlos Mendoza. Recomendamos un seguimiento.',
    timestamp: '2026-03-15T09:00:00Z',
    read: true,
    priority: 'medium',
    suggestedReply: 'Hola Carlos, quería hacer un seguimiento de mi mensaje anterior. ¿Tuviste oportunidad de revisar la propuesta?',
    details: {
      hoursWaiting: 48,
      lastContactTime: '2026-03-13T09:00:00Z',
      engagementLevel: 'moderate',
    },
  },
  {
    id: 'alert_004',
    type: 'score_change',
    lead: { id: 'lead_003', name: 'Sofía Ramírez', company: 'StartupAI' },
    message: 'El score de Sofía Ramírez subió a 95. Visitó tu página de precios 3 veces hoy.',
    timestamp: '2026-03-16T11:00:00Z',
    read: false,
    priority: 'high',
    suggestedReply: null,
    details: {
      previousScore: 88,
      newScore: 95,
      scoreChange: 7,
      activities: ['visited pricing page (3x)', 'read case study', 'viewed integrations'],
    },
  },
  {
    id: 'alert_005',
    type: 'new_lead',
    lead: { id: 'lead_004', name: 'Miguel Torres', company: 'RetailPlus' },
    message: 'Nuevo lead capturado desde la extensión: Miguel Torres, Gerente de TI en RetailPlus.',
    timestamp: '2026-03-16T16:00:00Z',
    read: false,
    priority: 'low',
    suggestedReply: 'Hola Miguel, vi tu perfil y creo que nuestra solución puede ser muy útil para RetailPlus.',
    details: {
      captureMethod: 'extension',
      initialScore: 45,
      companySize: 'mid-market',
    },
  },
  {
    id: 'alert_006',
    type: 'connection_request',
    lead: { id: 'lead_007', name: 'Patricia López', company: 'Constructor Digital' },
    message: 'Patricia López te envió una solicitud de conexión en LinkedIn.',
    timestamp: '2026-03-16T10:30:00Z',
    read: false,
    priority: 'medium',
    suggestedReply: 'Hola Patricia, gracias por tu solicitud. Me interesa conectar. Trabajamos con empresas de construcción regularmente.',
    details: {
      platform: 'linkedin',
      action: 'accept_connection',
    },
  },
]

export const alertStats = {
  unread: 4,
  highPriority: 3,
  pendingReplies: 2,
  automatedSent: 12,
  todayAlerts: 6,
  thisWeekAlerts: 28,
}

// ============================================================================
// RESEARCH DATA
// ============================================================================

export const mockResearch = {
  lead_001: {
    leadId: 'lead_001',
    leadName: 'Ana García',
    company: 'TechCorp México',
    generatedAt: '2026-03-16T10:00:00Z',
    lastUpdated: '2026-03-16T14:00:00Z',
    socialProfiles: {
      linkedin: {
        headline: 'VP de Ventas en TechCorp México',
        bio: 'Apasionada por tecnología de ventas, automatización y transformación digital.',
        followers: 3240,
        connections: 892,
        recentPosts: [
          { date: '2026-03-14', content: 'Implementar CRM es crucial para escalar ventas', likes: 142 },
          { date: '2026-03-10', content: 'Compartiendo las lecciones aprendidas en gestión de equipos', likes: 87 },
        ],
      },
      twitter: {
        handle: '@anagarciaventa',
        bio: 'Líder en ventas B2B | Innovación | Startups',
        followers: 1200,
        recentTweets: [
          { date: '2026-03-15', text: 'Buscando soluciones innovadoras para pipeline de ventas', likes: 45 },
        ],
      },
    },
    companyResearch: {
      name: 'TechCorp México',
      founded: 2015,
      employees: 250,
      fundingStatus: 'Series B',
      lastFundingAmount: '$5M',
      industry: 'Enterprise Software',
      website: 'techcorp.mx',
      linkedinCompanyUrl: 'linkedin.com/company/techcorp-mexico',
    },
    talkingPoints: [
      'Ana está activamente buscando soluciones de automatización de ventas',
      'Ha invertido en infraestructura tech recientemente (Series B)',
      'Tiene fuerte presencia en redes y es thought leader en ventas B2B',
      'El equipo de ventas es de aproximadamente 35-40 personas (estimado)',
      'Ha publicado sobre importancia de CRM y automatización',
    ],
    recommendedApproach: 'Enfocarse en ROI del pipeline, demostración de casos de éxito en tech companies y escalabilidad',
    riskFactors: ['Budget constraint Q1', 'Currently evaluating competitors'],
    opportunities: [
      'Series B da capacidad presupuestaria',
      'Active in sales tech community - amplification potential',
      'Team size justifies enterprise pricing',
    ],
  },
  lead_005: {
    leadId: 'lead_005',
    leadName: 'Laura Vega',
    company: 'SaaS Global',
    generatedAt: '2026-03-16T12:00:00Z',
    lastUpdated: '2026-03-16T12:30:00Z',
    socialProfiles: {
      linkedin: {
        headline: 'Chief Revenue Officer en SaaS Global',
        bio: 'Scaling revenue. Former VP Sales at 3 Series B startups. Passionate about GTM strategy.',
        followers: 5120,
        connections: 2340,
        recentPosts: [
          { date: '2026-03-13', content: 'Revenue stacks for scaling companies: Salesforce, Stripe, and?', likes: 312 },
          { date: '2026-03-08', content: 'Integrations matter. 70% of SaaS deals hinge on integrations.', likes: 189 },
        ],
      },
      twitter: {
        handle: '@lauravegacrm',
        bio: 'CRO | Revenue Strategy | SaaS Scaling',
        followers: 4500,
        recentTweets: [
          { date: '2026-03-14', text: 'Looking for Salesforce-native solutions that actually work. DM open.', likes: 234 },
        ],
      },
    },
    companyResearch: {
      name: 'SaaS Global',
      founded: 2018,
      employees: 450,
      fundingStatus: 'Series C',
      lastFundingAmount: '$25M',
      industry: 'Business Software / SaaS Platform',
      website: 'saasglobal.com',
      linkedinCompanyUrl: 'linkedin.com/company/saasglobal',
    },
    talkingPoints: [
      'Laura es CRO con experiencia scaling revenue en startups Series B+',
      'Ha liderado 3 rounds de fundraising exitosos - entiende crecimiento acelerado',
      'Publicó artículo viral sobre importancia de integraciones en SaaS',
      'SaaS Global está en expansión agresiva (Series C, $25M)',
      'Su red es extensa - influenciadora clave en comunidad SaaS',
    ],
    recommendedApproach: 'Lead con integración Salesforce, mostra casos de empresas scaling con revenue stacks, destaca credibilidad con CROs',
    riskFactors: ['Already evaluating solutions', 'Enterprise procurement process'],
    opportunities: [
      'Large Series C round - significant budget',
      'CRO is influencer - reference customer potential is huge',
      'Expansion phase means multiple team members can benefit',
    ],
  },
}

// ============================================================================
// CHAT MESSAGES DATA
// ============================================================================

export const mockChatMessages = {
  lead_001: [
    {
      id: 'msg_001',
      leadId: 'lead_001',
      direction: 'outbound',
      content: 'Hola Ana, vi tu perfil en LinkedIn y creo que nuestra solución podría ser perfecta para TechCorp. ¿Tienes 10 minutos para una llamada rápida?',
      timestamp: '2026-03-16T10:15:00Z',
      isAiGenerated: true,
      sender: 'agent',
      confidence: 0.92,
    },
    {
      id: 'msg_002',
      leadId: 'lead_001',
      direction: 'inbound',
      content: 'Me interesa mucho la propuesta, ¿podemos agendar una llamada?',
      timestamp: '2026-03-16T14:30:00Z',
      isAiGenerated: false,
      sender: 'lead',
      sentiment: 'positive',
    },
    {
      id: 'msg_003',
      leadId: 'lead_001',
      direction: 'outbound',
      content: 'Claro Ana, me alegra mucho. ¿Te viene bien el jueves a las 3pm? Tengo 30 minutos disponibles. Podemos hacer una llamada de Zoom o Teams, como prefieras.',
      timestamp: '2026-03-16T14:35:00Z',
      isAiGenerated: true,
      sender: 'agent',
      confidence: 0.88,
    },
  ],
  lead_005: [
    {
      id: 'msg_010',
      leadId: 'lead_005',
      direction: 'outbound',
      content: 'Hola Laura, te escribo porque leí tu artículo sobre revenue stacks y creo que comparte nuestra visión sobre integraciones. ¿Podemos conversar?',
      timestamp: '2026-03-15T09:00:00Z',
      isAiGenerated: true,
      sender: 'agent',
      confidence: 0.95,
    },
    {
      id: 'msg_011',
      leadId: 'lead_005',
      direction: 'inbound',
      content: '¿Tienen integración nativa con Salesforce? Es un requisito indispensable.',
      timestamp: '2026-03-16T13:15:00Z',
      isAiGenerated: false,
      sender: 'lead',
      sentiment: 'neutral',
      keywords: ['Salesforce', 'integración'],
    },
    {
      id: 'msg_012',
      leadId: 'lead_005',
      direction: 'outbound',
      content: 'Sí Laura, tenemos integración bidireccional con Salesforce. Sincronizamos datos en tiempo real y manejamos custom fields. Te puedo enviar la documentación técnica y conectarte con nuestro team de integración.',
      timestamp: '2026-03-16T13:20:00Z',
      isAiGenerated: true,
      sender: 'agent',
      confidence: 0.91,
    },
  ],
}

// ============================================================================
// AI-GENERATED RESPONSE DRAFTS
// ============================================================================

export const mockResponses = [
  {
    id: 'resp_001',
    alertId: 'alert_001',
    leadId: 'lead_001',
    originalMessage: '¡Ana García respondió a tu mensaje! Dice: "Me interesa mucho la propuesta, ¿podemos agendar una llamada?"',
    draftResponse: 'Claro Ana, me alegra mucho. ¿Te viene bien el jueves a las 3pm? Tenemos 30 minutos disponibles. Podemos hacer una llamada de Zoom o Teams, como prefieras.',
    confidence: 0.88,
    generatedAt: '2026-03-16T14:35:00Z',
    status: 'pending_review',
    suggestedActions: ['schedule call', 'send calendar invite', 'prepare intro slides'],
    sentiment: 'positive',
    toneAnalysis: 'professional, friendly, action-oriented',
  },
  {
    id: 'resp_002',
    alertId: 'alert_002',
    leadId: 'lead_005',
    originalMessage: 'Laura Vega respondió: "¿Tienen integración nativa con Salesforce? Es un requisito indispensable."',
    draftResponse: 'Sí Laura, tenemos integración bidireccional con Salesforce. Sincronizamos datos en tiempo real, manejamos custom fields y workflows. Te puedo enviar la documentación técnica y conectarte directamente con nuestro team de integración para resolver cualquier duda técnica.',
    confidence: 0.91,
    generatedAt: '2026-03-16T13:20:00Z',
    status: 'approved',
    suggestedActions: ['send docs', 'schedule tech call', 'demo integration'],
    sentiment: 'neutral',
    toneAnalysis: 'confident, technical, solution-focused',
  },
  {
    id: 'resp_003',
    alertId: 'alert_003',
    leadId: 'lead_002',
    originalMessage: 'Han pasado 48h sin respuesta de Carlos Mendoza. Recomendamos un seguimiento.',
    draftResponse: 'Hola Carlos, quería hacer un seguimiento de mi mensaje anterior. ¿Tuviste oportunidad de revisar la propuesta? Entiendo que pueden ser tiempos ocupados, así que también puedo enviar un resumen ejecutivo si prefieres. Quedo atento a tus preguntas.',
    confidence: 0.85,
    generatedAt: '2026-03-15T09:00:00Z',
    status: 'pending_review',
    suggestedActions: ['send summary', 'call directly', 'schedule demo'],
    sentiment: 'neutral',
    toneAnalysis: 'polite, understanding, persistent',
  },
]

// ============================================================================
// LANGGRAPH AGENT RUNS
// ============================================================================

export const mockAgentRuns = [
  {
    id: 'run_001',
    leadId: 'lead_001',
    status: 'completed',
    input: 'Generate personalized outreach message for Ana García at TechCorp México, VP de Ventas',
    output: 'Hola Ana, vi tu perfil en LinkedIn y creo que nuestra solución podría ser perfecta para TechCorp. ¿Tienes 10 minutos para una llamada rápida?',
    startedAt: '2026-03-16T10:10:00Z',
    completedAt: '2026-03-16T10:15:00Z',
    durationMs: 5200,
    steps: [
      {
        node: 'research_lead',
        action: 'Retrieve lead profile and social data',
        result: 'Found LinkedIn profile, recent posts on sales automation',
        durationMs: 1200,
      },
      {
        node: 'analyze_company',
        action: 'Analyze company TechCorp México funding and growth',
        result: 'Series B funded, 250 employees, revenue scaling phase',
        durationMs: 800,
      },
      {
        node: 'generate_message',
        action: 'Generate personalized outreach leveraging research',
        result: 'Created message referencing relevant interests',
        durationMs: 2100,
      },
      {
        node: 'score_message',
        action: 'Score message personalization and effectiveness',
        result: 'Score: 0.92 - highly personalized, action-oriented',
        durationMs: 1100,
      },
    ],
    model: 'openai-codex/gpt-5.1-codex-mini',
    temperature: 0.7,
    tokens: {
      input: 450,
      output: 120,
      total: 570,
    },
  },
  {
    id: 'run_002',
    leadId: 'lead_005',
    status: 'completed',
    input: 'Generate response to Laura Vega asking about Salesforce integration',
    output: 'Sí Laura, tenemos integración bidireccional con Salesforce. Sincronizamos datos en tiempo real y manejamos custom fields. Te puedo enviar la documentación técnica y conectarte con nuestro team de integración.',
    startedAt: '2026-03-16T13:15:00Z',
    completedAt: '2026-03-16T13:20:00Z',
    durationMs: 4100,
    steps: [
      {
        node: 'analyze_question',
        action: 'Understand technical requirements in message',
        result: 'Key requirement: Salesforce native integration',
        durationMs: 600,
      },
      {
        node: 'retrieve_product_info',
        action: 'Fetch Salesforce integration documentation',
        result: 'Confirmed: bidirectional sync, real-time, custom fields supported',
        durationMs: 1200,
      },
      {
        node: 'generate_response',
        action: 'Generate response addressing technical concern',
        result: 'Technical response with next steps',
        durationMs: 1800,
      },
      {
        node: 'evaluate_response',
        action: 'Evaluate technical accuracy and tone',
        result: 'Confidence: 0.91 - accurate, professional, solution-focused',
        durationMs: 500,
      },
    ],
    model: 'openai-codex/gpt-5.1-codex-mini',
    temperature: 0.5,
    tokens: {
      input: 380,
      output: 95,
      total: 475,
    },
  },
  {
    id: 'run_003',
    leadId: 'lead_003',
    status: 'completed',
    input: 'Generate pre-interview research brief for Sofía Ramírez at StartupAI',
    output: 'Research brief showing Sofía is CTO with high technical influence, startup in AI/ML space, recent funding, relevant social presence.',
    startedAt: '2026-03-15T14:00:00Z',
    completedAt: '2026-03-15T14:15:00Z',
    durationMs: 9200,
    steps: [
      {
        node: 'gather_social_data',
        action: 'Collect LinkedIn, Twitter, public profiles',
        result: 'Found comprehensive profile, 3240 followers, thought leader in AI',
        durationMs: 2100,
      },
      {
        node: 'analyze_company',
        action: 'Research StartupAI funding, team, product',
        result: 'Series A startup, AI/ML focused, 45 employees',
        durationMs: 2800,
      },
      {
        node: 'generate_brief',
        action: 'Synthesize research into interview brief',
        result: 'Comprehensive brief with talking points and risks',
        durationMs: 3100,
      },
      {
        node: 'personalize_approach',
        action: 'Generate tailored conversation approach',
        result: 'Technical-first approach, emphasize infrastructure',
        durationMs: 1200,
      },
    ],
    model: 'openai-codex/gpt-5.1-codex-mini',
    temperature: 0.6,
    tokens: {
      input: 520,
      output: 380,
      total: 900,
    },
  },
]

// ============================================================================
// FILTER OPTIONS & CONSTANTS
// ============================================================================

export const filterOptions = {
  leadStatus: [
    { value: 'all', label: 'Todos los estados' },
    { value: 'new', label: 'Nuevo' },
    { value: 'contacted', label: 'Contactado' },
    { value: 'replied', label: 'Respondió' },
    { value: 'qualified', label: 'Calificado' },
    { value: 'closed', label: 'Cerrado' },
  ],
  leadSource: [
    { value: 'all', label: 'Todas las fuentes' },
    { value: 'extension', label: 'Extensión de Navegador' },
    { value: 'manual', label: 'Entrada Manual' },
    { value: 'api', label: 'Integración API' },
    { value: 'csv', label: 'Importación CSV' },
  ],
  scoreRange: [
    { value: 'all', label: 'Todos los scores' },
    { value: 'high', label: 'Alto (75+)' },
    { value: 'medium', label: 'Medio (50-74)' },
    { value: 'low', label: 'Bajo (<50)' },
  ],
  alertType: [
    { value: 'all', label: 'Todos los tipos' },
    { value: 'reply', label: 'Respuesta recibida' },
    { value: 'followup', label: 'Seguimiento necesario' },
    { value: 'score_change', label: 'Cambio de score' },
    { value: 'new_lead', label: 'Lead nuevo' },
    { value: 'connection_request', label: 'Solicitud conexión' },
  ],
  alertPriority: [
    { value: 'all', label: 'Todas las prioridades' },
    { value: 'high', label: 'Alta' },
    { value: 'medium', label: 'Media' },
    { value: 'low', label: 'Baja' },
  ],
  responseStatus: [
    { value: 'all', label: 'Todos los estados' },
    { value: 'pending_review', label: 'Pendiente revisión' },
    { value: 'approved', label: 'Aprobado' },
    { value: 'sent', label: 'Enviado' },
    { value: 'archived', label: 'Archivado' },
  ],
}

// ============================================================================
// STATE MANAGEMENT HELPERS
// ============================================================================

/**
 * Get leads by status
 */
export function getLeadsByStatus(status) {
  if (status === 'all' || !status) return mockLeads
  return mockLeads.filter(l => l.status === status)
}

/**
 * Get leads by score range
 */
export function getLeadsByScore(range) {
  switch (range) {
    case 'high':
      return mockLeads.filter(l => l.score >= 75)
    case 'medium':
      return mockLeads.filter(l => l.score >= 50 && l.score < 75)
    case 'low':
      return mockLeads.filter(l => l.score < 50)
    default:
      return mockLeads
  }
}

/**
 * Get alerts by type
 */
export function getAlertsByType(type) {
  if (type === 'all' || !type) return mockAlerts
  return mockAlerts.filter(a => a.type === type)
}

/**
 * Get alerts by priority
 */
export function getAlertsByPriority(priority) {
  if (priority === 'all' || !priority) return mockAlerts
  return mockAlerts.filter(a => a.priority === priority)
}

/**
 * Get unread alerts count
 */
export function getUnreadCount() {
  return mockAlerts.filter(a => !a.read).length
}

/**
 * Search leads by query
 */
export function searchLeads(query) {
  if (!query) return mockLeads
  const q = query.toLowerCase()
  return mockLeads.filter(l =>
    l.name.toLowerCase().includes(q) ||
    l.company.toLowerCase().includes(q) ||
    l.email.toLowerCase().includes(q)
  )
}

/**
 * Get lead by ID
 */
export function getLeadById(id) {
  return mockLeads.find(l => l.id === id)
}

/**
 * Get alerts for a specific lead
 */
export function getAlertsForLead(leadId) {
  return mockAlerts.filter(a => a.lead.id === leadId)
}

/**
 * Get chat history for a lead
 */
export function getChatHistoryForLead(leadId) {
  return mockChatMessages[leadId] || []
}

/**
 * Get research data for a lead
 */
export function getResearchForLead(leadId) {
  return mockResearch[leadId] || null
}

/**
 * Get agent runs by status
 */
export function getAgentRunsByStatus(status) {
  if (status === 'all' || !status) return mockAgentRuns
  return mockAgentRuns.filter(r => r.status === status)
}

/**
 * Format lead score with color
 */
export function getScoreColor(score) {
  if (score >= 75) return '#22c55e' // green
  if (score >= 50) return '#f59e0b' // amber
  return '#ef4444' // red
}

/**
 * Format date to Spanish locale
 */
export function formatDate(dateString) {
  if (!dateString) return '—'
  const date = new Date(dateString)
  return date.toLocaleDateString('es-MX', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
  })
}

/**
 * Format time ago (e.g., "hace 2 horas")
 */
export function formatTimeAgo(dateString) {
  if (!dateString) return '—'
  const date = new Date(dateString)
  const now = new Date()
  const seconds = Math.floor((now - date) / 1000)

  if (seconds < 60) return 'hace unos segundos'
  const minutes = Math.floor(seconds / 60)
  if (minutes < 60) return `hace ${minutes}m`
  const hours = Math.floor(minutes / 60)
  if (hours < 24) return `hace ${hours}h`
  const days = Math.floor(hours / 24)
  return `hace ${days}d`
}
