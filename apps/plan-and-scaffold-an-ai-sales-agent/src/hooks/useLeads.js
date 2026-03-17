import { useState, useEffect, useCallback } from 'react'
import { apiClient } from '../lib/api-client.js'

/**
 * Hook para gestionar la lista de leads con filtrado y paginación.
 * Consume el endpoint REST GET /api/leads con cliente tipado.
 */
export function useLeads(filters = {}) {
  const [leads, setLeads] = useState([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(null)

  const fetchLeads = useCallback(async () => {
    setLoading(true)
    setError(null)
    try {
      const data = await apiClient.getLeads(filters)
      setLeads(Array.isArray(data) ? data : data.leads ?? [])
    } catch (err) {
      setError(err.message)
      // Datos de ejemplo para desarrollo sin backend
      setLeads(MOCK_LEADS)
    } finally {
      setLoading(false)
    }
  }, [JSON.stringify(filters)])

  useEffect(() => { fetchLeads() }, [fetchLeads])

  const updateLeadStatus = useCallback(async (id, status) => {
    try {
      const updated = await apiClient.updateLead(id, { status })
      setLeads(prev => prev.map(l => l.id === id ? { ...l, ...updated } : l))
    } catch {
      setLeads(prev => prev.map(l => l.id === id ? { ...l, status } : l))
    }
  }, [])

  return { leads, loading, error, refetch: fetchLeads, updateLeadStatus }
}

const MOCK_LEADS = [
  {
    id: '1', name: 'María González', company: 'TechCorp SA', title: 'CTO',
    email: 'maria@techcorp.com', linkedin_url: 'https://linkedin.com/in/mgonzalez',
    status: 'replied', created_at: '2026-03-15T10:00:00Z',
  },
  {
    id: '2', name: 'Carlos Mendoza', company: 'Innovate Labs', title: 'VP Ventas',
    email: 'carlos@innovate.io', linkedin_url: 'https://linkedin.com/in/cmendoza',
    status: 'contacted', created_at: '2026-03-14T09:00:00Z',
  },
  {
    id: '3', name: 'Ana Ruiz', company: 'DataFlow Inc', title: 'CEO',
    email: 'ana@dataflow.com', linkedin_url: 'https://linkedin.com/in/aruiz',
    status: 'new', created_at: '2026-03-16T08:00:00Z',
  },
]
