import { useMemo } from 'react'
import {
  getTaskById,
  getTasksByUser,
  getEventById,
  getEventsByUser,
  getUpcomingEvents,
  groupTasksByAssignee,
  groupTasksByStatus,
  groupEventsByDate,
} from '../lib/mock-data'

/**
 * Hook for common data access patterns and queries
 */
export function useDataQueries(tasks = [], events = []) {
  // Tasks by assignee
  const tasksByAssignee = useMemo(() => {
    return groupTasksByAssignee(tasks)
  }, [tasks])

  // Tasks by status
  const tasksByStatus = useMemo(() => {
    return groupTasksByStatus(tasks)
  }, [tasks])

  // Events by date
  const eventsByDate = useMemo(() => {
    return groupEventsByDate(events)
  }, [events])

  // Upcoming events (next 7 days)
  const upcomingEvents = useMemo(() => {
    return getUpcomingEvents(events, 7)
  }, [events])

  // Today's tasks
  const todaysTasks = useMemo(() => {
    const today = new Date().toISOString().split('T')[0]
    return tasks.filter(t => t.dueDate === today)
  }, [tasks])

  // Today's events
  const todaysEvents = useMemo(() => {
    const today = new Date().toISOString().split('T')[0]
    return events.filter(e => e.date === today).sort((a, b) => {
      const timeA = a.time || '23:59'
      const timeB = b.time || '23:59'
      return timeA.localeCompare(timeB)
    })
  }, [events])

  // Overdue tasks
  const overdueTasks = useMemo(() => {
    const now = new Date()
    return tasks.filter(
      t => new Date(t.dueDate) < now && t.status !== 'done'
    )
  }, [tasks])

  // High priority pending tasks
  const highPriorityPending = useMemo(() => {
    return tasks.filter(t => t.priority === 'high' && t.status === 'pending')
  }, [tasks])

  // Query functions
  const getTask = (id) => getTaskById(tasks, id)
  const getEvent = (id) => getEventById(events, id)
  const getUserTasks = (userId) => getTasksByUser(tasks, userId)
  const getUserEvents = (userId) => getEventsByUser(events, userId)

  return {
    tasksByAssignee,
    tasksByStatus,
    eventsByDate,
    upcomingEvents,
    todaysTasks,
    todaysEvents,
    overdueTasks,
    highPriorityPending,
    getTask,
    getEvent,
    getUserTasks,
    getUserEvents,
  }
}
