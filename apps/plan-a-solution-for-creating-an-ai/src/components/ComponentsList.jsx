const modules = [
  {
    module: 'Dashboard de Leads',
    file: 'src/pages/LeadsDashboard.jsx',
    desc: 'Vista principal con tabla de leads, estado de conversación, y acciones rápidas. Consume GET /api/leads con paginación.',
    hooks: 'useLeads(filters, page)',
    priority: 'Alta',
  },
  {
    module: 'Chat de Extensión',
    file: 'extension/content/ChatWidget.jsx',
    desc: 'Widget flotante inyectado en páginas web. Captura contexto de la página actual y lo envía como nuevo lead.',
    hooks: 'useChatSession(pageContext)',
    priority: 'Alta',
  },
  {
    module: 'Sistema de Notificaciones',
    file: 'src/components/NotificationCenter.jsx',
    desc: 'Panel de alertas en tiempo real vía SSE. Notifica cuando un lead responde o cuando finaliza una investigación.',
    hooks: 'useNotifications(userId)',
    priority: 'Alta',
  },
  {
    module: 'Compositor de Respuestas IA',
    file: 'src/components/ReplyComposer.jsx',
    desc: 'Editor con generación asistida. Botón "Generar con IA" llama POST /api/reply/draft. Permite edición manual antes de enviar.',
    hooks: 'useReplyDraft(leadId, context)',
    priority: 'Alta',
  },
  {
    module: 'Investigación Social',
    file: 'src/pages/SocialResearch.jsx',
    desc: 'Vista de perfil del decisor: intereses, historial profesional, señales de compra. Datos obtenidos via POST /api/research/{leadId}.',
    hooks: 'useResearch(leadId)',
    priority: 'Media',
  },
  {
    module: 'Configuración de API Keys',
    file: 'src/pages/ApiSettings.jsx',
    desc: 'Formulario para registrar claves de Gemini, OpenAI, Claude y Deepseek. Las claves se guardan cifradas en el servidor.',
    hooks: 'useApiConfig()',
    priority: 'Alta',
  },
  {
    module: 'Selector de Modelo IA',
    file: 'src/components/ModelSelector.jsx',
    desc: 'Dropdown para elegir el proveedor y modelo activo. Persiste la selección y la envía al backend en cada petición.',
    hooks: 'useModelConfig()',
    priority: 'Media',
  },
  {
    module: 'Perfil del Lead',
    file: 'src/components/LeadProfile.jsx',
    desc: 'Drawer lateral con historial de conversaciones, datos de contacto, score de interés, y timeline de interacciones.',
    hooks: 'useLead(leadId)',
    priority: 'Media',
  },
]

const hookDefs = [
  { name: 'useLeads', sig: 'useLeads(filters, page)', returns: '{ leads, total, loading, error, refetch }' },
  { name: 'useLead', sig: 'useLead(leadId)', returns: '{ lead, conversations, loading }' },
  { name: 'useReplyDraft', sig: 'useReplyDraft(leadId, ctx)', returns: '{ draft, generating, generate, setDraft }' },
  { name: 'useResearch', sig: 'useResearch(leadId)', returns: '{ profile, triggers, status, startResearch }' },
  { name: 'useNotifications', sig: 'useNotifications(userId)', returns: '{ notifications, unread, markRead }' },
  { name: 'useApiConfig', sig: 'useApiConfig()', returns: '{ keys, activeModel, save, loading }' },
  { name: 'useModelConfig', sig: 'useModelConfig()', returns: '{ model, provider, setModel }' },
]

const priorityColor = { Alta: '#ef4444', Media: '#f59e0b', Baja: '#10b981' }

export default function ComponentsList() {
  return (
    <section>
      <h2 className="section-title">Componentes Principales</h2>
      <p className="section-desc">
        Estructura de archivos recomendada para el proyecto React. Cada módulo tiene
        su hook de datos dedicado que consume los REST endpoints con clientes tipados.
      </p>

      <div className="table-wrap">
        <table className="data-table">
          <thead>
            <tr>
              <th>Módulo</th>
              <th>Archivo</th>
              <th>Descripción</th>
              <th>Hook</th>
              <th>Prioridad</th>
            </tr>
          </thead>
          <tbody>
            {modules.map((m, i) => (
              <tr key={i}>
                <td><strong>{m.module}</strong></td>
                <td><code className="code-cell">{m.file}</code></td>
                <td className="desc-cell">{m.desc}</td>
                <td><code className="code-cell">{m.hooks}</code></td>
                <td>
                  <span className="badge-priority" style={{ background: priorityColor[m.priority] }}>
                    {m.priority}
                  </span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <h3 className="subsection-title">Data Hooks — Contratos</h3>
      <p className="section-desc">
        Todos los hooks siguen el patrón: fetch en montaje, manejo de errores, estado de carga
        y revalidación manual. Usan <code>fetch()</code> con clientes REST tipados.
      </p>
      <div className="hook-grid">
        {hookDefs.map((h, i) => (
          <div key={i} className="hook-card">
            <div className="hook-name">{h.name}</div>
            <code className="hook-sig">{h.sig}</code>
            <div className="hook-returns">→ {h.returns}</div>
          </div>
        ))}
      </div>

      <div className="callout callout-green">
        <strong>Estructura de carpetas sugerida:</strong>
        <pre className="dir-tree">{`src/
├── components/     # UI reutilizables (ModelSelector, LeadProfile, NotificationCenter)
├── pages/          # Vistas completas (LeadsDashboard, SocialResearch, ApiSettings)
├── hooks/          # Data hooks (useLeads, useReplyDraft, useResearch…)
├── services/       # REST clients tipados (leadsApi, aiApi, researchApi)
├── types/          # TypeScript interfaces (Lead, Profile, ReplyDraft…)
└── utils/          # Helpers (formatDate, maskApiKey, parseSSE…)

extension/
├── content/        # ChatWidget inyectado en páginas
├── background/     # Service worker
└── popup/          # Popup de la extensión`}</pre>
      </div>
    </section>
  )
}
