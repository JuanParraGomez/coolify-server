import React, { useEffect, useState } from 'react';

export type Filters = {
  region?: string | 'All';
  startDate?: string;
  endDate?: string;
  minAmount?: number;
};

type Props = {
  regions: string[];
  initial?: Filters;
  onChange: (f: Filters) => void;
};

const FiltersPanel: React.FC<Props> = ({ regions, initial, onChange }) => {
  const [region, setRegion] = useState<string | 'All'>(initial?.region ?? 'All');
  const [startDate, setStartDate] = useState<string | undefined>(initial?.startDate);
  const [endDate, setEndDate] = useState<string | undefined>(initial?.endDate);
  const [minAmount, setMinAmount] = useState<number | undefined>(initial?.minAmount);

  useEffect(() => {
    const timeout = setTimeout(() => {
      onChange({ region, startDate, endDate, minAmount });
    }, 150);

    return () => clearTimeout(timeout);
  }, [region, startDate, endDate, minAmount, onChange]);

  function reset() {
    setRegion('All');
    setStartDate(undefined);
    setEndDate(undefined);
    setMinAmount(undefined);
  }

  return (
    <div style={{ display: 'flex', gap: 12, alignItems: 'flex-end', flexWrap: 'wrap' }}>
      <div>
        <label>Region</label>
        <br />
        <select value={region} onChange={(e) => setRegion(e.target.value)}>
          <option value="All">All</option>
          {regions.map((r) => (
            <option key={r} value={r}>{r}</option>
          ))}
        </select>
      </div>

      <div>
        <label>Start</label>
        <br />
        <input type="date" value={startDate ?? ''} onChange={(e) => setStartDate(e.target.value || undefined)} />
      </div>

      <div>
        <label>End</label>
        <br />
        <input type="date" value={endDate ?? ''} onChange={(e) => setEndDate(e.target.value || undefined)} />
      </div>

      <div>
        <label>Min sale</label>
        <br />
        <input type="number" min={0} value={minAmount ?? ''} onChange={(e) => setMinAmount(e.target.value ? Number(e.target.value) : undefined)} />
      </div>

      <div>
        <button type="button" onClick={reset}>Reset</button>
      </div>
    </div>
  );
};

export default FiltersPanel;
