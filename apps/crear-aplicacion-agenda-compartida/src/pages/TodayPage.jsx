import React, { useState } from 'react'
import { useApp } from '../context/AppContext'
import { USERS } from '../lib/mock-data'
import EventForm from '../components/EventForm'
import TaskForm from '../components/TaskForm'

function getTodayStr() {
  const d = new Date()
  return `${d.getFullYear()}-${String(d.getMonth()+1).padStart(2,'0')}-${String(d.getDate()).padStart(2,'0')}`
}

function ownerColor(createdBy) {
  return USERS[createdBy]?.color ?? '#6B7280'
}

function ownerLabel(createdBy) {
  return USERS[createdBy]?.name ?? createdBy
}

function UserChip({ userId }) {
  const user = USERS[userId]
  if (!user) return null
  return (
    <span
      className="inline-flex items-center px-2 py-0.5 rounded-full text-xs font-semibold text-white"
      style={{ background: user.color }}
    >
      {user.initials}
    </span>
  )
}

function PriorityDot({ priority }) {
  const colors = { high: 'bg-red-500', medium: 'bg-amber-400', low: 'bg-green-500' }
  return <span className={`w-2 h-2 rounded-full flex-shrink-0 ${colors[priority] ?? 'bg-gray-300'}`} />
}

function EventCard({ event, onEdit }) {
  const color = ownerColor(event.createdBy)
  return (
    <button
      onClick={() => onEdit(event)}
      className="w-full text-left bg-white rounded-xl shadow-sm p-4 mb-3 flex gap-3 items-start active:scale-95 transition-transform"
      style={{ borderLeft: `4px solid ${color}` }}
    >
      <div className="flex-1 min-w-0">
        <p className="font-semibold text-gray-900 truncate">{event.title}</p>
        {event.time && (
          <p className="text-sm text-gray-500 mt-0.5">
            {event.time}{event.endTime ? ` – ${event.endTime}` : ''}
          </p>
        )}
      </div>
      <UserChip userId={event.createdBy} />
    </button>
  )
}

function TaskRow({ task, onToggle, onEdit }) {
  const done = task.status === 'done'
  return (
    <div className="bg-white rounded-xl shadow-sm p-4 mb-3 flex gap-3 items-center">
      <button
        onClick={() => onToggle(task.id)}
        className={`w-6 h-6 rounded-full border-2 flex-shrink-0 flex items-center justify-center transition-colors ${
          done ? 'bg-juan border-juan' : 'border-gray-300'
        }`}
      >
        {done && (
          <svg className="w-3.5 h-3.5 text-white" viewBox="0 0 20 20" fill="currentColor">
            <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
          </svg>
        )}
      </button>
      <button className="flex-1 min-w-0 text-left" onClick={() => onEdit(task)}>
        <p className={`font-medium truncate ${done ? 'line-through text-gray-400' : 'text-gray-900'}`}>
          {task.title}
        </p>
        {task.dueDate && !done && (
          <p className="text-xs text-gray-400 mt-0.5">Vence {task.dueDate}</p>
        )}
      </button>
      <div className="flex items-center gap-2">
        <PriorityDot priority={task.priority} />
        <UserChip userId={task.updatedBy} />
      </div>
    </div>
  )
}

