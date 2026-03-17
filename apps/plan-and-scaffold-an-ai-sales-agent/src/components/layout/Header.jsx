import React from 'react'
import { NAV_ITEMS } from '../../lib/constants.js'

export function Header({ activeView }) {
  const current = NAV_ITEMS.find(n => n.id === activeView)
  return (
    <header className="topbar">
      <h1>{current ? `${current.icon} ${current.label}` : 'Agente de Ventas IA'}</h1>
      <div className="flex items-center gap-2">
        <span className="text-muted text-sm">16 Mar 2026</span>
      </div>
    </header>
  )
}
