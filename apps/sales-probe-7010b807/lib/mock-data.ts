export type SaleRecord = {
  id: string;
  date: string; // ISO date
  region: string;
  category: string;
  amount: number; // total sale amount in USD
  units: number;
  salesperson: string;
};

export const REGIONS = ["North", "South", "East", "West"] as const;
export const CATEGORIES = ["Electronics", "Furniture", "Accessories"] as const;

function randBetween(min: number, max: number) {
  return Math.random() * (max - min) + min;
}

function randInt(min: number, max: number) {
  return Math.floor(randBetween(min, max + 1));
}

function isoDateDaysAgo(days: number) {
  const d = new Date();
  d.setDate(d.getDate() - days);
  return d.toISOString().slice(0, 10);
}

export function generateMockSales(count = 200): SaleRecord[] {
  const sales: SaleRecord[] = [];
  for (let i = 0; i < count; i++) {
    const region = REGIONS[randInt(0, REGIONS.length - 1)];
    const category = CATEGORIES[randInt(0, CATEGORIES.length - 1)];
    const units = randInt(1, 10);
    const amount = Number((units * randBetween(20, 1200)).toFixed(2));
    const daysAgo = randInt(0, 365);
    sales.push({
      id: `s_${i}_${Date.now().toString().slice(-5)}`,
      date: isoDateDaysAgo(daysAgo),
      region,
      category,
      amount,
      units,
      salesperson: [`Alex`, `Sam`, `Jordan`, `Taylor`, `Casey`][randInt(0, 4)],
    });
  }
  return sales;
}

export function aggregateByRegion(data: SaleRecord[]) {
  const map: Record<string, { region: string; totalSales: number; units: number; salesCount: number }> = {};
  for (const r of data) {
    if (!map[r.region]) map[r.region] = { region: r.region, totalSales: 0, units: 0, salesCount: 0 };
    map[r.region].totalSales += r.amount;
    map[r.region].units += r.units;
    map[r.region].salesCount += 1;
  }
  return Object.values(map).map(item => ({
    ...item,
    avgSale: item.salesCount ? +(item.totalSales / item.salesCount).toFixed(2) : 0,
  }));
}

export default generateMockSales;
