import test from 'node:test';
import assert from 'node:assert/strict';
import {readFile} from 'node:fs/promises';

test('la navegación solo registra botones y no captura todos los clics del body',async()=>{
  const source=await readFile(new URL('../src/app.js',import.meta.url),'utf8');
  assert.match(source,/querySelectorAll\('button\[data-view\]'\)/);
  assert.doesNotMatch(source,/querySelectorAll\('\[data-view\]'\)/);
});

test('los PDFs grandes se abren sin intentar duplicarlos en el historial',async()=>{
  const source=await readFile(new URL('../src/app.js',import.meta.url),'utf8');
  assert.match(source,/MAX_HISTORY_PDF_BYTES/);
  assert.match(source,/persist&&data\.byteLength<=MAX_HISTORY_PDF_BYTES/);
  assert.match(source,/formatBytes\(state\.file\.size\)/);
});

test('la segunda apertura destruye la tarea PDF.js correcta y no el proxy',async()=>{
  const source=await readFile(new URL('../src/app.js',import.meta.url),'utf8');
  assert.match(source,/previousDoc\.loadingTask\?\.destroy\?\.\(\)/);
  assert.doesNotMatch(source,/previousDoc\.destroy\(/);
});

test('las aperturas concurrentes descartan cualquier resultado obsoleto',async()=>{
  const source=await readFile(new URL('../src/app.js',import.meta.url),'utf8');
  assert.match(source,/const sequence=\+\+state\.loadSeq/);
  assert.match(source,/sequence!==state\.loadSeq/);
  assert.match(source,/await task\.destroy\(\)/);
});

test('el ciclo de vida conserva el estado antes de ocultar o cerrar',async()=>{
  const source=await readFile(new URL('../src/app.js',import.meta.url),'utf8');
  assert.match(source,/addEventListener\('pagehide',saveReadingState\)/);
  assert.match(source,/visibilityState==='hidden'/);
});

test('el salto directo confirma la página con Enter',async()=>{
  const source=await readFile(new URL('../src/app.js',import.meta.url),'utf8');
  assert.match(source,/pageInput\.addEventListener\('keydown'/);
  assert.match(source,/event\.key==='Enter'/);
  assert.match(source,/goPage\(els\.pageInput\.value\)/);
});

test('Windows comparte sin transmitir: copia el resumen mediante una frontera IPC acotada',async()=>{
  const app=await readFile(new URL('../src/app.js',import.meta.url),'utf8');
  const preload=await readFile(new URL('../desktop/preload.cjs',import.meta.url),'utf8');
  const main=await readFile(new URL('../desktop/main.cjs',import.meta.url),'utf8');
  assert.match(app,/window\.desktopPdf\?\.copyShareText/);
  assert.match(preload,/ipcRenderer\.invoke\('share:copy-text', text\)/);
  assert.match(main,/ipcMain\.handle\('share:copy-text'/);
  assert.match(main,/clipboard\.writeText\(text\)/);
  assert.match(app,/Resumen copiado/);
});

test('el renderer declara una CSP acotada compatible con PDF.js local',async()=>{
  const html=await readFile(new URL('../src/index.html',import.meta.url),'utf8');
  assert.match(html,/Content-Security-Policy/);
  assert.match(html,/default-src 'self'/);
  assert.match(html,/worker-src 'self' blob:/);
  assert.match(html,/object-src 'none'/);
  assert.doesNotMatch(html,/unsafe-eval|unsafe-inline/);
});

test('las acciones conservan el canvas visible hasta que termina el siguiente render',async()=>{
  const source=await readFile(new URL('../src/app.js',import.meta.url),'utf8');
  assert.match(source,/const nextCanvas=document\.createElement\('canvas'\)/);
  assert.match(source,/await task\.promise/);
  assert.match(source,/ctx\.drawImage\(nextCanvas,0,0\)/);
  assert.match(source,/if\(firstRender\)setLoading\(true,'Renderizando…'\)/);
});

test('Android 16 aplica insets del sistema al WebView',async()=>{
  const source=await readFile(new URL('../android/app/src/main/java/cl/vladimiracunadev/pdfreader/MainActivity.java',import.meta.url),'utf8');
  assert.match(source,/WindowInsetsCompat\.Type\.systemBars\(\)/);
  assert.match(source,/WindowInsetsCompat\.Type\.displayCutout\(\)/);
  assert.match(source,/layout\.setMargins\(safe\.left, safe\.top, safe\.right, safe\.bottom\)/);
});

test('los controles móviles principales mantienen objetivos táctiles de 44 px',async()=>{
  const styles=await readFile(new URL('../src/styles.css',import.meta.url),'utf8');
  assert.match(styles,/\.dock-page \{[^}]*min-height: 44px/s);
  assert.match(styles,/\.nav-item \{[^}]*min-height: 44px/s);
  assert.match(styles,/\.top-actions \.btn\.primary \{[^}]*min-height: 44px/s);
  assert.match(styles,/\.toolbar \.btn\.icon \{[^}]*width: 44px;[^}]*min-width: 44px;[^}]*min-height: 44px/s);
});
