# Preflight de producto y mejoras verificadas · 2026-09-23

Este informe aplica la suite genérica `preliminary-product-tester` con sus especialistas de flujos funcionales, resiliencia/estado y evidencia de release. Distingue pruebas interactivas, automatizadas, build/inspección y casos no ejecutados. No constituye certificación ni aprobación para producción.

## Alcance y entorno

- producto: PDF Reader `0.3.0`, árbol de trabajo posterior al commit `dbe01a4`;
- superficie funcional ejecutada: Web local servida en `http://127.0.0.1:4173` mediante navegador integrado;
- fixtures reales: `01-system-overview.pdf`, `02-installation-and-execution.pdf` e `invalid.pdf`;
- superficie de build: Node/pnpm, Web/Pages; Android y Windows se informan por separado;
- datos de historial: IndexedDB local del navegador de prueba, sin transmitir archivos.

## Defecto reproducido antes de corregir

| Severidad | Flujo | Resultado observado | Evidencia |
|---|---|---|---|
| Alta | abrir PDF A y después PDF B sin recargar | PDF B no se abría; PDF A permanecía visible | `TypeError: previousDoc.destroy is not a function` en `loadPdfData` |

PDF.js expone la destrucción completa en `PDFDocumentLoadingTask`, disponible desde `PDFDocumentProxy.loadingTask`. La aplicación intentaba ejecutar `destroy()` directamente sobre `PDFDocumentProxy`, donde ese método no existe.

## Mejoras realizadas

1. La sustitución destruye `previousDoc.loadingTask` y conserva la nueva tarea válida.
2. Cada carga recibe una secuencia; un resultado anterior que termina tarde se destruye y no reemplaza la intención más reciente.
3. El almacenamiento Web se encapsula en `readStorage` y `writeStorage`: bloqueos, `SecurityError` y cuota degradan sin abortar el arranque o la lectura.
4. Fallar al actualizar `lastOpened` ya no convierte un PDF correctamente abierto en un error de lectura.
5. El estado de página, zoom, ajuste y rotación se guarda al recibir `visibilitychange` oculto o `pagehide`.
6. Se añadieron siete regresiones nuevas: tres contratos de segunda apertura/concurrencia/ciclo de vida y cuatro casos de almacenamiento disponible o fallido.
7. La generación de los 20 PDF documentales usa el modo invariante de ReportLab; dos ejecuciones consecutivas producen hashes idénticos.

## Evidencia funcional interactiva posterior

| Caso | Resultado observado | Estado |
|---|---|---|
| primera apertura | `01-system-overview.pdf`, 2 páginas, controles habilitados | Pasa |
| búsqueda | `telemetría` produjo una coincidencia visible en página 1 | Pasa |
| navegación e historial | página 1→2; Historial reflejó página 2; Atrás volvió al lector conservando el documento | Pasa |
| PDF inválido con documento abierto | se informó archivo dañado y el documento anterior siguió visible | Pasa |
| reapertura desde Historial | el PDF guardado reabrió en página 2 | Pasa |
| segunda apertura sin recargar | `02-installation-and-execution.pdf` reemplazó al anterior, página 1/2, sin error nuevo | Pasa |
| viewport móvil `360 × 740` | cabecera, herramientas, página, dock y navegación inferior visibles sin solapamiento crítico | Pasa preliminarmente |

La repetición posterior usa exactamente el límite que falló: PDF A abierto → PDF B abierto. Los errores conservados en la consola pertenecen a la reproducción previa y no apareció otra entrada después de la corrección. La prueba `360 × 740` es simulación de viewport, no interacción en hardware móvil.

## Evidencia automatizada y de build

| Nivel | Comando | Resultado |
|---|---|---|
| Automatizada | `CI=true pnpm test` | 21 pruebas, 21 pasan, 0 fallos |
| Build/integración | `CI=true pnpm release:check` posterior | 21 pruebas, verify, docs y build Pages correctos |
| Build/integración | `CI=true pnpm build:web` posterior | `dist/` generado correctamente |
| Build/integración | `pnpm android:debug` con Android SDK local y JDK 21 | `BUILD SUCCESSFUL`, 123 tareas, APK debug generado |
| Build/integración | `CI=true pnpm build:windows` | NSIS y portable x64 generados correctamente |

APK comprobado: `android/app/build/outputs/apk/debug/app-debug.apk`, 7.829.344 bytes, SHA-256 `BC9F82A2DF2B27245AE9ED93C83AE45A0904EB4591C39B164A18B3AA4F58FD8A`. Es un artefacto debug local; no equivale a instalación en dispositivo ni a APK release firmado.

Artefactos Windows comprobados:

- `PDF-Reader-Windows-0.3.0-x64-Setup.exe`: 128.973.630 bytes, SHA-256 `FD9AC731DF22191DB03B786376D2C8775AE2CC6C2C004801725D785FDDD9F818`;
- `PDF-Reader-Windows-0.3.0-x64-Portable.exe`: 128.749.873 bytes, SHA-256 `02ED00790BFBF3673BB23F672FE0F244F9D6A9678C487FC10D1F292A1E3A4777`.

Son artefactos locales de verificación y conservan la versión `0.3.0`; no deben publicarse sobre el release histórico existente.

El primer intento sin `CI=true` abortó antes de ejecutar scripts porque pnpm no podía confirmar en un TTY la recreación de `node_modules`. Se repitió en el modo CI documentado; no se clasifica como fallo del producto.

## Auditoría de release

- Web/Pages del commit `dbe01a4`: CI remoto verde en sus tres jobs y despliegue Pages verde.
- La versión canónica sigue siendo `0.3.0`, pero el tag histórico `v0.3.0` apunta a `265b122`; `dbe01a4` y estas mejoras son posteriores.
- No debe publicarse otro artefacto llamado `0.3.0`. Una entrega futura requiere aumentar versión y `androidVersionCode` sin mover el tag histórico.
- Los builds y CI del commit `dbe01a4` no prueban automáticamente este árbol de trabajo hasta que los cambios se versionen y ejecuten remotamente.

## No ejecutado y riesgo residual

- Android físico/emulador: instalación, actualización, intents, pinza/swipe real, rotación, background/restore, muerte de proceso, lector predeterminado y compartir. El APK compila, pero no había dispositivo ADB disponible en la validación funcional.
- Windows instalado: NSIS/portable, asociación `.pdf`, segunda instancia, drag-and-drop del sistema y actualización.
- IndexedDB bajo cuota real, interrupción entre guardado y poda, corrupción física y migraciones.
- Aperturas concurrentes controladas mediante barreras deterministas: existe contrato automatizado de descarte, pero falta un E2E que fuerce el orden inverso de finalización.
- Lector de pantalla, contraste formal, pentest, carga y certificación de accesibilidad.

## Veredicto preliminar

- **Web local:** Continuar. Los recorridos críticos ejecutados pasaron después de corregir la segunda apertura.
- **Android:** Escalar a prueba en dispositivo; build no sustituye ciclo de vida ni gestos físicos.
- **Windows:** Escalar a prueba del artefacto instalado y asociación de archivos.
- **Release global:** No preparar release con versión `0.3.0`; primero corresponde una versión posterior y CI sobre el commit definitivo.

Siguiente nivel recomendado: automatizar el recorrido PDF A→PDF B y los fallos de IndexedDB; después ejecutar una matriz física Android y una instalación limpia/actualización en Windows.