export default function TodayPage() {
  const TODAY = getTodayStr()
  const { state, dispatch } = useApp()
  const [showEventForm, setShowEventForm] = useState(false)
  const [showTaskForm, setShowTaskForm] = useState(false)
  const [editingEvent, setEditingEvent] = useState(null)
  const [editingTask, setEditingTask] = useState(null)
  const [fab, setFab] = useState(false)

  const todayEvents = state.events
    .filter(e => e.date === TODAY)
    .sort((a, b) => (a.time ?? '').localeCompare(b.time ?? ''))

  const pendingTasks = state.tasks
    .filter(t => t.status !== 'done')
    .sort((a, b) => {
      const p = { high: 0, medium: 1, low: 2 }
      return (p[a.priority] ?? 3) - (p[b.priority] ?? 3)
    })
    .slice(0, 5)

  function handleToggle(id) {
    dispatch({ type: 'TOGGLE_TASK', payload: id })
  }

  function handleSaveEvent(data) {
    if (editingEvent) {
      dispatch({ type: 'UPDATE_EVENT', payload: { ...editingEvent, ...data } })
    } else {
      dispatch({ type: 'ADD_EVENT', payload: data })
    }
    setShowEventForm(false)
    setEditingEvent(null)
  }

  function handleSaveTask(data) {
    if (editingTask) {
      dispatch({ type: 'UPDATE_TASK', payload: { ...editingTask, ...data } })
    } else {
      dispatch({ type: 'ADD_TASK', payload: data })
    }
    setShowTaskForm(false)
    setEditingTask(null)
  }

  const today = new Date(TODAY + 'T00:00:00')
  const dayName = today.toLocaleDateString('es-ES', { weekday: 'long' })
  const dateStr = today.toLocaleDateString('es-ES', { day: 'numeric', month: 'long' })

  return (
    <div className="flex flex-col h-full">
      {/* Header */}
      <header className="bg-white border-b border-gray-100 px-5 flex items-center" style={{ height: '64px' }}>
        <div className="flex-1">
          <p className="text-xs text-gray-400 uppercase tracking-wider capitalize">{dayName}</p>
          <h1 className="text-xl font-bold text-gray-900 capitalize">{dateStr}</h1>
        </div>
        {/* User toggle */}
        <button
          onClick={() =>
            dispatch({
              type: 'SET_USER',
              payload: state.currentUser === 'juan' ? 'asistente' : 'juan',
            })
          }
          className="flex items-center gap-2 px-3 py-1.5 rounded-full text-white text-sm font-semibold transition-colors"
          style={{ background: USERS[state.currentUser]?.color }}
        >
          <span>{USERS[state.currentUser]?.initials}</span>
          <span>{USERS[state.currentUser]?.name}</span>
        </button>
      </header>

      {/* Scrollable content */}
      <div className="flex-1 overflow-y-auto px-4 py-4" style={{ paddingBottom: '88px' }}>
        {/* Today events */}
        <section className="mb-6">
          <h2 className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-3">
            Eventos de hoy ({todayEvents.length})
          </h2>
          {todayEvents.length === 0 ? (
            <div className="text-center py-8 text-gray-400">
              <div className="text-4xl mb-2">📅</div>
              <p className="text-sm">Sin eventos hoy</p>
            </div>
          ) : (
            todayEvents.map(ev => (
              <EventCard
                key={ev.id}
                event={ev}
                onEdit={ev => { setEditingEvent(ev); setShowEventForm(true) }}
              />
            ))
          )}
        </section>

        {/* Pending tasks */}
        <section>
          <h2 className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-3">
            Pendientes urgentes
          </h2>
          {pendingTasks.length === 0 ? (
            <div className="text-center py-8 text-gray-400">
              <div className="text-4xl mb-2">✅</div>
              <p className="text-sm">Todo al día</p>
            </div>
          ) : (
            pendingTasks.map(task => (
              <TaskRow
                key={task.id}
                task={task}
                onToggle={handleToggle}
                onEdit={task => { setEditingTask(task); setShowTaskForm(true) }}
              />
            ))
          )}
        </section>
      </div>

      {/* FAB menu */}
      {fab && (
        <div className="fixed inset-0 z-30" onClick={() => setFab(false)}>
          <div className="absolute right-5 flex flex-col gap-3" style={{ bottom: 'calc(72px + 72px)' }}>
            <button
              className="flex items-center gap-3 bg-white shadow-lg rounded-full pl-4 pr-5 py-3 text-sm font-semibold text-gray-700 active:scale-95 transition-transform"
              onClick={e => { e.stopPropagation(); setFab(false); setEditingTask(null); setShowTaskForm(true) }}
            >
              <span className="w-8 h-8 rounded-full bg-purple-100 text-purple-600 flex items-center justify-center text-base">✓</span>
              Nueva tarea
            </button>
            <button
              className="flex items-center gap-3 bg-white shadow-lg rounded-full pl-4 pr-5 py-3 text-sm font-semibold text-gray-700 active:scale-95 transition-transform"
              onClick={e => { e.stopPropagation(); setFab(false); setEditingEvent(null); setShowEventForm(true) }}
            >
              <span className="w-8 h-8 rounded-full bg-blue-100 text-blue-600 flex items-center justify-center text-base">+</span>
              Nuevo evento
            </button>
          </div>
        </div>
      )}
      <button
        className="fixed right-5 z-40 w-14 h-14 rounded-full shadow-lg flex items-center justify-center text-2xl text-white transition-transform active:scale-90"
        style={{ bottom: 'calc(72px + 16px)', background: '#4F46E5' }}
        onClick={() => setFab(f => !f)}
      >
        {fab ? '×' : '+'}
      </button>

      {/* Modals */}
      {showEventForm && (
        <EventForm
          initial={editingEvent}
          onSave={handleSaveEvent}
          onDelete={editingEvent ? () => { dispatch({ type: 'DELETE_EVENT', payload: editingEvent.id }); setShowEventForm(false) } : null}
          onClose={() => { setShowEventForm(false); setEditingEvent(null) }}
        />
      )}
      {showTaskForm && (
        <TaskForm
          initial={editingTask}
          onSave={handleSaveTask}
          onDelete={editingTask ? () => { dispatch({ type: 'DELETE_TASK', payload: editingTask.id }); setShowTaskForm(false) } : null}
          onClose={() => { setShowTaskForm(false); setEditingTask(null) }}
        />
      )}
    </div>
  )
}
