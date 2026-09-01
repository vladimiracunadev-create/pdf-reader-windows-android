# Runbook

## Validación local
```bash
pnpm install --frozen-lockfile
pnpm check
pnpm build:web
```

## Probar web
```bash
pnpm start:web
```

## Probar Windows
```bash
pnpm start:desktop
```

## Build Windows
```bash
pnpm build:windows
```
Salida: `release/windows/`.

## Build Android debug
```bash
pnpm android:init
pnpm android:sync
cd android
./gradlew assembleDebug
```

## Incidente de lectura
1. reproducir con un PDF no sensible;
2. revisar consola de la app;
3. confirmar versión de PDF.js;
4. validar si el archivo está corrupto o protegido;
5. registrar Issue con pasos, plataforma y tamaño aproximado, sin adjuntar documentos privados.
