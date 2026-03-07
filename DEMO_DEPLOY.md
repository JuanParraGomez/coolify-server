# DEMO_DEPLOY

## Objetivo
Desplegar una app demo mínima sin tocar `80/443`.

## Estrategia elegida
- usar Coolify API
- crear app demo de tipo Dockerfile
- exponerla por puerto alto `18081`
- no depender del proxy público actual

## Estado
- control plane listo
- API lista
- servidor local del VPS registrado y usable
- `destination_uuid` resuelto
- script de creación demo preparado en `scripts/vps_create_demo_app.py`

## URL validada de demo
- `http://72.61.2.9:18081`
- app uuid: `n80g8kkcgog8o00404csswo4`

## Dominio temporal generado por Coolify
- `https://n80g8kkcgog8o00404csswo4.72.61.2.9.sslip.io`
- hoy responde `404` porque el `traefik` público actual de `80/443` no está integrado con las rutas dinámicas de Coolify

## Límite conocido
La estrategia principal del proyecto sigue siendo subdominios.

Esta demo por puerto alto existe solo para:
- validar bootstrap técnico
- comprobar que Coolify puede crear y publicar una UI mínima sin tocar el proxy actual
