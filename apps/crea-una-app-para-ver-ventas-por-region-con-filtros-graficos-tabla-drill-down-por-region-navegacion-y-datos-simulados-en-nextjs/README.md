# Crea Una App Para Ver Ventas Por Region Con Filtros Graficos Tabla Drill Down Por Region Navegacion Y Datos Simulados En Nextjs

## Purpose
crea una app para ver ventas por region con filtros, graficos, tabla, drill-down por region, navegacion y datos simulados en Next.js

## Project Identity
- slug: `crea-una-app-para-ver-ventas-por-region-con-filtros-graficos-tabla-drill-down-por-region-navegacion-y-datos-simulados-en-nextjs`
- project_type: `long_lived`
- template: `nextjs-starter`
- project_root: `apps/crea-una-app-para-ver-ventas-por-region-con-filtros-graficos-tabla-drill-down-por-region-navegacion-y-datos-simulados-en-nextjs`
- deployment_provider: `coolify`
- domain: `crea-una-app-para-ver-ventas-por-region-con-filtros-graficos-tabla-drill-down-por-region-navegacion-y-datos-simulados-en-nextjs.apps.uniflexa.cloud`

## How It Should Be Managed
- This project lives inside the `coolify-server` monorepo.
- Update this README whenever purpose, architecture, deployment or usage changes.
- Keep `app.meta.yaml` and `deploy.meta.yaml` aligned with this file.

## Implemented UI
- Application shell with persistent navigation rail and responsive content frame.
- Shared live filters for period, channel and performance health.
- KPI summary cards for revenue, margin, orders and pipeline.
- SVG charts for regional comparison and selected-region trend.
- Interactive regional table synchronized with cards, charts and drill-down.
- Regional drill-down with channel mix, key accounts, alerts and tactical notes.
- Simulated data centralized in a shared module so the app works without external APIs.

## Architecture
- `app/layout.tsx`: root layout and page metadata.
- `app/page.tsx`: app entrypoint that mounts the shell and dashboard.
- `app/globals.css`: global styling and responsive layout.
- `components/dashboard-shell.tsx`: outer shell, rail navigation and application frame.
- `components/sales-dashboard.tsx`: client-side dashboard orchestration and shared state.
- `components/filters-panel.tsx`: reusable controls for period, channel and health filters.
- `components/region-chart.tsx`: summary cards, charts, regional navigation and drill-down.
- `components/region-table.tsx`: interactive regional comparison table.
- `lib/mock-data.ts`: shared mock dataset, formatting helpers and derivation logic.
- `next.config.mjs`: standalone Next.js output for deployment.

## Local Usage
- Install dependencies with `npm install`.
- Start development with `npm run dev`.
- Build for validation with `npm run build`.
- Production start command remains `npm run start`.

## Deployment
- Provider: `coolify`
- App type: `nextjs`
- Base directory: `/apps/crea-una-app-para-ver-ventas-por-region-con-filtros-graficos-tabla-drill-down-por-region-navegacion-y-datos-simulados-en-nextjs`
- Environment profile: `production`

## Validation Notes
- The sandbox used for this update does not include `node`/`npm`, so an actual Next.js build could not be executed here.
- The project was left ready for validation in a normal Node-enabled environment.
