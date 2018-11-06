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
    return browser.wait(ec.elementToBeClickable(element))
        .then(() => element.click())
        .catch((error) => {
            logger.error(`Has been thrown the error withing performing the action click().\n Error: ${error}`, { func: 'clickOnElement' });
            throw error;
        });
}

function waitUntil(element, condition) {
    const func = getWaiterFunction(condition);
    return Array.isArray(element)? element.forEach(element=> browser.wait(func(element), 5000)): browser.wait(func(element), 5000);
    // element = Array.isArray(element) ? element[0]: element;
    // return browser.wait(func(element), 5000);
}

function getWaiterFunction(condition) {
    logger.info(`The function [getWaiterFunction] has been called with condition; [${condition}]`,  {func: 'getWaiterFunction'});
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
        logger.error(error, {func: 'getWaiterFunction'});
        throw error;
    }
    return conditions[condition].bind(ec);
}

function getText(elements) {
    if (Array.isArray(elements)) {
        const results = elements.map(element => element.getText());
        return Promise.all(results)
            .then((textArray) => {
                logger.debug(`Was return array with strings :[${getStr(textArray)}]`, { func: 'clickOnElement' });
                return textArray;
            })
            .catch((error) => {
                logger.error(`Has been thrown the error withing performing the action getText() all elements.\nError: ${error}`, { func: 'clickOnElement' });
                throw error;
            });
    } else {
        return elements.getText()
            .then((text) => {
                logger.debug(`Was return text :[${text}]`, { func: 'clickOnElement' }
                );
                return text;
            })
            .catch((error) => {
                logger.error(`Has been thrown the error withing performing the action getText().\nError: ${error}`, { func: 'clickOnElement' });
                throw error;
            });
    }
}

// function filter(elements, ...options) {
//     if (elements.length === options.length) {
//         return browser.wait(ec.presenceOf(...elements), 10000)
//             .then(() => options.forEach((option, ind) => {
//                 if (option !== 'Clear') {
//                     const opt = `//li[@role="radio"]/a[text()="${option}"][@class]`;
//                     $$('button[id*=tagsFilter]')
//                         .then((elems) => {
//                             browser.sleep(2000); return elems;
//                         })
//                         .then(elems => {
//                             browser.wait(ec.visibilityOf(elems[ind]), 5000); return elems;
//                         })
//                         .then(elems => {
//                             clickOnElement(elems[ind]); return elems;
//                         })
//                         .then(elems => elems[ind].element(by.xpath(opt)))
//                         .then(element => clickOnElement(element))
//                         .catch((error) => {
//                             logger.error(`Has been thrown the error withing performing the action filter(elements, ${options}]) \nError: ${error}`, { func: 'getRegExp' });
//                             throw error;
//                         });
//                 }
//             }));

//     } else {
//         const error = new Error('There are no equals an amount of elements');
//         logger.error(`Has been thrown the error withing performing the action filter([${elements}, ${options}]) \nError: ${error}`, { func: 'getRegExp' });
//         throw error;
//     }
// }

// function find(form, text) {
//     return browser.wait(ec.presenceOf(form), 5000)
//         .then(() => form.element(by.css('input')))
//         .then((field) => field.sendKeys(text))
//         .then(() => form.element(by.css('button')))
//         .then((button) => {
//             clickOnElement(button);
//         })
//         .catch((error) => {
//             logger.error(`Has been thrown the error withing performing the action find([${form}, ${text}]) \nError: ${error}`, { func: 'find' });
//             throw error;
//         });
// }

module.exports = { getText, clickOnElement, getRegExp, waitUntil };