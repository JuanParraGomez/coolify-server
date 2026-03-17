import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { notificationsApi } from '../lib/apiClient'
import { useAppStore } from '../store'

export function useNotifications() {
  const setNotifications = useAppStore((s) => s.setNotifications)

  return useQuery({
    queryKey: ['notifications'],
    queryFn: async () => {
      const data = await notificationsApi.list()
      setNotifications(data)
      return data
    },
    refetchInterval: 30_000, // polling cada 30 segundos
    staleTime: 15_000,
  })
}

export function useMarkNotificationRead() {
  const qc = useQueryClient()
  const markRead = useAppStore((s) => s.markNotificationRead)
  return useMutation({
    mutationFn: notificationsApi.markRead,
    onSuccess: (_, id) => {
      markRead(id)
      qc.invalidateQueries({ queryKey: ['notifications'] })
    },
  })
}
