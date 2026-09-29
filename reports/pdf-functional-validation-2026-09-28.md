# Validación PDF, funcional y móvil · 2026-09-28

## Criterio y entornos

Una corrección solo cierra después de implementación, integración, prueba, documentación y verificación del artefacto publicado. Estados: **PASS**, **FAIL**, **BLOCKED**, **NO EJECUTADO** y **N/A**. No se convierten faltantes en PASS.

| Entorno | Ejecución real | Alcance |
|---|---|---|
| Windows 11 x64, Electron 44 | Sí | 29 pruebas Node + 47 E2E; corpus completo, mouse/teclado, recuperación e historial |
| Android Emulator API 36.1, APK debug instalada | Sí | 21 E2E; 16 PDF por DocumentsUI, táctil, orientación, lifecycle, historial y pantalla restringida |
| Microsoft Edge/Chromium, localhost:4174 | Sí | 21 E2E; selector, drop, corpus completo, controles, responsive 390×844, recarga y errores |
| Teléfono Android físico | No | **NO EJECUTADO**; no había hardware conectado |

Evidencia reproducible: `.qa/desktop-e2e/results.json`, `.qa/web-e2e/results.json`, `.qa/android-webview-e2e/results.json`, capturas asociadas y `.qa/pdf-corpus/manifest.json`. `.qa/` se ignora para no incorporar binarios de casi 100 MiB; scripts, matriz y resultados resumidos sí se versionan.

## Inventario real

Existen: selector/asociación/argumento PDF, cambio de archivo, drag-and-drop Windows, anterior/siguiente, página exacta, Home/End, swipe, scroll/pan, zoom +/-/pinza/doble toque, ajustar página/ancho, rotar, pantalla completa, miniaturas paginadas, búsqueda, temas, historial/progreso/eliminación, recuperación tras recarga/background, About, compartir resumen y configuración de lector predeterminado.

No existen: edición/anotación, OCR, selección/copia de capa textual, índice/marcadores, capa interactiva de enlaces del PDF, guardar como/exportar/descargar/imprimir, adjuntar el PDF al compartir ni pestañas simultáneas. No hay botón “cerrar documento”.

## Corpus PDF

Se genera con `CI=true pnpm qa:pdf-corpus`; `manifest.json` conserva tamaños, SHA-256 y procedencia.

| ID | Archivo | Característica | Acción/esperado | Obtenido | Estado |
|---|---|---|---|---|---|
| PDF-001 | `01-single-page-selectable.pdf` | 1 página, texto | Abrir/renderizar | 1 página visible | PASS |
| PDF-002 | `02-multipage-text-images.pdf` | 12 páginas, texto+imágenes | Navegar/buscar | Resultado en página 9 | PASS |
| PDF-003 | `03-many-pages-1000.pdf` | 1.000 páginas | Ir a 1000; miniaturas acotadas | Página 1000; lote 60 | PASS |
| PDF-004 | `04-scanned-no-text-layer.pdf` | Escaneado | Render; buscar sin OCR | Visible; sin coincidencias | PASS |
| PDF-005 | `05-images-only.pdf` | Imágenes | Abrir/navegar | 5 páginas | PASS |
| PDF-006 | `06-varied-page-sizes.pdf` | Tamaños distintos | Abrir/ajustar | 4 páginas | PASS |
| PDF-007 | `07-landscape.pdf` | Horizontal | Drop/cambio | Render correcto | PASS |
| PDF-008 | `08-mixed-orientation-rotated.pdf` | Mixto/rotado | Recorrer | 4 páginas | PASS |
| PDF-009 | `09-heavy-over-24mb.pdf` | 96,8 MiB | Abrir sin historial | Abre y avisa límite | PASS |
| PDF-010 | `10-high-resolution-image.pdf` | Alta resolución | Abrir/zoom/pan | Canvas visible | PASS |
| PDF-011 | `11-links-and-metadata.pdf` | Enlaces/metadatos | Abrir/renderizar | 2 páginas; enlaces no interactivos por alcance | PASS |
| PDF-012 | `12-embedded-font.pdf` | Fuente embebida | Abrir | Canvas visible | PASS |
| PDF-013 | `13-password-protected.pdf` | Contraseña | Error y recuperación | Mensaje; documento anterior intacto | PASS |
| PDF-014 | `14-recoverable-trailing-garbage.pdf` | Corrupción recuperable | Abrir seguro | 12 páginas | PASS |
| PDF-015 | `15-browser-generated.pdf` | Edge Print to PDF | Abrir | Canvas visible | PASS |
| PDF-016 | `16-word-native-export.pdf` | Exportado por Word | Abrir | 2 páginas | PASS |

## Matriz funcional × entorno × PDF

