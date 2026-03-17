import React, { useState, useEffect } from 'react'
import { useChat } from '../hooks/useChat.js'

export function ChatView({ selectedLead, onBack }) {
  const {
    messages, aiDraft, setAiDraft,
    loadingMessages, loadingAi,
    loadMessages, sendMessage, generateAiResponse,
  } = useChat(selectedLead?.id)

  const [input, setInput] = useState('')

  useEffect(() => { if (selectedLead) loadMessages() }, [selectedLead])

  if (!selectedLead) {
    return (
      <div className="view">
        <div className="empty-state" style={{ marginTop: '4rem' }}>
          <div className="empty-icon">💬</div>
          <p>Selecciona un lead desde la lista para iniciar el chat.</p>
        </div>
      </div>
    )
  }

  const handleSend = async () => {
    if (!input.trim()) return
    await sendMessage(input)
    setInput('')
  }

  const handleUseDraft = () => {
    setInput(aiDraft)
    setAiDraft('')
  }

  return (
    <div className="view" style={{ display: 'flex', flexDirection: 'column', height: 'calc(100vh - 57px)', padding: 0 }}>
      {/* Lead info bar */}
      <div className="flex items-center gap-2" style={{ padding: '0.75rem 1.5rem', borderBottom: '1px solid var(--border)', background: 'var(--surface)' }}>
        <button className="btn btn-ghost btn-sm" onClick={onBack}>← Volver</button>
        <div>
          <strong>{selectedLead.name}</strong>
          <span className="text-muted text-sm"> — {selectedLead.title}, {selectedLead.company}</span>
        </div>
      </div>

      {/* Messages */}
      <div className="messages-list" style={{ flex: 1, padding: '1rem 1.5rem' }}>
        {loadingMessages && (
          <div className="flex items-center gap-1 text-muted">
            <span className="spinner" /> Cargando mensajes...
          </div>
        )}
        {messages.map(msg => (
          <div key={msg.id}>
            <div className={`message ${msg.direction}`}>
              {msg.content}
              {msg.is_ai_generated && (
                <span className="text-sm" style={{ display: 'block', marginTop: 4, opacity: 0.7 }}>✨ Generado por IA</span>
              )}
            </div>
            <div className={`message-meta`} style={{ textAlign: msg.direction === 'outbound' ? 'right' : 'left' }}>
              {new Date(msg.created_at).toLocaleString('es-MX', { hour: '2-digit', minute: '2-digit', month: 'short', day: 'numeric' })}
            </div>
          </div>
        ))}
      </div>

      {/* AI Draft */}
      {aiDraft && (
        <div style={{ padding: '0.75rem 1.5rem', background: 'rgba(99,102,241,0.06)', borderTop: '1px solid var(--border)' }}>
          <div className="flex items-center justify-between mb-1">
            <span className="text-sm text-muted">✨ Borrador IA</span>
            <div className="flex gap-1">
              <button className="btn btn-primary btn-sm" onClick={handleUseDraft}>Usar</button>
              <button className="btn btn-ghost btn-sm" onClick={() => setAiDraft('')}>✕</button>
            </div>
          </div>
          <p className="text-sm" style={{ lineHeight: 1.5 }}>{aiDraft}</p>
        </div>
      )}

      {/* Input */}
      <div style={{ padding: '0.75rem 1.5rem', borderTop: '1px solid var(--border)' }}>
        <div className="chat-input-row">
          <input
            className="input"
            placeholder="Escribe un mensaje..."
            value={input}
            onChange={e => setInput(e.target.value)}
            onKeyDown={e => e.key === 'Enter' && !e.shiftKey && handleSend()}
          />
          <button
            className="btn btn-secondary"
            onClick={() => generateAiResponse(messages.slice(-3).map(m => m.content).join('\n'))}
            disabled={loadingAi}
          >
            {loadingAi ? <span className="spinner" /> : '✨ IA'}
          </button>
          <button className="btn btn-primary" onClick={handleSend} disabled={!input.trim()}>
            Enviar
          </button>
        </div>
        <p className="text-muted text-sm mt-1">
          Chat via extensión de navegador. Presiona ✨ IA para generar una respuesta contextual.
        </p>
      </div>
    </div>
  )
}
