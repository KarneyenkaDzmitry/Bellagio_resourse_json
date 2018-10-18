'use strict';

const pages = require('../page-objects/pages.json');

function getPageObject() {
    return browser.getCurrentUrl()
        .then((currentUrl) => {
            const [, appenderUrl] = /^(?:\w+\:\/\/\w+\.?\w+\.?\w+\/)(.*html)(#.*)?$/.exec(currentUrl);
            if (pages[appenderUrl]) {
                throw new Error(`The framework has not included suitable page-object for this url [${appenderUrl}]`);
            } else {
                return pages[appenderUrl];
            }
        });
}

async function getElement(string) {
    const po = await getPageObject();
    return /\s?\>\s?/.test(string) ? getElementFromString(string, po) : getElementFromChain(string, po);
};

function getSelector(string, po) {

}

function getSelectorByString(string, po) {
    return po.selector;
}

function getSelectorByRegex(string, po) {

}

function getRegex(string) {
    let regexes = [/^#\d+/, /#\d+$/, /^#first/, /#first$/, /^#second/, /#second$/, /^#last/, /#last$/];
    regexes = regexes.filter(regex => regex.test(string));
    if (regexes.length > 1) {
        throw new Error(`There is more than one option in [${string}].`);
    } else {
        return regexes[0];
    }
}

function getElementFromChain(string, po) {
    let element;
    const names = string.split(/\s?\>\s?/);
    names.forEach(name=>{
        element = getElementFromString(name, po);
        po = po.children[name];
    });
    return element;
}

function getElementFromString(string, po) {
    const regex = getRegex(string);
    return element(by.css(regex ? getSelectorByRegex(string, po) : getSelectorByString(string, po)));
}

module.exports = { getElement };
// function replacer(match, beforeNumber, first, second, last, afterNumber, offset, string) {
//     console.log(`match:[${match}], beforeNumber:[${beforeNumber}], first:[${first}], second:[${second}], last:[${last}],
//      afterNumber:[${afterNumber}], offset:[${offset}], string:[${string}]`);
//     return
// }

// const string = 'search page > search panel > #1 menu items #2';//search page > search panel > 
// let regexes = [/^#\d+/, /#\d+$/, /^#first/, /#first$/, /^#second/, /#second$/, /^#last/, /#last$/];
// regexes = regexes.filter(regex => regex.exec(string));
// //console.log(regexes)
// //console.log((/\$/g).test(string));
// //console.log(/\s?\>\s?/g.exec(string))
// let array;
// while (array = /\.+\s?\>?/.exec(string)) {
//     console.log(array[0]);
// }
// console.log((/(^#\d+)|(#first)|(#second)|(#last)|(#\d+$)/gi).exec(string));