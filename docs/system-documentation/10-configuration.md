# 10. Configuración

## Fuentes de verdad

| Archivo | Responsabilidad | Valores actuales relevantes |
|---|---|---|
| `package.json` | versión, scripts, dependencias, empaquetado | `0.3.0`, Node >=22, pnpm 11.19.0 |
| `pnpm-lock.yaml` | resolución reproducible | lockfile único |
| `capacitor.config.json` | identidad/shell Android | appId, `webDir=dist`, HTTPS, sin mixed content |
| `android/variables.gradle` | matriz SDK/librerías | min 24, compile/target 36 |
| `android/app/build.gradle` | paquete y versión APK | versionCode 3, versionName 0.3.0 |
| `AndroidManifest.xml` | actividades, intents y provider | launcher, VIEW PDF, FileProvider |
| `.github/workflows/*.yml` | CI/CD | Node 22, Java 21, SDK/Build Tools 36 |
| `.github/dependabot.yml` | actualizaciones | npm y Actions semanales |

`src/app.js` también contiene `APP_VERSION='0.3.0'`; es un marcador actual que debe mantenerse sincronizado. `scripts/patch-android.mjs` deriva Gradle desde `package.json`, pero no actualiza `APP_VERSION` ni textos de documentación.

## Variables de entorno

| Variable/secreto | Ámbito | Obligatorio | Uso |
|---|---|---|---|
| `PORT` | desarrollo local | No | puerto HTTP; defecto 4173 |
| `ANDROID_HOME` / `ANDROID_SDK_ROOT` | Android local | Sí para Gradle/SDK | ubicación SDK |
| `ANDROID_KEYSTORE_BASE64` | GitHub Release | Sí al etiquetar | keystore cifrado en Secrets |
| `ANDROID_KEYSTORE_PASSWORD` | GitHub Release | Sí | contraseña de almacén |
| `ANDROID_KEY_ALIAS` | GitHub Release | Sí | alias de firma |
| `ANDROID_KEY_PASSWORD` | GitHub Release | Sí | contraseña de clave |
| `CI` | runners/no TTY | Condicional | comportamiento no interactivo de pnpm |

No hay `.env`, feature flags remotos ni secretos de runtime. Los secretos anteriores no deben copiarse a archivos, argumentos de shell ni logs.

## Entornos

- **Desarrollo Web:** `pnpm build:web` crea `dist/`; el servidor local responde sin caché.
- **Pages:** `pages-dist/` contiene landing en raíz y app en `/app/`.
- **Electron:** carga `dist/index.html`; packaging incluye `dist`, `desktop` y manifest.
- **Android:** Capacitor copia `dist` a assets generados; `patch-android` aplica contrato.
- **Release:** el tag `vX.Y.Z` debe coincidir con `package.json` y notas.

## Configuración de seguridad

Electron activa `contextIsolation`, desactiva `nodeIntegration` y activa `sandbox`. Capacitor desactiva mixed content. Android usa `android:exported=true` solo en la actividad que debe recibir intents y un FileProvider no exportado. El manifiesto no debe declarar Internet ni permisos amplios de almacenamiento.

## Consecuencias de errores

- Versión o `versionCode` inconsistentes: CI/release falla o Android rechaza actualización.
- `webDir` incorrecto: APK sin aplicación Web funcional.
- worker/CMaps ausentes: PDF complejos pueden no renderizar correctamente.
- cambiar application ID: Android trata el paquete como aplicación distinta.
- perder/cambiar keystore: instalaciones existentes no se pueden actualizar.
- habilitar mixed content/Node en renderer: amplía superficie de ataque.
- renombrar checks: la protección de `main` podría esperar contextos inexistentes.

## Valores no identificados

No se identifican configuraciones separadas de staging, logging, observabilidad, proxy, CSP HTTP, Sentry, analítica, base de datos remota ni rotación automatizada de secretos.
