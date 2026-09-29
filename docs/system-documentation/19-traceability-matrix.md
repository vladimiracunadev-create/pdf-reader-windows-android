# 19. Matriz de trazabilidad

| Funcionalidad/regla | Interfaz/entrada | Módulo y símbolo | Persistencia | Prueba/evidencia | Documento | Estado |
|---|---|---|---|---|---|---|
| Abrir PDF local | botones/input/drop | `choosePdf`, `loadFile`, `loadPdfData` | Blob opcional | E2E Electron 47, Web 21 y Android 21 | 06, 08 | Validado local multi-entorno |
| Renderizar | canvas | `PDF.js`, `renderPage` | estado actual | corpus 16 PDF en los tres entornos | 03, 06 | Validado local multi-entorno |
| Navegar | botones/input/teclas/swipe | `goPage`, `endTouch` | `page` | E2E de botones, página exacta, Home/End y swipe | 06 | Validado local multi-entorno |
| Zoom sin perder zona | botones/pinza/doble toque | `captureReadingAnchor`, `zoom`, `renderPage` | `zoom`, `fitMode` | regresión Node + E2E zoom/pinza/doble toque | 06 | Validado local |
| Rotar | botón/tecla R | `rotate` | `rotation` | E2E aislado y secuencia compuesta | 06 | Validado local |
| Miniaturas | panel | `buildThumbnails` | ninguna | E2E 12/1.000 páginas y cierre de panel | 06 | Validado local |
| Buscar texto | panel/Ctrl+F | `pageText`, `searchDocument` | caché memoria | unitarias + E2E con texto y escaneado sin OCR | 06, 08 | Validado local |
| Evitar XSS en resultado | consulta/PDF | `escapeHtml`, `highlightSnippet` | ninguna | `highlight escapa html` | 11 | Validado unitario |
| Historial de ocho | Historial | `saveHistoryDocument`, `listHistory` | IndexedDB documents | E2E de historial/eliminación; poda máxima por revisar | 07 | Parcial: falta borde de ocho |
| Reanudar progreso | abrir/historial | save/restore state | localStorage + IndexedDB | E2E recarga/background y página restaurada | 07, 08 | Validado local |
| Borrar historial | UI + confirmación | `clearAllHistory`, CRUD | elimina IndexedDB | E2E Electron; eliminación individual Web/Android | 07 | Parcial por superficie |
| Compartir progreso, no PDF | botón Compartir | `buildShareText`, `shareReading` | ninguna | Node, Electron y hoja nativa APK release | 08, 09 | Parcial: fallback Web no ejecutado |
| Android ACTION_VIEW | intent PDF | `MainActivity`, `getPendingPdf` | Blob local posterior | manifest/CI + APK release por UI black-box | 09 | Validado en emulador |
| Lector predeterminado | diálogo | `offerDefaultReader`, `requestDefault` | flag por versión | UI black-box en APK release | 09 | Validado en emulador |
| Windows selector/asociación | IPC/.pdf | `readPdf`, preload | ruta + Blob | Setup publicado instalado + 47 E2E | 09 | Validado local |
| Solo lectura | toda la app | ausencia de APIs de escritura | originales externos | `verify-repo` | 01, 11 | Validado estructural |
| Sin permisos Android sensibles | manifiesto/APK | `patch-android`, CI `aapt2` | no aplica | verify + CI APK | 11, 13 | Validado |
| Tema | cabecera | `applyTheme`, `toggleTheme` | localStorage `theme` | E2E Electron/Web/Android | 05 | Validado local |
| Pages | push main | build/pages workflow | artifact estático | Actions `36504652223` | 13 | Validado remoto |
| Release firmado | tag `v*` | `release.yml` | GitHub Release | preflight/apksigner/hash | 13 | Validado por pipeline |

## Cobertura de requisitos

Los 13 requisitos funcionales iniciales de `spec/spec.md` tienen implementación identificada. Las suites locales operan las interfaces Web, Electron y Android, pero CI todavía solo prueba contratos/builds y no ejecuta esos recorridos UI completos. Tampoco existe evidencia en teléfono físico. Los no objetivos (edición, firma/anotación, nube, cuentas y telemetría) permanecen fuera del código observado.

## Navegación documental

Los números de la columna Documento remiten a los archivos homónimos de esta carpeta. La [referencia técnica](05-technical-reference.md) cataloga símbolos y la [explicación profunda](06-deep-code-explanation.md) desarrolla los flujos centrales.