`N/A` significa que la función no existe en esa superficie. `NO EJECUTADO` no se contabiliza como PASS. La columna física permanece abierta hasta disponer de un teléfono real.

| ID | Funcionalidad | PDF | Electron | Android emulador | Web localhost | Android físico | Resultado disponible |
|---|---|---|---|---|---|---|---|
| FUN-001 | Abrir asociación/argumento | 002 | PASS | PASS release | N/A | NO EJECUTADO | PASS sin hardware físico |
| FUN-002 | Selector sistema/input | 002 | PASS | PASS | PASS | NO EJECUTADO | PASS sin hardware físico |
| FUN-003 | Cambiar PDF | 001→007 | PASS | PASS | PASS | NO EJECUTADO | PASS sin hardware físico |
| FUN-004 | Drag-and-drop | 007 | PASS | N/A | PASS | N/A | PASS |
| FUN-005 | Anterior/siguiente | 002 | PASS | PASS | PASS | NO EJECUTADO | PASS sin hardware físico |
| FUN-006 | Página exacta | 002 | PASS | PASS | PASS | NO EJECUTADO | PASS sin hardware físico |
| FUN-007 | Home/End/límites | 002 | PASS | PASS teclado | PASS | NO EJECUTADO | PASS sin hardware físico |
| FUN-008 | Zoom +/- | 002 | PASS | PASS | PASS | NO EJECUTADO | PASS sin hardware físico |
| FUN-009 | Pinza táctil | 002 | N/A | PASS | N/A | NO EJECUTADO | PASS sin hardware físico |
| FUN-010 | Doble toque | 002 | N/A | PASS | N/A | NO EJECUTADO | PASS sin hardware físico |
| FUN-011 | Ajustar página/ancho | 002 | PASS ambos | PASS ancho; página N/A móvil | PASS ambos | NO EJECUTADO | PASS sin hardware físico |
| FUN-012 | Scroll rueda/pan táctil | 002 | PASS | PASS | PASS rueda | NO EJECUTADO | PASS sin hardware físico |
| FUN-013 | Swipe | 002 | N/A | PASS | N/A | NO EJECUTADO | PASS sin hardware físico |
| FUN-014 | Rotar documento | 002 | PASS | PASS | PASS compuesto | NO EJECUTADO | PASS sin hardware físico |
| FUN-015 | Orientación dispositivo | 002 | N/A | PASS | N/A | NO EJECUTADO | PASS sin hardware físico |
| FUN-016 | Pantalla completa | 002 | PASS | N/A móvil | PASS | N/A móvil | PASS |
| FUN-017 | Miniaturas | 002/003 | PASS | PASS | PASS | NO EJECUTADO | PASS sin hardware físico |
| FUN-018 | Búsqueda | 002 | PASS | PASS | PASS | NO EJECUTADO | PASS sin hardware físico |
| FUN-019 | Búsqueda sin OCR | 004 | PASS | PASS | PASS | NO EJECUTADO | PASS sin hardware físico |
| FUN-020 | Tema | 002 | PASS | PASS | PASS | NO EJECUTADO | PASS sin hardware físico |
| FUN-021 | Historial/progreso/reabrir | 002 | PASS | PASS | PASS recarga | NO EJECUTADO | PASS sin hardware físico |
| FUN-022 | Eliminar/borrar historial | historial | PASS | PASS eliminar | PASS eliminar | NO EJECUTADO | PASS sin hardware físico |
| FUN-023 | Recarga/background | 007/002 | PASS recarga | PASS background | PASS recarga | NO EJECUTADO | PASS sin hardware físico |
| FUN-024 | Compartir resumen | 002 | PASS portapapeles | PASS hoja nativa release | NO EJECUTADO externo | NO EJECUTADO | NO EJECUTADO Web/físico |
| FUN-025 | Lector predeterminado | N/A | PASS diálogo | PASS diálogo release | N/A | NO EJECUTADO | PASS sin hardware físico |
| FUN-026 | About/regreso | N/A | PASS | PASS | PASS | NO EJECUTADO | PASS sin hardware físico |
| FUN-027 | Secuencia rápida página→zoom→rotación | 002 | PASS | PASS | PASS | NO EJECUTADO | PASS sin hardware físico |
| FUN-028 | Limpieza miniaturas→búsqueda→cerrar | 002 | PASS | PASS | PASS | NO EJECUTADO | PASS sin hardware físico |
| FUN-029 | Área segura Android 16 | N/A | N/A | PASS | N/A | NO EJECUTADO | PASS sin hardware físico |
| FUN-030 | Objetivos táctiles ≥44×44 | N/A | PASS representativo | PASS | PASS 390×844 | NO EJECUTADO | PASS sin hardware físico |
| FUN-031 | Responsive estrecho | 001/002 | PASS 390×844 | PASS 360 CSS px | PASS 390×844 | NO EJECUTADO | PASS sin hardware físico |
| FUN-032 | Corpus completo 16 variantes | 001–016 | PASS | PASS DocumentsUI | PASS | NO EJECUTADO | PASS sin hardware físico |
| FUN-033 | Contraseña y preservar anterior | 013 | PASS | PASS | PASS | NO EJECUTADO | PASS sin hardware físico |
| FUN-034 | PDF >24 MiB | 009 | PASS | PASS | PASS | NO EJECUTADO | PASS sin hardware físico |

