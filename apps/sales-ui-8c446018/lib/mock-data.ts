// Mock sales data and simple filtering/aggregation helpers
export type Sale = {
  region: string;
  date: string; // ISO date
  amount: number;
  category: string;
};

export type Filters = {
  region?: string;
  category?: string;
  startDate?: string; // ISO
  endDate?: string; // ISO
};

export type RegionAggregate = {
  region: string;
  total: number;
  monthly: number[]; // last 12 months, oldest->newest
};

export const REGIONS = ['North', 'South', 'East', 'West', 'Central'];
export const CATEGORIES = ['Retail', 'Wholesale', 'Online'];

function isoMonthKey(d: Date) {
  return d.toISOString().slice(0, 7); // YYYY-MM
}

export function generateMockSales(): Sale[] {
  const now = new Date();
  const sales: Sale[] = [];
  const months: string[] = [];
  for (let i = 11; i >= 0; i--) {
    const m = new Date(now.getFullYear(), now.getMonth() - i, 1);
    months.push(isoMonthKey(m));
  }

  for (const region of REGIONS) {
    for (const category of CATEGORIES) {
      for (const monthKey of months) {
        // create 1-3 entries per region/category/month with random amounts
        const entries = Math.floor(Math.random() * 3) + 1;
        for (let e = 0; e < entries; e++) {
          const amount = Math.round((Math.random() * 9000 + 1000) * (1 + (Math.random() - 0.5) * 0.4));
          // make date inside the month
          const [y, m] = monthKey.split('-').map(Number);
          const day = Math.floor(Math.random() * 26) + 1;
          const date = new Date(y, m - 1, day).toISOString();
          sales.push({ region, category, date, amount });
        }
      }
    }
  }
  return sales;
}

// Helper: build last 12 month keys oldest->newest relative to provided reference or now
export function last12MonthKeys(ref?: Date) {
  const now = ref ? new Date(ref) : new Date();
  const keys: string[] = [];
  for (let i = 11; i >= 0; i--) {
    const d = new Date(now.getFullYear(), now.getMonth() - i, 1);
    keys.push(isoMonthKey(d));
  }
  return keys;
}

// Filters raw sales and returns aggregation per region
export function filterAndAggregate(sales: Sale[], filters?: Filters): RegionAggregate[] {
  const keys = last12MonthKeys();
  const start = filters?.startDate ? new Date(filters.startDate) : undefined;
  const end = filters?.endDate ? new Date(filters.endDate) : undefined;

  const byRegion: Record<string, { total: number; monthly: number[] }> = {};
  for (const r of REGIONS) byRegion[r] = { total: 0, monthly: Array(12).fill(0) };

  for (const s of sales) {
    if (filters?.region && s.region !== filters.region) continue;
    if (filters?.category && s.category !== filters.category) continue;
    const d = new Date(s.date);
    if (start && d < start) continue;
    if (end && d > end) continue;
    const monthKey = isoMonthKey(d);
    const monthIndex = keys.indexOf(monthKey);
    // ignore anything out of the 12-month window
    if (monthIndex === -1) continue;
    const bucket = byRegion[s.region] || { total: 0, monthly: Array(12).fill(0) };
    bucket.total += s.amount;
    bucket.monthly[monthIndex] += s.amount;
    byRegion[s.region] = bucket;
  }

  return Object.keys(byRegion).map((region) => ({ region, total: Math.round(byRegion[region].total), monthly: byRegion[region].monthly }));
}
