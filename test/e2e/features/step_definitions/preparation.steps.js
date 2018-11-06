'use strict';

const { Given, When, setDefaultTimeout } = require('cucumber');
const { getElement, getElementByName } = require('../../utils/element.helper');
const { find, filter, getText, clickOnElement, waitUntil } = require('../../utils/page.actions');
const { expect } = require('chai');
const { logger } = require('../../configs/logger.conf');
// setDefaultTimeout(60 * 1000);

Given(/^I am on '([^']*)' url$/, async (url) => {
  return browser.get(url);
});

When(/^I click '([^']*)'$/, async (chain) => {
  return clickOnElement(await getElement(chain));
});

When(/^I scroll (up|dawn) until '([^']*)' is present$/, async (direction, chain) => {
    // return browser.executeScript('window.scrollBy(0,-250)');
    browser.refresh();
    return browser.executeScript('window.scrollTo(0, document.body.scrollTop)')
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
