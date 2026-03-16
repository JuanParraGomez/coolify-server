export type TrendDirection = 'up' | 'down' | 'neutral'

export interface Trend {
  value: number
  direction: TrendDirection
}

export interface MetricData {
  id: string
  title: string
  value: number
  formatted: string
  trend: Trend
  description: string
}

export interface RegionalDataRow {
  region: string
  users: number
  revenue: number
  tickets: number
}

export interface DashboardData {
  activeUsers: MetricData
  monthlyRevenue: MetricData
  pendingTickets: MetricData
  lastUpdated: string
}
