# Privacidad

## Resumen

PDF Reader funciona localmente. No incorpora cuentas, publicidad, analítica, telemetría, backend propio ni sincronización en nube.

## Datos que procesa

- contenido y metadatos básicos del PDF elegido por la persona;
- tema visual;
- página, zoom, modo de ajuste y rotación asociados a una huella local del documento;
- en Windows, hasta cinco rutas recientes para permitir reabrir archivos del mismo equipo.

El documento se mantiene en memoria para renderizarse. La aplicación no crea una copia, no modifica el original y no lo transmite.

## Android

El APK `v0.1.0` no declara permisos del sistema. El archivo entra mediante el selector de documentos de Android, que concede acceso únicamente al elemento elegido durante el flujo de apertura.

## Web

La demo de GitHub Pages ejecuta el mismo lector dentro del navegador. GitHub puede registrar solicitudes HTTP normales del sitio estático conforme a sus propias políticas; el código de PDF Reader no envía el contenido del PDF ni integra scripts de analítica.

## Windows

Electron limita el renderer mediante sandbox, aislamiento de contexto y ausencia de Node. El proceso principal solo expone operaciones de selección y lectura de archivos `.pdf`.

## Eliminación local

Las preferencias se eliminan borrando los datos de la aplicación o del sitio. Desinstalar la app Android elimina su almacenamiento local. Los PDF originales no pertenecen al almacenamiento de PDF Reader.

## Incidentes

No adjuntes documentos confidenciales a un Issue. Reporta vulnerabilidades mediante GitHub Security Advisories según [`SECURITY.md`](../SECURITY.md).
