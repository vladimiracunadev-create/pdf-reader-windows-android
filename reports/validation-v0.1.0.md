# Validation Report · v0.1.0

Fecha: 2026-08-31

## Gates definidos
- Node unit tests (`node --test`).
- Verificación estructural/alcance (`scripts/verify-repo.mjs`).
- Build web con PDF.js vendorizado desde `node_modules` y landing separada.
- Package smoke Windows en GitHub Actions.
- APK debug smoke Android en GitHub Actions, con inspección de paquete, versión y permisos.
- APK release alineado, firmado y verificado antes de publicar.
- Pages deploy desde `main`.
- Release por tag.

## Validación local
- `npm ci`: dependencias fijadas instaladas desde `package-lock.json`.
- `npm test`: 5/5 pruebas verdes.
- `npm run verify`: estructura, alcance read-only y documentación OK.
- `npm run build:web`: núcleo y recursos PDF.js generados.
- `npm run build:pages`: landing y demo separadas generadas.
- `npm run android:init`: bootstrap multiplataforma y política Android aplicados.
- navegador real: landing validada en desktop y 390×844 sin overflow horizontal.
- navegador real: PDF de muestra abierto y renderizado; búsqueda devolvió 1 resultado sin errores de consola.
- `npm run build:windows`: instalador NSIS y portable construidos como archivos distintos.
- JavaScript/CJS validado sintácticamente con Node.
- Workflows YAML parseables.

## Limitación de esta ejecución
El equipo local no dispone de JDK 21 ni Android SDK 36, por lo que el APK se compila en el runner oficial de GitHub Actions. La evidencia final debe incluir la ejecución verde de `main`, la firma mostrada por `apksigner`, los metadatos de `aapt2` y el SHA-256 del release.
