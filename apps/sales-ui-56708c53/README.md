# Sales Region UI

## Purpose
crea una app para ver ventas por region con filtros y graficos

## Project Identity
- slug: `sales-ui-56708c53`
- project_type: `long_lived`
- template: `nextjs-starter`
- project_root: `apps/sales-ui-56708c53`
- deployment_provider: `coolify`
- domain: `sales-ui-56708c53.apps.uniflexa.cloud`

## How It Should Be Managed
- This project lives inside the `coolify-server` monorepo.
- Update this README whenever purpose, architecture, deployment or usage changes.
- Keep `app.meta.yaml` and `deploy.meta.yaml` aligned with this file.

## Initial Scaffold
- `package.json`
- `next.config.mjs`
- `app/page.tsx`

## Run & Validate

To run the local UI for validation (requires Node and Next installed in your environment):

- cd apps/sales-ui-56708c53
- npm install
- npm run dev

The app includes these components: `components/dashboard-shell.tsx`, `components/filters-panel.tsx`, `components/region-chart.tsx`, `components/region-table.tsx` and mock data in `lib/mock-data.ts`.
