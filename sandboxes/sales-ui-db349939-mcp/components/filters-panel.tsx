import React, { useEffect, useState } from 'react';
import type { SalesEntry } from '../lib/mock-data';

export type Filters = {
  region: string; // 'All' or region
  product: string; // 'All' or product
  dateFrom?: string; // yyyy-mm-dd
  dateTo?: string;
  minAmount?: number;
};

type Props = {
  regions: string[];
  products: string[];
  initial?: Partial<Filters>;
  onChange: (filters: Filters) => void;
};

const FiltersPanel: React.FC<Props> = ({ regions, products, initial, onChange }) => {
  const [region, setRegion] = useState<string>(initial?.region ?? 'All');
  const [product, setProduct] = useState<string>(initial?.product ?? 'All');
  const [dateFrom, setDateFrom] = useState<string | undefined>(initial?.dateFrom);
  const [dateTo, setDateTo] = useState<string | undefined>(initial?.dateTo);
  const [minAmount, setMinAmount] = useState<number | undefined>(initial?.minAmount);

  useEffect(() => {
    onChange({ region, product, dateFrom, dateTo, minAmount });
  }, [region, product, dateFrom, dateTo, minAmount, onChange]);

  function reset() {
    setRegion('All');
    setProduct('All');
    setDateFrom(undefined);
    setDateTo(undefined);
    setMinAmount(undefined);
  }

  return (
    <div style={{ border: '1px solid #eee', padding: 12, borderRadius: 6 }}>
      <h3 style={{ marginTop: 0 }}>Filters</h3>
      <div style={{ display: 'flex', gap: 12, flexWrap: 'wrap' }}>
        <div>
          <label>Region</label>
          <br />
          <select value={region} onChange={(e) => setRegion(e.target.value)}>
            <option value="All">All</option>
            {regions.map((r) => (
              <option key={r} value={r}>
                {r}
              </option>
            ))}
          </select>
        </div>

        <div>
          <label>Product</label>
          <br />
          <select value={product} onChange={(e) => setProduct(e.target.value)}>
            <option value="All">All</option>
            {products.map((p) => (
              <option key={p} value={p}>
                {p}
              </option>
            ))}
          </select>
        </div>

        <div>
          <label>Date from</label>
          <br />
          <input type="date" value={dateFrom ?? ''} onChange={(e) => setDateFrom(e.target.value || undefined)} />
        </div>

        <div>
          <label>Date to</label>
          <br />
          <input type="date" value={dateTo ?? ''} onChange={(e) => setDateTo(e.target.value || undefined)} />
        </div>

        <div>
          <label>Min amount</label>
          <br />
          <input
            type="number"
            placeholder="0"
            value={minAmount ?? ''}
            onChange={(e) => setMinAmount(e.target.value ? Number(e.target.value) : undefined)}
            style={{ width: 120 }}
          />
        </div>

        <div style={{ alignSelf: 'flex-end' }}>
          <button onClick={reset}>Reset</button>
        </div>
      </div>
    </div>
  );
};

export default FiltersPanel;
