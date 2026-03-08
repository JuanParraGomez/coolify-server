'use client';

import React, { useMemo, useState } from 'react';
import FiltersPanel, { Filters } from './filters-panel';
import RegionTable from './region-table';
import RegionChart from './region-chart';
import { MOCK_SALES, REGIONS, PRODUCTS, SalesEntry } from '../lib/mock-data';

export default function DashboardShell() {
  // central filters state
  const [filters, setFilters] = useState<Filters>({ region: 'All', product: 'All' });

  // compute filtered entries once and pass to chart/table
  const filteredEntries = useMemo(() => {
    const { region, product, dateFrom, dateTo, minAmount } = filters;
    return MOCK_SALES.filter((e) => {
      if (region && region !== 'All' && e.region !== region) return false;
      if (product && product !== 'All' && e.product !== product) return false;
      if (dateFrom && new Date(e.date) < new Date(dateFrom)) return false;
      if (dateTo && new Date(e.date) > new Date(dateTo + 'T23:59:59')) return false;
      if (minAmount !== undefined && e.amount < minAmount) return false;
      return true;
    });
  }, [filters]);

  return (
    <div style={{ display: 'flex', minHeight: '100vh' }}>
      <aside style={{ width: 320, padding: 20, borderRight: '1px solid #eee', background: '#fff' }}>
        <h2 style={{ marginTop: 0 }}>Sales by Region</h2>
        <FiltersPanel
          regions={['All', ...REGIONS]}
          products={Array.from(PRODUCTS)}
          initial={filters}
          onChange={(f) => setFilters(f)}
        />
      </aside>

      <main style={{ flex: 1, padding: 24 }}>
        <header style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 20 }}>
          <h1 style={{ margin: 0 }}>Sales Dashboard</h1>
          <div>
            <button style={{ padding: '8px 12px', marginRight: 8 }}>Export</button>
            <button style={{ padding: '8px 12px' }}>Refresh</button>
          </div>
        </header>

        <section style={{ display: 'grid', gridTemplateColumns: '2fr 1fr', gap: 16 }}>
          <div style={{ background: '#fff', padding: 16, borderRadius: 8, boxShadow: '0 1px 2px rgba(2,6,23,0.04)' }}>
            <h3 style={{ marginTop: 0 }}>Sales by Region (interactive)</h3>

            <RegionChart data={filteredEntries.map((s) => ({ id: s.id, region: s.region, sales: s.amount, date: s.date, category: s.product }))} width={900} height={360} />
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
            <div style={{ background: '#fff', padding: 16, borderRadius: 8 }}>
              <h3 style={{ marginTop: 0 }}>Totals</h3>
              <div style={{ fontSize: 18, fontWeight: 700 }}>${filteredEntries.reduce((s, r) => s + r.amount, 0).toFixed(0)}</div>
              <div style={{ color: '#666' }}>{filteredEntries.length} orders</div>
            </div>

            <div style={{ background: '#fff', padding: 16, borderRadius: 8 }}>
              <h3 style={{ marginTop: 0 }}>Top Regions</h3>
              <RegionTable entries={filteredEntries} />
            </div>
          </div>
        </section>
      </main>
    </div>
  );
}
