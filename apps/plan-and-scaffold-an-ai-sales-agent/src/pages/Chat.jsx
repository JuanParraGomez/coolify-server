import React, { useState, useEffect, useRef } from 'react'
import { useSearchParams } from 'react-router-dom'
import { useLeads } from '../hooks/useLeads.js'
import { useChat } from '../hooks/useChat.js'

const S = {
  h1:    { fontSize: '1.4rem', fontWeight: 700, marginBottom: '0.25rem' },
  sub:   { color: '#64748b', fontSize: '0.875rem', marginBottom: '1rem' },
  wrap:  { display: 'flex', gap: '1rem', height: 'calc(100vh - 200px)', minHeight: 400 },
  list:  { width: 240, minWidth: 240, background: '#1e293b', borderRadius: 10, border: '1px solid #334155', overflowY: 'auto' },
  litem: (a) => ({ padding: '0.75rem 1rem', cursor: 'pointer', borderBottom: '1px solid #0f172a', background: a ? '#3b82f620' : 'transparent', borderLeft: `3px solid ${a ? '#3b82f6' : 'transparent'}` }),
  lname: { fontWeight: 500, fontSize: '0.875rem' },
  lco:   { fontSize: '0.75rem', color: '#64748b', marginTop: 2 },
  chat:  { flex: 1, display: 'flex', flexDirection: 'column', background: '#1e293b', borderRadius: 10, border: '1px solid #334155' },
  msgs:  { flex: 1, overflowY: 'auto', padding: '1rem', display: 'flex', flexDirection: 'column', gap: '0.75rem' },
  bubble: (dir) => ({
    alignSelf: dir === 'outbound' ? 'flex-end' : 'flex-start',
    maxWidth: '70%', padding: '0.6rem 0.9rem', borderRadius: 12,
    background: dir === 'outbound' ? '#3b82f6' : '#334155',
    color: '#e2e8f0', fontSize: '0.875rem', lineHeight: 1.5,
    borderBottomRightRadius: dir === 'outbound' ? 2 : 12,
    borderBottomLeftRadius: dir === 'inbound' ? 2 : 12,
  }),
  aiBadge: { fontSize: '0.7rem', opacity: 0.75, marginTop: 3, textAlign: 'right' },
  footer: { padding: '0.75rem', borderTop: '1px solid #334155', display: 'flex', gap: '0.5rem' },
  input:  { flex: 1, background: '#0f172a', border: '1px solid #334155', borderRadius: 8, padding: '0.5rem 0.75rem', color: '#e2e8f0', fontSize: '0.875rem' },
  btn:    (c = '#3b82f6') => ({ background: c, color: '#fff', border: 'none', borderRadius: 8, padding: '0.5rem 0.9rem', cursor: 'pointer', fontSize: '0.8rem', whiteSpace: 'nowrap' }),
  draft:  { background: '#0f172a22', borderTop: '1px solid #334155', padding: '0.75rem', fontSize: '0.875rem', color: '#94a3b8' },
  empty:  { flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#64748b' },
}

export default function Chat() {
  const [searchParams] = useSearchParams()
  const { leads } = useLeads()
  const [selectedId, setSelectedId] = useState(searchParams.get('lead') ?? null)
  const [input, setInput] = useState('')
  const bottomRef = useRef(null)

  const { messages, aiDraft, setAiDraft, loadingMessages, loadingAi, loadMessages, sendMessage, generateAiResponse } = useChat(selectedId)

  useEffect(() => {
    if (selectedId) loadMessages()
  }, [selectedId, loadMessages])

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [messages])

  const handleSend = () => {
    const text = (aiDraft || input).trim()
    if (!text) return
    sendMessage(text)
    setInput('')
    setAiDraft('')
  }

  const selectedLead = leads.find(l => l.id === selectedId)

  return (
    <div>
      <h1 style={S.h1}>Chat Extensión</h1>
      <p style={S.sub}>Conversaciones con leads capturadas desde la extensión de navegador.</p>
      <div style={S.wrap}>
        {/* Lista de leads */}
        <div style={S.list}>
          {leads.map(lead => (
            <div key={lead.id} style={S.litem(lead.id === selectedId)} onClick={() => setSelectedId(lead.id)}>
              <div style={S.lname}>{lead.name}</div>
              <div style={S.lco}>{lead.company}</div>
            </div>
          ))}
        </div>

        {/* Panel de chat */}
        <div style={S.chat}>
          {!selectedId ? (
            <div style={S.empty}>Selecciona un lead para ver la conversación</div>
          ) : (
            <>
              {/* Cabecera */}
              <div style={{ padding: '0.75rem 1rem', borderBottom: '1px solid #334155', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <div>
                  <span style={{ fontWeight: 600 }}>{selectedLead?.name}</span>
                  <span style={{ color: '#64748b', fontSize: '0.8rem', marginLeft: 8 }}>{selectedLead?.company} · {selectedLead?.title}</span>
                </div>
                <button style={S.btn('#8b5cf6')} onClick={() => generateAiResponse()}>
                  {loadingAi ? '⏳ Generando...' : '✨ Generar respuesta IA'}
                </button>
              </div>

              {/* Mensajes */}
              <div style={S.msgs}>
                {loadingMessages ? (
                  <p style={{ color: '#64748b' }}>Cargando mensajes...</p>
                ) : messages.length === 0 ? (
                  <p style={{ color: '#64748b' }}>Sin mensajes aún. Inicia la conversación.</p>
                ) : (
                  messages.map(m => (
                    <div key={m.id} style={S.bubble(m.direction)}>
                      {m.content}
                      {m.is_ai_generated && <div style={S.aiBadge}>✨ generado por IA</div>}
                    </div>
                  ))
                )}
                <div ref={bottomRef} />
              </div>

              {/* Borrador IA */}
              {aiDraft && (
                <div style={S.draft}>
                  <div style={{ fontSize: '0.75rem', color: '#8b5cf6', marginBottom: 4 }}>✨ Sugerencia de IA:</div>
                  <div>{aiDraft}</div>
                </div>
              )}

              {/* Input */}
              <div style={S.footer}>
                <input
                  style={S.input}
                  placeholder={aiDraft ? 'Borrando borrador IA y escribiendo propio...' : 'Escribe un mensaje...'}
                  value={aiDraft || input}
                  onChange={e => { setAiDraft(''); setInput(e.target.value) }}
                  onKeyDown={e => e.key === 'Enter' && handleSend()}
                />
                <button style={S.btn()} onClick={handleSend}>Enviar</button>
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  )
}
