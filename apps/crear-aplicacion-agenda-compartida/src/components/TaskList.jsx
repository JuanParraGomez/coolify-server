import React, { useState } from 'react'
import TaskModal from './TaskModal'
import { useApp } from '../context/AppContext'
import { USERS } from '../lib/mock-data'

const PRIORITY_STYLE = {
  high: { label: 'Alta', borderColor: 'var(--danger)' },
  medium: { label: 'Media', borderColor: '#F59E0B' },
  low: { label: 'Baja', borderColor: 'var(--success)' },
}
const STATUS_LABEL = { pending: 'Pendiente', 'in-progress': 'En progreso', done: 'Completado' }
const STATUS_COLOR = { pending: 'var(--muted)', 'in-progress': '#3B82F6', done: 'var(--success)' }

function isOverdue(dueDate, status) {
  if (!dueDate || status === 'done') return false
  const due = new Date(dueDate + 'T23:59:59')
  return due < new Date()
}

export default function TaskList({ filterStatus = 'all', compact = false }) {
  const { state, dispatch } = useApp()
  const { tasks } = state

  const [filterPrio, setFilterPrio] = useState('all')
  const [search, setSearch] = useState('')
  const [modalOpen, setModalOpen] = useState(false)
  const [editingTask, setEditingTask] = useState(null)

  const filtered = tasks.filter(t => {
    if (filterStatus !== 'all' && t.status !== filterStatus) return false
    if (filterPrio !== 'all' && t.priority !== filterPrio) return false
    if (search && !t.title.toLowerCase().includes(search.toLowerCase())) return false
    return true
  })

  function handleSave(form) {
    if (editingTask) {
      dispatch({ type: 'UPDATE_TASK', payload: { id: editingTask.id, ...form } })
    } else {
      dispatch({ type: 'ADD_TASK', payload: form })
    }
    setEditingTask(null)
  }

  function cycleStatus(task) {
    const next = { pending: 'in-progress', 'in-progress': 'done', done: 'pending' }
    dispatch({ type: 'UPDATE_TASK', payload: { id: task.id, status: next[task.status] } })
  }

  if (compact) {
    // Simplified list for TodayPage
    return (
      <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
        {filtered.slice(0, 5).map(task => (
          <div
            key={task.id}
            className="card"
            style={{
              marginBottom: 0,
              borderLeft: `3px solid ${PRIORITY_STYLE[task.priority]?.borderColor}`,
              opacity: task.status === 'done' ? 0.6 : 1,
              display: 'flex',
              alignItems: 'center',
              gap: 10,
              padding: '10px 14px',
            }}
          >
            <button
              onClick={() => cycleStatus(task)}
              style={{
                width: 22, height: 22, borderRadius: '50%', flexShrink: 0,
                border: `2px solid ${STATUS_COLOR[task.status]}`,
                background: task.status === 'done' ? STATUS_COLOR['done'] : 'transparent',
                color: '#fff',
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                fontSize: 11, fontWeight: 700,
              }}
            >
              {task.status === 'done' ? '✓' : ''}
            </button>
            <span style={{
              flex: 1, fontSize: 14, fontWeight: 500,
              textDecoration: task.status === 'done' ? 'line-through' : 'none',
              color: task.status === 'done' ? 'var(--muted)' : 'var(--text)',
              overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap',
            }}>
              {task.title}
            </span>
            {task.dueDate && (
              <span style={{ fontSize: 11, color: isOverdue(task.dueDate, task.status) ? 'var(--danger)' : 'var(--muted)', flexShrink: 0 }}>
                {new Date(task.dueDate + 'T12:00:00').toLocaleDateString('es-MX', { day: 'numeric', month: 'short' })}
              </span>
            )}
          </div>
        ))}
        {filtered.length === 0 && <div className="empty"><div className="empty-text">Sin pendientes</div></div>}
      </div>
    )
  }

  return (
    <div style={{ height: '100%', overflow: 'hidden', display: 'flex', flexDirection: 'column' }}>
      {/* Toolbar */}
      <div style={{ display: 'flex', gap: 10, marginBottom: 12, flexWrap: 'wrap' }}>
        <input
          style={{ flex: 1, minWidth: 180, border: '1.5px solid var(--border)', borderRadius: 10, padding: '8px 12px', fontSize: 14, background: 'var(--surface)' }}
          placeholder="Buscar pendiente..."
          value={search}
          onChange={e => setSearch(e.target.value)}
        />
        <button
          className="btn btn-primary"
          onClick={() => { setEditingTask(null); setModalOpen(true) }}
        >
          + Nuevo
        </button>
      </div>

      {/* Filters */}
      <div style={{ display: 'flex', gap: 6, marginBottom: 12, flexWrap: 'wrap' }}>
        {['all', 'high', 'medium', 'low'].map(p => (
          <button
            key={p}
            onClick={() => setFilterPrio(p)}
            style={{
              fontSize: 12, padding: '4px 12px', borderRadius: 999, fontWeight: 600,
              background: filterPrio === p ? 'var(--juan)' : 'var(--bg)',
              color: filterPrio === p ? '#fff' : 'var(--muted)',
              border: 'none',
            }}
          >
            {p === 'all' ? 'Todo' : PRIORITY_STYLE[p]?.label}
          </button>
        ))}
      </div>

      <p style={{ fontSize: 12, color: 'var(--muted)', marginBottom: 8 }}>{filtered.length} resultado{filtered.length !== 1 ? 's' : ''}</p>

      {/* Task list */}
      <div style={{ overflowY: 'auto', flex: 1 }}>
        {filtered.length === 0 && (
          <div className="empty">
            <div className="empty-icon">🎉</div>
            <div className="empty-text">Sin pendientes que coincidan</div>
          </div>
        )}
        {filtered.map(task => {
          const updatedBy = USERS[task.updatedBy]
          const overdue = isOverdue(task.dueDate, task.status)
          const prio = PRIORITY_STYLE[task.priority]

          return (
            <div
              key={task.id}
              className="card"
              style={{
                borderLeft: `3px solid ${prio?.borderColor}`,
                opacity: task.status === 'done' ? 0.65 : 1,
                display: 'flex',
                alignItems: 'flex-start',
                gap: 10,
              }}
            >
              {/* Status circle */}
              <button
                onClick={() => cycleStatus(task)}
                title="Cambiar estado"
                style={{
                  marginTop: 2, width: 22, height: 22, borderRadius: '50%', flexShrink: 0,
                  border: `2px solid ${STATUS_COLOR[task.status]}`,
                  background: task.status === 'done' ? STATUS_COLOR['done'] : task.status === 'in-progress' ? '#DBEAFE' : 'transparent',
                  color: task.status === 'done' ? '#fff' : STATUS_COLOR[task.status],
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                  fontSize: 11, fontWeight: 700,
                }}
              >
                {task.status === 'done' && '✓'}
                {task.status === 'in-progress' && '›'}
              </button>

              <div style={{ flex: 1, minWidth: 0 }}>
                <div style={{ display: 'flex', gap: 6, flexWrap: 'wrap', marginBottom: 4, alignItems: 'center' }}>
                  <span style={{ fontSize: 11, fontWeight: 700, color: STATUS_COLOR[task.status] }}>
                    {STATUS_LABEL[task.status]}
                  </span>
                  <span style={{ fontSize: 11, fontWeight: 700, color: prio?.borderColor }}>
                    {prio?.label}
                  </span>
                  {overdue && <span style={{ fontSize: 11, fontWeight: 700, color: 'var(--danger)' }}>Vencido</span>}
                </div>
                <div style={{
                  fontSize: 15, fontWeight: 600,
                  textDecoration: task.status === 'done' ? 'line-through' : 'none',
                  color: task.status === 'done' ? 'var(--muted)' : 'var(--text)',
                  overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap',
                }}>
                  {task.title}
                </div>
                {task.description && (
                  <div style={{ fontSize: 13, color: 'var(--muted)', marginTop: 2, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                    {task.description}
                  </div>
                )}
                <div style={{ display: 'flex', gap: 12, marginTop: 6, flexWrap: 'wrap', alignItems: 'center' }}>
                  {task.dueDate && (
                    <span style={{ fontSize: 12, color: overdue ? 'var(--danger)' : 'var(--muted)' }}>
                      📅 {new Date(task.dueDate + 'T12:00:00').toLocaleDateString('es-MX', { day: 'numeric', month: 'short' })}
                    </span>
                  )}
                  {updatedBy && (
                    <span style={{ fontSize: 12, color: updatedBy.color, fontWeight: 600 }}>
                      {updatedBy.name}
                    </span>
                  )}
                </div>
              </div>

              <div style={{ display: 'flex', flexDirection: 'column', gap: 4, flexShrink: 0 }}>
                <button
                  onClick={() => { setEditingTask(task); setModalOpen(true) }}
                  style={{ fontSize: 16, color: 'var(--muted)', padding: '2px 4px' }}
                  title="Editar"
                >✎</button>
                <button
                  onClick={() => dispatch({ type: 'DELETE_TASK', payload: task.id })}
                  style={{ fontSize: 14, color: 'var(--border)', padding: '2px 4px' }}
                  title="Eliminar"
                  onMouseOver={e => e.target.style.color = 'var(--danger)'}
                  onMouseOut={e => e.target.style.color = 'var(--border)'}
                >✕</button>
              </div>
            </div>
          )
        })}
      </div>

      {modalOpen && (
        <TaskModal
          task={editingTask}
          onSave={handleSave}
          onClose={() => { setModalOpen(false); setEditingTask(null) }}
        />
      )}
    </div>
  )
}
