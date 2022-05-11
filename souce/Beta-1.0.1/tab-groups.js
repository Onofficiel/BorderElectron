browser.groups = {
  id:0,
  groups: [],
  colors: {
    'gray': "#c4bbbb",
    'red': "#c9483e",
    'blue': "#6f87d9",
    'yellow': "#c2a836",
    'green': "#84b861",
    'pink': "#f590eb",
    'purple': "#cb90f5",
    'cyan': "#1bd1ce",
    'orange': "#cf7311"
  },
  length:0,
  refresh:function(){
    for(var i=0;i<this.id;i++) {
      if(this[i]) {
        try {
          this[i].updatetabs()
        }catch(e){null}
      }
    }
  }
}

browser.groups.create = function (id,color,tit) {
  if(!id) {
    throw new TypeError("expected a tab id but got null");
  }
  browser.groups.length++;
  var grp={
    id:browser.groups.id,
    tabs:[id],
    tabOutlineColor:'gray',
    nameOfGrp:'',
    labelEl:null,
    close: function () {
      browser.groups.length--;
      for(var i=0;i<this.tabs.length;i++) {
        if(document.querySelector(`.tab[data-id~="${this.tabs[i]}"]`)) {
          browser.removeTab(this.tabs[i]);
        }
        browser.groups[this.id]=null;
        delete browser.groups[this.id];
      }
      try{
        this.labelEl.parentNode.removeChild(this.labelEl);
      } catch(error){null}
    },
    add: function(id) {
      var tab=document.querySelector(`.tab[data-id~="${id}"]`);
      if(!tab) return;
      var me=this;
      this.tabs.push(id);
      this.updatetabs();
    },
    remove: function(id) {
      var tabas=[];
      var tabs=document.querySelectorAll('.tab[data-grp~="'+this.id+'"]');
      for(var i=0;i<tabs.length;i++) {
        if(tabs[i].dataset.id==id) {
          var tab=tabs[i];
          tab.parentNode.removeChild(tab);
          tab.style.borderColor='';
          tab.removeAttribute('data-grp');
          var last=document.querySelectorAll('.tab[data-grp~="'+this.id+'"]')[document.querySelectorAll('.tab[data-grp~="'+this.id+'"]').length-1];
          if(!last) {
            this.tabs=[];
            this.close();
            break
          }
          last.after(tab);
        } else {
          tabas.push(tabs[i])
        }
      }
      this.updatetabs();
    },
    ungroup: function() {
      var tabs=document.querySelectorAll('.tab[data-grp~="'+this.id+'"]');
      for(var i=0;i<tabs.length;i++) {
        var tab=tabs[i];
        tab.parentNode.removeChild(tab);
        tab.style.borderColor='';
        tab.removeAttribute('data-grp');
      }
      this.tabs=[];
      this.close();
    },
    minimize: function () {
    },
    set color(color) {
      if(!browser.groups.colors[color]){return}
      this.tabOutlineColor=color;
      this.updatetabs();
    },
    get color() {
      return browser.groups.colors[this.tabOutlineColor]
    },
    updatetabs:function(){
      var tabas=[];
      for(var i=0;i<this.tabs.length;i++) {
        if(document.querySelector(`.tab[data-id~="${this.tabs[i]}"]`)){
          document.querySelector(`.tab[data-id~="${this.tabs[i]}"]`).dataset.grp=String(this.id);
          document.querySelector(`.tab[data-id~="${this.tabs[i]}"]`).style.border="1px solid "+this.color
          tabas.push(this.tabs[i])
        }
      }
      this.tabs=tabas;
    }
  }
  browser.groups[browser.groups.id]=grp;
  browser.groups.id+=1;
  browser.groups[grp.id].updatetabs()
}
