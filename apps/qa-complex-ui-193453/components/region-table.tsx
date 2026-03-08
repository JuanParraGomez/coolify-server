'use client'

import { Fragment, useEffect, useMemo, useState } from 'react'

import type { CountryTableRow, RegionTableRow } from '../lib/mock-data'

type RegionTableProps = {
  rows: RegionTableRow[]
}

const currencyFormatter = new Intl.NumberFormat('en-US', {
  style: 'currency',
  currency: 'USD',
  maximumFractionDigits: 0,
})

const numberFormatter = new Intl.NumberFormat('en-US')

const formatCurrency = (value: number): string => currencyFormatter.format(value)
const formatNumber = (value: number): string => numberFormatter.format(value)
const formatMargin = (revenue: number, profit: number): string =>
  `${revenue > 0 ? ((profit / revenue) * 100).toFixed(1) : '0.0'}%`
const formatDelta = (deltaPct: number): string =>
  `${deltaPct >= 0 ? '+' : ''}${deltaPct.toFixed(1)}%`

export function RegionTable({ rows }: RegionTableProps) {
  const [expandedRegion, setExpandedRegion] = useState<string | null>(rows[0]?.region ?? null)
  const [expandedCountries, setExpandedCountries] = useState<Record<string, boolean>>({})

  useEffect(() => {
    if (!expandedRegion || !rows.some((row) => row.region === expandedRegion)) {
      setExpandedRegion(rows[0]?.region ?? null)
      setExpandedCountries({})
    }
  }, [rows, expandedRegion])

  const totalRevenue = useMemo(
    () => rows.reduce((sum, row) => sum + row.revenue, 0),
    [rows],
  )
  const totalProfit = useMemo(
    () => rows.reduce((sum, row) => sum + row.profit, 0),
    [rows],
  )
  const totalUnits = useMemo(
    () => rows.reduce((sum, row) => sum + row.units, 0),
    [rows],
  )

  const toggleRegion = (region: string) => {
    setExpandedRegion((current) => (current === region ? null : region))
  }

  const toggleCountry = (region: string, country: string) => {
    const key = `${region}:${country}`
    setExpandedCountries((current) => ({
      ...current,
      [key]: !current[key],
    }))
  }

  const isCountryExpanded = (region: string, country: string): boolean =>
    expandedCountries[`${region}:${country}`] ?? false

  return (
    <section className="region-table" id="tabla-drilldown" aria-label="Tabla con drill-down por región">
      <header>
        <div>
          <p className="eyebrow">Profundidad regional</p>
          <h2>Tabla con drill-down</h2>
        </div>
        <div className="summary">
          <small>Ingresos: {formatCurrency(totalRevenue)}</small>
          <small>Unidades: {formatNumber(totalUnits)}</small>
          <small>Margen: {formatMargin(totalRevenue, totalProfit)}</small>
        </div>
      </header>

      <div className="table-wrap">
        <table>
          <thead>
            <tr>
              <th>Ubicación</th>
              <th>Ingresos</th>
              <th>Unidades</th>
              <th>Margen</th>
              <th>Delta interanual</th>
            </tr>
          </thead>
          <tbody>
            {rows.map((regionRow) => (
              <Fragment key={regionRow.region}>
                <tr
                  className={`region-row ${expandedRegion === regionRow.region ? 'is-open' : ''}`}
                  onClick={() => toggleRegion(regionRow.region)}
                >
                  <td>
                    <button type="button" aria-label={`Expandir ${regionRow.region}`}>
                      {expandedRegion === regionRow.region ? '▾' : '▸'} {regionRow.region}
                    </button>
                  </td>
                  <td>{formatCurrency(regionRow.revenue)}</td>
                  <td>{formatNumber(regionRow.units)}</td>
                  <td>{formatMargin(regionRow.revenue, regionRow.profit)}</td>
                  <td className={regionRow.deltaPct >= 0 ? 'delta-positive' : 'delta-negative'}>
                    {formatDelta(regionRow.deltaPct)}
                  </td>
                </tr>

                {expandedRegion === regionRow.region &&
                  regionRow.countries.map((countryRow) => (
                    <CountryRows
                      key={`${regionRow.region}-${countryRow.country}`}
                      region={regionRow.region}
                      countryRow={countryRow}
                      expanded={isCountryExpanded(regionRow.region, countryRow.country)}
                      onToggleCountry={() => toggleCountry(regionRow.region, countryRow.country)}
                    />
                  ))}
              </Fragment>
            ))}
          </tbody>
        </table>
      </div>

      <style jsx>{`
        .region-table {
          border: 1px solid rgba(148, 163, 184, 0.3);
          border-radius: 1rem;
          background: rgba(15, 23, 42, 0.78);
          padding: 1rem;
          display: flex;
          flex-direction: column;
          gap: 1rem;
        }

        header {
          display: flex;
          justify-content: space-between;
          align-items: flex-start;
          gap: 1rem;
          flex-wrap: wrap;
        }

        h2 {
          margin: 0.2rem 0 0;
        }

        .eyebrow {
          margin: 0;
          font-size: 0.7rem;
          letter-spacing: 0.16em;
          text-transform: uppercase;
          color: rgba(148, 163, 184, 0.9);
        }

        .summary {
          display: flex;
          flex-wrap: wrap;
          gap: 0.5rem;
        }

        .summary small {
          border: 1px solid rgba(148, 163, 184, 0.45);
          border-radius: 999px;
          padding: 0.3rem 0.65rem;
          color: #bfdbfe;
        }

        .table-wrap {
          width: 100%;
          overflow-x: auto;
        }

        table {
          width: 100%;
          border-collapse: collapse;
          min-width: 720px;
        }

        th,
        td {
          text-align: left;
          padding: 0.6rem 0.4rem;
          border-bottom: 1px solid rgba(148, 163, 184, 0.2);
          font-size: 0.9rem;
        }

        th {
          text-transform: uppercase;
          letter-spacing: 0.1em;
          font-size: 0.7rem;
          color: rgba(148, 163, 184, 0.92);
        }

        .region-row {
          cursor: pointer;
          background: rgba(15, 23, 42, 0.35);
        }

        .region-row.is-open {
          background: rgba(14, 116, 144, 0.2);
        }

        .region-row button {
          border: none;
          background: transparent;
          color: inherit;
          cursor: pointer;
          font-weight: 600;
          padding: 0;
        }

        .delta-positive {
          color: #4ade80;
          font-weight: 600;
        }

        .delta-negative {
          color: #fda4af;
          font-weight: 600;
        }
      `}</style>
    </section>
  )
}

