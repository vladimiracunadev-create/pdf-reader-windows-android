# Arquitectura

```text
PDF local
   │
   ▼
Selector / drag & drop
   │
   ▼
Uint8Array en memoria
   │
   ▼
Mozilla PDF.js
   │
   ├── Canvas principal
   ├── Miniaturas
   └── Extracción de texto para búsqueda

Núcleo web (HTML/CSS/JS)
   ├── Electron 44 → Windows
   ├── Capacitor 8.5 → Android
   └── GitHub Pages → demo web
```

## Decisiones
- **Vanilla JS:** menos abstracción para un lector pequeño, superficie reducida y fácil auditoría.
- **PDF.js:** motor consolidado y multiplataforma para render de PDF. La versión inicial fijada es `6.3.289` y el build usa la variante `legacy` para ampliar compatibilidad con WebView Android, además de CMaps/fuentes estándar cuando están disponibles.
- **Electron:** da asociación `.pdf`, instalador Windows y experiencia desktop.
- **Capacitor:** reutiliza la misma UI en Android con shell nativo.

## Estado local
`localStorage` guarda tema y estado de lectura por huella simple (`nombre + tamaño + mtime`). IndexedDB conserva hasta ocho PDF recientes con metadatos y progreso para reabrirlos en Android, Windows o web. La persona puede eliminar una entrada o borrar el historial completo.

## Límites
El documento se carga en memoria y una copia puede persistirse en IndexedDB. La cuota la decide el dispositivo y un fallo de persistencia no impide leer. PDF extremadamente grandes pueden requerir más RAM. El streaming parcial queda fuera de `v0.2.0`.

`@capacitor/share` conecta la acción explícita de compartir con la hoja nativa de Android. La capa web usa `navigator.share` y, cuando no está disponible, abre WhatsApp Web. El mensaje nunca contiene los bytes del PDF.
