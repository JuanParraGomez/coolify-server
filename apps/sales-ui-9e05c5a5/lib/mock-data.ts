export type Sale = {
  id: string;
  region: string;
  date: string; // ISO date
  amount: number; // total sale amount
  orders: number;
};

export const REGIONS = ["North", "South", "East", "West", "Central"];

function rand(min: number, max: number) {
  return Math.random() * (max - min) + min;
}

// Generate mock sales for the last `days` days for each region
export function generateMockSales(days = 90, perDayPerRegion = 3): Sale[] {
  const sales: Sale[] = [];
  const now = new Date();
  let idCounter = 1;

  for (let d = 0; d < days; d++) {
    const day = new Date(now);
    day.setDate(now.getDate() - d);
    const iso = day.toISOString().slice(0, 10);

    for (const region of REGIONS) {
      for (let i = 0; i < perDayPerRegion; i++) {
        const amount = Math.round(rand(200, 800) * (1 + (REGIONS.indexOf(region) - 2) * 0.05));
        const orders = Math.max(1, Math.round(amount / rand(80, 250)));
        sales.push({
          id: `s-${idCounter++}`,
          region,
          date: iso,
          amount,
          orders,
        });
      }
    }
  }

  return sales;
}

export type SalesFilters = {
  region?: string | 'All';
  startDate?: string; // ISO date
  endDate?: string; // ISO date
  minAmount?: number;
};

export function filterSales(sales: Sale[], filters: SalesFilters): Sale[] {
  return sales.filter((s) => {
    if (filters.region && filters.region !== 'All' && s.region !== filters.region) return false;
    if (filters.startDate && s.date < filters.startDate) return false;
    if (filters.endDate && s.date > filters.endDate) return false;
    if (filters.minAmount && s.amount < filters.minAmount) return false;
    return true;
  });
}

export type RegionAggregate = {
  region: string;
  total: number;
  orders: number;
  average: number;
};

export function aggregateByRegion(sales: Sale[]): RegionAggregate[] {
  const map: Record<string, { total: number; orders: number; count: number }> = {};

  for (const s of sales) {
    if (!map[s.region]) map[s.region] = { total: 0, orders: 0, count: 0 };
    map[s.region].total += s.amount;
    map[s.region].orders += s.orders;
    map[s.region].count += 1;
  }

  return Object.keys(map).map((region) => {
    const entry = map[region];
    return {
      region,
      total: entry.total,
      orders: entry.orders,
      average: Math.round(entry.total / Math.max(1, entry.count)),
    } as RegionAggregate;
  }).sort((a, b) => b.total - a.total);
}

// Export a ready-to-use dataset for the UI
export const MOCK_SALES = generateMockSales(90, 3);
