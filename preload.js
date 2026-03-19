const { contextBridge, ipcRenderer } = require('electron')

contextBridge.exposeInMainWorld('electron', {
  send: (channel, data) => ipcRenderer.send(channel, data),
  on: (channel, func) => ipcRenderer.on(channel, (event, ...args) => func(...args)),
  openGame: (html) => ipcRenderer.send('open-game', html),
  getAllGames: () => ipcRenderer.invoke('get-all-games'),
  getGameById: (id) => ipcRenderer.invoke('get-game-by-id', id),
  createGame: (payload) => ipcRenderer.invoke('create-game', payload),
  openFile: () => ipcRenderer.invoke('dialog:open-file'),
  exportGame: (id) => ipcRenderer.invoke('export-game', id)
})