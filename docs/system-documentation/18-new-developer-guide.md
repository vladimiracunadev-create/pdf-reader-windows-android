# 18. Guía para un nuevo desarrollador

## Itinerario recomendado

1. Leer `README.md` y `spec/spec.md` para entender la promesa de solo lectura.
2. Leer [01 - Descripción general](01-system-overview.md) y [03 - Arquitectura](03-architecture.md).
3. Recorrer `src/index.html` y `src/app.js` siguiendo apertura -> render -> persistencia.
4. Revisar `src/history-store.js` y `src/utils.js` junto con sus pruebas.
5. Estudiar `desktop/` y luego el plugin Android para comparar adaptadores.
6. Leer scripts y workflows para comprender qué protege cada gate.
7. Ejecutar localmente los comandos base y abrir el PDF smoke.

## Preparar el entorno

```bash
pnpm install --frozen-lockfile
pnpm check
pnpm build:pages
pnpm start:web
```

Requisitos: Node 22+, pnpm 11; para Android, JDK 21 y SDK/Build Tools 36. Usa solo pnpm y no agregues otro lockfile.

## Seguir un flujo completo

Abre `src/index.html` para encontrar `openBtn`; en las últimas líneas de `app.js` se enlaza a `choosePdf`; sigue `loadFile`/`loadPdfData`, luego `renderPage`, `saveReadingState` y `saveHistoryDocument`. Para Android sigue `ACTION_VIEW` -> `MainActivity.onNewIntent` -> evento `pdf-intent` -> `openPendingAndroidPdf`. Para Windows sigue handler IPC -> preload -> `openDesktopPath`.

## Dónde agregar cambios

- función pura/cálculo: `src/utils.js` y prueba en `test/`;
- persistencia: `history-store.js`, considerando versión/migración;
- UX compartida: `src/index.html`, `styles.css`, `app.js`;
- capacidad Windows privilegiada: API mínima en preload y handler main;
- capacidad Android: plugin registrado, manifiesto y prueba instrumentada;
- build/release: `scripts/` y `.github/workflows/` con docs actualizadas.

## Convenciones y cuidados

- Mantener el original inmutable y el rótulo Solo lectura.
- No solicitar Internet/almacenamiento Android sin decisión explícita.
- Escapar texto antes de usar `innerHTML`.
- No exponer Node/IPC general al renderer.
- No editar `android/app/capacitor.build.gradle` como fuente primaria: es generado.
- Mantener versión coherente en package, app, Android, README y docs actuales; no cambiar cifras históricas.
- Si cambia el nombre de un job, actualizar la protección de rama.
- No usar documentos reales/confidenciales como fixtures.

## Crear pruebas

Las funciones puras usan `node:test` y `assert/strict`. Un cambio de UI debe añadir E2E cuando exista infraestructura; mientras tanto, sumar una prueba unitaria y extender `verify-repo` solo para invariantes estructurales. Los cambios Android deben ejecutar Gradle y, cuando sea posible, pruebas instrumentadas en emulador/dispositivo.

## Primera tarea apropiada

Reemplazar `ExampleUnitTest.additionIsCorrect` por pruebas unitarias extraíbles de la validación de tamaño/nombre del plugin, o añadir pruebas IndexedDB con una implementación controlada. Evitar como primera tarea cambios de firma, permisos, application ID o formato de historial.

## Definition of Done

`pnpm check` y `pnpm build:pages` verdes; Android/Windows según alcance; documentación y changelog actualizados; diff sin binarios/generados; PR con los tres checks obligatorios y conversaciones resueltas.
