"use client"

import { type CSSProperties, useMemo } from "react"

import { QUARTERS, type DashboardView, type RegionComparisonRow } from "../lib/mock-data"

interface RegionTableProps {
  rows: RegionComparisonRow[]
  view: DashboardView
  selectedRegion: string | null
  onRegionSelect?: (region: string) => void
}

const currencyFormatter = new Intl.NumberFormat("es-ES", {
  style: "currency",
  currency: "EUR",
  maximumFractionDigits: 0,
})

const percentageFormatter = new Intl.NumberFormat("es-ES", {
  minimumFractionDigits: 1,
  maximumFractionDigits: 1,
})

const tableStyle: Record<string, CSSProperties> = {
  container: {
    border: "1px solid #e5e7eb",
    borderRadius: 12,
    overflowX: "auto",
    backgroundColor: "#ffffff",
  },
  table: {
    width: "100%",
    borderCollapse: "collapse",
    minWidth: 860,
  },
  headerCell: {
    textAlign: "left",
    padding: "0.75rem",
    borderBottom: "1px solid #e5e7eb",
    backgroundColor: "#f8fafc",
    fontSize: "0.85rem",
    fontWeight: 700,
    whiteSpace: "nowrap",
  },
  cell: {
    padding: "0.7rem 0.75rem",
    borderBottom: "1px solid #f1f5f9",
    fontSize: "0.9rem",
    whiteSpace: "nowrap",
  },
  regionCell: {
    fontWeight: 600,
  },
}

function formatCurrency(value: number): string {
  return currencyFormatter.format(value)
}

function formatGrowth(value: number | null): string {
  if (value === null) {
    return "N/A"
  }
  const prefix = value > 0 ? "+" : ""
  return `${prefix}${percentageFormatter.format(value)}%`
}

export function RegionTable({ rows, view, selectedRegion, onRegionSelect }: RegionTableProps) {
  const visibleRows = useMemo(() => {
    if (view === "detail" && selectedRegion) {
      return rows.filter((row) => row.region === selectedRegion)
    }
    return rows
  }, [rows, selectedRegion, view])

  if (visibleRows.length === 0) {
    return (
      <div style={tableStyle.container}>
        <p style={{ margin: 0, padding: "1rem", color: "#475569" }}>
          No hay datos disponibles para los filtros seleccionados.
        </p>
      </div>
    )
  }

  return (
    <div style={tableStyle.container}>
      <table style={tableStyle.table}>
        <thead>
          <tr>
            <th style={tableStyle.headerCell}>Región</th>
            {QUARTERS.map((quarter) => (
              <th key={quarter} style={tableStyle.headerCell}>
                {quarter}
              </th>
            ))}
            <th style={tableStyle.headerCell}>Total anual</th>
            <th style={tableStyle.headerCell}>Año anterior</th>
            <th style={tableStyle.headerCell}>Variación</th>
          </tr>
        </thead>
        <tbody>
          {visibleRows.map((row) => {
            const isSelected = selectedRegion === row.region
            return (
              <tr
                key={row.region}
                style={{ backgroundColor: isSelected ? "#eff6ff" : "#ffffff", cursor: onRegionSelect ? "pointer" : "default" }}
                onClick={() => onRegionSelect?.(row.region)}
              >
                <td style={{ ...tableStyle.cell, ...tableStyle.regionCell }}>{row.region}</td>
                {QUARTERS.map((quarter) => (
                  <td key={`${row.region}-${quarter}`} style={tableStyle.cell}>
                    {formatCurrency(row.quarterRevenue[quarter])}
                  </td>
                ))}
                <td style={{ ...tableStyle.cell, fontWeight: 600 }}>{formatCurrency(row.totalRevenue)}</td>
                <td style={tableStyle.cell}>{formatCurrency(row.previousYearTotalRevenue)}</td>
                <td
                  style={{
                    ...tableStyle.cell,
                    color:
                      row.growthVsPreviousYearPct === null
                        ? "#64748b"
                        : row.growthVsPreviousYearPct >= 0
                          ? "#166534"
                          : "#991b1b",
                    fontWeight: 600,
                  }}
                >
                  {formatGrowth(row.growthVsPreviousYearPct)}
                </td>
              </tr>
            )
          })}
        </tbody>
      </table>
    </div>
  )
}

export default RegionTable
