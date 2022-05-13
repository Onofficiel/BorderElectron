// Modules to control application life and create native browser window
const {app, BrowserWindow,Tray,Menu,Notification,ipcMain,MenuItem,session,webContents} = require('electron')
const path = require('path')
var vm=require('node:vm');


/* Plugin VM: For Running Plugins */

/*
TabCache: Caches tab data
*/
var TabCache={};

var PluginVm = {};
ipcMain.on("win-tab-update", function(event,arg){
  // Update TabCache
  if(!TabCache[event.sender.id]){
    TabCache[event.sender.id]={}
  }
  try{
    TabCache[event.sender.id]==JSON.parse(arg)
  }catch(err){null}
});

PluginVm.getTabData=async function(tab,win){
  if(TabCache[win][tab]){
    return TabCache[win][tab];
  }
  else {
    return {}
  }
}
// sudo - browser
var browser={
  setCurrent:function(win,tab){
    if(!TabCache[win][tab]){return}
    BrowserWindow.fromWebContents(webContents.fromId(win)).focus()
    webContents.fromId(win).executeJavaScript("browser.setCurrent("
    +JSON.stringify(tab)+");",true);
  },
  exec: async function (code,win,tab,gest){
    webContents.fromId(win).executeJavaScript(
      `if(document.querySelector('.border-view[data-id="${tab}"]')){document.querySelector('.border-view[data-id="${tab}"]').executeScript(${JSON.stringify(code)},gest||false)}`
    );
  },
  redirect:function(win,tab,src){
    webContents.fromId(win).executeJavaScript(`if(document.querySelector('.border-view[data-id="${tab}"]')){document.querySelector('.border-view[data-id="${tab}"]').src=${JSON.stringify(src)}}`);
  }
}



// The API: fetch a tab by it's id:
PluginVm.TabObjectFromId=function(tabId,allowInfo,raise) {
  var wid=tabId.split(".")[0];var tid=tabId.split(".")[1];
  var tab = {
    id:tabId,
    get closed(){
      if(!TabCache[tabId.split(".")[0]][tabId.split(".")[1]]) {return true} else{
        return false
      }
    },
    focus:function(){browser.setCurrent(tabId.split(".")[0],tabId.split(".")[1])},
    get active() {
      try{
      return Boolean((TabCache[tabId.split(".")[0]][tabId.split(".")[1]])&&(
        TabCache[tabId.split(".")[0]][tabId.split(".")[1]].current
      ))}catch(E){return false}
    },
    inject: async function(injectionOptions) {
      if(!injectionOptions) {
        raise({
        type: "Error",
        message: `Paramater 'injectionOptions' is missing`
      });
        throw new TypeError("Paramater 'injectionOptions' is required");
      }
      if(!injectionOptions.code) {
        raise({
        type: "Error",
        message: `Paramater 'injectionOptions' is missing attribute 'code'`
      });
        throw new TypeError("Property 'code' of 'injectionOptions' is required");
      }
      try{
      return await browser.exec(
        injectionOptions.code,
        wid,tid,false
      );
      }catch(err0r){
        raise({
          type: "Error",
          message: String(err0r)
        });
        throw err0r;
      }
    },
    get title() {
      if(allowInfo) {
        try {
          return TabCache[win][tab].title
        }catch(error) {
          return "Untitled"
        }
      }
      raise({
        type: "Warn",
        message: `Permission 'tabs' is required to access the tab title`
      });
    },
    close:function(){try{browser.removeTab()}catch(er0r){null}},
    get url(){
      try {
        return TabCache[win][tab].url
      }catch(error) {
        return "about:blank"
      }
    },
    set url(val) {
      try {
        browser.redirect(
          wid,tid,
          val
        )
      }catch(error) {
        null
      }
    }
  }
}

browser.addTab=function(data){
  if(webContents.fromId(lastFocusedId)){
    webContents.fromId(lastFocusedId).executeJavaScript(
      `browser.addTab(${JSON.stringify(data)})`
    )
  } else {
    var all=webContents.getAllWebContents()
    all[all.length-1].fromId(lastFocusedId).executeJavaScript(
      `browser.addTab(${JSON.stringify(data)})`
    )
  }
}

browser.registerTheme=function(data){
  if(webContents.fromId(lastFocusedId)){
    webContents.fromId(lastFocusedId).executeJavaScript(
      `browser.registerTheme(${JSON.stringify(data)})`
    )
  } else {
    var all=webContents.getAllWebContents()
    all[all.length-1].fromId(lastFocusedId).executeJavaScript(
      `browser.registerTheme(${JSON.stringify(data)})`
    )
  }
}

// Theme console
PluginVm.Theme=function(lstheme) {
  var thm={
    idx: lstheme.iid,
    author:lstheme.author,
    about:lstheme.about,
    id:lstheme.id,
    isSystem:lstheme.system,
    style:lstheme.style||"",
    name:lstheme.name
  };
  return thm
}


