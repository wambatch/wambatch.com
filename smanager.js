function BasicMP3Player(){var s=this,a=this,t=soundManager,e=navigator.userAgent.match(/ipad|iphone/i),n=navigator.userAgent.match(/msie/i);this.excludeClass="button-exclude",this.links=[],this.sounds=[],this.soundsByURL={},this.indexByURL={},this.lastSound=null,this.soundCount=0,this.config={playNext:!0,autoPlay:!1},this.css={sDefault:"sm2_button",sLoading:"sm2_loading",sPlaying:"sm2_playing",sPaused:"sm2_paused"},this.includeClass=this.css.sDefault,this.addEventHandler=void 0!==window.addEventListener?function(s,a,t){return s.addEventListener(a,t,!1)}:function(s,a,t){s.attachEvent("on"+a,t)},this.removeEventHandler=void 0!==window.removeEventListener?function(s,a,t){return s.removeEventListener(a,t,!1)}:function(s,a,t){return s.detachEvent("on"+a,t)},this.classContains=function(s,a){return void 0!==s.className&&s.className.match(new RegExp("(\\s|^)"+a+"(\\s|$)"))},this.addClass=function(a,t){if(!a||!t||s.classContains(a,t))return!1;a.className=(a.className?a.className+" ":"")+t},this.removeClass=function(a,t){if(!a||!t||!s.classContains(a,t))return!1;a.className=a.className.replace(new RegExp("( "+t+")|("+t+")","g"),"")},this.getSoundByURL=function(a){return void 0!==s.soundsByURL[a]?s.soundsByURL[a]:null},this.isChildOfNode=function(s,a){if(!s||!s.parentNode)return!1;a=a.toLowerCase();do{s=s.parentNode}while(s&&s.parentNode&&s.nodeName.toLowerCase()!==a);return s.nodeName.toLowerCase()===a?s:null},this.events={play:function(){a.removeClass(this._data.oLink,this._data.className),this._data.className=a.css.sPlaying,a.addClass(this._data.oLink,this._data.className);mainsongtitle()},stop:function(){a.removeClass(this._data.oLink,this._data.className),this._data.className=""},pause:function(){a.removeClass(this._data.oLink,this._data.className),this._data.className=a.css.sPaused,a.addClass(this._data.oLink,this._data.className)},resume:function(){a.removeClass(this._data.oLink,this._data.className),this._data.className=a.css.sPlaying,a.addClass(this._data.oLink,this._data.className)},finish:function(){if(a.removeClass(this._data.oLink,this._data.className),this._data.className="",a.config.playNext){var s=a.indexByURL[this._data.oLink.href]+1;s<a.links.length&&a.handleClick({target:a.links[s]})}}},this.stopEvent=function(s){return void 0!==s&&void 0!==s.preventDefault?s.preventDefault():void 0!==window.event&&(window.event.returnValue=!1),!1},this.getTheDamnLink=n?function(s){return s&&s.target?s.target:window.event.srcElement}:function(s){return s.target},this.handleClick=function(a){if(void 0!==a.button&&a.button>1)return!0;var e,n,i=s.getTheDamnLink(a);return"a"!==i.nodeName.toLowerCase()&&!(i=s.isChildOfNode(i,"a"))||(i.getAttribute("data-href"),!i.getAttribute("data-href")||!soundManager.canPlayLink(i)||s.classContains(i,s.excludeClass),!s.classContains(i,s.includeClass)||(t._writeDebug("handleClick()"),e=i.getAttribute("data-href"),(n=s.getSoundByURL(e))?n===s.lastSound?n.togglePause():(n.togglePause(),t._writeDebug("sound different than last sound: "+s.lastSound.id),s.lastSound&&s.stopSound(s.lastSound)):((n=t.createSound({id:"basicMP3Sound"+s.soundCount++,url:e,onplay:s.events.play,onstop:s.events.stop,onpause:s.events.pause,onresume:s.events.resume,onfinish:s.events.finish,whileplaying: function() {currentime(this.position, Math.min(100,(100*(this.position/this.duration))));},onload: function() {songduration(this.durationEstimate,this.id);},type:i.type||null}))._data={oLink:i,className:s.css.sPlaying},s.soundsByURL[e]=n,s.sounds.push(n),s.lastSound&&s.stopSound(s.lastSound),n.play()),s.lastSound=n,s.stopEvent(a)))},this.stopSound=function(s){soundManager.stop(s.id),e||soundManager.unload(s.id)},this.init=function(){t._writeDebug("basicMP3Player.init()");var a,e,n=0,i=document.getElementsByTagName("a");for(a=0,e=i.length;a<e;a++)s.classContains(i[a],s.css.sDefault)&&!s.classContains(i[a],s.excludeClass)&&(s.links[n]=i[a],s.indexByURL[i[a].href]=n,n++);n>0&&(s.addEventHandler(document,"click",s.handleClick),s.config.autoPlay&&s.handleClick({target:s.links[0],preventDefault:function(){}})),t._writeDebug("basicMP3Player.init(): Found "+n+" relevant items.")},this.init()}var basicMP3Player=null;soundManager.setup({preferFlash:!1,onready:function(){basicMP3Player=new BasicMP3Player}});
