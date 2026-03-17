# Crear Y Desplegar Una App Web

## Purpose
Crear y desplegar una app web mínima “Hola Mundo” para validar que el flujo de creación de apps funciona. Requisitos: una sola página con texto grande “Hola Mundo”; endpoint health opcional; deploy público accesible; al final entregar el link/URL pública para verla. Mantenerlo simple (stack por defecto del sistema) y documentar brevemente cómo redeploy/actualizar.

## Project Identity
- slug: `crear-y-desplegar-una-app-web`
- project_type: `long_lived`
- template: `react-starter`
- project_root: `apps/crear-y-desplegar-una-app-web`
- deployment_provider: `coolify`
- domain: `crear-y-desplegar-una-app-web.apps.uniflexa.cloud`

## How It Should Be Managed
- This project lives inside the `coolify-server` monorepo.
- Update this README whenever purpose, architecture, deployment or usage changes.
- Keep `app.meta.yaml` and `deploy.meta.yaml` aligned with this file.

## Files
- `package.json` — React 18 + Vite 5 deps
- `index.html` — entry point
- `src/main.jsx` — single-page "Hola Mundo" component

## Redeploy / Update
Coolify autodeploy is enabled. Any push to `main` triggers a new build automatically.

Manual redeploy:
1. Edit files in `apps/crear-y-desplegar-una-app-web/`
2. Commit and push to `main`
3. Coolify picks up the change and rebuilds

Local preview:
```bash
cd apps/crear-y-desplegar-una-app-web
npm install
npm run dev
```

Public URL: https://crear-y-desplegar-una-app-web.apps.uniflexa.cloud
