# 16. Glosario

| Término | Definición en este sistema |
|---|---|
| APK | Paquete instalable de Android publicado por el proyecto |
| AAB | Formato para Play Store; no se genera en `0.3.0` |
| AndroidX | Bibliotecas Android usadas por Capacitor y pruebas |
| Ancla de lectura | Punto del PDF que se intenta mantener visible al cambiar zoom/rotación |
| API | Contrato entre componentes; aquí son Web APIs, IPC y plugin, no un servidor |
| Authenticode | Firma digital de ejecutables Windows; pendiente |
| Blob | Objeto binario usado para conservar una copia PDF en IndexedDB |
| CMap | Datos que ayudan a PDF.js a mapear caracteres de ciertas fuentes |
| Capacitor | Shell que empaqueta el núcleo Web como app Android |
| Canvas | Superficie HTML donde PDF.js dibuja una página |
| Check | Resultado de un job obligatorio en GitHub |
| CI/CD | Automatización de pruebas, builds, Pages y releases |
| Content URI | Referencia Android a un archivo autorizado por el sistema |
| DPR | Densidad de píxeles; el render se limita a 2 |
| Electron | Shell Chromium/Node usado para Windows |
| Fit page | Escala para mostrar la página completa |
| Fit width | Escala para ajustar al ancho disponible |
| Historial | Hasta ocho copias locales con progreso; no es historial remoto |
| IndexedDB | Almacén local del navegador/WebView para objetos y Blob |
| Intent | Mensaje Android que permite abrir un PDF con la app |
| IPC | Comunicación entre renderer y proceso principal Electron |
| Keystore | Archivo secreto que contiene la clave de firma Android |
| localStorage | Almacén clave/valor para tema y estado ligero |
| PDF.js | Motor Mozilla que analiza, renderiza y extrae texto PDF |
| Renderer | Contexto de interfaz Electron; está aislado de Node |
| SHA-256 | Huella publicada para comprobar integridad de binarios |
| Solo lectura | Promesa funcional: la app no altera el PDF original |
| Telemetría | Envío de datos de uso; el producto no la incorpora |
| WebView | Componente Android donde se ejecuta el núcleo Web |
| Worker | Proceso Web separado usado por PDF.js para procesamiento |

## Estados de interfaz

- **Lector:** vista principal del documento o bienvenida/error.
- **Historial:** lista local de lecturas recientes.
- **About:** versión, autor, licencia y enlaces.
- **Ajuste `width`/`page`/`manual`:** estrategia de escala.
- **Documento activo:** existe `state.doc`; habilita controles.

## Roles

- **Persona lectora:** abre y consulta documentos.
- **Mantenedor:** revisa cambios, custodia firma y publica.
- **CODEOWNER:** `@vladimiracunadev-create`, responsable de revisión en GitHub.
