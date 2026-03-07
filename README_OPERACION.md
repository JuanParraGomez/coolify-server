# README_OPERACION

## Estado actual
- VPS auditado antes de instalar.
- Coolify instalado en modo aislado.
- Stack actual preservado.
- Coolify control plane levantado en `http://72.61.2.9:18000`.
- Ruta de administración preparada detrás del `traefik` actual:
  - `https://projects.uniflexia.cloud/login`
  - `https://projects.uniflexa.cloud/login`
- Soketi aislado en `16001` y `16002`.
- Red dedicada: `ui_platform_coolify`.
- Raíz operativa: `/opt/ui-platform`.

## Hallazgos de auditoría previos
- Host: `srv1234660`
- SO: Ubuntu kernel `6.8.0-90-generic`
- CPU: `2 vCPU`
- RAM: `7.8 GiB`
- Disco raíz: `96G`, usados `39G`, libres `58G`
- Firewall `ufw`: inactivo
- Puertos ocupados antes de instalar:
  - `22` ssh
  - `80/443` traefik actual
  - `6333/6334` qdrant-backup
  - `6379` redis-backup en loopback
  - `27018` canondock-mongo en loopback
- Contenedores existentes antes de instalar:
  - `traefik`
  - `n8n`
  - `remotion_app`
  - `qdrant-backup`
  - `redis-backup`
  - `canondock-mongo`

## Decisión técnica crítica
No se usó el instalador one-liner de Coolify.

Motivo:
- el script oficial puede tocar `/etc/docker/daemon.json`
- puede reiniciar Docker
- eso violaba la restricción de no tocar el stack actual del VPS

Se usaron archivos oficiales de Coolify adaptados a:
- rutas aisladas en `/opt/ui-platform/coolify`
- puertos altos
- red Docker dedicada

## Rutas creadas
- `/opt/ui-platform/coolify/source`
- `/opt/ui-platform/coolify/data`
- `/opt/ui-platform/apps`
- `/opt/ui-platform/templates`
- `/opt/ui-platform/registry`
- `/opt/ui-platform/docs`
- `/opt/ui-platform/scripts`

## Archivos sensibles en VPS
- `/opt/ui-platform/coolify/source/.env`
- `/opt/ui-platform/docs/INITIAL_ACCESS.txt`
- `/opt/ui-platform/docs/API_BOOTSTRAP_TOKEN.txt`

Todos quedaron root-only (`600`).

## Servicios del ui-platform
- `ui-platform-coolify`
- `ui-platform-coolify-db`
- `ui-platform-coolify-redis`
- `ui-platform-coolify-realtime`

## Health y validación
- API health interno Coolify: `GET /api/health`
- URL temporal control plane: `http://72.61.2.9:18000`
- URL objetivo de administración:
  - `https://projects.uniflexia.cloud/login`
  - `https://projects.uniflexa.cloud/login`
- Registro inicial ya completado.
- API de Coolify habilitada.
- VPS registrado como servidor manejado dentro de Coolify.

## Backups mínimos recomendados
Respaldar:
- `/opt/ui-platform/coolify/source/.env`
- volúmenes Docker:
  - `ui-platform-coolify-db`
  - `ui-platform-coolify-redis`
- `/opt/ui-platform/docs`
- `/opt/ui-platform/coolify/data/ssh`

## Actualización segura
1. Verificar salud del panel.
2. Respaldar `.env` y volúmenes.
3. Pull de imágenes.
4. `docker compose pull && docker compose up -d` en `/opt/ui-platform/coolify/source`.
5. Verificar `GET /api/health`.

## Restore básico
1. Restaurar `.env`.
2. Restaurar volúmenes `ui-platform-coolify-db` y `ui-platform-coolify-redis`.
3. Levantar compose desde `/opt/ui-platform/coolify/source`.
4. Verificar acceso a `http://72.61.2.9:18000`.
5. Si el DNS ya apunta al VPS, verificar `https://projects.uniflexia.cloud/login` o `https://projects.uniflexa.cloud/login`.
