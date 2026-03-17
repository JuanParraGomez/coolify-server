import { useState, useCallback } from 'react'
import { apiClient } from '../lib/api-client.js'

/**
 * Hook para investigación social pre-entrevista de tomadores de decisión.
 * Consume POST /api/research/social y GET /api/leads/:id/research.
 */
export function useResearch() {
  const [report, setReport] = useState(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(null)

  const researchLead = useCallback(async (leadId) => {
    setLoading(true)
    setError(null)
    try {
      const data = await apiClient.getResearchReport(leadId)
      setReport(data)
    } catch (err) {
      setError(err.message)
      setReport(MOCK_REPORT)
    } finally {
      setLoading(false)
    }
  }, [])

  const searchContact = useCallback(async (query) => {
    setLoading(true)
    setError(null)
    try {
      const profile = await apiClient.researchContact(query)
      setReport({ profile, summary: '', talking_points: [], generated_at: new Date().toISOString() })
    } catch (err) {
      setError(err.message)
      setReport(MOCK_REPORT)
    } finally {
      setLoading(false)
    }
  }, [])

  return { report, loading, error, researchLead, searchContact }
}

const MOCK_REPORT = {
  lead_id: '1',
  profile: {
    name: 'María González',
    title: 'CTO en TechCorp SA',
    company: 'TechCorp SA',
    linkedin_url: 'https://linkedin.com/in/mgonzalez',
    recent_posts: [
      'Cómo implementamos microservicios en TechCorp - thread de arquitectura',
      'Contratamos! Buscamos 3 ingenieros senior en Rust',
      'Reflexiones sobre liderazgo técnico en 2026',
    ],
    interests: ['Arquitectura cloud', 'DevOps', 'Ingeniería de software', 'IA generativa'],
    bio: 'CTO con 12 años de experiencia en startups tecnológicas. Apasionada por la escalabilidad y los equipos de alto rendimiento.',
  },
  summary: 'María es una tomadora de decisiones técnicas con fuerte influencia en compras de infraestructura. Activa en LinkedIn con foco en equipos y arquitectura.',
  talking_points: [
    'Mencionar su artículo reciente sobre microservicios',
    'Ofrecer caso de uso relacionado con escalabilidad',
    'Conectar con su interés en IA generativa',
    'Referencia a sus contrataciones activas como señal de crecimiento',
  ],
  generated_at: '2026-03-16T10:00:00Z',
}
