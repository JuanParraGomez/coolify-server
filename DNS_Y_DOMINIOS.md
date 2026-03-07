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
No activado todavía para apps publicadas por Coolify.

Motivo:
- `80/443` del VPS actual están ocupados por el `traefik` existente
- activar wildcard real hoy implicaría tocar ese proxy
- eso rompería la regla de aislamiento estricto

## URL temporal actual del control plane
- `http://72.61.2.9:18000`

## Siguiente paso exacto para wildcard real
Elegir una de estas dos:
1. Migrar la fábrica UI a un VPS/IP dedicado y apuntar wildcard allí.
2. Integrar el `traefik` actual con el proxy que Coolify gestione para `*.apps.midominio.com`.

## Verificación DNS futura
- `dig apps.midominio.com`
- `dig demo.apps.midominio.com`
- verificar que resuelvan a `72.61.2.9`
