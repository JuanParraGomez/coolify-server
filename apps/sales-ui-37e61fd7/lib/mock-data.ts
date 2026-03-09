export type RegionData = {
  id: string;
  region: string;
  countries: string[];
  totalSales: number;
  salesByMonth: number[]; // last 12 months
};

export type Filters = {
  region?: string; // region name or 'All'
  minSales?: number;
  maxSales?: number;
  lastNMonths?: number; // how many months to include from the end (1-12)
};

const REGIONS = [
  'North America',
  'Europe',
  'Asia',
  'South America',
  'Africa',
  'Oceania',
];

function rand(min: number, max: number) {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

export function getRegions(): string[] {
  return [...REGIONS];
}

export function generateMockData(seed = 1): RegionData[] {
  // deterministic-ish using seed by advancing Math.random via simple loop
  for (let i = 0; i < seed; i++) Math.random();

  return REGIONS.map((region, idx) => {
    const countriesCount = rand(3, 15);
    const countries = Array.from({ length: countriesCount }, (_, i) => `${region.split(' ')[0]}-Country-${i + 1}`);
    const salesByMonth = Array.from({ length: 12 }, () => rand(5000, 50000));
    const totalSales = salesByMonth.reduce((a, b) => a + b, 0);

    return {
      id: `r-${idx}`,
      region,
      countries,
      totalSales,
      salesByMonth,
    };
  });
}

export function filterRegions(data: RegionData[], filters: Filters): RegionData[] {
  return data.filter((row) => {
    if (filters.region && filters.region !== 'All' && row.region !== filters.region) return false;
    if (typeof filters.minSales === 'number' && row.totalSales < filters.minSales) return false;
    if (typeof filters.maxSales === 'number' && row.totalSales > filters.maxSales) return false;
    if (filters.lastNMonths && filters.lastNMonths > 0 && filters.lastNMonths <= 12) {
      const months = row.salesByMonth.slice(-filters.lastNMonths);
      const recentTotal = months.reduce((a, b) => a + b, 0);
      // use recent total as a simple filter threshold: require recentTotal to be >= minSales if present
      if (typeof filters.minSales === 'number' && recentTotal < filters.minSales) return false;
    }
    return true;
  });
}
