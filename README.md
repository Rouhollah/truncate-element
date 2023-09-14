# truncate-element
You can use "turncate-element" for Vue, React, Angular or any JavaScript based framework without any worries. This is a custom element with which you can:
- Identify hashtags, mentions and links.
- Shorten and display the text as much as you want without losing the original text.
- Highlight the words you want even if they are nested.
- Create your own custom model.(very hot)
  
and a few other features.
## <a id="demo">Demos</a>

#### see demo on stackblitz for [Angular](https://stackblitz.com/edit/angular-ivy-sverbg), [React](https://stackblitz.com/edit/react-ts-pe2oey). [Vue](https://stackblitz.com/edit/vue-kslsxv) and [simple html](https://stackblitz.com/edit/web-platform-bhoxnu).

### <a id="installation">Installation:</a>
```
npm i truncate-element -s
```
content:
- [Demos](#demo)
- [Use in Angular](#angular)
- [Use in React](#react)
- [Use in Vue](#vue)
- [Use in Simple HTML](#html)
- [Help table](#help)
- [Note](#note)
- [Changes](#change)
- [Develop](#develop)

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
and add the `truncate-element.js` or `truncate-element.min.js` to `angular.json` file.

```
...
"architect": {
    "build": {
        ...
        "scripts": [
            "node_modules/truncate-element/truncate-element[.min].js"
        ]
},
```
then use **truncate-element** tag in html, with one of the following ways that you prefer:

<details>
 <summary> <b>#1.</b> if you want process some data and after that truncate your string, or the __config__ attribute not ready yet,</summary>


```
<!--get element by id and set config attribute on it-->
<truncate-element id="ele">
  Lorem, #ipsum dolor sit amet consectetur adipisicing elit. Ducimus quas quos reiciendis   voluptatum corporis soluta beatae placeat assumenda! Fugit, aspernatur veritatis voluptatum assumenda neque minima, voluptatibus laboriosam sit
</truncate-element>
```
and in its .ts file :
```
myConfig: Config= {
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
hasLiteral: true,
identifyLink: {
                enabled: true,
            }
};

ngOnInit()  or  anyfunction() {
var elem = document.getElementById("ele"); 
elem?.setAttribute('config',JSON.stringify(this.myConfig)); 
}
```
</details>


<details>
 <summary><b>#2.</b> use stringify object on config attribute directly:</summary>


```
<truncate-element
config='{"more":"show","less":"hide","number":50,"highlightList":[{"name":"dolor","color":"red"},"consequuntur",{"name":"equ","color":"blue"},{"name":"optio","color":"green"}],"highlightCondition":"like","completeWord":true,"hashtag":true,"hasLiteral":true}'>
lorem ...
</truncate-element>
```

and no need any change in its .ts file.
</details>


<details>
 <summary><b>#3.</b> use with [attr.config]:</summary>
 
 
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
</details>

[back to top](#installation)
## <a id="react">Use in React</a> 
first add `truncate-element.js` or `truncate-element.min.js` to your project. 

`  <script src="%PUBLIC_URL%/truncate-element[.min].js" type="text/javascript"></script>`

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
          {/* use stringify object on config attribute directly */} 
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
<!--  use stringify object on config attribute directly >

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
add `truncate-element[.min].js` to .html file:

`<script type="module" src="../dist/truncate-element.min.js"></script>`

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
             hasLiteral: true,
             identifyLink: {
                enabled: true,
            }
         });
         var elem = document.getElementById("ele");
         elem.setAttribute('config', config2);

         var elem2 = document.getElementById('wtext');
         elem2.innerHTML = "Lorem #ipsum dolor sit amet consectetur  ... ."    
    </script>
```
[back to top](#installation)
## <a id="help">Help table - Config properties</a>
 |property|description|type|default|version|
|----|----|-----|-----|-----|
|less|A word is displayed before the text is shortened|string|hide|1.0.0
|more|A word is displayed after the text is shortened|string|show|1.0.0
|number|Number of characters to display|number|100|1.0.0
|completeWord|It prevents word break when shortening text on a part of the word.|boolean|false|1.0.0
|hashtag|Finds hashtag in text (any language, zero-width non-joiner is considered.)|boolean|false|1.0.0
hasLiteral|If you want to see the text as it is (including "\ r", "\ n", "\ t"), use this feature |boolean|false|1.0.0
|highlightList|Colors the words you enter in the list with the color you specify in the list. If you enter a string without color, it will turn yellow by default.|Array<HighlightQuery\|string>| [{ name: '', color: '' }]|1.0.0
|highlightCondition|This feature determines whether any similar word in your list found in the text will be highlighted or will find and highlight exactly the same words in the list.|string|exactly|1.0.0
mention|Finds mention in text|boolean|false|1.1.0
identifyLink|identifying Url in text|IdentifyLink|enabled:false|1.8.0

## IdentifyLink properties
|property|description|type|default|version|
|----|----|-----|-----|-----|
enabled|by this property, activate or deactivate|boolean|false|1.8.0
hasQueryString|identifying query string|boolean|false|1.8.0
title|title attribute for anchor tag|string|""|1.8.0
class|class for anchor tag|string|""|1.8.0
style|style for anchor tag|string|text-decoration:none;color:blue;|1.8.0
domain|array of suffix like ['com','ir','gov']|Array\<string\>|[]|1.8.0
protocol|array of prefix like ['ftp','www','http']|Array\<string\>|[]|1.8.0
target|refers to a window, tab or frame inside a page|string|_blank|1.8.0

## Custom Model in v2.0.0 and higher
 you can implement your favorite model for working on string. just define a class and extend ProccessModel. ProccessModel is abstract class with a process method that you should implement it. 
 
```
 export class TimeModel extends ProccessModel {
        constructor() {
          super(newConf)
      }
      process(model: WordModel): WordModel { ...
```
see the full examples on [Demos](#demo).

[back to top](#installation)
## <a id="note"><span style="color:yellow"> Note:</span> </a>
- if determine protocol and domain in `IdentifyLink` property, URLs identify that have both protocol and domain. example:
```
...
  mention: true,
  identifyLink: {
     enabled: true,
     hasQueryString: true,
     title: "",
     class: "roja sample",
     style: '',
     domain: ['ir', 'com'],
     protocol: ['www'],
     target: "_blank",
 }
...
```
  and in text you have:
  ... https://www.sonys-emicon.com/en/technology/, ...  quam, www.irib.ir, quis, ftp://quod.tis, quos,...
  Only this URL is recognized --> 'www.irib.ir'. **for identifing all URLs use blank array for domain and protocol properties.**
  

- You can use `Config` and `HighlighQuery` interfaces for type of properties.

  ```
  import { Config , HighlightQuery} from 'truncate-element/interfaces';
  ...
  conf: Config = {
    more: "show",
    less: "hide",
    ...
  }

  _highlight: HighlightQuery[] = [{ name: "dolor", color:  "red" },...];
  ```
  


- before pass `config` attribute to the element , you should convert to string with `JSON.stringify()`. 
- default color for toggle button is `#ff00ff` and cursor style is pointer , if you want to use custom style, use the builtin `.toggleText` class.
  ```
  .toggleText{
      color: aqua !important;
  	font-size:14px;
  	font-style: italic;
  }
  ```
- default color for hashtags is `#1b95e0` (from twitter), if you want to use custom style, use the builtin `.hashtag` class.

- default color for mentions is `#0095f6` (from twitter), if you want to use custom style, use the builtin `.mention` class.

 [back to top](#installation)

 ## <a id="change"><span style="color:yellow">Changes:</span> </a>
 - ### v2.4.1
 * update README.md. Improved description. 
  - ### v2.4.0
    * Improved highlight list review
    * The addition of nested highlights in more than 2 steps
    * Improved check and display of character count
    * Improving Performance
  - ### v2.0.2
    * fix bug for `Class extends value undefined is not a constructor or null`
  - ### v2.0.1
    * fix bug for `Uncaught DOMException: Failed to execute 'define' on 'CustomElementRegistry'`
  - ### v2.0.0
    * a feature has been Added to create custom function (important feature). See the example below:
    ```
          const newConf: Config = {
            more: "show",
            less: "hide",
            number: 50,
            ...
            }
          export class TimeModel extends ProccessModel {
            constructor() {
              super(newConf)
          }
          process(model: WordModel): WordModel {
              const patt = /(\d{2}:\d{2})$/gmi;
              if (patt.test(model.word)) {
                  model.html = `<span style="background:#8bb49c">${model.word}</span>`;
                  model.type += ' time';
                  return model;
              }
              else
                  return model;
            }
          }

          const userModels: Array<Type<ProccessModel>> = [];
          userModels.push(TimeModel);
          ...
         let element = document.getElementById('test') as TruncateElement;
         element.addUserModel(TimeModel);
    ```

    for full example see  [Demos](#demo).

    * better highlighting.
      * it highlights words until two level.
      * you can highlight words in URLs (anywhere of URL).
      * you can highlight words in hashtag or mention
  - ### v1.8.1
    * fix a bug in subdomain and query string identifying
  - ### v1.8.0
     The following features have been added:
    * Identify the link
      * Query string identification
      * Add title, target, class and style
      * Domain and protocol detection
  - ### v1.1.1
    * If there were uppercase and lowercase words in the sentence, when they were highlighted, all words were changed to the last word found. 
  - ### v1.1.0 
    * finding mentions in text is added.
   
   [back to top](#installation)
  
## <a id="develop"><span style="color:yellow">Develop:</span> </a>
  1. open command line and clone repository with command below :

      ```git clone https://github.com/Rouhollah/truncate-element.git```
  2. install dependencies :

      ``` npm i```

  3. running in development mode :

      ``` npm run dev```
  4. for build :

      ```npm run build```
  
  [back to top](#installation)

If you like my energy and want to support my creative work, you can<br> [!["Buy Me A Coffee"](https://www.buymeacoffee.com/assets/img/custom_images/orange_img.png)](https://www.buymeacoffee.com/torshizi1O) <br> I'm a developer who loves to create packages for fun and learning. I've developed some cool stuff that you can check out on my GitHub page. Thanks for your generosity and appreciation! 😊


