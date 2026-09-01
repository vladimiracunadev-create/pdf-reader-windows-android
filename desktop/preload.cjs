const { contextBridge, ipcRenderer } = require('electron');
contextBridge.exposeInMainWorld('desktopPdf', {
  pick: () => ipcRenderer.invoke('pdf:pick'),
  openPath: (path) => ipcRenderer.invoke('pdf:open-path', path),
  startup: () => ipcRenderer.invoke('pdf:startup'),
  onExternalOpen: (callback) => ipcRenderer.on('pdf:external-open', (_event, path) => callback(path))
});
