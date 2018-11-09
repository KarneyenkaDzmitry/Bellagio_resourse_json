'use strict';

const { logger, getStr } = require('../configs/logger.conf');

function scrollElementToMiddle(element) {
    return Promise.all([
        element.getLocation(),
        browser.executeScript('return window.document.body.offsetHeight'),
        browser.executeScript('return window.outerHeight')])
        .then(([location, scrollLength, outerHeight]) => {
            logger.debug(`elementXpos: [${location.x}], elementYpos: [${location.y}], scrollLength: [${scrollLength}], outerHeight: [${outerHeight}]`, { func: 'scrollElementToMiddle' });
            return (scrollLength - location.y < outerHeight * 0.5) ? location.y : location.y - outerHeight * 0.5;
        })
        .then((scrollTo) => {
            logger.debug(`scrollTo: [${scrollTo}]`, { func: 'scrollElementToMiddle' });
            return browser.executeScript('window.scrollTo(0, arguments[0])', scrollTo);
        });
};

module.exports = { scrollElementToMiddle }