import type { DashboardData, RegionalDataRow } from './types'

/**
 * Main metrics - 3 KPIs for the dashboard
 * Real data: Usuarios activos, Ingresos del mes, Tickets pendientes
 */
const MOCK_METRICS_DATA: DashboardData = {
  activeUsers: {
    id: 'active-users',
    title: 'Usuarios Activos',
    value: 1284,
    formatted: '1,284',
    trend: { value: 12, direction: 'up' },
    description: 'Usuarios activos en los últimos 30 días',
  },
  monthlyRevenue: {
    id: 'monthly-revenue',
    title: 'Ingresos del Mes',
    value: 48320,
    formatted: '$48,320',
    trend: { value: 8, direction: 'up' },
    description: 'Ingresos totales en marzo 2026',
  },
  pendingTickets: {
    id: 'pending-tickets',
    title: 'Tickets Pendientes',
    value: 37,
    formatted: '37',
    trend: { value: 5, direction: 'down' },
    description: 'Tickets de soporte abiertos sin resolver',
  },
  lastUpdated: new Date().toISOString(),
}

/**
 * Regional breakdown data - 5 regions with real metrics
 * Each region has: users, revenue, and pending tickets
 */
export const MOCK_REGIONS: RegionalDataRow[] = [
  { region: 'Norteamérica', users: 450, revenue: 18500, tickets: 12 },
  { region: 'Europa', users: 380, revenue: 16200, tickets: 8 },
  { region: 'Asia Pacífico', users: 280, revenue: 10200, tickets: 15 },
  { region: 'Latinoamérica', users: 138, revenue: 3420, tickets: 2 },
  { region: 'Oriente Medio & África', users: 36, revenue: 0, tickets: 0 },
]

/**
 * Utility function to calculate regional totals
 */
export function getRegionalTotals() {
  return {
    totalUsers: MOCK_REGIONS.reduce((sum, r) => sum + r.users, 0),
    totalRevenue: MOCK_REGIONS.reduce((sum, r) => sum + r.revenue, 0),
    totalTickets: MOCK_REGIONS.reduce((sum, r) => sum + r.tickets, 0),
  }
}

/**
 * Filter regions by name
 */
export function filterRegions(regions: RegionalDataRow[], query: string): RegionalDataRow[] {
  if (!query) return regions
  return regions.filter(r => r.region.toLowerCase().includes(query.toLowerCase()))
}

/**
 * Sort regions by different metrics
 */
export function sortRegions(
  regions: RegionalDataRow[],
  sortBy: 'revenue' | 'users' | 'tickets'
): RegionalDataRow[] {
  const sorted = [...regions]
  sorted.sort((a, b) => {
    if (sortBy === 'revenue') return b.revenue - a.revenue
    if (sortBy === 'users') return b.users - a.users
    if (sortBy === 'tickets') return b.tickets - a.tickets
    return 0
  })
  return sorted
}

// Export main metrics object for useMetrics hook
export const MOCK_DASHBOARD: DashboardData = MOCK_METRICS_DATA

// Alternative export for page.tsx compatibility
export const MOCK_METRICS = {
  metrics: MOCK_METRICS_DATA,
  regionalData: MOCK_REGIONS,
}
