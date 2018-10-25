'use strict';

const pages = require('../source/pages.json');
const { logger } = require('../configs/logger.conf');

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
            .then(results => results.findIndex(elem => elem.toLowerCase() === (name.toLowerCase())))
            .then(index => {
                if (index > -1) {
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
    let names = chain.split(/\s?\>\s?/);
    if (po.children.hasOwnProperty(names[0].trim())) {
        for (let i = 0; i < names.length; i++) {
            baseElement = await getElementFromString(baseElement, po, names[i]);
            po = po.children[names[i].trim()];
        }
        return baseElement;
    } else {
        names[0] = await getChain(po, names[0]);
        return await getElementFromChain(baseElement, po, names.join(' > '));
    }
}
/**
 * Getter returns Element or Array of Elements according to string and flag that can be or not:
 * @param  {Element} baseElement base Element where search for;
 * @param  {Object} po object with data for needed page object with selectors;
 * @param  {String} string a string with name of property and there can be a special flag;
 * @returns {Element} return Element or array of Elements from string.
 */
function getElementFromString(baseElement, po, string) {
    let regex = /(\#\$\w+$)|(^\#\$\w+)/g;
    let arr = [];
    while ((arr = regex.exec(string)) !== null) string = string.replace(arr[0].substring(1), storage.getValue(arr[0].substring(1)));
    regex = getRegex(string);
    return regex ? getElementByRegex(baseElement, po, string, regex) : getElementByString(baseElement, po, string);
}

/**
 * Getter returns Element or Array of Elements according to string:
 * @param  {Element} baseElement base Element where search for;
 * @param  {Object} po object with data for needed page object with selectors;
 * @param  {String} string a string with name of property;
 * @returns {Element} return Element or array of Elements from string.
 */
async function getElementByString(baseElement, po, string) {
    if (po.children.hasOwnProperty(string.trim())) {
        po = po['children'][string.trim()];
        if (!po) {
            throw new Error(`There is no [children] property in object [${po}]`);
        } else {
            return po.isCollection ? baseElement.all(by.css(po.selector)) : baseElement.element(by.css(po.selector));
        }
    } else {
        const chain = await getChain(po, string);
        return await getElementFromChain(baseElement, po, chain);
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
    const name = string.replace(regex, '').trim();
    if (po.children.hasOwnProperty(name)) {
        po = po['children'][name];
        return (await baseElement.all(by.css(po.selector))).splice(index, 1)[0];
    } else {
        const chain = await getChain(po, string);
        logger.debug(`getElementByRegex([${string}]) returns [${chain}]`);
        if (!chain) {
            const err = new Error(`There is not suitable property with name [${string}]`);
            logger.error(err);
            throw err;
        }
        return await getElementFromChain(baseElement, po, chain);
    }
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
/**
 * Finds and return whole chain-path to entered unique name:
 * @param  {Object} po page-object data;
 * @param  {String} name a name of element-key;
 * @returns {String} whole chain for entered unique name of element from page object.
 */
function getChain(po, name) {
    if (po.children) {
        const keys = Object.keys(po.children);
        let key = keys.find(key => key === name);
        if (key) {
            return key;
        } else {
            let result;
            key = keys.find(key => {
                result = getChain(po.children[key], name);
                return result;
            });
            return result ? `${key} > ${result}` : result;
        }
    } else {
        return undefined;
    }
}

module.exports = { getElement, getElementByName };