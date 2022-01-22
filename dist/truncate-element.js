!function(t){var e={};function i(s){if(e[s])return e[s].exports;var h=e[s]={i:s,l:!1,exports:{}};return t[s].call(h.exports,h,h.exports,i),h.l=!0,h.exports}i.m=t,i.c=e,i.d=function(t,e,s){i.o(t,e)||Object.defineProperty(t,e,{enumerable:!0,get:s})},i.r=function(t){"undefined"!=typeof Symbol&&Symbol.toStringTag&&Object.defineProperty(t,Symbol.toStringTag,{value:"Module"}),Object.defineProperty(t,"__esModule",{value:!0})},i.t=function(t,e){if(1&e&&(t=i(t)),8&e)return t;if(4&e&&"object"==typeof t&&t&&t.__esModule)return t;var s=Object.create(null);if(i.r(s),Object.defineProperty(s,"default",{enumerable:!0,value:t}),2&e&&"string"!=typeof t)for(var h in t)i.d(s,h,function(e){return t[e]}.bind(null,h));return s},i.n=function(t){var e=t&&t.__esModule?function(){return t.default}:function(){return t};return i.d(e,"a",e),e},i.o=function(t,e){return Object.prototype.hasOwnProperty.call(t,e)},i.p="",i(i.s=0)}([function(t,e,i){"use strict";i.r(e),i.d(e,"TruncateElement",(function(){return s}));class s extends HTMLElement{constructor(){super(),this._highlightQuery=[],this.config={number:0,more:"",less:"",completeWord:!1,hashtag:!1,hasLiteral:!1,highlightCondition:"exactly",highlightList:[{name:"",color:""}]},this.number=100,this.more="show",this.less="hide",this.completeWord=!1,this.hashtag=!1,this.hasLiteral=!1,this.highlightCondition="exactly",this.highlightList=[{name:"",color:""}],this.text="",this.replace=!1,this.connectedLoaded=!1,this.dataLoaded=!1,this.tempHtml="";new MutationObserver(()=>{this.connectedLoaded&&!this.dataLoaded&&this.initialValues()}).observe(this,{characterData:!1,childList:!0,attributes:!1})}instanceOfHighlighQuery(t){return"string"!=typeof t&&"name"in t}connectedCallback(){this.initialValues(),this.connectedLoaded=!0}attributeChangedCallback(t,e,i){this.connectedLoaded&&this.initialValues(t)}static get observedAttributes(){return["config"]}initialValues(t="config"){if(!this.innerHTML)return;this.tempHtml||(this.tempHtml=this.innerHTML);const e=this.getAttribute(t);(null==e?void 0:e.length)&&(this.config=JSON.parse(e),this.number=this.config.number?this.config.number:this.number,this.more=this.config.more?this.config.more:this.more,this.less=this.config.less?this.config.less:this.less,this._highlightQuery=this.config.highlightList,this.highlightCondition=this.config.highlightCondition,this.completeWord=this.config.completeWord,this.hashtag=this.config.hashtag,this.hasLiteral=this.config.hasLiteral,this._highlightQuery&&this._highlightQuery.length&&this._highlightQuery.sort((t,e)=>{if(this.instanceOfHighlighQuery(t)&&this.instanceOfHighlighQuery(e)){if(t.name&&e.name)return t.name.length-e.name.length}else if("string"==typeof t&&this.instanceOfHighlighQuery(e)){if(e.name)return t.length-e.name.length}else{if(!this.instanceOfHighlighQuery(e)||"string"!=typeof t)return"string"==typeof e&&"string"==typeof t?t.length-e.length:0;if(e.name)return t.length-e.name.length}return 0}),this.fill(this.tempHtml),this.dataLoaded=!0)}fill(t){this.hasLiteral||(t=t.replace(/(\r\n\t|\n|\r\t)/gm," ")),this.text=t;let e="";if(t.length>this.number){e=this.applyCondition(t,this.number,this.completeWord,this.hashtag),e=this.highlight(e,this.highlightCondition,this._highlightQuery),this.replace=!0,this.innerHTML=e+" ... ";const i=document.createElement("span");i.innerHTML=this.more,i.style.color="#ff00ff",i.style.cursor="pointer",i.classList.add("toggleText"),this.innerHTML=e+"... ",i.addEventListener("click",t=>!0===this.replace?this.showFullText(t):this.hideSomeText(t)),this.appendChild(i)}else t=this.hashtag?this.findHashtag(t):t,t=this.highlight(t,this.highlightCondition,this._highlightQuery),this.innerHTML=t;this.hasLiteral&&(this.style.whiteSpace="pre-line")}showFullText(t){const e=document.createElement("span");e.innerHTML=" "+this.less,e.style.color="#ff00ff",e.style.cursor="pointer",e.classList.add("toggleText");let i=this.hashtag?this.findHashtag(this.text):this.text;this.innerHTML=this.highlight(i,this.highlightCondition,this._highlightQuery),this.hasLiteral&&(this.style.whiteSpace="pre-line"),e.addEventListener("click",t=>this.hideSomeText(t)),this.appendChild(e),t.stopPropagation(),this.replace=!1}hideSomeText(t){const e=this.applyCondition(this.text,this.number,this.completeWord,this.hashtag),i=this.highlight(e,this.highlightCondition,this._highlightQuery),s=document.createElement("span");s.style.color="#ff00ff",s.classList.add("toggleText"),s.innerHTML=this.more,this.innerHTML=i+" ... ",this.hasLiteral&&(this.style.whiteSpace="pre-line"),s.addEventListener("click",t=>this.showFullText(t)),this.appendChild(s),t.stopPropagation(),this.replace=!0}highlight(t,e="",i){if(!i||!i.length)return t;if("exactly"==e){for(let e of i){let i="";if("string"!=typeof e){i="(^|(?<!\\p{L}))("+e.name+")(?!(\\p{L}))";const s=e.color?e.color:"yellow";t=t.replace(new RegExp(i,"gmu"),t=>`<span style="background:${s}">${t}</span>`)}else i="(^|(?<!\\p{L}))("+e+")(?!(\\p{L}))",t=t.replace(new RegExp(i,"gmu"),t=>`<span style="background:yellow">${t}</span>`)}return t}for(let e of i)if("string"!=typeof e&&e.name){let i=t.match(new RegExp(e.name,"gmi"));if(i)for(const s of i){const i=e.color?e.color:"yellow";t=t.replace(new RegExp(e.name,"gmi"),`<span style="background-color:${i}">${s}</span>`)}}else if("string"==typeof e){let i=t.match(new RegExp(e,"gmi"));if(i)for(const s of i)t=t.replace(new RegExp(e,"gmi"),`<span style="background-color:yellow">${s}</span>`)}return t}checkWordCut(t,e){let i=0;for(i=t;i<e.length&&" "!=e[i];i++);return e.substring(0,i)}findHashtag(t){return t=t.replace(/(^|\s)(#[\p{Pc}\p{N}\p{L}\u200cÀ-ÖØ-öø-ʸ(_)]+)/gimu,t=>`<span class="hashtag" style="color:#1b95e0">${t}</span>`)}applyCondition(t,e,i=!1,s=!1){let h="";if(i&&s){const i=this.checkWordCut(e,t);h=this.findHashtag(i)}else if(i)h=this.checkWordCut(e,t);else if(s){const i=t.substring(0,e);h=this.findHashtag(i)}else h=t.substring(0,e);return h}}customElements.define("truncate-element",s)}]);
//# sourceMappingURL=truncate-element.js.map