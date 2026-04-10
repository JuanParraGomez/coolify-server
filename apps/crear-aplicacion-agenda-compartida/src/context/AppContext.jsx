import React, { createContext, useContext, useReducer, useEffect } from 'react'
import { INITIAL_TASKS, INITIAL_EVENTS } from '../lib/mock-data'

const AppContext = createContext(null)
const STORAGE_KEY = 'agenda-v1'

function loadPersistedState() {
  try {
    const raw = localStorage.getItem(STORAGE_KEY)
    if (raw) {
      const parsed = JSON.parse(raw)
      return { tasks: parsed.tasks ?? INITIAL_TASKS, events: parsed.events ?? INITIAL_EVENTS, currentUser: parsed.currentUser ?? 'juan' }
    }
  } catch (_) {}
  return null
}

const initialState = loadPersistedState() ?? {
  tasks: INITIAL_TASKS,
  events: INITIAL_EVENTS,
  currentUser: 'juan',
}

function reducer(state, action) {
  switch (action.type) {
    case 'SET_USER':
      return { ...state, currentUser: action.payload }

    case 'ADD_EVENT': {
      const ev = { ...action.payload, id: `e${Date.now()}`, createdBy: state.currentUser }
      return { ...state, events: [...state.events, ev] }
    }
    case 'UPDATE_EVENT':
      return {
        ...state,
        events: state.events.map(e =>
          e.id === action.payload.id ? { ...e, ...action.payload } : e
        ),
      }
    case 'DELETE_EVENT':
      return { ...state, events: state.events.filter(e => e.id !== action.payload) }

    case 'ADD_TASK': {
      const now = new Date().toISOString()
      const task = {
        ...action.payload,
        id: `t${Date.now()}`,
        status: 'pending',
        createdBy: state.currentUser,
        updatedBy: state.currentUser,
        updatedAt: now,
      }
      return { ...state, tasks: [...state.tasks, task] }
    }
    case 'UPDATE_TASK': {
      const now = new Date().toISOString()
      return {
        ...state,
        tasks: state.tasks.map(t =>
          t.id === action.payload.id
            ? { ...t, ...action.payload, updatedBy: state.currentUser, updatedAt: now }
            : t
        ),
      }
    }
    case 'DELETE_TASK':
      return { ...state, tasks: state.tasks.filter(t => t.id !== action.payload) }

    case 'TOGGLE_TASK': {
      const now = new Date().toISOString()
      return {
        ...state,
        tasks: state.tasks.map(t => {
          if (t.id !== action.payload) return t
          const nextStatus = t.status === 'done' ? 'pending' : 'done'
          return { ...t, status: nextStatus, updatedBy: state.currentUser, updatedAt: now }
        }),
      }
    }

    default:
      return state
  }
}

export function AppProvider({ children }) {
  const [state, dispatch] = useReducer(reducer, initialState)

  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify({ tasks: state.tasks, events: state.events, currentUser: state.currentUser }))
    } catch (_) {}
  }, [state])

  return <AppContext.Provider value={{ state, dispatch }}>{children}</AppContext.Provider>
}

export function useApp() {
  const ctx = useContext(AppContext)
  if (!ctx) throw new Error('useApp must be inside AppProvider')
  return ctx
}
