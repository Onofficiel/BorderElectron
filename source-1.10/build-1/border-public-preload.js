addEventListener('load',()=>{
  var {ipcRenderer,contextBridge}=require('electron')
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

  if(location.protocol=='border:') {
    var themes=[]
    var ColorOne="#4e2493"
    var ColorTwo="#ffe5fb"
    ipcRenderer.on("user-colors", (evt,...args)=>{
      var data=args[0]
      ColorOne=data.primary
      ColorTwo=data.secondary
      setTimeout(()=>ipcRenderer.sendToHost('get-color-scheme'),500)
    })
    ipcRenderer.sendToHost('get-color-scheme')
    contextBridge.exposeInMainWorld("border",{
      themes: {
        primary:(hex)=>{
          if(hex) {
            ColorOne=hex
            ipcRenderer.sendToHost('set-scheme-primary',hex)
          }
          return ColorOne
        },
        secondary:(hex)=>{
          if(hex) {
            ColorTwo=hex
            ipcRenderer.sendToHost('set-scheme-secondary',hex)
          }
          return ColorTwo
        },
        getCurrent:()=>{
          return new Promise((yes,no)=>{
            ipcRenderer.sendToHost('get-theme-id')
            ipcRenderer.once('themeid',(event,id)=>yes(id==="border.default"?0:Number(id)+1))
          })
        },
        setCurrent:(id)=>{
          if(id==0) {
            ipcRenderer.sendToHost('set-theme-id','border.default')
          } else {
            ipcRenderer.sendToHost('set-theme-id',id-1)
          }
        },
        uninstall:(id)=>{
          if(id==0) {
            ipcRenderer.sendToHost('rm-theme','border.default')
          } else {
            ipcRenderer.sendToHost('rm-theme',id-1)
          }
        },
        list:()=>{
          return new Promise((yes,no)=>{
            ipcRenderer.sendToHost('get-themes')
            ipcRenderer.once('theme-list',(evt,...args)=>{
              themes=args[0]
              themes.unshift(
                {
                  name:'Border Default',
                  system:true,
                  version: 1.10,
                  author: 'Border',
                  description: 'The default theme for border.'
                }
              )
              yes(themes)
            })
          })
        }
      },
      tabs:{
        mk:(url)=>ipcRenderer.sendToHost('mktab',url)
      }
    })
  }
})