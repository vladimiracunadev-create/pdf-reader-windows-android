# Seguridad y privacidad

## Modelo
Los PDF son contenido no confiable. Se renderizan con PDF.js dentro de una aplicación con privilegios limitados.

## Desktop
Electron usa `contextIsolation: true`, `nodeIntegration: false` y `sandbox: true`. El renderer no recibe acceso general al sistema de archivos; el preload expone solo abrir/leer rutas PDF.

## Android
La selección usa el selector de archivos del sistema. El APK v0.3.3 no declara acceso amplio al almacenamiento ni `INTERNET`; solo conserva el permiso interno `DYNAMIC_RECEIVER_NOT_EXPORTED_PERMISSION` generado por Android. CI abre los metadatos del APK ya compilado y falla si reaparece un permiso prohibido. `@capacitor/share` delega en la hoja del sistema sin añadir permiso de red a PDF Reader.

## Privacidad
- no hay cuentas;
- no hay telemetría;
- no hay upload automático;
- las preferencias y hasta ocho PDF de hasta 24 MiB del historial quedan localmente en el dispositivo y pueden borrarse desde la app.

## Dependencias
CI debe revisar actualizaciones de PDF.js, Electron y Capacitor antes de cada release. Un cambio mayor requiere ADR o actualización de arquitectura.

Las subidas motivadas por vulnerabilidades publicadas se registran en [Actualizaciones de seguridad por CVE](security-updates.md) con identificadores CVE y GHSA, severidad y exposición real. El registro vigente incluye la subida de Electron de `44.0.0` a `44.10.1` del 2026-11-01, que corrige ocho advisories de la rama 44, y el criterio por el que el proyecto permanece en esa rama en lugar de adoptar Electron 45.

El gate de CI combina dos comprobaciones complementarias. `pnpm audit --prod --audit-level high` cubre el árbol de producción. `pnpm verify:runtime` consulta OSV.dev con la versión exacta de las dependencias que se distribuyen dentro de los artefactos: cubre Electron, que vive en `devDependencies` porque solo se usa para construir y ejecutar, pero cuyo binario viaja dentro del instalador de Windows y por eso no aparecía en la auditoría de producción.

## Firma
La fase v0.3.3 no incluye firma Authenticode de ejecutables Windows. El APK Android release se alinea y firma con la misma clave persistente de v0.1.0, reconstruida desde GitHub Actions Secrets; `apksigner` valida el artefacto antes de publicarlo. La clave nunca entra al repositorio ni a los artifacts intermedios.
