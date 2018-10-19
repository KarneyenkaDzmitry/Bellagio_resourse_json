'use strict';

const { Given, When } = require('cucumber');
const {getElement} = require('../../utils/tester');

Given('I am on {string} url', function (string) {
    return browser.get(string);
    
});

When('I click {string}', function (string) {
    //console.log(string);
    return getElement(string).then(element=>{if (!element.click()) {console.log(element)}});
    
  });

  When('I wait for {string} seconds', function (string) {
    return browser.sleep(5000);
  });