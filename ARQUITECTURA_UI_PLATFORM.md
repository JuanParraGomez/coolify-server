# ARQUITECTURA_UI_PLATFORM

## Objetivo
Plataforma separada para publicación de UIs generadas por IA, preparada para crecimiento y posterior automatización multiagente.

## Principios
- aislamiento estricto del stack actual
- despliegue por subdominios como estrategia principal futura
- Coolify como control plane
- crecimiento posterior por servicios desacoplados

## Arquitectura fase 1
- Control plane: Coolify
- Runtime base: Docker / Docker Compose en VPS existente
- Red dedicada: `ui_platform_coolify`
- Exposición temporal actual:
  - `http://72.61.2.9:18000` control plane directo
  - `https://projects.uniflexia.cloud/login` administración por proxy
  - `https://projects.uniflexa.cloud/login` administración por proxy
  - puertos altos para demos puntuales

## Arquitectura fase 2 preparada
- `ui-orchestrator`
  - recibe intención y decide template/app/deploy
- `app-registry`
  - catálogo de apps, estados, owners, dominios, repos
- `template-registry`
  - catálogo de starters React / Next / HTML / Docker
- `rag-ingestion-worker`
  - indexa changelogs, decisiones, prompts, troubleshooting
- `data-connectors`
  - conecta APIs, CMS, bases, hojas, etc.

## Límite actual
`80/443` ya están ocupados por un `traefik` existente del stack actual.

Eso implica:
- Coolify sí puede funcionar como panel de control aislado.
- Coolify no debe tomar el proxy público por defecto sin mover o integrar el `traefik` actual.
- El panel admin ya quedó enganchado al `traefik` actual por un host dedicado.
- La estrategia de wildcard subdomain queda preparada pero no activada aún para no romper nada.

## Estrategia recomendada para activar subdominios después
Opción A:
- dedicar otro VPS o IP pública a la fábrica de frontends
- Coolify controla `80/443` allí

Opción B:
- mantener este VPS
- integrar el `traefik` actual con el proxy de Coolify
- enrutar `*.apps.midominio.com` hacia el proxy de Coolify
- esto sí tocaría el stack actual y debe hacerse en una segunda fase controlada
