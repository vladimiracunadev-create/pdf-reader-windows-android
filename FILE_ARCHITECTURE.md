# File Architecture

```text
src/                    Núcleo web del lector
  index.html            UI principal
  app.js                Controlador PDF/UX
  utils.js              Utilidades testeables
  styles.css            UI responsive
  assets/               Recursos visuales
desktop/                Shell Electron Windows
scripts/                Build, verificación y bootstrap Android
site/                   Landing estática de GitHub Pages
assets/                 Fuente maestra de icono/splash nativo
spec/                   Especificación de producto
docs/                   Documentación docs-as-code
reports/                Evidencia de validación
.github/workflows/      CI, Pages y Release
build/                  Icono de packaging Windows
android/                Proyecto nativo Android fijado (assets web ignorados)
pages-dist/             Landing + demo generadas; ignorado por Git
release/                Artefactos locales; ignorado por Git
```
