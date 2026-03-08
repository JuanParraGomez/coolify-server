export const QUARTERS = ['Q1', 'Q2', 'Q3', 'Q4'] as const
export const REGION_NAMES = ['Norte', 'Sur', 'Este', 'Oeste', 'Centro'] as const
export const SALES_YEARS = [2024, 2025] as const

export type Quarter = (typeof QUARTERS)[number]
export type RegionName = (typeof REGION_NAMES)[number]
export type DashboardView = 'summary' | 'detail'

export interface SalesRecord {
  year: number
  quarter: Quarter
  region: RegionName
  revenue: number
  orders: number
}

export interface SalesFilters {
  year: number | 'all'
  quarter: Quarter | 'all'
  regions: RegionName[]
  search: string
}

export interface DashboardState {
  view: DashboardView
  selectedRegion: RegionName | null
  filters: SalesFilters
}

export interface RegionQuarterRow {
  region: RegionName
  q1: number
  q2: number
  q3: number
  q4: number
  total: number
  orders: number
  avgTicket: number
}

const regionBaseRevenue: Record<RegionName, number> = {
  Norte: 110000,
  Sur: 92000,
  Este: 98000,
  Oeste: 104000,
  Centro: 118000,
}

const regionTicket: Record<RegionName, number> = {
  Norte: 470,
  Sur: 430,
  Este: 445,
  Oeste: 455,
  Centro: 480,
}

const quarterMultiplier: Record<Quarter, number> = {
  Q1: 0.9,
  Q2: 1,
  Q3: 1.07,
  Q4: 1.18,
}

const yearGrowth: Record<number, number> = {
  2024: 1,
  2025: 1.09,
}

export const SALES_RECORDS: SalesRecord[] = SALES_YEARS.flatMap((year) =>
  REGION_NAMES.flatMap((region) =>
    QUARTERS.map((quarter, index) => {
      const baseRevenue = regionBaseRevenue[region] * quarterMultiplier[quarter] * yearGrowth[year]
      const seasonalityBump = (index + 1) * 1375
      const revenue = Math.round(baseRevenue + seasonalityBump)
      const orders = Math.max(1, Math.round(revenue / regionTicket[region]))
      return { year, quarter, region, revenue, orders }
    })
  )
)

export const DEFAULT_SALES_FILTERS: SalesFilters = {
  year: SALES_YEARS[SALES_YEARS.length - 1],
  quarter: 'all',
  regions: [],
  search: '',
}

export const INITIAL_DASHBOARD_STATE: DashboardState = {
  view: 'summary',
  selectedRegion: null,
  filters: { ...DEFAULT_SALES_FILTERS },
}

type QuarterField = 'q1' | 'q2' | 'q3' | 'q4'

const quarterToField: Record<Quarter, QuarterField> = {
  Q1: 'q1',
  Q2: 'q2',
  Q3: 'q3',
  Q4: 'q4',
}

export function getAvailableYears(records = SALES_RECORDS): number[] {
  return [...new Set(records.map((record) => record.year))].sort((a, b) => b - a)
}

export function getAvailableRegions(records = SALES_RECORDS): RegionName[] {
  return [...new Set(records.map((record) => record.region))].sort((a, b) =>
    a.localeCompare(b, 'es')
  ) as RegionName[]
}

export function filterSalesRecords(records: SalesRecord[], filters: SalesFilters): SalesRecord[] {
  const search = filters.search.trim().toLowerCase()
  return records.filter((record) => {
    if (filters.year !== 'all' && record.year !== filters.year) return false
    if (filters.quarter !== 'all' && record.quarter !== filters.quarter) return false
    if (filters.regions.length > 0 && !filters.regions.includes(record.region)) return false
    if (search.length > 0 && !record.region.toLowerCase().includes(search)) return false
    return true
  })
}

export function buildRegionQuarterRows(records: SalesRecord[]): RegionQuarterRow[] {
  const rows = new Map<RegionName, RegionQuarterRow>()

  for (const record of records) {
    if (!rows.has(record.region)) {
      rows.set(record.region, {
        region: record.region,
        q1: 0,
        q2: 0,
        q3: 0,
        q4: 0,
        total: 0,
        orders: 0,
        avgTicket: 0,
      })
    }

    const row = rows.get(record.region)
    if (!row) continue

    const quarterKey = quarterToField[record.quarter]
    row[quarterKey] += record.revenue
    row.total += record.revenue
    row.orders += record.orders
    row.avgTicket = row.orders === 0 ? 0 : Math.round(row.total / row.orders)
  }

  return [...rows.values()].sort((a, b) => b.total - a.total)
}

export function buildQuarterSeries(records: SalesRecord[]): Array<{ quarter: Quarter; revenue: number }> {
  return QUARTERS.map((quarter) => ({
    quarter,
    revenue: records
      .filter((record) => record.quarter === quarter)
      .reduce((sum, record) => sum + record.revenue, 0),
  }))
}

export function getRegionDetail(
  region: RegionName,
  records: SalesRecord[]
): Array<{ quarter: Quarter; revenue: number; orders: number }> {
  return QUARTERS.map((quarter) => {
    const quarterRecords = records.filter(
      (record) => record.region === region && record.quarter === quarter
    )
    return {
      quarter,
      revenue: quarterRecords.reduce((sum, record) => sum + record.revenue, 0),
      orders: quarterRecords.reduce((sum, record) => sum + record.orders, 0),
    }
  })
}
