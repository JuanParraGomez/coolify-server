import React, { useState } from 'react'
import { useApp } from '../context/AppContext'
import { USERS } from '../lib/mock-data'

const TYPE_COLOR = {
  meeting: { bg: '#DBEAFE', text: '#1D4ED8' },
  reminder: { bg: '#FEF3C7', text: '#B45309' },
  task: { bg: '#D1FAE5', text: '#065F46' },
}
const TYPE_LABEL = { meeting: 'Reunión', reminder: 'Recordatorio', task: 'Tarea' }

function getDaysInMonth(year, month) {
  return new Date(year, month + 1, 0).getDate()
}
function getFirstDayOfMonth(year, month) {
  return (new Date(year, month, 1).getDay() + 6) % 7 // Mon-first
}

export default function CalendarView() {
  const { state, dispatch } = useApp()
  const { events } = state

  const today = new Date()
  const [year, setYear] = useState(today.getFullYear())
  const [month, setMonth] = useState(today.getMonth())
  const [selectedDay, setSelectedDay] = useState(today.getDate())
  const [showForm, setShowForm] = useState(false)
  const [form, setForm] = useState({ title: '', time: '09:00', type: 'meeting' })

  const daysInMonth = getDaysInMonth(year, month)
  const firstDay = getFirstDayOfMonth(year, month)

  const pad = n => String(n).padStart(2, '0')
  const toDateStr = (y, m, d) => `${y}-${pad(m + 1)}-${pad(d)}`
  const selectedStr = toDateStr(year, month, selectedDay)
  const todayStr = toDateStr(today.getFullYear(), today.getMonth(), today.getDate())

  const selectedEvents = events.filter(e => e.date === selectedStr)

  function eventsForDay(day) {
    return events.filter(e => e.date === toDateStr(year, month, day))
  }

  function prevMonth() {
    if (month === 0) { setYear(y => y - 1); setMonth(11) }
    else setMonth(m => m - 1)
    setSelectedDay(1)
  }
  function nextMonth() {
    if (month === 11) { setYear(y => y + 1); setMonth(0) }
    else setMonth(m => m + 1)
    setSelectedDay(1)
  }

  function handleAdd(e) {
    e.preventDefault()
    if (!form.title.trim()) return
    dispatch({ type: 'ADD_EVENT', payload: { title: form.title, date: selectedStr, time: form.time, type: form.type } })
    setForm({ title: '', time: '09:00', type: 'meeting' })
    setShowForm(false)
  }

  const monthName = new Date(year, month, 1).toLocaleDateString('es-MX', { month: 'long', year: 'numeric' })
  const weekDays = ['L', 'M', 'X', 'J', 'V', 'S', 'D']

  return (
    <div style={{ display: 'flex', gap: 16, height: '100%', overflow: 'hidden' }}>
      {/* Calendar grid */}
      <div className="card" style={{ flex: 1, display: 'flex', flexDirection: 'column', marginBottom: 0 }}>
        {/* Month nav */}
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 12 }}>
          <button onClick={prevMonth} style={{ fontSize: 22, padding: '4px 10px', color: 'var(--muted)' }}>‹</button>
          <span style={{ fontWeight: 700, fontSize: 16, textTransform: 'capitalize' }}>{monthName}</span>
          <button onClick={nextMonth} style={{ fontSize: 22, padding: '4px 10px', color: 'var(--muted)' }}>›</button>
        </div>

        {/* Weekday headers */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(7, 1fr)', marginBottom: 4 }}>
          {weekDays.map(d => (
            <div key={d} style={{ textAlign: 'center', fontSize: 11, fontWeight: 700, color: 'var(--muted)', padding: '4px 0' }}>{d}</div>
          ))}
        </div>

        {/* Day grid */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(7, 1fr)', gap: 2, flex: 1 }}>
          {Array.from({ length: firstDay }).map((_, i) => <div key={'e' + i} />)}
          {Array.from({ length: daysInMonth }).map((_, i) => {
            const day = i + 1
            const dayStr = toDateStr(year, month, day)
            const isToday = dayStr === todayStr
            const isSelected = day === selectedDay
            const dots = eventsForDay(day)

            return (
              <button
                key={day}
                onClick={() => setSelectedDay(day)}
                style={{
                  display: 'flex',
                  flexDirection: 'column',
                  alignItems: 'center',
                  padding: '6px 2px',
                  borderRadius: 10,
                  background: isSelected ? 'var(--juan)' : isToday ? 'var(--juan-light)' : 'transparent',
                  color: isSelected ? '#fff' : isToday ? 'var(--juan)' : 'var(--text)',
                  fontWeight: isToday || isSelected ? 700 : 400,
                  fontSize: 14,
                  transition: 'background .15s',
                }}
              >
                {day}
                {dots.length > 0 && (
                  <div style={{ display: 'flex', gap: 2, marginTop: 2 }}>
                    {dots.slice(0, 3).map((ev, idx) => (
                      <span key={idx} style={{
                        width: 5, height: 5, borderRadius: '50%',
                        background: isSelected ? 'rgba(255,255,255,.7)' : TYPE_COLOR[ev.type]?.text ?? '#888'
                      }} />
                    ))}
                  </div>
                )}
              </button>
            )
          })}
        </div>
      </div>

      {/* Day detail */}
      <div className="card" style={{ width: 280, display: 'flex', flexDirection: 'column', gap: 12, marginBottom: 0, overflow: 'hidden' }}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          <span style={{ fontWeight: 700 }}>
            {selectedDay} de {new Date(year, month).toLocaleDateString('es-MX', { month: 'long' })}
          </span>
          <button
            onClick={() => setShowForm(f => !f)}
            className="btn btn-primary"
            style={{ minHeight: 32, padding: '0 12px', fontSize: 13 }}
          >
            + Evento
          </button>
        </div>

        {showForm && (
          <form onSubmit={handleAdd} style={{ background: 'var(--bg)', borderRadius: 10, padding: 12, display: 'flex', flexDirection: 'column', gap: 8 }}>
            <input
              className="field"
              style={{ border: '1.5px solid var(--border)', borderRadius: 8, padding: '8px 10px', fontSize: 14, background: '#fff', width: '100%' }}
              placeholder="Título del evento *"
              value={form.title}
              onChange={e => setForm(f => ({ ...f, title: e.target.value }))}
              autoFocus
            />
            <div style={{ display: 'flex', gap: 8 }}>
              <input
                type="time"
                style={{ flex: 1, border: '1.5px solid var(--border)', borderRadius: 8, padding: '6px 8px', fontSize: 13, background: '#fff' }}
                value={form.time}
                onChange={e => setForm(f => ({ ...f, time: e.target.value }))}
              />
              <select
                style={{ flex: 1, border: '1.5px solid var(--border)', borderRadius: 8, padding: '6px 8px', fontSize: 13, background: '#fff' }}
                value={form.type}
                onChange={e => setForm(f => ({ ...f, type: e.target.value }))}
              >
                <option value="meeting">Reunión</option>
                <option value="reminder">Recordatorio</option>
                <option value="task">Tarea</option>
              </select>
            </div>
            <div style={{ display: 'flex', gap: 8 }}>
              <button type="submit" className="btn btn-primary" style={{ flex: 1, minHeight: 36, fontSize: 14 }}>Guardar</button>
              <button type="button" onClick={() => setShowForm(false)} className="btn btn-ghost" style={{ flex: 1, minHeight: 36, fontSize: 14, background: 'var(--border)' }}>Cancelar</button>
            </div>
          </form>
        )}

        <div style={{ overflowY: 'auto', flex: 1 }}>
          {selectedEvents.length === 0 ? (
            <div className="empty">
              <div className="empty-icon">📭</div>
              <div className="empty-text">Sin eventos este día</div>
            </div>
          ) : (
            selectedEvents.map(ev => {
              const user = USERS[ev.createdBy]
              const colors = TYPE_COLOR[ev.type] ?? { bg: '#F3F4F6', text: '#6B7280' }
              return (
                <div key={ev.id} className="card" style={{ marginBottom: 8, display: 'flex', alignItems: 'flex-start', gap: 10 }}>
                  <div style={{ flex: 1, minWidth: 0 }}>
                    <div style={{ display: 'flex', gap: 6, flexWrap: 'wrap', marginBottom: 4 }}>
                      <span style={{ fontSize: 11, fontWeight: 700, padding: '2px 6px', borderRadius: 6, background: colors.bg, color: colors.text }}>
                        {TYPE_LABEL[ev.type]}
                      </span>
                      <span style={{ fontSize: 11, color: 'var(--muted)' }}>{ev.time}</span>
                    </div>
                    <div style={{ fontSize: 14, fontWeight: 600, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{ev.title}</div>
                    <div style={{ fontSize: 11, marginTop: 2, color: user?.color }}>{user?.name}</div>
                  </div>
                  <button
                    onClick={() => dispatch({ type: 'DELETE_EVENT', payload: ev.id })}
                    style={{ color: 'var(--border)', fontSize: 16, flexShrink: 0 }}
                    onMouseOver={e => e.target.style.color = 'var(--danger)'}
                    onMouseOut={e => e.target.style.color = 'var(--border)'}
                  >✕</button>
                </div>
              )
            })
          )}
        </div>
      </div>
    </div>
  )
}
