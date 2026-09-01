<div align="center">

<img src="assets/logo.svg" width="112" alt="Icono de PDF Reader: documento con lupa sobre fondo azul">

# PDF Reader

## **Abrir · leer · navegar · buscar — sin modificar el documento**

**Lector PDF local y de solo lectura para Android, Windows y navegador. Interfaz directa, controles táctiles amplios, cero cuentas y cero telemetría.**

[![CI](https://github.com/vladimiracunadev-create/pdf-reader-windows-android/actions/workflows/ci.yml/badge.svg)](https://github.com/vladimiracunadev-create/pdf-reader-windows-android/actions/workflows/ci.yml)
[![GitHub Pages](https://github.com/vladimiracunadev-create/pdf-reader-windows-android/actions/workflows/pages.yml/badge.svg)](https://vladimiracunadev-create.github.io/pdf-reader-windows-android/)
[![Release](https://img.shields.io/github/v/release/vladimiracunadev-create/pdf-reader-windows-android?label=versi%C3%B3n&color=3157d5)](CHANGELOG.md)
[![Android](https://img.shields.io/badge/Android-7%2B-3DDC84?logo=android&logoColor=white)](#-android-primero)
[![Telemetría](https://img.shields.io/badge/telemetr%C3%ADa-cero-2f9e67)](docs/privacy.md)
[![Licencia](https://img.shields.io/badge/licencia-MIT-blue)](LICENSE)

📱 **[Descargar APK Android →](https://github.com/vladimiracunadev-create/pdf-reader-windows-android/releases/latest/download/PDF-Reader-Android-v0.2.0.apk)** ·
🌐 **[Página del producto →](https://vladimiracunadev-create.github.io/pdf-reader-windows-android/)** ·
▶️ **[Probar en el navegador →](https://vladimiracunadev-create.github.io/pdf-reader-windows-android/app/)** ·
📘 **[Manual de usuario →](docs/user-guide.md)**

</div>

---

**PDF Reader reduce la lectura de un documento al flujo que una persona realmente necesita:** abrir → leer → navegar → buscar. No muestra herramientas de edición, no sobrescribe el original y mantiene el estado **Solo lectura** visible.

El PDF se procesa localmente con Mozilla PDF.js. No existe backend, cuenta, publicidad, analítica ni subida automática de archivos.

> **Tus documentos se abren en tu dispositivo y se quedan allí.**

## 📱 Android primero

`v0.2.0` consolida Android como experiencia principal: reorganiza la interfaz móvil, separa los controles del visor, incorpora zoom de pinza real, historial reabrible, compartir hacia WhatsApp mediante la hoja nativa y una pestaña About coherente con los proyectos RootCause del autor. Windows y la demo web comparten el mismo núcleo.

| Superficie Android | Estado en v0.2.0 |
|---|---|
| Compatibilidad | Android 7.0+ · API mínima 24 · objetivo API 36 |
| Instalación | APK release firmado para descarga directa desde GitHub |
| Archivos | Selector de documentos del sistema; sin acceso general al almacenamiento |
| Permisos | **Cero permisos sensibles o con consentimiento**: sin `INTERNET` ni almacenamiento general |
| Privacidad | Sin cuentas, anuncios, backend ni telemetría |
| Interacción | Controles fuera del lienzo, pinza y doble toque para zoom, swipe horizontal entre páginas |
| Continuidad | Historial local de hasta ocho PDF con última página y apertura directa |
| Compartir | Hoja nativa del sistema; WhatsApp recibe solo nombre/progreso, nunca el PDF |
| Lector predeterminado | Pregunta una vez por versión y guía a elegir **PDF Reader → Siempre** |
| Integridad | `SHA256SUMS.txt` publicado junto a cada release |
| Verificación CI | paquete, `versionCode`, `versionName`, permisos, firma y PDF.js dentro del APK |

### Instalar el APK

1. Descarga `PDF-Reader-Android-v0.2.0.apk` desde el [release más reciente](https://github.com/vladimiracunadev-create/pdf-reader-windows-android/releases/latest).
2. Abre el archivo en Android.
3. Si el sistema lo solicita, permite a tu navegador o gestor de archivos instalar aplicaciones desconocidas.
4. Revisa el resumen: PDF Reader no debe solicitar acceso a cámara, micrófono, ubicación, contactos ni Internet.
5. Instala y pulsa **Seleccionar PDF**.
6. La primera apertura de cada versión pregunta si quieres usar PDF Reader por defecto. Pulsa **Configurar ahora**, elige **PDF Reader** y después **Siempre** en el selector de Android.

La clave de firma es la misma usada por `v0.1.0`, por lo que `v0.2.0` puede instalarse como actualización sin cambiar la identidad criptográfica de la app. El procedimiento está en [Compilar y publicar Android](docs/android.md).

## ✅ Estado verificable

| Superficie | Evidencia |
|---|---|
| 📄 Lectura | PDF.js `6.3.289`, worker separado, CMaps, fuentes estándar y decodificadores WASM empaquetados |
| 🧭 Navegación | anterior/siguiente, salto directo, miniaturas y swipe Android |
| 🔎 Búsqueda | extracción de texto por página, snippets y navegación al resultado |
| 🔍 Vista | pinza y doble toque independientes del número de páginas, zoom, ajustes y rotación |
| 🕘 Continuidad | copia local de hasta ocho PDF recientes, progreso reabrible y borrado explícito |
| 💬 Compartir | hoja nativa Android con WhatsApp u otra app; fallback Web Share/WhatsApp Web |
| 🧪 Calidad | 8 pruebas unitarias + verificador de estructura/alcance + tres jobs de CI |
| 📦 Android | Gradle test + APK debug en CI; APK release firmado y auditado al etiquetar |
| 🪟 Windows | instalador NSIS y portable generados en runner Windows |
| 🌐 Web | landing y demo funcional separadas en GitHub Pages |
| 🔒 Privacidad | cero permisos Android sensibles; Electron aislado; sin red de aplicación ni telemetría |

El reporte de la versión está en [`reports/validation-v0.2.0.md`](reports/validation-v0.2.0.md). Se completa con la evidencia de GitHub Actions y los hashes del release, no con afirmaciones manuales.

## ✨ Funcionalidades

- Abrir PDF local desde el selector del sistema.
- Navegar a la página anterior, siguiente o a un número exacto.
- Recorrer miniaturas y abrir una página desde ellas.
- Ampliar con pinza o doble toque, acercar/alejar, ajustar al ancho o mostrar la página completa.
- Rotar en pasos de 90°.
- Buscar texto por todas las páginas y abrir cada coincidencia.
- Elegir tema claro u oscuro y usar pantalla completa.
- Guardar localmente hasta ocho PDF recientes y reabrirlos en su última página.
- Compartir el nombre y progreso de lectura hacia WhatsApp u otra conversación; el archivo no se adjunta.
- Preguntar una vez por versión si debe ser el lector `.pdf` predeterminado, sin imponer la elección del sistema.
- Cambiar entre Lector, Historial y About sin controles superpuestos.
- Deslizar horizontalmente para cambiar de página en Android.
- Arrastrar archivos, usar atajos y asociar `.pdf` en Windows.

## 🔒 Qué hace y qué no hace

| Sí | No |
|---|---|
| Renderiza el PDF y guarda hasta ocho copias en el historial local | No edita ni sobrescribe el PDF original |
| Guarda preferencias y progreso en el dispositivo | No sube documentos a una nube |
| Lee el archivo elegido por la persona | No explora todo el almacenamiento |
| Busca texto que el PDF expone | No aplica OCR a documentos escaneados |
| Funciona sin cuenta | No incorpora anuncios ni analítica |

Los PDF son contenido no confiable. En Windows, el renderer de Electron usa `contextIsolation`, desactiva Node y se ejecuta en sandbox; en Android, el manifiesto no declara permisos y el archivo entra mediante el selector del sistema. Consulta [Seguridad](docs/security.md) y [Privacidad](docs/privacy.md).

## 🏗️ Arquitectura

```mermaid
flowchart TB
    U(["👤 Persona"]) -->|"Selecciona o abre un .pdf"| IN

    subgraph APP["📄 Núcleo de lectura compartido · HTML + CSS + JavaScript"]
        direction TB
        IN["📥 Entrada controlada<br/>File Picker · drag & drop · intent"]
        BYTES["🧱 Documento local<br/>Uint8Array"]
        ENGINE["⚙️ Mozilla PDF.js 6.3.289"]
        UI["🖥️ Experiencia de lectura<br/>canvas · miniaturas · búsqueda · zoom táctil"]
        IN --> BYTES --> ENGINE --> UI
        UI --> STATE[("🗃️ Estado local<br/>IndexedDB: 8 recientes<br/>localStorage: tema y progreso")]
        STATE -. "reabrir" .-> BYTES
    end

    subgraph PLATFORMS["📦 Adaptadores de plataforma"]
        direction LR
        ANDROID["🤖 Android 7+<br/>Capacitor 8.5 · Kotlin<br/>ACTION_VIEW · Share nativo"]
        WINDOWS["🪟 Windows 10/11<br/>Electron 44 sandbox<br/>IPC mínimo · asociación .pdf"]
        WEB["🌐 Web<br/>navegador · GitHub Pages<br/>demo instalable sin backend"]
    end

    UI --> ANDROID
    UI --> WINDOWS
    UI --> WEB
    UI -->|"solo nombre, página y progreso"| SHARE["💬 Hoja de compartir<br/>WhatsApp u otra app"]

    LOCAL["🔒 Frontera de privacidad<br/>sin cuenta · sin servidor · sin telemetría"]
    STATE --- LOCAL

    classDef core fill:#3157d5,color:#fff,stroke:#193690,stroke-width:2px;
    classDef native fill:#0f766e,color:#fff,stroke:#064e3b,stroke-width:2px;
    classDef data fill:#7c3aed,color:#fff,stroke:#4c1d95,stroke-width:2px;
    classDef guard fill:#111827,color:#fff,stroke:#6b7280,stroke-width:2px;
    class ENGINE,UI core;
    class ANDROID,WINDOWS,WEB native;
    class STATE data;
    class LOCAL guard;
```

### Capas y responsabilidades

| Capa | Responsabilidad | Garantía observable |
|---|---|---|
| **Experiencia** | Navegación, tema, zoom táctil, miniaturas, búsqueda, historial y About | La barra inferior nunca invade el documento; el zoom no depende del número de páginas |
| **Motor** | Decodificar, renderizar y extraer texto con PDF.js | El archivo original es de solo lectura y nunca se sobrescribe |
| **Persistencia local** | Guardar preferencias, progreso y hasta ocho PDF recientes | Todo queda en el dispositivo y puede borrarse desde Historial |
| **Android-first** | Recibir intents PDF, ofrecerse como lector predeterminado y abrir la hoja nativa de compartir | Kotlin queda limitado al puente del sistema; la lectura vive en el núcleo común |
| **Windows** | Ventana Electron, diálogo de archivos, asociación `.pdf` y acceso a configuración predeterminada | Renderer aislado, sin Node y dentro de sandbox |
| **Entrega** | CI, Pages y release firmado por tag | `pnpm` + lockfile único, checks reproducibles y hashes SHA-256 publicados |

La arquitectura favorece un núcleo pequeño y auditable antes que una jerarquía de framework. Los adaptadores nativos solo exponen capacidades que el navegador no ofrece; no duplican la lógica del lector. El desglose técnico, los flujos de confianza y los límites de `v0.2.0` están en la [documentación de arquitectura](docs/architecture.md).

## 🚀 Ejecutar y verificar

Requisitos generales: Node.js 22+ y pnpm 11.

```bash
pnpm install --frozen-lockfile
pnpm check
pnpm build:pages
pnpm start:web
```

La demo se abre en `http://localhost:4173`. Los documentos recientes pueden quedar guardados en el almacenamiento local del origen hasta que se borre el historial o los datos del sitio.

### Android

Requisitos adicionales: JDK 21 y Android SDK 36.

```bash
pnpm android:init
pnpm android:sync
cd android
./gradlew test assembleDebug
```

El APK local queda en `android/app/build/outputs/apk/debug/app-debug.apk`. Para generar y auditar un APK release firmado, sigue [`docs/android.md`](docs/android.md).

### Windows

```bash
pnpm start:desktop
pnpm build:windows
```

Los `.exe` quedan en `release/windows/`. La versión comunitaria no está firmada con Authenticode, por lo que Windows puede mostrar SmartScreen; comprueba el hash del release antes de continuar.

## 📚 Documentación

- [Índice de documentación](docs/index.md)
- [Manual de usuario](docs/user-guide.md)
- [Android: build, firma, instalación y verificación](docs/android.md)
- [Arquitectura](docs/architecture.md)
- [Seguridad](docs/security.md)
- [Privacidad](docs/privacy.md)
- [Releases](docs/release.md)
- [Troubleshooting](docs/troubleshooting.md)
- [Especificación de la base v0.1.0](spec/spec.md)
- [Roadmap](ROADMAP.md)
- [Contribuir](CONTRIBUTING.md)

## ⚠️ Límites de v0.2.0

- Los PDF con contraseña todavía no tienen un diálogo dedicado.
- Los documentos escaneados sin capa de texto se pueden leer visualmente, pero no buscar por contenido.
- Un documento muy grande se carga en memoria y su copia de historial puede superar la cuota local del dispositivo; el lector informa ese caso y mantiene el PDF abierto.
- El instalador Windows no tiene firma comercial Authenticode.
- Google Play todavía no forma parte de la distribución; Android se entrega mediante APK firmado en GitHub Releases.

## 🗺️ Próximo tramo

`v0.3` prioriza diálogo de contraseña, miniaturas virtualizadas y más pruebas instrumentadas en dispositivos físicos. Edición, firma, anotaciones y sincronización en nube siguen fuera del alcance base.

## 📄 Licencias

Código y documentación original bajo [MIT](LICENSE). `pdfjs-dist` se distribuye bajo Apache-2.0; Electron, Capacitor y electron-builder conservan sus respectivas licencias.

---

Hecho con cuidado por [Vladimir Acuña](https://github.com/vladimiracunadev-create).

¿Te resulta útil? ⭐ Dale una estrella al repositorio.
