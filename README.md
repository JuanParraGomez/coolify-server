# coolify-server

Base aislada para publicar UIs con Coolify en el VPS, separada del stack existente.

Este repo documenta y ahora también sirve como monorepo lógico central para proyectos UI gestionados por `hapi`.

## Raíz operativa de proyectos UI
- `apps/`: proyectos persistentes y de larga vida
- `sandboxes/`: experimentos y prototipos efímeros
- `templates/`: starters reutilizables para que la IA no improvise estructura
- `registry/projects/`: manifests YAML, fuente de verdad de proyectos
- `rag/manifests/`: manifests de sincronización documental hacia `rag-server`
- `docs/`: documentación operativa y de arquitectura de la plataforma

## Fase 1 documentada aquí
- auditoría del VPS
- instalación aislada de Coolify
- estrategia de subdominios
- puertos y redes dedicadas
- subdominio de administración preparado en el proxy actual
- bootstrap para despliegues demo
- preparación para fase 2 (`ui-orchestrator`, `app-registry`, `template-registry`, `rag-ingestion-worker`, `data-connectors`)

## Relación con hapi
`hapi` usa este repo como root central para:
- crear proyectos en `apps/<slug>` o `sandboxes/<slug>`
- generar `README.md`, `app.meta.yaml` y `deploy.meta.yaml`
- registrar cada proyecto en `registry/projects/<slug>.yaml`
- preparar despliegues por Coolify usando subdirectorios del monorepo
- sincronizar documentación útil al `rag-server`

Documentos clave:
- `README_OPERACION.md`
- `ARQUITECTURA_UI_PLATFORM.md`
- `DNS_Y_DOMINIOS.md`
- `COMANDOS_UTILES.md`
- `MAPA_DE_PUERTOS_Y_REDES.md`
- `DEMO_DEPLOY.md`

Scripts:
- `scripts/vps_create_demo_app.py`
- `scripts/vps_install_notes.md`
