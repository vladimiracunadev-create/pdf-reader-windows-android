# Changelog

## [0.2.0] - 2026-09-01
### Added
- Historial local reabrible de hasta ocho PDF con última página, zoom, ajuste y rotación.
- Pestaña About con versión, autor, licencia, filosofía, privacidad y enlaces del proyecto.
- Compartir lectura mediante la hoja nativa de Android, Web Share o WhatsApp Web como fallback.
- Zoom táctil de pinza y doble toque independiente del número de páginas.
- Pregunta de lector PDF predeterminado una vez por versión y apertura Android mediante `ACTION_VIEW`.

### Changed
- Interfaz móvil reorganizada en zonas de layout: visor, controles de lectura y navegación principal ya no se superponen.
- Navegación clara entre Lector, Historial y About; tema claro/oscuro aislado en la cabecera.
- Automatización Android deriva `versionName` y `versionCode` del manifiesto de versión del proyecto.

## [0.1.0] - 2026-08-31
### Added
- MVP de lectura PDF Windows/Android/Web.
- Navegación, zoom, fit, rotación, miniaturas y búsqueda.
- Tema oscuro, pantalla completa, atajos, drag & drop y swipe.
- Persistencia local del estado de lectura.
- Electron/Capacitor packaging.
- Proyecto Android reproducible con icono y splash propios.
- APK release firmado y auditado: paquete, versión, permisos, contenido y SHA-256.
- CI main, landing + demo en GitHub Pages y workflow de GitHub Release.
- Lockfile pnpm y builds reproducibles con `pnpm install --frozen-lockfile`.
- Documentación técnica, usuario, operación, seguridad y gobierno.
