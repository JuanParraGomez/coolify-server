export const dashboardSections = [
  { id: 'resumen-kpi', label: 'Resumen KPI' },
  { id: 'grafico-regiones', label: 'Gráficos' },
  { id: 'tabla-drilldown', label: 'Tabla con drill-down' },
  { id: 'comparativas-trimestrales', label: 'Comparativas trimestrales' },
] as const

export const quarters = ['Q1', 'Q2', 'Q3', 'Q4'] as const
export const channels = ['Retail', 'Mayorista', 'E-commerce'] as const
export const segments = ['Enterprise', 'Mid-Market', 'SMB'] as const

export type Quarter = (typeof quarters)[number]
export type SalesChannel = (typeof channels)[number]
export type SalesSegment = (typeof segments)[number]

export type SalesRecord = {
  id: string
  region: string
  country: string
  city: string
  year: number
  quarter: Quarter
  channel: SalesChannel
  segment: SalesSegment
  revenue: number
  units: number
  profit: number
}

export type SalesFilterOptions = {
  regions: string[]
  countries: string[]
  channels: SalesChannel[]
  segments: SalesSegment[]
  years: number[]
  quarters: Quarter[]
}

export type SalesFilters = {
  regions: string[]
  countries: string[]
  channels: SalesChannel[]
  segments: SalesSegment[]
  years: number[]
  quarters: Quarter[]
  search: string
  minRevenue: number
  maxRevenue: number | null
  onlyProfitable: boolean
}

export type KpiSummary = {
  totalRevenue: number
  totalProfit: number
  totalUnits: number
  averageTicket: number
  profitMarginPct: number
  quarterOverQuarterPct: number
}

export type QuarterlyComparison = {
  quarter: Quarter
  currentRevenue: number
  previousRevenue: number
  deltaRevenue: number
  deltaPct: number
}

export type CityTableRow = {
  city: string
  revenue: number
  units: number
  profit: number
}

export type CountryTableRow = {
  country: string
  revenue: number
  units: number
  profit: number
  cities: CityTableRow[]
}

export type RegionTableRow = {
  region: string
  revenue: number
  units: number
  profit: number
  deltaPct: number
  countries: CountryTableRow[]
}

export type SalesDashboardState = {
  filters: SalesFilters
  records: SalesRecord[]
  filteredRecords: SalesRecord[]
  kpis: KpiSummary
  quarterlyComparisons: QuarterlyComparison[]
  regionRows: RegionTableRow[]
}

const geography = [
  {
    region: 'Norte',
    countries: [
      { country: 'México', cities: ['Monterrey', 'Tijuana'] },
      { country: 'Estados Unidos', cities: ['Dallas', 'Chicago'] },
    ],
  },
  {
    region: 'Centro',
    countries: [
      { country: 'México', cities: ['Ciudad de México', 'Querétaro'] },
      { country: 'Colombia', cities: ['Bogotá', 'Medellín'] },
    ],
  },
  {
    region: 'Sur',
    countries: [
      { country: 'Chile', cities: ['Santiago', 'Concepción'] },
      { country: 'Perú', cities: ['Lima', 'Arequipa'] },
    ],
  },
  {
    region: 'Internacional',
    countries: [
      { country: 'España', cities: ['Madrid', 'Barcelona'] },
      { country: 'Brasil', cities: ['São Paulo', 'Curitiba'] },
    ],
  },
] as const

const years = [2024, 2025] as const

const quarterSeasonality: Record<Quarter, number> = {
  Q1: 0.88,
  Q2: 0.97,
  Q3: 1.05,
  Q4: 1.13,
}

export const defaultSalesFilters: SalesFilters = {
  regions: [],
  countries: [],
  channels: [],
  segments: [],
  years: [],
  quarters: [],
  search: '',
  minRevenue: 0,
  maxRevenue: null,
  onlyProfitable: false,
}

const compareByLabel = (left: string, right: string) => left.localeCompare(right, 'es')

const asFilterOptions = (records: SalesRecord[]): SalesFilterOptions => ({
  regions: [...new Set(records.map((record) => record.region))].sort(compareByLabel),
  countries: [...new Set(records.map((record) => record.country))].sort(compareByLabel),
  channels: [...new Set(records.map((record) => record.channel))].sort(compareByLabel) as SalesChannel[],
  segments: [...new Set(records.map((record) => record.segment))].sort(compareByLabel) as SalesSegment[],
  years: [...new Set(records.map((record) => record.year))].sort((left, right) => right - left),
  quarters: [...quarters],
})

