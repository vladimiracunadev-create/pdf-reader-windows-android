import { cp, mkdir, rm } from 'node:fs/promises';
import { existsSync } from 'node:fs';

for (const required of ['dist/index.html', 'site/index.html', 'site/styles.css']) {
  if (!existsSync(required)) {
    console.error(`Falta ${required}. Ejecuta primero pnpm build:web.`);
    process.exit(2);
  }
}

await rm('pages-dist', { recursive: true, force: true });
await mkdir('pages-dist/app', { recursive: true });
await mkdir('pages-dist/assets', { recursive: true });
await cp('site', 'pages-dist', { recursive: true });
await cp('dist', 'pages-dist/app', { recursive: true });
await cp('assets/logo.svg', 'pages-dist/assets/logo.svg');
console.log('GitHub Pages listo en pages-dist/: landing + demo local en /app/.');
