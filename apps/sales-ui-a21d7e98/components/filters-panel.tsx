import React, { useState } from 'react';
import { REGIONS, SalesFilters } from '../lib/mock-data';

type Props = {
  initial?: SalesFilters;
  onChange?: (f: SalesFilters) => void;
};

export default function FiltersPanel({ initial, onChange }: Props) {
  const [region, setRegion] = useState<string>(initial?.region ?? 'All');
  const [from, setFrom] = useState<string | undefined>(initial?.from);
  const [to, setTo] = useState<string | undefined>(initial?.to);

  const apply = () => {
    const filters: SalesFilters = { region: region as SalesFilters['region'], from, to };
    onChange?.(filters);
  };

  const clear = () => {
    setRegion('All');
    setFrom(undefined);
    setTo(undefined);
    onChange?.({ region: 'All' });
  };

  return (
    <div style={{ border: '1px solid #eee', padding: 12, borderRadius: 6 }}>
      <div style={{ display: 'flex', gap: 8, alignItems: 'center', flexWrap: 'wrap' }}>
        <label style={{ display: 'flex', flexDirection: 'column' }}>
          Region
          <select value={region} onChange={(e) => setRegion(e.target.value)}>
            <option value="All">All</option>
            {REGIONS.map((r) => (
              <option key={r} value={r}>
                {r}
              </option>
            ))}
          </select>
        </label>

        <label style={{ display: 'flex', flexDirection: 'column' }}>
          From
          <input type="date" value={from ?? ''} onChange={(e) => setFrom(e.target.value || undefined)} />
        </label>

        <label style={{ display: 'flex', flexDirection: 'column' }}>
          To
          <input type="date" value={to ?? ''} onChange={(e) => setTo(e.target.value || undefined)} />
        </label>

        <div style={{ display: 'flex', gap: 6, marginLeft: 'auto' }}>
          <button onClick={clear} type="button">
            Clear
          </button>
          <button onClick={apply} type="button">
            Apply
          </button>
        </div>
      </div>
    </div>
  );
}
