# Documentación integral de PDF Reader

**Sistema:** PDF Reader
**Versión analizada:** `0.3.1` (`e22b7307a7f49c2644415b2c2a447d85054854e6`)
**Fecha de la revisión:** 2026-09-24
**Estado:** validado contra código, configuración, pruebas, builds locales y release remoto

Esta carpeta explica el producto desde tres perspectivas: visión general para personas no técnicas, referencia para desarrollo y operación, y trazabilidad profunda desde una función de usuario hasta el código y sus pruebas. La fuente primaria es el repositorio; cuando una afirmación procede de una inferencia se identifica expresamente.

## Audiencia

- personas usuarias, responsables de producto y auditoría;
- desarrolladores que se incorporan al proyecto;
- mantenedores de Web, Windows, Android y CI/CD;
- agentes de IA que necesiten contexto verificable.

## Índice y estado

| Documento | Propósito | Estado |
|---|---|---|
| [01 - Descripción general](01-system-overview.md) | Producto, usuarios y límites | Validado |
| [02 - Instalación y ejecución](02-installation-and-execution.md) | Preparación y comandos | Validado localmente |
| [03 - Arquitectura](03-architecture.md) | Capas, componentes y despliegue | Validado |
| [04 - Mapa del código](04-code-map.md) | Inventario y responsabilidades | Validado |
| [05 - Referencia técnica](05-technical-reference.md) | Símbolos, estados y configuración | Validado |
| [06 - Explicación profunda](06-deep-code-explanation.md) | Flujos internos y casos límite | Validado |
| [07 - Persistencia](07-database.md) | IndexedDB y `localStorage` | Validado |
| [08 - Flujo de datos](08-data-flow.md) | Origen, transformación y destino | Validado |
| [09 - APIs e integraciones](09-apis-and-integrations.md) | Puentes nativos y servicios | Validado |
| [10 - Configuración](10-configuration.md) | Archivos, valores y entornos | Validado |
| [11 - Seguridad](11-security.md) | Controles y superficie de ataque | Validado |
| [12 - Pruebas y calidad](12-testing-and-quality.md) | Gates y cobertura observable | Validado localmente |
| [13 - Despliegue y operación](13-deployment-and-operations.md) | Builds, Pages y releases | Validado |
| [14 - Solución de problemas](14-troubleshooting.md) | Diagnóstico operativo | Validado |
| [15 - Riesgos y deuda técnica](15-risks-and-technical-debt.md) | Registro priorizado | Evaluado |
| [16 - Glosario](16-glossary.md) | Términos técnicos y de dominio | Validado |
| [17 - Resumen ejecutivo](17-executive-summary.md) | Lectura para decisiones | Validado |
| [18 - Guía para nuevos desarrolladores](18-new-developer-guide.md) | Itinerario de incorporación | Validado |
| [19 - Matriz de trazabilidad](19-traceability-matrix.md) | Requisito a prueba | Validado |
| [PDF](pdf/) | Versiones publicables de estos documentos | Generación reproducible |

## Convenciones

- **Comprobado:** existe evidencia directa en archivos o ejecuciones.
- **Inferencia basada en el código:** conclusión razonable que no tiene contrato explícito.
- **No identificado:** el repositorio no contiene evidencia suficiente.
- Las rutas se expresan desde la raíz del repositorio.
- Los documentos históricos de `docs/releases/` y `CHANGELOG.md` se conservan como historia; esta carpeta describe el estado actual.

## Evidencia de esta revisión

Se revisaron el núcleo JavaScript del lector, HTML/CSS, adaptadores Electron y Android, persistencia, scripts, Gradle, manifiesto Android y los workflows de CI/Pages/release. En `v0.3.1` aprobaron 24 pruebas Node, el verificador del repositorio, el build de Pages, el APK debug local y los tres jobs de CI. El workflow remoto del tag publicó APK firmado, instalador, portable y checksums; la auditoría exacta se conserva en [`reports/release-evidence-v0.3.1.md`](../../reports/release-evidence-v0.3.1.md).

## Pendientes que requieren validación externa

- comportamiento en una matriz real de dispositivos Android/WebView y equipos Windows;
- consumo máximo aceptable de memoria y cuota IndexedDB para PDF grandes;
- restauración de la clave de firma Android y rollback operativo, sin exponer secretos;
- firma Authenticode de Windows y eventual distribución en tiendas;
- accesibilidad con lectores de pantalla y pruebas E2E de los puentes nativos.
