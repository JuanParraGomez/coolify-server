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
- Executive sales dashboard focused on regional performance.
- Live filters for period, channel and performance health.
- KPI summary cards for revenue, margin, orders and pipeline.
- Regional navigation cards that drive drill-down state.
- SVG charts for regional comparison and selected-region trend.
- Operational table by subregion with deltas, conversion and pipeline.
- Regional drill-down with channel mix, key accounts, alerts and actions.
- Simulated data embedded in the UI so the project works without external APIs.

## Architecture
- `app/layout.tsx`: root layout and page metadata.
- `app/page.tsx`: app entrypoint.
- `app/globals.css`: global styling and responsive layout.
- `components/sales-dashboard.tsx`: client-side dashboard logic, filters and data visualizations.
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
