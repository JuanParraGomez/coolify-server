'use client'

import type { ReactNode } from 'react'
import { type Quarter, type RegionName, type RegionQuarterRow } from '../lib/mock-data'

interface RegionTableProps {
  rows: RegionQuarterRow[]
  selectedRegion?: RegionName | null
  selectedQuarter?: Quarter | 'all'
  onSelectRegion?: (region: RegionName) => void
}

const currencyFormatter = new Intl.NumberFormat('es-ES', {
  style: 'currency',
  currency: 'EUR',
  maximumFractionDigits: 0,
})

const numberFormatter = new Intl.NumberFormat('es-ES')

export default function RegionTable({
  rows,
  selectedRegion = null,
  selectedQuarter = 'all',
  onSelectRegion,
}: RegionTableProps) {
  if (rows.length === 0) {
    return (
      <section
        style={{
          border: '1px solid rgba(148, 163, 184, 0.35)',
          borderRadius: 12,
          padding: '1rem',
          background: 'rgba(15, 23, 42, 0.65)',
          color: '#cbd5e1',
        }}
      >
        No hay datos para los filtros seleccionados.
      </section>
    )
  }

  return (
    <section
      style={{
        border: '1px solid rgba(148, 163, 184, 0.35)',
        borderRadius: 12,
        overflow: 'hidden',
        background: 'rgba(15, 23, 42, 0.65)',
      }}
    >
      <div style={{ overflowX: 'auto' }}>
        <table style={{ width: '100%', borderCollapse: 'collapse', minWidth: 760 }}>
          <thead>
            <tr style={{ background: 'rgba(30, 41, 59, 0.8)', textAlign: 'left' }}>
              <HeaderCell>Región</HeaderCell>
              <HeaderCell isActive={selectedQuarter === 'Q1'}>Q1</HeaderCell>
              <HeaderCell isActive={selectedQuarter === 'Q2'}>Q2</HeaderCell>
              <HeaderCell isActive={selectedQuarter === 'Q3'}>Q3</HeaderCell>
              <HeaderCell isActive={selectedQuarter === 'Q4'}>Q4</HeaderCell>
              <HeaderCell>Total anual</HeaderCell>
              <HeaderCell>Pedidos</HeaderCell>
              <HeaderCell>Ticket prom.</HeaderCell>
            </tr>
          </thead>
          <tbody>
            {rows.map((row) => {
              const isSelected = selectedRegion === row.region
              return (
                <tr
                  key={row.region}
                  style={{
                    background: isSelected ? 'rgba(14, 165, 233, 0.18)' : 'transparent',
                  }}
                >
                  <BodyCell>
                    <button
                      type="button"
                      onClick={() => onSelectRegion?.(row.region)}
                      style={{
                        border: 'none',
                        background: 'transparent',
                        color: '#f8fafc',
                        fontWeight: 700,
                        cursor: onSelectRegion ? 'pointer' : 'default',
                        padding: 0,
                      }}
                    >
                      {row.region}
                    </button>
                  </BodyCell>
                  <BodyCell>{currencyFormatter.format(row.q1)}</BodyCell>
                  <BodyCell>{currencyFormatter.format(row.q2)}</BodyCell>
                  <BodyCell>{currencyFormatter.format(row.q3)}</BodyCell>
                  <BodyCell>{currencyFormatter.format(row.q4)}</BodyCell>
                  <BodyCell>{currencyFormatter.format(row.total)}</BodyCell>
                  <BodyCell>{numberFormatter.format(row.orders)}</BodyCell>
                  <BodyCell>{currencyFormatter.format(row.avgTicket)}</BodyCell>
                </tr>
              )
            })}
          </tbody>
        </table>
      </div>
    </section>
  )
}

function HeaderCell({ children, isActive = false }: { children: ReactNode; isActive?: boolean }) {
  return (
    <th
      style={{
        padding: '0.8rem 0.75rem',
        borderBottom: '1px solid rgba(148, 163, 184, 0.35)',
        color: isActive ? '#67e8f9' : '#cbd5e1',
        fontSize: 13,
        fontWeight: 700,
        letterSpacing: '0.01em',
      }}
    >
      {children}
    </th>
  )
}

function BodyCell({ children }: { children: ReactNode }) {
  return (
    <td
      style={{
        padding: '0.8rem 0.75rem',
        borderBottom: '1px solid rgba(148, 163, 184, 0.2)',
        color: '#e2e8f0',
        fontSize: 14,
      }}
    >
      {children}
    </td>
  )
}
