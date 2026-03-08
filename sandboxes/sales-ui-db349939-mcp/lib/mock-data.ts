export type SalesEntry = {
  id: string;
  date: string; // ISO date
  region: string;
  product: string;
  amount: number;
};

export const REGIONS = ['North', 'South', 'East', 'West'] as const;
export const PRODUCTS = ['Widget A', 'Widget B', 'Widget C'] as const;

function mulberry32(a: number) {
  return function () {
    let t = (a += 0x6d2b79f5);
    t = Math.imul(t ^ (t >>> 15), t | 1);
    t ^= t + Math.imul(t ^ (t >>> 7), t | 61);
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

export function generateMockSales(count = 120, seed = 42): SalesEntry[] {
  const r = mulberry32(seed);
  const start = new Date('2025-01-01T00:00:00.000Z').getTime();
  const dayMs = 24 * 60 * 60 * 1000;
  const entries: SalesEntry[] = [];
  for (let i = 0; i < count; i++) {
    const days = Math.floor(r() * 365);
    const date = new Date(start + days * dayMs + Math.floor(r() * dayMs));
    const region = REGIONS[Math.floor(r() * REGIONS.length)];
    const product = PRODUCTS[Math.floor(r() * PRODUCTS.length)];
    const amount = Math.round((50 + r() * 1950) * 100) / 100;
    entries.push({ id: `s-${i + 1}`, date: date.toISOString(), region, product, amount });
  }
  return entries;
}

export const MOCK_SALES = generateMockSales();
