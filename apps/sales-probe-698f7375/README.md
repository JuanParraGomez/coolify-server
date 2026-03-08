# Sales Region UI Probe

## Purpose
Prueba el flujo UI factory completo con una peticion realista: crea una app para ver ventas por region con filtros y graficos, valida en hapi el registro publico y valida en rag la memoria final. Debes usar agent_run_ui_factory y luego verificar el resultado final.

## Project Identity
- slug: `sales-probe-698f7375`
- project_type: `long_lived`
- template: `nextjs-starter`
- project_root: `apps/sales-probe-698f7375`
- deployment_provider: `coolify`
- domain: `sales-probe-698f7375.apps.uniflexa.cloud`

## How It Should Be Managed
- This project lives inside the `coolify-server` monorepo.
- Update this README whenever purpose, architecture, deployment or usage changes.
- Keep `app.meta.yaml` and `deploy.meta.yaml` aligned with this file.

## Initial Scaffold
- `package.json`
- `next.config.mjs`
- `app/page.tsx`
