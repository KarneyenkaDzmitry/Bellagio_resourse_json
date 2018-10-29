'use strict';

const { When } = require('cucumber');
const { getElement, getElementByName } = require('../../utils/element.helper');
const { find, filter, getText, clickOnElement } = require('../../utils/page.actions');
const { expect } = require('chai');
const { logger } = require('../../configs/logger.conf');


When(/^I remember (text|number) of '([^']*)' as '(\$\w+)'$/, async (condition, chain, name) => {
    return /^\$/.test(name) ? storage.store(name, condition === 'number' ? (await getElement(chain)).length : await getText(await getElement(chain))) :
        "";
});

When(/^I remember attribute '([^']*)' of '([^']*)' as '(\$\w+)'$/, async (attribute, chain, name) => {
    return /^\$/.test(name) ? storage.store(name, await (await getElement(chain)).getAttribute(attribute)) :
        "";
});

When(/^I remember page title as '(\$\w+)'$/, async (name) => {
    /^\$/.test(name) ? await storage.store(name, await browser.getTitle()) : '';
    // logger.info(storage.getProperties() + (await browser.getSession()).getId());
});

When(/^I remember index of '([^']*)' matching '([^']*)' as '(\$\w+)'/, async (chain, regex, name) => {

});
