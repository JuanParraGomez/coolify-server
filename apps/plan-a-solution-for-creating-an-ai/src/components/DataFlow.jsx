const flows = [
  {
    title: 'Flujo 1: Captura de Lead desde Extensión',
    color: '#3b82f6',
    steps: [
      { step: 1, actor: 'Extensión', action: 'Usuario hace clic en botón de chat en página web' },
      { step: 2, actor: 'Content Script', action: 'Extrae: URL, título, nombre de empresa, nombre de persona visible' },
      { step: 3, actor: 'Extension → Backend', action: 'POST /api/leads { source, pageContext, contactInfo }' },
      { step: 4, actor: 'Backend', action: 'Crea lead en PostgreSQL con estado "nuevo"' },
      { step: 5, actor: 'LangGraph', action: 'Trigger automático: nodo de enriquecimiento inicial' },
      { step: 6, actor: 'Frontend Dashboard', action: 'Lead aparece en tabla vía polling o SSE push' },
    ],
  },
  {
    title: 'Flujo 2: Investigación de Decisor Social',
    color: '#8b5cf6',
    steps: [
      { step: 1, actor: 'Usuario', action: 'Abre perfil del lead → clic en "Investigar"' },
      { step: 2, actor: 'Frontend', action: 'POST /api/research/{leadId} — inicia tarea async' },
      { step: 3, actor: 'LangGraph', action: 'Nodo research: busca LinkedIn, Twitter/X, web pública' },
      { step: 4, actor: 'LangGraph', action: 'Nodo análisis: extrae intereses, cargo, triggers de compra' },
      { step: 5, actor: 'Backend → SSE', action: 'Emite eventos de progreso: searching → analyzing → done' },
      { step: 6, actor: 'Frontend', action: 'useResearch() recibe eventos SSE y actualiza UI en tiempo real' },
      { step: 7, actor: 'Frontend', action: 'Muestra: perfil, intereses, señales de compra, resumen ejecutivo' },
    ],
  },
  {
    title: 'Flujo 3: Generación de Respuesta IA',
    color: '#10b981',
    steps: [
      { step: 1, actor: 'Usuario', action: 'Abre compositor → "Generar respuesta con IA"' },
      { step: 2, actor: 'Frontend', action: 'POST /api/reply/draft { leadId, conversationHistory, model }' },
      { step: 3, actor: 'Backend', action: 'Valida API key del modelo seleccionado' },
      { step: 4, actor: 'LangGraph', action: 'Nodo draft: genera borrador personalizado con contexto del lead' },
      { step: 5, actor: 'LangGraph', action: 'Nodo review: auto-revisa tono, longitud y relevancia' },
      { step: 6, actor: 'Backend → Stream', action: 'Respuesta en streaming (tokens) al frontend' },
      { step: 7, actor: 'Frontend', action: 'useReplyDraft() muestra tokens en tiempo real en el editor' },
      { step: 8, actor: 'Usuario', action: 'Edita y envía el mensaje finalizado' },
    ],
  },
  {
    title: 'Flujo 4: Notificación de Respuesta de Lead',
    color: '#f59e0b',
    steps: [
      { step: 1, actor: 'Lead', action: 'Responde al mensaje (email, LinkedIn, web)' },
      { step: 2, actor: 'Webhook / Integración', action: 'Evento entrante → POST /api/webhooks/message' },
      { step: 3, actor: 'Backend', action: 'Asocia mensaje al lead, actualiza estado a "respondido"' },
      { step: 4, actor: 'Backend → SSE', action: 'Emite notificación al canal SSE del usuario' },
      { step: 5, actor: 'Extensión (Background)', action: 'Recibe notificación → muestra badge en icono + popup' },
      { step: 6, actor: 'Frontend Dashboard', action: 'useNotifications() actualiza contador y lista de alertas' },
    ],
  },
]

export default function DataFlow() {
  return (
    <section>
      <h2 className="section-title">Flujo de Datos</h2>
      <p className="section-desc">
        4 flujos principales. Los flujos 2, 3 y 4 usan SSE (Server-Sent Events) para
        actualizaciones en tiempo real sin necesidad de WebSockets.
        El cliente REST tipado envía la API key y el modelo seleccionado en cada petición.
      </p>

      {flows.map((flow, fi) => (
        <div key={fi} className="flow-block" style={{ borderTopColor: flow.color }}>
          <h3 className="flow-title" style={{ color: flow.color }}>{flow.title}</h3>
          <div className="flow-steps">
            {flow.steps.map((s, si) => (
              <div key={si} className="flow-step">
                <div className="flow-num" style={{ background: flow.color }}>{s.step}</div>
                <div className="flow-content">
                  <span className="flow-actor">{s.actor}</span>
                  <span className="flow-action">{s.action}</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      ))}

      <div className="callout">
        <strong>Estrategia REST + Typed Clients:</strong> Cada servicio tiene su cliente tipado
        en <code>src/services/</code>. Ejemplo: <code>leadsApi.create(data: CreateLeadInput): Promise&lt;Lead&gt;</code>.
        Los tipos se comparten entre el cliente y el servidor (monorepo de tipos en <code>src/types/</code>).
        Las claves API nunca viajan en el frontend — se almacenan en el backend y el frontend solo
        indica qué proveedor usar.
      </div>
    </section>
  )
}
