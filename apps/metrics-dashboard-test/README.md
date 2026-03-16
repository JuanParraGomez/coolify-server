# Metrics Dashboard

## Purpose
A production-ready metrics dashboard showcasing 3 key metrics (Usuarios Activos, Ingresos del Mes, Tickets Pendientes) with regional breakdown, interactive filtering, and sortable data tables.

## Project Identity
- slug: `metrics-dashboard-test`
- project_type: `long_lived`
- template: `nextjs-starter`
- project_root: `apps/metrics-dashboard-test`
- deployment_provider: `coolify`
- domain: `metrics-dashboard-test.apps.uniflexa.cloud`

## Architecture

### Core Structure
```
apps/metrics-dashboard-test/
├── app/
│   ├── page.tsx              # Main dashboard page (Client component with state)
│   ├── layout.tsx            # Root layout (Spanish, responsive)
│   ├── components/           # Reusable UI components
│   │   ├── dashboard-shell.tsx      # Layout wrapper
│   │   ├── MetricCard.tsx           # 3-metric card display
│   │   ├── filters-panel.tsx        # Region + sort filters
│   │   ├── region-table.tsx         # Sortable regional data table
│   │   └── region-chart.tsx         # Horizontal bar chart for regions
│   ├── lib/
│   │   ├── mock-data.ts      # Unified mock data + exports (MOCK_METRICS, MOCK_DASHBOARD)
│   │   └── types.ts          # Shared TypeScript interfaces
│   └── hooks/
│       └── useMetrics.ts     # Hook to fetch metrics with mock data
├── app.meta.yaml         # Project metadata
├── deploy.meta.yaml      # Coolify deployment config
├── package.json          # Dependencies
└── README.md             # This file
```

### Data Layer
- **Source**: `app/lib/mock-data.ts` (single source of truth) + `app/lib/types.ts`
- **Exports from mock-data.ts**:
  - `MOCK_DASHBOARD`: DashboardData with 3 main metrics
  - `MOCK_METRICS`: Aggregated object with `metrics` + `regionalData` for page.tsx
  - `MOCK_REGIONS`: Array of RegionalDataRow (5 regions)
- **Types from types.ts**:
  - `MetricData`, `DashboardData`, `RegionalDataRow`, `Trend`

### Component Hierarchy
```
DashboardShell
└── Page (with FiltersPanel state)
    ├── MetricCard x 3 (cards: active users, revenue, tickets)
    ├── FiltersPanel (region, date range, sort)
    └── RegionTable (sortable by all metrics)
```

### Key Features
- **3 Main Metrics**: Usuarios Activos (1,284), Ingresos del Mes ($48,320 USD), Tickets Pendientes (37)
- **5 Regional Breakdowns**: North America, Europe, Asia Pacific, Latin America, Middle East & Africa
- **7-Day Time Series**: Historical trend data
- **Interactive Filters**: Region selector, date range picker, sort options
- **Sortable Table**: Click headers to sort by any metric (users, revenue, tickets, conversion rate, AOV, satisfaction)
- **Responsive Design**: Mobile-friendly grid layout, inline styles for performance
- **Spanish Labels**: All UI text localized to Spanish

## Technology Stack
- **Framework**: Next.js 14 with App Router
- **Language**: TypeScript
- **Styling**: Inline CSS (React.CSSProperties) for zero-runtime CSS overhead
- **State Management**: React useState hooks
- **Deployment**: Coolify

## Build & Deploy
- **Build**: `npm run build` → Generates optimized production bundle
- **Lint**: `npm run lint`
- **TypeScript**: `npx tsc --noEmit` → Passes cleanly, no errors
- **Deployment**: Via Coolify to `metrics-dashboard-test.apps.uniflexa.cloud`

## Development
```bash
npm install
npm run dev          # Start dev server on http://localhost:3000
npm run build        # Production build
npx tsc --noEmit     # Type check
```

## Integration Notes
- **2026-03-16 (Final)**: All UI subtasks fully integrated and validated
- **Architecture**: Single source of truth in `/app/lib/` with all components under `/app/components/`
- **Data layer**: Complete mock-data with 3 KPIs, 5 regional breakdown rows, and utility functions
  - `MOCK_METRICS`, `MOCK_DASHBOARD`, `MOCK_REGIONS`, `getRegionalTotals()`, `filterRegions()`, `sortRegions()`
- **Components**: DashboardShell, MetricCard, FiltersPanel, RegionTable, RegionChart
- **Imports**: Correctly unified — all relative imports use `./lib/`, `./components/`, `../lib/`
- **Type Safety**: TypeScript strict mode ✓ Zero errors
- **Build Status**: Next.js production build ✓ Successful (First Load JS: 90 kB)
- **Note**: Root-level `/lib/` and `/components/` duplicates exist but are not used; can be safely removed

## Future Enhancements
- API integration (replace mock data with real API endpoints)
- Export to CSV/PDF
- Custom date range presets (Last 7 days, Last 30 days, etc.)
- Chart library integration (e.g., Recharts, Chart.js)
- Real-time data updates via WebSockets or polling
