'use client'

import type { CSSProperties } from 'react'

import { formatCompactCurrency, formatPercent, type DerivedRegion } from '../lib/mock-data'

interface RegionTableProps {
  regions: DerivedRegion[]
  selectedRegionId: string
  onSelectRegion: (id: string) => void
}

const HEALTH_LABEL: Record<string, string> = {
  positive: 'Arriba',
  steady: 'En meta',
  warning: 'Atención',
}

export default function RegionTable({ regions, selectedRegionId, onSelectRegion }: RegionTableProps) {
  if (regions.length === 0) {
    return (
      <p className="detail-copy" style={{ padding: '1rem 0' }}>
        Sin regiones para mostrar con los filtros actuales.
      </p>
    )
  }

  return (
    <div className="table-scroll">
      <table className="data-table region-table">
        <thead>
          <tr>
            <th>Región</th>
            <th>Manager</th>
            <th>Ventas</th>
            <th>Meta</th>
            <th>Cumpl.</th>
            <th>Margen</th>
            <th>Órdenes</th>
            <th>Pipeline</th>
            <th>Estado</th>
          </tr>
        </thead>
        <tbody>
          {regions.map((region) => {
            const isSelected = region.id === selectedRegionId
            const pct = Math.round(region.performance * 100)

            return (
              <tr
                key={region.id}
                className={isSelected ? 'row-selected' : undefined}
                onClick={() => onSelectRegion(region.id)}
                style={{ '--row-accent': region.color } as CSSProperties}
              >
                <td>
                  <span className="region-name">
                    <span className="region-dot" style={{ background: region.color }} />
                    {region.name}
                  </span>
                </td>
                <td>{region.manager}</td>
                <td>{formatCompactCurrency(region.revenue)}</td>
                <td>{formatCompactCurrency(region.target)}</td>
                <td>
                  <span className={`status-pill ${region.health}`} style={{ fontSize: '0.75rem' }}>
                    {pct}%
                  </span>
                </td>
                <td>{formatPercent(region.margin)}</td>
                <td>{region.orders.toLocaleString('es-MX')}</td>
                <td>{formatCompactCurrency(region.pipeline)}</td>
                <td>
                  <span className={`status-pill ${region.health}`} style={{ fontSize: '0.75rem' }}>
                    {HEALTH_LABEL[region.health] ?? region.health}
                  </span>
                </td>
              </tr>
            )
          })}
        </tbody>
      </table>
    </div>
  )
}
