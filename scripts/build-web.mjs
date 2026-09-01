import { cp, mkdir, rm, copyFile } from 'node:fs/promises';
import { existsSync } from 'node:fs';
const required=['node_modules/pdfjs-dist/legacy/build/pdf.mjs','node_modules/pdfjs-dist/legacy/build/pdf.worker.mjs'];
for(const file of required)if(!existsSync(file)){console.error(`Falta ${file}. Ejecuta pnpm install.`);process.exit(2)}
await rm('dist',{recursive:true,force:true});await mkdir('dist/vendor',{recursive:true});await cp('src','dist',{recursive:true});
await copyFile(required[0],'dist/vendor/pdf.mjs');await copyFile(required[1],'dist/vendor/pdf.worker.mjs');
for (const extra of ['cmaps','standard_fonts','wasm']) { const src=`node_modules/pdfjs-dist/${extra}`; if (existsSync(src)) await cp(src,`dist/vendor/${extra}`,{recursive:true}); }
console.log('Web build listo en dist/.');
