import { useState, useCallback } from 'react'
import { apiClient } from '../lib/api-client.js'

/**
 * Hook para orquestar el agente de ventas con LangGraph.
 *
 * Arquitectura LangGraph del agente:
 *   [START] → qualify_lead → research_social → draft_message → review_tone → [END]
 *                ↑                                                    ↓
 *                └──────────── revise_draft ←────────────────────────┘
 *
 * Consume la API REST del servidor LangGraph:
 *   POST /api/agent/run       — inicia un run
 *   GET  /api/agent/run/:id   — polling del estado
 *   GET  /api/agent/history   — historial de runs
 */
export function useLangGraph() {
  const [currentRun, setCurrentRun] = useState(null)
  const [history, setHistory] = useState([])
  const [running, setRunning] = useState(false)
  const [error, setError] = useState(null)

  const startRun = useCallback(async (input) => {
    setRunning(true)
    setError(null)
    try {
      const run = await apiClient.startAgentRun(input)
      setCurrentRun(run)
      // Polling cada 2s hasta completar
      await pollRun(run.run_id)
    } catch (err) {
      setError(err.message)
      setCurrentRun(MOCK_RUN)
    } finally {
      setRunning(false)
    }
  }, [])

  async function pollRun(runId, attempts = 0) {
    if (attempts > 30) return
    await new Promise(r => setTimeout(r, 2000))
    try {
      const run = await apiClient.getAgentRun(runId)
      setCurrentRun(run)
      if (run.status === 'running' || run.status === 'pending') {
        await pollRun(runId, attempts + 1)
      }
    } catch {}
  }

  const loadHistory = useCallback(async () => {
    try {
      const data = await apiClient.getAgentHistory()
      setHistory(Array.isArray(data) ? data : data.runs ?? [])
    } catch {
      setHistory([MOCK_RUN])
    }
  }, [])

  return { currentRun, history, running, error, startRun, loadHistory }
}

const MOCK_RUN = {
  run_id: 'run-001',
  status: 'completed',
  input: 'Generar mensaje personalizado para María González, CTO de TechCorp',
  output: 'Hola María, vi tu artículo sobre microservicios y me pareció muy valioso. En [Empresa] ayudamos a CTOs como tú a escalar infraestructura sin sacrificar velocidad de desarrollo. ¿Tienes 15 minutos esta semana?',
  steps: [
    { node: 'qualify_lead', action: 'Verificar calificación del lead', result: 'Calificado - decisor técnico', duration_ms: 320 },
    { node: 'research_social', action: 'Investigar perfil LinkedIn y actividad reciente', result: 'Encontrados 3 posts relevantes', duration_ms: 1840 },
    { node: 'draft_message', action: 'Redactar mensaje personalizado con contexto', result: 'Borrador generado', duration_ms: 980 },
    { node: 'review_tone', action: 'Revisar tono y profesionalismo', result: 'Aprobado', duration_ms: 210 },
  ],
  created_at: '2026-03-16T11:00:00Z',
}
