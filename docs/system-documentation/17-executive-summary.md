# 17. Resumen ejecutivo

## Producto

PDF Reader es una aplicación multiplataforma de lectura local para Android, Windows y navegador. Su propuesta es deliberadamente estrecha: abrir, leer, navegar y buscar sin exponer funciones que modifiquen el original. Está orientada a personas que valoran simplicidad, privacidad y controles móviles claros.

## Capacidades

Renderiza PDF con PDF.js; ofrece navegación, miniaturas, búsqueda, zoom anclado, rotación, tema oscuro y pantalla completa. Guarda localmente hasta ocho lecturas y su progreso. Android puede recibir archivos desde el sistema y compartir un texto de progreso; Windows aporta instalador, portable y asociación `.pdf`. No hay cuentas, backend, anuncios ni telemetría.

## Arquitectura y entrega

Un mismo núcleo HTML/CSS/JavaScript se empaqueta con Capacitor para Android y Electron para Windows. Los adaptadores nativos son pequeños y la persistencia usa almacenamiento local. GitHub Actions valida Web, Android y Windows; Pages publica una demo; los tags producen APK firmado, ejecutables y hashes.

## Estado actual

La versión analizada es `0.3.2`, publicada el 2026-09-28. Aprobaron 29 pruebas Node, 47 E2E Electron, 21 E2E Web localhost y 21 E2E sobre APK Android debug instalada; el corpus contiene 16 variantes PDF. La prueba física Android permanece **NO EJECUTADA** y no se infiere del emulador. La evidencia del tag, de los artefactos descargados y de la instalación del Setup se conserva en `reports/release-evidence-v0.3.2.md`.

## Fortalezas

- alcance claro y verificable de solo lectura;
- ausencia de infraestructura remota y permisos Android amplios;
- núcleo compartido que reduce duplicación;
- builds reproducibles con pnpm/lockfile;
- APK release firmado y auditado;
- tratamiento degradado de fallos de persistencia;
- experiencia Android-first con continuidad y gestos.

## Riesgos principales

Los PDF se cargan completos en memoria y las aperturas Android por intent usan Base64. El historial conserva documentos potencialmente sensibles sin cifrado propio. Faltan pruebas E2E y de dispositivos, una CSP visible, diálogo de contraseña y firma Authenticode. PDF.js, Electron y WebView deben mantenerse actualizados por tratar contenido no confiable.

## Oportunidades y próximos pasos

1. medir memoria y establecer límites por plataforma;
2. probar/decidir la política de backup Android del historial;
3. incorporar E2E Web/Electron y pruebas instrumentadas reales;
4. reciclar miniaturas ya lejanas y medir memoria en documentos gigantes;
5. añadir contraseñas PDF y mejorar accesibilidad;
6. evaluar Authenticode y canales de tienda sin romper la promesa de privacidad.

El proyecto es adecuado como lector local pequeño y auditable. Su siguiente etapa debería priorizar robustez y pruebas, no ampliar prematuramente el alcance hacia edición o servicios remotos.
