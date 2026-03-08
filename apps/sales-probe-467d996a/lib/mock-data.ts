export type RegionSales = {
  region: string;
  totalSales: number;
  monthly: number[]; // last 12 months, most recent last
  categoryBreakdown: Record<string, number>;
  lastUpdated: string; // ISO date
};

export const REGIONS = ['North', 'South', 'East', 'West', 'Central'] as const;
export const CATEGORIES = ['Electronics', 'Furniture', 'Clothing', 'Food'] as const;

function randInt(min: number, max: number) {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

function makeMonthly(base: number) {
  const months = Array.from({ length: 12 }, (_, i) => {
    // small seasonal variation
    const seasonal = Math.round(base * (0.85 + 0.3 * Math.sin((i / 12) * Math.PI * 2)));
    return Math.max(0, seasonal + randInt(-Math.round(base * 0.15), Math.round(base * 0.15)));
  });
  return months;
}

export function generateMockData(): RegionSales[] {
  const regions = Array.from(REGIONS);
  return regions.map((r, idx) => {
    const base = randInt(30_000, 200_000) * (1 + idx * 0.1);
    const monthly = makeMonthly(base / 12).map(Math.round);
    const categoryBreakdown: Record<string, number> = {};
    const cats = Array.from(CATEGORIES);
    // distribute totals across categories
    let remaining = Math.round(monthly.reduce((a, b) => a + b, 0));
    for (let i = 0; i < cats.length; i++) {
      const take = i === cats.length - 1 ? remaining : Math.round(remaining * (0.2 + Math.random() * 0.5));
      categoryBreakdown[cats[i]] = take;
      remaining -= take;
    }

    const totalSales = Object.values(categoryBreakdown).reduce((a, b) => a + b, 0);
    return {
      region: r,
      monthly,
      categoryBreakdown,
      totalSales,
      lastUpdated: new Date().toISOString(),
    };
  });
}

export type SalesFilter = {
  regions?: string[];
  category?: string | null;
  minTotal?: number | null;
};

export function filterSales(data: RegionSales[], filter: SalesFilter): RegionSales[] {
  return data
    .filter((d) => {
      if (filter.regions && filter.regions.length) {
        if (!filter.regions.includes(d.region)) return false;
      }
      if (filter.minTotal != null) {
        if (d.totalSales < filter.minTotal) return false;
      }
      return true;
    })
    .map((d) => {
      if (!filter.category) return d;
      // when category filter is applied, put totalSales as that category's contribution and keep monthly scaled
      const catVal = d.categoryBreakdown[filter.category] ?? 0;
      // For simplicity, keep monthly as proportionally scaled to overall monthly values
      const totalMonthly = d.monthly.reduce((a, b) => a + b, 0) || 1;
      const factor = catVal / totalMonthly;
      return {
        ...d,
        totalSales: Math.round(catVal),
        monthly: d.monthly.map((m) => Math.round(m * factor)),
        categoryBreakdown: { [filter.category]: catVal },
      } as RegionSales;
    });
}
