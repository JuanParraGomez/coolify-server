# Sales Region UI Probe

## Purpose
Dashboard Next.js para revisar ventas por region con filtros interactivos, metricas
ejecutivas, graficos y tabla operativa sin dependencias externas.

## Project Identity
- slug: `sales-probe-f5ea4e86`
- project_type: `long_lived`
- template: `nextjs-starter`
- project_root: `apps/sales-probe-f5ea4e86`
- deployment_provider: `coolify`
- domain: `sales-probe-f5ea4e86.apps.uniflexa.cloud`

## How It Should Be Managed
- This project lives inside the `coolify-server` monorepo.
- Update this README whenever purpose, architecture, deployment or usage changes.
- Keep `app.meta.yaml` and `deploy.meta.yaml` aligned with this file.

## Experience
- Hero con resumen ejecutivo y checklist de validacion local vs. verificaciones externas.
- Filtros por trimestre, canal, producto, busqueda por region y foco en cuentas con riesgo.
- KPI cards para revenue, attainment, average deal, win rate, pipeline cover y orders.
- Graficos custom de revenue por region, tendencia trimestral y mix por canal.
- Tabla regional agregada para seguimiento operativo.

## Data Strategy
- Datos simulados deterministas generados en cliente para evitar dependencias de red.
- El dashboard agrega revenue, target, pipeline, orders y win rate por region y trimestre.
- No usa librerias de charts; los graficos se resuelven con CSS y SVG.

## Validation Notes
- El comando `agent_run_ui_factory` no esta disponible en este workspace.
- La verificacion real en `hapi` y `rag` queda pendiente de ejecutarse desde el orquestador
  externo o con conectividad a esos servicios.
- El proyecto local queda listo para `npm install && npm run build`.

## Files
- `package.json`
- `next.config.mjs`
- `deploy.meta.yaml`
- `app/layout.tsx`
- `app/page.tsx`
- `app/globals.css`
- `components/sales-dashboard.tsx`
- `tsconfig.json`
- `next-env.d.ts`
