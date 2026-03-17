import React, { createContext, useContext, useReducer, useEffect } from 'react'
import { getActiveProvider, setActiveProvider } from '../utils/providers.js'

const AppContext = createContext(null)

const initialState = {
  activeProvider: getActiveProvider(),
  unreadAlerts: 0,
  selectedLeadId: null,
}

function reducer(state, action) {
  switch (action.type) {
    case 'SET_PROVIDER':
      setActiveProvider(action.payload)
      return { ...state, activeProvider: action.payload }
    case 'SET_UNREAD_ALERTS':
      return { ...state, unreadAlerts: action.payload }
    case 'SELECT_LEAD':
      return { ...state, selectedLeadId: action.payload }
    default:
      return state
  }
}

export function AppProvider({ children }) {
  const [state, dispatch] = useReducer(reducer, initialState)
  return (
    <AppContext.Provider value={{ state, dispatch }}>
      {children}
    </AppContext.Provider>
  )
}

export function useApp() {
  const ctx = useContext(AppContext)
  if (!ctx) throw new Error('useApp must be used inside AppProvider')
  return ctx
}
