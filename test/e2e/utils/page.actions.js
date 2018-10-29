'use strict';

const { logger } = require('../configs/logger.conf.js');

function getRegExp(string) {
    if (/^\/(.*)\/(\w*)$/.test(string)) {
        const array = string.split('/');
        return new RegExp(array[1], array[2]);
    } else {
        const err = new Error('The passed string does not fit to RegExp pattern [^\\/(.*)\\/(\\w*)$]');
        logger.error(err);
        throw err;
    }
}

function clickOnElement(element) {
    return browser.wait(ec.elementToBeClickable(element))
        .then(() => element.click())
        .catch((error) => {
            logger.error(`Has been thrown the error withing performing the action [${element}] click()`, error);
            throw error;
        });
}

function getText(elements) {
    if (Array.isArray(elements)) {
        const results = elements.map(element => element.getText());
        return Promise.all(results)
            .then((textArray) => {
                logger.debug(`Was return array with strings :[${textArray}]`);
                return textArray;
            })
            .catch((error) => {
                logger.error(`Has been thrown the error withing performing the action getText([${elements}]) all elements` + error);
                throw error;
            });
    } else {
        return elements.getText()
            .then((text) => {
                logger.debug(`Was return text :[${text}]`);
                return text;
            })
            .catch((error) => {
                logger.error(`Has been thrown the error withing performing the action getText([${elements}])` + error);
                throw error;
            });
    }
}

function filter(elements, ...options) {
    if (elements.length === options.length) {
        return browser.wait(ec.presenceOf(...elements), 10000)
            .then(() => options.forEach((option, ind) => {
                if (option !== 'Clear') {
                    const opt = `//li[@role="radio"]/a[text()="${option}"][@class]`;
                    $$('button[id*=tagsFilter]')
                        .then((elems) => {
                            browser.sleep(2000); return elems;
                        })
                        .then(elems => {
                            browser.wait(ec.visibilityOf(elems[ind]), 5000); return elems;
                        })
                        .then(elems => {
                            clickOnElement(elems[ind]); return elems;
                        })
                        .then(elems => elems[ind].element(by.xpath(opt)))
                        .then(element => clickOnElement(element))
                        .catch((error) => {
                            logger.error(`Has been thrown the error withing performing the action filter([${elements}, ${options}])`, error);
                            throw error;
                        });
                }
            }));

    } else {
        const error = new Error('There are no equals an amount of elements ');
        logger.error(`Has been thrown the error withing performing the action filter([${elements}, ${options}])`, error);
        throw error;
    }
}

function find(form, text) {
    return browser.wait(ec.presenceOf(form), 5000)
        .then(() => form.element(by.css('input')))
        .then((field) => field.sendKeys(text))
        .then(() => form.element(by.css('button')))
        .then((button) => {
            clickOnElement(button);
        })
        .catch((error) => {
            logger.error(`Has been thrown the error withing performing the action find([${form}, ${text}])`, error);
            throw error;
        });
}

module.exports = { find, filter, getText, clickOnElement, getRegExp };