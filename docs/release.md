# Release

## Versionado
SemVer: `MAJOR.MINOR.PATCH`. Versión inicial `0.1.0`.

## Flujo
1. `main` verde.
2. Actualizar `CHANGELOG.md` y notas `docs/releases/vX.Y.Z.md`.
3. Crear tag `vX.Y.Z`.
4. Push del tag.
5. `release.yml` compila Windows y un APK Android release.
6. El workflow alinea, firma y audita el APK.
7. GitHub Release publica `.exe`, `.apk` y `SHA256SUMS.txt`.

## Distribución
- Windows: assets de GitHub Releases; no versionar `.exe` en el repositorio ni servirlo desde GitHub Pages.
- Android v0.1: APK release firmado con una clave persistente protegida por GitHub Secrets. No publicar un APK debug.
- GitHub Pages: demo/documentación web, no canal de binarios.

## Rollback
Conservar tags y la clave Android. Si un release falla antes de publicarse, corregir `main` y recrear el tag local. Si ya fue publicado, crear una nueva versión; nunca reescribir un tag público ni firmar una actualización con otra clave.
