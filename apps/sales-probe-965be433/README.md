# Sales Region UI Probe

## Purpose
Prueba el flujo UI factory con una app sencilla: crea una landing simple para un servicio de ventas por region con titulo, subtitulo, tres cards y CTA. Usa agent_run_ui_factory y luego valida en hapi el registro publico y en rag la memoria final.

## Project Identity
- slug: `sales-probe-965be433`
- project_type: `long_lived`
- template: `static-html-starter`
- project_root: `apps/sales-probe-965be433`
- deployment_provider: `coolify`
- domain: `sales-probe-965be433.apps.uniflexa.cloud`

## How It Should Be Managed
- This project lives inside the `coolify-server` monorepo.
- Update this README whenever purpose, architecture, deployment or usage changes.
- Keep `app.meta.yaml` and `deploy.meta.yaml` aligned with this file.

## UI Implementation
Single-file static landing page (`index.html`) with:
- **Hero section**: title, subtitle, and primary CTA button ("Solicita una Demo")
- **Three region cards**: Norte, Centro, Sur — each with icon, description, and a metric badge
- **Bottom CTA section**: email link to the sales team
- **Footer**: domain reference

No build step required. Served directly by the Dockerfile's nginx or equivalent static server.

## Files
- `Dockerfile` — static server container
- `index.html` — complete landing page (self-contained CSS + HTML)
