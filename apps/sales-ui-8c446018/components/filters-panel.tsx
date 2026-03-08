import React, { useEffect, useState } from 'react';
import type { Filters } from '../lib/mock-data';

type Props = {
  regions: string[];
  categories: string[];
  onChange: (f: Filters) => void;
  initial?: Filters;
};

export default function FiltersPanel({ regions, categories, onChange, initial }: Props) {
  const [region, setRegion] = useState(initial?.region || '');
  const [category, setCategory] = useState(initial?.category || '');
  const [startDate, setStartDate] = useState(initial?.startDate || '');
  const [endDate, setEndDate] = useState(initial?.endDate || '');

  useEffect(() => {
    const t = setTimeout(() => {
      onChange({ region: region || undefined, category: category || undefined, startDate: startDate || undefined, endDate: endDate || undefined });
    }, 150);
    return () => clearTimeout(t);
  }, [region, category, startDate, endDate, onChange]);

  return (
    <div style={{ display: 'flex', gap: 12, flexWrap: 'wrap', alignItems: 'center' }}>
      <label style={{ display: 'flex', flexDirection: 'column' }}>
        Region
        <select value={region} onChange={(e) => setRegion(e.target.value)}>
          <option value=''>All</option>
          {regions.map((r) => (
            <option key={r} value={r}>
              {r}
            </option>
          ))}
        </select>
      </label>

      <label style={{ display: 'flex', flexDirection: 'column' }}>
        Category
        <select value={category} onChange={(e) => setCategory(e.target.value)}>
          <option value=''>All</option>
          {categories.map((c) => (
            <option key={c} value={c}>
              {c}
            </option>
          ))}
        </select>
      </label>

      <label style={{ display: 'flex', flexDirection: 'column' }}>
        Start
        <input type='month' value={startDate} onChange={(e) => setStartDate(e.target.value)} />
      </label>

      <label style={{ display: 'flex', flexDirection: 'column' }}>
        End
        <input type='month' value={endDate} onChange={(e) => setEndDate(e.target.value)} />
      </label>

      <button
        onClick={() => {
          setRegion('');
          setCategory('');
          setStartDate('');
          setEndDate('');
        }}
      >
        Reset
      </button>
    </div>
  );
}
