# Sales Region UI Probe

## Purpose
Prueba el flujo UI factory con una app dificil: crea una app para ver ventas por region con filtros, graficos, tabla y navegacion, valida en hapi el registro publico y valida en rag la memoria final. Usa agent_run_ui_factory y luego verifica el resultado final.

## Project Identity
- slug: `sales-probe-749af4c8`
- project_type: `long_lived`
- template: `nextjs-starter`
- project_root: `apps/sales-probe-749af4c8`
- deployment_provider: `coolify`
- domain: `sales-probe-749af4c8.apps.uniflexa.cloud`

## How It Should Be Managed
- This project lives inside the `coolify-server` monorepo.
- Update this README whenever purpose, architecture, deployment or usage changes.
- Keep `app.meta.yaml` and `deploy.meta.yaml` aligned with this file.

## Initial Scaffold
- `package.json`
- `next.config.mjs`
- `app/page.tsx`
