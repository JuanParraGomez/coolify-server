"use client";

import React, { useMemo, useState } from 'react';
import FiltersPanel from '../components/filters-panel';
import RegionChart from '../components/region-chart';
import RegionTable from '../components/region-table';
import generateMockSales, { SaleRecord } from '../lib/mock-data';

export default function Page() {
  // generate mock data once per page lifecycle
  const [data] = useState<SaleRecord[]>(() => generateMockSales(300));

  const [filters, setFilters] = useState({
    region: null as string | null,
    category: null as string | null,
    startDate: null as string | null,
    endDate: null as string | null,
    minAmount: 0 as number | null,
    q: '' as string,
  });

  const setPartialFilters = (partial: Partial<typeof filters>) =>
    setFilters((s) => ({ ...s, ...partial }));

  const filtered = useMemo(() => {
    return data.filter((d) => {
      if (filters.region && d.region !== filters.region) return false;
      if (filters.category && d.category !== filters.category) return false;
      if (filters.startDate && d.date < filters.startDate) return false;
      if (filters.endDate && d.date > filters.endDate) return false;
      if (filters.minAmount && d.amount < (filters.minAmount || 0)) return false;
      if (filters.q && !d.salesperson.toLowerCase().includes(filters.q.toLowerCase())) return false;
      return true;
    });
  }, [data, filters]);

  return (
    <div style={{ display: 'flex', gap: 16 }}>
      <FiltersPanel data={data} filters={filters as any} setFilters={setPartialFilters} />

      <div style={{ flex: 1 }}>
        <RegionChart data={filtered} width={900} height={360} />

        <div style={{ marginTop: 16 }}>
          <RegionTable data={filtered} />
        </div>
      </div>
    </div>
  );
}
