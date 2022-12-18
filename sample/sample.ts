import { Config } from "../src/interfaces";
import { TruncateElement } from "../src/truncate-element"
import { ProccessModel, WordModel, Type } from "../src/services";

const colorConf: Config = {
    more: "show",
    less: "hide",
    number: 50,
    highlightList: [
        { name: "u", color: "green" },
        { name: "que", color: "blue" },
        { name: "equen", color: "red" },
        { name: "sequenc", color: "pink" },
        { name: "lly", color: "yellow" },
    ],
    highlightCondition: "like",
    completeWord: true,
    hasLiteral: true,
};


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

export class AnyThingYouWant extends ProccessModel {
    constructor() {
        super(newConf)
    }
    process(model: WordModel): WordModel {
        const patt = /(\d{4}[\/|-]\d{2}[\/|-]\d{2})$/gmi;
        if (patt.test(model.word)) {
            model.html = `<span style="background:#f2d7ee;">${model.word}</span>`;
            model.type += ' date';
            return model;
        }
        else
            return model;
    }
}

const userModels: Array<Type<ProccessModel>> = [];
userModels.push(AnyThingYouWant)



const newConf: Config = {
    more: "show",
    less: "hide",
    number: 50,
    highlightList: [
        { name: "http", color: "green" },
        { name: "nize", color: "blue" },
        { name: "recog", color: "red" },
        { name: "swe", color: "pink" },
        { name: "Lorem", color: "lightgreen" },
        { name: "answer", color: "lightblue" },
        { name: "Android", color: "brown" },
        { name: "secte", color: "gray" },
        { name: "dolor", color: "red" },
        { name: "Dolar", color: "pink" },
        "consequuntur", { name: "equ", color: "blue" },
        "dipi",
        { name: "totam", color: "green" },
    ],
    highlightCondition: "like",
    completeWord: false,
    hashtag: true,
    hasLiteral: true,
    mention: true,
    identifyLink: {
        enabled: true,
        hasQueryString: true,
        title: "",
        class: "roja sample",
        style: '',
        domain: [],
        protocol: [],
        target: "_blank",
    },

};
if (!!TruncateElement) { }
let coloredTest = document.getElementById('coloredTest') as TruncateElement;
coloredTest?.setAttribute('config', JSON.stringify(colorConf));




// //this line for using of TruncateElement because only import TruncateElement class is not enough.
// //console.log(TruncateElement);

let element = document.getElementById('test') as TruncateElement;
element.addUserModel(TimeModel, AnyThingYouWant);//
/* you can send your models like below examples
element.addUserModel(TimeModel, AnyThingYouWant);
element.addUserModel(...userModels);
element.addUserModel(...[TimeModel, AnyThingYouWant]);
*/
//element?.setAttribute('config', JSON.stringify(newConf));

const farsiConfig: Config = {
    less: 'پنهان',
    more: 'آشکار',
    completeWord: true,
    hasLiteral: true,
    hashtag: true,
    highlightCondition: 'like',
    highlightList: [
        { name: 'ساختگی', color: 'lightblue' },
        { name: 'اختگ', color: 'pink' },
        { name: 'خت', color: 'lightgreen' },
        { name: 'گرافیک', color: 'lightblue' },
        { name: 'گرا', color: 'purple' },
        { name: 'راه', color: 'red' },
        { name: 'شناخت', color: 'blue' },
        { name: 'کار', color: 'green' },
    ],
    number: 50,
};

function component(newVer: TruncateElement) {
    newVer.innerHTML = 'لورم ایپسوم متن ساختگی با @تولید سادگی نامفهوم از #صنعت چاپ و با استفاده از طراحان گرافیک است. چاپگرها و متون بلکه روزنامه و مجله در ستون و سطرآنچنان که لازم است و برای شرایط فعلی تکنولوژی مورد نیاز و کاربردهای متنوع با هدف بهبود ابزارهای کاربردی می باشد. کتابهای زیادی در شصت و سه درصد گذشته، حال و آینده شناخت فراوان جامعه و متخصصان را می طلبد تا با نرم افزارها شناخت بیشتری را برای طراحان رایانه ای علی الخصوص طراحان خلاقی و فرهنگ پیشرو در زبان فارسی ایجاد کرد. در این صورت می توان امید داشت که تمام و دشواری موجود در ارائه راهکارها و شرایط سخت تایپ به پایان رسد وزمان مورد نیاز شامل حروفچینی دستاوردهای اصلی و جوابگوی سوالات پیوسته اهل دنیای 11:48 موجود طراحی اساسا مورد استفاده قرار گیرد.'
    newVer.addUserModel(AnyThingYouWant, TimeModel);
    newVer.setAttribute('config', JSON.stringify(farsiConfig));
    return newVer;
}

let div = document.getElementsByClassName('persian')[0];
for (let i = 0; i < 3; i++) {
    const br = document.createElement('br');
    div.append(br);

}
let trun = document.createElement("truncate-element") as TruncateElement;
const elem = component(trun);
div.append(elem)

document.body.appendChild(div);

let hashtag = true;

function updateLorem() {
    hashtag = !hashtag;

    let temp: Config = JSON.parse(JSON.stringify(newConf));
    temp.hashtag = hashtag;

    var elem = document.getElementById("test");
    // elem?.removeAttribute('config');
    elem?.setAttribute('config', JSON.stringify(temp));

}

document.getElementById('update')?.addEventListener('click', function () {
    updateLorem()
})