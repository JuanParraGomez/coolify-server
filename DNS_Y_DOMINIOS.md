# DNS_Y_DOMINIOS

## Estrategia principal
Subdominios por app.

Formato objetivo:
- `<slug>.apps.midominio.com`

Ejemplos:
- `landing.apps.midominio.com`
- `dashboard-cliente-a.apps.midominio.com`
- `demo-react.apps.midominio.com`

## Registros DNS recomendados
Si el proveedor soporta wildcard:
- `A apps.midominio.com -> 72.61.2.9`
- `A *.apps.midominio.com -> 72.61.2.9`

Si se usa proxy/CDN:
- replicar esos registros según el proveedor
- si se quiere wildcard TLS real, usar DNS challenge

## Estado actual
- El panel administrativo quedó preparado detrás del proxy actual en:
  - `https://projects.uniflexia.cloud/login`
  - `https://projects.uniflexa.cloud/login`
- La validación interna por `Host` forzado ya responde correctamente en el VPS.
- El wildcard para apps publicadas por Coolify sigue pendiente.

Motivo:
- `80/443` del VPS actual están ocupados por el `traefik` existente
- el panel admin ya se integró sin romper el stack vivo
- el wildcard real para apps todavía requiere DNS y una segunda fase más amplia

## URL temporal actual del control plane
- `http://72.61.2.9:18000`

## Registros DNS exactos recomendados
Admin:
- `A projects.uniflexia.cloud -> 72.61.2.9`
- `A projects.uniflexa.cloud -> 72.61.2.9`

Apps futuras:
- `A *.apps.uniflexia.cloud -> 72.61.2.9`
- `A *.apps.uniflexa.cloud -> 72.61.2.9`

## Siguiente paso exacto para wildcard real
Elegir una de estas dos:
1. Migrar la fábrica UI a un VPS/IP dedicado y apuntar wildcard allí.
2. Integrar el `traefik` actual con el proxy que Coolify gestione para `*.apps.midominio.com`.

## Verificación DNS futura
- `dig apps.midominio.com`
- `dig demo.apps.midominio.com`
- verificar que resuelvan a `72.61.2.9`

## Observación importante
- `uniflexia.cloud` no resuelve hoy desde el VPS.
- `uniflexa.cloud` sí existe, pero su apex no apunta a este VPS.
- Los subdominios dedicados sí pueden apuntar a este VPS sin mover el apex.
