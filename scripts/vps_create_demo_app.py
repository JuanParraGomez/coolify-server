#!/usr/bin/env python3
import base64
import json
import pathlib
import urllib.request

BASE = pathlib.Path('/opt/ui-platform/docs')
TOKEN = (BASE / 'API_BOOTSTRAP_TOKEN.txt').read_text().strip()
PROJECT_UUID = (BASE / 'project_uuid.txt').read_text().strip()
SERVER_UUID = (BASE / 'server_uuid.txt').read_text().strip()
DESTINATION_UUID = (BASE / 'destination_uuid.txt').read_text().strip()

html = """<!doctype html><html><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"><title>UI Platform Demo</title><style>body{font-family:Arial,sans-serif;margin:40px;background:#f7f7f5;color:#161616}main{max-width:720px;margin:auto;padding:32px;border:1px solid #ddd;background:white}h1{margin-top:0}</style></head><body><main><h1>UI Platform Demo</h1><p>Deployed by isolated Coolify bootstrap on the VPS.</p><p>This demo uses a high port to avoid touching the existing Traefik stack on 80/443.</p></main></body></html>"""
html_b64 = base64.b64encode(html.encode()).decode()
dockerfile_plain = f"FROM nginx:alpine\nRUN echo \"{html_b64}\" | base64 -d > /usr/share/nginx/html/index.html\nEXPOSE 80\n"
dockerfile = base64.b64encode(dockerfile_plain.encode()).decode()

payload = {
    'project_uuid': PROJECT_UUID,
    'server_uuid': SERVER_UUID,
    'environment_name': 'production',
    'destination_uuid': DESTINATION_UUID,
    'name': 'ui-platform-demo-static',
    'description': 'Temporary high-port demo app for isolated Coolify bootstrap',
    'dockerfile': dockerfile,
    'build_pack': 'dockerfile',
    'ports_exposes': '80',
    'ports_mappings': '18081:80',
    'health_check_enabled': True,
    'health_check_path': '/',
    'health_check_port': '80',
    'instant_deploy': True,
}

req = urllib.request.Request(
    'http://127.0.0.1:18000/api/v1/applications/dockerfile',
    data=json.dumps(payload).encode(),
    headers={
        'Authorization': f'Bearer {TOKEN}',
        'Content-Type': 'application/json',
    },
    method='POST',
)
try:
    with urllib.request.urlopen(req, timeout=60) as resp:
        body = resp.read().decode()
        print(body)
except urllib.error.HTTPError as exc:
    print(exc.read().decode())
    raise
