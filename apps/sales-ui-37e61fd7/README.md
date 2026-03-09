# Sales Region UI

## Purpose
crea una app para ver ventas por region con filtros y graficos

## Project Identity
- slug: `sales-ui-37e61fd7`
- project_type: `long_lived`
- template: `nextjs-starter`
- project_root: `apps/sales-ui-37e61fd7`
- deployment_provider: `coolify`
- domain: `sales-ui-37e61fd7.apps.uniflexa.cloud`

## How It Should Be Managed
- This project lives inside the `coolify-server` monorepo.
- Update this README whenever purpose, architecture, deployment or usage changes.
- Keep `app.meta.yaml` and `deploy.meta.yaml` aligned with this file.

## Initial Scaffold
- `package.json`
- `next.config.mjs`
- `app/page.tsx`

## Running locally
1. cd apps/sales-ui-37e61fd7
2. npm install
3. npm run dev

Open http://localhost:3000 to view the dashboard.

## Notes
- The UI components live under `components/` and mock data utilities under `lib/`.
- Keep `app.meta.yaml` and `deploy.meta.yaml` in sync with the README when updating project metadata or deployment settings.
