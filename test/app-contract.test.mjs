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
