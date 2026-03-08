import React, { useMemo, useState } from 'react';
import type { RegionSales } from '../lib/mock-data';

type Props = {
  data: RegionSales[];
};

export default function RegionTable({ data }: Props) {
  const [sortDesc, setSortDesc] = useState(true);
  const [search, setSearch] = useState('');

  const rows = useMemo(() => {
    const filtered = data.filter((r) => r.region.toLowerCase().includes(search.toLowerCase()));
    const sorted = filtered.sort((a, b) => (sortDesc ? b.totalSales - a.totalSales : a.totalSales - b.totalSales));
    return sorted;
  }, [data, sortDesc, search]);

  return (
    <div>
      <div style={{display:'flex', justifyContent:'space-between', marginBottom:8}}>
        <div>
          <button onClick={() => setSortDesc((s)=>!s)}>{sortDesc ? 'Ordenar asc' : 'Ordenar desc'}</button>
        </div>
        <div>
          <input placeholder="Buscar región" value={search} onChange={(e)=>setSearch(e.target.value)} />
        </div>
      </div>

      <table style={{width:'100%', borderCollapse:'collapse'}}>
        <thead>
          <tr>
            <th style={{textAlign:'left', borderBottom:'1px solid #ddd', padding:8}}>Región</th>
            <th style={{textAlign:'right', borderBottom:'1px solid #ddd', padding:8}}>Ventas totales</th>
            <th style={{textAlign:'right', borderBottom:'1px solid #ddd', padding:8}}>Último mes</th>
          </tr>
        </thead>
        <tbody>
          {rows.map((r) => (
            <tr key={r.region}>
              <td style={{padding:8, borderBottom:'1px solid #eee'}}>{r.region}</td>
              <td style={{padding:8, textAlign:'right', borderBottom:'1px solid #eee'}}>{r.totalSales.toLocaleString()}</td>
              <td style={{padding:8, textAlign:'right', borderBottom:'1px solid #eee'}}>{r.monthly[r.monthly.length-1]?.sales.toLocaleString()}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
