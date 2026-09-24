# Changelog

## [Unreleased]
### Fixed
- La generación de la documentación PDF es determinista y deja de modificar binarios sin cambios de contenido.
- Abrir un segundo PDF ya reemplaza correctamente el documento anterior: se destruye la tarea de carga de PDF.js en vez de invocar un método inexistente sobre el proxy.
- Las aperturas concurrentes descartan resultados obsoletos para que una carga anterior no sobrescriba la selección más reciente.
- Los errores de acceso, seguridad o cuota de `localStorage` ya no impiden iniciar ni continuar la lectura.
- Página, zoom, ajuste y rotación se guardan también al ocultar o abandonar la aplicación.
- Búsqueda y miniaturas permanecen abiertas al tocarlas: la navegación ya no registra por error el `body[data-view]` ni captura todos los clics.
- Las solicitudes de render, búsqueda, navegación y zoom se invalidan correctamente cuando una operación más reciente las reemplaza.
- Abrir un PDF dañado conserva el documento que ya estaba visible y muestra un error recuperable.
- El swipe de una página ampliada desplaza el contenido antes de cambiar de página y solo navega al alcanzar el borde correspondiente.
- El swipe evalúa el borde donde comenzó el gesto; llegar al borde durante el mismo arrastre ya no cambia de página accidentalmente.
- El salto directo confirma el número con Enter y mantiene sincronizados campo, estado interno y navegación posterior.
- Abrir otro documento cierra paneles antiguos para que búsqueda y miniaturas no queden vacíos o desfasados.
- Historial y About crean entradas de navegación para que Atrás regrese al lector en vez de cerrar directamente la aplicación.

### Changed
- Los PDF mayores de 24 MiB se abren sin duplicar sus bytes en IndexedDB, reduciendo presión de memoria y fallos de cuota en móviles.
- Las miniaturas se construyen al abrir el panel y en lotes navegables de 60, evitando trabajo proporcional a miles de páginas durante la apertura.
- El generador sintético acepta de 1 a 2.000 páginas para pruebas reproducibles de documentos pequeños y gigantes.
- La suite Node aumenta de 21 a 24 pruebas y añade regresiones para borde táctil, salto con Enter y miniaturas acotadas.
- Se documenta la validación funcional ejecutada y se separan explícitamente las pruebas que requieren un dispositivo Android conectado.

## [0.3.0] - 2026-09-07
### Fixed
- Las páginas ampliadas ya no pierden ni vuelven inaccesible el borde izquierdo en pantallas móviles o estrechas.
- El zoom por botones, pinza y doble toque conserva el punto de lectura en lugar de saltar a otra zona del documento.
- Rotar o cambiar el modo de ajuste mantiene una posición de lectura estable.

### Changed
- El lienzo crece con el PDF y permite recorrerlo de borde a borde mediante desplazamiento horizontal y vertical.
- Una indicación breve explica cómo desplazarse cuando la página supera el ancho visible.
- La verificación del repositorio protege el layout de zoom y el cálculo del ancla de lectura contra regresiones.

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
