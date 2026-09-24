# 05. Referencia técnica

## Estado global y constantes

`src/app.js` usa `APP_VERSION = '0.3.1'`, un mapa `els` de elementos DOM y `state` como estado mutable de sesión. Sus campos incluyen documento, página, zoom, rotación y secuencias independientes para carga, render, búsqueda y miniaturas; estas últimas invalidan trabajo obsoleto al cambiar de documento o cerrar un panel.

`src/history-store.js` define `DB_NAME=pdf-reader-local`, `DB_VERSION=1`, `STORE=documents` y `MAX_DOCUMENTS=8`. Android limita aperturas externas a `MAX_PDF_BYTES=128 MiB`.

## Funciones de `src/app.js`

| Símbolo | Firma/retorno | Propósito y efectos |
|---|---|---|
| `setLoading` | `(on, label?) -> void` | Actualiza indicador de carga |
| `showToast` | `(message) -> void` | Muestra aviso temporal y reinicia timer |
| `setError` / `clearError` | `(message?) -> void` | Cambia vista y estado de error |
| `closePanels`, `setView` | `(view?) -> void` | Navegación Lector/Historial/About y hash |
| `applyTheme`, `toggleTheme` | `(theme?) -> void` | DOM, `localStorage` y color de tema |
| `captureReadingAnchor` | `(clientX?, clientY?) -> Anchor o null` | Convierte un punto visible en razón del canvas |
| `restoreReadingAnchor` | `(Anchor?) -> void` | Ajusta scroll tras redimensionar canvas |
| `updateUi` | `() -> void` | Sincroniza controles con `state` |
| `saveReadingState` | `() -> void` | Escribe progreso en localStorage/IndexedDB |
| `restoreReadingState` | `() -> void` | Valida y restaura progreso local |
| `refreshHistory`, `renderHistory` | `() -> Promise<void>/void` | Consulta y crea tarjetas seguras con DOM APIs |
| `deleteHistoryItem`, `clearAllHistory` | `(id?) -> Promise<void>` | Elimina persistencia tras acción explícita |
| `choosePdf`, `openDesktopPath`, `loadFile` | `(file/path?) -> Promise<void>` | Adquiere un PDF según plataforma |
| `openFromHistory` | `(id) -> Promise<void>` | Recupera bytes o ruta guardada |
| `loadPdfData` | `(raw, fileMeta, options?) -> Promise<void>` | Destruye documento anterior, abre, persiste y renderiza |
| `friendlyPdfError` | `(error) -> string` | Traduce contraseña/formato/error genérico |
| `effectiveScale` | `(page) -> Promise<number>` | Calcula ancho, página o zoom manual |
| `renderPage` | `({anchor?}?) -> Promise<void>` | Renderiza canvas con DPR <= 2 y cancela tarea previa |
| `goPage`, `zoom`, `setFit`, `rotate` | `(...) -> Promise<void>` | Cambian vista y solicitan render |
| `buildThumbnails` | `() -> Promise<void>` | Genera botones para todas las páginas y canvas hasta 120 |
| `pageText`, `searchDocument` | `(page/query) -> Promise<...>` | Extrae/cacha texto y crea resultados escapados |
| `toggleSidebar`, `toggleSearch`, `toggleFullscreen` | `() -> void/Promise` | Controla paneles y Fullscreen API |
| `shareReading` | `(file?, page?, total?) -> Promise<void>` | Capacitor Share, Web Share o WhatsApp Web |
| `appPlatform`, `offerDefaultReader`, `configureDefaultReader` | `(...)` | Detecta superficie y abre configuración opcional |
| `decodeBase64`, `openPendingAndroidPdf` | `(value?) -> Uint8Array/Promise` | Convierte payload Android y lo abre |
| `startTouch`, `moveTouch`, `endTouch` | `(TouchEvent) -> void` | Pinza, swipe y doble toque |
| `boot` | `() -> Promise<void>` | Tema, vista, historial y aperturas iniciales |

Los handlers registrados al final conectan botones, teclado, resize, drag/drop, gestos, hash e intent Android. Las excepciones de render se muestran; varias fallas de persistencia se registran y degradan sin detener lectura.

## Persistencia y utilidades

`history-store.js` exporta `listHistory`, `getHistoryDocument`, `saveHistoryDocument`, `updateHistoryDocument`, `removeHistoryDocument` y `clearHistory`; todas abren/cerran la base y esperan la transacción. `requestResult`, `transactionDone` y `database` son internas.

`utils.js` exporta `clamp`, `readingAnchorDelta`, `formatBytes`, `documentKey`, `historyId`, `touchDistance`, `buildShareText`, `buildSnippet`, `escapeHtml` y `highlightSnippet`. Son funciones puras; `highlightSnippet` depende del escape previo para que el uso posterior de `innerHTML` no interprete contenido del PDF.

## Adaptadores nativos

| Interfaz | Operación | Resultado/error |
|---|---|---|
| `desktopPdf.pick()` | Diálogo `.pdf` | `{canceled}` o metadatos+Buffer |
| `desktopPdf.openPath(path)` | Lee ruta validada por extensión | objeto o `{error}` |
| `desktopPdf.startup()` | Ruta recibida al iniciar | `{path}` |
| `desktopPdf.openDefaultApps()` | Abre `ms-settings:defaultapps` | promesa IPC |
| `desktopPdf.onExternalOpen(cb)` | Suscribe segunda apertura | callback con ruta |
| `PdfIntent.getPendingPdf()` | Lee `ACTION_VIEW`, máximo 128 MiB | JSObject Base64 o rechazo |
| `PdfIntent.requestDefault()` | Crea PDF temporal y abre resolver | resolución/rechazo |

## Configuración, rutas y códigos de salida

- `PORT`: opcional, `4173` por defecto.
- `androidScheme`: `https`; `allowMixedContent`: `false`.
- `appId/applicationId/namespace`: `cl.vladimiracunadev.pdfreader`.
- Scripts de prerrequisitos terminan con código `2` cuando falta entrada/configuración; errores normales usan `1`.
- No hay endpoints HTTP de negocio, eventos de dominio, variables de entorno de aplicación ni códigos de error públicos.

## Riesgos de modificación

Cambios en `app.js` pueden afectar simultáneamente tres plataformas. Cambiar claves de identidad rompe reanudación; subir `DB_VERSION` exige migración; cambiar `appId` o firma Android rompe actualizaciones; modificar nombres de jobs obliga a actualizar la protección de `main`.
