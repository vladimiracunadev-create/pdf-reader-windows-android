# Evidencia de release v0.3.2

Estado: **EN PREPARACIÓN**. Se completará con IDs remotos, hashes y resultados sobre las descargas exactas después de publicar el tag. Ningún pendiente se presenta como ejecutado.

## Evidencia previa al tag

| Gate | Resultado |
|---|---|
| `CI=true pnpm check` | PASS · 29/29 Node, verificación de repositorio y 20 documentos |
| `CI=true pnpm qa:desktop-e2e` | PASS · 47/47 sobre `release/windows/win-unpacked/PDF Reader.exe` |
| `pnpm qa:android-e2e` | PASS · 14/14 sobre APK debug instalada; selector Android real y objetivos táctiles ≥44×44 |
| Corpus PDF | PASS · 16 variantes con manifiesto SHA-256 |
| Android debug | PASS · build, instalación, selector, render y E2E API 36.1 |
| Android físico | NO EJECUTADO |

## Artefactos locales del corte

| Artefacto | Bytes | SHA-256 | Verificación |
|---|---:|---|---|
| `PDF-Reader-Windows-0.3.2-x64-Setup.exe` | 128974422 | `B0F972173A81334E009E6176C5C6C86D93267A6F5B1656EC7750DC961B70A0D9` | Build PASS; contenido `win-unpacked` 47/47 PASS |
| `PDF-Reader-Windows-0.3.2-x64-Portable.exe` | 128750784 | `836510EF8D2979EF3F45B3C67DAF6227E0396864C010F53B77AC1C3EB247ECCA` | Build PASS; descarga remota exacta pendiente |
| `app-debug.apk` | 7839416 | `311FFC5513F715C86A009E7A580B26EC63D0DB62C94C6397C24C6CF41F4A0CD5` | Instalación limpia/selector/E2E 14/14 PASS |

Las capturas reproducibles están en `.qa/android-webview-e2e/`: selector del sistema, secuencia compuesta horizontal y retorno desde background. El directorio se excluye del release porque contiene además el corpus pesado; el informe versionado conserva la trazabilidad.

## Pendiente después de publicar

- Commit y tag exactos; ejecuciones CI/Pages/Release.
- Nombres, tamaños y SHA-256 de los artefactos descargados.
- Firma, paquete, `versionCode=5`, `versionName=0.3.2`, permisos y worker PDF.js del APK publicado.
- E2E contra el portable descargado, sin usar Electron del árbol fuente.
- Instalación limpia del APK descargado y repetición crítica Android.
