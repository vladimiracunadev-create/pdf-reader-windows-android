# Developing

Consulta [docs/architecture.md](docs/architecture.md), [docs/runbook.md](docs/runbook.md) y [CONTRIBUTING.md](CONTRIBUTING.md).

Flujo mínimo:

```bash
npm ci
npm run check
npm run build:pages
```

No se aceptan funciones que modifiquen el PDF original dentro del alcance base del producto.
