// API and Data Service Layer
// Handles communication with backend and real-time sync
// Prepared for Socket.io integration

const API_BASE_URL = process.env.REACT_APP_API_URL || 'http://localhost:3000/api'
const WS_URL = process.env.REACT_APP_WS_URL || 'ws://localhost:3000'

// ============================================================================
// API CLIENT
// ============================================================================

class APIClient {
  constructor(baseURL = API_BASE_URL) {
    this.baseURL = baseURL
    this.token = null
    this.timeout = 10000
  }

  /**
   * Set authentication token for all requests
   */
  setToken(token) {
    this.token = token
  }

  /**
   * Make HTTP request with automatic error handling
   */
  async request(endpoint, options = {}) {
    const url = `${this.baseURL}${endpoint}`
    const headers = {
      'Content-Type': 'application/json',
      ...options.headers,
    }

    if (this.token) {
      headers['Authorization'] = `Bearer ${this.token}`
    }

    const controller = new AbortController()
    const timeoutId = setTimeout(() => controller.abort(), this.timeout)

    try {
      const response = await fetch(url, {
        ...options,
        headers,
        signal: controller.signal,
      })

      clearTimeout(timeoutId)

      if (!response.ok) {
        throw new Error(`API Error: ${response.status} ${response.statusText}`)
      }

      return await response.json()
    } catch (error) {
      clearTimeout(timeoutId)
      throw error
    }
  }

  // ========================================================================
  // TASK ENDPOINTS
  // ========================================================================

  /**
   * Fetch all tasks
   */
  async getTasks() {
    return this.request('/tasks')
  }

  /**
   * Fetch a single task
   */
  async getTask(id) {
    return this.request(`/tasks/${id}`)
  }

  /**
   * Create a new task
   */
  async createTask(task) {
    return this.request('/tasks', {
      method: 'POST',
      body: JSON.stringify(task),
    })
  }

  /**
   * Update an existing task
   */
  async updateTask(id, changes) {
    return this.request(`/tasks/${id}`, {
      method: 'PATCH',
      body: JSON.stringify(changes),
    })
  }

  /**
   * Delete a task
   */
  async deleteTask(id) {
    return this.request(`/tasks/${id}`, {
      method: 'DELETE',
    })
  }

  /**
   * Bulk update tasks (for sync)
   */
  async bulkUpdateTasks(tasks) {
    return this.request('/tasks/bulk', {
      method: 'PATCH',
      body: JSON.stringify({ tasks }),
    })
  }

  // ========================================================================
  // EVENT ENDPOINTS
  // ========================================================================

  /**
   * Fetch all events
   */
  async getEvents() {
    return this.request('/events')
  }

  /**
   * Fetch a single event
   */
  async getEvent(id) {
    return this.request(`/events/${id}`)
  }

  /**
   * Create a new event
   */
  async createEvent(event) {
    return this.request('/events', {
      method: 'POST',
      body: JSON.stringify(event),
    })
  }

  /**
   * Update an existing event
   */
  async updateEvent(id, changes) {
    return this.request(`/events/${id}`, {
      method: 'PATCH',
      body: JSON.stringify(changes),
    })
  }

  /**
   * Delete an event
   */
  async deleteEvent(id) {
    return this.request(`/events/${id}`, {
      method: 'DELETE',
    })
  }

  // ========================================================================
  // SYNC ENDPOINTS
  // ========================================================================

  /**
   * Get sync state from server
   * Returns version and last sync timestamp
   */
  async getSyncState() {
    return this.request('/sync/state')
  }

  /**
   * Sync all changes since lastSyncAt
   */
  async syncChanges(lastSyncAt) {
    return this.request('/sync/changes', {
      method: 'POST',
      body: JSON.stringify({ lastSyncAt }),
    })
  }

  /**
   * Push local changes to server
   */
  async pushChanges(payload) {
    return this.request('/sync/push', {
      method: 'POST',
      body: JSON.stringify(payload),
    })
  }
}

// ============================================================================
// REAL-TIME SYNC SERVICE
// ============================================================================

