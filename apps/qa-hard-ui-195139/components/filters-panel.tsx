"use client";

import type { ChangeEvent } from "react";

export type DashboardFilters = {
  region: string;
  channel: string;
  segment: string;
  year: string;
  comparison: "QoQ" | "YoY";
};

type FiltersPanelProps = {
  filters: DashboardFilters;
  regionOptions: string[];
  onChange: (next: DashboardFilters) => void;
};

const CHANNELS = ["Todos", "Retail", "E-commerce", "B2B"];
const SEGMENTS = ["General", "Enterprise", "SMB", "Distribuidores"];
const YEARS = ["2026", "2025"];

export default function FiltersPanel({
  filters,
  regionOptions,
  onChange,
}: FiltersPanelProps) {
  const handleSelect =
    (key: keyof DashboardFilters) =>
    (event: ChangeEvent<HTMLSelectElement>) => {
      onChange({ ...filters, [key]: event.target.value });
    };

  return (
    <section className="filters-card">
      <header>
        <h2>Filtros ejecutivos</h2>
        <p>Segmenta el tablero por territorio, canal y tipo de cartera.</p>
      </header>
      <div className="grid">
        <label>
          <span>Region</span>
          <select value={filters.region} onChange={handleSelect("region")}>
            {regionOptions.map((region) => (
              <option key={region} value={region}>
                {region}
              </option>
            ))}
          </select>
        </label>
        <label>
          <span>Canal</span>
          <select value={filters.channel} onChange={handleSelect("channel")}>
            {CHANNELS.map((channel) => (
              <option key={channel} value={channel}>
                {channel}
              </option>
            ))}
          </select>
        </label>
        <label>
          <span>Segmento</span>
          <select value={filters.segment} onChange={handleSelect("segment")}>
            {SEGMENTS.map((segment) => (
              <option key={segment} value={segment}>
                {segment}
              </option>
            ))}
          </select>
        </label>
        <label>
          <span>Anio</span>
          <select value={filters.year} onChange={handleSelect("year")}>
            {YEARS.map((year) => (
              <option key={year} value={year}>
                {year}
              </option>
            ))}
          </select>
        </label>
      </div>
      <div className="comparison-toggle">
        <button
          type="button"
          className={filters.comparison === "QoQ" ? "active" : ""}
          onClick={() => onChange({ ...filters, comparison: "QoQ" })}
        >
          Comparativa QoQ
        </button>
        <button
          type="button"
          className={filters.comparison === "YoY" ? "active" : ""}
          onClick={() => onChange({ ...filters, comparison: "YoY" })}
        >
          Comparativa YoY
        </button>
      </div>
      <style jsx>{`
        .filters-card {
          background: linear-gradient(180deg, #121a35, #0a122a);
          border: 1px solid #243462;
          border-radius: 16px;
          padding: 1rem;
        }
        header h2 {
          margin: 0;
          font-size: 1rem;
        }
        header p {
          margin: 0.3rem 0 1rem;
          font-size: 0.84rem;
          color: #9ab0df;
        }
        .grid {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(150px, 1fr));
          gap: 0.75rem;
        }
        label {
          display: flex;
          flex-direction: column;
          gap: 0.35rem;
        }
        label span {
          font-size: 0.75rem;
          color: #90a8d8;
          text-transform: uppercase;
        }
        select {
          width: 100%;
          border-radius: 10px;
          border: 1px solid #2d3f75;
          padding: 0.55rem;
          background: #0c1738;
          color: #e8edff;
        }
        .comparison-toggle {
          margin-top: 0.8rem;
          display: inline-flex;
          border-radius: 10px;
          border: 1px solid #30467f;
          overflow: hidden;
        }
        .comparison-toggle button {
          border: none;
          background: #0c1738;
          color: #9fb6e6;
          padding: 0.45rem 0.75rem;
          font-size: 0.8rem;
          cursor: pointer;
        }
        .comparison-toggle button.active {
          background: #2d69ff;
          color: white;
          font-weight: 600;
        }
      `}</style>
    </section>
  );
}
