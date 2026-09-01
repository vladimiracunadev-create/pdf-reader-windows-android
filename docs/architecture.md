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
`localStorage` guarda solo preferencias: tema y estado de lectura por huella simple (`nombre + tamaño + mtime`). En Windows también se almacena una lista corta de rutas recientes para reabrir documentos desde el mismo equipo.

## Límites
El documento se carga en memoria. PDF extremadamente grandes pueden requerir más RAM. La v0.1.0 prioriza simplicidad; streaming parcial queda fuera del MVP.
