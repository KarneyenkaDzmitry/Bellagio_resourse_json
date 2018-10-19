'use strict';

const pages = require('../source/pages.json');

async function getPageObject() {
    const currentUrl = await browser.getCurrentUrl();
    const [, appenderUrl] = /^(?:\w+\:\/\/\w+\.?\w+\.?\w+\/)(.*html)(#.*)?$/.exec(currentUrl);
    if (!pages[appenderUrl]) {
        throw new Error(`The framework has not included suitable page-object for this url [${appenderUrl}]`);
    } else {
        const page = pages[appenderUrl][Object.keys(pages[appenderUrl]).find(key => /page/i.test(key))];
        // console.log(page);
        return page;
    }
    // return pages["en/entertainment.html"]["entertainment page"];
}

async function getElement(string) {
    const po = await getPageObject();
    await browser.wait(ec.presenceOf(element(by.css(po.selector))), 5000);
    const baseElement = element(by.css(po.selector));
    // console.log(await baseElement.isPresent()) //'baseElement' //
    return /\s?\>\s?/.test(string) ? getElementFromChain(baseElement, po, string) : getElementFromString(baseElement, po, string);
};

function getRegex(string) {
    let regexes = [/^#\d+/, /#\d+$/, /^#first/, /#first$/, /^#second/, /#second$/, /^#last/, /#last$/];
    // console.log(regexes.splice(2,1));
    regexes = regexes.filter(regex => regex.test(string.trim()));
    if (regexes.length > 1) {
        throw new Error(`There is more than one option in [${string}].`);
    } else {
        return regexes[0];
    }
}

function getElementFromChain(baseElement, po, chain) {
    const names = chain.split(/\s?\>\s?/);
    return names.forEach(name=> {
        getElementFromString(baseElement, po, name)
        .then((element)=>{baseElement = element; });
        po = po.children[name.trim()];
    });
    return baseElement;
}

function getElementFromString(baseElement, po, string) {
    const regex = getRegex(string);
    return regex ? getElementByRegex(baseElement, po, string, regex) : getElementByString(baseElement, po, string);
}


async function getElementByString(baseElement, po, string) {
    console.log('|' + string.trim() + '|');
    po = po['children'][string.trim()];
    console.log(po.selector);
    if (!po) {
        throw new Error(`There is no [children] property in object [${po}]`);
    } else {
        console.log('BAseElement: ['+await baseElement.isPresent()+']')
        const elem = await  baseElement.element(by.css(po.selector));
        console.log(await elem.isPresent());
        return elem;
    }
}

async function getElementByRegex(baseElement, po, string, regex) {
    const index = getIndex(regex.exec(string)[0]);
    regex = string.replace(regex, '').trim();
    return (await baseElement.all(by.css(po.selector))).splice(index, 1);
}

function getIndex(string) {
    let index = string.replace('#', '');
    switch (index) {
        case 'first': return 0;
        case 'second': return 1;
        case 'last': return -1;
        default: return Number.parseInt(index) - 1;
    }
}
module.exports = { getElement };