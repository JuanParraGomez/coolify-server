import React from 'react'
import { ESTADO_OPTIONS, CANAL_OPTIONS, RESPONDIO_OPTIONS, RISK_OPTIONS } from '../lib/mock-data'

/**
 * FiltersPanel Component
 * Reusable, production-ready filters panel for the leads table
 * Provides search, status, channel, response, and risk filters
 * Supports advanced filtering with active filter summary
 */
export default function FiltersPanel({
  query = '',
  estado = 'todos',
  canal = 'todos',
  respondio = 'todos',
  riesgo = 'todos',
  onQueryChange = () => {},
  onEstadoChange = () => {},
  onCanalChange = () => {},
  onRespondioChange = () => {},
  onRiesgoChange = () => {},
  onReset = () => {},
}) {
  const T = {
    surface: '#1a1d27',
    border: '#2a2d3e',
    text: '#e2e8f0',
    muted: '#94a3b8',
    accent: '#6366f1',
  }

  const inputStyle = {
    background: T.surface,
    border: `1px solid ${T.border}`,
    borderRadius: 6,
    color: T.text,
    padding: '8px 12px',
    fontSize: 13,
    outline: 'none',
  }

  const selectStyle = {
    ...inputStyle,
    cursor: 'pointer',
  }

  const buttonStyle = {
    background: T.accent + '22',
    color: T.accent,
    border: `1px solid ${T.accent}44`,
    borderRadius: 6,
    padding: '8px 12px',
    fontSize: 13,
    cursor: 'pointer',
    fontWeight: 600,
  }

  const hasFilters = query || estado !== 'todos' || canal !== 'todos' || respondio !== 'todos' || riesgo !== 'todos'

  return (
    <div style={{ marginBottom: 16 }}>
      {/* Search Input */}
      <div style={{ marginBottom: 12 }}>
        <input
          type="text"
          placeholder="🔍 Buscar nombre, empresa, cargo, interés..."
          value={query}
          onChange={(e) => onQueryChange(e.target.value)}
          style={{ ...inputStyle, width: '100%' }}
        />
      </div>

      {/* Filter Row - Primary Filters */}
      <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap', alignItems: 'center', marginBottom: 8 }}>
        {/* Estado Filter */}
        <select
          value={estado}
          onChange={(e) => onEstadoChange(e.target.value)}
          style={selectStyle}
          title="Filtrar por estado del lead"
        >
          {ESTADO_OPTIONS.map((opt) => (
            <option key={opt.value} value={opt.value}>
              {opt.label}
            </option>
          ))}
        </select>

        {/* Canal Filter */}
        <select
          value={canal}
          onChange={(e) => onCanalChange(e.target.value)}
          style={selectStyle}
          title="Filtrar por canal de contacto"
        >
          {CANAL_OPTIONS.map((opt) => (
            <option key={opt.value} value={opt.value}>
              {opt.label}
            </option>
          ))}
        </select>

        {/* Respondio Filter */}
        <select
          value={respondio}
          onChange={(e) => onRespondioChange(e.target.value)}
          style={selectStyle}
          title="Filtrar por respuesta"
        >
          {RESPONDIO_OPTIONS.map((opt) => (
            <option key={opt.value} value={opt.value}>
              {opt.label}
            </option>
          ))}
        </select>

        {/* Riesgo Filter */}
        <select
          value={riesgo}
          onChange={(e) => onRiesgoChange(e.target.value)}
          style={selectStyle}
          title="Filtrar por nivel de riesgo"
        >
          {RISK_OPTIONS.map((opt) => (
            <option key={opt.value} value={opt.value}>
              {opt.label}
            </option>
          ))}
        </select>

        {/* Reset Button */}
        {hasFilters && (
          <button
            onClick={onReset}
            style={buttonStyle}
            title="Limpiar todos los filtros"
          >
            ✕ Limpiar
          </button>
        )}
      </div>

      {/* Active Filters Summary */}
      {hasFilters && (
        <div style={{
          marginTop: 10,
          fontSize: 12,
          color: T.muted,
          display: 'flex',
          gap: 8,
          flexWrap: 'wrap',
          alignItems: 'center',
        }}>
          <span style={{ fontWeight: 600 }}>Filtros activos:</span>
          {query && (
            <span style={{
              background: T.accent + '22',
              color: T.accent,
              padding: '3px 10px',
              borderRadius: 4,
              fontSize: 11,
              fontWeight: 500,
            }}>
              🔍 "{query}"
            </span>
          )}
          {estado !== 'todos' && (
            <span style={{
              background: T.accent + '22',
              color: T.accent,
              padding: '3px 10px',
              borderRadius: 4,
              fontSize: 11,
              fontWeight: 500,
            }}>
              Estado: {estado}
            </span>
          )}
          {canal !== 'todos' && (
            <span style={{
              background: T.accent + '22',
              color: T.accent,
              padding: '3px 10px',
              borderRadius: 4,
              fontSize: 11,
              fontWeight: 500,
            }}>
              Canal: {canal}
            </span>
          )}
          {respondio !== 'todos' && (
            <span style={{
              background: T.accent + '22',
              color: T.accent,
              padding: '3px 10px',
              borderRadius: 4,
              fontSize: 11,
              fontWeight: 500,
            }}>
              {respondio === 'si' ? '✅ Respondió' : '❌ No respondió'}
            </span>
          )}
          {riesgo !== 'todos' && (
            <span style={{
              background: T.accent + '22',
              color: T.accent,
              padding: '3px 10px',
              borderRadius: 4,
              fontSize: 11,
              fontWeight: 500,
            }}>
              Riesgo: {riesgo}
            </span>
          )}
        </div>
      )}
    </div>
  )
}