// Create a NodeVM Context
PluginVm.context=function(allows,eid,manf,fs){
  var globe={};
  var consoleLogs=[];
  globe.Audio=function(src){
    // To-do: play a nice sound!
  }
  globe.border = {
    tabs: {
      create:async function(prop) {
        var id=browser.addTab({current:prop.active||false,url:prop.url});
        return PluginVm.TabObjectFromId(id,allows.indexOf('tabs')>-1,function(log){
          consoleLogs.push(log);
        });
      },
      fetch:async function(id){
        if(!id){return null}
        if(!TabsCache[
          id.split(".")[0]
        ][id.split(".")[1]]){return null}
        return PluginVm.TabObjectFromId(id,allows.indexOf('tabs')>-1,function(log){
          consoleLogs.push(log);
        });
      },
      active:async function(){
        return PluginVm.TabObjectFromId(document.querySelector(".current").dataset.id,allows.indexOf('tabs')>-1,function(log){
          consoleLogs.push(log);
        });
      },
      destroy:async function(id){
        var tab=await globe.border.fetch(id);
        if(!tab) {
          throw new TypeError("No tab with id '"+id+"'");
        }
        tab.close();
      }
    }
  }
  globe.border.runtime={
    id:eid
  }
  globe.location = {
    get href(){
      return "plugin://"+eid+"/"
    },
    set href(hrf){
      throw new Error("cannot redirect to "+hrf);
    },
    get search(){
      return ""
    },
    set search(hrf){
      throw new Error("cannot redirect to plugin://"+eid);
    },
    get hostname(){
      return  ""
    },
    set hostname(hrf){
      throw new Error("cannot redirect to plugin://"+eid);
    },
    get pathname(){
      return  eid+"/"
    },
    set pathname(hrf){
      throw new Error("cannot redirect to plugin://"+eid+href);
    },
  }
  globe.border.storage = {
    "set":function(key,value){
      localStorage.setItem("Plugin"+eid+":"+key,value);
    },
    "get":function(key){
      return localStorage.getItem("Plugin"+eid+":"+key);
    },
    rm:function(key){
      return localStorage.removeItem("Plugin"+eid+":"+key);
    },
    keys:function(){
      var len=localStorage.length;
      var keys=[];
      for(var i=0;i<len;i++){
        if(localStorage.key(i).indexOf("Plugin"+eid+":")==0){
          keys.push(localStorage.key(i).slice(("Plugin"+eid+":").length))
        }
      }
      return keys
    },
    purge:function(){
      for(var i=0;i<this.keys().length;i++){
        localStorage.removeItem("Plugin"+eid+":"+this.keys()[i]);
      }
    }
  }
  if(allows.indexOf("themes")>-1) {
    globe.border.themes={
      all: async function () {
        var thm;
        var themes=[];
        try{
          thm=JSON.parse(localStorage.getItem('my-themes'));
        }catch(error){
          thm=[];
        }
        themes.push(
          PluginVm.Theme(
            {
              iid:0,
              id:"BorderDefaultTheme",
              system:true,
              author:"Border",
              about:"The default theme for border.",
              style:defaultTheme
            }
          )
        );
        for(var i=0;i<thm.length;i++) {
          if(!thm[i].null){
            themes.push(PluginVm.Theme(thm[i]));
          }
        }
        return themes
      },
      create: async function(thm) {
        if(!thm){throw new TypeError("Paramater 'themeOptions' is required")}
        if(!thm.name){throw new TypeError("property 'name' of 'themeOptions' is required")}
        if(!thm.id){throw new TypeError("property 'id' of 'themeOptions' is required")}
        if(!thm.css){throw new TypeError("property 'css' of 'themeOptions' is required")}
        browser.registerTheme(
          {
            name:thm.name,
            id:thm.id,
            author:thm.author||"plugin://"+eid,
            about:thm.about||"",
            system:false,
            plugin:true,
            pluginId:eid,
            style:thm.css
          }
        );
      }
    }
  } else {
    globe.border.themes={
      create: async function(thm) {
        consoleLogs.push(
          {
            type:"Warn",
            message:"Permission 'themes' is required to create themes."
          }
        )
      },
      all: async function() {
        consoleLogs.push(
          {
            type:"Warn",
            message:"Permission 'themes' is required to create themes."
          }
        );
        return []
      },
    }
  }
  globe.window=globe;
  globe.globalThis=globe;
  globe.top=globe;
  globe.parent=globe;
  globe.close=function(){}
  var context=vm.createContext(globe);
  return {
    rawGlobe:globe,
    vm:context,
    logs:consoleLogs
  }
}

PluginVm.run=function(manifest,src,id,fs) {
  var vmdata=PluginVm.context(
    manifest.permissions||[],id,manifest,fs
  );
  var script=new vm.Script(src)
  return script.runInContext(vmdata.vm);
}








var lastFocusedId=0;
var HtmAudio=require('./html5audio.js').Audio
let tray;
ipcMain.on('maximize',function(){
  var win=BrowserWindow.getFocusedWindow();
  if(win.isMaximized()){
    win.unmaximize()
    win.focus()
    return
  }
  win.maximize();
  win.focus()
})

ipcMain.on('minimize',function(){
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

// This method will be called when Electron has finished
// initialization and is ready to create browser windows.
// Some APIs can only be used after this event occurs.
app.whenReady().then(() => {
  session.fromPartition("persist:BorderProfile-Profile1").protocol.registerFileProtocol('border', (request, callback) => {
    const url = request.url.substr(7)
    callback({ path: path.normalize(`${__dirname}/404.html`) })
  });
  session.fromPartition("persist:BorderPrivateBrowsing-Profile1").protocol.registerFileProtocol('border', (request, callback) => {
    const url = request.url.substr(7)
    callback({ path: path.normalize(`${__dirname}/404.html`) })
  });
  createWindow()
  setTimeout(function(){
    PluginVm.run(
      {
        'name':"Test",
        version:2.0,
        permissions:['tabs'],
        worker:''
      },
      'border.tabs.create('
    )
  })
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
