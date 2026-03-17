import { create } from 'zustand'
import { persist } from 'zustand/middleware'
import type { AIProviderName, Lead, Notification } from '../types'
import { DEFAULT_MODELS } from '../types'

interface ProviderKeys {
  openai: string
  gemini: string
  claude: string
  deepseek: string
}

interface AppState {
  // ─── Sección activa ──────────────────────────────────────────────────────────
  activeSection: 'leads' | 'chat' | 'research' | 'config'
  setActiveSection: (s: AppState['activeSection']) => void

  // ─── Proveedor IA ─────────────────────────────────────────────────────────────
  activeProvider: AIProviderName
  providerKeys: ProviderKeys
  providerModels: Record<AIProviderName, string>
  setActiveProvider: (p: AIProviderName) => void
  setProviderKey: (p: AIProviderName, key: string) => void
  setProviderModel: (p: AIProviderName, model: string) => void

  // ─── Lead seleccionado ────────────────────────────────────────────────────────
  selectedLeadId: string | null
  selectLead: (id: string | null) => void

  // ─── Notificaciones (cache local) ─────────────────────────────────────────────
  notifications: Notification[]
  unreadCount: number
  setNotifications: (n: Notification[]) => void
  markNotificationRead: (id: string) => void

  // ─── Leads (cache local) ──────────────────────────────────────────────────────
  leads: Lead[]
  setLeads: (l: Lead[]) => void
}

export const useAppStore = create<AppState>()(
  persist(
    (set, get) => ({
      activeSection: 'leads',
      setActiveSection: (activeSection) => set({ activeSection }),

      activeProvider: 'openai',
      providerKeys: { openai: '', gemini: '', claude: '', deepseek: '' },
      providerModels: { ...DEFAULT_MODELS },
      setActiveProvider: (activeProvider) => set({ activeProvider }),
      setProviderKey: (p, key) =>
        set((s) => ({ providerKeys: { ...s.providerKeys, [p]: key } })),
      setProviderModel: (p, model) =>
        set((s) => ({ providerModels: { ...s.providerModels, [p]: model } })),

      selectedLeadId: null,
      selectLead: (selectedLeadId) => set({ selectedLeadId }),

      notifications: [],
      unreadCount: 0,
      setNotifications: (notifications) =>
        set({ notifications, unreadCount: notifications.filter((n) => !n.read).length }),
      markNotificationRead: (id) =>
        set((s) => {
          const notifications = s.notifications.map((n) =>
            n.id === id ? { ...n, read: true } : n
          )
          return { notifications, unreadCount: notifications.filter((n) => !n.read).length }
        }),

      leads: [],
      setLeads: (leads) => set({ leads }),
    }),
    {
      name: 'ai_provider_config',
      // Solo persistir la configuración del proveedor; el resto se recarga desde la API
      partialize: (s) => ({
        activeProvider: s.activeProvider,
        providerKeys: s.providerKeys,
        providerModels: s.providerModels,
      }),
    }
  )
)
