# Product Spec · PDF Reader

## Problema
Leer PDF en celular o escritorio suele exponer interfaces cargadas, herramientas de edición o gestos poco evidentes. El producto debe reducir el flujo a abrir → leer → navegar → buscar.

## Usuarios
- Usuario novato que necesita leer documentos sin modificar accidentalmente el original.
- Usuario Windows que quiere una app instalable y asociación `.pdf`.
- Usuario Android que necesita controles táctiles grandes.

## Requisitos funcionales v0.1.0
1. Abrir PDF local.
2. Renderizar al menos una página con PDF.js.
3. Anterior/siguiente y salto directo.
4. Zoom ±, 100%, ajuste ancho/página.
5. Rotación 90°.
6. Miniaturas.
7. Búsqueda de texto y navegación al resultado.
8. Modo oscuro.
9. Pantalla completa.
10. Estado visible "Solo lectura".
11. Persistir página/zoom/rotación localmente.
12. Windows: drag & drop, atajos y asociación PDF.
13. Android: selector del sistema y swipe de página.

## No objetivos
- Editar contenido PDF.
- Firmar, anotar, reorganizar, combinar o borrar páginas.
- Sincronizar documentos a una nube.
- Crear cuentas.
- Telemetría por defecto.

## Definition of Done
- Tests Node verdes.
- Verificación estructural verde.
- Build web verde.
- Package Windows en CI.
- APK Android debug inspeccionado en CI.
- APK Android release firmado, con versión, permisos y contenido verificados al publicar.
- README, arquitectura, usuario, seguridad, runbook y release documentados.
- GitHub Pages desplegable desde `main`.
- Release por tag exacto `v0.1.0`, con binarios y checksums reproducibles.
