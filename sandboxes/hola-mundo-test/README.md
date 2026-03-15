# hola-mundo-test

## Purpose
landing page hola mundo - titulo grande, subtitulo, fondo gradiente, html/css puro, simple y bonita

## Project Identity
- slug: `hola-mundo-test`
- project_type: `short_lived`
- template: `static-html-starter`
- project_root: `sandboxes/hola-mundo-test`
- deployment_provider: `coolify`
- domain: `hola-mundo-test.sandbox.uniflexa.cloud`

## How It Should Be Managed
- This project lives inside the `coolify-server` monorepo.
- Update this README whenever purpose, architecture, deployment or usage changes.
- Keep `app.meta.yaml` and `deploy.meta.yaml` aligned with this file.

## Initial Scaffold
- `Dockerfile`
- `index.html`

## Deployment
- Coolify should use the repository subdirectory `/sandboxes/hola-mundo-test`.
- Deployment is Dockerfile-based and serves the static page with `nginx` on port `80`.
