// Enhanced mock data layer with real-time sync preparation
// Deterministic seed for April 2026 — compatible with Socket.io real-time updates

// ============================================================================
// USER MANAGEMENT
// ============================================================================

export const USERS = {
  juan: {
    id: 'juan',
    name: 'Juan',
    email: 'juan@example.com',
    color: '#3B82F6',
    initials: 'JU',
    role: 'owner',
    syncVersion: 1,
  },
  asistente: {
    id: 'asistente',
    name: 'Asistente',
    email: 'asistente@example.com',
    color: '#8B5CF6',
    initials: 'AS',
    role: 'collaborator',
    syncVersion: 1,
  },
}

// ============================================================================
// TASK AND EVENT CONSTANTS
// ============================================================================

export const PRIORITY_LEVELS = {
  high: { value: 'high', label: 'Alto', order: 1, color: '#EF4444' },
  medium: { value: 'medium', label: 'Medio', order: 2, color: '#F59E0B' },
  low: { value: 'low', label: 'Bajo', order: 3, color: '#6B7280' },
}

export const TASK_STATUSES = {
  pending: { value: 'pending', label: 'Pendiente', color: '#6B7280' },
  'in-progress': { value: 'in-progress', label: 'En progreso', color: '#3B82F6' },
  done: { value: 'done', label: 'Completado', color: '#10B981' },
  blocked: { value: 'blocked', label: 'Bloqueado', color: '#EF4444' },
}

export const EVENT_TYPES = {
  meeting: { value: 'meeting', label: 'Reunión', color: '#3B82F6', icon: '📞' },
  reminder: { value: 'reminder', label: 'Recordatorio', color: '#F59E0B', icon: '🔔' },
  deadline: { value: 'deadline', label: 'Vencimiento', color: '#EF4444', icon: '⏰' },
  personal: { value: 'personal', label: 'Personal', color: '#8B5CF6', icon: '📝' },
}

// ============================================================================
// MOCK TASKS DATA
// ============================================================================

