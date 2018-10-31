'use strict';

const { Then, setDefaultTimeout } = require('cucumber');
const { getElement, getElementByName } = require('../../utils/element.helper');
const { find, filter, getText, clickOnElement } = require('../../utils/page.actions');
const { expect } = require('chai');

// setDefaultTimeout(60 * 1000);

Then(/^Text of '([^']*)' should (contain|equal) '([^']*)' text$/, async (chain, condition, text) => {
    switch (condition) {
        case 'equal': return expect(await getText(await getElement(chain))).to.be.equal(text);
        case 'contain': return expect(await getText(await getElement(chain))).to.contain(text);
        default: throw new Error(`There are not a suitable condition. There are [contain] or [equal], but was received: [${condition}]`)
    }
});

// Then(/^I wait until '([^']*)' is (visible|present)$/, async (chain, condition) => {
//   switch (condition) {
//     case 'present': return expect(await (await getElement(chain)).isPresent()).to.be.true;
//     case 'visible': return expect(await (await getElement(chain)).isVisible()).to.be.true;
//     default: throw new Error(`There are not a suitable condition. There are [present] or [visible], but was received: [${condition}]`)
//   }
// });