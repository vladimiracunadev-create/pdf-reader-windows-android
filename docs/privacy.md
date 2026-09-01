# Privacidad

## Resumen

PDF Reader funciona localmente. No incorpora cuentas, publicidad, analítica, telemetría, backend propio ni sincronización en nube.

## Datos que procesa

- contenido y metadatos básicos del PDF elegido por la persona;
- tema visual;
- página, zoom, modo de ajuste y rotación asociados a una huella local del documento;
- hasta ocho copias recientes del PDF dentro de IndexedDB/WebView, junto con nombre, tamaño, fecha de apertura y progreso, para poder reabrirlas.

El documento se mantiene en memoria para renderizarse y, por defecto, se copia al historial privado local para poder recuperarlo. La aplicación no modifica el original ni transmite el PDF. La persona puede eliminar una lectura o borrar todo el historial desde la app.

## Android

El APK `v0.2.0` no declara permisos del sistema. El archivo entra mediante el selector de documentos de Android, que concede acceso únicamente al elemento elegido durante el flujo de apertura. La copia de historial vive dentro del almacenamiento privado del WebView.

La acción **Compartir** abre la hoja del sistema y propone un texto con nombre, página y enlace público del proyecto. No adjunta el PDF. Solo después de una acción explícita de la persona, Android entrega ese texto a WhatsApp u otra app elegida.

## Web

La demo de GitHub Pages ejecuta el mismo lector dentro del navegador. GitHub puede registrar solicitudes HTTP normales del sitio estático conforme a sus propias políticas; el código de PDF Reader no envía el contenido del PDF ni integra scripts de analítica.

## Windows

Electron limita el renderer mediante sandbox, aislamiento de contexto y ausencia de Node. El proceso principal solo expone operaciones de selección y lectura de archivos `.pdf`.

## Eliminación local

El historial puede borrarse dentro de PDF Reader. Las preferencias restantes se eliminan borrando los datos de la aplicación o del sitio. Desinstalar la app Android elimina su almacenamiento local. Los PDF originales no pertenecen al almacenamiento de PDF Reader y nunca se borran desde la app.

## Incidentes

No adjuntes documentos confidenciales a un Issue. Reporta vulnerabilidades mediante GitHub Security Advisories según [`SECURITY.md`](../SECURITY.md).
