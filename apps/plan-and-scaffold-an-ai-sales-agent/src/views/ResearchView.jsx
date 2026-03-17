import React, { useState } from 'react'
import { useResearch } from '../hooks/useResearch.js'

export function ResearchView({ selectedLead }) {
  const { report, loading, searchContact, researchLead } = useResearch()
  const [query, setQuery] = useState(selectedLead?.name ?? '')

  const handleSearch = () => {
    if (selectedLead) {
      researchLead(selectedLead.id)
    } else {
      searchContact(query)
    }
  }

  return (
    <div className="view">
      <div className="card-header mb-2">
        <h2 className="card-title">Investigación Social Pre-Entrevista</h2>
      </div>

      {/* Search */}
      <div className="card mb-2">
        <div className="form-group">
          <label className="form-label">Buscar tomador de decisiones</label>
          <div className="flex gap-1">
            <input
              className="input"
              placeholder="Nombre, empresa o LinkedIn URL..."
              value={query}
              onChange={e => setQuery(e.target.value)}
              onKeyDown={e => e.key === 'Enter' && handleSearch()}
            />
            <button
              className="btn btn-primary"
              onClick={handleSearch}
              disabled={loading || (!query && !selectedLead)}
            >
              {loading ? <span className="spinner" /> : '🔍 Investigar'}
            </button>
          </div>
        </div>
        {selectedLead && (
          <p className="text-sm text-muted">
            Investigando: <strong>{selectedLead.name}</strong> — {selectedLead.title}
          </p>
        )}
      </div>

      {report && (
        <>
          {/* Profile */}
          <div className="grid-2 mb-2">
            <div className="card">
              <div className="card-header">
                <span className="card-title">Perfil</span>
              </div>
              <div>
                <p><strong>{report.profile.name}</strong></p>
                <p className="text-muted text-sm">{report.profile.title}</p>
                <p className="text-muted text-sm">{report.profile.company}</p>
                {report.profile.bio && <p className="mt-1 text-sm">{report.profile.bio}</p>}
                {report.profile.linkedin_url && (
                  <p className="mt-1 text-sm">
                    🔗 <a href={report.profile.linkedin_url} target="_blank" rel="noopener noreferrer" style={{ color: 'var(--primary)' }}>LinkedIn</a>
                  </p>
                )}
              </div>
            </div>

            <div className="card">
              <div className="card-header">
                <span className="card-title">Intereses detectados</span>
              </div>
              <div className="flex flex-col gap-1">
                {(report.profile.interests ?? []).map((interest, i) => (
                  <span key={i} className="badge-status" style={{ background: 'rgba(99,102,241,0.12)', color: 'var(--primary)', width: 'fit-content' }}>
                    {interest}
                  </span>
                ))}
              </div>
            </div>
          </div>

          {/* Summary */}
          <div className="card mb-2">
            <div className="card-header">
              <span className="card-title">Resumen ejecutivo</span>
              <span className="text-sm text-muted">✨ Generado por IA</span>
            </div>
            <p style={{ lineHeight: 1.6 }}>{report.summary}</p>
          </div>

          {/* Recent posts */}
          {report.profile.recent_posts?.length > 0 && (
            <div className="card mb-2">
              <div className="card-header">
                <span className="card-title">Actividad reciente</span>
              </div>
              <div className="flex flex-col gap-1">
                {report.profile.recent_posts.map((post, i) => (
                  <div key={i} style={{ padding: '0.5rem 0.75rem', background: 'var(--surface2)', borderRadius: 'var(--radius)', fontSize: '13.5px' }}>
                    📝 {post}
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Talking points */}
          <div className="card">
            <div className="card-header">
              <span className="card-title">Puntos clave para la conversación</span>
              <span className="text-sm text-muted">✨ IA</span>
            </div>
            <ul className="talking-points">
              {report.talking_points.map((point, i) => (
                <li key={i}>✓ {point}</li>
              ))}
            </ul>
          </div>
        </>
      )}

      {!report && !loading && (
        <div className="empty-state">
          <div className="empty-icon">🔍</div>
          <p>Busca un tomador de decisiones para ver su perfil social y puntos clave de conversación.</p>
        </div>
      )}
    </div>
  )
}
