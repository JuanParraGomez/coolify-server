import React, { useState, useRef, useEffect } from 'react'
import { useAppStore } from '../store'
import { useGenerateReply } from '../hooks/useAIProvider'
import type { Message } from '../types'

const DEMO_MESSAGES: Message[] = [
  {
    id: '1',
    leadId: '1',
    sender: 'agent',
    content: 'Hola Ana, vi que eres CTO en TechCorp. ¿Están buscando soluciones de IA para automatizar procesos de ventas?',
    timestamp: new Date(Date.now() - 3 * 60 * 60 * 1000).toISOString(),
  },
  {
    id: '2',
    leadId: '1',
    sender: 'lead',
    content: 'Hola! Sí, estamos evaluando algunas opciones. ¿Qué ofrece tu solución específicamente?',
    timestamp: new Date(Date.now() - 2 * 60 * 60 * 1000).toISOString(),
  },
]

export default function ChatPanel() {
  const { selectedLeadId, leads } = useAppStore()
  const generateReply = useGenerateReply()
  const [messages, setMessages] = useState<Message[]>(DEMO_MESSAGES)
  const [input, setInput] = useState('')
  const [tone, setTone] = useState<'profesional' | 'amigable' | 'urgente'>('profesional')
  const [generatedReply, setGeneratedReply] = useState('')
  const bottomRef = useRef<HTMLDivElement>(null)

  const selectedLead = leads.find((l) => l.id === selectedLeadId)

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [messages])

  function sendMessage() {
    if (!input.trim()) return
    const msg: Message = {
      id: Date.now().toString(),
      leadId: selectedLeadId || '1',
      sender: 'agent',
      content: input.trim(),
      timestamp: new Date().toISOString(),
    }
    setMessages((m) => [...m, msg])
    setInput('')
  }

  async function handleGenerateReply() {
    if (!selectedLeadId) return
    setGeneratedReply('Generando...')
    try {
      const result = await generateReply.mutateAsync({
        leadId: selectedLeadId,
        tone,
      })
      setGeneratedReply(result.reply)
    } catch {
      setGeneratedReply('(Sin conexión — escribe tu respuesta manualmente)')
    }
  }

  function useGeneratedReply() {
    setInput(generatedReply)
    setGeneratedReply('')
  }

  return (
    <div style={{ display: 'flex', gap: '1rem', height: 'calc(100vh - 3rem)' }}>
      {/* Panel de chat */}
      <div style={{ flex: 1, display: 'flex', flexDirection: 'column', background: 'white', borderRadius: 8, border: '1px solid #e2e8f0', overflow: 'hidden' }}>
        {/* Header */}
        <div style={{ padding: '1rem', borderBottom: '1px solid #e2e8f0', background: '#f8fafc' }}>
          <div style={{ fontWeight: 600, color: '#1e293b', fontSize: 15 }}>
            {selectedLead ? `${selectedLead.name} — ${selectedLead.company}` : 'Selecciona un lead'}
          </div>
          <div style={{ fontSize: 12, color: '#64748b', marginTop: 2 }}>
            💬 Chat de extensión de navegador (simulado)
          </div>
        </div>

        {/* Mensajes */}
        <div style={{ flex: 1, overflow: 'auto', padding: '1rem', display: 'flex', flexDirection: 'column', gap: 12 }}>
          {messages.map((msg) => (
            <div
              key={msg.id}
              style={{
                display: 'flex',
                justifyContent: msg.sender === 'agent' ? 'flex-end' : 'flex-start',
              }}
            >
              <div style={{
                maxWidth: '70%',
                padding: '8px 12px',
                borderRadius: msg.sender === 'agent' ? '12px 12px 4px 12px' : '12px 12px 12px 4px',
                background: msg.sender === 'agent' ? '#3b82f6' : '#f1f5f9',
                color: msg.sender === 'agent' ? 'white' : '#1e293b',
                fontSize: 13,
              }}>
                {msg.content}
                <div style={{ fontSize: 10, opacity: 0.6, marginTop: 4, textAlign: 'right' }}>
                  {new Date(msg.timestamp).toLocaleTimeString('es', { timeStyle: 'short' })}
                  {msg.isAIGenerated && ' · IA'}
                </div>
              </div>
            </div>
          ))}
          <div ref={bottomRef} />
        </div>

        {/* Input */}
        <div style={{ padding: '0.75rem', borderTop: '1px solid #e2e8f0', display: 'flex', gap: 8 }}>
          <input
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && !e.shiftKey && sendMessage()}
            placeholder="Escribe un mensaje..."
            maxLength={2000}
            style={{
              flex: 1,
              padding: '8px 12px',
              border: '1px solid #e2e8f0',
              borderRadius: 6,
              fontSize: 13,
              outline: 'none',
            }}
          />
          <button
            onClick={sendMessage}
            disabled={!input.trim()}
            style={{
              padding: '8px 16px',
              background: input.trim() ? '#3b82f6' : '#e2e8f0',
              color: input.trim() ? 'white' : '#94a3b8',
              border: 'none',
              borderRadius: 6,
              cursor: input.trim() ? 'pointer' : 'not-allowed',
              fontSize: 13,
            }}
          >
            Enviar
          </button>
        </div>
      </div>

      {/* Panel generador de respuestas IA */}
      <div style={{ width: 280, background: 'white', borderRadius: 8, border: '1px solid #e2e8f0', padding: '1rem', display: 'flex', flexDirection: 'column', gap: 12 }}>
        <div style={{ fontWeight: 600, color: '#1e293b', fontSize: 14 }}>🤖 Generar respuesta IA</div>

        <div>
          <label style={{ fontSize: 12, color: '#64748b', display: 'block', marginBottom: 6 }}>Tono</label>
          <div style={{ display: 'flex', gap: 6 }}>
            {(['profesional', 'amigable', 'urgente'] as const).map((t) => (
              <button
                key={t}
                onClick={() => setTone(t)}
                style={{
                  flex: 1,
                  padding: '5px 4px',
                  borderRadius: 5,
                  border: '1px solid',
                  borderColor: tone === t ? '#3b82f6' : '#e2e8f0',
                  background: tone === t ? '#eff6ff' : 'white',
                  color: tone === t ? '#1d4ed8' : '#64748b',
                  cursor: 'pointer',
                  fontSize: 11,
                }}
              >
                {t}
              </button>
            ))}
          </div>
        </div>

        <button
          onClick={handleGenerateReply}
          disabled={!selectedLeadId || generateReply.isPending}
          style={{
            padding: '8px',
            background: '#3b82f6',
            color: 'white',
            border: 'none',
            borderRadius: 6,
            cursor: selectedLeadId ? 'pointer' : 'not-allowed',
            fontSize: 13,
            opacity: !selectedLeadId ? 0.5 : 1,
          }}
        >
          {generateReply.isPending ? 'Generando...' : '✨ Generar respuesta'}
        </button>

        {generatedReply && (
          <>
            <textarea
              value={generatedReply}
              onChange={(e) => setGeneratedReply(e.target.value)}
              rows={6}
              style={{
                padding: '8px',
                border: '1px solid #e2e8f0',
                borderRadius: 6,
                fontSize: 12,
                resize: 'vertical',
                outline: 'none',
                fontFamily: 'inherit',
              }}
            />
            <button
              onClick={useGeneratedReply}
              style={{
                padding: '7px',
                background: '#22c55e',
                color: 'white',
                border: 'none',
                borderRadius: 6,
                cursor: 'pointer',
                fontSize: 13,
              }}
            >
              Usar esta respuesta
            </button>
          </>
        )}
      </div>
    </div>
  )
}
