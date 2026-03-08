# Sales Landing Batch

## Purpose
Landing estatica de ventas por region con hero ejecutivo, tres cards regionales, una tabla corta de producto por region y un CTA final por email usando datos simulados 2024.

## Project Identity
- slug: `sales-landing-batch`
- project_type: `long_lived`
- template: `static-html-starter`
- project_root: `apps/sales-landing-batch`
- deployment_provider: `coolify`
- domain: `sales-landing-batch.apps.uniflexa.cloud`

## How It Should Be Managed
- This project lives inside the `coolify-server` monorepo.
- Update this README whenever purpose, architecture, deployment or usage changes.
- Keep `app.meta.yaml` and `deploy.meta.yaml` aligned with this file.

## UI Implementation
Single-file static landing page (`index.html`) with:
- Hero section with executive positioning and three summary stats
- Three region cards for Norte, Centro and Sur
- Six-row product-by-region table with trend badges
- Final CTA section with mailto action
- Footer with deployed domain reference

No build step is required. The app is served directly by nginx from the Docker image.

## Files
- `Dockerfile` - nginx container serving the public entrypoint only
- `index.html` - self-contained HTML and CSS for the landing page
- `app.meta.yaml` - project registry metadata
- `deploy.meta.yaml` - deployment metadata for Coolify
