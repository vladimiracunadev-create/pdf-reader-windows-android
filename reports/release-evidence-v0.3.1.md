# Evidencia de release · v0.3.1

Fecha de verificación: 2026-09-24. Este informe separa funcionalidad observada, automatización, build/publicación e inspección estática; no convierte un build correcto en una prueba física de uso.

## Identidad y trazabilidad

| Campo | Valor comprobado |
|---|---|
| Versión | `0.3.1` |
| Tag | `v0.3.1` |
| Commit etiquetado | `e22b7307a7f49c2644415b2c2a447d85054854e6` |
| Android | `versionCode 4`, `versionName 0.3.1`, `minSdk 24`, `targetSdk 36` |
| Release | <https://github.com/vladimiracunadev-create/pdf-reader-windows-android/releases/tag/v0.3.1> |
| Workflow de release | <https://github.com/vladimiracunadev-create/pdf-reader-windows-android/actions/runs/36034894708> |

La etiqueta se creó solo después de que CI y Pages terminaran correctamente sobre ese commit. El enlace `/releases/latest` respondió con redirección a `v0.3.1` y la página pública respondió HTTP 200 mostrando `v0.3.1` y la navegación sin saltos.

## Gates ejecutados

| Nivel de evidencia | Ejecución | Resultado observable |
|---|---|---|
| Automatizada/local | `CI=true pnpm release:check` | 24/24 pruebas, verificador, 20 Markdown/20 PDF y build Pages aprobados |
| Build/local | `pnpm android:sync` y `pnpm android:debug` | Gradle finalizó; APK debug generado e inspeccionado |
| Build/remoto | [CI `36034447076`](https://github.com/vladimiracunadev-create/pdf-reader-windows-android/actions/runs/36034447076) | Web, Android y Windows aprobados |
| Publicación/remota | [Pages `36034447091`](https://github.com/vladimiracunadev-create/pdf-reader-windows-android/actions/runs/36034447091) | despliegue aprobado |
| Publicación/remota | [Release `36034894708`](https://github.com/vladimiracunadev-create/pdf-reader-windows-android/actions/runs/36034894708) | contrato de tag, APK firmado, instaladores y GitHub Release aprobados |
| Funcional interactiva | [matriz de lectura](functional-reading-validation-2026-09-24.md) | recorridos Chromium con PDF de 1, 12 y 1.000 páginas, antes/después y recuperación |

## Artefactos descargados y verificados

Los cuatro archivos se descargaron desde el tag explícito `v0.3.1`. Los tres binarios coincidieron byte a byte con `SHA256SUMS.txt`.

| Artefacto | Bytes | SHA-256 |
|---|---:|---|
| `PDF-Reader-Android-v0.3.1.apk` | 6.232.729 | `d5cc2d23d4d3a7a4499d931d8cd8a9f9ccc1816eeb7f2ed87ef9c451b7e63e7b` |
| `PDF-Reader-Windows-0.3.1-x64-Portable.exe` | 128.540.115 | `216ac06f0d3f385d8c9830afe61c2a4804e071182a67554f0153fb269429435e` |
| `PDF-Reader-Windows-0.3.1-x64-Setup.exe` | 128.763.886 | `67c893ab26e45fe93845f821176bf432dca1c3ddd4aa8c9a4b2a25e74de4cdd2` |
| `SHA256SUMS.txt` | 315 | `c5dd075f8f23a303047db46d360e455a77ca975da31c6b872793db203225c5f5` |

`aapt2 dump badging` confirmó el package `cl.vladimiracunadev.pdfreader`, las versiones y únicamente el permiso interno `DYNAMIC_RECEIVER_NOT_EXPORTED_PERMISSION`; no aparecieron `INTERNET` ni permisos de almacenamiento general. `apksigner verify --verbose --print-certs` aprobó esquemas v2 y v3, un firmante RSA de 4096 bits y certificado SHA-256 `8005f1d679b970f43f0c627ff3b668daafa3a4af9c7abbe6afa7cb19b2cb1a12`.

Los dos ejecutables Windows existen, tienen tamaño no nulo y checksum correcto. `Get-AuthenticodeSignature` devolvió `NotSigned` para ambos; es un límite documentado, no una firma implícita.

## Coherencia documental

- versión actual sincronizada en package, aplicación, Gradle, landing, README, documentación y notas;
- `version_probe.py --verify --old 0.3.0 --new 0.3.1` no encontró marcadores **actuales** antiguos; las apariciones restantes de `0.3.0` son historial fechado o dependencias;
- se conservaron sin reescribir `CHANGELOG.md`, notas e informes históricos;
- el About público, el sitio y `/releases/latest` anuncian `v0.3.1`;
- el verificador exige desde esta versión tanto la matriz funcional como este informe de publicación.

## No ejecutado y riesgo residual

- instalación o actualización del APK en un teléfono físico;
- swipe, pinza, rotación, background/restore, selector predeterminado y compartir en hardware Android;
- instalación, asociación `.pdf`, SmartScreen y uso prolongado de los ejecutables Windows publicados;
- lectores de pantalla y matriz amplia de dispositivos/WebView;
- estrés de memoria hasta agotamiento con archivos reales gigantes.

Un viewport móvil o un gesto sintético no sustituye esas pruebas. La ausencia de hardware disponible se mantiene explícita.

## Veredicto

- **Web:** evidencia funcional y automatizada suficiente para los recorridos ejecutados; Pages publicado.
- **Android:** artefacto de release íntegro, firmado y coherente; usabilidad física **no certificada**.
- **Windows:** artefactos íntegros y empaquetados; ejecución del binario publicado y Authenticode no comprobados como aprobados (los binarios están sin firmar).
- **Global:** release `v0.3.1` publicado con trazabilidad y evidencia suficiente para sus artefactos. No equivale a certificación completa en dispositivos físicos.
