# Crea Una Landing Simple Para Ventas Por Region Con Titulo Subtitulo Tres Cards Cta Y Datos Simulados

## Purpose
Landing page estatica en espanol para mostrar ventas por region con titulo, subtitulo, tres cards con datos simulados y CTAs de conversion.

## Project Identity
- slug: `crea-una-landing-simple-para-ventas-por-region-con-titulo-subtitulo-tres-cards-cta-y-datos-simulados`
- project_type: `long_lived`
- template: `static-html-starter`
- project_root: `apps/crea-una-landing-simple-para-ventas-por-region-con-titulo-subtitulo-tres-cards-cta-y-datos-simulados`
- deployment_provider: `coolify`
- domain: `crea-una-landing-simple-para-ventas-por-region-con-titulo-subtitulo-tres-cards-cta-y-datos-simulados.apps.uniflexa.cloud`

## How It Should Be Managed
- This project lives inside the `coolify-server` monorepo.
- Update this README whenever purpose, architecture, deployment or usage changes.
- Keep `app.meta.yaml` and `deploy.meta.yaml` aligned with this file.

## UI Summary
- Hero principal con titulo, subtitulo y CTA hacia la seccion de planes.
- Tres cards regionales: Norte, Centro y Sur, cada una con ventas, crecimiento y clientes simulados.
- CTA final de contacto con correo `ventas@example.com`.
- Footer aclarando que los datos son demostrativos.

## Runtime Notes
- The deployed artifact is a single static `index.html` served by Nginx.
- `Dockerfile` copies only the public entrypoint into the runtime image.

## Files
- `Dockerfile`
- `index.html`
- `README.md`
- `app.meta.yaml`
- `deploy.meta.yaml`
