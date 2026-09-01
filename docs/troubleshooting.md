# Troubleshooting

## `Falta node_modules/pdfjs-dist/...`
Ejecuta `pnpm install --frozen-lockfile` antes del build.

## Android no existe
Ejecuta `pnpm android:init`. Capacitor generará el proyecto nativo.

## Android SDK no encontrado
Instala Android SDK 36 y define `ANDROID_HOME`/`ANDROID_SDK_ROOT` según tu entorno.

## Windows muestra advertencia al instalar
El MVP no está firmado digitalmente. GitHub Release es el canal de distribución previsto para esta fase.

## PDF protegido por contraseña
La v0.2.0 no incluye diálogo de contraseña. Usa otro lector o una copia permitida sin protección.

## PDF grande consume mucha memoria
El MVP abre el documento en memoria. Cierra otras aplicaciones o usa un PDF de menor tamaño; streaming queda planificado para una versión posterior.

## El PDF no aparece en Historial
El lector sigue funcionando aunque el dispositivo no tenga cuota local suficiente para guardar una copia. Elimina lecturas antiguas desde **Historial**, libera almacenamiento o abre un PDF más pequeño.

## WhatsApp no aparece al compartir
Android muestra las aplicaciones compatibles instaladas. Instala/activa WhatsApp o elige otra app desde la hoja del sistema. En navegador sin Web Share se abre WhatsApp Web.
