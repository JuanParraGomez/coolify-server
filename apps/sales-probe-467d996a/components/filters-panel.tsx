import React, { useEffect, useState } from 'react';
import { REGIONS, CATEGORIES, SalesFilter } from '../lib/mock-data';

type Props = {
  onChange?: (filters: SalesFilter) => void;
};

export default function FiltersPanel({ onChange }: Props) {
  const [selectedRegions, setSelectedRegions] = useState<string[]>([]);
  const [category, setCategory] = useState<string | null>(null);
  const [minTotal, setMinTotal] = useState<number | ''>('');

  useEffect(() => {
    const filters: SalesFilter = {
      regions: selectedRegions,
      category: category || null,
      minTotal: minTotal === '' ? null : Number(minTotal),
    };
    onChange?.(filters);
  }, [selectedRegions, category, minTotal, onChange]);

  function toggleRegion(r: string) {
    setSelectedRegions((prev) => (prev.includes(r) ? prev.filter((x) => x !== r) : [...prev, r]));
  }

  return (
    <div style={{ padding: 12, border: '1px solid #eee', borderRadius: 6, maxWidth: 420 }}>
      <h3 style={{ marginTop: 0 }}>Filters</h3>

      <div style={{ marginBottom: 10 }}>
        <label style={{ fontSize: 12, color: '#333' }}>Regions</label>
        <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap', marginTop: 6 }}>
          {REGIONS.map((r) => (
            <button
              key={r}
              onClick={() => toggleRegion(r)}
              style={{
                padding: '6px 8px',
                borderRadius: 4,
                border: selectedRegions.includes(r) ? '2px solid #2563eb' : '1px solid #ddd',
                background: selectedRegions.includes(r) ? '#eff6ff' : '#fff',
                cursor: 'pointer',
              }}
            >
              {r}
            </button>
          ))}
        </div>
      </div>

      <div style={{ marginBottom: 10 }}>
        <label style={{ fontSize: 12, color: '#333' }}>Category</label>
        <select
          value={category ?? ''}
          onChange={(e) => setCategory(e.target.value || null)}
          style={{ display: 'block', width: '100%', padding: 8, marginTop: 6 }}
        >
          <option value="">All categories</option>
          {CATEGORIES.map((c) => (
            <option key={c} value={c}>
              {c}
            </option>
          ))}
        </select>
      </div>

      <div>
        <label style={{ fontSize: 12, color: '#333' }}>Min total sales</label>
        <input
          type="number"
          placeholder="e.g. 50000"
          value={minTotal}
          onChange={(e) => setMinTotal(e.target.value === '' ? '' : Number(e.target.value))}
          style={{ display: 'block', width: '100%', padding: 8, marginTop: 6 }}
        />
      </div>
    </div>
  );
}
