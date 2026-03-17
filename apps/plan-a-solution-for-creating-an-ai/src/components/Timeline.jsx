const phases = [
  {
    phase: 'Fase 1',
    title: 'Fundación y Configuración',
    duration: '1 semana',
    weeks: 1,
    color: '#3b82f6',
    tasks: [
      { task: 'Configurar monorepo (frontend + backend + extension)', days: '2d' },
      { task: 'Setup FastAPI + PostgreSQL + Redis (Docker Compose)', days: '1d' },
      { task: 'Sección de API Keys — formulario y almacenamiento cifrado', days: '2d' },
      { task: 'Selector de modelo IA + validación de claves', days: '1d' },
    ],
    deliverable: 'Infraestructura base funcional. API keys configurables desde UI.',
  },
  {
    phase: 'Fase 2',
    title: 'Dashboard de Leads + REST Básico',
    duration: '1.5 semanas',
    weeks: 1.5,
    color: '#8b5cf6',
    tasks: [
      { task: 'Endpoints REST: GET/POST /api/leads', days: '2d' },
      { task: 'Hook useLeads() con paginación y filtros', days: '1d' },
      { task: 'Tabla de leads con estado y acciones', days: '2d' },
      { task: 'Drawer de perfil del lead (LeadProfile)', days: '2d' },
      { task: 'Validación de inputs y manejo de errores', days: '1d' },
    ],
    deliverable: 'Dashboard funcional con CRUD de leads consumiendo REST.',
  },
  {
    phase: 'Fase 3',
    title: 'Extensión de Navegador',
    duration: '1.5 semanas',
    weeks: 1.5,
    color: '#ef4444',
    tasks: [
      { task: 'Scaffold extensión Chrome MV3', days: '1d' },
      { task: 'Content script: ChatWidget flotante', days: '3d' },
      { task: 'Background worker: comunicación con backend', days: '2d' },
      { task: 'Popup: vista rápida de leads recientes', days: '1d' },
      { task: 'Captura de contexto de página → POST /api/leads', days: '1d' },
    ],
    deliverable: 'Extensión instalable que captura leads desde cualquier página web.',
  },
  {
    phase: 'Fase 4',
    title: 'Agente LangGraph + Redacción IA',
    duration: '2 semanas',
    weeks: 2,
    color: '#10b981',
    tasks: [
      { task: 'Grafo LangGraph: nodos draft → review', days: '3d' },
      { task: 'Endpoint POST /api/reply/draft con streaming SSE', days: '2d' },
      { task: 'Compositor de respuestas con streaming de tokens', days: '2d' },
      { task: 'Integración multi-modelo (OpenAI, Claude, Gemini, Deepseek)', days: '2d' },
      { task: 'Tests de calidad de respuestas generadas', days: '1d' },
    ],
    deliverable: 'Redacción de respuestas personalizadas en streaming con cualquier modelo.',
  },
  {
    phase: 'Fase 5',
    title: 'Investigación Social de Decisores',
    duration: '2 semanas',
    weeks: 2,
    color: '#f59e0b',
    tasks: [
      { task: 'Nodo LangGraph: research (LinkedIn, web pública)', days: '3d' },
      { task: 'Nodo análisis: intereses, cargo, triggers de compra', days: '2d' },
      { task: 'Endpoint POST /api/research/{leadId} + Celery async', days: '2d' },
      { task: 'Vista SocialResearch con SSE progress', days: '2d' },
      { task: 'Validación de resultados y manejo de fuentes no disponibles', days: '1d' },
    ],
    deliverable: 'Investigación automática de decisores con perfil, intereses y triggers.',
  },
  {
    phase: 'Fase 6',
    title: 'Notificaciones + Polish',
    duration: '1 semana',
    weeks: 1,
    color: '#64748b',
    tasks: [
      { task: 'SSE /api/notifications/subscribe', days: '1d' },
      { task: 'NotificationCenter con badges y lista de alertas', days: '2d' },
      { task: 'Notificación en extensión (badge icono + popup)', days: '1d' },
      { task: 'Tests E2E de flujos principales', days: '1d' },
    ],
    deliverable: 'Sistema completo con notificaciones en tiempo real. Listo para producción.',
  },
]

const totalWeeks = phases.reduce((sum, p) => sum + p.weeks, 0)

export default function Timeline() {
  return (
    <section>
      <h2 className="section-title">Cronograma de Implementación</h2>
      <p className="section-desc">
        Duración total estimada: <strong>{totalWeeks} semanas (~{Math.round(totalWeeks * 7 / 5)} días hábiles)</strong> con 1 desarrollador fullstack.
        Con 2 desarrolladores (frontend + backend en paralelo) se puede reducir a ~5 semanas.
      </p>

      <div className="timeline-bar-wrap">
        <div className="timeline-bar">
          {phases.map((p, i) => (
            <div
              key={i}
              className="timeline-seg"
              style={{
                background: p.color,
                flex: p.weeks,
                title: p.title,
              }}
              title={`${p.phase}: ${p.title} (${p.duration})`}
            >
              <span className="timeline-seg-label">{p.phase}</span>
            </div>
          ))}
        </div>
        <div className="timeline-bar-legend">
          {phases.map((p, i) => (
            <span key={i} className="timeline-legend-item">
              <span className="legend-dot" style={{ background: p.color }} />
              {p.phase}: {p.duration}
            </span>
          ))}
        </div>
      </div>

      <div className="phases-list">
        {phases.map((p, pi) => (
          <div key={pi} className="phase-block" style={{ borderLeftColor: p.color }}>
            <div className="phase-header">
              <span className="phase-label" style={{ background: p.color }}>{p.phase}</span>
              <span className="phase-title">{p.title}</span>
              <span className="phase-duration" style={{ color: p.color }}>{p.duration}</span>
            </div>
            <div className="phase-tasks">
              {p.tasks.map((t, ti) => (
                <div key={ti} className="phase-task">
                  <span className="task-days" style={{ color: p.color }}>{t.days}</span>
                  <span>{t.task}</span>
                </div>
              ))}
            </div>
            <div className="phase-deliverable">
              <strong>Entregable:</strong> {p.deliverable}
            </div>
          </div>
        ))}
      </div>

      <div className="callout callout-blue">
        <strong>Supuestos del cronograma:</strong>
        <ul style={{ margin: '0.5rem 0 0 1rem', paddingLeft: '1rem' }}>
          <li>1 desarrollador fullstack dedicado a tiempo completo</li>
          <li>APIs externas (LinkedIn, redes sociales) disponibles y con permisos</li>
          <li>Infraestructura de Coolify ya provisionada</li>
          <li>Claves API de modelos disponibles desde el día 1 de Fase 4</li>
          <li>No incluye UX research ni diseño gráfico profesional</li>
        </ul>
      </div>
    </section>
  )
}
