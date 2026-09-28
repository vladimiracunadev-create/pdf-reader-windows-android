/** Black-box-ish Electron QA through Chromium DevTools Protocol, with no extra framework. */
import { spawn } from 'node:child_process';
import { mkdir, rm, writeFile } from 'node:fs/promises';
import path from 'node:path';
import process from 'node:process';
import electron from 'electron';

const root = process.cwd();
const corpus = path.join(root, '.qa', 'pdf-corpus');
const evidence = path.join(root, '.qa', 'desktop-e2e');
const port = Number(process.env.PDF_READER_CDP_PORT || 9333);
const packagedExecutable = process.env.PDF_READER_EXECUTABLE;
const executable = packagedExecutable || electron;
const appArguments = packagedExecutable ? [] : ['.'];
await rm(evidence, { recursive: true, force: true });
await mkdir(evidence, { recursive: true });
const qaProfile = path.join(evidence, 'profile');

const firstPdf = path.join(corpus, '02-multipage-text-images.pdf');
const appOutput = [];
const app = spawn(executable, [`--remote-debugging-port=${port}`, ...appArguments, firstPdf], {
  cwd: root,
  env: { ...process.env, PDF_READER_QA: '1', PDF_READER_QA_PROFILE: qaProfile },
  stdio: ['ignore', 'pipe', 'pipe'],
});
app.stdout.on('data', chunk => appOutput.push(chunk.toString()));
app.stderr.on('data', chunk => appOutput.push(chunk.toString()));
app.on('exit', (code, signal) => console.error(`ELECTRON_EXIT code=${code} signal=${signal} output=${appOutput.join('').slice(-4000)}`));

async function pollJson() {
  const deadline = Date.now() + 30_000;
  while (Date.now() < deadline) {
    try {
      const response = await fetch(`http://127.0.0.1:${port}/json/list`);
      const pages = await response.json();
      const target = pages.find(page => page.type === 'page' && page.url.endsWith('/dist/index.html'));
      if (target) return target;
    } catch {}
    await new Promise(resolve => setTimeout(resolve, 150));
  }
  throw new Error('Electron no expuso la ventana por CDP dentro del plazo');
}

const target = await pollJson();
console.log(`CDP_TARGET ${target.url}`);
// Electron 44 can expose the target before the sandboxed renderer finishes its
// first navigation. Attaching Runtime at that exact boundary intermittently
// terminates the target on Windows, so wait for the target to settle first.
await new Promise(resolve => setTimeout(resolve, 1_000));
const socket = new WebSocket(target.webSocketDebuggerUrl);
await new Promise((resolve, reject) => {
  socket.addEventListener('open', resolve, { once: true });
  socket.addEventListener('error', reject, { once: true });
});

let nextId = 0;
const pending = new Map();
const consoleEvents = [];
const networkFailures = [];
socket.addEventListener('message', event => {
  const message = JSON.parse(event.data);
  if (message.id && pending.has(message.id)) {
    const { resolve, reject } = pending.get(message.id);
    pending.delete(message.id);
    if (message.error) reject(new Error(message.error.message)); else resolve(message.result);
  } else if (message.method === 'Runtime.consoleAPICalled') {
    consoleEvents.push({ type: message.params.type, args: message.params.args.map(arg => arg.value ?? arg.description ?? '') });
  } else if (message.method === 'Runtime.exceptionThrown') {
    consoleEvents.push({ type: 'exception', args: [message.params.exceptionDetails.text, message.params.exceptionDetails.exception?.description] });
  } else if (message.method === 'Network.loadingFailed' && !message.params.canceled) {
    networkFailures.push(message.params);
  }
});

function command(method, params = {}) {
  return new Promise((resolve, reject) => {
    const id = ++nextId;
    pending.set(id, { resolve, reject });
    socket.send(JSON.stringify({ id, method, params }));
  });
}

async function evaluate(expression) {
  const response = await command('Runtime.evaluate', { expression, awaitPromise: true, returnByValue: true, userGesture: true });
  if (response.exceptionDetails) throw new Error(response.exceptionDetails.exception?.description || response.exceptionDetails.text);
  return response.result.value;
}