class RealtimeSyncService {
  constructor(wsURL = WS_URL) {
    this.wsURL = wsURL
    this.ws = null
    this.listeners = {}
    this.isConnected = false
    this.reconnectAttempts = 0
    this.maxReconnectAttempts = 5
    this.reconnectDelay = 1000
  }

  /**
   * Connect to WebSocket
   */
  connect(onMessage) {
    return new Promise((resolve, reject) => {
      try {
        this.ws = new WebSocket(this.wsURL)

        this.ws.onopen = () => {
          this.isConnected = true
          this.reconnectAttempts = 0
          this.emit('connected', {})
          resolve()
        }

        this.ws.onmessage = (event) => {
          try {
            const data = JSON.parse(event.data)
            this.emit(data.type, data.payload)
            if (onMessage) onMessage(data)
          } catch (error) {
            console.error('Failed to parse WebSocket message', error)
          }
        }

        this.ws.onerror = (error) => {
          this.emit('error', { error })
          reject(error)
        }

        this.ws.onclose = () => {
          this.isConnected = false
          this.emit('disconnected', {})
          this.attemptReconnect()
        }
      } catch (error) {
        reject(error)
      }
    })
  }

  /**
   * Attempt to reconnect with exponential backoff
   */
  attemptReconnect() {
    if (this.reconnectAttempts >= this.maxReconnectAttempts) {
      this.emit('reconnect-failed', {})
      return
    }

    const delay = this.reconnectDelay * Math.pow(2, this.reconnectAttempts)
    this.reconnectAttempts++

    setTimeout(() => {
      this.connect().catch(() => {
        // Silently handle reconnect failure
      })
    }, delay)
  }

  /**
   * Send message to server
   */
  send(type, payload) {
    if (!this.isConnected || !this.ws) {
      console.warn('WebSocket not connected, message queued')
      return false
    }

    try {
      this.ws.send(JSON.stringify({ type, payload }))
      return true
    } catch (error) {
      console.error('Failed to send WebSocket message', error)
      return false
    }
  }

  /**
   * Register event listener
   */
  on(event, callback) {
    if (!this.listeners[event]) {
      this.listeners[event] = []
    }
    this.listeners[event].push(callback)
  }

  /**
   * Unregister event listener
   */
  off(event, callback) {
    if (this.listeners[event]) {
      this.listeners[event] = this.listeners[event].filter(cb => cb !== callback)
    }
  }

  /**
   * Emit event to listeners
   */
  emit(event, data) {
    if (this.listeners[event]) {
      this.listeners[event].forEach(callback => callback(data))
    }
  }

  /**
   * Disconnect from WebSocket
   */
  disconnect() {
    if (this.ws) {
      this.ws.close()
      this.ws = null
      this.isConnected = false
    }
  }
}

// ============================================================================
// DATA SYNC COORDINATOR
// ============================================================================

class SyncCoordinator {
  constructor(apiClient, realtimeService) {
    this.api = apiClient
    this.realtime = realtimeService
    this.syncInterval = 30000 // 30 seconds
    this.lastSyncAt = null
    this.isSyncing = false
    this.pendingChanges = {
      tasks: [],
      events: [],
    }
  }

  /**
   * Initialize sync coordination
   */
  async initialize() {
    // Get initial sync state
    try {
      const state = await this.api.getSyncState()
      this.lastSyncAt = state.lastSyncAt
    } catch (error) {
      console.warn('Failed to get initial sync state', error)
      this.lastSyncAt = new Date().toISOString()
    }

    // Start periodic sync
    this.startPeriodicSync()

    // Setup real-time listeners
    this.setupRealtimeListeners()
  }

