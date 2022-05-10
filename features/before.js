function customHandler(g,f) {
  var button=document.createElement("button");
  var id="@BORDER_INTERNAL_BUTTON_HANDLER_"+(Math.floor(Math.random()*10000))+":"+g;
  button.onclick=f;
  document.head.appendChild(button);
  var script=document.createElement("script");
  script.id="@ScriptOf:"+id;
  script.innerText=`
  (function(){
  var b=document.getElementById(${JSON.stringify(id)});
  var id=b.id;
  document.getElementById("@ScriptOf:"+id).parentNode.removeChild(document.getElementById("@ScriptOf:"+id));
  ${g}=function(...args) {
    b.onclick(...args);
  }
  b.parentNode.removeChild(b);
  })()`;
}

customHandler("window.open", function (url,frameName,frameOptions) {
  return new WindowPorxy(url,frameName,frameOptions);
});

function WindowPorxy(url,tgt,config) {
  this.id=null;
  // idk
}
