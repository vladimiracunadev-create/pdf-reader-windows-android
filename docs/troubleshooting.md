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
La v0.1.0 no incluye diálogo de contraseña. Usa otro lector o una copia permitida sin protección.

## PDF grande consume mucha memoria
El MVP abre el documento en memoria. Cierra otras aplicaciones o usa un PDF de menor tamaño; streaming queda planificado para una versión posterior.
