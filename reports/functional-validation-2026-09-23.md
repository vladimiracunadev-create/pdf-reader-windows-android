# Validación funcional posterior a instalación · 2026-09-23

Este informe registra acciones realmente ejecutadas sobre el código y la compilación local. No presenta como verificadas pruebas que no se pudieron ejecutar.

## Entorno observado

- rama: `main`;
- versión de producto: `0.3.0`, Android `versionCode 3`;
- Node.js 22+ y pnpm `11.19.0` según el contrato del repositorio;
- JDK `21.0.8` de Android Studio;
- Android SDK local con API objetivo 36;
- navegador integrado con viewport de escritorio y viewport móvil de `360 × 740`;
- ningún teléfono ni emulador aparecía disponible mediante ADB.

## Gates automatizados ejecutados

| Comando | Resultado observado |
|---|---|
| `pnpm check` | Correcto: 14/14 pruebas Node, verificador del repositorio y comprobación documental |
| `pnpm android:debug` | Correcto: `BUILD SUCCESSFUL`, 123 tareas, APK debug generado |
| `node scripts/run-gradle.mjs testDebugUnitTest` | Correcto: `BUILD SUCCESSFUL`, 69 tareas |
| `git diff --check` | Correcto: sin errores de whitespace |

APK comprobado: `android/app/build/outputs/apk/debug/app-debug.apk`, 7.829.100 bytes. Es un artefacto debug para validación, no el APK release firmado de distribución.

## Pruebas funcionales interactivas ejecutadas

Se construyó `dist/`, se sirvió en `http://localhost:4173` y se operó la interfaz mediante controles visibles del navegador.

| Flujo | Acción ejecutada | Resultado observado |
|---|---|---|
| Apertura real | Selección de `docs/system-documentation/pdf/01-system-overview.pdf` | Documento de 2 páginas renderizado; nombre, tamaño y controles habilitados |
| Navegación | Página siguiente, anterior e historial | Página y progreso coherentes; Historial mostró el documento y su última página |
| Atrás | Historial → Atrás | Regreso al lector conservando documento y página |
| Responsive móvil | Viewport `360 × 740` | Cabecera, canvas, dock y navegación inferior visibles sin solaparse |
| Búsqueda | Consulta `telemetría` | Una página con coincidencias y un resultado creado sin error de ejecución |
| Miniaturas | Toque en el control de páginas | Panel `sidebar open`, visible hasta cerrarlo explícitamente |
| Búsqueda táctil | Toque en el control de búsqueda | Panel `search-panel open`, visible hasta cerrarlo explícitamente |
| PDF dañado | Apertura de `test/fixtures/invalid.pdf` con otro PDF abierto | El PDF anterior siguió visible; no apareció la pantalla de error destructiva; se informó que el archivo era inválido |
| Zoom/navegación rápida | Acciones consecutivas de ampliar y cambiar página | Sin pantalla de error ni excepción nueva de render |
| Tema | Cambio claro/oscuro | Atributo de tema actualizado y controles conservados |

Durante la primera pasada se reprodujo un defecto real: Búsqueda y Miniaturas se cerraban inmediatamente. La causa comprobada era que `querySelectorAll('[data-view]')` incluía el propio `body`; todos los clics burbujeaban hasta él, ejecutaban `setView` y cerraban los paneles. Tras restringir el selector a `button[data-view]`, ambos paneles permanecieron abiertos en la repetición de la prueba.

La prueba inicial de búsqueda también detectó una regresión durante el cambio: una variable local llamada `document` ocultaba al DOM y producía `TypeError: document.createElement is not a function`. Se renombró a `pdfDocument`; la repetición creó el resultado y no generó un error nuevo.

## Pruebas de regresión añadidas

- swipe normal cambia de página;
- swipe ampliado desplaza antes de navegar;
- gestos lentos, cortos o verticales no cambian de página;
- el selector de navegación solo registra `button[data-view]`;
- los documentos mayores que el límite preventivo no se duplican en el historial.

## No ejecutado y no afirmado

La ausencia de dispositivo/emulador ADB impidió ejecutar `connectedAndroidTest` y comprobar físicamente:

- apertura desde Archivos mediante `ACTION_VIEW` con la app cerrada y ya activa;
- pinza, doble toque y swipe con eventos táctiles de hardware;
- rotación, background/restore y presión del sistema sobre memoria;
- hoja nativa de compartir y selección de WhatsApp;
- asistente de lector predeterminado del fabricante;
- instalación/actualización del APK sobre modelos y versiones Android diferentes.

La compilación y las pruebas Gradle validan que el proyecto nativo integra y empaqueta los cambios, pero no sustituyen esos escenarios físicos. Deben formar la siguiente matriz de aceptación en un teléfono o emulador conectado.