## Incidencias y regresiones

### Android parecía recargar después de cada acción

**Reproducción:** abrir PDF en Android y ejecutar página siguiente, zoom y rotación seguidos. **Causa raíz:** `renderPage` redimensionaba el canvas activo y mostraba el overlay antes de terminar; el contenido desaparecía temporalmente. **Solución:** render a canvas fuera de pantalla y sustitución atómica; el overlay solo aparece en el primer render del documento. **Verificación:** AND-COM-001 ejecuta cuatro acciones sin pausa, comprueba `loadingShows=0`, estado final y canvas no vacío. **Resultado:** PASS en APK instalada.

### Cabecera bajo la barra de estado de Android 16

**Reproducción:** iniciar la APK target 36; hora e iconos se superponían al logo. **Causa raíz:** Android 16 fuerza edge-to-edge y la versión del WebView no propagó insets CSS superiores. **Solución:** `MainActivity` aplica `systemBars|displayCutout` como márgenes del WebView. **Verificación:** bounds cambian de `screenY=0` a `screenY=63`; captura `05-safe-area-margin.png`. **Resultado:** PASS.

### Objetivos táctiles demasiado bajos

**Reproducción:** medir controles Android; página central = 38 px y navegación inferior = 37 px. **Solución:** mínimos de 44 px en `.dock-page` y `.nav-item`. **Verificación:** AND-UX-002. **Resultado:** PASS tras corrección.

### Compartir Windows sin efecto

**Causa:** Electron no disponía de Web Share y el fallback no era fiable. **Solución:** IPC limitado a 2.000 caracteres copia el resumen al portapapeles, sin transmisión automática. **Verificación:** regresión Node y E2E Electron. **Resultado:** PASS.

### PDF pesado informaba “0 B”

**Reproducción:** abrir PDF-009 después de transferir sus bytes al worker PDF.js. **Causa:** el mensaje consultaba el `byteLength` de un buffer ya transferido y desacoplado. **Solución:** usar el tamaño de metadatos conservado en `state.file.size`. **Verificación:** contrato Node y FUN-034 E2E exigen tamaño en MB y rechazan “0 B”. **Resultado:** PASS tras corrección.

### CSP ausente

Se añadió CSP local compatible con PDF.js y prueba contractual. El aviso correspondiente desapareció. Resultado: PASS.

### Harness dependía del estado previo del entorno

**Reproducción:** la suite Web podía perder el target si Edge navegaba mientras se configuraba el viewport; la suite Android fallaba si la APK estaba detenida, si iniciaba en `#history`, si el PDF inicial no seguía abierto o, después de una instalación limpia, si el diálogo de lector predeterminado seguía capturando los gestos físicos. La descripción inicial del target también podía tomarse antes de que Android aplicara los insets. **Causa raíz:** ambos harness asumían estado ambiental no declarado. **Solución:** Web crea primero una pestaña vacía, aplica métricas y luego navega; Android inicia la APK cuando corresponde, espera la estabilización del WebView, consulta sus bounds actuales, cierra explícitamente **Ahora no** si aparece el diálogo, acepta rutas internas con fragmento y abre el PDF inicial mediante DocumentsUI. La búsqueda de archivos usa bounds reales de la jerarquía Android y reintentos acotados. **Verificación:** ejecuciones posteriores de 21/21 Web y 21/21 Android sobre la instalación limpia; capturas `localhost-mobile-compound.png`, `landscape-compound.png` y `portrait-after-background.png`. **Resultado:** PASS del harness. Edge debe ejecutarse fuera del sandbox de archivos para permitir sus procesos GPU; esa restricción pertenece al entorno de prueba, no al producto.

## Límites explícitos

- No hubo teléfono físico disponible; Android se validó en emulador API 36.1.
- El fallback Web de compartir hacia un servicio externo no se ejecutó: abrirlo produciría salida de datos fuera del entorno de prueba y requiere autorización específica.
- La ejecución final contra el portable y APK descargados pertenece al gate posterior a publicación y se documenta en `release-evidence-v0.3.3.md`.
