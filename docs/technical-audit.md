# Technical Audit · v0.1.0

## Superficie
El renderer carece de acceso Node directo. Electron opera con aislamiento de contexto y sandbox. La lectura desktop se expone mediante IPC limitado a archivos `.pdf`.

## Datos
El PDF se mantiene en memoria para render. No existe endpoint remoto, backend, base de datos ni telemetría. `localStorage` conserva preferencias y, solo en Windows, rutas recientes.

## Dependencias fijadas
- PDF.js `6.3.289`
- Electron `44.0.0`
- Capacitor `8.5.0`
- electron-builder `26.15.3`

## Riesgos conocidos
- consumo de memoria con PDF de gran tamaño;
- binarios Windows sin firma en v0.1.0;
- ausencia de pruebas instrumentadas sobre un dispositivo físico en el gate local;
- PDFs cifrados con contraseña sin diálogo dedicado en el MVP.

## Recomendación siguiente
Después de validar el workflow real en GitHub y el APK firmado, congelar el primer release y abrir v0.2 solo con mejoras de lectura/accesibilidad.
