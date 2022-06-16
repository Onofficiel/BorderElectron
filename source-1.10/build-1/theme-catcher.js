// can get data of a theme and prevent downloads
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
