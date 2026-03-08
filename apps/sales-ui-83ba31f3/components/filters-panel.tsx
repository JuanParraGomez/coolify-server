"use client";

import React, { useEffect, useMemo, useState } from 'react';
import { generateMockData, getAvailableMonths, REGIONS } from '../lib/mock-data';

type Filters = {
  region?: string | 'all';
  month?: string | 'all';
  minSales?: number;
};

export default function FiltersPanel({
  onChange,
  initial = { region: 'all', month: 'all', minSales: 0 },
}: {
  onChange: (filters: Filters) => void;
  initial?: Filters;
}) {
  // use generated mock data to populate months list (UI-only helper)
  const months = useMemo(() => getAvailableMonths(generateMockData(6)), []);

  const [region, setRegion] = useState<string | 'all'>(initial.region || 'all');
  const [month, setMonth] = useState<string | 'all'>(initial.month || 'all');
  const [minSales, setMinSales] = useState<number>(initial.minSales ?? 0);

  useEffect(() => {
    onChange({ region, month, minSales });
  }, [region, month, minSales, onChange]);

  return (
    <div style={{ padding: 12, border: '1px solid #eee', borderRadius: 6 }}>
      <div style={{ display: 'flex', gap: 12, alignItems: 'center', flexWrap: 'wrap' }}>
        <label>
          Region:
          <select value={region} onChange={(e) => setRegion(e.target.value)} style={{ marginLeft: 8 }}>
            <option value="all">All</option>
            {REGIONS.map((r) => (
              <option key={r} value={r}>
                {r}
              </option>
            ))}
          </select>
        </label>

        <label>
          Month:
          <select value={month} onChange={(e) => setMonth(e.target.value)} style={{ marginLeft: 8 }}>
            <option value="all">All</option>
            {months.map((m) => (
              <option key={m} value={m}>
                {m}
              </option>
            ))}
          </select>
        </label>

        <label>
          Min Sales:
          <input
            type="number"
            value={minSales}
            onChange={(e) => setMinSales(Number(e.target.value || 0))}
            style={{ width: 120, marginLeft: 8 }}
            min={0}
          />
        </label>

        <button
          onClick={() => {
            setRegion('All');
            setMonth('All');
            setMinSales(0);
          }}
          style={{ marginLeft: 'auto' }}
        >
          Reset
        </button>
      </div>
    </div>
  );
}
