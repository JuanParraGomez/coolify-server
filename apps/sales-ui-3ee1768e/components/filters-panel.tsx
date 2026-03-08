import React, { useState } from 'react';
import type { Filters } from './types';

type Props = {
  regions: string[];
  initial?: Filters;
  onChange: (f: Filters) => void;
};

export default function FiltersPanel({ regions, initial, onChange }: Props) {
  const [region, setRegion] = useState<string | undefined>(initial?.region);
  const [monthFrom, setMonthFrom] = useState<string | undefined>(initial?.monthFrom);
  const [monthTo, setMonthTo] = useState<string | undefined>(initial?.monthTo);
  const [minSales, setMinSales] = useState<number | undefined>(initial?.minSales);
  const [maxSales, setMaxSales] = useState<number | undefined>(initial?.maxSales);

  function apply() {
    onChange({ region, monthFrom, monthTo, minSales, maxSales });
  }

  function clearAll() {
    setRegion(undefined);
    setMonthFrom(undefined);
    setMonthTo(undefined);
    setMinSales(undefined);
    setMaxSales(undefined);
    onChange({});
  }

  return (
    <div style={{ padding: 12, border: '1px solid #eee', borderRadius: 6, maxWidth: 520 }}>
      <h3 style={{ marginTop: 0 }}>Filtros</h3>
      <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap' }}>
        <div style={{ display: 'flex', flexDirection: 'column', minWidth: 160 }}>
          <label>Región</label>
          <select value={region ?? ''} onChange={(e) => setRegion(e.target.value || undefined)}>
            <option value="">(Todas)</option>
            {regions.map(r => (
              <option key={r} value={r}>{r}</option>
            ))}
          </select>
        </div>

        <div style={{ display: 'flex', flexDirection: 'column' }}>
          <label>Desde (mes)</label>
          <input type="month" value={monthFrom ?? ''} onChange={(e) => setMonthFrom(e.target.value || undefined)} />
        </div>

        <div style={{ display: 'flex', flexDirection: 'column' }}>
          <label>Hasta (mes)</label>
          <input type="month" value={monthTo ?? ''} onChange={(e) => setMonthTo(e.target.value || undefined)} />
        </div>

        <div style={{ display: 'flex', flexDirection: 'column' }}>
          <label>Ventas mínimas</label>
          <input type="number" value={minSales ?? ''} onChange={(e) => setMinSales(e.target.value ? Number(e.target.value) : undefined)} placeholder="0" />
        </div>

        <div style={{ display: 'flex', flexDirection: 'column' }}>
          <label>Ventas máximas</label>
          <input type="number" value={maxSales ?? ''} onChange={(e) => setMaxSales(e.target.value ? Number(e.target.value) : undefined)} placeholder="" />
        </div>
      </div>

      <div style={{ marginTop: 12, display: 'flex', gap: 8 }}>
        <button onClick={apply} style={{ padding: '6px 10px' }}>Aplicar</button>
        <button onClick={clearAll} style={{ padding: '6px 10px' }}>Limpiar</button>
      </div>
    </div>
  );
}
