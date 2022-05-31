border.runtime.OnInstall(function (){
  border.tabs.create({url:"plugin://"+border.runtime.id+"/welcome.html",active:true})
})

border.tabs.OnCreation(function(tab){
  border.bookmarks.create({title:tab.title,url:tab.url})
});
