import React, { useEffect, useState } from 'react';

type Filters = {
  region?: string;
  from?: string;
  to?: string;
  minSales?: number;
};

type Props = {
  regions: string[];
  months: string[];
  onChange: (filters: Filters) => void;
};

export default function FiltersPanel({ regions, months, onChange }: Props) {
  const [region, setRegion] = useState<string>('All');
  const [from, setFrom] = useState<string>(months[0] ?? '');
  const [to, setTo] = useState<string>(months[months.length - 1] ?? '');
  const [minSales, setMinSales] = useState<string>('');

  useEffect(() => {
    const payload: Filters = {
      region: region === 'All' ? undefined : region,
      from,
      to,
      minSales: minSales === '' ? undefined : Number(minSales),
    };
    onChange(payload);
  }, [region, from, to, minSales, onChange]);

  return (
    <div style={{display: 'flex', gap: 12, flexWrap: 'wrap', alignItems: 'center'}}>
      <label>
        Región:
        <select value={region} onChange={(e) => setRegion(e.target.value)} style={{marginLeft:8}}>
          <option value="All">Todas</option>
          {regions.map((r) => (
            <option key={r} value={r}>{r}</option>
          ))}
        </select>
      </label>

      <label>
        Desde:
        <select value={from} onChange={(e) => setFrom(e.target.value)} style={{marginLeft:8}}>
          {months.map((m) => (
            <option key={m} value={m}>{m}</option>
          ))}
        </select>
      </label>

      <label>
        Hasta:
        <select value={to} onChange={(e) => setTo(e.target.value)} style={{marginLeft:8}}>
          {months.map((m) => (
            <option key={m} value={m}>{m}</option>
          ))}
        </select>
      </label>

      <label>
        Mín ventas:
        <input
          type="number"
          placeholder="ej. 50000"
          value={minSales}
          onChange={(e) => setMinSales(e.target.value)}
          style={{marginLeft:8, width: 110}}
        />
      </label>
    </div>
  );
}
