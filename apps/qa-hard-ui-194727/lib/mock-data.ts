export const QUARTERS = ["Q1", "Q2", "Q3", "Q4"] as const
export const DASHBOARD_VIEWS = ["summary", "detail"] as const

export type Quarter = (typeof QUARTERS)[number]
export type DashboardView = (typeof DASHBOARD_VIEWS)[number]
export type YearFilter = number | "all"
export type QuarterFilter = Quarter | "all"

export interface SalesRecord {
  id: string
  region: string
  year: number
  quarter: Quarter
  revenue: number
  orders: number
}

export interface SalesFilters {
  selectedRegions: string[]
  selectedYear: YearFilter
  selectedQuarter: QuarterFilter
  minRevenue: number
  view: DashboardView
  selectedRegion: string | null
}

export interface RegionComparisonRow {
  region: string
  quarterRevenue: Record<Quarter, number>
  totalRevenue: number
  previousYearTotalRevenue: number
  growthVsPreviousYearPct: number | null
}

const REGION_BASELINES = [
  { region: "North America", revenue: 1_280_000, orders: 3_200 },
  { region: "Europe", revenue: 1_040_000, orders: 2_850 },
  { region: "APAC", revenue: 960_000, orders: 2_700 },
  { region: "LATAM", revenue: 720_000, orders: 2_350 },
]

const YEARS = [2023, 2024, 2025]
const QUARTER_WEIGHTS = [0.88, 1.02, 1.08, 1.22]

function round(value: number): number {
  return Math.round(value)
}

function createRecord(
  region: string,
  year: number,
  quarter: Quarter,
  revenue: number,
  orders: number,
): SalesRecord {
  return {
    id: `${region}-${year}-${quarter}`.toLowerCase().replace(/\s+/g, "-"),
    region,
    year,
    quarter,
    revenue: round(revenue),
    orders: round(orders),
  }
}

function buildMockSalesData(): SalesRecord[] {
  const records: SalesRecord[] = []

  for (let regionIndex = 0; regionIndex < REGION_BASELINES.length; regionIndex += 1) {
    const baseline = REGION_BASELINES[regionIndex]

    for (let yearIndex = 0; yearIndex < YEARS.length; yearIndex += 1) {
      const year = YEARS[yearIndex]
      const yearGrowth = 1 + yearIndex * 0.09
      const regionGrowth = 1 + regionIndex * 0.03

      for (let quarterIndex = 0; quarterIndex < QUARTERS.length; quarterIndex += 1) {
        const quarter = QUARTERS[quarterIndex]
        const quarterWeight = QUARTER_WEIGHTS[quarterIndex]
        const revenue = baseline.revenue * yearGrowth * regionGrowth * quarterWeight
        const orders =
          baseline.orders * (1 + yearIndex * 0.05) * (1 + quarterIndex * 0.03) * (1 + regionIndex * 0.015)

        records.push(createRecord(baseline.region, year, quarter, revenue, orders))
      }
    }
  }

  return records
}

export const salesMockData = buildMockSalesData()

export const defaultSalesFilters: SalesFilters = {
  selectedRegions: [],
  selectedYear: "all",
  selectedQuarter: "all",
  minRevenue: 0,
  view: "summary",
  selectedRegion: null,
}

export function getAvailableRegions(records: SalesRecord[]): string[] {
  return Array.from(new Set(records.map((record) => record.region))).sort((a, b) => a.localeCompare(b))
}

export function getAvailableYears(records: SalesRecord[]): number[] {
  return Array.from(new Set(records.map((record) => record.year))).sort((a, b) => b - a)
}

export function applySalesFilters(records: SalesRecord[], filters: SalesFilters): SalesRecord[] {
  return records.filter((record) => {
    const regionMatches =
      filters.selectedRegions.length === 0 || filters.selectedRegions.includes(record.region)
    const yearMatches = filters.selectedYear === "all" || record.year === filters.selectedYear
    const quarterMatches = filters.selectedQuarter === "all" || record.quarter === filters.selectedQuarter
    const minRevenueMatches = record.revenue >= filters.minRevenue
    const detailRegionMatches =
      filters.view !== "detail" || !filters.selectedRegion || record.region === filters.selectedRegion

    return regionMatches && yearMatches && quarterMatches && minRevenueMatches && detailRegionMatches
  })
}

export function getRegionComparisonRows(records: SalesRecord[], year: number): RegionComparisonRow[] {
  const regions = getAvailableRegions(records)
  const previousYear = year - 1

  return regions
    .map((region) => {
      const currentYearRecords = records.filter((record) => record.region === region && record.year === year)
      const previousYearRecords = records.filter(
        (record) => record.region === region && record.year === previousYear,
      )

      const quarterRevenue = QUARTERS.reduce(
        (acc, quarter) => {
          acc[quarter] = currentYearRecords
            .filter((record) => record.quarter === quarter)
            .reduce((total, record) => total + record.revenue, 0)
          return acc
        },
        { Q1: 0, Q2: 0, Q3: 0, Q4: 0 } as Record<Quarter, number>,
      )

      const totalRevenue =
        quarterRevenue.Q1 + quarterRevenue.Q2 + quarterRevenue.Q3 + quarterRevenue.Q4
      const previousYearTotalRevenue = previousYearRecords.reduce((total, record) => total + record.revenue, 0)
      const growthVsPreviousYearPct =
        previousYearTotalRevenue === 0 ? null : ((totalRevenue - previousYearTotalRevenue) / previousYearTotalRevenue) * 100

      return {
        region,
        quarterRevenue,
        totalRevenue,
        previousYearTotalRevenue,
        growthVsPreviousYearPct,
      }
    })
    .sort((a, b) => b.totalRevenue - a.totalRevenue)
}

export function getRegionRevenueSummary(records: SalesRecord[]): Array<{ region: string; revenue: number }> {
  const totals = new Map<string, number>()

  for (const record of records) {
    totals.set(record.region, (totals.get(record.region) ?? 0) + record.revenue)
  }

  return Array.from(totals, ([region, revenue]) => ({ region, revenue }))
    .sort((a, b) => b.revenue - a.revenue)
}
