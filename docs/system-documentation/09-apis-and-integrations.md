# 09. APIs e integraciones

## Resumen

No existe API HTTP propia, backend, webhook ni autenticación remota. Las integraciones son bibliotecas locales, APIs del navegador/sistema operativo y GitHub durante entrega.

## PDF.js

`pdfjsLib.getDocument` recibe bytes y URLs locales para CMaps, fuentes estándar y WASM. El worker se configura desde `./vendor/pdf.worker.mjs`. Las operaciones usadas son `getPage`, `getViewport`, `render`, `getTextContent` y `destroy`. Errores se clasifican por el texto de la excepción; no hay reintentos.

## IndexedDB y Web APIs

- IndexedDB: `open`, `getAll`, `get`, `put`, `delete`, `clear`.
- `localStorage`: preferencias/progreso y aviso por versión.
- Fullscreen API: `requestFullscreen`/`exitFullscreen` si existen.
- File API: `File.arrayBuffer`.
- Web Share: `navigator.share({title,text})`.
- WhatsApp Web: `https://wa.me/?text=<codificado>` como fallback.
- `matchMedia`: preferencia de tema.

## Contrato Electron IPC

| Canal | Emisor -> receptor | Parámetros | Respuesta |
|---|---|---|---|
| `pdf:pick` | renderer -> main | ninguno | cancelación o PDF+metadatos |
| `pdf:open-path` | renderer -> main | ruta | PDF+metadatos o error |
| `pdf:startup` | renderer -> main | ninguno | ruta inicial |
| `pdf:open-default-apps` | renderer -> main | ninguno | resultado de `shell.openExternal` |
| `pdf:external-open` | main -> renderer | ruta | evento callback |

No se exponen `fs`, `shell` general ni IPC arbitrario. `setWindowOpenHandler` deniega ventanas creadas desde contenido.

## Contrato Capacitor `PdfIntent`

### `getPendingPdf()`

Entrada implícita: intent actual con `ACTION_VIEW`, URI `content`/`file` y MIME asociado por Android. Respuesta disponible: `{available:true,name,size,lastModified:0,data:<Base64>}`. Si no aplica: `{available:false}`. Rechaza con mensaje genérico si ContentResolver falla o se superan 128 MiB.

### `requestDefault()`

Crea `cache/default-reader/elegir-pdf-reader.pdf`, lo expone mediante FileProvider y abre un intent de lectura con permiso temporal. No puede establecer por sí mismo la aplicación predeterminada.

`@capacitor/share` recibe `title`, `text` y `dialogTitle`; la aplicación receptora la elige la persona.

## GitHub

- Actions descarga dependencias desde registries y publica artifacts.
- Pages aloja landing y demo estática.
- Releases aloja APK/EXE/checksums.
- Dependabot abre PR semanales para npm y Actions.

No se identifican límites/reintentos de proveedores codificados. Los workflows usan permisos mínimos por trabajo: lectura de contenido; Pages necesita `pages:write`/`id-token:write`; Release necesita `contents:write`.

## Formatos e integridad

Entradas: PDF binario, URI Android o ruta Windows. Intercambio interno: `Uint8Array`, Buffer, Blob, Base64 y objetos JSON. Release usa APK/EXE y `SHA256SUMS.txt`. No hay contratos OpenAPI, GraphQL ni JSON externos.
