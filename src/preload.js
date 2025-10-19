// See the Electron documentation for details on how to use preload scripts:
// https://www.electronjs.org/docs/latest/tutorial/process-model#preload-scripts

const { contextBridge, ipcRenderer } = require('electron');

contextBridge.exposeInMainWorld('electronAPI', {
  getSources: () => ipcRenderer.invoke('get-sources'),
  showMenu: (template) => ipcRenderer.invoke('show-menu', template),
  onMenuItemClicked: (callback) => ipcRenderer.on('menu-item-clicked', (event, label) => callback(label))
});


