'use strict';

const { Given, When, setDefaultTimeout } = require('cucumber');
const { getElement, getElementByName } = require('../../utils/element.helper');
const { find, filter, getText, clickOnElement } = require('../../utils/page.actions');
const { expect } = require('chai');
const { logger } = require('../../configs/logger.conf');
// setDefaultTimeout(60 * 1000);

Given(/^I am on '([^']*)' url$/, async (url) => {
  return browser.get(url);
});

When(/^I click '([^']*)'$/,async (chain) => {
  return clickOnElement(await getElement(chain));
});

When(/^I click '([^']*)' text in '([^']*)'$/, async  (name, chain) => {
  return clickOnElement(await getElementByName(chain, name));
});

When(/^I wait for '([^']*)' seconds$/,async (sec) => {
 return await browser.sleep(sec * 1000); 
});

When(/^I wait until '([^']*)' is (visible|present)$/, async (chain, condition) => {
  // console.log(condition);
  switch (condition) {
    case 'present': return expect(await (await getElement(chain)).isPresent()).to.be.true;
    case 'visible': return expect(await (await getElement(chain)).isVisible()).to.be.true;
    default: throw new Error(`There are not a suitable condition. There are [present] or [visible], but was received: [${condition}]`)
  }
});
