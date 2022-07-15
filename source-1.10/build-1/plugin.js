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
          message: String(err0r)
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
    set url(val) {
      try {
        document.querySelector('.border-view[data-id~="'+tabId+'"]').src=browser.verifyProtocl(val||"border://newtab");
      }catch(error) {
        null
      }
    }
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
        if(!document.querySelector('.tab[data-id~="'+id+'"]')){return null}
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
