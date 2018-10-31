'use strict';

const pages = require('../source/pages.json');
const { logger, getStr, transport } = require('../configs/logger.conf');
const winston = require('winston');
const message = {}
logger.add(new winston.transports.File({
    name: 'element.helper-log',
    filename: './test/e2e/logs/element.helper.log',
    level: 'debug'
}));

/**
 * Defines current url and returns page-object as an object by path;
 * @returns {Object} an object with properties for current url by path
 */
async function getPageObject() {
    message.function = 'getPageObject';
    const currentUrl = await browser.getCurrentUrl();
    const [, appenderUrl] = /^(?:\w+\:\/\/\w+\.?\w+\.?\w+\/)(.*html)(#.*)?$/.exec(currentUrl);
    logger.debug(`Have been found current url: [${currentUrl}]. Path for searching needed page: [${appenderUrl}]`, message)
    if (!pages[appenderUrl]) {
        const error = new Error(`The framework has not included suitable page-object for this url [${appenderUrl}]`);
        logger.error(error);
        throw errror;
    } else {
        const resultPage = pages[appenderUrl][Object.keys(pages[appenderUrl]).find(key => /page/i.test(key))];
        logger.debug(`Was returned page: [${getStr(resultPage)}]`, message);
        return resultPage;
    }
}

/** 
 * Getter takes a string and returns element 
 * @param  {string} string a string with chain of properties or one name of property;
 * @returns {Element} return an needed element or array of elements
 */
async function getElement(string) {
    message.function = 'getElement';
    const po = await getPageObject();
    logger.info(`Was called function [getElement] with passed data: [${string}]`, message);
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
    message.function = 'getElementByName';
    logger.info(`Was called function [getElementByName] with passed data: [${string}], [${name}]`, message);
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
        logger.error(error, message);
        throw error;
    }
}

/**
 * Getter takes a string and return a regex that fit to the array regexes
 * @param  {string} string entered string for test;
 * @returns {RegExp} a regex that fit to the array regexes. 
 */
function getRegex(string) {
    message.function = 'getRegex';
    logger.debug(`Was called function [getRegex] with passed data: [${string}].`, message);
    let regexes = [/^#\d+/, /#\d+$/, /^#first/, /#first$/, /^#second/, /#second$/, /^#last/, /#last$/];
    logger.debug(`Avaliable regexes: [${getStr(regexes)}]`, message);
    regexes = regexes.filter(regex => regex.test(string.trim()));
    if (regexes.length > 1) {
        const error = new Error(`There is more than one option in [${string}].`);
        logger.error(error, message);
        throw error;
    } else {
        logger.debug(`Were/was found [${regexes}] and returns [${regexes[0]}]`, message)
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
    message.function = 'getElementFromChain';
    let names = chain.split(/\s?\>\s?/);
    if (po.children.hasOwnProperty(names[0].trim())) {
        for (let i = 0; i < names.length; i++) {
            baseElement = await getElementFromString(baseElement, po, names[i]);
            po = po.children[names[i].trim()];
        }
        return baseElement;
    } else {
        const prop = names[0];
        names[0] = await getChain(po, names[0]);
        if (!names[0]) {
            const err = new Error(`There is not the property [${prop}] in object [${po}] `);
            logger.error(err, message);
            throw err;
        }
        logger.debug(`getChain([${chain}]) returns [${names.join(' > ')}]`, message);
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
    message.function = 'getElementFromString';
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
    message.function = 'getElementByString';
    string = string.trim();
    if (po.children.hasOwnProperty(string)) {
        po = po['children'][string];
        if (!po) {
            const err = new Error(`There is no [children] property in object [${po}]`);
            logger.error(err, message);
            throw err;
        } else {
            return po.isCollection ? baseElement.all(by.css(po.selector)) : baseElement.element(by.css(po.selector));
        }
    } else {
        const chain = await getChain(po, string);
        logger.debug(`getChain([${string}]) returns [${chain}]`, message);
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
    message.function = 'getElementByRegex';
    logger.debug(`Was called function [getElementByRegex] for [${string}] and [${regex}]`, message);
    const index = getIndex(regex.exec(string)[0]);
    const name = string.replace(regex, '').trim();
    logger.debug(`Was found index and name: [${index}], [${name}]`, message);
    if (po.children.hasOwnProperty(name)) {
        po = po['children'][name];
        return (await baseElement.all(by.css(po.selector))).splice(index, 1)[0];
    } else {
        logger.warn(`There is no own property [${name}] in passed object: [${getStr(po)}]`, message);
        const chain = await getChain(po, string);
        logger.debug(`getChain([${string}]) returns [${chain}]`, message);
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
    message.function = 'getIndex';
    let index = string.replace('#', '');
    logger.debug(`Was called function [getIndex] with passed data: [${string}].`, message);
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