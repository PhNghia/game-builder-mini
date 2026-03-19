const { app, BrowserWindow, ipcMain, dialog, protocol, session } = require('electron')
const path = require('path')
const fs = require('fs')
const os = require('os')
const AdmZip = require('adm-zip')
require('dotenv').config()
const gameController = require('./controllers/game.controller')
const { downloadFile } = require('./services/build.service')
require('./dbs/init.mongodb')


// Tạo window
function createWindow() {
  const win = new BrowserWindow({
    width: 1200,
    height: 800,
    webPreferences: {
      preload: path.join(__dirname, 'preload.js'),
      nodeIntegration: false,
      contextIsolation: true,
      // webSecurity: false,
      // allowRunningInsecureContent: true
    }
  })
  console.log(process.env.NODE_ENV)
  if (process.env.NODE_ENV === 'dev') {
    win.loadURL('http://localhost:5173/') // Dev mode
  } else {
    win.loadFile(path.join(__dirname, 'renderer/dist/index.html')) // Prod mode
  }
}
let gameWindow = null

ipcMain.on('open-game', (event, htmlContent) => {
  if (gameWindow) {
    gameWindow.focus()
    return
  }
  const tmpPath = path.join(os.tmpdir(), 'game.html')
  fs.writeFileSync(tmpPath, htmlContent, 'utf-8')
  gameWindow = new BrowserWindow({
    frame: true,
    webPreferences: {
      contextIsolation: true,
      nodeIntegration: false
    }
  })
  gameWindow.maximize();
  // const dataUrl = 'data:text/html;charset=utf-8,' + encodeURIComponent(htmlContent)
  // gameWindow.load(dataUrl) => rất lâu mới đóng window
  console.log("load file")
  gameWindow.loadFile(tmpPath)
  gameWindow.on('closed', () => {
    try {
      fs.unlinkSync(tmpPath)
    } catch (e) { }
    gameWindow = null
  })
})

ipcMain.handle('get-all-games', async () => {
  return await gameController.getAllGames()
})

ipcMain.handle('get-game-by-id', async (event, id) => {
  return await gameController.getGameById(id)
})

ipcMain.handle('create-game', async (event, payload) => {
  return await gameController.createGame(payload)
})

ipcMain.handle('export-game', async (event, id) => {
  const zipPath = await gameController.exportGame(id)
  downloadFile(zipPath)
  // return await gameController.exportGame(id)
})

ipcMain.handle('dialog:open-file', async () => {
  const { canceled, filePaths } = await dialog.showOpenDialog({
    properties: ['openFile'],
    filters: [
      { name: 'Images', extensions: ['png', 'jpg', 'jpeg', 'svg'] }
    ]
  })

  if (canceled) return null

  return filePaths[0] // trả về path file
})

app.whenReady().then(() => {
  protocol.registerFileProtocol('app-file', (request, callback) => {
    const filePath = request.url.replace('app-file://', '')
    callback(decodeURI(filePath))
  })
  session.defaultSession.on("will-download", (event, item) => {
    const savePath = path.join(
      app.getPath("downloads"),
      item.getFilename()
    );

    item.setSavePath(savePath);

    item.on("done", (event, state) => {
      if (state === "completed") {
        console.log("Download completed:", savePath);
      } else {
        console.log("Download failed");
      }
    });
  });
  createWindow()
})

