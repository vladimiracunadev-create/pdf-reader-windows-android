/** Funciones puras compartidas por el lector y sus pruebas unitarias. */
export const clamp=(value,min,max)=>Math.min(max,Math.max(min,value));
/** Calcula la corrección de scroll necesaria para conservar un punto relativo del canvas. */
export function readingAnchorDelta(canvasStart,canvasSize,anchorRatio,viewportPoint){const start=Number(canvasStart)||0;const size=Math.max(0,Number(canvasSize)||0);const ratio=clamp(Number(anchorRatio)||0,0,1);const point=Number(viewportPoint)||0;return start+size*ratio-point;}
/** Formatea bytes con unidades binarias legibles; valores inválidos producen un guión. */
export function formatBytes(bytes){if(!Number.isFinite(bytes)||bytes<0)return '—';if(bytes===0)return '0 B';const units=['B','KB','MB','GB'];const i=Math.min(Math.floor(Math.log(bytes)/Math.log(1024)),units.length-1);const value=bytes/1024**i;return `${value>=10||i===0?value.toFixed(0):value.toFixed(1)} ${units[i]}`;}
/** Identidad local no criptográfica basada en metadatos del archivo. */
export function documentKey(file){return `pdf-state:${encodeURIComponent(file.name)}:${file.size||0}:${file.lastModified||0}`;}
export function historyId(file){return `pdf:${encodeURIComponent(file.name)}:${file.size||0}:${file.lastModified||0}`;}
/** Distancia euclidiana entre dos contactos táctiles. */
export function touchDistance(a,b){return Math.hypot(Number(b?.clientX||0)-Number(a?.clientX||0),Number(b?.clientY||0)-Number(a?.clientY||0));}
/**
 * Decide si un gesto horizontal debe cambiar de página. Cuando el PDF está
 * ampliado, primero deja que la persona recorra el ancho y solo cambia al
 * arrastrar más allá del borde correspondiente.
 */
export function pageTurnFromSwipe({dx,dy,elapsed,scrollLeft=0,clientWidth=0,scrollWidth=0}){
  if(!(elapsed<550&&Math.abs(dx)>85&&Math.abs(dx)>Math.abs(dy)*1.4))return 0;
  const maxScroll=Math.max(0,Number(scrollWidth)-Number(clientWidth));
  const position=clamp(Number(scrollLeft)||0,0,maxScroll);
  const edgeTolerance=3;
  if(dx<0&&(maxScroll<=edgeTolerance||position>=maxScroll-edgeTolerance))return 1;
  if(dx>0&&(maxScroll<=edgeTolerance||position<=edgeTolerance))return-1;
  return 0;
}
/** Construye el texto explícito de compartir; nunca incorpora los bytes del PDF. */
export function buildShareText(file,page,total){const name=file?.name||'un PDF';const progress=total?` (página ${clamp(Number(page)||1,1,total)} de ${total})`:'';return `Estoy leyendo “${name}”${progress} con PDF Reader, un lector local y de solo lectura. https://vladimiracunadev-create.github.io/pdf-reader-windows-android/`;}
/** Extrae contexto alrededor de la primera coincidencia de búsqueda. */
export function buildSnippet(text,query,radius=58){const clean=String(text||'').replace(/\s+/g,' ').trim();const q=String(query||'').trim();if(!q)return clean.slice(0,radius*2);const index=clean.toLocaleLowerCase().indexOf(q.toLocaleLowerCase());if(index<0)return clean.slice(0,radius*2);const start=Math.max(0,index-radius);const end=Math.min(clean.length,index+q.length+radius);return `${start>0?'…':''}${clean.slice(start,end)}${end<clean.length?'…':''}`;}
/** Escapa los cinco caracteres significativos de HTML antes de insertar resultados. */
export function escapeHtml(text){return String(text).replace(/[&<>'"]/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;',"'":'&#39;','"':'&quot;'}[c]));}
/** Resalta una consulta ya escapada dentro de un snippet también escapado. */
export function highlightSnippet(snippet,query){const safe=escapeHtml(snippet);const escapedQuery=escapeHtml(query).replace(/[.*+?^${}()|[\]\\]/g,'\\$&');if(!escapedQuery)return safe;return safe.replace(new RegExp(`(${escapedQuery})`,'ig'),'<mark>$1</mark>');}
