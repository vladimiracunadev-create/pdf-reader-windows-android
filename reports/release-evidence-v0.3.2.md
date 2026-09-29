# Evidencia de release v0.3.2

Estado: **PUBLICADO; ARTEFACTOS VERIFICADOS; COBERTURA FUNCIONAL CON LÍMITES EXPLÍCITOS** el 2026-09-28. Release: https://github.com/vladimiracunadev-create/pdf-reader-windows-android/releases/tag/v0.3.2. Commit/tag: `0638d05130787651d5c0e062f75233b5d7dc03ff` / `v0.3.2`. No equivale a certificación en teléfono físico.

## Evidencia previa al tag

| Gate | Resultado |
|---|---|
| `CI=true pnpm check` | PASS · 29/29 Node, verificación de repositorio y 20 documentos |
| `CI=true pnpm qa:desktop-e2e` | PASS · 47/47 sobre `release/windows/win-unpacked/PDF Reader.exe` |
| `pnpm qa:android-e2e` | PASS · 14/14 sobre APK debug instalada; selector Android real y objetivos táctiles ≥44×44 |
| Corpus PDF | PASS · 16 variantes con manifiesto SHA-256 |
| Android debug | PASS · build, instalación, selector, render y E2E API 36.1 |
| Android físico | NO EJECUTADO |

## Artefactos locales previos a publicación

Esta tabla conserva el estado histórico anterior al workflow de Release; sus hashes no son los hashes finales publicados. La descarga pendiente de ese momento quedó resuelta en la sección “Descarga exacta del release”.

| Artefacto | Bytes | SHA-256 | Verificación |
|---|---:|---|---|
| `PDF-Reader-Windows-0.3.2-x64-Setup.exe` | 128974422 | `B0F972173A81334E009E6176C5C6C86D93267A6F5B1656EC7750DC961B70A0D9` | Build PASS; contenido `win-unpacked` 47/47 PASS |
| `PDF-Reader-Windows-0.3.2-x64-Portable.exe` | 128750784 | `836510EF8D2979EF3F45B3C67DAF6227E0396864C010F53B77AC1C3EB247ECCA` | Build PASS; en esta fase previa la descarga remota aún no existía |
| `app-debug.apk` | 7839416 | `311FFC5513F715C86A009E7A580B26EC63D0DB62C94C6397C24C6CF41F4A0CD5` | Instalación limpia/selector/E2E 14/14 PASS |

Las capturas reproducibles están en `.qa/android-webview-e2e/`: selector del sistema, secuencia compuesta horizontal y retorno desde background. El directorio se excluye del release porque contiene además el corpus pesado; el informe versionado conserva la trazabilidad.

## Automatización remota

