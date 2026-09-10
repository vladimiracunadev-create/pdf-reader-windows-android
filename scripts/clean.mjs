/** Elimina exclusivamente salidas locales regenerables del build y packaging. */
import { rm } from 'node:fs/promises';
for(const p of ['dist','release'])await rm(p,{recursive:true,force:true});console.log('Limpieza completa.');