export const mockSalesData: SalesRecord[] = geography.flatMap((geo, regionIndex) =>
  geo.countries.flatMap((countryBlock, countryIndex) =>
    countryBlock.cities.flatMap((city, cityIndex) =>
      years.flatMap((year, yearIndex) =>
        quarters.map((quarter, quarterIndex) => {
          const channelIndex = (cityIndex + quarterIndex + yearIndex) % channels.length
          const segmentIndex = (regionIndex + countryIndex + quarterIndex) % segments.length
          const baseRevenue =
            180_000 + regionIndex * 42_000 + countryIndex * 24_000 + cityIndex * 13_500
          const yearFactor = 1 + yearIndex * 0.1
          const noise = 1 + ((regionIndex + countryIndex + cityIndex + quarterIndex) % 4) * 0.02
          const revenue = Math.round(baseRevenue * quarterSeasonality[quarter] * yearFactor * noise)
          const units = Math.round(revenue / (780 + segmentIndex * 85 + channelIndex * 45))
          const margin = 0.2 + regionIndex * 0.012 - channelIndex * 0.014 + quarterIndex * 0.009
          const profit = Math.round(revenue * margin)

          return {
            id: `${year}-${quarter}-${geo.region}-${countryBlock.country}-${city}`.toLowerCase(),
            region: geo.region,
            country: countryBlock.country,
            city,
            year,
            quarter,
            channel: channels[channelIndex],
            segment: segments[segmentIndex],
            revenue,
            units,
            profit,
          }
        }),
      ),
    ),
  ),
)

export const salesFilterOptions = asFilterOptions(mockSalesData)

export const applySalesFilters = (
  records: SalesRecord[],
  filters: SalesFilters,
): SalesRecord[] => {
  const normalizedSearch = filters.search.trim().toLowerCase()

  return records.filter((record) => {
    const regionMatch = filters.regions.length === 0 || filters.regions.includes(record.region)
    const countryMatch =
      filters.countries.length === 0 || filters.countries.includes(record.country)
    const channelMatch =
      filters.channels.length === 0 || filters.channels.includes(record.channel)
    const segmentMatch =
      filters.segments.length === 0 || filters.segments.includes(record.segment)
    const yearMatch = filters.years.length === 0 || filters.years.includes(record.year)
    const quarterMatch =
      filters.quarters.length === 0 || filters.quarters.includes(record.quarter)
    const minRevenueMatch = record.revenue >= filters.minRevenue
    const maxRevenueMatch = filters.maxRevenue === null || record.revenue <= filters.maxRevenue
    const profitabilityMatch = !filters.onlyProfitable || record.profit > 0
    const searchMatch =
      normalizedSearch.length === 0 ||
      [record.region, record.country, record.city, record.channel, record.segment]
        .join(' ')
        .toLowerCase()
        .includes(normalizedSearch)

    return (
      regionMatch &&
      countryMatch &&
      channelMatch &&
      segmentMatch &&
      yearMatch &&
      quarterMatch &&
      minRevenueMatch &&
      maxRevenueMatch &&
      profitabilityMatch &&
      searchMatch
    )
  })
}

export const buildKpiSummary = (records: SalesRecord[]): KpiSummary => {
  const totalRevenue = records.reduce((sum, record) => sum + record.revenue, 0)
  const totalProfit = records.reduce((sum, record) => sum + record.profit, 0)
  const totalUnits = records.reduce((sum, record) => sum + record.units, 0)
  const averageTicket = totalUnits > 0 ? totalRevenue / totalUnits : 0
  const profitMarginPct = totalRevenue > 0 ? (totalProfit / totalRevenue) * 100 : 0

  const latestYear = records.reduce((maxYear, record) => Math.max(maxYear, record.year), 0)
  const latestQuarter =
    quarters
      .slice()
      .reverse()
      .find((quarter) => records.some((record) => record.year === latestYear && record.quarter === quarter)) ??
    'Q4'

  const latestQuarterIndex = quarters.indexOf(latestQuarter)
  const previousQuarter = latestQuarterIndex > 0 ? quarters[latestQuarterIndex - 1] : 'Q4'
  const previousQuarterYear = latestQuarterIndex > 0 ? latestYear : latestYear - 1

  const latestQuarterRevenue = records
    .filter((record) => record.year === latestYear && record.quarter === latestQuarter)
    .reduce((sum, record) => sum + record.revenue, 0)

  const previousQuarterRevenue = records
    .filter(
      (record) =>
        record.year === previousQuarterYear && record.quarter === previousQuarter,
    )
    .reduce((sum, record) => sum + record.revenue, 0)

  const quarterOverQuarterPct =
    previousQuarterRevenue > 0
      ? ((latestQuarterRevenue - previousQuarterRevenue) / previousQuarterRevenue) * 100
      : 0

  return {
    totalRevenue,
    totalProfit,
    totalUnits,
    averageTicket,
    profitMarginPct,
    quarterOverQuarterPct,
  }
}