export const INITIAL_TASKS = [
  {
    id: 't1',
    title: 'Revisar propuesta comercial cliente A',
    description: 'Leer el documento enviado y marcar puntos de negociación.',
    dueDate: '2026-04-10',
    status: 'pending',
    priority: 'high',
    createdBy: 'asistente',
    updatedBy: 'asistente',
    updatedAt: '2026-04-09T09:00:00Z',
    tags: ['comercial', 'cliente'],
    assignee: 'juan',
    completedAt: null,
    syncVersion: 1,
  },
  {
    id: 't2',
    title: 'Preparar agenda reunión semanal',
    description: 'Listar temas: avances, bloqueos, próximas acciones.',
    dueDate: '2026-04-11',
    status: 'in-progress',
    priority: 'medium',
    createdBy: 'juan',
    updatedBy: 'juan',
    updatedAt: '2026-04-09T10:30:00Z',
    tags: ['reunión', 'interno'],
    assignee: 'juan',
    completedAt: null,
    syncVersion: 1,
  },
  {
    id: 't3',
    title: 'Actualizar CRM con notas de llamadas',
    description: 'Subir notas de las 3 llamadas de esta semana.',
    dueDate: '2026-04-12',
    status: 'pending',
    priority: 'medium',
    createdBy: 'asistente',
    updatedBy: 'asistente',
    updatedAt: '2026-04-08T16:00:00Z',
    tags: ['crm', 'admin'],
    assignee: 'asistente',
    completedAt: null,
    syncVersion: 1,
  },
  {
    id: 't4',
    title: 'Confirmar hotel para viaje abril 22',
    description: 'Revisar disponibilidad y mandar confirmación a Juan.',
    dueDate: '2026-04-14',
    status: 'pending',
    priority: 'high',
    createdBy: 'asistente',
    updatedBy: 'asistente',
    updatedAt: '2026-04-09T08:00:00Z',
    tags: ['viaje', 'logística'],
    assignee: 'asistente',
    completedAt: null,
    syncVersion: 1,
  },
  {
    id: 't5',
    title: 'Enviar reporte mensual de métricas',
    description: 'Consolidar datos de marzo y enviar PDF al equipo.',
    dueDate: '2026-04-15',
    status: 'done',
    priority: 'high',
    createdBy: 'juan',
    updatedBy: 'asistente',
    updatedAt: '2026-04-07T14:00:00Z',
    tags: ['reportes', 'métricas'],
    assignee: 'juan',
    completedAt: '2026-04-07T14:00:00Z',
    syncVersion: 1,
  },
  {
    id: 't6',
    title: 'Llamar proveedor de servicios IT',
    description: 'Seguimiento de cotización presentada la semana pasada.',
    dueDate: '2026-04-16',
    status: 'pending',
    priority: 'low',
    createdBy: 'juan',
    updatedBy: 'juan',
    updatedAt: '2026-04-09T11:00:00Z',
    tags: ['proveedores', 'it'],
    assignee: 'juan',
    completedAt: null,
    syncVersion: 1,
  },
  {
    id: 't7',
    title: 'Revisar contrato de nuevo colaborador',
    description: 'Verificar cláusulas y firmar antes del lunes.',
    dueDate: '2026-04-13',
    status: 'in-progress',
    priority: 'high',
    createdBy: 'asistente',
    updatedBy: 'juan',
    updatedAt: '2026-04-09T12:00:00Z',
    tags: ['legal', 'rh'],
    assignee: 'juan',
    completedAt: null,
    syncVersion: 1,
  },
  {
    id: 't8',
    title: 'Planificar contenido redes sociales semana 17',
    description: 'Crear 5 publicaciones y programarlas en Buffer.',
    dueDate: '2026-04-18',
    status: 'pending',
    priority: 'low',
    createdBy: 'asistente',
    updatedBy: 'asistente',
    updatedAt: '2026-04-09T09:30:00Z',
    tags: ['marketing', 'redes'],
    assignee: 'asistente',
    completedAt: null,
    syncVersion: 1,
  },
  {
    id: 't9',
    title: 'Crear presentación resultados Q2',
    description: 'Slides para presentación de resultados del segundo trimestre.',
    dueDate: '2026-04-20',
    status: 'pending',
    priority: 'high',
    createdBy: 'juan',
    updatedBy: 'juan',
    updatedAt: '2026-04-09T08:00:00Z',
    tags: ['presentación', 'resultados'],
    assignee: 'juan',
    completedAt: null,
    syncVersion: 1,
  },
  {
    id: 't10',
    title: 'Revisar facturas pendientes de aprobación',
    description: 'Aprobar 3 facturas de proveedores que vencen este mes.',
    dueDate: '2026-04-16',
    status: 'in-progress',
    priority: 'medium',
    createdBy: 'asistente',
    updatedBy: 'asistente',
    updatedAt: '2026-04-09T10:00:00Z',
    tags: ['finanzas', 'admin'],
    assignee: 'asistente',
    completedAt: null,
    syncVersion: 1,
  },
  {
    id: 't11',
    title: 'Coordinar entrevistas para nueva posición',
    description: 'Agendar 4 entrevistas con candidatos preseleccionados.',
    dueDate: '2026-04-17',
    status: 'pending',
    priority: 'medium',
    createdBy: 'asistente',
    updatedBy: 'asistente',
    updatedAt: '2026-04-08T15:00:00Z',
    tags: ['rh', 'selección'],
    assignee: 'asistente',
    completedAt: null,
    syncVersion: 1,
  },
  {
    id: 't12',
    title: 'Analizar métricas de campaña de marzo',
    description: 'Revisar CTR, conversión y ROAS de la campaña del mes pasado.',
    dueDate: '2026-04-11',
    status: 'done',
    priority: 'medium',
    createdBy: 'juan',
    updatedBy: 'juan',
    updatedAt: '2026-04-08T14:00:00Z',
    tags: ['marketing', 'análisis'],
    assignee: 'juan',
    completedAt: '2026-04-08T14:00:00Z',
    syncVersion: 1,
  },
  {
    id: 't13',
    title: 'Organizar archivos del Q1 en Drive',
    description: 'Mover documentos de Q1 a carpeta de archivos históricos.',
    dueDate: '2026-04-23',
    status: 'pending',
    priority: 'low',
    createdBy: 'asistente',
    updatedBy: 'asistente',
    updatedAt: '2026-04-07T11:00:00Z',
    tags: ['admin', 'documentos'],
    assignee: 'asistente',
    completedAt: null,
    syncVersion: 1,
  },
  {
    id: 't14',
    title: 'Renovar suscripciones SaaS del equipo',
    description: 'Verificar y renovar las suscripciones que vencen en abril.',
    dueDate: '2026-04-14',
    status: 'done',
    priority: 'high',
    createdBy: 'juan',
    updatedBy: 'asistente',
    updatedAt: '2026-04-08T09:00:00Z',
    tags: ['it', 'gastos'],
    assignee: 'juan',
    completedAt: '2026-04-08T09:00:00Z',
    syncVersion: 1,
  },
  {
    id: 't15',
    title: 'Preparar onboarding para nuevo empleado',
    description: 'Crear guía de bienvenida, accesos y cronograma de primera semana.',
    dueDate: '2026-04-19',
    status: 'in-progress',
    priority: 'high',
    createdBy: 'asistente',
    updatedBy: 'juan',
    updatedAt: '2026-04-09T11:30:00Z',
    tags: ['rh', 'onboarding'],
    assignee: 'juan',
    completedAt: null,
    syncVersion: 1,
  },
]

