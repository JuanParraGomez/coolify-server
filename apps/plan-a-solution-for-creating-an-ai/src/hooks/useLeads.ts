import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { leadsApi } from '../lib/apiClient'
import { useAppStore } from '../store'
import type { Lead } from '../types'

export function useLeads() {
  const setLeads = useAppStore((s) => s.setLeads)

  return useQuery({
    queryKey: ['leads'],
    queryFn: async () => {
      const data = await leadsApi.list()
      setLeads(data)
      return data
    },
    refetchInterval: 60_000, // refrescar cada minuto
    staleTime: 30_000,
  })
}

export function useUpdateLead() {
  const qc = useQueryClient()
  return useMutation({
    mutationFn: ({ id, data }: { id: string; data: Partial<Lead> }) =>
      leadsApi.update(id, data),
    onSuccess: () => qc.invalidateQueries({ queryKey: ['leads'] }),
  })
}

export function useCreateLead() {
  const qc = useQueryClient()
  return useMutation({
    mutationFn: (data: Omit<Lead, 'id' | 'messages' | 'lastActivity'>) =>
      leadsApi.create(data),
    onSuccess: () => qc.invalidateQueries({ queryKey: ['leads'] }),
  })
}
