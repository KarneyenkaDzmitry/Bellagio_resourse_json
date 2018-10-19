'use strict';

const { Given, When } = require('cucumber');
const { getElement, getElementByName } = require('../../utils/tester');

Given('I am on {string} url', function (string) {
  return browser.get(string);
});

When('I click {string}', function (string) {
  return getElement(string).then(element => element.click());
});

When('I choose option by text {string} from {string}', function (string, string2) {
  return getElementByName(string2, string).then((element) => element.click());
});

When('I wait for {string} seconds', function (string) {
  return browser.sleep(5000);
});