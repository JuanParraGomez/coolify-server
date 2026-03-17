import { useState, useCallback } from 'react'
import { apiClient } from '../lib/api-client.js'

/**
 * Hook para el chat con un lead específico.
 * Consume GET /api/leads/:id/messages y POST /api/leads/:id/messages.
 * Genera respuestas IA via POST /api/leads/:id/ai-response.
 */
export function useChat(leadId) {
  const [messages, setMessages] = useState([])
  const [aiDraft, setAiDraft] = useState('')
  const [loadingMessages, setLoadingMessages] = useState(false)
  const [loadingAi, setLoadingAi] = useState(false)
  const [error, setError] = useState(null)

  const loadMessages = useCallback(async () => {
    if (!leadId) return
    setLoadingMessages(true)
    try {
      const data = await apiClient.getMessages(leadId)
      setMessages(Array.isArray(data) ? data : data.messages ?? [])
    } catch {
      setMessages(MOCK_MESSAGES)
    } finally {
      setLoadingMessages(false)
    }
  }, [leadId])

  const sendMessage = useCallback(async (content) => {
    const optimistic = {
      id: `tmp-${Date.now()}`, lead_id: leadId,
      direction: 'outbound', content,
      created_at: new Date().toISOString(),
    }
    setMessages(prev => [...prev, optimistic])
    try {
      const saved = await apiClient.sendMessage(leadId, content)
      setMessages(prev => prev.map(m => m.id === optimistic.id ? saved : m))
    } catch {
      // mantener mensaje optimista con indicador de error
    }
  }, [leadId])

  const generateAiResponse = useCallback(async (context = '') => {
    setLoadingAi(true)
    setAiDraft('')
    try {
      const { suggestion } = await apiClient.generateAiResponse(leadId, context)
      setAiDraft(suggestion)
    } catch {
      setAiDraft('No se pudo generar respuesta. Verifica tu configuración de API.')
    } finally {
      setLoadingAi(false)
    }
  }, [leadId])

  return {
    messages, aiDraft, setAiDraft,
    loadingMessages, loadingAi, error,
    loadMessages, sendMessage, generateAiResponse,
  }
}

const MOCK_MESSAGES = [
  {
    id: 'm1', lead_id: '1', direction: 'outbound',
    content: 'Hola María, vi tu trabajo en TechCorp y me parece muy interesante...',
    created_at: '2026-03-14T10:00:00Z', is_ai_generated: true,
  },
  {
    id: 'm2', lead_id: '1', direction: 'inbound',
    content: 'Hola! Gracias por contactarme. ¿En qué puedo ayudarte?',
    created_at: '2026-03-15T09:30:00Z',
  },
]
