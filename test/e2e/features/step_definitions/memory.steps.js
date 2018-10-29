'use strict';

const { When, setDefaultTimeout } = require('cucumber');
const { getElement, getElementByName } = require('../../utils/element.helper');
const { find, filter, getText, clickOnElement, getRegExp } = require('../../utils/page.actions');
// setDefaultTimeout(60 * 1000);

When(/^I remember (text|number) of '([^']*)' as '(\$\w+)'$/, async (condition, chain, name) => {
    return storage.store(name, condition === 'number' ? (await getElement(chain)).length : await getText(await getElement(chain)));
});

When(/^I remember attribute '([^']*)' of '([^']*)' as '(\$\w+)'$/, async (attribute, chain, name) => {
    return storage.store(name, await (await getElement(chain)).getAttribute(attribute));
});

When(/^I remember page title as '(\$\w+)'$/, async (name) => {
    return await storage.store(name, await browser.getTitle());
});

When(/^I remember index of '([^']*)' (matching|containing) '([^']*)' as '(\$\w+)'$/, async (chain, condition, regex, name) => {
    const elements = await getText(await getElement(chain));
    regex = condition === 'matching' ? getRegExp(regex) : regex;
    const index = condition === 'matching' ? elements.findIndex(element => regexp.test(element)) :
        elements.findIndex(element => element.toLowerCase().includes(regex));
    return storage.store(name, index);
});

