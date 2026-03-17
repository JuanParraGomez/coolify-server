import { useMutation } from '@tanstack/react-query'
import { aiApi } from '../lib/apiClient'
import { useAppStore } from '../store'
import type { AIReplyRequest, ResearchRequest } from '../types'

export function useGenerateReply() {
  const activeProvider = useAppStore((s) => s.activeProvider)

  return useMutation({
    mutationFn: (req: Omit<AIReplyRequest, 'provider'>) =>
      aiApi.generateReply({ ...req, provider: activeProvider }),
  })
}

export function useResearchProfile() {
  const activeProvider = useAppStore((s) => s.activeProvider)

  return useMutation({
    mutationFn: (req: Omit<ResearchRequest, 'provider'>) =>
      aiApi.researchProfile({ ...req, provider: activeProvider }),
  })
}

export function useTestConnection() {
  return useMutation({
    mutationFn: ({ provider, apiKey }: { provider: string; apiKey: string }) =>
      aiApi.testConnection(provider, apiKey),
  })
}
