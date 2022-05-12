var vm=require("node:vm");

var PluginVm = {};

// The API: fetch a tab by it's id:
PluginVm.TabObjectFromId=function(tabId,allowInfo,raise) {
  var tab = {
    id:tabId,
    get closed(){
      if(!document.querySelector('.border-tab[data-id~="'+tabId+'"]')) {return true} else{
        return false
      }
    },
    focus:function(){browser.setCurrent(this.id)},
    get active() {
      var self=document.querySelector('.border-tab.current[data-id~="'+tabId+'"]');
      if(self){
        return true
      }
      return false
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
      return await document.querySelector('.border-view[data-id~="'+tabId+'"]').executeJavaScript(
        injectionOptions.code
      );
      }catch(err0r){
        raise({
          type: "Error",
          message: String(err0r);
        });
        throw err0r;
      }
    },
    get title() {
      if(allowInfo) {
        try {
          return document.querySelector('.border-view[data-id~="'+tabId+'"]').getTitle();
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
        return document.querySelector('.border-view[data-id~="'+tabId+'"]').src;
      }catch(error) {
        return "about:blank"
      }
    },
  }
}

// Create a NodeVM Context
PluginVm.context=function(allows,eid,manf){
  var globe={};
  var consoleLogs=[];
  globe.border = {
    tabs: {
      create:async function(prop) {
        var id=browser.addTab({current:prop.active||false,url:prop.url});
        return PluginVm.TabObjectFromId(id,allows.indexOf('tabs')>-1,function(log){
          consoleLogs.push(log);
        });
      }
    }
  }
  var context=vm.createContext(globe);
  return {
    rawGlobe:globe,
    vm:context,
    logs:consoleLogs
  }
}