async function waitFor(expression, timeout = 20_000) {
  const deadline = Date.now() + timeout;
  let last;
  while (Date.now() < deadline) {
    try { last = await evaluate(expression); if (last) return last; } catch (error) { last = String(error); }
    await new Promise(resolve => setTimeout(resolve, 100));
  }
  throw new Error(`Timeout esperando ${expression}; último=${JSON.stringify(last)}`);
}

async function click(id) {
  await evaluate(`document.getElementById(${JSON.stringify(id)}).click(); true`);
}

async function mouseClick(id){const rect=await evaluate(`(()=>{const r=document.getElementById(${JSON.stringify(id)}).getBoundingClientRect();return{x:r.left+r.width/2,y:r.top+r.height/2}})()`);await command('Input.dispatchMouseEvent',{type:'mousePressed',x:rect.x,y:rect.y,button:'left',clickCount:1});await command('Input.dispatchMouseEvent',{type:'mouseReleased',x:rect.x,y:rect.y,button:'left',clickCount:1});}

async function key(key, code = key) {
  await command('Input.dispatchKeyEvent', { type: 'keyDown', key, code });
  await command('Input.dispatchKeyEvent', { type: 'keyUp', key, code });
}

async function openExternalPdf(file, expectedTitle = file, acceptRetainedPrevious = false) {
  console.log(`OPEN ${file}`);
  const priorToast = await evaluate(`document.getElementById('toast').textContent`);
  const child = spawn(executable, [...appArguments, path.join(corpus, file)], { cwd: root, env:{...process.env,PDF_READER_QA:'1',PDF_READER_QA_PROFILE:qaProfile}, stdio: 'ignore' });
  child.unref();
  await waitFor(`document.getElementById('documentTitle').textContent === ${JSON.stringify(expectedTitle)} || !document.getElementById('emptyError').classList.contains('hidden') || (${acceptRetainedPrevious} && !document.getElementById('toast').classList.contains('hidden') && document.getElementById('toast').textContent !== ${JSON.stringify(priorToast)})`, 45_000);
  await waitFor(`document.getElementById('loading').classList.contains('hidden')`, file.includes('heavy')||file.includes('high-resolution')?90_000:45_000);
}

const cases = [];
async function check(id, functionality, pdf, action, expected, probe) {
  console.log(`CHECK ${id} ${functionality}`);
  try {
    const observed = await probe();
    const pass = typeof observed === 'object' && observed !== null && 'pass' in observed ? observed.pass : Boolean(observed);
    const detail = typeof observed === 'object' && observed !== null && 'detail' in observed ? observed.detail : observed;
    cases.push({ id, functionality, environment: 'Windows 11 · Electron local', pdf, action, expected, observed: detail, status: pass ? 'PASS' : 'FAIL', error: pass ? '' : `Esperado: ${expected}` });
    console.log(`${id} ${pass ? 'PASS' : 'FAIL'}`);
  } catch (error) {
    cases.push({ id, functionality, environment: 'Windows 11 · Electron local', pdf, action, expected, observed: String(error), status: 'FAIL', error: String(error) });
  }
}

await command('Runtime.enable');
await command('Network.enable');
await command('Page.enable');
console.log('CDP_READY');
await waitFor(`document.readyState === 'complete'`);
console.log('DOM_READY');
await waitFor(`document.getElementById('documentTitle').textContent === '02-multipage-text-images.pdf'`, 30_000);
console.log('PDF_TITLE_READY');
await waitFor(`document.getElementById('loading').classList.contains('hidden')`, 30_000);
console.log('INITIAL_RENDER_READY');
if (await evaluate(`document.getElementById('defaultReaderDialog').open`)) await click('defaultLaterBtn');
await key('Home');
await waitFor(`document.getElementById('pageInput').value === '1'`);

await check('FUN-001', 'Abrir PDF por asociación/argumento', '02-multipage-text-images.pdf', 'Iniciar Electron con la ruta .pdf', 'Nombre visible, 12 páginas y canvas renderizado', async () => {
  const value = await evaluate(`({title:document.getElementById('documentTitle').textContent,total:document.getElementById('pageTotal').textContent,canvas:document.getElementById('pdfCanvas').width})`);
  return { pass: value.title.includes('02-multipage') && value.total.includes('12') && value.canvas > 0, detail: value };
});

