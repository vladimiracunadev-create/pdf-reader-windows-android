# Actualizaciones de seguridad por CVE

Registro de los cambios de versión de dependencias motivados por vulnerabilidades publicadas. Cada entrada indica la dependencia, el salto de versión, los identificadores CVE/GHSA y la exposición real de PDF Reader.

La fuente consultada es [OSV.dev](https://osv.dev/), que agrega GHSA, CVE y los avisos del propio proyecto Electron.

## 2026-11-01 · Electron 44.0.0 → 44.10.1

Motivo: la versión fijada en el repositorio, `electron@44.0.0`, acumulaba ocho advisories publicados contra la rama 44, uno de severidad alta. La subida a `44.10.1` los deja todos corregidos.

| CVE | GHSA | Severidad | Corregido en | Descripción |
|---|---|---|---|---|
| CVE-2026-115570 | GHSA-jr5w-w6x2-84p9 | Alta | 44.9.1 | Mitigación de certificados intermedios de eMudhra comprometidos |
| CVE-2026-113796 | GHSA-2p8c-gr87-2676 | Media | 44.3.0 | Las restricciones de cookies SameSite no se aplican a ventanas abiertas desde enlaces |
| CVE-2026-114121 | GHSA-997q-gvvc-jwmx | Media | 44.3.0 | Las solicitudes de permiso de `openExternal` se atribuyen al origen incorrecto |
| CVE-2026-113800 | GHSA-fw47-9c62-h3vw | Media | 44.3.0 | Las comprobaciones de permiso HID y USB se atribuyen al origen incorrecto |
| CVE-2026-113798 | GHSA-x562-297c-g43g | Media | 44.5.0 | Las solicitudes de bloqueo de puntero se atribuyen al frame incorrecto |
| CVE-2026-114122 | GHSA-3qxv-5xgr-q7w9 | Baja | 44.4.3 | La suscripción a frames confía en la geometría entregada por la GPU |
| CVE-2026-114124 | GHSA-h3v5-h239-pg29 | Baja | 44.4.3 | El renderizado fuera de pantalla en macOS confía en la geometría de la GPU |
| CVE-2026-113797 | GHSA-98mx-cjp9-gchm | Baja | 44.1.1 | `tabs.query` de extensiones devuelve URL y títulos sin el permiso `tabs` |

### Exposición real en PDF Reader

La actualización se aplica por principio de mantener el runtime sin advisories conocidos, no porque estos vectores fueran alcanzables en esta aplicación. El alcance declarado del producto reduce o anula la exposición:

- la aplicación no realiza peticiones de red ni carga contenido remoto, de modo que los vectores de cookies y de confianza en certificados no tienen superficie;
- no se cargan extensiones de navegador, por lo que `tabs.query` no aplica;
- no se usan HID, USB, bloqueo de puntero ni renderizado fuera de pantalla;
- no se publica build de macOS: el empaquetado es Windows y Android;
- el renderer se ejecuta con `contextIsolation: true`, `nodeIntegration: false` y `sandbox: true`, con CSP acotada.

### Verificación

`electron@44.10.1` no registra advisories en OSV.dev. El único hallazgo bajo esa rama del árbol es `undici` a través de `@electron/get`, que interviene en la descarga durante el build y no se distribuye dentro de la aplicación.

### Por qué se permanece en la rama 44 y no se pasa a Electron 45

Electron mantiene las tres majors estables más recientes. Con 45 como última, las ramas soportadas son 45, 44 y 43. El 2026-10-31 se publicaron `43.8.6`, `44.10.1` y `45.2.1` el mismo día, lo que corresponde a una release de seguridad coordinada: la rama 44 recibe parches al mismo ritmo que la última.

Dado que `44.10.1` y `45.2.1` están igual de limpios en OSV.dev, pasar a 45 no aporta ventaja de seguridad, mientras que adoptar una major publicada el 2026-10-21 introduce un cambio de Chromium y de Node en el runtime que se distribuye a las personas usuarias. La rama 44 se revisará cuando Electron 47 entre en desarrollo, momento en que 44 saldría de la ventana de soporte.

Para que esta decisión no se reabra cada semana, `.github/dependabot.yml` ignora las actualizaciones *major* de `electron`. Las *minor* y *patch* siguen llegando automáticamente, que es justamente por donde entran las correcciones de seguridad de la rama. Al retirar la regla, Dependabot volverá a proponer la major siguiente.

## Dependencias sin cambios por CVE

Estas subidas se registran como mantenimiento porque OSV.dev no reporta advisories para las versiones involucradas:

| Dependencia | Cambio | Fecha |
|---|---|---|
| `@capacitor/core`, `@capacitor/android`, `@capacitor/cli` | 8.5.0 → 8.5.2 → 8.6.0 | 2026-11-01 |
| `@capacitor/share` | 8.0.1 → 8.0.2 → 8.0.3 | 2026-11-01 |
| `pdfjs-dist` | 6.3.289 → 6.4.299 | 2026-11-01 |
| `electron-builder` | 26.15.3 → 26.18.0 | 2026-11-01 |

## Alcance de la auditoría automática

`pnpm audit --prod --audit-level high` forma parte del gate de CI y cubre el árbol de producción: `@capacitor/core`, `@capacitor/share` y `pdfjs-dist`.

Ese comando no cubría el runtime de escritorio. `electron` está declarado en `devDependencies` porque solo se necesita para construir y ejecutar la app, pero el binario resultante **sí se distribuye** dentro del instalador de Windows, de modo que un advisory contra Electron no aparecía en el gate. Por eso los ocho advisories de la rama 44 convivieron con un CI en verde.

Para cerrar ese hueco, `scripts/verify-runtime-advisories.mjs` consulta OSV.dev con la versión exacta de `electron` declarada en `package.json` y falla si existe algún advisory. Se ejecuta dentro de `pnpm check`.

El árbol de desarrollo completo (`pnpm audit` sin `--prod`) sí acumula hallazgos, concentrados en el utillaje de build: `electron-builder` y sus transitivas, y `rimraf`/`glob`/`tar` bajo `@capacitor/cli` y `@capacitor/assets`. No se usa como gate porque depende de releases de terceros que el repositorio no controla y porque ese código no se distribuye en los artefactos. Se revisa en cada preparación de release.

## Referencias

- [Seguridad y privacidad](security.md)
- [Política de seguridad del repositorio](../SECURITY.md)
- [Changelog](../CHANGELOG.md)
