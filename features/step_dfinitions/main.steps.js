'use strict';

const { When, Then, Given, setDefaultTimeout } = require('cucumber');
setDefaultTimeout(20 * 5000);
const helper = require('../../utils/page.helper.js');
const actions = require('../../utils/page.actions.js');
const { expect } = require('chai');

Given(/^I am on the home page '([^']*)'$/, async(host) => {
    return await browser.get(host);
});

Given(/I am on '([^']*)' page/, async(pageName) => {
    return (await helper.getNeededElement(pageName)).click();
});

Given(/I have chosen '([^']*)' component/, async(componentName) => {
    return (await helper.getNeededElement(componentName)).click();
});

When(/I click on '([^']*)' reference/, async(refer) => {
    return await actions.clickOnElement(await helper.getNeededElement(refer));
});

Then(/^I should see '([^']*)' text in '([^']*)' of a body$/, async(expectedText, element) => {
    return expect(await actions.getText(await helper.getNeededElement(element))).to.be.equals(expectedText);
});

Then(/^'([^']*)' should be '([^']*)'$/, async(elementName, option) => {
    return option === 'present'? 
    expect(await (await helper.getNeededElement(elementName)).isPresent()).to.be.true
    :
    expect(await (await helper.getNeededElement(elementName)).isPresent()).to.be.false;
});

When(/^I use filter with options cousine = '([^']*)', price = '([^']*)', meal = '([^']*)'$/, async(cousine, price, meal) => {
    const elementsButtons = await helper.getNeededElement('body filter buttons');
    return await actions.filter(elementsButtons, cousine, price, meal);
});

Then(/^I should see '([^']*)' in '([^']*)'$/, async(shouldContainsText, array) => {
    return expect((await actions.getText(await helper.getNeededElement(array))).indexOf(shouldContainsText) > -1).to.be.true;
});

Then(/^'([^']*)' should have '(\d+)' elmement$/, async(array, number) => {
    return expect((await actions.getText(await helper.getNeededElement(array))).length).to.be.equals(number);
});

When(/^I choose the option by text '([^']*)' on menu '([^']*)'$/, async(option, menu) => {
    return await actions.clickOnElement(await helper.getNeededElement(option, await helper.getNeededElement(menu)));
});

When(/^I choose '([^']*)' in field '([^']*)'$/, async(option, field) => {
    return await actions.clickOnElement(await helper.getNeededElement(option));
});

Then(/^'([^']*)' should be selected and contains text '([^']*)'$/, async(option, text) => {
    const element = await helper.getNeededElement(option);
    expect(await element.isSelected()).to.be.true;
    expect(await actions.getText(element)).to.be.equals(text);
});

Then(/^I should see input field with text '([^']*)'$/, async(text) => {
    const element = await helper.getNeededElement('search component field');
    expect(await element.isPresent()).to.be.true;
    expect(await element.getAttribute('placeholder')).to.be.equals(text);
});

Then(/^'([^']*)' button with text '([^']*)'$/, async(option, text) => {
    expect(await (await helper.getNeededElement('search component button')).isEnabled()).to.be.equals(option !== 'disabled');
    expect(await actions.getText(await helper.getNeededElement('search component button'))).to.be.equals(text);
});

When(/^I search for '([^']*)'$/, async(text) => {
    return await actions.find(await helper.getNeededElement('search component form'), text);
});

Then(/^I should see results contains '([^']*)' in the body$/, async(expectedText) => {
    await browser.refresh();
    expect((await actions.getText(await helper.getNeededElement('body results headers'))).includes(expectedText)).to.be.true;
});

Then(/^I should see message '([^']*)' in the body of the page$/, async(expectedMessage) => {
    await browser.refresh();
    return expect(await actions.getText(await helper.getNeededElement('body no result message'))).to.be.equals(expectedMessage);
});