| Ejecución | ID | Resultado |
|---|---:|---|
| CI (Web, Android debug, Windows package) | [36493962171](https://github.com/vladimiracunadev-create/pdf-reader-windows-android/actions/runs/36493962171) | PASS |
| GitHub Pages | [36493962170](https://github.com/vladimiracunadev-create/pdf-reader-windows-android/actions/runs/36493962170) | PASS |
| Release (contrato, Windows, Android firmado y publicación) | [36494437903](https://github.com/vladimiracunadev-create/pdf-reader-windows-android/actions/runs/36494437903) | PASS |
| CI posterior de documentación/evidencia, commit `7ab323e` | [36496505600](https://github.com/vladimiracunadev-create/pdf-reader-windows-android/actions/runs/36496505600) | PASS · Web, Android y Windows |
| CI que integra suites 21+21 y matriz corregida, commit `48306d2` | [36504652217](https://github.com/vladimiracunadev-create/pdf-reader-windows-android/actions/runs/36504652217) | PASS · Web, Android y Windows |
| Pages del commit `48306d2` | [36504652223](https://github.com/vladimiracunadev-create/pdf-reader-windows-android/actions/runs/36504652223) | PASS |

El run de push `36495722863` quedó atascado antes del checkout Android y fue cancelado. El run manual `36496505600` sobre el mismo commit lo sustituyó y terminó PASS en los tres jobs; el cancelado se conserva como incidente histórico, no se presenta como verde.

## Descarga exacta del release

Los cuatro assets se descargaron mediante `gh release download v0.3.2`, no se reutilizaron los binarios locales. Cada hash local coincide con `SHA256SUMS.txt` y con el digest publicado por GitHub.

| Artefacto publicado | Bytes | SHA-256 | Resultado posterior a descarga |
|---|---:|---|---|
| `PDF-Reader-Windows-0.3.2-x64-Portable.exe` | 128540679 | `cbaaeec04a944976ef27a330061fa051cfc2bb2020b69635ef467def5ba67d0e` | PASS · wrapper inicia y responde; contenido exacto extraído 47/47 E2E |
| `PDF-Reader-Windows-0.3.2-x64-Setup.exe` | 128764320 | `845d096a02acf03d100799e8cd3f5b515031218fdeb17d367079780a81b5869c` | PASS · instalación silenciosa aislada, aplicación instalada 47/47 E2E y desinstalación exitosa |
| `PDF-Reader-Android-v0.3.2.apk` | 6232729 | `e30b43fbd81395c4a380e1f5c985a497af73248ed9db01419e32f66fd7e983be` | PASS · firma, paquete, instalación limpia y flujos críticos reales |
| `SHA256SUMS.txt` | 315 | `4a8a60b163160fb7a780f6de842426e3361ef1b35de82f7bd7ead5f966623036` | PASS |

### APK publicado

- `cl.vladimiracunadev.pdfreader`, `versionName=0.3.2`, `versionCode=5`, min SDK 24, target/compile SDK 36.
- Firma verificada: APK Signature Scheme v2/v3, RSA 4096, certificado SHA-256 `8005f1d679b970f43f0c627ff3b668daafa3a4af9c7abbe6afa7cb19b2cb1a12`.
- Solo declara el permiso interno `DYNAMIC_RECEIVER_NOT_EXPORTED_PERMISSION`; no declara Internet ni permisos de almacenamiento.
- Se desinstaló la build debug y se instaló el APK descargado desde cero en Android Emulator API 36.1.
- PASS: inicio limpio, selector Android real, PDF de 12 páginas, área segura (`screenY=63`), controles ≥44×44, secuencia Siguiente → Zoom+ → Zoom+ → Rotar, swipe 2→3, horizontal, background/foreground en página 3 y hoja nativa de compartir.
- Evidencia: `.qa/android-release-clean-home.png`, `.qa/android-release-system-picker.png`, `.qa/android-release-reader-open.png`, `.qa/android-release-composite.png`, `.qa/android-release-after-swipe.png`, `.qa/android-release-landscape.png`, `.qa/android-release-after-background.png` y `.qa/android-release-share-sheet.png`.
- La build release no expone CDP/WebView debugging. Los 14 casos instrumentados se ejecutaron 14/14 sobre la APK debug del mismo commit; en la APK firmada se repitió por UI black-box el conjunto crítico anterior.

## Ampliación posterior a publicación

El código de producto de `src/`, `desktop/` y los adaptadores Android no cambió respecto del tag. Se amplió la automatización y se repitieron las pruebas sobre el mismo producto:

| Superficie | Resultado | Evidencia local |
|---|---|---|
| Web `dist` en Edge/Chromium localhost, 390×844 | PASS · 21/21 | `.qa/web-e2e/results.json`, captura `localhost-mobile-compound.png` |
| APK debug instalada, Android Emulator API 36.1 | PASS · 21/21 | `.qa/android-webview-e2e/results.json`; incluye 16 PDF por DocumentsUI, doble toque, Home/End, About, historial y acciones compuestas |
| Setup descargado e instalado desde cero | PASS · 47/47 | `.qa/releases/v0.3.2/setup-e2e-results.json`; instalación y desinstalación exitosa |

La consola Web solo registró `PasswordException` durante el caso negativo esperado del PDF protegido; no hubo fallos de red. Android no registró excepciones inesperadas en los casos instrumentados.

## Límite explícito

Teléfono físico: **NO EJECUTADO**. No se convierte el emulador API 36.1 en evidencia de hardware físico. El fallback Web que abre un servicio externo para compartir tampoco se ejecutó, porque supone salida de datos fuera del entorno de prueba y requiere autorización específica.
