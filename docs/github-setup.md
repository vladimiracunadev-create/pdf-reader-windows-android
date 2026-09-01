# GitHub Setup

## Repository name
`pdf-reader-windows-android`

## About
**Description**
> 📄 PDF Reader v0.1.0 — lector local y de solo lectura para Android 7+, Windows y Web. PDF.js + Capacitor + Electron · cero cuentas, permisos Android y telemetría. APK firmado. 🔒

**Website**
`https://vladimiracunadev-create.github.io/pdf-reader-windows-android/`

**Topics**
`pdf` · `pdf-reader` · `pdfjs` · `electron` · `capacitor` · `android` · `windows` · `javascript` · `github-pages` · `offline-first` · `privacy`

## Features sugeridas
- Issues: ON
- Discussions: opcional
- Wiki: OFF (docs-as-code en `/docs`)
- Projects: opcional

## Pages
Settings → Pages → Build and deployment → **GitHub Actions**.

La raíz publica la landing y `/app/` publica el lector web funcional.

## Release inicial
Después de confirmar CI verde en `main`:
```bash
git tag v0.1.0
git push origin v0.1.0
```
