'use strict';

const pages = require('../source/pages.json');

async function getPageObject() {
    const currentUrl = await browser.getCurrentUrl();
    const [, appenderUrl] = /^(?:\w+\:\/\/\w+\.?\w+\.?\w+\/)(.*html)(#.*)?$/.exec(currentUrl);
    if (!pages[appenderUrl]) {
        throw new Error(`The framework has not included suitable page-object for this url [${appenderUrl}]`);
    } else {
        return pages[appenderUrl][Object.keys(pages[appenderUrl]).find(key => /page/i.test(key))];
    }
}

async function getElement(string) {
    const po = await getPageObject();
    await browser.wait(ec.presenceOf(element(by.css(po.selector))), 5000);
    const baseElement = element(by.css(po.selector));
    return /\s?\>\s?/.test(string) ? getElementFromChain(baseElement, po, string) : getElementFromString(baseElement, po, string);
};

function getRegex(string) {
    let regexes = [/^#\d+/, /#\d+$/, /^#first/, /#first$/, /^#second/, /#second$/, /^#last/, /#last$/];
    regexes = regexes.filter(regex => regex.test(string.trim()));
    if (regexes.length > 1) {
        throw new Error(`There is more than one option in [${string}].`);
    } else {
        return regexes[0];
    }
}

async function getElementFromChain(baseElement, po, chain) {
    const names = chain.split(/\s?\>\s?/);
    for (let i = 0; i < names.length; i++) {
        baseElement = await  getElementFromString(baseElement, po, names[i]);
        po = po.children[names[i].trim()];
      }
    return baseElement;
}

function getElementFromString(baseElement, po, string) {
    const regex = getRegex(string);
    return regex ? getElementByRegex(baseElement, po, string, regex) : getElementByString(baseElement, po, string);
}


function getElementByString(baseElement, po, string) {
    po = po['children'][string.trim()];
    if (!po) {
        throw new Error(`There is no [children] property in object [${po}]`);
    } else {
        return baseElement.element(by.css(po.selector));
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