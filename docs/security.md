# Seguridad y privacidad

## Modelo
Los PDF son contenido no confiable. Se renderizan con PDF.js dentro de una aplicación con privilegios limitados.

## Desktop
Electron usa `contextIsolation: true`, `nodeIntegration: false` y `sandbox: true`. El renderer no recibe acceso general al sistema de archivos; el preload expone solo abrir/leer rutas PDF.

## Android
La selección usa el selector de archivos del sistema. El APK v0.1.0 no declara permisos: ni acceso amplio al almacenamiento ni `INTERNET`. CI abre los metadatos del APK ya compilado y falla si reaparece un permiso prohibido.

## Privacidad
- no hay cuentas;
- no hay telemetría;
- no hay upload automático;
- las preferencias quedan localmente en el dispositivo.

## Dependencias
CI debe revisar actualizaciones de PDF.js, Electron y Capacitor antes de cada release. Un cambio mayor requiere ADR o actualización de arquitectura.

## Firma
La fase v0.1.0 no incluye firma Authenticode de ejecutables Windows. El APK Android release se alinea y firma con una clave persistente reconstruida desde GitHub Actions Secrets; `apksigner` valida el artefacto antes de publicarlo. La clave nunca entra al repositorio ni a los artifacts intermedios.