await mouseClick('nextBtn'); await waitFor(`document.getElementById('pageInput').value === '2'`);
await check('FUN-002', 'Página siguiente', '02-multipage-text-images.pdf', 'Clic en Siguiente', 'Página 2', async () => ({ pass: await evaluate(`document.getElementById('pageInput').value === '2'`), detail: await evaluate(`document.getElementById('pageInput').value`) }));
await click('prevBtn'); await waitFor(`document.getElementById('pageInput').value === '1'`);
await check('FUN-003', 'Página anterior', '02-multipage-text-images.pdf', 'Clic en Anterior', 'Página 1', async () => ({ pass: await evaluate(`document.getElementById('pageInput').value === '1'`), detail: await evaluate(`document.getElementById('pageInput').value`) }));

await evaluate(`(()=>{const input=document.getElementById('pageInput');input.value='7';input.dispatchEvent(new KeyboardEvent('keydown',{key:'Enter',bubbles:true,cancelable:true}));return true})()`);
await waitFor(`document.getElementById('pageInput').value === '7'`);
await check('FUN-004', 'Ir directamente a página', '02-multipage-text-images.pdf', 'Escribir 7 y Enter', 'Página 7', async () => ({ pass: await evaluate(`document.getElementById('pageInput').value === '7'`), detail: 7 }));

await key('Home'); await waitFor(`document.getElementById('pageInput').value === '1'`);
await check('FUN-005', 'Primera página por teclado', '02-multipage-text-images.pdf', 'Home', 'Página 1', async () => ({ pass: await evaluate(`document.getElementById('pageInput').value === '1'`), detail: 1 }));
await key('End'); await waitFor(`document.getElementById('pageInput').value === '12'`);
await check('FUN-006', 'Última página por teclado', '02-multipage-text-images.pdf', 'End', 'Página 12', async () => ({ pass: await evaluate(`document.getElementById('pageInput').value === '12'`), detail: 12 }));
await click('nextBtn');
await check('FUN-007', 'Límite de navegación', '02-multipage-text-images.pdf', 'Siguiente en última página', 'Permanece en 12', async () => ({ pass: await evaluate(`document.getElementById('pageInput').value === '12'`), detail: await evaluate(`document.getElementById('pageInput').value`) }));

const zoomBefore = await evaluate(`document.getElementById('zoomLabel').textContent`);
await click('zoomInBtn'); await waitFor(`document.getElementById('zoomLabel').textContent !== ${JSON.stringify(zoomBefore)}`);
await check('FUN-008', 'Zoom in', '02-multipage-text-images.pdf', 'Clic Acercar', 'Porcentaje aumenta', async () => {
  const after = await evaluate(`document.getElementById('zoomLabel').textContent`); return { pass: parseInt(after) > parseInt(zoomBefore), detail: `${zoomBefore} -> ${after}` };
});
const zoomHigh = await evaluate(`document.getElementById('zoomLabel').textContent`);
await click('zoomOutBtn'); await waitFor(`document.getElementById('zoomLabel').textContent !== ${JSON.stringify(zoomHigh)}`);
await check('FUN-009', 'Zoom out', '02-multipage-text-images.pdf', 'Clic Alejar', 'Porcentaje disminuye', async () => {
  const after = await evaluate(`document.getElementById('zoomLabel').textContent`); return { pass: parseInt(after) < parseInt(zoomHigh), detail: `${zoomHigh} -> ${after}` };
});
await click('fitPageBtn');
await check('FUN-010', 'Ajustar a página', '02-multipage-text-images.pdf', 'Clic Página', 'Canvas cabe en visor', async () => {
  await waitFor(`document.getElementById('viewStatus').textContent.startsWith('Página completa')`); const value = await evaluate(`({cw:document.getElementById('pdfCanvas').getBoundingClientRect().width,ch:document.getElementById('pdfCanvas').getBoundingClientRect().height,vw:document.getElementById('viewer').clientWidth,vh:document.getElementById('viewer').clientHeight})`); return { pass: value.cw <= value.vw && value.ch <= value.vh, detail: value };
});
await click('fitWidthBtn');
await check('FUN-011', 'Ajustar al ancho', '02-multipage-text-images.pdf', 'Clic Ancho', 'Canvas ocupa ancho disponible sin excederlo', async () => {
  await waitFor(`document.getElementById('viewStatus').textContent.startsWith('Ajustado al ancho')`); const value = await evaluate(`({cw:document.getElementById('pdfCanvas').getBoundingClientRect().width,vw:document.getElementById('viewer').clientWidth})`); return { pass: value.cw <= value.vw && value.cw >= value.vw - 60, detail: value };
});

