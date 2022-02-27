# truncate-element
you can use 'turncate-element' for any framework like Vue, React, Angular or any framewordk based on  javascript without any worries. it is a custom element that is created based on ngx-truncate-text, which I had already created myself for angular.


#### see demo on stackblitz for [Angular](https://stackblitz.com/edit/angular-ivy-sverbg), [React](https://stackblitz.com/edit/react-ts-pe2oey). [Vue](https://stackblitz.com/edit/vue-kslsxv) and [simple html](https://stackblitz.com/edit/web-platform-bhoxnu).

### <a id="installation">Installation:</a>
```
npm i truncate-element -s
```
content:

- [Use in Angular](#angular)
- [Use in React](#react)
- [Use in Vue](#vue)
- [Use in Simple HTML](#html)
- [Help table](#help)
- [Note](#note)

## <a id="angular">Use in Angular</a>
first of all, add `CUSTOM_ELEMENTS_SCHEMA` to `app.module`
```
import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
...

@NgModule({
  declarations: [
   ...
  ],
    imports: [
   ...
  ],
  providers: [],
  bootstrap: [AppComponent],
  schemas: [CUSTOM_ELEMENTS_SCHEMA]
})
export class AppModule { }

```
and add the  `truncate-element.js`  to  `angular.json`  file.

```
...
"architect": {
    "build": {
        ...
        "scripts": [
            "node_modules/truncate-element/truncate-element.js"
        ]
},
```
then use **turncate-element** tag in html, with one of the following ways that you prefer:

 __#1.__ if you want process some data and after that truncate your string, or the __config__ attribue not ready yet,
```
<!--get element by id and set config attribute on it-->
<truncate-element id="ele">
  Lorem, #ipsum dolor sit amet consectetur adipisicing elit. Ducimus quas quos reiciendis   voluptatum corporis soluta beatae placeat assumenda! Fugit, aspernatur veritatis voluptatum assumenda neque minima, voluptatibus laboriosam sit
</truncate-element>
```
and in its .ts file :
```
myConfig = JSON.stringify({
more: "show",
less: "hide",
number: 50,
highlightList: [
{ name: "dolor", color: "red" },
"consequuntur", { name: "equ", color: "blue" },
{ name: "optio", color: "green" }
],
highlightCondition: "like",
completeWord: true,
hashtag: true,
hasLiteral: true
});

ngOnInit()  or  anyfunction() {
var elem = document.getElementById("ele"); 
elem?.setAttribute('config', this.myConfig); 
}
```
__#2.__ use stringyfy object on config attribute directly:
```
<truncate-element
config='{"more":"show","less":"hide","number":50,"highlightList":[{"name":"dolor","color":"red"},"consequuntur",{"name":"equ","color":"blue"},{"name":"optio","color":"green"}],"highlightCondition":"like","completeWord":true,"hashtag":true,"hasLiteral":true}'>
lorem ...
</truncate-element>
```

and no need any change in its .ts file.

__#3.__
```
<truncate-element  [attr.config]="farsiConfig">
در این #غربت خانگی بگو هرچی باید بگی ، ... .
</truncate-element>
```
and in its .ts file:
```
farsiConfig = JSON.stringify({
less: "پنهان",
more: "آشکار",
completeWord: true,
hasLiteral: true,
hashtag: true,
highlightCondition: "like",
highlightList: [
	{ name: 'لب', color: 'pink' },
	"سوار",
	{ name: 'جنگل', color: 'green' },
	"جنگ",
	{ name: 'کتاب', color: '#aabbcc' }
],
number: 50
});
```
[back to top](#installation)
## <a id="react">Use in React</a> 
first add `truncate-element.js` to your project. 

`  <script src="%PUBLIC_URL%/truncate-element.js" type="text/javascript"></script>`

```
class App extends Component<AppProps, AppState> {
 ...
  state = {
    //use in the thirth method
    farsiConfig: JSON.stringify({
      less: 'پنهان',
     ...
    }),

    // use in the first method
    myConfig: JSON.stringify({
      more: 'show',
      ...
    }),
  };

  render() {
    setTimeout(() => {
      // use in the first method
      var element = document.getElementById('ele');
      element.setAttribute('config', this.state.myConfig);
    }, 0);

    return (
      <div>
       ...
       {/* the first method */}
          <truncate-element id="ele">
            Lorem, #ipsum dolor sit amet consectetur adipisicing elit. Ducimus
            ...
          </truncate-element>

          {/* the seconde method */}
          {/* use stringyfy object on config attribute directly */} 
          <truncate-element config='{"more":"ادامه","less":"پنهان","number":50,"highlightList":[{"name":"لب","color":"pink"},"سوار",{"name":"جنگل","color":"green"},"جنگ",{"name":"کتاب","color":"#aabbcc"}],"highlightCondition":"like","completeWord":true,"hashtag":true,"hasLiteral":true}'>
              در این #غربت خانگی بگو هرچی باید بگی ، بگو هرچی باید بگی... 
          </truncate-element>
            
		      {/* the thirth method */}
          <truncate-element config={this.state.farsiConfig}>
              در این #غربت خانگی بگو هرچی باید بگی ، بگو هرچی باید بگی ...
          </truncate-element>
			...
      </div>
    );
  }
}
```
[back to top](#installation)
## <a id="vue">Use in Vue</a>
first `import 'truncate-element'` to `main.js` then:

```
<template>
 ...
 <!-- the first method -->
    <truncate-element id="ele">
      Lorem, #ipsum dolor sit amet consectetur adipisicing elit. Ducimus quas
     ...
    </truncate-element>

<!-- the second method -->

    <truncate-element :config="farsiConfig">
      در این #غربت خانگی بگو هرچی باید بگی ...
    </truncate-element>

<!-- the thirth method -->
<!--  use stringyfy object on config attribute directly >

    <truncate-element
      config='{"more":"ادامه","less":"پنهان","number":50,"highlightList":[{"name":"لب","color":"pink"},"سوار",{"name":"جنگل","color":"green"},"جنگ",{"name":"کتاب","color":"#aabbcc"}],"highlightCondition":"like","completeWord":true,"hashtag":true,"hasLiteral":true}'
    >
      در این #غربت خانگی بگو هرچی باید بگی ...
    </truncate-element>
 ...
</template>

<script>
import Vue from "vue";

export default {
  ...
  data() {
    return {
      ...
      // use in the first method
      myConfig: {
        more: "show",
       ...
      },

      // use in the second method
      farsiConfig: JSON.stringify({
        less: "پنهان",
       ...
      }),
    };
  },
  created: function () {
    // use in the first method
    setTimeout(() => {
      const conf=JSON.stringify(this.myConfig);
      const element = document.getElementById("ele");
      element.setAttribute('config', conf);
    },0);
  },
};
</script>
...
```
[back to top](#installation)
## <a id="html">Use in Simple HTML</a>
add `truncate-element.js` to .html file:

`<script type="module" src="../dist/truncate-element.js"></script>`

and then use the `truncate-element` tag like other framework.

```
<!-- get element by id and set config attribute on it-->
<truncate-element id='ele'>
        Lorem #ipsum dolor sit amet consectetur adipisicing elit. Natus, ...
</truncate-element>

<!-- or -->
<!-- pass stringify object to config attribute directly-->
<truncate-element
            config='{"more":"ادامه","less":"پنهان","number":50,"highlightList":[{"name":"لب","color":"pink"},"سوار",{"name":"جنگل","color":"green"},"جنگ",{"name":"کتاب","color":"#aabbcc"}],"highlightCondition":"like","completeWord":true,"hashtag":true,"hasLiteral":true}'>
            در این #غربت خانگی بگو هرچی باید بگی ، بگو هرچی باید بگی ...
</truncate-element>
       
<!-- or -->
<-- set config , then add text to innerHTML later-->
<truncate-element id="wtext" config='{"more":"more","less":"less"}'>

</truncate-element>
 ...
    <script>
         var config2 = JSON.stringify({
             more: "show",
             less: "hide",
             number: 50,
             highlightList: [
                 { name: "dolor", color: "red" },
                 "consequuntur", { name: "equ", color: "blue" },
                 { name: "optio", color: "green" }
             ],
             highlightCondition: "like",
             completeWord: true,
             hashtag: true,
             hasLiteral: true
         });
         var elem = document.getElementById("ele");
         elem.setAttribute('config', config2);

         var elem2 = document.getElementById('wtext');
         elem2.innerHTML = "Lorem #ipsum dolor sit amet consectetur  ... ."    
    </script>
```
[back to top](#installation)
## <a id="help">Help table</a>
 |property|description|type|default|version|
|----|----|-----|-----|-----|
|less|A word is displayed before the text is shortened|string|hide|1.0.0
|more|A word is displayed after the text is shortened|string|show|1.0.0
|number|Number of characters to display|number|100|1.0.0
|completeWord|It prevents word break when shortening text on a part of the word.|boolean|false|1.0.0
|hashtag|Finds hashtag in text (any language, zero-width non-joiner is considered.)|boolean|false|1.0.0
hasLiteral|If you want to see the text as it is (including "\ r", "\ n", "\ t"), use this feature |boolean|false|1.0.0
|highlightList|Colors the words you enter in the list with the color you specify in the list. If you enter a string without color, it will turn yellow by default.|Array<HighlighQuery\|string>| [{ name: '', color: '' }]|1.0.0
|highlightCondition|This feature determines whether any similar word in your list found in the text will be highlighted or will find and highlight exactly the same words in the list.|string|exactly|1.0.0
mention|Finds mention in text|boolean|false|1.1.0

[back to top](#installation)
## <a id="note"><span style="color:yellow"> Note:</span> </a>
- You can use `Config` and `HighlighQuery` interfaces for type of properties.

  ```
  import { Config , HighlighQuery} from 'truncate-element';
  ...
  conf: Config = {
    more: "show",
    less: "hide",
    ...
  }

  _highlight: HighlighQuery[] = [{ name: "dolor", color:  "red" },...];
  ```
  


- bofore pass `config` attribute to the element , you should convert to string with `JSON.stringify()`. 
- default color for toggle button is <span style="color:#ff00ff">#ff00ff</span> and cursor style is pointer , if you want to use custom style, use the builtin `.toggleText` class.
  ```
  .toggleText{
      color: aqua !important;
  	font-size:14px;
  	font-style: italic;
  }
  ```
- default color for hashtags is <span style="color:#1b95e0">#1b95e0</span>  (from twitter), if you want to use custom style, use the builtin `.hashtag` class.

- default color for mentions is <span style="color:#0095f6">#0095f6</span>, if you want to use custom style, use the builtin `.mention` class.

 [back to top](#installation)