const risks = [
  {
    id: 'R1',
    category: 'Técnico',
    severity: 'Alta',
    risk: 'Rate limits y bloqueos en scraping de redes sociales',
    impact: 'La investigación social puede fallar silenciosamente o devolver datos incompletos.',
    mitigation: [
      'Usar APIs oficiales donde existan (LinkedIn API, Twitter API v2)',
      'Implementar reintentos con backoff exponencial en LangGraph',
      'Caché de perfiles en Redis (TTL 24h) para evitar re-scraping',
      'Diseñar UI para mostrar resultados parciales graciosamente',
    ],
    color: '#ef4444',
  },
  {
    id: 'R2',
    category: 'Seguridad',
    severity: 'Alta',
    risk: 'Filtración de API keys de los usuarios',
    impact: 'Costo económico para el usuario y pérdida de confianza.',
    mitigation: [
      'Las claves NUNCA se almacenan en frontend ni en texto plano en BD',
      'Cifrado AES-256 o Vault antes de persistir',
      'Logs de uso de claves sin revelar el valor',
      'Opción de revocar y rotar claves desde la UI',
    ],
    color: '#ef4444',
  },
  {
    id: 'R3',
    category: 'Técnico',
    severity: 'Media',
    risk: 'Extensión de navegador rechazada por Chrome Web Store',
    impact: 'Distribución limitada, usuarios deben instalar en modo desarrollador.',
    mitigation: [
      'Revisar políticas de Chrome Web Store antes del desarrollo',
      'No usar eval() ni código remoto en el manifest',
      'Declarar permisos mínimos necesarios (activeTab, storage)',
      'Preparar plan B: extensión Firefox o versión web-only',
    ],
    color: '#f59e0b',
  },
  {
    id: 'R4',
    category: 'Producto',
    severity: 'Media',
    risk: 'Calidad insuficiente de respuestas IA generadas',
    impact: 'Los usuarios no confían en las sugerencias y no adoptan la herramienta.',
    mitigation: [
      'Prompts de sistema con ejemplos de respuestas de calidad (few-shot)',
      'Nodo de revisión en LangGraph antes de mostrar al usuario',
      'Feedback loop: usuarios pueden votar respuestas (👍/👎)',
      'Fine-tuning opcional con respuestas aprobadas del usuario',
    ],
    color: '#f59e0b',
  },
  {
    id: 'R5',
    category: 'Legal / Compliance',
    severity: 'Media',
    risk: 'Violación de RGPD/GDPR por recopilar datos de personas sin consentimiento',
    impact: 'Sanciones regulatorias y daño reputacional.',
    mitigation: [
      'Solo investigar perfiles públicos y datos accesibles públicamente',
      'Política de privacidad clara que describe qué datos se recopilan',
      'Opción de eliminar todos los datos de un lead bajo solicitud',
      'No almacenar datos de redes sociales más allá del período necesario',
    ],
    color: '#f59e0b',
  },
  {
    id: 'R6',
    category: 'Técnico',
    severity: 'Baja',
    risk: 'Latencia alta en generación de respuestas IA',
    impact: 'Mala experiencia de usuario si el borrador tarda más de 5 segundos.',
    mitigation: [
      'Streaming de tokens (SSE) para mostrar respuesta mientras se genera',
      'Indicador de progreso durante generación',
      'Timeout de 30s con mensaje de error claro',
      'Opción de cancelar la generación en curso',
    ],
    color: '#10b981',
  },
  {
    id: 'R7',
    category: 'Operacional',
    severity: 'Baja',
    risk: 'Costos de API IA descontrolados con volumen alto de leads',
    impact: 'Costos imprevistos para el operador del sistema.',
    mitigation: [
      'Límites de uso configurables por usuario/mes en el backend',
      'Dashboard de uso y costo estimado por proveedor',
      'Priorizar modelos económicos (gpt-5.1-codex-mini, Gemini Flash) por defecto',
      'Alertas cuando el gasto mensual supere un umbral configurable',
    ],
    color: '#10b981',
  },
]

const sevColor = { Alta: '#ef4444', Media: '#f59e0b', Baja: '#10b981' }

const deploymentNotes = [
  'Frontend React se despliega en Coolify vía autodeploy desde rama main',
  'Variables de entorno: VITE_API_URL=https://api.tu-dominio.com (nunca claves IA)',
  'Backend FastAPI se despliega como servicio separado en el mismo Coolify',
  'Redis y PostgreSQL como servicios adicionales en Coolify o servicios externos',
  'Extensión de navegador: build separado, distribuir como .crx o Chrome Web Store',
  'Habilitar HTTPS obligatorio — las claves API viajan solo por TLS',
  'Rate limiting en Nginx/Traefik frente al backend (100 req/min por IP)',
]

const validations = [
  'Inputs de API key: validar formato (prefijo correcto) antes de enviar al backend',
  'Leads: email y nombre requeridos, URL opcional pero validada si se provee',
  'Respuestas IA: longitud máxima 2000 caracteres, sin HTML crudo',
  'Perfiles investigados: marcar campos como "no encontrado" en lugar de null',
  'SSE: timeout de reconexión automática con máximo 3 intentos',
  'Extensión: solicitar permisos solo cuando se necesiten (permisos opcionales)',
]

export default function Risks() {
  return (
    <section>
      <h2 className="section-title">Riesgos, Validación y Despliegue</h2>
      <p className="section-desc">
        Matriz de riesgos priorizados por severidad. Todos tienen mitigaciones
        concretas e implementables.
      </p>

      <div className="risks-grid">
        {risks.map((r) => (
          <div key={r.id} className="risk-card" style={{ borderTopColor: r.color }}>
            <div className="risk-header">
              <span className="risk-id" style={{ color: r.color }}>{r.id}</span>
              <span className="risk-category">{r.category}</span>
              <span className="badge-priority" style={{ background: sevColor[r.severity] }}>
                {r.severity}
              </span>
            </div>
            <div className="risk-title">{r.risk}</div>
            <div className="risk-impact">
              <strong>Impacto:</strong> {r.impact}
            </div>
            <div className="risk-mitigations">
              <strong>Mitigaciones:</strong>
              <ul>
                {r.mitigation.map((m, i) => (
                  <li key={i}>{m}</li>
                ))}
              </ul>
            </div>
          </div>
        ))}
      </div>

      <h3 className="subsection-title">Validaciones Clave</h3>
      <div className="check-list">
        {validations.map((v, i) => (
          <div key={i} className="check-item">
            <span className="check-icon">✓</span>
            <span>{v}</span>
          </div>
        ))}
      </div>

      <h3 className="subsection-title">Notas de Despliegue</h3>
      <div className="deploy-list">
        {deploymentNotes.map((n, i) => (
          <div key={i} className="deploy-item">
            <span className="deploy-icon">→</span>
            <span>{n}</span>
          </div>
        ))}
      </div>

      <div className="callout callout-blue">
        <strong>Estrategia de datos (REST + Typed Clients):</strong> Todos los endpoints
        devuelven respuestas tipadas. El cliente REST en <code>src/services/</code> valida
        la forma de la respuesta con Zod o TypeScript interfaces. Los errores HTTP (4xx, 5xx)
        se convierten en errores tipados que el hook propaga al componente.
      </div>
    </section>
  )
}
