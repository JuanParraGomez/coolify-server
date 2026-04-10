import React from 'react'
import { useApp } from '../context/AppContext'
import { USERS } from '../lib/mock-data'

export default function Header() {
  const { state, dispatch } = useApp()

  const today = new Date().toLocaleDateString('es-MX', {
    weekday: 'long', day: 'numeric', month: 'long',
  })

  return (
    <header style={{
      height: 'var(--header-h)',
      background: 'var(--surface)',
      borderBottom: '1px solid var(--border)',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'space-between',
      padding: '0 20px',
      flexShrink: 0,
    }}>
      <div>
        <div style={{ fontWeight: 700, fontSize: 17, color: 'var(--text)' }}>Agenda Compartida</div>
        <div style={{ fontSize: 12, color: 'var(--muted)', textTransform: 'capitalize' }}>{today}</div>
      </div>

      <div style={{ display: 'flex', gap: 8 }}>
        {Object.values(USERS).map(user => {
          const active = state.currentUser === user.id
          return (
            <button
              key={user.id}
              onClick={() => dispatch({ type: 'SET_USER', payload: user.id })}
              className={`badge badge-${user.id}`}
              style={{
                background: active ? user.color : undefined,
                color: active ? '#fff' : undefined,
                minHeight: 36,
                fontSize: 13,
                padding: '0 12px',
                borderRadius: 999,
                fontWeight: 600,
                border: active ? 'none' : `1.5px solid ${user.color}`,
                transition: 'all .15s',
              }}
            >
              {user.name}
            </button>
          )
        })}
      </div>
    </header>
  )
}
