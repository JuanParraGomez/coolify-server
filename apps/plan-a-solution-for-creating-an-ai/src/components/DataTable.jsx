import React, { useState } from 'react'
import { ESTADO_COLOR, RISK_COLOR } from '../lib/mock-data'

/**
 * DataTable Component
 * Production-ready, reusable data table with sorting, expansion, actions
 * Supports complex data types, custom renderers, and state management
 * Optimized for leads management with support for nested content
 */
export default function DataTable({
  data = [],
  columns = [],
  onRowClick = () => {},
  onAction = () => {},
  expandedRowId = null,
  onExpandChange = () => {},
  renderExpandedRow = null,
  sortField = 'score',
  sortDir = 'desc',
  onSortChange = () => {},
  loading = false,
  emptyMessage = 'No hay datos disponibles',
  onRowHover = null,
  striped = true,
  highlightable = true,
}) {
  const T = {
    bg: '#0f1117',
    surface: '#1a1d27',
    surface2: '#222534',
    border: '#2a2d3e',
    text: '#e2e8f0',
    muted: '#94a3b8',
    accent: '#6366f1',
    accentHover: '#818cf8',
  }

  const thStyle = {
    padding: '10px 12px',
    textAlign: 'left',
    color: T.muted,
    fontWeight: 600,
    fontSize: 12,
    textTransform: 'uppercase',
    letterSpacing: 0.5,
    cursor: 'pointer',
    whiteSpace: 'nowrap',
    borderBottom: `1px solid ${T.border}`,
    background: T.surface,
    userSelect: 'none',
  }

  const tdStyle = {
    padding: '12px 12px',
    color: T.text,
    fontSize: 13,
    verticalAlign: 'middle',
    borderBottom: `1px solid ${T.border}`,
  }

  const toggleSort = (field) => {
    if (sortField === field) {
      onSortChange(field, sortDir === 'asc' ? 'desc' : 'asc')
    } else {
      onSortChange(field, 'desc')
    }
  }

  if (loading) {
    return (
      <div style={{
        padding: '40px',
        textAlign: 'center',
        color: T.muted,
      }}>
        Cargando datos...
      </div>
    )
  }

  if (!data || data.length === 0) {
    return (
      <div style={{
        padding: '40px',
        textAlign: 'center',
        color: T.muted,
        border: `1px solid ${T.border}`,
        borderRadius: 8,
      }}>
        {emptyMessage}
      </div>
    )
  }

  return (
    <div style={{
      overflowX: 'auto',
      border: `1px solid ${T.border}`,
      borderRadius: 8,
    }}>
      <table style={{
        width: '100%',
        borderCollapse: 'collapse',
        fontSize: 13,
      }}>
        <thead>
          <tr>
            {columns.map((col) => (
              <th
                key={col.key}
                style={thStyle}
                onClick={() => col.sortable !== false && toggleSort(col.key)}
              >
                <div style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: 6,
                  cursor: col.sortable !== false ? 'pointer' : 'default',
                }}>
                  {col.label}
                  {col.sortable !== false && (
                    <span style={{
                      color: sortField === col.key ? T.accent : T.border,
                      fontSize: 11,
                    }}>
                      {sortField === col.key
                        ? sortDir === 'asc'
                          ? '↑'
                          : '↓'
                        : '↕'}
                    </span>
                  )}
                </div>
              </th>
            ))}
            <th style={{ ...thStyle, cursor: 'default' }}>Acciones</th>
          </tr>
        </thead>
        <tbody>
          {data.map((row, idx) => (
            <React.Fragment key={row.id || idx}>
              <tr
                style={{
                  background: expandedRowId === row.id ? T.accent + '11' : idx % 2 === 0 ? T.surface : T.surface2,
                  cursor: renderExpandedRow ? 'pointer' : 'default',
                }}
                onClick={() => renderExpandedRow && onExpandChange(expandedRowId === row.id ? null : row.id)}
              >
                {columns.map((col) => (
                  <td key={col.key} style={tdStyle}>
                    {col.render ? col.render(row[col.key], row) : row[col.key]}
                  </td>
                ))}
                <td style={{ ...tdStyle, whiteSpace: 'nowrap' }}>
                  {renderExpandedRow && (
                    <span style={{
                      color: T.accent,
                      fontWeight: 600,
                      fontSize: 12,
                      cursor: 'pointer',
                    }}>
                      {expandedRowId === row.id ? '▲ Cerrar' : '▼ Ver'}
                    </span>
                  )}
                </td>
              </tr>
              {renderExpandedRow && expandedRowId === row.id && (
                <tr>
                  <td
                    colSpan={columns.length + 1}
                    style={{
                      padding: '12px',
                      background: T.surface2,
                      borderBottom: `1px solid ${T.border}`,
                    }}
                  >
                    {renderExpandedRow(row)}
                  </td>
                </tr>
              )}
            </React.Fragment>
          ))}
        </tbody>
      </table>
    </div>
  )
}

/**
 * Default Column Renderers
 */