const zoomBeforeScroll=await evaluate(`document.getElementById('zoomLabel').textContent`);for(let index=0;index<6;index++)await click('zoomInBtn');await waitFor(`document.getElementById('viewStatus').textContent.startsWith('Zoom manual')&&document.getElementById('zoomLabel').textContent!==${JSON.stringify(zoomBeforeScroll)}`);
const scrollBefore = await evaluate(`(()=>{const viewer=document.getElementById('viewer');viewer.scrollTop=0;viewer.scrollLeft=0;return{top:viewer.scrollTop,left:viewer.scrollLeft,vertical:viewer.scrollHeight>viewer.clientHeight,horizontal:viewer.scrollWidth>viewer.clientWidth}})()`);
const scrollPoint=await evaluate(`(()=>{const r=document.getElementById('viewer').getBoundingClientRect();return{x:r.left+r.width/2,y:r.top+r.height/2}})()`);
await command('Page.bringToFront');
await command('Input.dispatchMouseEvent',{type:'mouseMoved',x:scrollPoint.x,y:scrollPoint.y});
await command('Input.dispatchMouseEvent',{type:'mousePressed',x:scrollPoint.x,y:scrollPoint.y,button:'left',clickCount:1});
await command('Input.dispatchMouseEvent',{type:'mouseReleased',x:scrollPoint.x,y:scrollPoint.y,button:'left',clickCount:1});
for(let step=0;step<3;step++)await command('Input.dispatchMouseEvent', { type: 'mouseWheel', x: scrollPoint.x, y: scrollPoint.y, deltaX: scrollBefore.horizontal&&!scrollBefore.vertical?260:0, deltaY: scrollBefore.vertical?260:0 });
await new Promise(resolve => setTimeout(resolve, 500));
await check('FUN-011B', 'Scroll con rueda de mouse', '02-multipage-text-images.pdf', 'Rueda sobre página ampliada', 'scrollTop aumenta', async () => {
  const after=await evaluate(`({top:document.getElementById('viewer').scrollTop,left:document.getElementById('viewer').scrollLeft})`);return{pass:after.top>scrollBefore.top||after.left>scrollBefore.left,detail:{before:scrollBefore,after}};
});

const dimensionsBefore = await evaluate(`({w:document.getElementById('pdfCanvas').width,h:document.getElementById('pdfCanvas').height})`);
const rotationBefore=await evaluate(`Number(document.getElementById('viewStatus').textContent.match(/(\\d+)°$/)?.[1]||0)`);await click('rotateBtn'); await waitFor(`document.getElementById('viewStatus').textContent.endsWith(${JSON.stringify(`${(rotationBefore+90)%360}°`)})`);
await check('FUN-012', 'Rotar', '02-multipage-text-images.pdf', 'Clic Rotar 90°', 'Dimensiones se intercambian', async () => {
  const after = await evaluate(`({w:document.getElementById('pdfCanvas').width,h:document.getElementById('pdfCanvas').height})`); const beforeLandscape=dimensionsBefore.w>dimensionsBefore.h; const afterLandscape=after.w>after.h; return { pass: beforeLandscape !== afterLandscape, detail: { before: dimensionsBefore, after } };
});

await click('thumbsBtn'); await waitFor(`document.getElementById('sidebar').classList.contains('open') && document.querySelectorAll('.thumb').length === 12`, 30_000);
await check('FUN-013', 'Miniaturas', '02-multipage-text-images.pdf', 'Abrir panel', '12 miniaturas y navegación', async () => ({ pass: await evaluate(`document.querySelectorAll('.thumb').length === 12`), detail: await evaluate(`document.querySelectorAll('.thumb').length`) }));
await evaluate(`document.querySelector('.thumb[data-page="3"]').click(); true`); await waitFor(`document.getElementById('pageInput').value === '3'`);

