# coolify-server

Base aislada para publicar UIs con Coolify en el VPS, separada del stack existente.

Este repo documenta y automatiza la fase 1 de `ui-platform`:
- auditoría del VPS
- instalación aislada de Coolify
- estrategia de subdominios
- puertos y redes dedicadas
- subdominio de administración preparado en el proxy actual
- bootstrap para despliegues demo
- preparación para fase 2 (`ui-orchestrator`, `app-registry`, `template-registry`, `rag-ingestion-worker`, `data-connectors`)

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
