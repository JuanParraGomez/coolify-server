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
