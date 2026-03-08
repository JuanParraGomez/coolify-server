export type RegionSales = {
  region: string;
  totalSales: number;
  monthly: { month: string; sales: number }[];
};

export const REGIONS = [
  'North America',
  'Europe',
  'Asia',
  'Latin America',
  'Africa',
  'Oceania',
];

export const MONTHS = (() => {
  const m: string[] = [];
  const d = new Date();
  for (let i = 11; i >= 0; i--) {
    const dt = new Date(d.getFullYear(), d.getMonth() - i, 1);
    m.push(dt.toISOString().slice(0, 7)); // YYYY-MM
  }
  return m;
})();

function seededRandom(seed: number) {
  return () => {
    seed = (seed * 9301 + 49297) % 233280;
    return seed / 233280;
  };
}

export function generateMockData(seed = 42): RegionSales[] {
  const rand = seededRandom(seed);
  return REGIONS.map((region, idx) => {
    const monthly = MONTHS.map((month) => {
      // base varies a bit by region and index so numbers are realistic and varied
      const base = 20000 + (idx * 5000);
      const variance = 0.6 + (rand() * 1.2);
      const sales = Math.round(base * variance * (1 + (rand() - 0.5) * 0.4));
      return { month, sales };
    });
    const totalSales = monthly.reduce((s, m) => s + m.sales, 0);
    return { region, totalSales, monthly };
  });
}
