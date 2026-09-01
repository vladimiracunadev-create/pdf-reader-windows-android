# ADR 0001 · Núcleo web + shells nativos

**Estado:** Accepted · 2026-08-31

## Contexto
Se requiere el mismo lector en Windows y Android con una interfaz simple y mantenible.

## Decisión
Usar HTML/CSS/JS + PDF.js como núcleo; Electron para Windows y Capacitor para Android.

## Consecuencias
- una sola UX y lógica;
- CI debe validar tres targets;
- Electron aumenta tamaño de distribución en Windows;
- Android depende del WebView del sistema y toolchain Gradle/SDK;
- se evita duplicar un lector nativo distinto por plataforma.
