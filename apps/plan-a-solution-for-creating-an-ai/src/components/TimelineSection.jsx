import React, { useState } from 'react'
import { TIMELINE_PHASES } from '../data/mockData'

const RIESGO_COLOR = { bajo: '#10b981', medio: '#f59e0b', alto: '#ef4444' }
const TOTAL_SEMANAS = 15

export default function TimelineSection() {
  const [hovered, setHovered] = useState(null)

  const totalSemanas = TIMELINE_PHASES.reduce((acc, p) => {
    const [start] = p.semanas.split('-').map(Number)
    return Math.max(acc, start + p.duracion - 1)
  }, 0)

  return (
    <section style={styles.section}>
      <h2 style={styles.h2}>📅 Cronograma de Implementación (~{TOTAL_SEMANAS} semanas)</h2>
      <p style={styles.desc}>Hover sobre cada fase para ver detalles. Las fases pueden solaparse.</p>

      {/* Gantt visual */}
      <div style={styles.ganttWrap}>
        <div style={styles.ganttHeader}>
          {Array.from({ length: TOTAL_SEMANAS }, (_, i) => (
            <div key={i} style={styles.weekLabel}>S{i + 1}</div>
          ))}
        </div>
        {TIMELINE_PHASES.map((phase, i) => {
          const [start] = phase.semanas.split('-').map(Number)
          const leftPct = ((start - 1) / TOTAL_SEMANAS) * 100
          const widthPct = (phase.duracion / TOTAL_SEMANAS) * 100
          return (
            <div key={i} style={styles.ganttRow}>
              <div style={styles.phaseLabel}>
                <span style={{ ...styles.riesgoBadge, background: RIESGO_COLOR[phase.riesgo] + '20', color: RIESGO_COLOR[phase.riesgo] }}>
                  {phase.riesgo}
                </span>
                <span style={{ fontSize: '0.78rem', color: '#374151', fontWeight: 500 }}>F{phase.fase}</span>
              </div>
              <div style={styles.ganttTrack}>
                <div
                  style={{
                    ...styles.ganttBar,
                    left: `${leftPct}%`,
                    width: `${widthPct}%`,
                    background: hovered === i ? '#4f46e5' : '#6366f1',
                    opacity: hovered !== null && hovered !== i ? 0.4 : 1,
                  }}
                  onMouseEnter={() => setHovered(i)}
                  onMouseLeave={() => setHovered(null)}
                >
                  <span style={styles.barText}>{phase.nombre}</span>
                </div>
              </div>
            </div>
          )
        })}
      </div>

      {hovered !== null && (
        <div style={styles.tooltip}>
          <strong>{TIMELINE_PHASES[hovered].nombre}</strong>
          <span style={{ color: '#6b7280', fontSize: '0.82rem' }}> · Semanas {TIMELINE_PHASES[hovered].semanas} · {TIMELINE_PHASES[hovered].duracion}w · {TIMELINE_PHASES[hovered].equipo}</span>
          <p style={{ margin: '0.5rem 0 0', color: '#374151', fontSize: '0.85rem', lineHeight: 1.6 }}>{TIMELINE_PHASES[hovered].descripcion}</p>
        </div>
      )}

      {/* Tabla resumen */}
      <div style={styles.tableWrap}>
        <table style={styles.table}>
          <thead>
            <tr>
              <th style={styles.th}>#</th>
              <th style={styles.th}>Fase</th>
              <th style={styles.th}>Semanas</th>
              <th style={styles.th}>Duración</th>
              <th style={styles.th}>Equipo</th>
              <th style={styles.th}>Riesgo</th>
            </tr>
          </thead>
          <tbody>
            {TIMELINE_PHASES.map(p => (
              <tr key={p.fase} style={styles.tr}>
                <td style={styles.td}>{p.fase}</td>
                <td style={styles.td}><strong>{p.nombre}</strong></td>
                <td style={styles.td}>{p.semanas}</td>
                <td style={styles.td}>{p.duracion} sem.</td>
                <td style={styles.td}><span style={styles.equipoChip}>{p.equipo}</span></td>
                <td style={styles.td}>
                  <span style={{ ...styles.riesgoBadge, background: RIESGO_COLOR[p.riesgo] + '20', color: RIESGO_COLOR[p.riesgo] }}>
                    {p.riesgo}
                  </span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </section>
  )
}

const styles = {
  section: { background: '#fff', borderRadius: '12px', padding: '1.5rem', marginBottom: '1.5rem', boxShadow: '0 1px 3px rgba(0,0,0,0.08)' },
  h2: { fontSize: '1.3rem', fontWeight: 700, marginTop: 0, marginBottom: '0.5rem', color: '#111827' },
  desc: { color: '#6b7280', fontSize: '0.9rem', marginBottom: '1.25rem' },
  ganttWrap: { border: '1px solid #e5e7eb', borderRadius: '8px', overflow: 'hidden', marginBottom: '1rem' },
  ganttHeader: { display: 'flex', background: '#f9fafb', borderBottom: '1px solid #e5e7eb', paddingLeft: 100 },
  weekLabel: { flex: 1, textAlign: 'center', padding: '0.4rem 0', fontSize: '0.65rem', color: '#9ca3af', fontWeight: 600, borderRight: '1px solid #f3f4f6' },
  ganttRow: { display: 'flex', alignItems: 'center', borderBottom: '1px solid #f3f4f6', height: 36 },
  phaseLabel: { width: 100, flexShrink: 0, padding: '0 0.5rem', display: 'flex', alignItems: 'center', gap: '0.3rem', borderRight: '1px solid #e5e7eb', height: '100%' },
  ganttTrack: { flex: 1, position: 'relative', height: '100%' },
  ganttBar: { position: 'absolute', top: 4, height: 28, borderRadius: 4, display: 'flex', alignItems: 'center', paddingLeft: 8, transition: 'background 0.15s, opacity 0.15s', cursor: 'pointer', minWidth: 20 },
  barText: { fontSize: '0.68rem', color: '#fff', fontWeight: 600, whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' },
  riesgoBadge: { fontSize: '0.68rem', fontWeight: 600, padding: '0.1rem 0.4rem', borderRadius: '4px' },
  tooltip: { background: '#f8fafc', border: '1px solid #e5e7eb', borderRadius: '8px', padding: '0.875rem', marginBottom: '1rem' },
  tableWrap: { overflowX: 'auto', marginTop: '0.5rem' },
  table: { width: '100%', borderCollapse: 'collapse', fontSize: '0.83rem' },
  th: { textAlign: 'left', padding: '0.5rem 0.75rem', background: '#f9fafb', color: '#374151', fontWeight: 600, borderBottom: '2px solid #e5e7eb', fontSize: '0.78rem' },
  tr: { borderBottom: '1px solid #f3f4f6' },
  td: { padding: '0.5rem 0.75rem', color: '#374151' },
  equipoChip: { background: '#ede9fe', color: '#5b21b6', padding: '0.15rem 0.5rem', borderRadius: '4px', fontSize: '0.75rem', fontWeight: 500 },
}
