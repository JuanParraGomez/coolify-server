# COMANDOS_UTILES

## VPS audit
```bash
ssh hostinger-vps 'ss -ltnp | sed -n "1,120p"'
ssh hostinger-vps 'docker ps --format "table {{.Names}}\t{{.Status}}\t{{.Ports}}"'
ssh hostinger-vps 'docker network ls'
ssh hostinger-vps 'docker volume ls'
ssh hostinger-vps 'free -h && df -h / /opt'
```

## Coolify status
```bash
ssh hostinger-vps 'docker ps --format "table {{.Names}}\t{{.Status}}\t{{.Ports}}" | egrep "ui-platform-coolify|NAMES"'
ssh hostinger-vps 'curl -fsS http://127.0.0.1:18000/api/health'
ssh hostinger-vps 'docker logs --tail=100 ui-platform-coolify'
ssh hostinger-vps 'curl -k --resolve projects.uniflexa.cloud:443:127.0.0.1 -I https://projects.uniflexa.cloud/login'
```

## Compose control
```bash
ssh hostinger-vps 'cd /opt/ui-platform/coolify/source && docker compose -f docker-compose.yml -f docker-compose.prod.yml ps'
ssh hostinger-vps 'cd /opt/ui-platform/coolify/source && docker compose -f docker-compose.yml -f docker-compose.prod.yml up -d'
ssh hostinger-vps 'cd /opt/ui-platform/coolify/source && docker compose -f docker-compose.yml -f docker-compose.prod.yml down'
```

## Credenciales y token
```bash
ssh hostinger-vps 'sudo cat /opt/ui-platform/docs/INITIAL_ACCESS.txt'
ssh hostinger-vps 'sudo cat /opt/ui-platform/docs/API_BOOTSTRAP_TOKEN.txt'
```

## API básica
```bash
ssh hostinger-vps 'TOKEN=$(cat /opt/ui-platform/docs/API_BOOTSTRAP_TOKEN.txt); curl -sS -H "Authorization: Bearer $TOKEN" http://127.0.0.1:18000/api/v1/projects'
ssh hostinger-vps 'TOKEN=$(cat /opt/ui-platform/docs/API_BOOTSTRAP_TOKEN.txt); curl -sS -H "Authorization: Bearer $TOKEN" http://127.0.0.1:18000/api/v1/servers'
```

## Git y actualización automática
- Este repo versiona la infraestructura y la documentación de `ui-platform`.
- El panel base de Coolify no se reconstruye automáticamente desde GitHub.
- El auto-deploy desde Git aplica a las apps registradas dentro de Coolify cuando conectes cada repo GitHub/GitLab.
- Si Hostinger va a “estar pendiente de GitHub”, eso sirve para tus apps o para una pipeline aparte, no para recrear el control plane de Coolify.
