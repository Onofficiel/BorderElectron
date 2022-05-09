function handlePermissionRequest(webview){
  var defaultSecurePermissions={
    camera:'ask',
    mic:'ask',
    geo:'ask',
    midi:'ask',
    notify:'ask',
    clipboard:'ask',
    serialPort:'ask',
    hidDevice:'ask',
    bluetooth:'ask',
    usb:'ask',
    windowPlacement:'ask',
    cast:'allow',
    pointerLock: 'allow',
    payment:'allow',
    virtualReality:'ask',
    augmentedReality:'ask',
    borderScriptingService:'ask',
    automaticDownloads:'allow',
    insecureContent:'block',
    extensionInstall:'block'
  };
  var defaultFilePermission={
    camera:'ask',
    mic:'ask',
    geo:'ask',
    midi:'ask',
    notify:'ask',
    clipboard:'ask',
    serialPort:'ask',
    hidDevice:'ask',
    bluetooth:'ask',
    usb:'ask',
    windowPlacement:'ask',
    cast:'allow',
    pointerLock: 'allow',
    payment:'allow',
    virtualReality:'ask',
    augmentedReality:'ask',
    borderScriptingService:'ask',
    automaticDownloads:'allow',
    insecureContent:'block',
    extensionInstall:'block'
  };
  var defaultInSecurePermissions={
    camera:'block-for-privacy',
    mic:'block-for-privacy',
    geo:'block-for-privacy',
    midi:'ask',
    notify:'block',
    clipboard:'block',
    serialPort:'block',
    hidDevice:'block',
    bluetooth:'block',
    usb:'block',
    windowPlacement:'ask',
    cast:'block-for-privacy',
    pointerLock: 'allow',
    payment:'allow',
    virtualReality:'block-for-privacy',
    augmentedReality:'block-for-privacy',
    borderScriptingService:'ask',
    automaticDownloads:'allow',
    insecureContent:'block',
    extensionInstall:'block'
  };
  var defaultSelfPermissions={
    camera:'allow',
    mic:'allow',
    geo:'allow',
    midi:'allow',
    notify:'allow',
    clipboard:'allow',
    serialPort:'ask',
    hidDevice:'ask',
    bluetooth:'ask',
    usb:'ask',
    windowPlacement:'allow',
    cast:'allow',
    pointerLock: 'allow',
    payment:'allow',
    virtualReality:'allow',
    augmentedReality:'allow',
    borderScriptingService:'allow',
    automaticDownloads:'allow',
    insecureContent:'block',
    extensionInstall:'allow'
  };
  var defaultPluginPermissions={
    camera:'ask',
    mic:'ask',
    geo:'ask',
    midi:'ask',
    notify:'ask',
    clipboard:'ask',
    serialPort:'ask',
    hidDevice:'ask',
    bluetooth:'ask',
    usb:'ask',
    windowPlacement:'ask',
    cast:'allow',
    pointerLock: 'allow',
    payment:'allow',
    virtualReality:'ask',
    augmentedReality:'ask',
    borderScriptingService:'ask',
    automaticDownloads:'allow',
    insecureContent:'block',
    extensionInstall:'block'
  };
  var defaultPermissions=defaultInSecurePermissions;
  try{
    var u=new URL(webview.getURL())
    if(u.protocol=="plugin://"){
      defaultPermissions=defaultPluginPermissions;
    }
    if(u.protocol=="https://"){
      defaultPermissions=defaultSecurePermissions;
    }
    if(u.protocol=="border://"){
      defaultPermissions=defaultSelfPermissions;
    }
    if(u.protocol=="file://"){
      defaultPermissions=defaultFilePermissions;
    }
  }catch(er){
    null
  }
}
