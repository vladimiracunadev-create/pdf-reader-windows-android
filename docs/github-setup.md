# GitHub Setup

## Repository name
`pdf-reader-windows-android`

## About
**Description**
> 📄 PDF Reader v0.2.0 — lector PDF Android-first, local y de solo lectura: zoom táctil, historial reabrible, About y compartir a WhatsApp. Android 7+, Windows y Web · cero cuentas, permisos sensibles y telemetría. APK firmado. 🔒

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

## Release actual
Después de confirmar CI verde en `main`:
```bash
git tag v0.2.0
git push origin v0.2.0
```
