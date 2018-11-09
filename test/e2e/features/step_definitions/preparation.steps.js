'use strict';

const { Given, When, setDefaultTimeout } = require('cucumber');
const { getElement, getElementByName } = require('../../utils/element.helper');
const { getText, clickOnElement, waitUntil } = require('../../utils/page.actions');
const { logger } = require('../../configs/logger.conf');
// setDefaultTimeout(60 * 1000);

Given(/^I am on '([^']*)' url$/, async (url) => {
  return browser.get(url);
});

When(/^I click '([^']*)'$/, async (chain) => {
  return clickOnElement(await getElement(chain));
});

When(/^I scroll (up|dawn) until '([^']*)' is present$/, async (direction, chain) => {
  const element = await browser.element(by.css('#footer-offer-signup-email'));
  const element2 =  await browser.element(by.css('#tagsFilter-0-entertainment-btn'));//await getElement(chain);
  let scrollElementToMiddle = function (element) {
    return Promise.all([
      element.getLocation(),
      browser.executeScript('return window.document.body.offsetHeight'),
      browser.executeScript('return window.outerHeight')])
      .then(([location, scrollLength, outerHeight]) => {
        var elementYpos = location.y;
        logger.info(`scrollLength: [${scrollLength}]`);
        logger.info(`elementYpos: [${elementYpos}]`);
        logger.info(`elementXpos: [${location.x}]`);
        logger.info(`outerHeight: [${outerHeight}]`);
        if (scrollLength - elementYpos < outerHeight * 0.5) {
          return elementYpos;
        } else {
          return elementYpos - outerHeight * 0.5;
        }
      })
      .then(function (scrollTo) {
        logger.info("scrollTo:", scrollTo);
        return browser.executeScript('window.scrollTo(0, arguments[0])', scrollTo);
      });
  };
  await scrollElementToMiddle(element);
  await browser.sleep(15000);
  return scrollElementToMiddle(element2);
  
  // // return browser.executeScript('window.scrollBy(0,-250)');
  // browser.refresh();
  // return browser.executeScript('window.scrollTo(0, document.body.scrollTop)')
});

When(/^I click '([^']*)' text in '([^']*)'$/, async (name, chain) => {
  return clickOnElement(await getElementByName(chain, name));
});

When(/^I wait for '([^']*)' seconds$/, async (sec) => {
  return browser.sleep(sec * 1000);
});

When(/^I wait until '([^']*)' is (visible|present|clickable|invisible|selected|gone)$/, async (chain, condition) => {
  return waitUntil(await getElement(chain), condition);
});
