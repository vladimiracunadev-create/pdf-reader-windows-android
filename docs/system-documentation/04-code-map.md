# 04. Mapa completo del código

## Árbol funcional

```text
src/                 Núcleo Web: UI, estilos, lector, persistencia y utilidades
desktop/             Proceso principal y preload de Electron
android/             Proyecto Gradle/Capacitor, plugin de intents y recursos
scripts/             Build, servidor, sincronización, verificación y smoke PDF
test/                Pruebas unitarias Node
site/                Landing de GitHub Pages
assets/, build/      Fuentes visuales y recursos de empaquetado
.github/             CI/CD, Dependabot, CODEOWNERS y plantilla de PR
docs/, spec/         Arquitectura, operación, producto e historia
reports/             Evidencia histórica de validación
```

## Núcleo activo

| Ubicación | Responsabilidad | Consumidores | Estado/importancia |
|---|---|---|---|
| `src/index.html` | Estructura de Lector, Historial, About, paneles y diálogo | `app.js`, CSS | Activo, crítico |
| `src/styles.css` | Layout responsive, temas y canvas desplazable | navegador/WebView | Activo, crítico |
| `src/app.js` | Estado, apertura, render, búsqueda, zoom, gestos, compartir y arranque | todas las superficies | Activo, crítico |
| `src/history-store.js` | CRUD IndexedDB y límite de ocho documentos | `app.js` | Activo, alto |
| `src/utils.js` | Diez funciones puras de formato, identidad, geometría y escape | `app.js`, tests | Activo, alto |
| `src/about.html` | Redirección compatible a `#about` | enlaces antiguos/directos | Activo, bajo |

## Adaptadores

| Ubicación | Elementos | Dependencias | Estado |
|---|---|---|---|
| `desktop/main.cjs` | `readPdf`, `createWindow`, handlers IPC y ciclo Electron | Electron, `fs/promises`, `path` | Activo |
| `desktop/preload.cjs` | API `desktopPdf` | `contextBridge`, `ipcRenderer` | Activo |
| `MainActivity.java` | registro del plugin y nuevos intents | Capacitor `BridgeActivity` | Activo |
| `PdfIntentPlugin.java` | `getPendingPdf`, `requestDefault`, `queryName`, `createSamplePdf` | Android ContentResolver, FileProvider, Capacitor | Activo |
| `AndroidManifest.xml` | launcher, `ACTION_VIEW`, FileProvider | Android | Activo |
| `capacitor.config.json` | identidad y webDir | Capacitor | Activo |

## Automatización

| Script | Entrada/salida | Uso |
|---|---|---|
| `build-web.mjs` | `src` + PDF.js -> `dist` | Web, desktop, Android |
| `build-pages.mjs` | `site` + `dist` -> `pages-dist` | Pages |
| `serve.mjs` | directorio/`PORT` -> HTTP local | desarrollo |
| `clean.mjs` | elimina `dist` y `release` | mantenimiento |
| `android-init.mjs` | crea Android si falta y parchea | bootstrap |
| `run-gradle.mjs` | tareas CLI -> wrapper Gradle | build multiplataforma |
| `patch-android.mjs` | package/manifest/strings -> Android coherente | sync/CI |
| `verify-repo.mjs` | archivos y marcadores -> gate | tests/CI |
| `create-smoke-pdf.mjs` | texto fijo -> PDF de una página | prueba manual |
| `generate-system-docs-pdf.py` | 20 Markdown -> 20 PDF | documentación reproducible mediante `pnpm docs:pdf` |
| `verify-system-docs.mjs` | Markdown + PDF -> gate de coherencia | `pnpm docs:check` |

## Pruebas

`test/utils.test.mjs` contiene 9 pruebas para límites, formato, snippets, escape HTML, identidad de documentos, distancia táctil, compartir y ancla de zoom. Android aporta una prueba instrumentada del application ID y una prueba plantilla `additionIsCorrect`; esta última es trivial y se considera deuda.

## Configuración y documentación

`package.json`, `pnpm-lock.yaml`, Gradle y los tres workflows son fuentes de verdad de versiones/build. `spec/spec.md` define alcance; `CHANGELOG.md` y `docs/releases/` son historia. Los documentos raíz `RUNBOOK.md`, `RELEASE.md` y `SECURITY.md` son portadas breves hacia contenido canónico. `docs/system-documentation/` y su generador PDF forman el dossier derivado de este análisis.

## Generado, legado o no determinado

- `dist/`, `pages-dist/`, `release/` y assets Web dentro de Android son generados/ignorados.
- `android/app/capacitor.build.gradle` y `capacitor.settings.gradle` se regeneran por Capacitor.
- `docs/sistema/index.md` y `docs/usuario/index.md` son índices compatibles, no duplicados funcionales.
- No se identificaron módulos obsoletos de producción. `ExampleUnitTest.java` es una plantilla sin valor de dominio.
- Los PNG de splash/iconos y `gradle-wrapper.jar` son binarios necesarios; no se inspeccionó su contenido fuente.
