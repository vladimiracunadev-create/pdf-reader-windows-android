const { app, BrowserWindow, dialog, ipcMain } = require('electron');
const path = require('node:path');
const fs = require('node:fs/promises');
let mainWindow;
let startupPath = process.argv.find((arg, index) => index > 0 && typeof arg === 'string' && arg.toLowerCase().endsWith('.pdf')) || null;

async function readPdf(pdfPath) {
  try {
    if (!pdfPath || path.extname(pdfPath).toLowerCase() !== '.pdf') return { error: 'La ruta seleccionada no corresponde a un PDF.' };
    const stat = await fs.stat(pdfPath);
    const data = await fs.readFile(pdfPath);
    return { path: pdfPath, name: path.basename(pdfPath), size: stat.size, lastModified: stat.mtimeMs, data };
  } catch { return { error: 'El archivo ya no está disponible o no se pudo leer.' }; }
}
function createWindow(){
  mainWindow = new BrowserWindow({width:1280,height:850,minWidth:720,minHeight:560,backgroundColor:'#101827',show:false,webPreferences:{preload:path.join(__dirname,'preload.cjs'),contextIsolation:true,nodeIntegration:false,sandbox:true}});
  mainWindow.loadFile(path.join(__dirname,'..','dist','index.html'));
  mainWindow.once('ready-to-show',()=>mainWindow.show());
  mainWindow.webContents.setWindowOpenHandler(()=>({action:'deny'}));
}
app.whenReady().then(()=>{
  ipcMain.handle('pdf:pick',async()=>{const result=await dialog.showOpenDialog(mainWindow,{title:'Abrir PDF',properties:['openFile'],filters:[{name:'Documento PDF',extensions:['pdf']}]});if(result.canceled||!result.filePaths[0])return {canceled:true};return readPdf(result.filePaths[0]);});
  ipcMain.handle('pdf:open-path',(_,p)=>readPdf(p));ipcMain.handle('pdf:startup',()=>({path:startupPath}));
  createWindow();app.on('activate',()=>{if(BrowserWindow.getAllWindows().length===0)createWindow()});
});
app.on('open-file',(event,p)=>{event.preventDefault();startupPath=p;if(mainWindow)mainWindow.webContents.send('pdf:external-open',p)});
app.on('second-instance',(_event,argv)=>{const p=argv.find(a=>a.toLowerCase().endsWith('.pdf'));if(p&&mainWindow)mainWindow.webContents.send('pdf:external-open',p);if(mainWindow){if(mainWindow.isMinimized())mainWindow.restore();mainWindow.focus();}});
const gotLock=app.requestSingleInstanceLock();if(!gotLock)app.quit();
app.on('window-all-closed',()=>{if(process.platform!=='darwin')app.quit()});
