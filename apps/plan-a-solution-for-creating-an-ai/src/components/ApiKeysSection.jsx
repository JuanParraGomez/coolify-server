import React from 'react'
import { useApiConfig } from '../hooks/useApiConfig'

export default function ApiKeysSection() {
  const { keys, updateKey, visible, toggleVisible, activeProvider, setActiveProvider, validated, validateKey, PROVEEDORES } = useApiConfig()

  return (
    <section style={styles.section}>
      <h2 style={styles.h2}>🔑 Configuración de Proveedores de IA</h2>
      <p style={styles.desc}>
        Ingresa las API keys para cada proveedor. Las claves se cifran con AES-256 antes de persistir
        (endpoint: <code style={styles.inlineCode}>PUT /api/v1/config/api-keys</code>).
        El proveedor activo se usa por defecto para generar respuestas.
      </p>

      <div style={styles.runtimeNote}>
        ⚠️ <strong>Modelo de runtime por defecto:</strong> <code>openai-codex / gpt-5.1-codex-mini</code> —
        Este es el modelo que ejecuta el agente en producción. Es diferente al modelo usado durante el desarrollo
        (claude-sonnet-4-6). Asegúrate de tener una API key válida de OpenAI configurada.
      </div>

      <div style={styles.providerTabs}>
        {PROVEEDORES.map(p => (
          <button
            key={p.id}
            style={{
              ...styles.provTab,
              borderColor: activeProvider === p.id ? p.color : 'transparent',
              color: activeProvider === p.id ? p.color : '#6b7280',
              background: activeProvider === p.id ? p.color + '10' : '#f9fafb',
            }}
            onClick={() => setActiveProvider(p.id)}
          >
            {p.nombre}
            {validated[p.id] === 'valida' && <span style={styles.checkmark}>✓</span>}
            {validated[p.id] === 'invalida' && <span style={styles.xmark}>✗</span>}
          </button>
        ))}
      </div>

      {PROVEEDORES.filter(p => p.id === activeProvider).map(p => (
        <div key={p.id} style={{ ...styles.keyCard, borderColor: p.color + '40' }}>
          <div style={styles.keyHeader}>
            <div style={{ ...styles.provBadge, background: p.color }}>{p.nombre}</div>
            <span style={{ fontSize: '0.8rem', color: '#6b7280' }}>Modelos: {p.modelos.join(', ')}</span>
          </div>
          <div style={styles.keyInputRow}>
            <input
              type={visible[p.id] ? 'text' : 'password'}
              placeholder={p.placeholder}
              value={keys[p.id]}
              onChange={e => updateKey(p.id, e.target.value)}
              style={styles.keyInput}
            />
            <button style={styles.toggleBtn} onClick={() => toggleVisible(p.id)}>
              {visible[p.id] ? '🙈' : '👁'}
            </button>
            <button
              style={{ ...styles.validateBtn, background: p.color }}
              onClick={() => validateKey(p.id)}
            >
              Validar
            </button>
          </div>
          {validated[p.id] && (
            <div style={{ ...styles.validationMsg, color: validated[p.id] === 'valida' ? '#065f46' : '#7f1d1d', background: validated[p.id] === 'valida' ? '#ecfdf5' : '#fef2f2' }}>
              {validated[p.id] === 'valida' ? '✅ API key válida — modelos disponibles verificados' : '❌ API key inválida o demasiado corta'}
            </div>
          )}
          <div style={styles.securityNote}>
            🔒 Transmisión: TLS 1.3 · Almacenamiento: AES-256 cifrado · Acceso: solo tu cuenta
          </div>
        </div>
      ))}

      <div style={styles.stateNote}>
        <h4 style={{ margin: '0 0 0.5rem', fontSize: '0.9rem' }}>Estado & validación (frontend)</h4>
        <ul style={{ margin: 0, paddingLeft: '1.25rem', lineHeight: 2, fontSize: '0.82rem', color: '#374151' }}>
          <li><strong>Hook:</strong> <code>useApiConfig()</code> — gestiona keys, visibilidad, proveedor activo</li>
          <li><strong>Validación en tránsito:</strong> <code>POST /api/v1/config/api-keys/validate</code> — no almacena hasta confirmar</li>
          <li><strong>Estado global:</strong> Zustand store — <code>activeProvider</code> disponible en toda la app</li>
          <li><strong>Risk:</strong> Nunca loguear API keys; redactar en Sentry antes de enviar errores</li>
        </ul>
      </div>
    </section>
  )
}

const styles = {
  section: { background: '#fff', borderRadius: '12px', padding: '1.5rem', marginBottom: '1.5rem', boxShadow: '0 1px 3px rgba(0,0,0,0.08)' },
  h2: { fontSize: '1.3rem', fontWeight: 700, marginTop: 0, marginBottom: '0.5rem', color: '#111827' },
  desc: { color: '#6b7280', fontSize: '0.88rem', marginBottom: '1rem', lineHeight: 1.6 },
  inlineCode: { background: '#f1f5f9', padding: '0.1rem 0.35rem', borderRadius: '3px', fontSize: '0.8rem', fontFamily: 'monospace', color: '#0f172a' },
  runtimeNote: { background: '#fffbeb', border: '1px solid #fde68a', borderRadius: '8px', padding: '0.875rem', fontSize: '0.83rem', color: '#78350f', marginBottom: '1.25rem', lineHeight: 1.6 },
  providerTabs: { display: 'flex', gap: '0.5rem', flexWrap: 'wrap', marginBottom: '1rem' },
  provTab: { padding: '0.5rem 1rem', border: '2px solid', borderRadius: '8px', cursor: 'pointer', fontSize: '0.83rem', fontWeight: 600, transition: 'all 0.15s', display: 'flex', alignItems: 'center', gap: '0.4rem' },
  checkmark: { color: '#10b981', fontWeight: 700 },
  xmark: { color: '#ef4444', fontWeight: 700 },
  keyCard: { border: '1px solid', borderRadius: '10px', padding: '1.25rem', marginBottom: '1rem' },
  keyHeader: { display: 'flex', alignItems: 'center', gap: '1rem', marginBottom: '0.875rem', flexWrap: 'wrap' },
  provBadge: { color: '#fff', padding: '0.3rem 0.875rem', borderRadius: '6px', fontWeight: 700, fontSize: '0.85rem' },
  keyInputRow: { display: 'flex', gap: '0.5rem', marginBottom: '0.5rem' },
  keyInput: { flex: 1, padding: '0.625rem 0.875rem', border: '1px solid #d1d5db', borderRadius: '8px', fontSize: '0.88rem', fontFamily: 'monospace', outline: 'none' },
  toggleBtn: { background: '#f3f4f6', border: '1px solid #d1d5db', borderRadius: '8px', padding: '0 0.75rem', cursor: 'pointer', fontSize: '1rem' },
  validateBtn: { color: '#fff', border: 'none', borderRadius: '8px', padding: '0 1rem', cursor: 'pointer', fontSize: '0.83rem', fontWeight: 700 },
  validationMsg: { padding: '0.5rem 0.75rem', borderRadius: '6px', fontSize: '0.83rem', fontWeight: 500, marginBottom: '0.5rem' },
  securityNote: { fontSize: '0.72rem', color: '#6b7280', marginTop: '0.5rem' },
  stateNote: { background: '#f8fafc', border: '1px solid #e5e7eb', borderRadius: '8px', padding: '0.875rem' },
}