function CountryRows({
  region,
  countryRow,
  expanded,
  onToggleCountry,
}: {
  region: string
  countryRow: CountryTableRow
  expanded: boolean
  onToggleCountry: () => void
}) {
  return (
    <>
      <tr className="country-row">
        <td>
          <button type="button" onClick={onToggleCountry} aria-label={`Expandir ${countryRow.country}`}>
            {expanded ? '▾' : '▸'} {countryRow.country}
          </button>
        </td>
        <td>{formatCurrency(countryRow.revenue)}</td>
        <td>{formatNumber(countryRow.units)}</td>
        <td>{formatMargin(countryRow.revenue, countryRow.profit)}</td>
        <td>—</td>
      </tr>
      {expanded &&
        countryRow.cities.map((cityRow) => (
          <tr key={`${region}-${countryRow.country}-${cityRow.city}`} className="city-row">
            <td>{cityRow.city}</td>
            <td>{formatCurrency(cityRow.revenue)}</td>
            <td>{formatNumber(cityRow.units)}</td>
            <td>{formatMargin(cityRow.revenue, cityRow.profit)}</td>
            <td>—</td>
          </tr>
        ))}
      <style jsx>{`
        .country-row td:first-child {
          padding-left: 1.2rem;
        }

        .country-row button {
          border: none;
          background: transparent;
          color: #cbd5e1;
          cursor: pointer;
          padding: 0;
        }

        .city-row td:first-child {
          padding-left: 2.2rem;
          color: #cbd5e1;
        }

        .city-row td {
          font-size: 0.86rem;
          color: rgba(226, 232, 240, 0.92);
        }
      `}</style>
    </>
  )
}
