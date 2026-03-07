Se usaron archivos oficiales de Coolify adaptados manualmente para no ejecutar el instalador one-liner.

Motivo:
- el instalador oficial puede tocar daemon.json y reiniciar Docker
- eso era incompatible con el requisito de no alterar el stack actual del VPS