// Score bar renderer
export function ScoreRenderer(score) {
  const color = score >= 85 ? '#10b981' : score >= 65 ? '#f59e0b' : '#ef4444'
  return (
    <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
      <div style={{
        flex: 1,
        height: 5,
        background: '#2a2d3e',
        borderRadius: 3,
        overflow: 'hidden',
        minWidth: 50,
      }}>
        <div style={{
          width: `${score}%`,
          height: '100%',
          background: color,
          borderRadius: 3,
        }} />
      </div>
      <span style={{
        fontSize: 12,
        fontWeight: 700,
        color,
        minWidth: 24,
      }}>
        {score}
      </span>
    </div>
  )
}

// Status badge renderer
export function StatusRenderer(status) {
  const color = ESTADO_COLOR[status] || '#6366f1'
  return (
    <span style={{
      background: color + '22',
      color,
      border: `1px solid ${color}44`,
      borderRadius: 12,
      padding: '2px 8px',
      fontSize: 11,
      fontWeight: 700,
      whiteSpace: 'nowrap',
    }}>
      {status}
    </span>
  )
}

// Response badge renderer
export function ResponseRenderer(responded) {
  return responded ? '✅ Sí' : '—'
}

// Title renderer with emphasis
export function TitleRenderer(title, row) {
  return <strong>{title}</strong>
}

// Role/badge renderer
export function RoleRenderer(role) {
  return (
    <span style={{
      background: '#1a1d27',
      border: '1px solid #2a2d3e',
      borderRadius: 4,
      padding: '2px 8px',
      fontSize: 12,
    }}>
      {role}
    </span>
  )
}

// Risk level renderer
export function RiskRenderer(riskLevel) {
  const color = RISK_COLOR[riskLevel] || '#6366f1'
  const icons = { 'Bajo': '🟢', 'Medio': '🟡', 'Alto': '🔴', 'Muy Bajo': '✅' }
  return (
    <span style={{
      background: color + '22',
      color,
      border: `1px solid ${color}44`,
      borderRadius: 12,
      padding: '2px 8px',
      fontSize: 11,
      fontWeight: 700,
      whiteSpace: 'nowrap',
      display: 'inline-flex',
      alignItems: 'center',
      gap: 4,
    }}>
      <span>{icons[riskLevel] || '⚠️'}</span>
      {riskLevel}
    </span>
  )
}

// Budget renderer
export function BudgetRenderer(budget) {
  const budgetMap = {
    '$10k-20k': 1,
    '$20k-50k': 2,
    '$50k-100k': 3,
    '$100k+': 4,
  }
  const level = budgetMap[budget] || 0
  const colors = ['#ef4444', '#f59e0b', '#3b82f6', '#10b981']
  return (
    <span style={{
      background: colors[level] + '22',
      color: colors[level],
      border: `1px solid ${colors[level]}44`,
      borderRadius: 4,
      padding: '2px 8px',
      fontSize: 11,
      fontWeight: 700,
    }}>
      {budget}
    </span>
  )
}

// Tags renderer
export function TagsRenderer(tags) {
  if (!tags || !Array.isArray(tags)) return '—'
  return (
    <div style={{ display: 'flex', gap: 4, flexWrap: 'wrap' }}>
      {tags.slice(0, 2).map((tag, i) => (
        <span
          key={i}
          style={{
            background: '#6366f122',
            color: '#818cf8',
            border: '1px solid #6366f144',
            borderRadius: 3,
            padding: '1px 6px',
            fontSize: 10,
            whiteSpace: 'nowrap',
          }}
        >
          {tag}
        </span>
      ))}
      {tags.length > 2 && (
        <span style={{ color: '#94a3b8', fontSize: 10, fontWeight: 600 }}>
          +{tags.length - 2}
        </span>
      )}
    </div>
  )
}

// Date renderer with relative time
export function DateRenderer(dateString) {
  if (!dateString) return '—'
  try {
    const date = new Date(dateString)
    const now = new Date()
    const daysAgo = Math.floor((now - date) / (1000 * 60 * 60 * 24))

    let relative = ''
    if (daysAgo === 0) relative = 'Hoy'
    else if (daysAgo === 1) relative = 'Ayer'
    else if (daysAgo < 7) relative = `${daysAgo}d`
    else if (daysAgo < 30) relative = `${Math.floor(daysAgo / 7)}w`
    else relative = `${Math.floor(daysAgo / 30)}m`

    return (
      <span title={dateString} style={{ cursor: 'help' }}>
        {relative}
      </span>
    )
  } catch {
    return dateString
  }
}

// Action buttons renderer
export function ActionsRenderer(leadId, actions = []) {
  return (
    <div style={{ display: 'flex', gap: 6 }}>
      {actions.map((action, i) => (
        <button
          key={i}
          onClick={(e) => {
            e.stopPropagation()
            action.onClick && action.onClick(leadId)
          }}
          style={{
            background: action.color + '22',
            color: action.color || '#6366f1',
            border: `1px solid ${action.color || '#6366f1'}44`,
            borderRadius: 4,
            padding: '2px 8px',
            fontSize: 11,
            fontWeight: 600,
            cursor: 'pointer',
            whiteSpace: 'nowrap',
          }}
          title={action.title}
        >
          {action.label}
        </button>
      ))}
    </div>
  )
}
