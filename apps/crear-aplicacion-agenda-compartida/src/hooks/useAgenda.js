import { useState, useEffect, useCallback } from 'react'
import { INITIAL_TASKS, INITIAL_EVENTS } from '../lib/mock-data'

const STORAGE_KEY = 'agenda-compartida-v1'

function loadState() {
  try {
    const raw = localStorage.getItem(STORAGE_KEY)
    if (raw) return JSON.parse(raw)
  } catch (_) {}
  return null
}

function saveState(tasks, events) {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify({ tasks, events }))
  } catch (_) {}
}

export function useAgenda() {
  const [tasks, setTasks] = useState(() => {
    const saved = loadState()
    return saved ? saved.tasks : INITIAL_TASKS
  })

  const [events, setEvents] = useState(() => {
    const saved = loadState()
    return saved ? saved.events : INITIAL_EVENTS
  })

  const [activeUser, setActiveUser] = useState('juan')

  useEffect(() => {
    saveState(tasks, events)
  }, [tasks, events])

  const addTask = useCallback((task) => {
    const newTask = {
      ...task,
      id: 't' + Date.now(),
      createdBy: activeUser,
      updatedBy: activeUser,
      updatedAt: new Date().toISOString(),
    }
    setTasks(prev => [newTask, ...prev])
  }, [activeUser])

  const updateTask = useCallback((id, changes) => {
    setTasks(prev => prev.map(t =>
      t.id === id
        ? { ...t, ...changes, updatedBy: activeUser, updatedAt: new Date().toISOString() }
        : t
    ))
  }, [activeUser])

  const deleteTask = useCallback((id) => {
    setTasks(prev => prev.filter(t => t.id !== id))
  }, [])

  const addEvent = useCallback((event) => {
    const newEvent = {
      ...event,
      id: 'e' + Date.now(),
      createdBy: activeUser,
    }
    setEvents(prev => [...prev, newEvent])
  }, [activeUser])

  const deleteEvent = useCallback((id) => {
    setEvents(prev => prev.filter(e => e.id !== id))
  }, [])

  const resetToMock = useCallback(() => {
    setTasks(INITIAL_TASKS)
    setEvents(INITIAL_EVENTS)
  }, [])

  return {
    tasks,
    events,
    activeUser,
    setActiveUser,
    addTask,
    updateTask,
    deleteTask,
    addEvent,
    deleteEvent,
    resetToMock,
  }
}
