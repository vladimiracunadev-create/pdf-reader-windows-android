import test from 'node:test';
import assert from 'node:assert/strict';
import {readStorage,writeStorage} from '../src/storage.js';

test('readStorage devuelve el valor disponible',()=>{
  assert.equal(readStorage('theme',()=>({getItem:key=>key==='theme'?'dark':null})),'dark');
});

test('readStorage degrada a null si el almacenamiento está bloqueado',()=>{
  assert.equal(readStorage('theme',()=>{throw new DOMException('blocked','SecurityError')}),null);
  assert.equal(readStorage('theme',()=>({getItem(){throw new DOMException('blocked','SecurityError')}})),null);
});

test('writeStorage confirma la escritura realizada',()=>{
  let stored;assert.equal(writeStorage('theme','light',()=>({setItem:(key,value)=>{stored={key,value};}})),true);
  assert.deepEqual(stored,{key:'theme',value:'light'});
});

test('writeStorage no propaga errores de cuota o seguridad',()=>{
  assert.equal(writeStorage('theme','dark',()=>{throw new DOMException('blocked','SecurityError')}),false);
  assert.equal(writeStorage('theme','dark',()=>({setItem(){throw new DOMException('full','QuotaExceededError')}})),false);
});
