# Validación de PDF Reader v0.2.0

Fecha: 2026-09-01

## Contrato comprobado localmente

- versión de producto `0.2.0` y Android `versionCode 2`;
- instalación reproducible exclusivamente con pnpm y lockfile congelado;
- pruebas unitarias de zoom táctil, identidad de historial, compartir, formato y búsqueda;
- build de landing + demo web;
- historial IndexedDB reabrible con máximo de ocho entradas;
- interfaz responsive sin controles absolutos sobre el visor;
- Capacitor Share registrado en el proyecto Android;
- filtro Android `ACTION_VIEW` y puente nativo para abrir PDF externos o iniciar el selector de lector predeterminado;
- manifiesto Android sin `INTERNET`, lectura/escritura general ni `MANAGE_EXTERNAL_STORAGE`.

## Evidencia de publicación

Los jobs de `main`, GitHub Pages y Release deben quedar verdes antes de considerar finalizada la versión. El workflow de release valida package name, `versionCode`, `versionName`, permisos, contenido de PDF.js y firma; después publica APK, instaladores Windows y `SHA256SUMS.txt`.

Los hashes finales se consultan en el release público:

<https://github.com/vladimiracunadev-create/pdf-reader-windows-android/releases/tag/v0.2.0>
