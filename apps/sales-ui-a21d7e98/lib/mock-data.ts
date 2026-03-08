export type SaleRecord = {
  id: string;
  region: string;
  date: string; // ISO date
  amount: number; // total sales amount for that record
  orders: number;
  product?: string;
};

export const REGIONS = [
  'Norte',
  'Sur',
  'Este',
  'Oeste',
  'Central',
];

function randRange(min: number, max: number) {
  return Math.round((Math.random() * (max - min) + min) * 100) / 100;
}

function fmtDate(d: Date) {
  return d.toISOString().slice(0, 10);
}

// Generate mock sales records distributed across regions and months
export function generateMockSales(options?: {
  months?: number;
  perMonth?: number;
  startDate?: string; // ISO date string
}) {
  const months = options?.months ?? 6;
  const perMonth = options?.perMonth ?? 30;
  const start = options?.startDate ? new Date(options.startDate) : new Date();
  const sales: SaleRecord[] = [];
  for (let m = 0; m < months; m++) {
    const monthDate = new Date(start.getFullYear(), start.getMonth() - (months - 1 - m), 1);
    for (let i = 0; i < perMonth; i++) {
      const region = REGIONS[Math.floor(Math.random() * REGIONS.length)];
      const day = Math.floor(Math.random() * 28) + 1;
      const date = new Date(monthDate.getFullYear(), monthDate.getMonth(), day);
      const orders = Math.max(1, Math.floor(randRange(1, 6)));
      const amount = Math.round((orders * randRange(50, 1200)) * 100) / 100;
      sales.push({
        id: `${m}-${i}-${region}-${date.getTime()}`,
        region,
        date: fmtDate(date),
        amount,
        orders,
        product: ['Widget A', 'Widget B', 'Service X'][Math.floor(Math.random() * 3)],
      });
    }
  }
  // sort by date asc
  sales.sort((a, b) => a.date.localeCompare(b.date));
  return sales;
}

export type SalesFilters = {
  region?: string | 'All';
  from?: string; // ISO date
  to?: string; // ISO date
};

export type AggregatedRegion = {
  region: string;
  totalSales: number;
  totalOrders: number;
  avgOrderValue: number;
  timeseries: { date: string; sales: number }[];
};

export function aggregateByRegion(sales: SaleRecord[], filters?: SalesFilters) {
  const from = filters?.from;
  const to = filters?.to;
  const regionFilter = filters?.region && filters.region !== 'All' ? filters.region : undefined;

  // filter
  const filtered = sales.filter((s) => {
    if (regionFilter && s.region !== regionFilter) return false;
    if (from && s.date < from) return false;
    if (to && s.date > to) return false;
    return true;
  });

  const map = new Map<string, AggregatedRegion>();

  // collect unique dates sorted
  const dateSet = new Set<string>();
  filtered.forEach((s) => dateSet.add(s.date));
  const dates = Array.from(dateSet).sort();

  for (const r of REGIONS) {
    map.set(r, { region: r, totalSales: 0, totalOrders: 0, avgOrderValue: 0, timeseries: dates.map((d) => ({ date: d, sales: 0 })) });
  }

  for (const s of filtered) {
    const agg = map.get(s.region)!;
    agg.totalSales += s.amount;
    agg.totalOrders += s.orders;
    const point = agg.timeseries.find((p) => p.date === s.date);
    if (point) point.sales += s.amount;
  }

  const result = Array.from(map.values()).map((agg) => {
    agg.avgOrderValue = agg.totalOrders ? Math.round((agg.totalSales / agg.totalOrders) * 100) / 100 : 0;
    return agg;
  });

  // sort by totalSales desc
  result.sort((a, b) => b.totalSales - a.totalSales);
  return result;
}

export const sampleFilters: SalesFilters = {
  region: 'All',
};
