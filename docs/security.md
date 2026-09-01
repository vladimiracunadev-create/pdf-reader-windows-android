# Seguridad y privacidad

## Modelo
Los PDF son contenido no confiable. Se renderizan con PDF.js dentro de una aplicación con privilegios limitados.

## Desktop
Electron usa `contextIsolation: true`, `nodeIntegration: false` y `sandbox: true`. El renderer no recibe acceso general al sistema de archivos; el preload expone solo abrir/leer rutas PDF.

## Android
La selección usa el selector de archivos del sistema. El APK v0.2.0 no declara permisos: ni acceso amplio al almacenamiento ni `INTERNET`. CI abre los metadatos del APK ya compilado y falla si reaparece un permiso prohibido. `@capacitor/share` delega en la hoja del sistema sin añadir permiso de red a PDF Reader.

## Privacidad
- no hay cuentas;
- no hay telemetría;
- no hay upload automático;
- las preferencias y hasta ocho PDF del historial quedan localmente en el dispositivo y pueden borrarse desde la app.

## Dependencias
CI debe revisar actualizaciones de PDF.js, Electron y Capacitor antes de cada release. Un cambio mayor requiere ADR o actualización de arquitectura.

## Firma
La fase v0.2.0 no incluye firma Authenticode de ejecutables Windows. El APK Android release se alinea y firma con la misma clave persistente de v0.1.0, reconstruida desde GitHub Actions Secrets; `apksigner` valida el artefacto antes de publicarlo. La clave nunca entra al repositorio ni a los artifacts intermedios.
