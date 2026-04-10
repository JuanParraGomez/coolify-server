import React from 'react'
import TrackingView from '../components/TrackingView'

export default function TrackingPage() {
  return (
    <div className="flex flex-col h-full">
      <header className="bg-white border-b border-gray-100 px-5 flex items-center" style={{ height: '64px' }}>
        <div>
          <h1 className="text-xl font-bold text-gray-900">Seguimiento</h1>
          <p className="text-xs text-gray-400">Progreso y métricas</p>
        </div>
      </header>
      <div className="flex-1 overflow-hidden min-h-0">
        <TrackingView />
      </div>
    </div>
  )
}
