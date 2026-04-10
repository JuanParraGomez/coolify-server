import React from 'react'
import { BrowserRouter, Routes, Route } from 'react-router-dom'
import { AppProvider } from './context/AppContext'
import BottomNav from './components/BottomNav'
import TodayPage from './pages/TodayPage'
import CalendarPage from './pages/CalendarPage'
import TasksPage from './pages/TasksPage'
import TrackingPage from './pages/TrackingPage'

export default function App() {
  return (
    <BrowserRouter>
      <AppProvider>
        <div style={{ display: 'flex', flexDirection: 'column', height: '100vh', overflow: 'hidden' }}>
          <main style={{ flex: 1, overflow: 'hidden' }}>
            <Routes>
              <Route path="/" element={<TodayPage />} />
              <Route path="/calendar" element={<CalendarPage />} />
              <Route path="/tasks" element={<TasksPage />} />
              <Route path="/tracking" element={<TrackingPage />} />
            </Routes>
          </main>
          <BottomNav />
        </div>
      </AppProvider>
    </BrowserRouter>
  )
}