// ============================================================================
// MOCK EVENTS DATA
// ============================================================================

export const INITIAL_EVENTS = [
  {
    id: 'e1',
    title: 'Reunión equipo',
    date: '2026-04-09',
    time: '10:00',
    endTime: '11:00',
    type: 'meeting',
    description: 'Reunión semanal con el equipo completo',
    createdBy: 'juan',
    attendees: ['juan', 'asistente'],
    location: 'Sala de conferencias',
    syncVersion: 1,
  },
  {
    id: 'e2',
    title: 'Llamada cliente B',
    date: '2026-04-10',
    time: '15:00',
    endTime: '15:30',
    type: 'meeting',
    description: 'Seguimiento propuesta Q2',
    createdBy: 'asistente',
    attendees: ['asistente', 'juan'],
    location: 'Videollamada',
    syncVersion: 1,
  },
  {
    id: 'e3',
    title: 'Entrega propuesta',
    date: '2026-04-11',
    time: '09:00',
    endTime: null,
    type: 'deadline',
    description: 'Deadline para entregar propuesta comercial',
    createdBy: 'asistente',
    attendees: [],
    location: null,
    syncVersion: 1,
  },
  {
    id: 'e4',
    title: 'Review mensual',
    date: '2026-04-14',
    time: '11:00',
    endTime: '12:00',
    type: 'meeting',
    description: 'Review de avances y métricas del mes',
    createdBy: 'juan',
    attendees: ['juan', 'asistente'],
    location: 'Oficina',
    syncVersion: 1,
  },
  {
    id: 'e5',
    title: 'Viaje — check-in hotel',
    date: '2026-04-22',
    time: '14:00',
    endTime: null,
    type: 'reminder',
    description: 'Recordatorio para check-in en el hotel',
    createdBy: 'asistente',
    attendees: ['juan'],
    location: null,
    syncVersion: 1,
  },
  {
    id: 'e6',
    title: 'Presentación resultados Q1',
    date: '2026-04-24',
    time: '09:30',
    endTime: '11:00',
    type: 'meeting',
    description: 'Presentación oficial de resultados del primer trimestre',
    createdBy: 'juan',
    attendees: ['juan', 'asistente'],
    location: 'Auditorio',
    syncVersion: 1,
  },
  {
    id: 'e7',
    title: 'Deadline entrega contrato',
    date: '2026-04-13',
    time: '18:00',
    endTime: null,
    type: 'deadline',
    description: 'Último día para entregar contrato revisado',
    createdBy: 'asistente',
    attendees: ['juan'],
    location: null,
    syncVersion: 1,
  },
  {
    id: 'e8',
    title: 'Webinar marketing',
    date: '2026-04-17',
    time: '16:00',
    endTime: '17:30',
    type: 'meeting',
    description: 'Webinar sobre estrategias de marketing 2026',
    createdBy: 'asistente',
    attendees: ['asistente'],
    location: 'Online',
    syncVersion: 1,
  },
  {
    id: 'e9',
    title: 'Revisión de presupuesto mensual',
    date: '2026-04-15',
    time: '10:00',
    endTime: '10:45',
    type: 'meeting',
    description: 'Revisión y aprobación de presupuesto de abril',
    createdBy: 'juan',
    attendees: ['juan', 'asistente'],
    location: 'Oficina',
    syncVersion: 1,
  },
  {
    id: 'e10',
    title: 'Llamada con proveedor IT',
    date: '2026-04-16',
    time: '15:30',
    endTime: '16:00',
    type: 'meeting',
    description: 'Discusión de propuesta y presupuesto',
    createdBy: 'asistente',
    attendees: ['asistente'],
    location: 'Videollamada',
    syncVersion: 1,
  },
  {
    id: 'e11',
    title: 'Entrega contrato firmado',
    date: '2026-04-17',
    time: '12:00',
    endTime: null,
    type: 'reminder',
    description: 'Enviar contrato firmado al cliente',
    createdBy: 'juan',
    attendees: [],
    location: null,
    syncVersion: 1,
  },
  {
    id: 'e12',
    title: 'Kick-off nuevo proyecto',
    date: '2026-04-19',
    time: '09:00',
    endTime: '10:30',
    type: 'meeting',
    description: 'Kick-off meeting del nuevo proyecto con equipo',
    createdBy: 'juan',
    attendees: ['juan', 'asistente'],
    location: 'Sala de conferencias',
    syncVersion: 1,
  },
]