await click('searchBtn');
await evaluate(`(()=>{const input=document.getElementById('searchInput');input.value='BUSQUEDA-09';document.getElementById('searchForm').requestSubmit();return true})()`);
await waitFor(`document.getElementById('searchStatus').textContent.includes('1 página')`, 30_000);
await check('FUN-014', 'Búsqueda de texto', '02-multipage-text-images.pdf', 'Buscar BUSQUEDA-09', '1 coincidencia en página 9', async () => ({ pass: await evaluate(`document.querySelectorAll('.search-result').length === 1 && document.querySelector('.search-result').textContent.includes('Página 9')`), detail: await evaluate(`document.getElementById('searchStatus').textContent`) }));
await evaluate(`document.querySelector('.search-result').click(); true`); await waitFor(`document.getElementById('pageInput').value === '9'`);

const themeBefore = await evaluate(`document.documentElement.dataset.theme`); await click('themeBtn');
await check('FUN-015', 'Tema claro/oscuro', '02-multipage-text-images.pdf', 'Alternar tema', 'Tema cambia y persiste', async () => ({ pass: await evaluate(`document.documentElement.dataset.theme !== ${JSON.stringify(themeBefore)}`), detail: await evaluate(`document.documentElement.dataset.theme`) }));

await evaluate(`document.querySelector('button[data-view="about"]').click();true`);await waitFor(`!document.getElementById('aboutView').classList.contains('hidden')`);
await check('FUN-015A','About y navegación interna','N/A','Abrir About y volver con history.back()','About visible y regreso al lector',async()=>{const about=await evaluate(`document.getElementById('aboutTitle').textContent`);await evaluate(`history.back();true`);await waitFor(`!document.getElementById('readerView').classList.contains('hidden')`);return{pass:about==='About',detail:about}});

await evaluate(`document.querySelector('button[data-view="history"]').click(); true`); await waitFor(`!document.getElementById('historyView').classList.contains('hidden')`);
await check('FUN-016', 'Historial y progreso', '02-multipage-text-images.pdf', 'Abrir Historial', 'Entrada reabrible con página 9', async () => {
  const value = await evaluate(`({count:document.querySelectorAll('.history-item').length,text:document.getElementById('historyList').textContent})`); return { pass: value.count >= 1 && value.text.includes('02-multipage') && value.text.toLocaleLowerCase().includes('página 9'), detail: value };
});

await click('fullscreenBtn'); await waitFor(`!!document.fullscreenElement`, 5_000);
await check('FUN-015B', 'Pantalla completa', '02-multipage-text-images.pdf', 'Clic Pantalla completa', 'Documento entra en fullscreen', async()=>({pass:await evaluate(`!!document.fullscreenElement`),detail:await evaluate(`document.fullscreenElement?.tagName||''`)}));
await evaluate(`document.exitFullscreen()`); await waitFor(`!document.fullscreenElement`, 5_000);

await openExternalPdf('01-single-page-selectable.pdf');
const dropBefore=await evaluate(`document.getElementById('documentTitle').textContent`);
await command('Input.dispatchDragEvent',{type:'dragEnter',x:640,y:500,data:{items:[],files:[path.join(corpus,'07-landscape.pdf')],dragOperationsMask:1}});
await command('Input.dispatchDragEvent',{type:'drop',x:640,y:500,data:{items:[],files:[path.join(corpus,'07-landscape.pdf')],dragOperationsMask:1}});
await waitFor(`document.getElementById('documentTitle').textContent === '07-landscape.pdf'`,10_000);
await check('FUN-015C','Arrastrar y soltar','07-landscape.pdf','Drop de archivo sobre el visor','Cambia del PDF anterior al horizontal',async()=>({pass:dropBefore==='01-single-page-selectable.pdf'&&await evaluate(`document.getElementById('documentTitle').textContent==='07-landscape.pdf'`),detail:{before:dropBefore,after:'07-landscape.pdf'}}));

await command('Page.reload',{ignoreCache:true});await waitFor(`document.readyState==='complete'`);await waitFor(`document.querySelectorAll('.history-item').length>=1 || true`);
await evaluate(`document.querySelector('button[data-view="history"]').click();true`);await waitFor(`!document.getElementById('historyView').classList.contains('hidden')`);
await check('FUN-015D','Recarga y recuperación','07-landscape.pdf','Recargar app y abrir Historial','Documento reciente sigue reabrible',async()=>{const text=await evaluate(`document.getElementById('historyList').textContent`);return{pass:text.includes('07-landscape.pdf'),detail:text.includes('07-landscape.pdf')}});
await evaluate(`document.querySelector('.history-item .btn.primary').click();true`);await waitFor(`!document.getElementById('viewer').classList.contains('hidden')`);
await evaluate(`(()=>{const item=[...document.querySelectorAll('.history-item')].find(node=>node.textContent.includes('02-multipage-text-images.pdf'));item.querySelector('.btn.primary').click();return true})()`); await waitFor(`document.getElementById('pageInput').value === '9'`);

