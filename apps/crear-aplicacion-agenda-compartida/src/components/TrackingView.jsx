import React from 'react'
import { useApp } from '../context/AppContext'
import { USERS } from '../lib/mock-data'

function StatCard({ label, value, color, sub }) {
  return (
    <div className="card" style={{ marginBottom: 0, display: 'flex', flexDirection: 'column', gap: 4 }}>
      <p style={{ fontSize: 12, color: 'var(--muted)', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '.4px' }}>{label}</p>
      <p style={{ fontSize: 32, fontWeight: 800, color }}>{value}</p>
      {sub && <p style={{ fontSize: 12, color: 'var(--muted)' }}>{sub}</p>}
    </div>
  )
}

function ProgressBar({ value, max, color }) {
  const pct = max > 0 ? Math.round((value / max) * 100) : 0
  return (
    <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
      <div style={{ flex: 1, background: 'var(--bg)', borderRadius: 999, height: 8 }}>
        <div style={{ width: pct + '%', height: 8, borderRadius: 999, background: color, transition: 'width .4s' }} />
      </div>
      <span style={{ fontSize: 12, color: 'var(--muted)', width: 32, textAlign: 'right' }}>{pct}%</span>
    </div>
  )
}

export default function TrackingView() {
  const { state } = useApp()
  const { tasks } = state

  const total = tasks.length
  const done = tasks.filter(t => t.status === 'done').length
  const inProgress = tasks.filter(t => t.status === 'in-progress').length
  const highActive = tasks.filter(t => t.priority === 'high' && t.status !== 'done').length

  const today = new Date()
  today.setHours(0, 0, 0, 0)
  const overdue = tasks.filter(t => {
    if (t.status === 'done' || !t.dueDate) return false
    return new Date(t.dueDate) < today
  }).length

  const userStats = Object.values(USERS).map(user => {
    const ut = tasks.filter(t => t.updatedBy === user.id)
    return { ...user, total: ut.length, done: ut.filter(t => t.status === 'done').length }
  })

  const priorities = [
    { label: 'Alta', value: tasks.filter(t => t.priority === 'high').length, color: 'var(--danger)' },
    { label: 'Media', value: tasks.filter(t => t.priority === 'medium').length, color: '#F59E0B' },
    { label: 'Baja', value: tasks.filter(t => t.priority === 'low').length, color: 'var(--success)' },
  ]

  const recent = [...tasks].sort((a, b) => new Date(b.updatedAt) - new Date(a.updatedAt)).slice(0, 6)

  return (
    <div style={{ overflowY: 'auto', height: '100%', padding: 16 }}>
      {/* Stats grid */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: 12, marginBottom: 16 }}>
        <StatCard label="Total" value={total} color="var(--juan)" />
        <StatCard label="Completados" value={done} color="var(--success)" sub={total ? `${Math.round((done / total) * 100)}% del total` : ''} />
        <StatCard label="En progreso" value={inProgress} color="#3B82F6" />
        <StatCard label="Vencidos" value={overdue} color={overdue > 0 ? 'var(--danger)' : 'var(--success)'} />
      </div>

      {/* Progress */}
      <div className="card" style={{ marginBottom: 16 }}>
        <p style={{ fontWeight: 700, marginBottom: 16 }}>Progreso general</p>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
          {[
            { label: 'Completados', value: done, color: 'var(--success)' },
            { label: 'En progreso', value: inProgress, color: '#3B82F6' },
            { label: 'Alta prioridad sin completar', value: highActive, color: 'var(--danger)' },
          ].map(item => (
            <div key={item.label}>
              <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 13, color: 'var(--muted)', marginBottom: 4 }}>
                <span>{item.label}</span>
                <span>{item.value}/{total}</span>
              </div>
              <ProgressBar value={item.value} max={total} color={item.color} />
            </div>
          ))}
        </div>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12, marginBottom: 16 }}>
        {/* By user */}
        <div className="card" style={{ marginBottom: 0 }}>
          <p style={{ fontWeight: 700, marginBottom: 12 }}>Por usuario</p>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
            {userStats.map(user => (
              <div key={user.id}>
                <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 13, marginBottom: 4 }}>
                  <span style={{ fontWeight: 600, color: user.color }}>{user.name}</span>
                  <span style={{ color: 'var(--muted)' }}>{user.done}/{user.total}</span>
                </div>
                <ProgressBar value={user.done} max={user.total} color={user.color} />
              </div>
            ))}
          </div>
        </div>

        {/* By priority */}
        <div className="card" style={{ marginBottom: 0 }}>
          <p style={{ fontWeight: 700, marginBottom: 12 }}>Por prioridad</p>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
            {priorities.map(p => (
              <div key={p.label}>
                <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 13, marginBottom: 4 }}>
                  <span style={{ fontWeight: 600, color: 'var(--text)' }}>{p.label}</span>
                  <span style={{ color: 'var(--muted)' }}>{p.value} tareas</span>
                </div>
                <ProgressBar value={p.value} max={total} color={p.color} />
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Recent activity */}
      <div className="card">
        <p style={{ fontWeight: 700, marginBottom: 12 }}>Actividad reciente</p>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
          {recent.map(task => {
            const user = USERS[task.updatedBy]
            const dotColor = { done: 'var(--success)', 'in-progress': '#3B82F6', pending: 'var(--border)' }[task.status]
            return (
              <div key={task.id} style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                <span style={{ width: 8, height: 8, borderRadius: '50%', background: dotColor, flexShrink: 0 }} />
                <span style={{ flex: 1, fontSize: 14, color: 'var(--text)', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                  {task.title}
                </span>
                <span style={{ fontSize: 12, color: user?.color, fontWeight: 600, flexShrink: 0 }}>{user?.name}</span>
              </div>
            )
          })}
        </div>
      </div>
    </div>
  )
}
