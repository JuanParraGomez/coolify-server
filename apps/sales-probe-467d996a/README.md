# Sales Region UI Probe

## Purpose
crea una app web de ventas por region con filtros y graficos, complejidad media, deploy en coolify y registro en hapi/rag

## Project Identity
- slug: `sales-probe-467d996a`
- project_type: `long_lived`
- template: `nextjs-starter`
- project_root: `apps/sales-probe-467d996a`
- deployment_provider: `coolify`
- domain: `sales-probe-467d996a.apps.uniflexa.cloud`

## How It Should Be Managed
- This project lives inside the `coolify-server` monorepo.
- Update this README whenever purpose, architecture, deployment or usage changes.
- Keep `app.meta.yaml` and `deploy.meta.yaml` aligned with this file.

## What was added
This branch adds a small UI probe with components under `components/` and mock data under `lib/`:
- components/dashboard-shell.tsx (client shell with sidebar and filters)
- components/filters-panel.tsx (client filters panel)
- components/region-chart.tsx (client charts using Recharts)
- components/region-table.tsx (server/client table with sparkline)
- lib/mock-data.ts (TypeScript mock data generator and filter helpers)

## Run locally
1. Install dependencies: `npm install`
2. Start dev server: `npm run dev`
3. Build for production: `npm run build` and `npm run start`

Notes:
- This project now includes TypeScript and Recharts. If you encounter type errors, run `npm install` to ensure dev dependencies are present.
- The Next.js app uses the `app/` router. Layout and client components are under `app/` and `components/` respectively.

## Initial Scaffold
- `package.json`
- `next.config.mjs`
- `app/page.tsx`
