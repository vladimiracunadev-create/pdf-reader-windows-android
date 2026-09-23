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
