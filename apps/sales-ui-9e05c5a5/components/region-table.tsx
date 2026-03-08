import React from 'react';
import type { RegionAggregate } from '../lib/mock-data';

type Props = {
  data: RegionAggregate[];
  onSelect?: (region: string) => void;
};

const currency = new Intl.NumberFormat(undefined, { style: 'currency', currency: 'USD', maximumFractionDigits: 0 });

const RegionTable: React.FC<Props> = ({ data, onSelect }) => {
  return (
    <table style={{ width: '100%', borderCollapse: 'collapse' }}>
      <thead>
        <tr>
          <th style={{ textAlign: 'left', borderBottom: '1px solid #ddd', padding: 8 }}>Region</th>
          <th style={{ textAlign: 'right', borderBottom: '1px solid #ddd', padding: 8 }}>Total Sales</th>
          <th style={{ textAlign: 'right', borderBottom: '1px solid #ddd', padding: 8 }}>Orders</th>
          <th style={{ textAlign: 'right', borderBottom: '1px solid #ddd', padding: 8 }}>Avg</th>
        </tr>
      </thead>
      <tbody>
        {data.map((row) => (
          <tr key={row.region} style={{ cursor: onSelect ? 'pointer' : 'default' }} onClick={() => onSelect && onSelect(row.region)}>
            <td style={{ padding: 8, borderBottom: '1px solid #f4f4f4' }}>{row.region}</td>
            <td style={{ padding: 8, borderBottom: '1px solid #f4f4f4', textAlign: 'right' }}>{currency.format(row.total)}</td>
            <td style={{ padding: 8, borderBottom: '1px solid #f4f4f4', textAlign: 'right' }}>{row.orders}</td>
            <td style={{ padding: 8, borderBottom: '1px solid #f4f4f4', textAlign: 'right' }}>{currency.format(row.average)}</td>
          </tr>
        ))}
        {data.length === 0 && (
          <tr>
            <td colSpan={4} style={{ padding: 12, textAlign: 'center' }}>No data</td>
          </tr>
        )}
      </tbody>
    </table>
  );
};

export default RegionTable;
