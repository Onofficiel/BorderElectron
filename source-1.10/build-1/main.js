// Modules to control application life and create native browser window
const {app,dialog, BrowserWindow,Tray,Menu,Notification,ipcMain,MenuItem,session,webContents} = require('electron')
const path = require('path')
var vm=require('node:vm');
const { electron } = require('electron');

const fs=require('fs')


var LocalStorage = require('node-localstorage').LocalStorage;

var globalStorage=new LocalStorage("./GlobalStorage");




















var lastFocusedId=0;
var HtmAudio=require('./html5audio.js').Audio
let tray;
ipcMain.on('winmaximize',function(){
  var win=BrowserWindow.getFocusedWindow();
  if(win.isMaximized()){
    win.unmaximize()
    win.focus()
    return
  }
  win.maximize();
  win.focus()
})

ipcMain.on('winminimize',function(){
  var win=BrowserWindow.getFocusedWindow();
  if(win.isMinimized()){
    win.restore()
    win.focus()
    return
  }
  win.minimize();
})
function createWindow () {
  // Create the browser window.
  const mainWindow = new BrowserWindow({
    width: 800,
    height: 600,
    webPreferences: {
      preload: path.join(__dirname, 'preload.js'),
      webviewTag:true,
      contextIsolation:false,
      nodeIntegration:true,
      partition:"persist:MainBorderPartition"
    },
    frame:false,
    icon:'border.png'
  });
  mainWindow.setMinimumSize(400,130)
  mainWindow.on('page-title-updated',function(e,t){
    mainWindow.setTitle(t)
  })
  
  
  //mainWindow.removeMenu()

  // and load the index.html of the app.
  mainWindow.loadFile('index.html')

  // Open the DevTools.
   //mainWindow.webContents.openDevTools()
}


var BorderPublicScheme = {
  'newtab': 'newtab.html',
  'woozy': 'woozy.html',
  'fonts/lexend.woff2': 'fonts/lexend.woff2',
  'fonts/lexend-ext.woff2': 'fonts/lexend-ext.woff2',
  'fonts/lexend-vnm.woff2': 'fonts/lexend-vnm.woff2',
  'styles/lexend.css':'styles/lexend.css',
  'assets/woozy.png': 'images/woozy.png'
}

// This method will be called when Electron has finished
// initialization and is ready to create browser windows.
// Some APIs can only be used after this event occurs.
app.whenReady().then(() => {
  var public=session.fromPartition("persist:BorderProfile-Profile1")
  public.protocol.registerFileProtocol('border', (request, callback) => {
    const url = new URL("https://border/"+request.url.slice(9))
    var page=url.pathname.slice(1)
    if(BorderPublicScheme[page]) {
      return callback({
        path: path.normalize(`${__dirname}/border-scheme/${BorderPublicScheme[page]}`)
      })
    }
    callback({ path: path.normalize(`${__dirname}/404.html`) })
  });
  createWindow()
  // testing plugin
  setTimeout(function(){
    // todo: Run plugins, caus they WORK!
  },6000)
  /*tray = new Tray("border.png");
  tray.setToolTip("Border");
  var trayctx=Menu.buildFromTemplate([
    {type:'normal',label:"New Window",click: async () => {createWindow()}}
  ]);
  tray.setContextMenu(trayctx);
  */

  app.on('activate', function () {
    // On macOS it's common to re-create a window in the app when the
    // dock icon is clicked and there are no other windows open.
    if (BrowserWindow.getAllWindows().length === 0) createWindow()
  })
})

function handlePrint(printWindow) {
return printWindow.webContents.getPrinters();
}

function respondToPrintEvent(){
  // todo
}

ipcMain.handle("context0",function(e,x,y){
  var context=new Menu();
  context.append(new MenuItem({
    type:'normal',
    enabled:true,
    click:function(item,window,event){
      e.sender.send("RIGHTCLICK_NTAB");
    },
    label:'New Tab'
  }));
  context.popup({window:BrowserWindow.getFocusedWindow()})
})

// Quit when all windows are closed, except on macOS. There, it's common
// for applications and their menu bar to stay active until the user quits
// explicitly with Cmd + Q.
app.on('window-all-closed', function () {
  if (process.platform !== 'darwin') app.quit()
})

ipcMain.handle("KillView",function(e,id){
  webContents.fromId(id).forcefullyCrashRenderer()
})

// In this file you can include the rest of your app's specific main process
// code. You can also put them in separate files and require them here.
function parseFeaturesString(features, emit) {
  features = `${features}`
  // split the string by ','
  features.split(/,\s*/).forEach(feature => {
    // expected form is either a key by itself or a key/value pair in the form of
    // 'key=value'
    let [key, value] = feature.split(/\s*=/)
    if (!key) return

    // interpret the value as a boolean, if possible
    value =
      value === "yes" || value === "1"
        ? true
        : value === "no" || value === "0"
          ? false
          : value

    // emit the parsed pair
    emit(key, value)
  })
}
