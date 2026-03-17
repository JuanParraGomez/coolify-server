const layers = [
  {
    title: 'Capa de Presentación (Frontend)',
    color: '#3b82f6',
    items: [
      'React 18 SPA — Dashboard principal de leads',
      'Extensión de navegador (Chrome/Firefox) — Chat flotante',
      'Panel de notificaciones — Respuestas en tiempo real',
      'Compositor de respuestas IA — Editor enriquecido',
      'Módulo de investigación social — Vista de perfil',
      'Sección de configuración — Gestión de API keys',
    ],
  },
  {
    title: 'Capa de Orquestación (LangGraph Agent Server)',
    color: '#8b5cf6',
    items: [
      'Grafo de agente LangGraph — Nodos: research → draft → review',
      'Nodo de generación de leads — Extracción desde LinkedIn/Web',
      'Nodo de investigación social — Perfil, intereses, triggers de compra',
      'Nodo de redacción — Generación de respuestas personalizadas',
      'Nodo de notificación — WebSocket / SSE para alertas',
      'Selector de modelo — Gemini / OpenAI / Claude / Deepseek',
    ],
  },
  {
    title: 'Capa de Servicios REST (Backend API)',
    color: '#10b981',
    items: [
      'POST /api/leads — Crear y registrar nuevo lead',
      'GET  /api/leads — Listar leads con filtros y paginación',
      'POST /api/research/{leadId} — Iniciar investigación social',
      'GET  /api/research/{leadId} — Obtener perfil investigado',
      'POST /api/reply/draft — Generar borrador con IA',
      'POST /api/notifications/subscribe — Suscribirse a alertas SSE',
      'POST /api/config/keys — Guardar API keys (cifradas)',
    ],
  },
  {
    title: 'Capa de Datos y Almacenamiento',
    color: '#f59e0b',
    items: [
      'PostgreSQL — Leads, conversaciones, perfiles investigados',
      'Redis — Cola de tareas async, caché de perfiles',
      'Vault / KMS — Almacenamiento seguro de API keys',
      'Vector DB (pgvector) — Embeddings para similaridad de leads',
    ],
  },
  {
    title: 'Extensión de Navegador',
    color: '#ef4444',
    items: [
      'Content Script — Inyección del chat en páginas web',
      'Background Service Worker — Comunicación con backend',
      'Popup — Acceso rápido al dashboard y notificaciones',
      'Storage local — Cache de conversaciones en el navegador',
    ],
  },
]

export default function ArchitecturePlan() {
  return (
    <section>
      <h2 className="section-title">Arquitectura del Sistema</h2>
      <p className="section-desc">
        Sistema de 5 capas desacopladas. El frontend React consume REST endpoints con clientes
        tipados. El servidor LangGraph orquesta los agentes de IA. La extensión de navegador
        actúa como canal de captura de leads y chat contextual.
      </p>

      <div className="arch-diagram">
        {layers.map((layer, i) => (
          <div key={i} className="arch-layer" style={{ borderLeftColor: layer.color }}>
            <h3 className="arch-layer-title" style={{ color: layer.color }}>{layer.title}</h3>
            <ul className="arch-list">
              {layer.items.map((item, j) => (
                <li key={j} className="arch-item">
                  <span className="arch-dot" style={{ background: layer.color }} />
                  {item}
                </li>
              ))}
            </ul>
          </div>
        ))}
      </div>

      <div className="callout">
        <strong>Patrón de integración:</strong> El frontend NO llama directamente a los modelos de IA.
        Toda inferencia pasa por el LangGraph Agent Server, que selecciona el modelo según la clave
        configurada. El modelo de runtime por defecto es <code>openai-codex/gpt-5.1-codex-mini</code>.
      </div>
    </section>
  )
}
