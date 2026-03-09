"use client";

import React from 'react';
import { Filters, getRegions } from '../lib/mock-data';

type Props = {
  filters: Filters;
  onChange: (f: Filters) => void;
};

export default function FiltersPanel({ filters, onChange }: Props) {
  const regions = ['All', ...getRegions()];

  const setField = <K extends keyof Filters>(k: K, v: Filters[K]) => {
    onChange({ ...filters, [k]: v });
  };

  const reset = () => {
    onChange({ region: 'All', minSales: undefined, maxSales: undefined, lastNMonths: 12 });
  };

  return (
    <div style={{ padding: 12, border: '1px solid #eee', borderRadius: 6 }}>
      <div style={{ marginBottom: 8 }}>
        <label style={{ display: 'block', fontSize: 12, color: '#333' }}>Region</label>
        <select
          value={filters.region ?? 'All'}
          onChange={(e) => setField('region', e.target.value)}
          style={{ width: '100%', padding: 6 }}
        >
          {regions.map((r) => (
            <option key={r} value={r}>
              {r}
            </option>
          ))}
        </select>
      </div>

      <div style={{ display: 'flex', gap: 8, marginBottom: 8 }}>
        <div style={{ flex: 1 }}>
          <label style={{ display: 'block', fontSize: 12 }}>Min total sales</label>
          <input
            type="number"
            value={typeof filters.minSales === 'number' ? filters.minSales : ''}
            onChange={(e) => setField('minSales', e.target.value === '' ? undefined : Number(e.target.value))}
            style={{ width: '100%', padding: 6 }}
            placeholder="e.g. 100000"
          />
        </div>
        <div style={{ flex: 1 }}>
          <label style={{ display: 'block', fontSize: 12 }}>Max total sales</label>
          <input
            type="number"
            value={typeof filters.maxSales === 'number' ? filters.maxSales : ''}
            onChange={(e) => setField('maxSales', e.target.value === '' ? undefined : Number(e.target.value))}
            style={{ width: '100%', padding: 6 }}
            placeholder="e.g. 500000"
          />
        </div>
      </div>

      <div style={{ marginBottom: 8 }}>
        <label style={{ display: 'block', fontSize: 12 }}>Last N months (trend)</label>
        <input
          type="range"
          min={1}
          max={12}
          value={filters.lastNMonths ?? 12}
          onChange={(e) => setField('lastNMonths', Number(e.target.value))}
          style={{ width: '100%' }}
        />
        <div style={{ fontSize: 12, color: '#666' }}>{filters.lastNMonths ?? 12} months</div>
      </div>

      <div style={{ display: 'flex', gap: 8 }}>
        <button onClick={() => onChange(filters)} style={{ padding: '6px 10px' }}>
          Apply
        </button>
        <button onClick={reset} style={{ padding: '6px 10px' }}>
          Reset
        </button>
      </div>
    </div>
  );
}