export const buildQuarterlyComparisons = (
  records: SalesRecord[],
  targetYear?: number,
): QuarterlyComparison[] => {
  const activeYear =
    targetYear ?? records.reduce((maxYear, record) => Math.max(maxYear, record.year), 0)
  const previousYear = activeYear - 1

  return quarters.map((quarter) => {
    const currentRevenue = records
      .filter((record) => record.year === activeYear && record.quarter === quarter)
      .reduce((sum, record) => sum + record.revenue, 0)

    const previousRevenue = records
      .filter((record) => record.year === previousYear && record.quarter === quarter)
      .reduce((sum, record) => sum + record.revenue, 0)

    const deltaRevenue = currentRevenue - previousRevenue
    const deltaPct = previousRevenue > 0 ? (deltaRevenue / previousRevenue) * 100 : 0

    return {
      quarter,
      currentRevenue,
      previousRevenue,
      deltaRevenue,
      deltaPct,
    }
  })
}

export const buildRegionTableRows = (
  records: SalesRecord[],
  referenceRecords: SalesRecord[] = mockSalesData,
): RegionTableRow[] => {
  const grouped = new Map<
    string,
    {
      revenue: number
      units: number
      profit: number
      countries: Map<string, { revenue: number; units: number; profit: number; cities: Map<string, CityTableRow> }>
    }
  >()

  records.forEach((record) => {
    if (!grouped.has(record.region)) {
      grouped.set(record.region, {
        revenue: 0,
        units: 0,
        profit: 0,
        countries: new Map(),
      })
    }

    const regionBucket = grouped.get(record.region)!
    regionBucket.revenue += record.revenue
    regionBucket.units += record.units
    regionBucket.profit += record.profit

    if (!regionBucket.countries.has(record.country)) {
      regionBucket.countries.set(record.country, {
        revenue: 0,
        units: 0,
        profit: 0,
        cities: new Map(),
      })
    }

    const countryBucket = regionBucket.countries.get(record.country)!
    countryBucket.revenue += record.revenue
    countryBucket.units += record.units
    countryBucket.profit += record.profit

    if (!countryBucket.cities.has(record.city)) {
      countryBucket.cities.set(record.city, {
        city: record.city,
        revenue: 0,
        units: 0,
        profit: 0,
      })
    }

    const cityBucket = countryBucket.cities.get(record.city)!
    cityBucket.revenue += record.revenue
    cityBucket.units += record.units
    cityBucket.profit += record.profit
  })

  const latestYear = records.reduce((maxYear, record) => Math.max(maxYear, record.year), 0)
  const latestQuarters = new Set(
    records.filter((record) => record.year === latestYear).map((record) => record.quarter),
  )

  return [...grouped.entries()]
    .map(([region, values]) => {
      const currentRevenue = referenceRecords
        .filter(
          (record) =>
            record.region === region &&
            record.year === latestYear &&
            latestQuarters.has(record.quarter),
        )
        .reduce((sum, record) => sum + record.revenue, 0)

      const previousRevenue = referenceRecords
        .filter(
          (record) =>
            record.region === region &&
            record.year === latestYear - 1 &&
            latestQuarters.has(record.quarter),
        )
        .reduce((sum, record) => sum + record.revenue, 0)

      const deltaPct =
        previousRevenue > 0 ? ((currentRevenue - previousRevenue) / previousRevenue) * 100 : 0

      const countries: CountryTableRow[] = [...values.countries.entries()]
        .map(([country, countryValues]) => ({
          country,
          revenue: countryValues.revenue,
          units: countryValues.units,
          profit: countryValues.profit,
          cities: [...countryValues.cities.values()].sort((left, right) => right.revenue - left.revenue),
        }))
        .sort((left, right) => right.revenue - left.revenue)

      return {
        region,
        revenue: values.revenue,
        units: values.units,
        profit: values.profit,
        deltaPct,
        countries,
      }
    })
    .sort((left, right) => right.revenue - left.revenue)
}

export const getSalesFilterOptions = (records: SalesRecord[]): SalesFilterOptions =>
  asFilterOptions(records)

export const buildSalesDashboardState = (
  filters: SalesFilters,
  records: SalesRecord[] = mockSalesData,
): SalesDashboardState => {
  const filteredRecords = applySalesFilters(records, filters)

  return {
    filters,
    records,
    filteredRecords,
    kpis: buildKpiSummary(filteredRecords),
    quarterlyComparisons: buildQuarterlyComparisons(filteredRecords),
    regionRows: buildRegionTableRows(filteredRecords, records),
  }
}