// ============================================================================
// FILTERING FUNCTIONS
// ============================================================================

export function filterTasksByStatus(tasks, status) {
  if (!status) return tasks
  return tasks.filter(t => t.status === status)
}

export function filterTasksByPriority(tasks, priority) {
  if (!priority) return tasks
  return tasks.filter(t => t.priority === priority)
}

export function filterTasksByAssignee(tasks, assignee) {
  if (!assignee) return tasks
  return tasks.filter(t => t.assignee === assignee)
}

export function filterTasksByTags(tasks, tags) {
  if (!tags || tags.length === 0) return tasks
  return tasks.filter(t => tags.some(tag => t.tags.includes(tag)))
}

export function filterEventsByType(events, type) {
  if (!type) return events
  return events.filter(e => e.type === type)
}

export function filterEventsByDate(events, date) {
  if (!date) return events
  return events.filter(e => e.date === date)
}

// ============================================================================
// SORTING FUNCTIONS
// ============================================================================

export function sortTasksByDueDate(tasks) {
  return [...tasks].sort((a, b) => new Date(a.dueDate) - new Date(b.dueDate))
}

export function sortTasksByPriority(tasks) {
  const priorityOrder = { high: 0, medium: 1, low: 2 }
  return [...tasks].sort((a, b) => priorityOrder[a.priority] - priorityOrder[b.priority])
}

export function sortEventsByTime(events) {
  return [...events].sort((a, b) => {
    const timeA = a.time || '23:59'
    const timeB = b.time || '23:59'
    return timeA.localeCompare(timeB)
  })
}

// ============================================================================
// ANALYTICS AND STATISTICS
// ============================================================================

export function getTaskStats(tasks) {
  return {
    total: tasks.length,
    pending: tasks.filter(t => t.status === 'pending').length,
    inProgress: tasks.filter(t => t.status === 'in-progress').length,
    done: tasks.filter(t => t.status === 'done').length,
    blocked: tasks.filter(t => t.status === 'blocked').length,
    highPriority: tasks.filter(t => t.priority === 'high').length,
    overdue: tasks.filter(t => new Date(t.dueDate) < new Date() && t.status !== 'done').length,
  }
}

export function getUpcomingEvents(events, daysAhead = 7) {
  const today = new Date()
  const cutoff = new Date(today)
  cutoff.setDate(cutoff.getDate() + daysAhead)

  return events.filter(e => {
    const eventDate = new Date(e.date)
    return eventDate >= today && eventDate <= cutoff
  })
}

// ============================================================================
// GROUPING FUNCTIONS
// ============================================================================

export function groupTasksByAssignee(tasks) {
  const grouped = {}
  tasks.forEach(task => {
    const assignee = task.assignee || 'unassigned'
    if (!grouped[assignee]) grouped[assignee] = []
    grouped[assignee].push(task)
  })
  return grouped
}

export function groupTasksByStatus(tasks) {
  const grouped = {}
  tasks.forEach(task => {
    if (!grouped[task.status]) grouped[task.status] = []
    grouped[task.status].push(task)
  })
  return grouped
}

export function groupEventsByDate(events) {
  const grouped = {}
  events.forEach(event => {
    if (!grouped[event.date]) grouped[event.date] = []
    grouped[event.date].push(event)
  })
  return grouped
}

// ============================================================================
// TAG MANAGEMENT
// ============================================================================

export function getAllTags(tasks) {
  const tags = new Set()
  tasks.forEach(task => {
    task.tags.forEach(tag => tags.add(tag))
  })
  return Array.from(tags).sort()
}

export function getTagsWithFrequency(tasks) {
  const freq = {}
  tasks.forEach(task => {
    task.tags.forEach(tag => {
      freq[tag] = (freq[tag] || 0) + 1
    })
  })
  return Object.entries(freq)
    .map(([tag, count]) => ({ tag, count }))
    .sort((a, b) => b.count - a.count)
}

// ============================================================================
// TASK SEARCH AND QUERY
// ============================================================================

