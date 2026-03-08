"use client"

import { type CSSProperties, useCallback, useMemo, useState } from "react"

import {
  DASHBOARD_VIEWS,
  QUARTERS,
  defaultSalesFilters,
  type DashboardView,
  type SalesFilters,
} from "../lib/mock-data"

interface FiltersPanelProps {
  filters: SalesFilters
  years: number[]
  regions: string[]
  onFiltersChange: (nextFilters: SalesFilters) => void
}

interface UseDashboardFiltersOptions {
  years?: number[]
  regions?: string[]
  initialFilters?: Partial<SalesFilters>
}

const panelStyle: Record<string, CSSProperties> = {
  container: {
    border: "1px solid #e5e7eb",
    borderRadius: 12,
    padding: "1rem",
    display: "grid",
    gap: "1rem",
    backgroundColor: "#ffffff",
  },
  section: {
    display: "grid",
    gap: "0.5rem",
  },
  title: {
    margin: 0,
    fontSize: "0.95rem",
    fontWeight: 600,
  },
  horizontalGroup: {
    display: "flex",
    gap: "0.5rem",
    flexWrap: "wrap",
  },
  pillButton: {
    border: "1px solid #d1d5db",
    borderRadius: 999,
    backgroundColor: "#f9fafb",
    padding: "0.35rem 0.75rem",
    cursor: "pointer",
    fontSize: "0.85rem",
  },
  activePillButton: {
    borderColor: "#2563eb",
    backgroundColor: "#dbeafe",
    color: "#1e3a8a",
  },
  selects: {
    display: "grid",
    gap: "0.75rem",
    gridTemplateColumns: "repeat(auto-fit, minmax(150px, 1fr))",
  },
  field: {
    display: "grid",
    gap: "0.35rem",
    fontSize: "0.9rem",
  },
  input: {
    border: "1px solid #d1d5db",
    borderRadius: 8,
    padding: "0.45rem 0.55rem",
    fontSize: "0.9rem",
  },
}

function mergeFilters(initialFilters?: Partial<SalesFilters>): SalesFilters {
  return {
    ...defaultSalesFilters,
    ...initialFilters,
    selectedRegions: initialFilters?.selectedRegions ?? defaultSalesFilters.selectedRegions,
  }
}

export function useDashboardFilters(options: UseDashboardFiltersOptions = {}) {
  const [filters, setFilters] = useState<SalesFilters>(() => mergeFilters(options.initialFilters))

  const years = useMemo(() => [...(options.years ?? [])].sort((a, b) => b - a), [options.years])
  const regions = useMemo(() => [...(options.regions ?? [])].sort((a, b) => a.localeCompare(b)), [options.regions])

  const setView = useCallback((view: DashboardView) => {
    setFilters((prev) => ({
      ...prev,
      view,
      selectedRegion: view === "summary" ? null : prev.selectedRegion,
    }))
  }, [])

  const setSelectedYear = useCallback((selectedYear: SalesFilters["selectedYear"]) => {
    setFilters((prev) => ({ ...prev, selectedYear }))
  }, [])

  const setSelectedQuarter = useCallback((selectedQuarter: SalesFilters["selectedQuarter"]) => {
    setFilters((prev) => ({ ...prev, selectedQuarter }))
  }, [])

  const setMinRevenue = useCallback((minRevenue: number) => {
    setFilters((prev) => ({ ...prev, minRevenue }))
  }, [])

  const toggleRegion = useCallback((region: string) => {
    setFilters((prev) => {
      const exists = prev.selectedRegions.includes(region)
      const selectedRegions = exists
        ? prev.selectedRegions.filter((value) => value !== region)
        : [...prev.selectedRegions, region]
      const selectedRegion = selectedRegions.includes(prev.selectedRegion ?? "")
        ? prev.selectedRegion
        : selectedRegions[0] ?? null

      return {
        ...prev,
        selectedRegions,
        selectedRegion: prev.view === "detail" ? selectedRegion : prev.selectedRegion,
      }
    })
  }, [])

  const setSelectedRegion = useCallback((selectedRegion: string | null) => {
    setFilters((prev) => ({ ...prev, selectedRegion }))
  }, [])

  const resetFilters = useCallback(() => {
    setFilters(mergeFilters(options.initialFilters))
  }, [options.initialFilters])

  return {
    filters,
    years,
    regions,
    setFilters,
    setView,
    setSelectedYear,
    setSelectedQuarter,
    setMinRevenue,
    toggleRegion,
    setSelectedRegion,
    resetFilters,
  }
}

