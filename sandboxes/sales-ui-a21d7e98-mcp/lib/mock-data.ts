export type Sale = {
  id: string;
  region: string;
  product: string;
  amount: number;
  date: string; // ISO date
};

export type Filters = {
  regions?: string[];
  dateFrom?: string | null;
  dateTo?: string | null;
  minAmount?: number | null;
};

const REGIONS = ["North", "South", "East", "West", "Central"];
const PRODUCTS = ["Widgets", "Gadgets", "Doohickeys", "Thingamajigs"];

function randInt(min: number, max: number) {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

function randDateWithinYear() {
  const now = new Date();
  const past = new Date();
  past.setFullYear(now.getFullYear() - 1);
  const t = randInt(past.getTime(), now.getTime());
  return new Date(t).toISOString();
}

export function generateMockSales(count = 200): Sale[] {
  const list: Sale[] = [];
  for (let i = 0; i < count; i++) {
    list.push({
      id: `sale_${i}`,
      region: REGIONS[randInt(0, REGIONS.length - 1)],
      product: PRODUCTS[randInt(0, PRODUCTS.length - 1)],
      amount: Number((Math.random() * 10000).toFixed(2)),
      date: randDateWithinYear(),
    });
  }
  return list;
}

export function filterSales(sales: Sale[], filters: Filters) {
  return sales.filter((s) => {
    if (filters.regions && filters.regions.length > 0 && !filters.regions.includes(s.region)) return false;
    if (filters.minAmount != null && s.amount < filters.minAmount) return false;
    if (filters.dateFrom) {
      if (new Date(s.date) < new Date(filters.dateFrom)) return false;
    }
    if (filters.dateTo) {
      if (new Date(s.date) > new Date(filters.dateTo)) return false;
    }
    return true;
  });
}

export function aggregateByRegion(sales: Sale[]) {
  const map = new Map<string, { region: string; total: number; count: number }>();
  for (const s of sales) {
    const existing = map.get(s.region);
    if (existing) {
      existing.total += s.amount;
      existing.count += 1;
    } else {
      map.set(s.region, { region: s.region, total: s.amount, count: 1 });
    }
  }
  return Array.from(map.values()).sort((a, b) => b.total - a.total);
}

export const AVAILABLE_REGIONS = REGIONS;
