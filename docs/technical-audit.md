# Technical Audit · v0.2.0

## Superficie
El renderer carece de acceso Node directo. Electron opera con aislamiento de contexto y sandbox. La lectura desktop se expone mediante IPC limitado a archivos `.pdf`.

## Datos
El PDF se mantiene en memoria para render y puede persistirse en IndexedDB como parte de un historial local de ocho entradas. No existe endpoint remoto, backend ni telemetría. La interfaz permite eliminar cada copia o todo el historial.

## Dependencias fijadas
- PDF.js `6.3.289`
- Electron `44.0.0`
- Capacitor `8.5.0`
- Capacitor Share `8.0.1`
- electron-builder `26.15.3`

## Riesgos conocidos
- consumo de memoria con PDF de gran tamaño;
- cuota local variable para PDF grandes guardados en el historial;
- binarios Windows sin firma en v0.2.0;
- ausencia de pruebas instrumentadas sobre un dispositivo físico en el gate local;
- PDFs cifrados con contraseña sin diálogo dedicado en el MVP.

## Recomendación siguiente
Mantener pruebas físicas de pinza, historial, rotación de pantalla y hoja de compartir en varios WebView; avanzar a miniaturas virtualizadas y diálogo de contraseña sin ampliar el alcance de edición.
