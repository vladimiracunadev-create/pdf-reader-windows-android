import test from 'node:test';import assert from 'node:assert/strict';import {clamp,formatBytes,buildSnippet,highlightSnippet,documentKey,historyId,touchDistance,buildShareText} from '../src/utils.js';
test('clamp limita valores',()=>{assert.equal(clamp(9,1,5),5);assert.equal(clamp(-1,0,2),0);assert.equal(clamp(1,0,2),1)});
test('formatBytes es legible',()=>{assert.equal(formatBytes(0),'0 B');assert.equal(formatBytes(1024),'1.0 KB');assert.equal(formatBytes(1048576),'1.0 MB')});
test('snippet centra coincidencia',()=>{const s=buildSnippet('uno dos tres cuatro cinco','tres',5);assert.match(s,/tres/)});
test('highlight escapa html',()=>{const h=highlightSnippet('<b>hola</b>','hola');assert.ok(!h.includes('<b>'));assert.ok(h.includes('<mark>hola</mark>'))});
test('documentKey es determinista',()=>{assert.equal(documentKey({name:'a.pdf',size:10,lastModified:1}),documentKey({name:'a.pdf',size:10,lastModified:1}))});
test('historyId distingue documentos',()=>{assert.notEqual(historyId({name:'a.pdf',size:10,lastModified:1}),historyId({name:'a.pdf',size:11,lastModified:1}))});
test('touchDistance calcula el gesto sin depender de páginas',()=>{assert.equal(touchDistance({clientX:0,clientY:0},{clientX:3,clientY:4}),5)});
test('texto para compartir incluye documento y progreso',()=>{const text=buildShareText({name:'manual.pdf'},4,10);assert.match(text,/manual\.pdf/);assert.match(text,/página 4 de 10/);assert.match(text,/solo lectura/)});
