# Security Policy

Reporta vulnerabilidades de forma privada usando GitHub Security Advisories cuando el repositorio esté publicado. No abras Issues con archivos PDF confidenciales ni datos personales. Las versiones 0.x reciben correcciones best-effort mientras el proyecto esté activo.

## Actualizaciones de dependencias por CVE

Cada cambio de versión motivado por una vulnerabilidad publicada se registra en [docs/security-updates.md](docs/security-updates.md) con su identificador CVE y GHSA, severidad, versión que corrige y la exposición real de esta aplicación. El [Changelog](CHANGELOG.md) refleja el mismo cambio en la sección `Security` de la versión correspondiente.

## Gates automáticos

- `pnpm audit --prod --audit-level high` cubre el árbol de dependencias de producción.
- `pnpm verify:runtime` consulta OSV.dev con la versión exacta de las dependencias que se distribuyen dentro de los artefactos, incluido Electron, que está declarado en `devDependencies` pero se empaqueta en el instalador de Windows. Falla si alguna tiene advisories conocidos.

Ambos forman parte de CI. El árbol completo de desarrollo acumula hallazgos en el utillaje de build que no se distribuye; se revisa en cada preparación de release y no se usa como gate. El alcance exacto está documentado en [docs/security-updates.md](docs/security-updates.md).
