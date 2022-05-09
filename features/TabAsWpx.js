// a simulated browserWindow, to set `newGuest` to
class BrowserTab {
  constructor(contents,tabId,bwo,pwc,win){
    this.BorderWinOp=bwo;
    this.id=win.id;
    this.autoHideMenuBar=false
    this.simpleFullScreen=false
    this.fullScreen=false
    this.focusable=true
    this.visibleOnAllWorkspaces=false
    this.shadow=false
    this.menuBarVisible=true
    this.documentEdited=false
    this.representedFilename=""
    this.title=(bwo||{}).title||"Electron"
    this.minimizable=false
    this.maximizable=false
    this.fullScreenable=true
    this.resizable=false
    this.moveable=false
    this.closeable=true
    this.excludedFromShownWindowsMenu=false
    this.accessibleTitle="Border Tab Instance kE";
    this.BorderInternalTabId=tabId;
    this.BDR_TAB_ID=tabId;
    this.webContents=contents;
    this.parcon=pwc;
    this.WINWIN=win
    this.domEditedBDR=false;
    this.kiosk=(bwo||{}).kiosk||false
  }
  setMenu(){/*nullitout*/}
  setFocusable() {
    // Border tabs are always focasable
  }
  setClosable(){return false}
  setMovable(){null}
  setResizable(){null}
  getMovable(){return false}
  getResizable(){return false}
  setMaximizable(){null}
  getMaximizable(){return false}
  setMinimizable(){null}
  getMinimizable(){return false}
  setCloseable(){null}
  getCloseable(){return false}
  isFullScreenable(){return true}
  setFullScreenable(){null}
  getContentSize(){return [0,0]}
  setContentSize(){null}
  getMaximumSize(){return [0,0]}
  setMaximumSize(){null}
  getMinimumSize(){return [0,0]}
  setManimumSize(){null}
  getSize(){return [0,0]}
  setSize(){null}
  setEnabled(){null}
  isEnabled(){return true}
  getContentBounds(){return {x:0,y:0,width:0,height:0}}
  setContentBounds(){null}
  closeFilePreview(){}
  previewFile(){}
  setBackgroundColor(color){
    this.parcon.send(
      "Border.Views.StyleBackGround",
      String(color)+":"+this.BorderInternalTabId
    )
  }
  setAspectRatio(){}
  isFullScreen(){return false}
  setFullScreen(){return false}
  isSimpleFullScreen(){return false}
  setSimpleFullScreen(){return false}
  isMinimized(){return false}
  isMaximized(){return false}
  setMaximized(){}
  setMinimized(){}
  restore(){}
  unmaximize(){}
  isModal(){return false}
  isVisible(){return true}
  hide(){}
  isDestroyed(){return false}
  isFocused(){return true}
  blur(){}
  close(){this.parcon.send("Border.Tabs.Quit",this.BorderInternalTabId)}
  destroy(){this.parcon.send("Border.Tabs.Quit",this.BorderInternalTabId)}
  show(){this.parcon.send("Border.Tabs.Current",this.BorderInternalTabId);}
  showInactive(){this.parcon.send("Border.Tabs.CurrentAndInactive",this.BorderInternalTabId);}
  getNormalBounds(){return {x:0,y:0,width:0,height:0}}
  moveTop(){
    console.warn("TabAsWpx.moveTop is deprecated, use TabAsWpx.focus")
    this.parcon.send("Border.Tabs.ZindexOver",this.BorderInternalTabId);
  }
  focus(){this.parcon.send("Border.Tabs.Current",this.BorderInternalTabId);}
  isFocusable(){return true}
  setTrafficLightPosition(){/* tabs don't have traffic lights*/}
  getTrafficLightPosition(){return {x:-9999,y:-9999}}
  setTouchBar(){/* do nothing when touchBar is set */}
  setBrowserView(){/* no browser view in border, null it out */}
  removeBrowserView(){/* no browser view in border, null it out */}
  setTopBrowserView(){/* no browser view in border, null it out */}
  getBrowserViews(){/* no browser view in border, null it out */}
  getBrowserView(){/* no browser view in border, null it out */}
  setTitleBarOverlay(){/* no browser view in border, null it out */}
  setVibrancy(){/* no vibrancy */}
  mergeAllWIndows(){/* null it out */}
  toggleTabBar(){/* null it out */}
  addTabbedWindow(){/* null it out */}
  setAutoHideCursor(){/* null it out */}
  moveTabToNewWindow() {
    /* NOT IMPLEMENTED!! */
  }
  selectNextTab() {
    /* NOT IMPLEMENTED!! */
  }
  selectPreviousTab() {
    /* NOT IMPLEMENTED!! */
  }
  setParentWindow(){/* null it out */}
  getParentWindow(){return null}
  setSkipTaskbar(){/*nullitout*/}
  getPosition(){return [0,0]}
  setPosition(x,y,a){/*nullitout*/}
  center(){/*nullitout*/}
  flashFrame(flg){/* to do: flash the tab ??? */}
  setTitle(title){/* you cant do dat */}
  getTitle(){return this.webContents.getTitle()}
  getChildWindows(){return []}
  setSheetOffset(){/* nul it out */}
  setContentProtection(){/* null it out */}
  setIgnoreMouseEvents(ignore,options){
    this.parcon.send(
      "Border.Tabs.PreventClicking."+(ignore ? "On" : "Off"),
      this.BorderInternalTabId
    );
  }
  isMenuBarVisible(){
    /* displaying as tab, so menubar is visible */
    return true
  }
  isMenuBarAutoHide(){
    return false
  }
  showDefinitionForSelection(){/*nullitout*/}
  setAppDetails(){/*nullitout*/}
  setThumbnailClip(){/*nullitout*/}
  loadFile(filePath,options){return this.webContents.loadFile(filePath,options)}
  loadURL(url,options){return this.webContents.loadURL(url,options)}
  loadURL(url,options){return this.webContents.loadURL(url,options)}
  reload(){return this.webContents.reload()}
  setThumbnailToolTip(){/*nullitout*/}
  setDocumentEdited(e){this.domEditedBDR=e}
  isDocumentEdited(){return this.domEditedBDR}
  setThumbnailClip(){/*nullitout*/}
  setThumbbarButtons(){/*nullitout*/}
  setShape(){/*nullitout*/}
  setThumbnailClip(){/*nullitout*/}
  getOpacity(){return 1}
  setOpacity(){/*nullitout*/}
  setHasShadow(){/*nullitout*/}
  setOverlayIcon(){/*nullitout*/}
  setProgressBar(){/*nullitout*/}
  removeMenu(){/*nullitout*/}
  unhookAllWindowMessages(){/*nullitout*/}
  unhookWindowMessage(){/*nullitout*/}
  hookWindowMessage(){/*nullitout*/}
  getNativeWindowHandle(){return this.WINWIN.getNativeWindowHandle()}
  getMediaSourceId(){return this.WINWIN.getMediaSourceId()}
  isTabletMode(){return this.WINWIN.isTabletMode()}
  isKiosk(){return this.kiosk}
  setKiosk(flag){this.kiosk=flag;}
  isWindowMessageHooked(){return false}
  setRepresentedFileName(){/*nullitout*/}
  getRepresentedFileName(){/*nullitout*/}
  capturePage(rec){return this.webContents.capturePage(rect)}
  hasShadow(){return false}
  setWindowButtonVisibility(visible){
    // Border == macOS - jk
    this.parcon.send(
      "Border.Tabs.HideCloseButton."+(visible ? "On" : "Off"),
      this.BorderInternalTabId
    );
  }
  setIcon(){/* null it out */}
  setAutoHideMenuBar(){/* null it out */}
  setMenuBarVisibility(){/* do nothing, you can't turn tabs into windows and vice versa */}
  isVisibleOnAllWorkspaces(){return false}
  setVisibleOnAllWorkspaces(){/* null it out */}
}
