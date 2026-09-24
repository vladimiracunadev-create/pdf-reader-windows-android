# Validación funcional de lectura · 2026-09-24

## Objetivo y alcance

Se investigó el reporte de que el lector “salta páginas” y se recorrieron las acciones principales de lectura con documentos sintéticos de 1, 12 y 1.000 páginas. La validación se centró en comportamiento funcional, no en apariencia.

Superficie ejecutada: build Web local en Chromium mediante la aplicación. Se usó viewport normal y viewport móvil de 390 × 844. No hubo un teléfono Android conectado, por lo que pinza, swipe físico, intents, rotación del sistema y hoja nativa de compartir quedan explícitamente **no ejecutados en hardware**.

## Comparación funcional

Las referencias oficiales consultadas el 2026-09-24 muestran el mínimo esperable de un lector consolidado:

- Microsoft Edge documenta zoom, rotación, ajuste a página/ancho, salto a página y búsqueda: <https://learn.microsoft.com/es-es/deployedge/microsoft-edge-pdf>.
- Adobe Acrobat documenta anterior/siguiente, primera/última y salto a una página específica: <https://helpx.adobe.com/acrobat/desktop/get-started/learn-the-basics/navigation.html>.
- Adobe Acrobat móvil separa el modo de página única —swipe horizontal— del desplazamiento continuo: <https://helpx.adobe.com/uk/acrobat/mobile/view-manage-files/viewing-modes.html>.
- Adobe documenta atajos distintos para pantalla, página, desplazamiento y zoom: <https://helpx.adobe.com/acrobat/desktop/get-started/preferences-and-settings/keyboard-shortcuts.html>.

El criterio aplicado fue que una acción produzca un estado único, visible y predecible; que desplazarse dentro de una página ampliada no cuente como cambio de página; y que el coste inicial no crezca por construir miniaturas que la persona todavía no pidió.

## Defectos reproducidos y correcciones

| Hallazgo | Evidencia previa | Corrección | Regresión |
|---|---|---|---|
| El swipe podía llegar al borde y avanzar en el mismo gesto | La decisión usaba `viewer.scrollLeft` al terminar el toque | Se captura el desplazamiento al comenzar; solo cambia de página si el gesto **comenzó** en el borde | `swipe que recién alcanza el borde no salta página en el mismo gesto` |
| Salto directo desincronizado con navegación posterior | En prueba interactiva, el campo mostraba 7 y la flecha derecha terminó en 3 | Enter confirma `goPage`, espera render y devuelve foco al visor | Contrato `el salto directo confirma la página con Enter` + repetición interactiva 7 → 8 |
| Apertura costosa de PDF gigante | Se creaba un botón por cada página y hasta 120 renders aunque el panel estuviera cerrado | Miniaturas bajo demanda, ventanas navegables de 60 y cancelación al cambiar de panel/documento | `miniaturas de documentos gigantes se acotan sin perder navegación` |
| Paneles antiguos al reemplazar documento | Un panel abierto podía quedar vacío o desfasado | La nueva apertura cierra búsqueda/miniaturas e invalida trabajos anteriores | Repetición interactiva al cambiar de archivo |
| Búsqueda larga sin salida explícita | Cerrar el panel no detenía el recorrido | Cerrar búsqueda incrementa su secuencia y muestra `Búsqueda cancelada.` | Prueba interactiva: cancelada en página 14 de 1.000 |

## Matriz de ejecución real

| Documento/flujo | Acción | Resultado observado |
|---|---|---|
| 1 página, 701 B | Abrir | Página `1 / 1`, render visible |
| 1 página | Límites | Anterior y Siguiente deshabilitados |
| 1 página | Zoom, giro, página completa | 61 %, 90° y `Página completa · 90°` |
| 1 página | Miniaturas | Exactamente 1 miniatura |
| 12 páginas, 4.939 B | Siguiente | 1 → 2, una página por acción |
| 12 páginas | Salto directo + Enter + teclado | 12 → 7 → 8; Home → 1; End → 12 |
| 12 páginas | Límite final | Siguiente deshabilitado en página 12 |
| 12 páginas | Buscar `token-7` | 1 resultado; abrirlo llevó a página 7 |
| 12 páginas | Historial y reapertura | Reabrió en la última página guardada |
| 1.000 páginas, 398.921 B | Abrir | `1 / 1000` sin construir miniaturas en segundo plano |
| 1.000 páginas | Salto y avance | 1 → 500 → 501 |
| 1.000 páginas | Miniaturas | `Páginas 471–530 de 1000`, 60 botones; lote siguiente `531–590`, 60 botones |
| 1.000 páginas | Cerrar miniaturas durante carga | Se detuvo en 16; un segundo después seguía en 16 y el panel estaba cerrado |
| 1.000 páginas | Cancelar búsqueda | Progreso visible en página 14; cierre inmediato y estado `Búsqueda cancelada.` |
| PDF inválido | Abrir sobre documento vigente | Mensaje recuperable; el PDF de 1.000 páginas siguió abierto en 501 |
| Viewport 390 × 844 | Controles móviles | Siguiente 7 → 8, Anterior 8 → 7, zoom 59 % → 68 % |

## Pruebas automatizadas y builds

```text
CI=true pnpm test
24 pruebas, 24 aprobadas, 0 fallos

pnpm build:web
Web build listo en dist/

ANDROID_HOME=<SDK local> JAVA_HOME=<Android Studio JBR 21> pnpm android:debug
BUILD SUCCESSFUL · 123 tareas · APK debug generado
```

El generador se ejecutó realmente para producir `one-page.pdf`, `twelve-pages.pdf` y `thousand-pages.pdf`. Estas salidas son temporales e ignoradas por Git; el generador versionado permite repetirlas con cualquier conteo entre 1 y 2.000.

El APK debug final pesó 7.829.893 bytes y su SHA-256 fue `7B11343BC0EDE6104C4274D1E95DDD99C9297511DE72AA5D0E69FC6C0039A2CB`. `aapt2` confirmó paquete `cl.vladimiracunadev.pdfreader`, `versionCode 3`, `versionName 0.3.0`, `minSdk 24`, `targetSdk 36` y solo el permiso interno `DYNAMIC_RECEIVER_NOT_EXPORTED_PERMISSION`; no aparecieron permisos de Internet ni almacenamiento general.

## Cobertura funcional resultante

- **Ejecutado interactivamente:** apertura, reemplazo, límites, anterior/siguiente, salto directo, Home/End/flechas, zoom, ajuste, rotación, miniaturas, búsqueda, cancelación, historial, reapertura, error recuperable y controles móviles responsivos.
- **Ejecutado automáticamente:** cálculo de swipe normal/ampliado, llegada al borde sin salto, ventanas de miniaturas, almacenamiento defensivo, concurrencia de aperturas, ciclo de vida y contratos de integración.
- **Build ejecutado:** Web, Pages y APK Android debug; el APK se inspeccionó con `aapt2`.
- **Pendiente de hardware:** swipe y pinza reales, intent Android, cambio de orientación, background/restore del WebView, compartir nativo y medición de memoria con PDF grande por bytes.

## Veredicto

Los fallos reproducidos de navegación inconsistente quedaron corregidos y repetidos con evidencia. La superficie Web y el layout móvil pasaron los recorridos definidos para 1, 12 y 1.000 páginas. Esto no equivale a certificar el APK en un teléfono físico: esa validación permanece como gate separado y debe ejecutarse antes de afirmar que los gestos nativos están cerrados en todos los dispositivos.
