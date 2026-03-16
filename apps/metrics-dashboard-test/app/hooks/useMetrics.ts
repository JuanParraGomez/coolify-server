'use client'

import { useState, useEffect } from 'react'
import type { DashboardData } from '../lib/types'
import { MOCK_DASHBOARD } from '../lib/mock-data'

interface UseMetricsResult {
  data: DashboardData | null
  loading: boolean
  error: string | null
}

export function useMetrics(): UseMetricsResult {
  const [data, setData] = useState<DashboardData | null>(null)
  const [loading, setLoading] = useState(true)
  const [error] = useState<string | null>(null)

  useEffect(() => {
    // Simulate async fetch with deterministic mock data
    const timer = setTimeout(() => {
      setData(MOCK_DASHBOARD)
      setLoading(false)
    }, 300)

    return () => clearTimeout(timer)
  }, [])

  return { data, loading, error }
}
