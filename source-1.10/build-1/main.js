// Modules to control application life and create native browser window
const {app,dialog, BrowserWindow,Tray,Menu,Notification,ipcMain,MenuItem,session,webContents} = require('electron')
const path = require('path')
var vm=require('node:vm');
const electron=require('electron')
const fs=require('fs')

const os = require("os");

// invoke userInfo() method
const userInfo = os.userInfo();

var LocalStorage = require('node-localstorage').LocalStorage;



var globalStorage=new LocalStorage(
  (function(){
    switch(os.platform()) {
      case 'win32':
        return os.homedir()+"\\AppData\\BORDER_BROWSER\\GlobalStorage"
      case 'darwin':
        return path.normalize(os.homedir()+"/Library/Prefrences/BORDER_BROWSER/GlobalStorage")
      default:
        return path.normalize(os.homedir()+"/.BORDER_BROWSER/GlobalStorage")
    }
  })()
);



















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
  lastOW=mainWindow.webContents.id
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

var lastOW=-1

ipcMain.on('attach-on-open',(event,id)=>{
  var wbc=webContents.fromId(id)
  wbc.setWindowOpenHandler((details)=>{
    var url=new URL(details.url)
    if(url.protocol=="border:"||url.protocol=="file:"||url.protocol=="plugin:") {
      if(
        (new URL(wbc.getURL()).protocol!="border:")&&
        (new URL(wbc.getURL()).protocol!="file:")&&
        (new URL(wbc.getURL()).protocol!="plugin:")
      ) {
        return {action:'deny'}
      }
    }
    event.sender.executeJavaScript(
      'browser.addTab({url:'+JSON.stringify(details.url)+',current:true});window.focus()'
    )
    return {action:'deny'}
  })
})

ipcMain.on('window-focus-public',(event) =>{
  lastOW=event.sender.id
})



var BorderPublicScheme = {
  'newtab': 'newtab.html',
  'woozy': 'woozy.html',
  'fonts/lexend.woff2': 'fonts/lexend.woff2',
  'fonts/lexend-ext.woff2': 'fonts/lexend-ext.woff2',
  'fonts/lexend-vnm.woff2': 'fonts/lexend-vnm.woff2',
  'styles/lexend.css':'styles/lexend.css',
  'woozy/index.png': 'images/woozy.png',
  'settings': 'settings.html',
  'about':'about.html',
  'urls':'urls.html',
  'themes':'themes.html',
  'settings/content':'content-settings.html'
}

// This method will be called when Electron has finished
// initialization and is ready to create browser windows.
// Some APIs can only be used after this event occurs.
app.whenReady().then(() => {
  var public=session.fromPartition("persist:BorderProfile-Profile1")
  session.fromPartition("persist:MainBorderPartition").setUserAgent((function(){
    switch (os.platform()) {
      case 'darwin':
        return 'MacOS/X'
      case 'freebsd':
        return 'FreeBSD/1'
      case 'win32':
        var revision=os.release().split(".")[0]
        var subrev=os.release().split(".")[1]
        var buildnumber=os.release().split(".")[2]
        if(revision=="10") {
          if(Number(buildnumber)>=22000) {
            return 'Windows/11'
          }
          return 'Windows/10'
        } else if(revision=="6") {
          if(subrev=="3") {
            return 'Windows/8.1'
          } else if(subrev=="2") {
            return 'Windows/8'
          } else if(subrev=="1") {
            return 'Windows/7'
          } else if(subrev=="0") {
            return "Windows/Vista"
          }
        } else if(revision=="5") {
          if(subrev=="0") {
            return 'Windows/2000'
          } else if(subrev=='3') {
            return 'Windows/Server2003'
          } else {
            return 'Windows/XP'
          }
        }
      case 'linux':
        if(os.version().includes("Ubuntu")) {
          return 'Ubuntu/x64'
        }
        if(os.version().includes("Raspbian")||os.version().includes("Raspberry Pi OS")) {
          return 'RaspberryPi/x86'
        }
        if(os.version().includes("Chromium OS")) {
          return 'Chromium/x64'
        }
        if(os.version().includes("Gentoo")) {
          return 'Gentoo/x64'
        }
        if(os.version().includes("Tizen")) {
          return 'Tizen/x86'
        }
        if(os.version().includes('Manjaro')) {
          return 'ManjaroKDE/x64'
        }
        if(os.version().includes("Debian")) {
          return 'Debian/x64'
        }
      default:
        return 'Linux/x86'
    }
  })())
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
  public.setPermissionRequestHandler(function(contents,permission,callback,details) {
    contents.executeJavaScriptInIsolatedWorld(
      999,
      [
        {
          code: `requestPermission(
            {
              origin: location.origin || "about:blank",
              path: location.href,
              webContentsID: ${contents.id},
              permission: ${JSON.stringify(
                (function(){
                  switch(permission) {
                    case "media":
                      if(details.mediaTypes.includes("audio")) {
                        if(details.mediaTypes.includes("video")) {
                          return 'cammic'
                        }
                        return 'microphone'
                      }
                      return 'camera'
                    case 'midiSysex':
                      return 'midi'
                    default:
                      return permission
                  }
                })()
              )},
              camera: ${details.mediaTypes?details.mediaTypes.includes("video"):false},
              microphone: ${details.mediaTypes?details.mediaTypes.includes("audio"):false},
              text: ${
                JSON.stringify(
                  (function() {
                    switch (permission) {
                      case "mediaKeySystem":
                        return "play DRM-encrypted media?"
                      case "clipboard-read":
                        return "read your clipboard?"
                      case "notifications":
                        return "send you notifications?"
                      case "geolocation":
                        return "access your location?"
                      case 'midiSysex':
                        return 'have full control over your MIDI devices?'
                      case 'midi':
                        return "access your MIDI devices?"
                      case "media":
                        if(details.mediaTypes.includes("audio")) {
                          if(details.mediaTypes.includes("video")) {
                            return "access your camera and microphone?"
                          } else {
                            return "access your microphone?"
                          }
                        } else {
                          return "access your camera?"
                        }
                      case "pointerLock":
                        return "lock your mouse pointer?"
                      case "fullscreen":
                        return "display in fullscreen?"
                      default:
                        return `access your ${permission}?`
                    }
                  })()
                )
              }
            }
          )`
        }
      ]
    ).then((value)=>{
      callback(value?true:false);
    }).catch((error)=>{
      callback(false)
    })
  })
  /*public.setPermissionCheckHandler(function(){
    return false
  })*/
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
