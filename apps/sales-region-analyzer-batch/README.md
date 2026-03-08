# Sales Region Analyzer Batch

## Purpose
crea una app para ver ventas por region con filtros, graficos, tabla, drill-down por region, navegacion y datos simulados en Next.js

## Project Identity
- slug: `sales-region-analyzer-batch`
- project_type: `long_lived`
- template: `nextjs-starter`
- project_root: `apps/sales-region-analyzer-batch`
- deployment_provider: `coolify`
- domain: `sales-region-analyzer-batch.apps.uniflexa.cloud`

## How It Should Be Managed
- This project lives inside the `coolify-server` monorepo.
- Update this README whenever purpose, architecture, deployment or usage changes.
- Keep `app.meta.yaml` and `deploy.meta.yaml` aligned with this file.

## Initial Scaffold
- `package.json`
- `next.config.mjs`
- `app/layout.tsx`
- `app/page.tsx`
- `components/dashboard-shell.tsx`
- `components/filters-panel.tsx`
- `components/region-chart.tsx`
- `components/region-table.tsx`
- `lib/mock-data.ts`

## Current UI Integration
- The app is a single-page regional sales dashboard for Next.js App Router.
- `components/dashboard-shell.tsx` composes filters, summary cards, charts, table, and drill-down.
- `lib/mock-data.ts` provides the simulated dataset and region summaries used across the UI.
- `components/filters-panel.tsx`, `components/region-chart.tsx`, and `components/region-table.tsx` share the same dataset and active selection state.

## Validation Notes
- The project now expects TypeScript tooling via `typescript`, `@types/react`, and `@types/react-dom`.
- Keep this README, `app.meta.yaml`, and `deploy.meta.yaml` aligned if the slug, domain, deployment provider, or dashboard scope changes.
