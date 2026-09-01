# Android · compilación, firma y verificación

Este documento define la cadena Android de PDF Reader `v0.1.0`. El artefacto público es un APK release firmado; el APK debug de CI es solo evidencia de compilación y nunca se publica como release.

## Contrato de la aplicación

| Campo | Valor |
|---|---|
| Application ID | `cl.vladimiracunadev.pdfreader` |
| Versión | `0.1.0` |
| `versionCode` | `1` |
| Android mínimo | 7.0 · API 24 |
| Android objetivo | API 36 |
| Permisos declarados | ninguno |
| Distribución inicial | APK en GitHub Releases |

El selector de documentos del sistema entrega solo el archivo que la persona eligió. No se solicita `READ_EXTERNAL_STORAGE`, `WRITE_EXTERNAL_STORAGE`, `MANAGE_EXTERNAL_STORAGE` ni `INTERNET`.

## Requisitos

- Node.js 22+ y pnpm 11;
- JDK 21;
- Android SDK Platform 36;
- Android SDK Build Tools 36.0.0.

## Proyecto nativo y recursos

El directorio `android/` se versiona para fijar Gradle, SDK, iconos, splash y configuración de la primera versión. Los assets web dentro de `android/app/src/main/assets/public/` se regeneran y están ignorados por Git.

```bash
pnpm install --frozen-lockfile
pnpm android:assets
pnpm android:sync
```

- `android:assets` regenera iconos y splash desde `assets/logo.svg` con la herramienta oficial `@capacitor/assets`.
- `android:sync` construye el núcleo web, lo copia a Android y vuelve a aplicar versión y política de permisos.
- `scripts/patch-android.mjs` falla si el proyecto está incompleto o conserva un permiso prohibido.

## APK debug para desarrollo

```bash
pnpm android:debug
```

Salida:

```text
android/app/build/outputs/apk/debug/app-debug.apk
```

Este APK usa la clave debug del entorno y no es el archivo publicado.

## Clave persistente de release

Android identifica las actualizaciones por package name y certificado. La misma clave debe firmar toda la vida de la aplicación; perderla impide actualizar instalaciones existentes fuera de Google Play.

Generación inicial:

```bash
keytool -genkeypair -v \
  -keystore pdf-reader-release.jks \
  -alias pdf-reader \
  -keyalg RSA -keysize 4096 -validity 10000
```

La clave y sus contraseñas no se versionan. Guarda al menos una copia cifrada fuera del repositorio. Para GitHub Actions se configuran cuatro secrets:

- `ANDROID_KEYSTORE_BASE64`: contenido Base64 del `.jks`;
- `ANDROID_KEYSTORE_PASSWORD`;
- `ANDROID_KEY_ALIAS`;
- `ANDROID_KEY_PASSWORD`.

En PowerShell:

```powershell
[Convert]::ToBase64String([IO.File]::ReadAllBytes('.\pdf-reader-release.jks')) |
  gh secret set ANDROID_KEYSTORE_BASE64
```

Las contraseñas se envían por entrada estándar con `gh secret set`; no deben quedar en historial, archivos de texto ni logs.

## Release automatizado

Al publicar el tag `v0.1.0`, `.github/workflows/release.yml`:

1. comprueba que tag, `package.json` y notas coincidan;
2. ejecuta pruebas y genera el proyecto web;
3. compila `app-release-unsigned.apk`;
4. alinea el archivo con `zipalign`;
5. firma con la clave reconstruida en el directorio temporal del runner;
6. valida la firma con `apksigner`;
7. abre los metadatos con `aapt2` y comprueba paquete, versión y permisos;
8. confirma que el worker de PDF.js está dentro del APK;
9. publica APK, instaladores Windows y `SHA256SUMS.txt`.

## Verificación manual

Con Build Tools 36 en `PATH`:

```bash
apksigner verify --verbose --print-certs PDF-Reader-Android-v0.1.0.apk
aapt2 dump badging PDF-Reader-Android-v0.1.0.apk
sha256sum -c SHA256SUMS.txt
```

La salida de `aapt2` debe declarar:

```text
package: name='cl.vladimiracunadev.pdfreader' versionCode='1' versionName='0.1.0'
```

No debe aparecer ningún `uses-permission`.

## Instalar y probar

```bash
adb install -r PDF-Reader-Android-v0.1.0.apk
adb shell monkey -p cl.vladimiracunadev.pdfreader 1
```

Prueba manual mínima:

1. la app inicia con icono, splash y nombre correctos;
2. **Seleccionar PDF** abre el selector del sistema;
3. un PDF con texto renderiza su primera página;
4. anterior/siguiente, salto, zoom, ajuste, rotación y búsqueda responden;
5. swipe cambia una página y no interfiere con el desplazamiento vertical;
6. cerrar y volver a abrir el mismo documento recupera el estado;
7. modo oscuro mantiene legibilidad;
8. Android no muestra solicitudes de permisos.

## Google Play

`v0.1.0` no se publica en Play Store. Una distribución futura debe producir AAB, separar app-signing key y upload key, completar ficha de privacidad y pasar pruebas en dispositivos físicos. Eso no cambia la validez del APK firmado que se distribuye desde GitHub.
