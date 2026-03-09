'use client'

import React, { useMemo, useState } from 'react';

import FiltersPanel from '../components/filters-panel';
import RegionChart from '../components/region-chart';
import RegionTable from '../components/region-table';
import { generateMockSales, filterSales, defaultFilters, Filters } from '../lib/mock-data';

export default function Page() {
  const [filters, setFilters] = useState<Filters>({ ...defaultFilters });
  const all = useMemo(() => generateMockSales(200), []);
  const sales = useMemo(() => filterSales(all, filters), [all, filters]);

  return (
      <div style={{ display: 'grid', gap: 16 }}>
        <section style={{ display: 'flex', gap: 16, alignItems: 'flex-start' }}>
          <div style={{ flex: 1, background: '#fff', padding: 16, borderRadius: 8, boxShadow: '0 1px 2px rgba(16,24,40,0.05)' }}>
            <h2 style={{ margin: 0 }}>Ventas por región</h2>
            <p style={{ marginTop: 8, color: '#475569' }}>Resumen rápido de ventas. Usa los filtros a la derecha para ajustar el periodo y las regiones.</p>
            <div style={{ height: 320, marginTop: 12 }}>
              <RegionChart data={sales.map((s) => ({ region: s.region, subregion: undefined, amount: s.amount, date: s.date, category: s.category }))} width={920} height={320} />
            </div>
          </div>

          <aside style={{ width: 340 }}>
            <div style={{ background: '#fff', padding: 16, borderRadius: 8, boxShadow: '0 1px 2px rgba(16,24,40,0.05)' }}>
              <h3 style={{ marginTop: 0 }}>Filtros</h3>
              <FiltersPanel filters={filters} onChange={setFilters} />
            </div>
          </aside>
        </section>

        <section style={{ display: 'grid', gap: 16 }}>
          <div style={{ background: '#fff', padding: 16, borderRadius: 8 }}>
            <h3 style={{ marginTop: 0 }}>Por región</h3>
            <RegionTable sales={sales} />
          </div>

          <div style={{ background: '#fff', padding: 16, borderRadius: 8 }}>
            <h3 style={{ marginTop: 0 }}>Detalles</h3>
            <p style={{ margin: 0 }}>Métricas y export (placeholder)</p>
          </div>
        </section>
      </div>
  );
}
