'use strict';

const { Given, When, Then } = require('cucumber');
const { getElement, getElementByName } = require('../../utils/element.helper');
const { find, filter, getText, clickOnElement } = require('../../utils/page.actions');
const { expect } = require('chai');

Given(/^I am on '([^']*)' url$/, async (url) => {
  return browser.get(url);
});

When(/^I click '([^']*)'$/, (chain) => {
  return getElement(chain)
    .then(element => clickOnElement(element));
});

When(/^I click '([^']*)' text in '([^']*)'$/, (name, chain) => {
  return getElementByName(chain, name)
    .then((element) => clickOnElement(element));
});

When(/^I wait for '([^']*)' seconds$/, (sec) => {
  return browser.sleep(sec * 1000);
});

When(/^I wait until '([^']*)' is (visible|present)$/, async (chain, condition) => {
  switch (condition) {
    case 'present': return expect(await (await getElement(chain)).isPresent()).to.be.true;
    case 'visible': return expect(await (await getElement(chain)).isVisible()).to.be.true;
    default: throw new Error(`There are not a suitable condition. There are [present] or [visible], but was received: [${condition}]`)
  }
});

Then(/^Text of '([^']*)' should (not)? (contain|equal) '([^']*)' text$/, async (chain, negative, condition, text) => {
  switch (condition) {
    case 'equal': return expect(await (await getElement(chain)).getText()).to.be.equal(text);
    case 'contain': return expect(await (await getElement(chain)).getText()).to.contain(text);
    default: throw new Error(`There are not a suitable condition. There are [contain] or [equal], but was received: [${condition}]`)
  }
});