  /**
   * Setup listeners for real-time updates
   */
  setupRealtimeListeners() {
    this.realtime.on('task-updated', (task) => {
      this.emit('remote-task-updated', task)
    })

    this.realtime.on('task-created', (task) => {
      this.emit('remote-task-created', task)
    })

    this.realtime.on('task-deleted', (taskId) => {
      this.emit('remote-task-deleted', taskId)
    })

    this.realtime.on('event-updated', (event) => {
      this.emit('remote-event-updated', event)
    })

    this.realtime.on('event-created', (event) => {
      this.emit('remote-event-created', event)
    })

    this.realtime.on('event-deleted', (eventId) => {
      this.emit('remote-event-deleted', eventId)
    })

    this.realtime.on('sync-required', () => {
      this.performSync()
    })
  }

  /**
   * Register listener for sync events
   */
  on(event, callback) {
    if (!this.listeners) {
      this.listeners = {}
    }
    if (!this.listeners[event]) {
      this.listeners[event] = []
    }
    this.listeners[event].push(callback)
  }

  /**
   * Emit sync events
   */
  emit(event, data) {
    if (!this.listeners || !this.listeners[event]) return
    this.listeners[event].forEach(callback => callback(data))
  }

  /**
   * Start periodic sync
   */
  startPeriodicSync() {
    setInterval(() => {
      if (!this.isSyncing) {
        this.performSync()
      }
    }, this.syncInterval)
  }

  /**
   * Perform full sync with server
   */
  async performSync() {
    if (this.isSyncing) return

    this.isSyncing = true
    try {
      const changes = await this.api.syncChanges(this.lastSyncAt)
      this.emit('sync-completed', changes)
      this.lastSyncAt = new Date().toISOString()
    } catch (error) {
      console.error('Sync failed', error)
      this.emit('sync-failed', { error })
    } finally {
      this.isSyncing = false
    }
  }

  /**
   * Queue local change for sync
   */
  queueChange(type, entity, operation) {
    this.pendingChanges[type].push({
      entity,
      operation,
      timestamp: new Date().toISOString(),
    })

    // Attempt to sync if not already syncing
    if (!this.isSyncing) {
      this.pushPendingChanges()
    }
  }

  /**
   * Push queued changes to server
   */
  async pushPendingChanges() {
    if (this.pendingChanges.tasks.length === 0 && this.pendingChanges.events.length === 0) {
      return
    }

    try {
      await this.api.pushChanges({
        tasks: this.pendingChanges.tasks,
        events: this.pendingChanges.events,
      })

      this.pendingChanges = {
        tasks: [],
        events: [],
      }
      this.emit('changes-pushed', {})
    } catch (error) {
      console.error('Failed to push changes', error)
      this.emit('push-failed', { error })
    }
  }

  /**
   * Pause sync (e.g., during offline)
   */
  pause() {
    this.isSyncing = true
  }

  /**
   * Resume sync (e.g., when back online)
   */
  resume() {
    this.isSyncing = false
    this.performSync()
  }
}

// ============================================================================
// SERVICE FACTORY
// ============================================================================

let apiClient = null
let realtimeService = null
let syncCoordinator = null

/**
 * Initialize data services
 */
export async function initializeDataServices() {
  apiClient = new APIClient()
  realtimeService = new RealtimeSyncService()

  try {
    // Only connect to real-time if available
    await realtimeService.connect()
  } catch (error) {
    console.warn('Real-time service unavailable, falling back to polling', error)
  }

  syncCoordinator = new SyncCoordinator(apiClient, realtimeService)
  await syncCoordinator.initialize()

  return {
    api: apiClient,
    realtime: realtimeService,
    sync: syncCoordinator,
  }
}

/**
 * Get singleton API client
 */
export function getAPIClient() {
  if (!apiClient) {
    apiClient = new APIClient()
  }
  return apiClient
}

/**
 * Get singleton realtime service
 */
export function getRealtimeService() {
  if (!realtimeService) {
    realtimeService = new RealtimeSyncService()
  }
  return realtimeService
}

/**
 * Get singleton sync coordinator
 */
export function getSyncCoordinator() {
  if (!syncCoordinator) {
    syncCoordinator = new SyncCoordinator(
      getAPIClient(),
      getRealtimeService()
    )
  }
  return syncCoordinator
}

// ============================================================================
// EXPORTS
// ============================================================================

export { APIClient, RealtimeSyncService, SyncCoordinator }
