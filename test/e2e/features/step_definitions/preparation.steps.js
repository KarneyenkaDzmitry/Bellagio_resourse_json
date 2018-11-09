'use strict';

const { Given, When, setDefaultTimeout } = require('cucumber');
const { getElement, getElementByName } = require('../../utils/element.helper');
const { getText, clickOnElement, waitUntil } = require('../../utils/page.actions');
const {scrollElementToMiddle} = require('../../utils/scroll.helper');
const { logger } = require('../../configs/logger.conf');
// setDefaultTimeout(60 * 1000);

Given(/^I am on '([^']*)' url$/, async (url) => {
  return browser.get(url);
});

When(/^I click '([^']*)'$/, async (chain) => {
  return clickOnElement(await getElement(chain));
});

When(/^I scroll to '([^']*)'$/, async (chain) => {
  return scrollElementToMiddle(await getElement(chain));
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

When(/^I type '([^']*)' in '([^']*)'$/, async (text, chain) => {
  return (await getElement(chain)).sendKeys(text);
});
