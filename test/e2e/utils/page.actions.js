'use strict';

const { logger, getStr } = require('../configs/logger.conf');

function getRegExp(string) {
    if (/^\/(.*)\/(\w*)$/.test(string)) {
        const array = string.split('/');
        return new RegExp(array[1], array[2]);
    } else {
        const error = new Error('The passed string does not fit to RegExp pattern [^\\/(.*)\\/(\\w*)$]');
        logger.error(`${error}`, { func: 'getRegExp' });
        throw error;
    }
}

function clickOnElement(element) {
    return waitUntil(element, 'clickable')
        .then(() => element.click())
        .catch((error) => {
            logger.error(`Has been thrown the error withing performing the action click().\n Error: ${error}`, { func: 'clickOnElement' });
            throw error;
        });
}

function waitUntil(element, condition) {
    const func = getWaiterFunction(condition);
    if (Array.isArray(element)){
        return Promise.all(element.map(element => browser.wait(func(element), 5000)));
    } else {
        return browser.wait(func(element), 5000)
    } 
}

function getWaiterFunction(condition) {
    logger.info(`The function [getWaiterFunction] has been called with condition: [${condition}]`, { func: 'getWaiterFunction' });
    const conditions = {
        present: ec.presenceOf,
        clickable: ec.elementToBeClickable,
        visible: ec.visibilityOf,
        invisible: ec.invisibilityOf,
        selected: ec.elementToBeSelected,
        gone: ec.stalenessOf
    }
    if (!conditions[condition]) {
        const error = new Error(`Wrong passed parameter: [${condition}]. Variants of conditions are: [${getStr(conditions)}]`);
        logger.error(error, { func: 'getWaiterFunction' });
        throw error;
    }
    return conditions[condition].bind(ec);
}

function checkElement(element, condition) {
    const conditions = {
        present: element.isPresent,
        enabled: element.isEnabled,
        selected: element.isSelected,
        displayed: element.isDisplayed 
    }
    if (!conditions[condition]) {
        const error = new Error(`Wrong passed parameter: [${condition}]. Variants of conditions are: [${getStr(conditions)}]`);
        logger.error(error, { func: 'checkElement' });
        throw error;
    }
    return conditions[condition].bind(element)();
}

function getText(elements) {
    if (Array.isArray(elements)) {
        if (elements.find(elem=>typeof elem !== 'object')) return elements;
        return Promise.all(elements.map(element => element.getText()))
            .then((textArray) => {
                logger.debug(`Was return array with strings :[${getStr(textArray)}]`, { func: 'getText' });
                return textArray;
            })
            .catch((error) => {
                logger.error(`Has been thrown the error withing performing the action getText() all elements.\nError: ${error}`, { func: 'getText' });
                throw error;
            });
    } else {
        if (typeof elements !== 'object') return elements;
        return elements.getText()
            .then((text) => {
                logger.debug(`Was return text :[${text}]`, { func: 'getText' }
                );
                return text;
            })
            .catch((error) => {
                logger.error(`Has been thrown the error withing performing the action getText().\nError: ${error}`, { func: 'getText' });
                throw error;
            });
    }
}

module.exports = { getText, clickOnElement, getRegExp, waitUntil, checkElement };