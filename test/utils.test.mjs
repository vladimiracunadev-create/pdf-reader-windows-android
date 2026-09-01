import test from 'node:test';import assert from 'node:assert/strict';import {clamp,formatBytes,buildSnippet,highlightSnippet,documentKey} from '../src/utils.js';
test('clamp limita valores',()=>{assert.equal(clamp(9,1,5),5);assert.equal(clamp(-1,0,2),0);assert.equal(clamp(1,0,2),1)});
test('formatBytes es legible',()=>{assert.equal(formatBytes(0),'0 B');assert.equal(formatBytes(1024),'1.0 KB');assert.equal(formatBytes(1048576),'1.0 MB')});
test('snippet centra coincidencia',()=>{const s=buildSnippet('uno dos tres cuatro cinco','tres',5);assert.match(s,/tres/)});
test('highlight escapa html',()=>{const h=highlightSnippet('<b>hola</b>','hola');assert.ok(!h.includes('<b>'));assert.ok(h.includes('<mark>hola</mark>'))});
test('documentKey es determinista',()=>{assert.equal(documentKey({name:'a.pdf',size:10,lastModified:1}),documentKey({name:'a.pdf',size:10,lastModified:1}))});
