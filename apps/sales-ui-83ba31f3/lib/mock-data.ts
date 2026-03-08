export type RegionSale = {
  region: string;
  sales: number;
  orders: number;
  avgOrder: number;
  month: string; // format YYYY-MM
};

export const REGIONS = [
  'North',
  'South',
  'East',
  'West',
  'Central',
  'International',
];

// Generate deterministic-ish mock data for the last N months
export function generateMockData(months = 6): RegionSale[] {
  const data: RegionSale[] = [];
  const now = new Date();

  for (let m = 0; m < months; m++) {
    const d = new Date(now.getFullYear(), now.getMonth() - m, 1);
    const monthStr = `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}`;

    for (const region of REGIONS) {
      // simple seeded-ish pseudo-random by region+month index to make values stable across runs in one process
      const seed = region.length * (m + 1) + d.getMonth();
      const orders = Math.max(5, Math.floor(((seed * 37) % 300) + Math.random() * 50));
      const avg = Math.round((20 + ((seed * 17) % 300) / 10 + Math.random() * 50) * 100) / 100;
      const sales = Math.round(orders * avg * 100) / 100;

      data.push({ region, sales, orders, avgOrder: avg, month: monthStr });
    }
  }

  return data;
}

export function getAvailableMonths(data: RegionSale[]): string[] {
  const set = new Set<string>();
  for (const r of data) set.add(r.month);
  return Array.from(set).sort().reverse();
}

export function filterData(
  data: RegionSale[],
  filters: { region?: string | 'all'; month?: string | 'all'; minSales?: number }
): RegionSale[] {
  return data.filter((d) => {
    if (filters.region && filters.region !== 'all' && d.region !== filters.region) return false;
    if (filters.month && filters.month !== 'all' && d.month !== filters.month) return false;
    if (filters.minSales && d.sales < filters.minSales) return false;
    return true;
  });
}

export function aggregateByRegion(data: RegionSale[]) {
  const map = new Map<string, { region: string; sales: number; orders: number }>();
  for (const d of data) {
    const cur = map.get(d.region) || { region: d.region, sales: 0, orders: 0 };
    cur.sales += d.sales;
    cur.orders += d.orders;
    map.set(d.region, cur);
  }
  return Array.from(map.values()).map((v) => ({
    ...v,
    avgOrder: v.orders ? Math.round((v.sales / v.orders) * 100) / 100 : 0,
  }));
}
