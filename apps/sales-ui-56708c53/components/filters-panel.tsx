'use client'

import React from 'react';
import { Filters, REGIONS, CATEGORIES, defaultFilters } from '../lib/mock-data';

type Props = {
  filters: Filters;
  onChange: (f: Filters) => void;
};

export default function FiltersPanel({ filters, onChange }: Props) {
  const setField = (patch: Partial<Filters>) => onChange({ ...filters, ...patch });

  const toggleRegion = (region: string) => {
    const set = new Set(filters.regions || []);
    if (set.has(region)) set.delete(region);
    else set.add(region);
    setField({ regions: Array.from(set) });
  };

  const reset = () => onChange({ ...defaultFilters });

  return (
    <div style={{ border: '1px solid #e2e8f0', padding: 12, borderRadius: 6, marginBottom: 12 }}>
      <div style={{ display: 'flex', gap: 12, flexWrap: 'wrap' }}>
        <div>
          <label>Start date</label>
          <input
            type="date"
            value={filters.startDate || ''}
            onChange={(e) => setField({ startDate: e.target.value || undefined })}
          />
        </div>

        <div>
          <label>End date</label>
          <input
            type="date"
            value={filters.endDate || ''}
            onChange={(e) => setField({ endDate: e.target.value || undefined })}
          />
        </div>

        <div>
          <label>Min amount</label>
          <input
            type="number"
            value={filters.minAmount ?? ''}
            onChange={(e) => setField({ minAmount: e.target.value ? Number(e.target.value) : undefined })}
            placeholder="0"
          />
        </div>

        <div>
          <label>Max amount</label>
          <input
            type="number"
            value={filters.maxAmount ?? ''}
            onChange={(e) => setField({ maxAmount: e.target.value ? Number(e.target.value) : undefined })}
            placeholder=""
          />
        </div>

        <div>
          <label>Category</label>
          <select
            value={filters.category ?? ''}
            onChange={(e) => setField({ category: e.target.value || null })}
          >
            <option value="">(any)</option>
            {CATEGORIES.map((c) => (
              <option key={c} value={c}>
                {c}
              </option>
            ))}
          </select>
        </div>

        <div style={{ minWidth: 220 }}>
          <label>Search product/category</label>
          <input
            type="search"
            value={filters.search ?? ''}
            onChange={(e) => setField({ search: e.target.value || undefined })}
            placeholder="buscar..."
            style={{ width: '100%' }}
          />
        </div>
      </div>

      <div style={{ marginTop: 12 }}>
        <div style={{ marginBottom: 6 }}>Regions</div>
        <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap' }}>
          {REGIONS.map((r) => (
            <label key={r} style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
              <input
                type="checkbox"
                checked={(filters.regions || []).includes(r)}
                onChange={() => toggleRegion(r)}
              />
              {r}
            </label>
          ))}
        </div>
      </div>

      <div style={{ marginTop: 12, display: 'flex', gap: 8 }}>
        <button type="button" onClick={reset} style={{ padding: '6px 10px' }}>
          Reset
        </button>
      </div>
    </div>
  );
}
