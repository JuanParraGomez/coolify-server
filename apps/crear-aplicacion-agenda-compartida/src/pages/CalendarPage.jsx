import React, { useState } from 'react'
import { useApp } from '../context/AppContext'
import { USERS } from '../lib/mock-data'
import EventForm from '../components/EventForm'

const DAYS = ['Lu', 'Ma', 'Mi', 'Ju', 'Vi', 'Sa', 'Do']
const MONTHS = [
  'Enero', 'Febrero', 'Marzo', 'Abril', 'Mayo', 'Junio',
  'Julio', 'Agosto', 'Septiembre', 'Octubre', 'Noviembre', 'Diciembre',
]

function getTodayStr() {
  const d = new Date()
  return `${d.getFullYear()}-${String(d.getMonth()+1).padStart(2,'0')}-${String(d.getDate()).padStart(2,'0')}`
}

function toDateStr(year, month, day) {
  return `${year}-${String(month + 1).padStart(2, '0')}-${String(day).padStart(2, '0')}`
}

function EventDot({ createdBy }) {
  const color = USERS[createdBy]?.color ?? '#6B7280'
  return <span className="w-1.5 h-1.5 rounded-full inline-block" style={{ background: color }} />
}

export default function CalendarPage() {
  const TODAY_STR = getTodayStr()
  const { state, dispatch } = useApp()
  const [viewDate, setViewDate] = useState(() => { const n = new Date(); return new Date(n.getFullYear(), n.getMonth(), 1) })
  const [selected, setSelected] = useState(() => getTodayStr())
  const [showForm, setShowForm] = useState(false)
  const [editingEvent, setEditingEvent] = useState(null)

  const year = viewDate.getFullYear()
  const month = viewDate.getMonth()

  // First day of month (0=Sun…6=Sat), convert to Mon-first
  const firstDay = new Date(year, month, 1).getDay()
  const startOffset = (firstDay + 6) % 7 // 0=Mon
  const daysInMonth = new Date(year, month + 1, 0).getDate()

  function prevMonth() {
    setViewDate(d => new Date(d.getFullYear(), d.getMonth() - 1, 1))
  }
  function nextMonth() {
    setViewDate(d => new Date(d.getFullYear(), d.getMonth() + 1, 1))
  }

  function eventsForDay(dateStr) {
    return state.events.filter(e => e.date === dateStr)
  }

  const selectedEvents = eventsForDay(selected).sort((a, b) =>
    (a.time ?? '').localeCompare(b.time ?? '')
  )

  function handleSave(data) {
    if (editingEvent) {
      dispatch({ type: 'UPDATE_EVENT', payload: { ...editingEvent, ...data } })
    } else {
      dispatch({ type: 'ADD_EVENT', payload: { ...data, date: selected } })
    }
    setShowForm(false)
    setEditingEvent(null)
  }

  function handleDelete() {
    dispatch({ type: 'DELETE_EVENT', payload: editingEvent.id })
    setShowForm(false)
    setEditingEvent(null)
  }

  // Build grid cells
  const cells = []
  for (let i = 0; i < startOffset; i++) cells.push(null)
  for (let d = 1; d <= daysInMonth; d++) cells.push(d)

  return (
    <div className="flex flex-col h-full">
      {/* Header */}
      <header className="bg-white border-b border-gray-100 px-5 flex items-center gap-4" style={{ height: '64px' }}>
        <button onClick={prevMonth} className="w-10 h-10 flex items-center justify-center rounded-full text-gray-500 active:bg-gray-100 text-xl">
          ‹
        </button>
        <h1 className="flex-1 text-center text-lg font-bold text-gray-900">
          {MONTHS[month]} {year}
        </h1>
        <button onClick={nextMonth} className="w-10 h-10 flex items-center justify-center rounded-full text-gray-500 active:bg-gray-100 text-xl">
          ›
        </button>
      </header>

      <div className="flex-1 overflow-y-auto" style={{ paddingBottom: '72px' }}>
        {/* Day-of-week row */}
        <div className="grid grid-cols-7 bg-white border-b border-gray-100">
          {DAYS.map(d => (
            <div key={d} className="text-center text-xs font-bold text-gray-400 py-2 uppercase tracking-wider">
              {d}
            </div>
          ))}
        </div>

        {/* Month grid */}
        <div className="grid grid-cols-7 bg-white">
          {cells.map((day, i) => {
            if (!day) return <div key={`blank-${i}`} className="border-b border-r border-gray-50 h-14" />
            const dateStr = toDateStr(year, month, day)
            const isToday = dateStr === TODAY_STR
            const isSelected = dateStr === selected
            const dayEvents = eventsForDay(dateStr)
            return (
              <button
                key={dateStr}
                onClick={() => setSelected(dateStr)}
                className={`border-b border-r border-gray-50 h-14 flex flex-col items-center justify-start pt-1 gap-0.5 transition-colors ${
                  isSelected ? 'bg-juan bg-opacity-10' : 'active:bg-gray-50'
                }`}
              >
                <span
                  className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-semibold ${
                    isToday
                      ? 'bg-juan text-white'
                      : isSelected
                      ? 'text-juan'
                      : 'text-gray-700'
                  }`}
                >
                  {day}
                </span>
                {dayEvents.length > 0 && (
                  <div className="flex gap-0.5 flex-wrap justify-center px-1">
                    {dayEvents.slice(0, 3).map(ev => (
                      <EventDot key={ev.id} createdBy={ev.createdBy} />
                    ))}
                  </div>
                )}
              </button>
            )
          })}
        </div>

        {/* Selected day events */}
        <div className="px-4 pt-4">
          <div className="flex items-center justify-between mb-3">
            <h2 className="text-xs font-bold text-gray-400 uppercase tracking-wider">
              {new Date(selected + 'T00:00:00').toLocaleDateString('es-ES', {
                weekday: 'long', day: 'numeric', month: 'long',
              })}
            </h2>
            <button
              onClick={() => { setEditingEvent(null); setShowForm(true) }}
              className="text-sm font-semibold text-juan px-3 py-1 rounded-full active:bg-blue-50"
            >
              + Evento
            </button>
          </div>

          {selectedEvents.length === 0 ? (
            <div className="text-center py-10 text-gray-400">
              <div className="text-4xl mb-2">📭</div>
              <p className="text-sm">Sin eventos este día</p>
            </div>
          ) : (
            selectedEvents.map(ev => {
              const user = USERS[ev.createdBy]
              return (
                <button
                  key={ev.id}
                  onClick={() => { setEditingEvent(ev); setShowForm(true) }}
                  className="w-full text-left bg-white rounded-xl shadow-sm p-4 mb-3 flex gap-3 items-center active:scale-95 transition-transform"
                  style={{ borderLeft: `4px solid ${user?.color ?? '#6B7280'}` }}
                >
                  <div className="flex-1 min-w-0">
                    <p className="font-semibold text-gray-900 truncate">{ev.title}</p>
                    {ev.time && (
                      <p className="text-sm text-gray-500">
                        {ev.time}{ev.endTime ? ` – ${ev.endTime}` : ''}
                      </p>
                    )}
                  </div>
                  <span
                    className="flex-shrink-0 w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold text-white"
                    style={{ background: user?.color ?? '#6B7280' }}
                  >
                    {user?.initials ?? '?'}
                  </span>
                </button>
              )
            })
          )}
        </div>
      </div>

      {showForm && (
        <EventForm
          initial={editingEvent ? { ...editingEvent } : { date: selected }}
          onSave={handleSave}
          onDelete={editingEvent ? handleDelete : null}
          onClose={() => { setShowForm(false); setEditingEvent(null) }}
        />
      )}
    </div>
  )
}
