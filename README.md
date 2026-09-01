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

📱 **[Descargar APK Android →](https://github.com/vladimiracunadev-create/pdf-reader-windows-android/releases/latest/download/PDF-Reader-Android-v0.1.0.apk)** ·
🌐 **[Página del producto →](https://vladimiracunadev-create.github.io/pdf-reader-windows-android/)** ·
▶️ **[Probar en el navegador →](https://vladimiracunadev-create.github.io/pdf-reader-windows-android/app/)** ·
📘 **[Manual de usuario →](docs/user-guide.md)**

</div>

---

**PDF Reader reduce la lectura de un documento al flujo que una persona realmente necesita:** abrir → leer → navegar → buscar. No muestra herramientas de edición, no sobrescribe el original y mantiene el estado **Solo lectura** visible.

El PDF se procesa localmente con Mozilla PDF.js. No existe backend, cuenta, publicidad, analítica ni subida automática de archivos.

> **Tus documentos se abren en tu dispositivo y se quedan allí.**

## 📱 Android primero

La prioridad de `v0.1.0` es una primera aplicación Android instalable y comprobable. Windows y la demo web comparten el mismo núcleo, pero el contrato de publicación exige que el APK pase verificaciones adicionales antes de llegar a GitHub Releases.

| Superficie Android | Estado en v0.1.0 |
|---|---|
| Compatibilidad | Android 7.0+ · API mínima 24 · objetivo API 36 |
| Instalación | APK release firmado para descarga directa desde GitHub |
| Archivos | Selector de documentos del sistema; sin acceso general al almacenamiento |
| Permisos | **Ningún permiso declarado**: tampoco `INTERNET` |
| Privacidad | Sin cuentas, anuncios, backend ni telemetría |
| Interacción | Controles táctiles de al menos 40–44 px y swipe horizontal entre páginas |
| Integridad | `SHA256SUMS.txt` publicado junto a cada release |
| Verificación CI | paquete, `versionCode`, `versionName`, permisos, firma y PDF.js dentro del APK |

### Instalar el APK

1. Descarga `PDF-Reader-Android-v0.1.0.apk` desde el [release más reciente](https://github.com/vladimiracunadev-create/pdf-reader-windows-android/releases/latest).
2. Abre el archivo en Android.
3. Si el sistema lo solicita, permite a tu navegador o gestor de archivos instalar aplicaciones desconocidas.
4. Revisa el resumen: PDF Reader no debe solicitar acceso a cámara, micrófono, ubicación, contactos ni Internet.
5. Instala y pulsa **Seleccionar PDF**.

La clave de firma de esta primera versión es persistente y queda protegida como GitHub Actions Secret; las siguientes versiones pueden actualizarse sobre `v0.1.0` sin cambiar la identidad criptográfica de la app. El procedimiento está en [Compilar y publicar Android](docs/android.md).

## ✅ Estado verificable

| Superficie | Evidencia |
|---|---|
| 📄 Lectura | PDF.js `6.3.289`, worker separado, CMaps, fuentes estándar y decodificadores WASM empaquetados |
| 🧭 Navegación | anterior/siguiente, salto directo, miniaturas y swipe Android |
| 🔎 Búsqueda | extracción de texto por página, snippets y navegación al resultado |
| 🔍 Vista | zoom, 100 %, ajuste al ancho, página completa y rotación 90° |
| 🧪 Calidad | 5 pruebas unitarias + verificador de estructura/alcance + tres jobs de CI |
| 📦 Android | Gradle test + APK debug en CI; APK release firmado y auditado al etiquetar |
| 🪟 Windows | instalador NSIS y portable generados en runner Windows |
| 🌐 Web | landing y demo funcional separadas en GitHub Pages |
| 🔒 Privacidad | cero permisos Android; Electron aislado; sin red de aplicación ni telemetría |

El reporte de la versión está en [`reports/validation-v0.1.0.md`](reports/validation-v0.1.0.md). Se actualiza con la evidencia de GitHub Actions y los hashes del release, no con afirmaciones manuales.

## ✨ Funcionalidades

- Abrir PDF local desde el selector del sistema.
- Navegar a la página anterior, siguiente o a un número exacto.
- Recorrer miniaturas y abrir una página desde ellas.
- Acercar, alejar, volver a 100 %, ajustar al ancho o mostrar la página completa.
- Rotar en pasos de 90°.
- Buscar texto por todas las páginas y abrir cada coincidencia.
- Elegir tema claro u oscuro y usar pantalla completa.
- Recordar localmente página, zoom, modo de ajuste y rotación por documento.
- Deslizar horizontalmente para cambiar de página en Android.
- Arrastrar archivos, usar atajos y asociar `.pdf` en Windows.

## 🔒 Qué hace y qué no hace

| Sí | No |
|---|---|
| Renderiza una copia en memoria | No edita ni sobrescribe el PDF |
| Guarda preferencias en el dispositivo | No sube documentos a una nube |
| Lee el archivo elegido por la persona | No explora todo el almacenamiento |
| Busca texto que el PDF expone | No aplica OCR a documentos escaneados |
| Funciona sin cuenta | No incorpora anuncios ni analítica |

Los PDF son contenido no confiable. En Windows, el renderer de Electron usa `contextIsolation`, desactiva Node y se ejecuta en sandbox; en Android, el manifiesto no declara permisos y el archivo entra mediante el selector del sistema. Consulta [Seguridad](docs/security.md) y [Privacidad](docs/privacy.md).

## 🏗️ Arquitectura

```text
PDF elegido por la persona
          │
          ▼
    Uint8Array en memoria
          │
          ▼
  Mozilla PDF.js 6.3.289
          │
          ├── Canvas principal
          ├── Miniaturas
          └── Texto para búsqueda
          │
          ├── Capacitor 8.5 → Android 7+ (.apk)
          ├── Electron 44   → Windows (.exe)
          └── GitHub Pages  → landing + demo web
```

La aplicación usa HTML, CSS y JavaScript sin framework para mantener pequeño y auditable el núcleo. Las dependencias están fijadas y `pnpm-lock.yaml` permite instalaciones reproducibles.

## 🚀 Ejecutar y verificar

Requisitos generales: Node.js 22+ y pnpm 11.

```bash
pnpm install --frozen-lockfile
pnpm check
pnpm build:pages
pnpm start:web
```

La demo se abre en `http://localhost:4173`. Los documentos elegidos permanecen en esa pestaña.

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
- [Especificación v0.1.0](spec/spec.md)
- [Roadmap](ROADMAP.md)
- [Contribuir](CONTRIBUTING.md)

## ⚠️ Límites de v0.1.0

- Los PDF con contraseña todavía no tienen un diálogo dedicado.
- Los documentos escaneados sin capa de texto se pueden leer visualmente, pero no buscar por contenido.
- Un documento muy grande se carga en memoria y puede requerir bastante RAM.
- El instalador Windows no tiene firma comercial Authenticode.
- Google Play no forma parte de esta primera entrega; la distribución Android es mediante APK en GitHub Releases.

## 🗺️ Próximo tramo

`v0.2` prioriza diálogo de contraseña, miniaturas virtualizadas, pruebas del flujo real con PDF y mejoras de accesibilidad. Edición, firma, anotaciones y sincronización en nube siguen fuera del alcance base.

## 📄 Licencias

Código y documentación original bajo [MIT](LICENSE). `pdfjs-dist` se distribuye bajo Apache-2.0; Electron, Capacitor y electron-builder conservan sus respectivas licencias.

---

Hecho con cuidado por [Vladimir Acuña](https://github.com/vladimiracunadev-create).

¿Te resulta útil? ⭐ Dale una estrella al repositorio.
