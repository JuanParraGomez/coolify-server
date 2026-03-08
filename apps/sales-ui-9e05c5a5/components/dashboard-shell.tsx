"use client";
import React, { useMemo, useState } from 'react';
import FiltersPanel, { Filters as PanelFilters } from './filters-panel';
import RegionChart from './region-chart';
import RegionTable from './region-table';
import { MOCK_SALES, aggregateByRegion, SalesFilters, filterSales } from '../lib/mock-data';

type Props = { children?: React.ReactNode };

export default function DashboardShell({ children }: Props) {
  // unify filters to use the mock-data types
  const [filters, setFilters] = useState<SalesFilters>({ region: 'All' });

  const regions = useMemo(() => Array.from(new Set(MOCK_SALES.map((s) => s.region))), []);

  const applyFilters = (f: PanelFilters) => {
    // convert FiltersPanel's shape to SalesFilters
    const sf: SalesFilters = {
      region: f.region ?? 'All',
      startDate: f.startDate,
      endDate: f.endDate,
      minAmount: f.minAmount,
    };
    setFilters(sf);
  };

  const filtered = useMemo(() => {
    return filterSales(MOCK_SALES, filters);
  }, [filters]);

  const aggregates = useMemo(() => aggregateByRegion(filtered), [filtered]);

  return (
    <div style={{ display: 'flex', minHeight: '100vh' }}>
      <aside style={{ width: 320, padding: 20, borderRight: '1px solid #eee', background: '#fafafa' }}>
        <h2 style={{ marginTop: 0 }}>Filtros</h2>

        <FiltersPanel regions={regions} initial={{ region: 'All' }} onChange={applyFilters} />

        <div style={{ marginTop: 24 }}>
          <strong>Resumen</strong>
          <div style={{ marginTop: 8 }}>Regiones: {aggregates.length}</div>
          <div>Total ventas: {aggregates.reduce((s, r) => s + r.total, 0)}</div>
        </div>
      </aside>

      <main style={{ flex: 1, padding: 24 }}>
        <header style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 20 }}>
          <h1 style={{ margin: 0 }}>Ventas por Región</h1>
          <div style={{ color: '#666' }}>Interfaz integrada usando mock-data</div>
        </header>

        <section style={{ marginBottom: 20, display: 'flex', gap: 24 }}>
          <div style={{ flex: '0 0 720px' }}>
            <RegionChart data={filtered} />
          </div>

          <div style={{ flex: 1 }}>
            <h3>Tabla por región</h3>
            <RegionTable data={aggregates} />
          </div>
        </section>

        <section>
          {children ?? <p>Seleccione filtros para actualizar los gráficos y la tabla.</p>}
        </section>
      </main>
    </div>
  );
}
