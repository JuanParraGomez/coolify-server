export default function Header() {
  return (
    <header className="header">
      <div className="header-badge">Plan de Implementación</div>
      <h1 className="header-title">Agente de Ventas con IA</h1>
      <p className="header-subtitle">
        Asistente inteligente para generación de leads, investigación de decisores
        y redacción de respuestas con IA. Extensión de navegador incluida.
      </p>
      <div className="header-meta">
        <span className="badge badge-blue">React 18 + Vite</span>
        <span className="badge badge-purple">LangGraph</span>
        <span className="badge badge-green">REST API</span>
        <span className="badge badge-orange">openai-codex / gpt-5.1-codex-mini</span>
      </div>
      <div className="runtime-note">
        ⚠️ Nota: El modelo de runtime por defecto es <strong>openai-codex/gpt-5.1-codex-mini</strong>,
        diferente al modelo de generación de este plan (claude-sonnet-4-6).
        Configurar la clave API correspondiente en la sección "Config API".
      </div>
    </header>
  )
}
