var load = require('audio-loader');
var play=require('audio-play');


function Audio(src) {
  this.audio=null;
  var me=this;
  this.loop=false;
  this.volume=1;
  this.buffer=null;
  Object.defineProperty(this,'currentTime',{
    get:function(){
      try{
        return me.audio.currentTime
      }catch(e){
        return 0
      }
    },
    set:function(v){
      try{
        me.audio.currentTime=v
      }catch(e){
        null
      }
    }
  })
  load(src).then(function(buf){
    me.buffer=buf
    me.audio=play(
      buf,
      {
        autoplay:false,
      }
    ),
    function(){
      if(me.loop){
        me.audio.currentTime=0;
        me.audio.play()
      } else {
        try{me.onended()}catch(er0){null}
      }
    }
  })
}

Audio.prototype.hassrc=function(){
  var me=this;
  return new Promise(function (y){
    var sdwe=setInterval(function(){
      if(me.audio){
        y(clearInterval(sdwe))
      }  
    })
  })
}

Audio.prototype.play=async function(){
  await this.hassrc()
  try{this.onplay()}catch(er0){null}
  try{
    this.audio.play()
  }catch(e){null}
}

Audio.prototype.pause=async function(){
  await this.hassrc()
  try{this.onpause()}catch(er0){null}
  try{
    this.audio.play()
  }catch(e){null}
}

module.exports.Audio=Audio