'use strict';

const pages = require('../source/pages.json');

/**
 * Defines current url and returns page-object as an object by path;
 * @returns {Object} an object with properties for current url by path
 */
async function getPageObject() {
    const currentUrl = await browser.getCurrentUrl();
    const [, appenderUrl] = /^(?:\w+\:\/\/\w+\.?\w+\.?\w+\/)(.*html)(#.*)?$/.exec(currentUrl);
    if (!pages[appenderUrl]) {
        throw new Error(`The framework has not included suitable page-object for this url [${appenderUrl}]`);
    } else {
        return pages[appenderUrl][Object.keys(pages[appenderUrl]).find(key => /page/i.test(key))];
    }
}

/** 
 * Getter takes a string and returns element 
 * @param  {string} string a string with chain of properties or one name of property;
 * @returns {Element} return an needed element or array of elements
 */
async function getElement(string) {
    const po = await getPageObject();
    await browser.wait(ec.presenceOf(element(by.css(po.selector))), 5000);
    const baseElement = await element(by.css(po.selector));
    return /\s?\>\s?/.test(string) ? getElementFromChain(baseElement, po, string) : getElementFromString(baseElement, po, string);
};
/** 
 * Getter takes a string, a name of option and returns element
 * @param  {string} string  a string with chain of properties or one name of property;
 * @param  {string} name name of options 
 * @returns {Element} return an needed element or array of elements
 */
async function getElementByName(string, name) {
    const elements = await getElement(string);
    if (Array.isArray(elements)) {
        const elems = elements.map(element => element.getText());
        return Promise.all(elems)
            .then((results) => results.findIndex(elem => elem.toLowerCase() === (name.toLowerCase())))
            .then((index) => {
                if (!index) {
                    return elements[index];
                } else {
                    throw new Error(`The ending menu from [${string}] has not included option with text [${name}]`);
                }
            });
    } else {
        throw new Error(`The ending element from [${string}] is not a [menu items]`);
    }
}

/**
 * Getter takes a string and return a regex that fit to the array regexes
 * @param  {string} string entered string for test;
 * @returns {RegExp} a regex that fit to the array regexes. 
 */
function getRegex(string) {
    let regexes = [/^#\d+/, /#\d+$/, /^#first/, /#first$/, /^#second/, /#second$/, /^#last/, /#last$/];
    regexes = regexes.filter(regex => regex.test(string.trim()));
    if (regexes.length > 1) {
        throw new Error(`There is more than one option in [${string}].`);
    } else {
        return regexes[0];
    }
}
/**
 * Getter returns Element or Array of Elements according to string chain.
 * @param  {Element} baseElement base Element where search for;
 * @param  {Object} po object with data for needed page object with selectors;
 * @param  {String} chain origin string with chain of properties;
 * @returns {Element} return Element or array of Elements from string chain.
 */
async function getElementFromChain(baseElement, po, chain) {
    const names = chain.split(/\s?\>\s?/);
    for (let i = 0; i < names.length; i++) {
        baseElement = await getElementFromString(baseElement, po, names[i]);
        po = po.children[names[i].trim()];
    }
    return baseElement;
}
/**
 * Getter returns Element or Array of Elements according to string and flag that can be or not:
 * @param  {Element} baseElement base Element where search for;
 * @param  {Object} po object with data for needed page object with selectors;
 * @param  {String} string a string with name of property and there can be a special flag;
 * @returns {Element} return Element or array of Elements from string.
 */
function getElementFromString(baseElement, po, string) {
    const regex = getRegex(string);
    return regex ? getElementByRegex(baseElement, po, string, regex) : getElementByString(baseElement, po, string);
}

/**
 * Getter returns Element or Array of Elements according to string:
 * @param  {Element} baseElement base Element where search for;
 * @param  {Object} po object with data for needed page object with selectors;
 * @param  {String} string a string with name of property;
 * @returns {Element} return Element or array of Elements from string.
 */
function getElementByString(baseElement, po, string) {
    po = po['children'][string.trim()];
    if (!po) {
        throw new Error(`There is no [children] property in object [${po}]`);
    } else {
        return po.isCollection ? baseElement.all(by.css(po.selector)) : baseElement.element(by.css(po.selector));

    }
}

/**
 * Getter returns Element according to string ang regex pattern:
 * @param  {Element} baseElement base Element where search for;
 * @param  {Object} po object with data for needed page object with selectors;
 * @param  {String} string a string with name of property;
 * @param  {RegExp} regex a template of regex;
 * @returns {Element} return Element from string by regex.
 */
async function getElementByRegex(baseElement, po, string, regex) {
    const index = getIndex(regex.exec(string)[0]);
    po = po['children'][string.replace(regex, '').trim()];
    return (await baseElement.all(by.css(po.selector))).splice(index, 1)[0];
}

/**
 * Getter takes string with flag [#] and returns a number:
 * @param  {String} string a string with flag [#];
 * @returns {Number} a number as an index for array.
 */
function getIndex(string) {
    let index = string.replace('#', '');
    switch (index) {
        case 'first': return 0;
        case 'second': return 1;
        case 'last': return -1;
        default: return Number.parseInt(index) - 1;
    }
}
module.exports = { getElement, getElementByName };