"use client";

import React, {useMemo, useState} from "react";

type Sale = {
  region: string;
  subregion?: string;
  country?: string;
  amount: number;
  date: string; // ISO yyyy-mm-dd
  product?: string;
};

type Props = {
  data?: Sale[];
  initialProduct?: string | null;
};

const sampleData: Sale[] = [
  {region: "North America", country: "USA", subregion: "West", amount: 12000, date: "2026-02-01", product: "A"},
  {region: "North America", country: "USA", subregion: "East", amount: 8000, date: "2026-02-05", product: "B"},
  {region: "Europe", country: "Germany", subregion: "West Germany", amount: 15000, date: "2026-01-20", product: "A"},
  {region: "Europe", country: "France", subregion: "Ile-de-France", amount: 9000, date: "2026-02-11", product: "C"},
  {region: "Asia", country: "Japan", subregion: "Kanto", amount: 11000, date: "2026-02-14", product: "A"},
  {region: "Asia", country: "China", subregion: "East China", amount: 7000, date: "2026-01-02", product: "B"},
];

export default function RegionChart({data = sampleData, initialProduct = null}: Props) {
  const [productFilter, setProductFilter] = useState<string | null>(initialProduct);
  const [dateFrom, setDateFrom] = useState<string | null>(null);
  const [dateTo, setDateTo] = useState<string | null>(null);
  const [drillRegion, setDrillRegion] = useState<string | null>(null);

  const products = useMemo(() => {
    const setp = new Set<string>();
    data.forEach(d => d.product && setp.add(d.product));
    return Array.from(setp).sort();
  }, [data]);

  const filtered = useMemo(() => {
    return data.filter(d => {
      if (productFilter && d.product !== productFilter) return false;
      if (dateFrom && d.date < dateFrom) return false;
      if (dateTo && d.date > dateTo) return false;
      return true;
    });
  }, [data, productFilter, dateFrom, dateTo]);

  const byRegion = useMemo(() => {
    const map = new Map<string, number>();
    filtered.forEach(d => {
      map.set(d.region, (map.get(d.region) || 0) + d.amount);
    });
    return Array.from(map.entries()).map(([region, amount]) => ({region, amount})).sort((a,b)=>b.amount-a.amount);
  }, [filtered]);

  const totalSales = useMemo(() => filtered.reduce((s, x) => s + x.amount, 0), [filtered]);

  const topRegion = byRegion[0]?.region ?? null;

  // drill-down aggregation
  const drillData = useMemo(() => {
    if (!drillRegion) return [];
    const map = new Map<string, number>();
    filtered.forEach(d => {
      if (d.region !== drillRegion) return;
      const key = d.subregion ?? d.country ?? "(unknown)";
      map.set(key, (map.get(key) || 0) + d.amount);
    });
    return Array.from(map.entries()).map(([k,v])=>({key:k, amount:v})).sort((a,b)=>b.amount-a.amount);
  }, [filtered, drillRegion]);

  // simple SVG bar chart
  const Chart: React.FC = () => {
    const width = 700;
    const height = 300;
    const padding = 40;
    const max = Math.max(...byRegion.map(r=>r.amount), 1);
    const barWidth = Math.max(24, (width - padding*2) / Math.max(1, byRegion.length) - 12);

    return (
      <svg width={width} height={height} style={{borderRadius:8, background:'#fafafa'}}>
        {/* Y axis ticks */}
        { [0,0.25,0.5,0.75,1].map((p, i) => {
          const y = padding + (1 - p) * (height - padding*2);
          const value = Math.round(max * p);
          return (
            <g key={i}>
              <line x1={padding} x2={width-padding} y1={y} y2={y} stroke="#eee" />
              <text x={6} y={y+4} fontSize={10} fill="#666">{value}</text>
            </g>
          );
        })}

        {byRegion.map((r, i) => {
          const x = padding + i * ((width - padding*2) / Math.max(1, byRegion.length));
          const h = (r.amount / max) * (height - padding*2);
          const y = height - padding - h;
          return (
            <g key={r.region}>
              <rect x={x+6} y={y} width={barWidth} height={h} fill="#3b82f6" rx={4} style={{cursor:'pointer'}} onClick={()=>setDrillRegion(r.region)} />
              <text x={x+6 + barWidth/2} y={height - padding + 14} fontSize={11} fill="#111" textAnchor="middle">{r.region}</text>
              <title>{r.region}: {r.amount.toLocaleString()}</title>
            </g>
          );
        })}
      </svg>
    );
  };

  return (
    <div style={{fontFamily:'Inter, system-ui, sans-serif', maxWidth:760}}>
      <h3 style={{margin: '6px 0'}}>Ventas por Región</h3>

      {/* Filters */}
      <div style={{display:'flex', gap:12, alignItems:'center', marginBottom:12}}>
        <label style={{fontSize:13}}>Producto:
          <select value={productFilter ?? ""} onChange={e=>setProductFilter(e.target.value || null} style={{marginLeft:8}}>
            <option value="">Todos</option>
            {products.map(p => <option key={p} value={p}>{p}</option>)}
          </select>
        </label>

        <label style={{fontSize:13}}>Desde:
          <input type="date" value={dateFrom ?? ''} onChange={e=>setDateFrom(e.target.value || null} style={{marginLeft:8}} />
        </label>
        <label style={{fontSize:13}}>Hasta:
          <input type="date" value={dateTo ?? ''} onChange={e=>setDateTo(e.target.value || null} style={{marginLeft:8}} />
        </label>

        <button onClick={()=>{setProductFilter(null); setDateFrom(null); setDateTo(null); setDrillRegion(null);}} style={{marginLeft:'auto'}}>Limpiar</button>
      </div>

      {/* Summary */}
      <div style={{display:'flex', gap:12, alignItems:'center', marginBottom:12}}>
        <div style={{padding:10, border:'1px solid #eee', borderRadius:8}}>
          <div style={{fontSize:12, color:'#666'}}>Total vendido</div>
          <div style={{fontSize:18, fontWeight:700}}>${totalSales.toLocaleString()}</div>
        </div>
        <div style={{padding:10, border:'1px solid #eee', borderRadius:8}}>
          <div style={{fontSize:12, color:'#666'}}>Regiones</div>
          <div style={{fontSize:18, fontWeight:700}}>{byRegion.length}</div>
        </div>
        <div style={{padding:10, border:'1px solid #eee', borderRadius:8}}>
          <div style={{fontSize:12, color:'#666'}}>Top</div>
          <div style={{fontSize:18, fontWeight:700}}>{topRegion ?? '-'}</div>
        </div>
      </div>

      {/* Chart and drilldown */}
      <div style={{border:'1px solid #f0f0f0', padding:12, borderRadius:8}}>
        <Chart />

        {drillRegion ? (
          <div style={{marginTop:12}}>
            <div style={{display:'flex', alignItems:'center', justifyContent:'space-between'}}>
              <strong>Detalle: {drillRegion}</strong>
              <div>
                <button onClick={()=>setDrillRegion(null)}>Volver</button>
              </div>
            </div>

            <div style={{marginTop:8}}>
              {drillData.length === 0 ? (
                <div style={{color:'#666'}}>No hay datos para esta región con los filtros aplicados.</div>
              ) : (
                <table style={{width:'100%', borderCollapse:'collapse', marginTop:8}}>
                  <thead>
                    <tr style={{textAlign:'left', borderBottom:'1px solid #eee'}}>
                      <th style={{padding:'6px 4px'}}>Subregión / País</th>
                      <th style={{padding:'6px 4px'}}>Ventas</th>
                    </tr>
                  </thead>
                  <tbody>
                    {drillData.map(d => (
                      <tr key={d.key}>
                        <td style={{padding:'6px 4px'}}>{d.key}</td>
                        <td style={{padding:'6px 4px'}}>${d.amount.toLocaleString()}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              )}
            </div>
          </div>
        ) : (
          <div style={{marginTop:10, color:'#666', fontSize:13}}>Haz clic en una barra para ver el desglose por subregión/país.</div>
        )}
      </div>
    </div>
  );
}
