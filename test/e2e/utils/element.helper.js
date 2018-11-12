'use strict';

const pages = require('../source/pages.json');
const { logger, getStr } = require('../configs/logger.conf');
const { waitUntil } = require('./page.actions');


/**
 * Defines current url and returns page-object as an object by path;
 * @returns {Object} an object with properties for current url by path
 */
async function getPageObject() {
    const currentUrl = await browser.getCurrentUrl();
    const [, appenderUrl] = /^(?:\w+\:\/\/\w+\.?\w+\.?\w+\/)(.*html)(#.*)?$/.exec(currentUrl);
    logger.debug(`Have been found current url: [${currentUrl}]. Path for searching needed page: [${appenderUrl}]`, { func: 'getPageObject' })
    if (!pages[appenderUrl]) {
        const error = new Error(`The framework has not included suitable page-object for this url [${appenderUrl}]`);
        logger.error(`${error}`, { func: 'getPageObject' });
        throw errror;
    } else {
        const resultPage = pages[appenderUrl][Object.keys(pages[appenderUrl]).find(key => /page/i.test(key))];
        logger.debug(`Was returned page: [${getStr(resultPage)}]`, { func: 'getPageObject' });
        return resultPage;
    }
}

/** 
 * Getter takes a string and returns element 
 * @param  {string} string a string with chain of properties or one name of property;
 * @returns {Element} return an needed element or array of elements
 */
async function getElement(string) {
    if (/^\$/.test(string)) {
        return storage.getValue(string);
    } else {
        const po = await getPageObject();
        logger.info(`Was called function [getElement] with passed data: [${string}]`, { func: 'getElement' });
        await waitUntil(await element(by.css(po.selector)), 'present');
        const baseElement = await element(by.css(po.selector));
        return /\s?\>\s?/.test(string) ? getElementFromChain(baseElement, po, string) : getElementFromString(baseElement, po, string);
    }
};

/** 
 * Getter takes a string, a name of option and returns element
 * @param  {string} string  a string with chain of properties or one name of property;
 * @param  {string} name name of options 
 * @returns {Element} return an needed element or array of elements
 */
async function getElementByName(string, name) {
    logger.info(`Was called function [getElementByName] with passed data: [${string}], [${name}]`, { func: 'getElementByName' });
    const elements = await getElement(string);
    try {
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
    } catch (error) {
        logger.error(`${error}`, { func: 'getElementByName' });
        throw error;
    }
}

/**
 * Getter takes a string and return a regex that fit to the array regexes
 * @param  {string} string entered string for test;
 * @returns {RegExp} a regex that fit to the array regexes. 
 */
function getRegex(string) {
    logger.debug(`Was called function [getRegex] with passed data: [${string}].`, { func: 'getRegex' });
    let regexes = [/^#\d+/, /#\d+$/, /^#first/, /#first$/, /^#second/, /#second$/, /^#last/, /#last$/];
    regexes = regexes.filter(regex => regex.test(string.trim()));
    if (regexes.length > 1) {
        const error = new Error(`There is more than one option in [${string}]. Regexes: [${getStr(regexes)}]`);
        logger.error(`${error}`, { func: 'getRegex' });
        throw error;
    } else {
        logger.debug(regexes.length > 0 ? `Were/was found [${regexes}] and returns [${regexes[0]}]` : 'No one regex was found!', { func: 'getRegex' });
        return regexes[0] === undefined ? '' : regexes[0];
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
    let { name, regex } = cleanName(names[0]);
    if (po.children.hasOwnProperty(name.trim())) {
        for (let i = 0; i < names.length; i++) {
            baseElement = await getElementFromString(baseElement, po, names[i]);
            names[i] = cleanName(names[i]).name;
            po = po.children[names[i].trim()];
            //logger.debug(`Was found element by selector: || ${await (Array.isArray(baseElement) ?  Promise.all(baseElement.map(elem => elem.locator())) : baseElement.locator())}`, {func:'getElementFromChain'});
        }
        return baseElement;
    } else {
        const prop = names[0];
        names[0] = await getChain(po, name) + ` ${regex}`;
        if (!names[0]) {
            const error = new Error(`There is not any the property [${prop}] belongs to object [${getStr(po)}] `);
            logger.error(`${error}`, { func: 'getElementFromChain' });
            throw error;
        }
        logger.debug(`getChain([${chain}]) returns [${names.join(' > ')}]`, { func: 'getElementFromChain' });
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
    logger.debug(`Was called function [getElementFromString] with passed data: [${string}] object: [${getStr(po)}]`, { func: 'getElementFromString' });
    let regex = /(\#\$\w+$)|(^\#\$\w+)/g;
    let arr = [];
    while ((arr = regex.exec(string)) !== null) string = string.replace(arr[0].substring(1), storage.getValue(arr[0].substring(1)));
    regex = getRegex(string);
    return regex !== '' ? getElementByRegex(baseElement, po, string, regex) : getElementByString(baseElement, po, string);
}

/**
 * Getter returns Element or Array of Elements according to string:
 * @param  {Element} baseElement base Element where search for;
 * @param  {Object} po object with data for needed page object with selectors;
 * @param  {String} string a string with name of property;
 * @returns {Element} return Element or array of Elements from string.
 */
async function getElementByString(baseElement, po, string) {
    string = string.trim();
    logger.debug(`Was called function [getElementByString] with passed data: [${string}] object: [${getStr(po)}]`, { func: 'getElementByString' });
    try {
        if (po.children.hasOwnProperty(string)) {
            po = po['children'][string];
            if (!po) {
                throw new Error(`There is no [children] property in object [${getStr(po)}]`);
            } else {
                if (Array.isArray(baseElement)) {
                    logger.debug(`Function [getElementByString] returned array with ${(po.isCollection ? `collection of elements [${string}] for each element in origin array by selector: ` :
                        `element [${string}] for each element in origin array by selector: `)} [${po.selector}]`, { func: 'getElementByString' });
                    return baseElement.map(base => po.isCollection ? base.all(by.css(po.selector)) : base.element(by.css(po.selector)));
                } else {
                    logger.debug(`Function [getElementByString] returned ${(po.isCollection ? `collection of elements [${string}] by selector: ` :
                        `element [${string}] by selector: `)} [${po.selector}]`, { func: 'getElementByString' });
                    return po.isCollection ? baseElement.all(by.css(po.selector)) : baseElement.element(by.css(po.selector));
                }
            }
        } else {
            const chain = await getChain(po, string);
            logger.debug(`getChain([${string}]) returns [${chain}]`, { func: 'getElementByString' });
            if (!chain) { throw new Error(`There is not any the property [${string}] belongs to object [${getStr(po)}] `) }
            return await getElementFromChain(baseElement, po, chain);
        }
    } catch (error) {
        logger.error(`${error}. Object: [${getStr(po)}]`, { func: 'getElementByString' });
        throw error;
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
    logger.debug(`Was called function [getElementByRegex] for [${string}] and [${regex}], po; [${getStr(po)}]`, { func: 'getElementByRegex' });
    const index = getIndex(regex.exec(string)[0]);
    const { name } = cleanName(string);
    logger.debug(`Was found index and name: [${index}], [${name}]`, { func: 'getElementByRegex' });
    if (po.children.hasOwnProperty(name)) {
        po = po['children'][name];
        logger.debug(`Function [getElementByRegex] returned the [${index + 1}] element from collection [${string}] by selector: [${po.selector}]`, { func: 'getElementByRegex' });
        return (await baseElement.all(by.css(po.selector))).splice(index, 1)[0];
    } else {
        logger.warn(`There is no own property [${name}] in passed object: [${getStr(po)}]`, { func: 'getElementByRegex' });
        const chain = await getChain(po, name) + ' ' + regex.exec(string)[0];
        logger.debug(`getChain([${name}]) returns [${chain}]`, { func: 'getElementByRegex' });
        if (!chain) {
            const error = new Error(`There is not suitable property with name [${name}]`);
            logger.error(`${error}`, { func: 'getElementByRegex' });
            throw error;
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
    logger.debug(`Was called function [getIndex] with passed data: [${string}].`, { func: 'getIndex' });
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

function cleanName(name) {
    let regex = getRegex(name);
    regex = regex === '' ? regex : regex.exec(name)[0];
    name = regex === '' ? name.trim() : name.replace(regex, '').trim();
    logger.debug(`The method [cleanName] returned [{${name}, ${regex}}`, { func: 'cleanName' });
    return { name, regex }
}

module.exports = { getElement, getElementByName };