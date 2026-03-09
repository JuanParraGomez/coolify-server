export type Sale = {
  id: string;
  date: string; // ISO date string
  region: string;
  amount: number;
  category: string;
  product: string;
};

export const REGIONS = ['North', 'South', 'East', 'West', 'Central'] as const;
export const CATEGORIES = ['Electronics', 'Clothing', 'Home', 'Sports'] as const;

export type Filters = {
  startDate?: string; // ISO date
  endDate?: string; // ISO date
  regions?: string[];
  minAmount?: number;
  maxAmount?: number;
  category?: string | null;
  search?: string;
};

export const defaultFilters: Filters = {
  startDate: undefined,
  endDate: undefined,
  regions: [],
  minAmount: undefined,
  maxAmount: undefined,
  category: null,
  search: undefined,
};

function randomBetween(min: number, max: number) {
  return Math.random() * (max - min) + min;
}

const sampleProducts = [
  'Widget A',
  'Gadget B',
  'Thingamajig C',
  'Accessory D',
  'Device E',
];

export function generateMockSales(count = 200): Sale[] {
  const sales: Sale[] = [];
  const now = Date.now();
  const msInDay = 24 * 60 * 60 * 1000;
  for (let i = 0; i < count; i++) {
    const daysAgo = Math.floor(Math.random() * 180); // within last 6 months
    const date = new Date(now - daysAgo * msInDay);
    const region = REGIONS[Math.floor(Math.random() * REGIONS.length)];
    const category = CATEGORIES[Math.floor(Math.random() * CATEGORIES.length)];
    const product = sampleProducts[Math.floor(Math.random() * sampleProducts.length)];
    const amount = Math.round(randomBetween(20, 2000) * 100) / 100;
    sales.push({
      id: `${i + 1}`,
      date: date.toISOString().slice(0, 10),
      region,
      category,
      product,
      amount,
    });
  }
  return sales;
}

export function filterSales(sales: Sale[], filters: Filters): Sale[] {
  return sales.filter((s) => {
    if (filters.startDate && s.date < filters.startDate) return false;
    if (filters.endDate && s.date > filters.endDate) return false;
    if (filters.regions && filters.regions.length > 0 && !filters.regions.includes(s.region)) return false;
    if (typeof filters.minAmount === 'number' && s.amount < filters.minAmount) return false;
    if (typeof filters.maxAmount === 'number' && s.amount > filters.maxAmount) return false;
    if (filters.category && filters.category !== s.category) return false;
    if (filters.search) {
      const q = filters.search.toLowerCase();
      if (!s.product.toLowerCase().includes(q) && !s.category.toLowerCase().includes(q)) return false;
    }
    return true;
  });
}

export type RegionAggregate = {
  region: string;
  totalSales: number;
  transactions: number;
};

export function aggregateByRegion(sales: Sale[]): RegionAggregate[] {
  const map = new Map<string, RegionAggregate>();
  sales.forEach((s) => {
    const cur = map.get(s.region) || { region: s.region, totalSales: 0, transactions: 0 };
    cur.totalSales += s.amount;
    cur.transactions += 1;
    map.set(s.region, cur);
  });
  return Array.from(map.values()).sort((a, b) => b.totalSales - a.totalSales);
}