export function searchTasks(tasks, query) {
  if (!query || query.trim() === '') return tasks
  const lower = query.toLowerCase()
  return tasks.filter(
    t =>
      t.title.toLowerCase().includes(lower) ||
      t.description.toLowerCase().includes(lower) ||
      t.tags.some(tag => tag.toLowerCase().includes(lower))
  )
}

export function getTaskById(tasks, id) {
  return tasks.find(t => t.id === id)
}

export function getTasksByUser(tasks, userId) {
  return tasks.filter(t => t.assignee === userId)
}

// ============================================================================
// EVENT SEARCH AND QUERY
// ============================================================================

export function searchEvents(events, query) {
  if (!query || query.trim() === '') return events
  const lower = query.toLowerCase()
  return events.filter(
    e =>
      e.title.toLowerCase().includes(lower) ||
      e.description.toLowerCase().includes(lower) ||
      e.location?.toLowerCase().includes(lower)
  )
}

export function getEventById(events, id) {
  return events.find(e => e.id === id)
}

export function getEventsByUser(events, userId) {
  return events.filter(e => e.attendees.includes(userId))
}

// ============================================================================
// SYNC AND CONFLICT RESOLUTION
// ============================================================================

/**
 * Compare two entities and detect conflicts
 * Used for real-time sync conflict resolution
 */
export function detectConflict(local, remote) {
  if (!local || !remote) return null
  if (local.id !== remote.id) return null

  const localVersion = local.syncVersion || 0
  const remoteVersion = remote.syncVersion || 0

  if (remoteVersion > localVersion) {
    return { type: 'remote-newer', local, remote }
  }
  if (localVersion > remoteVersion) {
    return { type: 'local-newer', local, remote }
  }
  if (local.updatedAt !== remote.updatedAt) {
    return { type: 'concurrent-edit', local, remote }
  }
  return null
}

/**
 * Merge strategy for concurrent updates
 * Prefers newer timestamps, falls back to remote if same
 */
export function resolveMerge(local, remote) {
  if (!local) return remote
  if (!remote) return local

  const conflict = detectConflict(local, remote)
  if (!conflict) return local

  if (conflict.type === 'remote-newer') {
    return { ...remote, syncVersion: (remote.syncVersion || 0) + 1 }
  }
  if (conflict.type === 'local-newer') {
    return { ...local, syncVersion: (local.syncVersion || 0) + 1 }
  }

  const localTime = new Date(local.updatedAt || 0).getTime()
  const remoteTime = new Date(remote.updatedAt || 0).getTime()

  if (remoteTime > localTime) {
    return { ...remote, syncVersion: (remote.syncVersion || 0) + 1 }
  }

  return { ...local, syncVersion: (local.syncVersion || 0) + 1 }
}

// ============================================================================
// DATA VALIDATION
// ============================================================================

export function validateTask(task) {
  const errors = []
  if (!task.title || task.title.trim() === '') errors.push('Title is required')
  if (!task.dueDate) errors.push('Due date is required')
  if (!task.status || !TASK_STATUSES[task.status]) errors.push('Invalid status')
  if (!task.priority || !PRIORITY_LEVELS[task.priority]) errors.push('Invalid priority')
  if (!task.assignee || !USERS[task.assignee]) errors.push('Invalid assignee')
  return errors
}

export function validateEvent(event) {
  const errors = []
  if (!event.title || event.title.trim() === '') errors.push('Title is required')
  if (!event.date) errors.push('Date is required')
  if (event.time && !event.time.match(/^\d{2}:\d{2}$/)) errors.push('Invalid time format (HH:MM)')
  if (!event.type || !EVENT_TYPES[event.type]) errors.push('Invalid event type')
  return errors
}

// ============================================================================
// DATA EXPORT FOR API/SYNC
// ============================================================================

/**
 * Export task data for API transmission
 * Strips internal fields not needed by remote
 */
export function exportTaskForSync(task) {
  return {
    id: task.id,
    title: task.title,
    description: task.description,
    dueDate: task.dueDate,
    status: task.status,
    priority: task.priority,
    assignee: task.assignee,
    tags: task.tags,
    updatedAt: task.updatedAt,
    syncVersion: task.syncVersion,
  }
}

/**
 * Export event data for API transmission
 */
export function exportEventForSync(event) {
  return {
    id: event.id,
    title: event.title,
    date: event.date,
    time: event.time,
    endTime: event.endTime,
    type: event.type,
    description: event.description,
    attendees: event.attendees,
    location: event.location,
    updatedAt: event.updatedAt,
    syncVersion: event.syncVersion,
  }
}
