import React from 'react'
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom'
import AppShell from './components/AppShell.jsx'
import Dashboard from './components/Dashboard.jsx'
import Leads from './pages/Leads.jsx'
import Chat from './pages/Chat.jsx'
import Responses from './pages/Responses.jsx'
import Research from './pages/Research.jsx'
import Alerts from './pages/Alerts.jsx'
import LangGraphAgent from './pages/LangGraphAgent.jsx'
import Settings from './pages/Settings.jsx'

export function App() {
  return (
    <BrowserRouter>
      <AppShell>
        <Routes>
          <Route path="/" element={<Navigate to="/leads" replace />} />
          <Route path="/dashboard"  element={<Dashboard />} />
          <Route path="/leads"      element={<Leads />} />
          <Route path="/chat"       element={<Chat />} />
          <Route path="/responses"  element={<Responses />} />
          <Route path="/research"   element={<Research />} />
          <Route path="/alerts"     element={<Alerts />} />
          <Route path="/langgraph"  element={<LangGraphAgent />} />
          <Route path="/settings"   element={<Settings />} />
          <Route path="/apiconfig"  element={<Settings />} />
        </Routes>
      </AppShell>
    </BrowserRouter>
  )
}
