export type RegionSales = {
  id: string;
  region: string;
  country?: string;
  sales: number;
  month: string; // YYYY-MM
};

function randBetween(min: number, max: number) {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

export function generateMockSales(regions: string[] = ['North', 'South', 'East', 'West'], months = 12) : RegionSales[] {
  const now = new Date();
  const out: RegionSales[] = [];
  for (let m = months - 1; m >= 0; m--) {
    const d = new Date(now.getFullYear(), now.getMonth() - m, 1);
    const month = d.toISOString().slice(0,7); // YYYY-MM
    regions.forEach((region, idx) => {
      const base = 20000 + idx * 5000;
      const variance = randBetween(-8000, 15000);
      const sales = Math.max(0, base + variance + randBetween(0, 5000));
      out.push({
        id: `${region}-${month}`,
        region,
        country: undefined,
        sales,
        month,
      });
    });
  }
  return out;
}

export const SAMPLE_REGIONS = ['North','South','East','West'];
export const SAMPLE_SALES = generateMockSales(SAMPLE_REGIONS, 12);