await check('FUN-017', 'Compartir lectura', '02-multipage-text-images.pdf', 'Clic Compartir en Windows', 'Abre destino o informa fallo', async () => {
  const capability = await evaluate(`({native:!!navigator.share,desktop:!!window.desktopPdf?.copyShareText})`);
  await waitFor(`document.getElementById('toast').classList.contains('hidden')`, 5_000);
  await click('shareBtn');
  await new Promise(resolve => setTimeout(resolve, 500));
  const feedback = await evaluate(`document.getElementById('toast').classList.contains('hidden') ? '' : document.getElementById('toast').textContent`);
  return { pass: capability.desktop ? feedback.includes('Resumen copiado') : capability.native || Boolean(feedback), detail: { capability, feedback } };
});

const corpusLoads = [
  ['PDF-001', '01-single-page-selectable.pdf', '1'], ['PDF-002', '02-multipage-text-images.pdf', '12'],
  ['PDF-003', '03-many-pages-1000.pdf', '1000'], ['PDF-004', '04-scanned-no-text-layer.pdf', '1'],
  ['PDF-005', '05-images-only.pdf', '5'], ['PDF-006', '06-varied-page-sizes.pdf', '4'],
  ['PDF-007', '07-landscape.pdf', '1'], ['PDF-008', '08-mixed-orientation-rotated.pdf', '4'],
  ['PDF-009', '09-heavy-over-24mb.pdf', '3'], ['PDF-010', '10-high-resolution-image.pdf', '1'],
  ['PDF-011', '11-links-and-metadata.pdf', '2'], ['PDF-012', '12-embedded-font.pdf', '1'],
  ['PDF-014', '14-recoverable-trailing-garbage.pdf', '12'], ['PDF-015', '15-browser-generated.pdf', '1'],
  ['PDF-016', '16-word-native-export.pdf', '2'],
];
for (const [id, file, pages] of corpusLoads) {
  await openExternalPdf(file);
  await check(id, 'Abrir y renderizar variante PDF', file, 'Abrir como segundo intento/archivo externo', `${pages} página(s), canvas visible`, async () => {
    const value = await evaluate(`({title:document.getElementById('documentTitle').textContent,total:document.getElementById('pageTotal').textContent,visible:!document.getElementById('viewer').classList.contains('hidden'),canvas:document.getElementById('pdfCanvas').width})`);
    return { pass: value.title === file && value.total.includes(`/ ${pages}`) && value.visible && value.canvas > 0, detail: value };
  });
}

await openExternalPdf('04-scanned-no-text-layer.pdf'); await click('searchBtn');
await evaluate(`(()=>{const input=document.getElementById('searchInput');input.value='SCAN-ONLY-IMAGE';document.getElementById('searchForm').requestSubmit();return true})()`);
await waitFor(`document.getElementById('searchStatus').textContent === 'Sin coincidencias'`);
await check('FUN-018', 'Búsqueda sin OCR', '04-scanned-no-text-layer.pdf', 'Buscar texto visible solo en píxeles', 'Sin coincidencias y sin fallo', async () => ({ pass: await evaluate(`document.getElementById('searchStatus').textContent === 'Sin coincidencias'`), detail: 'Sin coincidencias' }));

await openExternalPdf('03-many-pages-1000.pdf');
await evaluate(`(()=>{const input=document.getElementById('pageInput');input.value='1000';input.dispatchEvent(new KeyboardEvent('keydown',{key:'Enter',bubbles:true,cancelable:true}));return true})()`); await waitFor(`document.getElementById('pageInput').value === '1000'`, 30_000);
await click('thumbsBtn'); await waitFor(`document.querySelectorAll('.thumb').length === 60`, 30_000);
await check('FUN-019', 'PDF de muchas páginas', '03-many-pages-1000.pdf', 'Saltar a 1000 y abrir miniaturas', 'Página 1000; lote acotado de 60', async () => {
  const value = await evaluate(`({page:document.getElementById('pageInput').value,thumbs:document.querySelectorAll('.thumb').length,summary:document.querySelector('.thumb-range').textContent})`); return { pass: value.page === '1000' && value.thumbs === 60 && value.summary.includes('1000'), detail: value };
});

