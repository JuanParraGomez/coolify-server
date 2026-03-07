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

## Contenedores ui-platform
- `ui-platform-coolify`
- `ui-platform-coolify-db`
- `ui-platform-coolify-redis`
- `ui-platform-coolify-realtime`

## Conflicto relevante
- el proxy público actual del VPS está en `80/443`
- por eso el ui-platform quedó deliberadamente fuera de esos puertos
- cualquier despliegue público real por subdominio necesita una fase 2 de integración o una IP/VPS dedicado
