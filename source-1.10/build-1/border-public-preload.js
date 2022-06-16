addEventListener('load',()=>{
  var {ipcRenderer}=require('electron')
  async function handleThemeDownloads(f) {
  var themes=await (await fetch("https://onofficiel.github.io/border/src/data/themes.json")).json()
  var thmel=document.querySelectorAll('.tile .download')
  for(var i=0;i<thmel.length;i++) {
    (((elem,theme)=>{
      elem.onclick=function(event) {
        event.preventDefault()
        f({
          version:theme.version,
          name:theme.name,
          author:theme.author,
          description:theme.description,
          url:theme.url,
          image:theme.image
        })
      }
    })(thmel[i],themes[i]))
  }
}
  if(location.href=="https://onofficiel.github.io/border/themes"||location.href=="https://onofficiel.github.io/border/themes/") {
    handleThemeDownloads((theme)=>{
      ipcRenderer.sendToHost(
        "theme-install",
        {
          themeData: {
            name: String(theme.name),
            description:String(theme.description),
            version:(theme.version),
            author:String(theme.author),
            image:theme.image,
            contentURL:theme.url,
            thumbnailURL:theme.image,
            installPoint:'theme-store'
          },
          themeName: String(theme.name||"<Unnamed Theme>"),
        }
      )
    })
  }
})