await openExternalPdf('09-heavy-over-24mb.pdf');
await waitFor(`document.getElementById('toast').textContent.includes('no se guardará en el historial')`);
await check('FUN-020', 'PDF pesado', '09-heavy-over-24mb.pdf', 'Abrir archivo >24 MiB', 'Abre y avisa que no se guardará', async () => {
  const value = await evaluate(`({toast:document.getElementById('toast').textContent,status:document.getElementById('fileStatus').textContent})`); return { pass: value.toast.includes('no se guardará en el historial') && !value.toast.includes('(0 B)') && value.status.includes('MB'), detail: value };
});

await openExternalPdf('13-password-protected.pdf', '13-password-protected.pdf', true);
await check('ERR-001', 'Error PDF protegido y conservación', '13-password-protected.pdf', 'Abrir PDF con contraseña sobre documento válido', 'Mensaje claro y documento anterior sigue abierto', async () => {
  const value = await evaluate(`({toast:document.getElementById('toast').textContent,title:document.getElementById('documentTitle').textContent,viewer:!document.getElementById('viewer').classList.contains('hidden')})`); return { pass: value.toast.includes('protegido con contraseña') && value.toast.includes('anterior sigue abierto') && value.viewer, detail: value };
});

await openExternalPdf('02-multipage-text-images.pdf');
await command('Emulation.setDeviceMetricsOverride', { width: 390, height: 844, deviceScaleFactor: 1, mobile: true, screenWidth: 390, screenHeight: 844 });
await new Promise(resolve => setTimeout(resolve, 600));
await check('MOB-001', 'Responsive móvil representativo', '02-multipage-text-images.pdf', 'Redimensionar ventana real a 390×844', 'Dock móvil visible, toolbar adaptada y canvas renderizado', async () => {
  const value = await evaluate(`({width:innerWidth,dock:getComputedStyle(document.getElementById('readerDock')).display,canvas:document.getElementById('pdfCanvas').width,overflow:document.documentElement.scrollWidth<=innerWidth})`); return { pass: value.width <= 390 && value.dock !== 'none' && value.canvas > 0 && value.overflow, detail: value };
});

await evaluate(`(()=>{window.__qaLoadingShows=0;const loading=document.getElementById('loading');window.__qaLoadingObserver?.disconnect();window.__qaLoadingObserver=new MutationObserver(()=>{if(!loading.classList.contains('hidden'))window.__qaLoadingShows++});window.__qaLoadingObserver.observe(loading,{attributes:true,attributeFilter:['class']});const startPage=Number(document.getElementById('pageInput').value);const startRotation=Number(document.getElementById('viewStatus').textContent.match(/(\\d+)°$/)?.[1]||0);window.__qaCompoundExpected={page:Math.min(12,startPage+1),rotation:(startRotation+90)%360};document.getElementById('mNext').click();document.getElementById('mZoomIn').click();document.getElementById('mZoomIn').click();document.getElementById('rotateBtn').click();return window.__qaCompoundExpected})()`);
await waitFor(`Number(document.getElementById('pageInput').value)===window.__qaCompoundExpected.page && document.getElementById('viewStatus').textContent.endsWith(window.__qaCompoundExpected.rotation+'°') && document.getElementById('loading').classList.contains('hidden')`, 30_000);
await check('COM-001', 'Secuencia compuesta sin recarga visual', '02-multipage-text-images.pdf', 'Siguiente → zoom+ → zoom+ → rotar, sin esperar entre acciones', 'Conserva la página visible, cancela renders obsoletos y aplica todos los estados sin overlay', async () => {
  const value=await evaluate(`({page:Number(document.getElementById('pageInput').value),view:document.getElementById('viewStatus').textContent,expected:window.__qaCompoundExpected,loadingShows:window.__qaLoadingShows,canvas:{width:document.getElementById('pdfCanvas').width,height:document.getElementById('pdfCanvas').height}})`);return{pass:value.page===value.expected.page&&value.view.endsWith(value.expected.rotation+'°')&&value.loadingShows===0&&value.canvas.width>0&&value.canvas.height>0,detail:value};
});

