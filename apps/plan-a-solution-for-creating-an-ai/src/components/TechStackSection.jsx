import React, { useState } from 'react'
import { TECH_STACK, DATA_CONTRACTS } from '../data/mockData'

const CAPAS = [
  { key: 'frontend', label: '🖥️ Frontend', color: '#3b82f6' },
  { key: 'backend', label: '⚙️ Backend', color: '#10b981' },
  { key: 'ia', label: '🤖 Inteligencia Artificial', color: '#8b5cf6' },
  { key: 'infra', label: '🏗️ Infraestructura', color: '#f59e0b' },
]

export default function TechStackSection() {
  const [activeTab, setActiveTab] = useState('frontend')
  const [showContracts, setShowContracts] = useState(false)

  const capa = CAPAS.find(c => c.key === activeTab)

  return (
    <section style={styles.section}>
      <h2 style={styles.h2}>🛠️ Stack Tecnológico Recomendado</h2>

      <div style={styles.tabs}>
        {CAPAS.map(c => (
          <button
            key={c.key}
            style={{ ...styles.tab, ...(activeTab === c.key ? { ...styles.tabActive, borderBottom: `2px solid ${c.color}`, color: c.color } : {}) }}
            onClick={() => setActiveTab(c.key)}
          >
            {c.label}
          </button>
        ))}
      </div>

      <div style={styles.tableWrap}>
        <table style={styles.table}>
          <thead>
            <tr>
              <th style={styles.th}>Capa</th>
              <th style={styles.th}>Tecnología</th>
              <th style={styles.th}>Razón de elección</th>
            </tr>
          </thead>
          <tbody>
            {TECH_STACK[activeTab].map((row, i) => (
              <tr key={i} style={{ ...styles.tr, background: row.tecnologia.includes('openai-codex') ? '#fefce8' : undefined }}>
                <td style={styles.tdLabel}>
                  <span style={{ ...styles.layerChip, background: capa.color + '15', color: capa.color }}>{row.capa}</span>
                </td>
                <td style={styles.tdTech}>
                  <code style={styles.code}>{row.tecnologia}</code>
                  {row.tecnologia.includes('openai-codex') && (
                    <span style={styles.runtimeBadge}>⚠️ runtime default</span>
                  )}
                </td>
                <td style={styles.tdReason}>{row.razon}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <div style={{ marginTop: '1.25rem' }}>
        <button style={styles.toggleBtn} onClick={() => setShowContracts(!showContracts)}>
          {showContracts ? '▼' : '▶'} Contratos de datos (REST endpoints)
        </button>
        {showContracts && (
          <div style={styles.contracts}>
            {Object.entries(DATA_CONTRACTS).map(([key, contract]) => (
              <div key={key} style={styles.contractCard}>
                <h4 style={{ margin: '0 0 0.5rem', color: '#1e293b', fontSize: '0.9rem' }}>{key.toUpperCase()}</h4>
                {Object.entries(contract).map(([k, v]) => (
                  <div key={k} style={styles.contractRow}>
                    <span style={styles.contractKey}>{k}</span>
                    <code style={styles.contractVal}>{v}</code>
                  </div>
                ))}
              </div>
            ))}
          </div>
        )}
      </div>
    </section>
  )
}

const styles = {
  section: { background: '#fff', borderRadius: '12px', padding: '1.5rem', marginBottom: '1.5rem', boxShadow: '0 1px 3px rgba(0,0,0,0.08)' },
  h2: { fontSize: '1.3rem', fontWeight: 700, marginTop: 0, marginBottom: '1rem', color: '#111827' },
  tabs: { display: 'flex', gap: 0, borderBottom: '2px solid #e5e7eb', marginBottom: '1rem', overflowX: 'auto' },
  tab: { padding: '0.6rem 1rem', border: 'none', borderBottom: '2px solid transparent', background: 'none', cursor: 'pointer', fontSize: '0.85rem', fontWeight: 500, color: '#6b7280', whiteSpace: 'nowrap' },
  tabActive: { fontWeight: 700 },
  tableWrap: { overflowX: 'auto' },
  table: { width: '100%', borderCollapse: 'collapse', fontSize: '0.83rem' },
  th: { textAlign: 'left', padding: '0.5rem 0.75rem', background: '#f9fafb', color: '#374151', fontWeight: 600, borderBottom: '2px solid #e5e7eb', fontSize: '0.78rem' },
  tr: { borderBottom: '1px solid #f3f4f6' },
  tdLabel: { padding: '0.6rem 0.75rem', verticalAlign: 'middle', whiteSpace: 'nowrap' },
  tdTech: { padding: '0.6rem 0.75rem', verticalAlign: 'middle' },
  tdReason: { padding: '0.6rem 0.75rem', color: '#6b7280', fontSize: '0.82rem', verticalAlign: 'middle' },
  layerChip: { padding: '0.2rem 0.6rem', borderRadius: '4px', fontSize: '0.75rem', fontWeight: 600 },
  code: { background: '#f1f5f9', padding: '0.15rem 0.45rem', borderRadius: '4px', fontSize: '0.8rem', fontFamily: 'monospace', color: '#0f172a' },
  runtimeBadge: { marginLeft: '0.5rem', background: '#fef3c7', color: '#92400e', padding: '0.1rem 0.45rem', borderRadius: '4px', fontSize: '0.68rem', fontWeight: 700 },
  toggleBtn: { background: '#f1f5f9', border: '1px solid #e5e7eb', borderRadius: '6px', padding: '0.5rem 1rem', cursor: 'pointer', fontSize: '0.83rem', fontWeight: 600, color: '#374151' },
  contracts: { display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '0.75rem', marginTop: '0.75rem' },
  contractCard: { background: '#f8fafc', borderRadius: '8px', padding: '0.875rem', border: '1px solid #e5e7eb' },
  contractRow: { display: 'flex', flexDirection: 'column', gap: '0.1rem', marginBottom: '0.5rem' },
  contractKey: { fontSize: '0.68rem', fontWeight: 600, color: '#6b7280', textTransform: 'uppercase', letterSpacing: '0.04em' },
  contractVal: { fontSize: '0.72rem', background: '#e2e8f0', padding: '0.25rem 0.5rem', borderRadius: '4px', color: '#0f172a', wordBreak: 'break-all', lineHeight: 1.5 },
}
