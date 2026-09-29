# Evidencia de release v0.3.3

Estado: **PREPARACIÓN EN CURSO; PUBLICACIÓN Y VALIDACIÓN DE ARTEFACTOS PENDIENTES**. Este documento no declara el release terminado antes de descargar y probar exactamente los binarios publicados.

## Evidencia previa al tag

| Gate | Estado inicial |
|---|---|
| Versión coordinada (`package.json`, app, Android, sitio y docs) | PASS · `0.3.3`, Android `versionCode 6`; el probe deja solo referencias históricas 0.3.2 y un falso positivo dentro de `release-evidence-v0.3.2.md`, revisado manualmente |
| Pruebas Node y estructura | PASS · 29/29 Node, estructura y 20 Markdown/20 PDF |
| Electron E2E | PASS · 47/47 sobre aplicación real y 47/47 sobre `win-unpacked` v0.3.3 |
| Web localhost E2E | PASS · 21/21 Edge/Chromium, viewport móvil 390×844 |
| Android Emulator E2E | PASS · 21/21 sobre APK debug v0.3.3 instalada desde cero, API 36.1 |
| Corpus PDF | PASS · 16 variantes por selector Web/Electron y DocumentsUI Android |
| CI/Pages | PENDIENTE |
| Release workflow y artefactos publicados | PENDIENTE |
| Instalación desde descarga pública | PENDIENTE |
| Android físico | **NO EJECUTADO** |

La repetición Android de instalación limpia expuso que el diálogo de lector predeterminado absorbía el primer gesto del harness y que la descripción del WebView podía consultarse antes de estabilizar los insets. Se corrigió el harness para esperar el WebView, releer sus bounds y cerrar explícitamente **Ahora no**; la suite completa posterior terminó 21/21. Un intento inicial de DocumentsUI no localizó el PDF dentro de su ventana acotada de reintentos; la repetición conservando la misma instalación limpia recorrió las 16 variantes y terminó PASS. No se convirtió ese intento fallido en evidencia verde.

## Criterio de cierre

El estado solo cambia a **PUBLICADO; ARTEFACTOS VERIFICADOS** cuando se hayan completado todos estos pasos:

1. limpieza y build reproducible;
2. suite local completa sobre aplicaciones reales;
3. integración en `main` y CI/Pages verdes;
4. tag `v0.3.3` y workflow de Release verde;
5. descarga nueva de APK, Setup, Portable y checksums;
6. verificación de versión, contenido, firma y hashes;
7. instalación limpia y repetición de flujos críticos sobre los artefactos descargados;
8. actualización de este informe con commit, run IDs, hashes y resultados observados.

## Límites que no se convertirán en PASS

- Teléfono Android físico: **NO EJECUTADO** mientras no exista un dispositivo físico conectado y probado.
- Fallback Web hacia servicios externos: **NO EJECUTADO** sin autorización para salida de datos.
- La ausencia de firma Authenticode en Windows es una limitación conocida, no una prueba aprobada.
