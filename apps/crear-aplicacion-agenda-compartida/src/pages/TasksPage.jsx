import React, { useState } from 'react'
import { useApp } from '../context/AppContext'
import { USERS } from '../lib/mock-data'
import TaskForm from '../components/TaskForm'

const STATUS_ORDER = { 'in-progress': 0, pending: 1, done: 2 }
const PRIORITY_ORDER = { high: 0, medium: 1, low: 2 }

const PRIORITY_COLOR = {
  high: 'bg-red-100 text-red-700',
  medium: 'bg-amber-100 text-amber-700',
  low: 'bg-green-100 text-green-700',
}
const PRIORITY_LABEL = { high: 'Alta', medium: 'Media', low: 'Baja' }

const STATUS_LABEL = { pending: 'Pendiente', 'in-progress': 'En progreso', done: 'Completada' }
const STATUS_COLOR = {
  pending: 'text-gray-500',
  'in-progress': 'text-blue-600',
  done: 'text-green-600',
}

function TaskCard({ task, onToggle, onEdit }) {
  const done = task.status === 'done'
  const inProgress = task.status === 'in-progress'
  const user = USERS[task.updatedBy]

  return (
    <div className={`bg-white rounded-xl shadow-sm mb-3 overflow-hidden ${inProgress ? 'ring-2 ring-juan ring-opacity-30' : ''}`}>
      <div className="flex gap-3 items-start p-4">
        {/* Checkbox */}
        <button
          onClick={() => onToggle(task.id)}
          className={`mt-0.5 w-6 h-6 rounded-full border-2 flex-shrink-0 flex items-center justify-center transition-colors ${
            done ? 'bg-green-500 border-green-500' : inProgress ? 'border-juan' : 'border-gray-300'
          }`}
        >
          {done && (
            <svg className="w-3.5 h-3.5 text-white" viewBox="0 0 20 20" fill="currentColor">
              <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
            </svg>
          )}
          {inProgress && !done && <span className="w-2 h-2 rounded-full bg-juan" />}
        </button>

        {/* Content */}
        <button className="flex-1 min-w-0 text-left" onClick={() => onEdit(task)}>
          <p className={`font-semibold text-base leading-snug ${done ? 'line-through text-gray-400' : 'text-gray-900'}`}>
            {task.title}
          </p>
          {task.description && !done && (
            <p className="text-sm text-gray-500 mt-1 line-clamp-2">{task.description}</p>
          )}
          <div className="flex items-center gap-2 mt-2 flex-wrap">
            <span className={`text-xs font-semibold ${STATUS_COLOR[task.status]}`}>
              {STATUS_LABEL[task.status]}
            </span>
            {task.dueDate && (
              <span className="text-xs text-gray-400">· Vence {task.dueDate}</span>
            )}
          </div>
        </button>

        {/* Right side */}
        <div className="flex flex-col items-end gap-2 flex-shrink-0">
          <span
            className="w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold text-white"
            style={{ background: user?.color ?? '#6B7280' }}
          >
            {user?.initials ?? '?'}
          </span>
          <span className={`text-xs font-semibold px-2 py-0.5 rounded-full ${PRIORITY_COLOR[task.priority] ?? 'bg-gray-100 text-gray-500'}`}>
            {PRIORITY_LABEL[task.priority] ?? task.priority}
          </span>
        </div>
      </div>
    </div>
  )
}

const FILTERS = [
  { key: 'all', label: 'Todos' },
  { key: 'pending', label: 'Pendientes' },
  { key: 'in-progress', label: 'En progreso' },
  { key: 'done', label: 'Completadas' },
]

export default function TasksPage() {
  const { state, dispatch } = useApp()
  const [filter, setFilter] = useState('all')
  const [showForm, setShowForm] = useState(false)
  const [editingTask, setEditingTask] = useState(null)

  const filtered = state.tasks
    .filter(t => filter === 'all' || t.status === filter)
    .sort((a, b) => {
      const sd = STATUS_ORDER[a.status] - STATUS_ORDER[b.status]
      if (sd !== 0) return sd
      return PRIORITY_ORDER[a.priority] - PRIORITY_ORDER[b.priority]
    })

  function handleToggle(id) {
    dispatch({ type: 'TOGGLE_TASK', payload: id })
  }

  function handleSave(data) {
    if (editingTask) {
      dispatch({ type: 'UPDATE_TASK', payload: { ...editingTask, ...data } })
    } else {
      dispatch({ type: 'ADD_TASK', payload: data })
    }
    setShowForm(false)
    setEditingTask(null)
  }

  function handleDelete() {
    dispatch({ type: 'DELETE_TASK', payload: editingTask.id })
    setShowForm(false)
    setEditingTask(null)
  }

  const stats = {
    total: state.tasks.length,
    done: state.tasks.filter(t => t.status === 'done').length,
    inProgress: state.tasks.filter(t => t.status === 'in-progress').length,
  }

  return (
    <div className="flex flex-col h-full">
      {/* Header */}
      <header className="bg-white border-b border-gray-100 px-5 flex items-center" style={{ height: '64px' }}>
        <div className="flex-1">
          <h1 className="text-xl font-bold text-gray-900">Pendientes</h1>
          <p className="text-xs text-gray-400">
            {stats.done}/{stats.total} completadas · {stats.inProgress} en progreso
          </p>
        </div>
        <button
          onClick={() => { setEditingTask(null); setShowForm(true) }}
          className="w-10 h-10 rounded-full flex items-center justify-center text-white text-xl font-bold active:scale-90 transition-transform"
          style={{ background: '#4F46E5' }}
        >
          +
        </button>
      </header>

      {/* Filter tabs */}
      <div className="bg-white border-b border-gray-100 px-4 flex gap-2 overflow-x-auto py-2">
        {FILTERS.map(f => (
          <button
            key={f.key}
            onClick={() => setFilter(f.key)}
            className={`flex-shrink-0 px-4 py-1.5 rounded-full text-sm font-semibold transition-colors ${
              filter === f.key
                ? 'bg-juan text-white'
                : 'bg-gray-100 text-gray-500 active:bg-gray-200'
            }`}
          >
            {f.label}
          </button>
        ))}
      </div>

      {/* List */}
      <div className="flex-1 overflow-y-auto px-4 py-4" style={{ paddingBottom: '88px' }}>
        {filtered.length === 0 ? (
          <div className="text-center py-16 text-gray-400">
            <div className="text-5xl mb-3">🎉</div>
            <p className="text-base font-medium">
              {filter === 'done' ? 'Nada completado aún' : 'Sin tareas aquí'}
            </p>
          </div>
        ) : (
          filtered.map(task => (
            <TaskCard
              key={task.id}
              task={task}
              onToggle={handleToggle}
              onEdit={t => { setEditingTask(t); setShowForm(true) }}
            />
          ))
        )}
      </div>

      {showForm && (
        <TaskForm
          initial={editingTask}
          onSave={handleSave}
          onDelete={editingTask ? handleDelete : null}
          onClose={() => { setShowForm(false); setEditingTask(null) }}
        />
      )}
    </div>
  )
}
