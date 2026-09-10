# 14. Solución de problemas

| Síntoma | Causa probable | Diagnóstico | Solución / riesgo |
|---|---|---|---|
| Falta `pdf.mjs`/worker | dependencias no instaladas | revisar `node_modules/pdfjs-dist/legacy/build` | `pnpm install --frozen-lockfile`; no cambiar lockfile |
| pnpm pide borrar modules sin TTY | runtime/store distinto | mensaje `ERR_PNPM_ABORTED_REMOVE_MODULES_DIR_NO_TTY` | en CI usar `CI=true`; regenerar solo `node_modules` |
| Puerto 4173 ocupado | otro servidor | revisar salida de `start:web` | definir otro `PORT` |
| Página en blanco | `dist` viejo/incompleto | consola y presencia de vendor | `pnpm build:web` |
| PDF no abre | archivo corrupto, cifrado o no PDF | probar smoke PDF, revisar mensaje | usar PDF válido; contraseñas no soportadas |
| Búsqueda sin resultados | escaneo sin capa de texto | seleccionar texto en otro visor | OCR está fuera del producto |
| Zoom salta/recorta | regresión en ancla/layout | `pnpm check`, pantalla 320 px | revisar `captureReadingAnchor` y marcadores CSS |
| Historial no guarda | cuota IndexedDB/entorno privado | consola y almacenamiento del origen | liberar/borrar historial; lectura sigue disponible |
| Historial abre elemento equivocado | colisión de metadatos | comparar nombre/tamaño/mtime | reabrir original; considerar hash futuro |
| Android no existe | proyecto no generado | comprobar `android/` | `pnpm android:init`; revisar diff generado |
| SDK/JDK no encontrado | toolchain incompleto | `java -version`, SDK Manager | JDK 21, Platform 36, Build Tools 36 |
| `android:sync` deja diff | fuentes/versiones desincronizadas | `git diff -- android` | revisar y versionar cambios intencionales |
| Android no aparece como lector | intent/preferencia del OS | revisar manifiesto y Ajustes | abrir Configurar ahora; Android decide |
| Intent Android falla >128 MiB | límite del plugin | tamaño del PDF/logcat | abrir desde flujo normal u optimizar archivo; no elevar sin medir RAM |
| Compartir no muestra WhatsApp | app/API no disponible | probar hoja del sistema | instalar/activar app; Web usa fallback |
| Build Windows falla | dist/dependencias/toolchain | salida electron-builder | `pnpm install`, `pnpm build:web`, reintentar |
| SmartScreen alerta | EXE sin Authenticode | comprobar hash/release | verificar SHA-256; no desactivar protecciones globales |
| Release Android falla al firmar | secrets ausentes/incorrectos | logs sin imprimir valores | corregir Secrets; nunca registrar credenciales |
| Tag no coincide | versión/notas distintas | job `Version · tag contract` | crear nueva versión coherente; no reescribir tag público |
| Pages despliega solo landing/app | `pages-dist` incompleto | revisar artifact | `pnpm build:pages` y workflow |

## Diagnóstico seguro

Usar siempre PDF sintéticos o no sensibles. No adjuntar documentos privados a Issues ni copiar secrets en logs. Comandos base:

```bash
pnpm check
pnpm build:pages
git diff --check
git status --short
```

Para Android, inspeccionar el APK con `apksigner verify` y `aapt2 dump badging`. Para releases, validar `sha256sum -c SHA256SUMS.txt`. Una solución que cambie application ID, firma, permisos o formato de persistencia requiere revisión humana y documentación de migración.
