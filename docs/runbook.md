# Runbook

## Validación local
```bash
npm install
npm run check
npm run build:web
```

## Probar web
```bash
npm run start:web
```

## Probar Windows
```bash
npm run start:desktop
```

## Build Windows
```bash
npm run build:windows
```
Salida: `release/windows/`.

## Build Android debug
```bash
npm run android:init
npm run android:sync
cd android
./gradlew assembleDebug
```

## Incidente de lectura
1. reproducir con un PDF no sensible;
2. revisar consola de la app;
3. confirmar versión de PDF.js;
4. validar si el archivo está corrupto o protegido;
5. registrar Issue con pasos, plataforma y tamaño aproximado, sin adjuntar documentos privados.
