# MAPA_DE_PUERTOS_Y_REDES

## Puertos existentes en VPS antes del ui-platform
- `22` ssh
- `80` traefik actual
- `443` traefik actual
- `6333` qdrant-backup
- `6334` qdrant-backup
- `6379` redis-backup (loopback)
- `27018` canondock-mongo (loopback)

## Puertos elegidos para ui-platform
- `18000` Coolify control plane
- `16001` Soketi realtime
- `16002` Soketi metrics/ready
- `18081` reservado para demo app de puerto alto

## Red Docker dedicada
- `ui_platform_coolify`
- `proxy` compartida solo para publicar el panel admin en el `traefik` existente

## Contenedores ui-platform
- `ui-platform-coolify`
- `ui-platform-coolify-db`
- `ui-platform-coolify-redis`
- `ui-platform-coolify-realtime`

## Conflicto relevante
- el proxy público actual del VPS está en `80/443`
- por eso el ui-platform quedó deliberadamente fuera de esos puertos
- el panel admin ya quedó integrado por host dedicado:
  - `botmanager.uniflexa.cloud`
  - `projects.uniflexa.cloud`
- cualquier despliegue público real de apps por wildcard todavía necesita una fase 2 o una IP/VPS dedicado
