import { useMemo } from 'react'

/**
 * Hook for computing task and event statistics
 */
export function useStats(tasks = [], events = []) {
  const taskStats = useMemo(() => {
    return {
      total: tasks.length,
      pending: tasks.filter(t => t.status === 'pending').length,
      inProgress: tasks.filter(t => t.status === 'in-progress').length,
      done: tasks.filter(t => t.status === 'done').length,
      blocked: tasks.filter(t => t.status === 'blocked').length,
      highPriority: tasks.filter(t => t.priority === 'high').length,
      overdue: tasks.filter(
        t => new Date(t.dueDate) < new Date() && t.status !== 'done'
      ).length,
      completionRate:
        tasks.length > 0
          ? Math.round(
              (tasks.filter(t => t.status === 'done').length / tasks.length) * 100
            )
          : 0,
    }
  }, [tasks])

  const eventStats = useMemo(() => {
    const today = new Date()
    const nextWeek = new Date(today)
    nextWeek.setDate(nextWeek.getDate() + 7)

    return {
      total: events.length,
      today: events.filter(e => e.date === today.toISOString().split('T')[0])
        .length,
      thisWeek: events.filter(
        e =>
          new Date(e.date) >= today &&
          new Date(e.date) <= nextWeek
      ).length,
      meetings: events.filter(e => e.type === 'meeting').length,
      reminders: events.filter(e => e.type === 'reminder').length,
      deadlines: events.filter(e => e.type === 'deadline').length,
    }
  }, [events])

  const userStats = useMemo(() => {
    const tasksByUser = {}
    tasks.forEach(t => {
      const user = t.assignee || 'unassigned'
      if (!tasksByUser[user]) {
        tasksByUser[user] = {
          total: 0,
          pending: 0,
          inProgress: 0,
          done: 0,
          blocked: 0,
        }
      }
      tasksByUser[user].total++
      tasksByUser[user][t.status]++
    })
    return tasksByUser
  }, [tasks])

  const priorityDistribution = useMemo(() => {
    return {
      high: tasks.filter(t => t.priority === 'high').length,
      medium: tasks.filter(t => t.priority === 'medium').length,
      low: tasks.filter(t => t.priority === 'low').length,
    }
  }, [tasks])

  const statusDistribution = useMemo(() => {
    return {
      pending: tasks.filter(t => t.status === 'pending').length,
      'in-progress': tasks.filter(t => t.status === 'in-progress').length,
      done: tasks.filter(t => t.status === 'done').length,
      blocked: tasks.filter(t => t.status === 'blocked').length,
    }
  }, [tasks])

  return {
    taskStats,
    eventStats,
    userStats,
    priorityDistribution,
    statusDistribution,
  }
}