export function FiltersPanel({ filters, years, regions, onFiltersChange }: FiltersPanelProps) {
  const sortedYears = useMemo(() => [...years].sort((a, b) => b - a), [years])
  const sortedRegions = useMemo(() => [...regions].sort((a, b) => a.localeCompare(b)), [regions])

  const patchFilters = useCallback(
    (patch: Partial<SalesFilters>) => {
      onFiltersChange({ ...filters, ...patch })
    },
    [filters, onFiltersChange],
  )

  const handleRegionToggle = useCallback(
    (region: string) => {
      const isSelected = filters.selectedRegions.includes(region)
      const nextSelectedRegions = isSelected
        ? filters.selectedRegions.filter((value) => value !== region)
        : [...filters.selectedRegions, region]
      const selectedRegion = nextSelectedRegions.includes(filters.selectedRegion ?? "")
        ? filters.selectedRegion
        : nextSelectedRegions[0] ?? null

      patchFilters({
        selectedRegions: nextSelectedRegions,
        selectedRegion: filters.view === "detail" ? selectedRegion : filters.selectedRegion,
      })
    },
    [filters.selectedRegion, filters.selectedRegions, filters.view, patchFilters],
  )

  return (
    <section style={panelStyle.container} aria-label="Sales dashboard filters">
      <div style={panelStyle.section}>
        <p style={panelStyle.title}>Vista</p>
        <div style={panelStyle.horizontalGroup}>
          {DASHBOARD_VIEWS.map((view) => (
            <button
              key={view}
              type="button"
              style={{
                ...panelStyle.pillButton,
                ...(filters.view === view ? panelStyle.activePillButton : {}),
              }}
              onClick={() =>
                patchFilters({
                  view,
                  selectedRegion: view === "summary" ? null : filters.selectedRegion,
                })
              }
            >
              {view === "summary" ? "Resumen" : "Detalle"}
            </button>
          ))}
        </div>
      </div>

      <div style={panelStyle.selects}>
        <label style={panelStyle.field}>
          <span>Año</span>
          <select
            style={panelStyle.input}
            value={filters.selectedYear}
            onChange={(event) =>
              patchFilters({
                selectedYear: event.target.value === "all" ? "all" : Number(event.target.value),
              })
            }
          >
            <option value="all">Todos</option>
            {sortedYears.map((year) => (
              <option key={year} value={year}>
                {year}
              </option>
            ))}
          </select>
        </label>

        <label style={panelStyle.field}>
          <span>Trimestre</span>
          <select
            style={panelStyle.input}
            value={filters.selectedQuarter}
            onChange={(event) =>
              patchFilters({
                selectedQuarter: event.target.value as SalesFilters["selectedQuarter"],
              })
            }
          >
            <option value="all">Todos</option>
            {QUARTERS.map((quarter) => (
              <option key={quarter} value={quarter}>
                {quarter}
              </option>
            ))}
          </select>
        </label>

        <label style={panelStyle.field}>
          <span>Ingreso mínimo por registro</span>
          <input
            style={panelStyle.input}
            type="number"
            min={0}
            step={50_000}
            value={filters.minRevenue}
            onChange={(event) => patchFilters({ minRevenue: Number(event.target.value) || 0 })}
          />
        </label>

        {filters.view === "detail" && (
          <label style={panelStyle.field}>
            <span>Región activa</span>
            <select
              style={panelStyle.input}
              value={filters.selectedRegion ?? ""}
              onChange={(event) => patchFilters({ selectedRegion: event.target.value || null })}
            >
              <option value="">Seleccionar región</option>
              {sortedRegions.map((region) => (
                <option key={region} value={region}>
                  {region}
                </option>
              ))}
            </select>
          </label>
        )}
      </div>

      <div style={panelStyle.section}>
        <p style={panelStyle.title}>Regiones</p>
        <div style={panelStyle.horizontalGroup}>
          {sortedRegions.map((region) => {
            const isSelected = filters.selectedRegions.includes(region)
            return (
              <button
                key={region}
                type="button"
                style={{
                  ...panelStyle.pillButton,
                  ...(isSelected ? panelStyle.activePillButton : {}),
                }}
                onClick={() => handleRegionToggle(region)}
              >
                {region}
              </button>
            )
          })}
        </div>
      </div>
    </section>
  )
}

export default FiltersPanel
