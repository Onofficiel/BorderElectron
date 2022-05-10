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
  }
}

browser.groups.create = function (id,color,tit) {
  if(!id) {
    throw new TypeError("expected a tab id but got null");
  }
  var grp={
    id:browser.groups.id,
    tabs:[id],
    tabOutlineColor:'gray',
    nameOfGrp:'',
    labelEl:null,
    close: function () {
      for(var i=0;i<this.tabs.length;i++) {
        if(document.querySelector(`.tab[data-id~="${this.tabs[i]}"]`)) {
          browser.removeTab(this.tabs[i]);
        }
        browser.groups[this.id]=null;
        delete browser.groups[this.id];
      }
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
      for(var i=0;i<this.tabs.length;i++) {
        if(document.querySelector(`.tab[data-id~="${this.tabs[i]}"]`)){
          document.querySelector(`.tab[data-id~="${this.tabs[i]}"]`).dataset.grp=String(this.id);
          document.querySelector(`.tab[data-id~="${this.tabs[i]}"]`).style.border="1px solid "+this.color
        }
      }
    }
  }
  browser.groups[browser.groups.id]=grp;
  browser.groups.id+=1;
  browser.groups[grp.id].updatetabs()
}
