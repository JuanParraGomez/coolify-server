export type Region = 'North' | 'South' | 'East' | 'West' | 'Central'

export type Category = 'Electronics' | 'Clothing' | 'Food' | 'Home' | 'Sports'

export interface SaleRecord {
  id: string
  region: Region
  category: Category
  month: string // "YYYY-MM"
  revenue: number
  units: number
  target: number
}

export interface RegionSummary {
  region: Region
  totalRevenue: number
  totalUnits: number
  totalTarget: number
  achievementPct: number
  topCategory: Category
  records: SaleRecord[]
}

export type FilterState = {
  regions: Region[]
  categories: Category[]
  months: string[]
}

export const ALL_REGIONS: Region[] = ['North', 'South', 'East', 'West', 'Central']
export const ALL_CATEGORIES: Category[] = ['Electronics', 'Clothing', 'Food', 'Home', 'Sports']
export const ALL_MONTHS: string[] = [
  '2024-01', '2024-02', '2024-03', '2024-04',
  '2024-05', '2024-06', '2024-07', '2024-08',
  '2024-09', '2024-10', '2024-11', '2024-12',
]

const BASE_REVENUES: Record<Region, Record<Category, number>> = {
  North:   { Electronics: 120000, Clothing: 45000, Food: 30000, Home: 55000, Sports: 40000 },
  South:   { Electronics: 95000,  Clothing: 60000, Food: 50000, Home: 40000, Sports: 35000 },
  East:    { Electronics: 150000, Clothing: 35000, Food: 25000, Home: 70000, Sports: 50000 },
  West:    { Electronics: 110000, Clothing: 55000, Food: 45000, Home: 60000, Sports: 65000 },
  Central: { Electronics: 80000,  Clothing: 40000, Food: 60000, Home: 35000, Sports: 30000 },
}

const SEASONAL_MULTIPLIER: Record<string, number> = {
  '2024-01': 0.80, '2024-02': 0.85, '2024-03': 0.95,
  '2024-04': 1.00, '2024-05': 1.05, '2024-06': 1.10,
  '2024-07': 1.08, '2024-08': 1.12, '2024-09': 1.05,
  '2024-10': 1.10, '2024-11': 1.35, '2024-12': 1.50,
}

function seededRand(seed: number): number {
  const x = Math.sin(seed) * 10000
  return x - Math.floor(x)
}

let idCounter = 0

export const MOCK_SALES: SaleRecord[] = ALL_MONTHS.flatMap((month, mIdx) =>
  ALL_REGIONS.flatMap((region, rIdx) =>
    ALL_CATEGORIES.map((category, cIdx) => {
      const base = BASE_REVENUES[region][category]
      const seasonal = SEASONAL_MULTIPLIER[month]
      const noise = 0.85 + seededRand(mIdx * 100 + rIdx * 10 + cIdx) * 0.30
      const revenue = Math.round(base * seasonal * noise)
      const units = Math.round(revenue / (base / 1000))
      const target = Math.round(base * seasonal * 1.05)
      return {
        id: `sale-${++idCounter}`,
        region,
        category,
        month,
        revenue,
        units,
        target,
      }
    })
  )
)

export function getFilteredSales(filters: FilterState): SaleRecord[] {
  return MOCK_SALES.filter(
    (s) =>
      filters.regions.includes(s.region) &&
      filters.categories.includes(s.category) &&
      filters.months.includes(s.month)
  )
}

export function buildRegionSummaries(records: SaleRecord[]): RegionSummary[] {
  const map = new Map<Region, SaleRecord[]>()
  for (const r of records) {
    if (!map.has(r.region)) map.set(r.region, [])
    map.get(r.region)!.push(r)
  }

  return Array.from(map.entries()).map(([region, recs]) => {
    const totalRevenue = recs.reduce((s, r) => s + r.revenue, 0)
    const totalUnits = recs.reduce((s, r) => s + r.units, 0)
    const totalTarget = recs.reduce((s, r) => s + r.target, 0)
    const achievementPct = totalTarget > 0 ? Math.round((totalRevenue / totalTarget) * 100) : 0

    const byCat = new Map<Category, number>()
    for (const r of recs) byCat.set(r.category, (byCat.get(r.category) ?? 0) + r.revenue)
    const topCategory = [...byCat.entries()].sort((a, b) => b[1] - a[1])[0][0]

    return { region, totalRevenue, totalUnits, totalTarget, achievementPct, topCategory, records: recs }
  })
}

export const DEFAULT_FILTERS: FilterState = {
  regions: [...ALL_REGIONS],
  categories: [...ALL_CATEGORIES],
  months: [...ALL_MONTHS],
}
