'use strict';

const { logger } = require('../configs/logger.conf.js');

function getCurrentPage() {
    return browser.getCurrentUrl()
        .then((currentUrl) => {
            const [, appenderUrl] = /^(?:\w+\:\/\/\w+\.?\w+\.?\w+\/)(.*html)(#.*)?$/.exec(currentUrl);
            logger.debug(`was get current URL [${currentUrl}]. The appender is [${appenderUrl}]`);
            switch (appenderUrl) {
            case 'en.html': return require('../page-objects/home.page.json');
            case 'en/hotel.html': return require('../page-objects/hotel.page.json');
            case 'en/entertainment.html': return require('../page-objects/entertainment.page.json');
            case 'en/restaurants.html': return require('../page-objects/restaurants.page.json');
            case 'en/itineraries/find-reservation.html': return require('../page-objects/reservation.page.json');
            case 'en/search.html': return require('../page-objects/search.page.json');
            default: logger.error(`The framework has not included suitable page-object for this url [${appenderUrl}]`);
                throw new Error(`The framework has not included suitable page-object for this url [${appenderUrl}]`);
            }
        });
}

function getNeededElementByName([name, elements]) {
    logger.debug(`Try to get element by name [${name}] from array [${Array.isArray(elements)}]`);
    name = name.toLowerCase();
    return getCurrentPage().then(page => {
        if (!Array.isArray(elements)) {
            if (page[name] !== undefined) {
                logger.debug(`Element was found [${name}] on the page-object [${page.constructor}]`);
                return page[name];
            } else {
                logger.error(`There is no the [${name}] element on the page [${page.path}].`);
                throw new Error(`There is no the [${name}] element on the current page.`);
            }
        } else {
            const elems = elements.map(element => element.getText());
            return Promise.all(elems)
                .then((results) => results.findIndex(elem => elem.toLowerCase() === (name.toLowerCase())))
                .then((index) => {
                    logger.debug(`Element was found [${name}] on the page-object [${page.constructor}]`);
                    return elements[index];
                })
                .catch(() => {
                    logger.error(`There is no the [${name}] element on the page [${page.path}].`);
                    throw new Error(`There is no the [${name}] element on the current page.`);
                });
        }
    });
}

function getNeededElementByNumber([number, elements]) {
    logger.debug(`Try to get element by number [${number}] from array [${Array.isArray(elements)}]`);
    if (Array.isArray(elements)) {
        return elements[Number.parseInt(number.substring(1, number.length))];
    } else {
        logger.error(`Were passed wrong parameters. The method takes [#numberOfElement, arrayOfWebElements].`);
        throw new Error('Were passed wrong parameters. The method takes [#numberOfElement, arrayOfWebElements].');
    }
}

/** The function takes name or number of element that it is supposed to find.
 *  defines current url and works with appropriate page
 *  finds and returns needed WebElement
 */
function getNeededElement(...args) {
    return args[0].includes('#') ? getNeededElementByNumber(args) : getNeededElementByName(args);
}



module.exports = { getNeededElement };