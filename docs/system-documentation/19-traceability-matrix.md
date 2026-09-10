# 19. Matriz de trazabilidad

| Funcionalidad/regla | Interfaz/entrada | Módulo y símbolo | Persistencia | Prueba/evidencia | Documento | Estado |
|---|---|---|---|---|---|---|
| Abrir PDF local | botones/input/drop | `choosePdf`, `loadFile`, `loadPdfData` | Blob opcional | verify + CI build | 06, 08 | Parcial: sin E2E |
| Renderizar | canvas | `PDF.js`, `renderPage` | estado actual | smoke histórico/CI | 03, 06 | Parcial |
| Navegar | botones/input/teclas/swipe | `goPage`, `endTouch` | `page` | clamp + manual histórica | 06 | Parcial |
| Zoom sin perder zona | botones/pinza/doble toque | `captureReadingAnchor`, `zoom`, `renderPage` | `zoom`, `fitMode` | `readingAnchorDelta` + verify CSS | 06 | Validado unitario/estructura |
| Rotar | botón/tecla R | `rotate` | `rotation` | verify de estado indirecto | 06 | Parcial |
| Miniaturas | panel | `buildThumbnails` | ninguna | build | 06 | Sin prueba funcional |
| Buscar texto | panel/Ctrl+F | `pageText`, `searchDocument` | caché memoria | snippet/highlight tests | 06, 08 | Parcial |
| Evitar XSS en resultado | consulta/PDF | `escapeHtml`, `highlightSnippet` | ninguna | `highlight escapa html` | 11 | Validado unitario |
| Historial de ocho | Historial | `saveHistoryDocument`, `listHistory` | IndexedDB documents | revisión código | 07 | Sin test automatizado |
| Reanudar progreso | abrir/historial | save/restore state | localStorage + IndexedDB | claves unitarias | 07, 08 | Parcial |
| Borrar historial | UI + confirmación | `clearAllHistory`, CRUD | elimina IndexedDB | revisión código | 07 | Sin E2E |
| Compartir progreso, no PDF | botón Compartir | `buildShareText`, `shareReading` | ninguna | texto unitario | 08, 09 | Parcial |
| Android ACTION_VIEW | intent PDF | `MainActivity`, `getPendingPdf` | Blob local posterior | manifest + app ID test + CI APK | 09 | Parcial |
| Lector predeterminado | diálogo | `offerDefaultReader`, `requestDefault` | flag por versión | revisión código | 09 | Requiere dispositivo |
| Windows selector/asociación | IPC/.pdf | `readPdf`, preload | ruta + Blob | CI package | 09 | Sin E2E |
| Solo lectura | toda la app | ausencia de APIs de escritura | originales externos | `verify-repo` | 01, 11 | Validado estructural |
| Sin permisos Android sensibles | manifiesto/APK | `patch-android`, CI `aapt2` | no aplica | verify + CI APK | 11, 13 | Validado |
| Tema | cabecera | `applyTheme`, `toggleTheme` | localStorage `theme` | revisión código | 05 | Sin E2E |
| Pages | push main | build/pages workflow | artifact estático | `pnpm build:pages`, Actions | 13 | Validado |
| Release firmado | tag `v*` | `release.yml` | GitHub Release | preflight/apksigner/hash | 13 | Validado por pipeline |

## Cobertura de requisitos

Los 13 requisitos funcionales iniciales de `spec/spec.md` tienen implementación identificada. La mayor brecha es de verificación automatizada de comportamiento: CI prueba build/contratos, pero no opera la interfaz completa ni los puentes en dispositivo. Los no objetivos (edición, firma/anotación, nube, cuentas y telemetría) permanecen fuera del código observado.

## Navegación documental

Los números de la columna Documento remiten a los archivos homónimos de esta carpeta. La [referencia técnica](05-technical-reference.md) cataloga símbolos y la [explicación profunda](06-deep-code-explanation.md) desarrolla los flujos centrales.