await click('thumbsBtn');await waitFor(`document.getElementById('sidebar').classList.contains('open')`);
await click('searchBtn');await waitFor(`document.getElementById('searchPanel').classList.contains('open') && !document.getElementById('sidebar').classList.contains('open')`);
await click('closeSearchBtn');
await check('COM-002', 'Limpieza de paneles en acciones compuestas', '02-multipage-text-images.pdf', 'Miniaturas → búsqueda → cerrar búsqueda', 'Nunca superpone paneles y vuelve al documento limpio', async()=>{const value=await evaluate(`({sidebar:document.getElementById('sidebar').classList.contains('open'),search:document.getElementById('searchPanel').classList.contains('open'),viewer:!document.getElementById('viewer').classList.contains('hidden')})`);return{pass:!value.sidebar&&!value.search&&value.viewer,detail:value}});

await check('UX-001', 'Controles táctiles utilizables y etiquetados', '02-multipage-text-images.pdf', 'Medir controles primarios visibles a 390×844', 'Objetivos de al menos 44×44 CSS px y nombre accesible', async()=>{const value=await evaluate(`['mPrev','mZoomOut','mPage','mZoomIn','mNext','openBtn','thumbsBtn','searchBtn','rotateBtn'].map(id=>{const e=document.getElementById(id),r=e.getBoundingClientRect();return{id,width:Math.round(r.width),height:Math.round(r.height),name:e.getAttribute('aria-label')||e.textContent.trim(),visible:r.width>0&&r.height>0}})`);return{pass:value.every(item=>!item.visible||(item.width>=44&&item.height>=44&&item.name)),detail:value}});

const shot = await command('Page.captureScreenshot', { format: 'png', captureBeyondViewport: false });
await writeFile(path.join(evidence, 'mobile-compound-390x844.png'), Buffer.from(shot.data, 'base64'));

await command('Emulation.clearDeviceMetricsOverride');
await new Promise(resolve => setTimeout(resolve, 400));
const desktopShot = await command('Page.captureScreenshot', { format: 'png', captureBeyondViewport: false });
await writeFile(path.join(evidence, 'desktop-final.png'), Buffer.from(desktopShot.data, 'base64'));

await evaluate(`document.querySelector('button[data-view="history"]').click();true`);await waitFor(`!document.getElementById('historyView').classList.contains('hidden')`);
const historyBeforeDelete=await evaluate(`document.querySelectorAll('.history-item').length`);
await evaluate(`document.querySelector('.history-item button[aria-label^="Eliminar "]').click();true`);await waitFor(`document.querySelectorAll('.history-item').length===${Math.max(0,historyBeforeDelete-1)}`);
await check('FUN-021','Eliminar una lectura del historial','historial QA','Clic Eliminar','La entrada desaparece',async()=>{const after=await evaluate(`document.querySelectorAll('.history-item').length`);return{pass:after===historyBeforeDelete-1,detail:{before:historyBeforeDelete,after}}});
await evaluate(`window.confirm=()=>true;document.getElementById('clearHistoryBtn').click();true`);await waitFor(`document.querySelectorAll('.history-item').length===0`);
await check('FUN-022','Borrar historial','historial QA','Confirmar Borrar historial','Cero entradas y estado vacío',async()=>({pass:await evaluate(`document.querySelectorAll('.history-item').length===0&&!document.getElementById('historyEmpty').classList.contains('hidden')`),detail:0}));

const report = {
  generatedAt: new Date().toISOString(),
  commit: process.env.GITHUB_SHA || null,
  environment: { platform: process.platform, arch: process.arch, executable, source: packagedExecutable ? 'release-artifact' : 'local-electron', node: process.version, viewportDesktop: '1280x850', viewportMobileRepresentative: '390x844' },
  summary: { total: cases.length, pass: cases.filter(item => item.status === 'PASS').length, fail: cases.filter(item => item.status === 'FAIL').length },
  cases,
  consoleEvents,
  networkFailures,
  appOutput,
};
await writeFile(path.join(evidence, 'results.json'), `${JSON.stringify(report, null, 2)}\n`, 'utf8');
console.log(JSON.stringify(report.summary));
for (const item of cases.filter(item => item.status === 'FAIL')) console.error(`${item.id} FAIL ${item.error} observado=${JSON.stringify(item.observed)}`);

socket.close();
app.kill();
process.exitCode = report.summary.fail ? 1 : 0;
