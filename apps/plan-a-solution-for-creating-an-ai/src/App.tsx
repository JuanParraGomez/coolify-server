import React from 'react'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import Layout from './components/Layout'
import LeadsList from './components/LeadsList'
import ChatPanel from './components/ChatPanel'
import SocialResearch from './components/SocialResearch'
import ApiKeyConfig from './components/ApiKeyConfig'
import NotificationsPanel from './components/NotificationsPanel'
import { useAppStore } from './store'

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      retry: 1,
      refetchOnWindowFocus: false,
    },
  },
})

function AppContent() {
  const activeSection = useAppStore((s) => s.activeSection)

  return (
    <Layout>
      {activeSection === 'leads' && <LeadsList />}
      {activeSection === 'chat' && <ChatPanel />}
      {activeSection === 'research' && <SocialResearch />}
      {activeSection === 'config' && (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '2rem' }}>
          <ApiKeyConfig />
          <NotificationsPanel />
        </div>
      )}
    </Layout>
  )
}

export default function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <AppContent />
    </QueryClientProvider>
  )
}
