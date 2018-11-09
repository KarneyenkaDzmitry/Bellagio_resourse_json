'use strict';

const { Then, setDefaultTimeout } = require('cucumber');
const { getElement, getElementByName } = require('../../utils/element.helper');
const { getText, checkElement } = require('../../utils/page.actions');
const { expect } = require('chai');
const { logger, getStr } = require('../../configs/logger.conf');

// setDefaultTimeout(60 * 1000);

Then(/^(Text|Number) of '([^']*)' should (contain|equal) '([^']*)'$/, async (isNumber, chain, condition, text) => {
    if (isNumber === 'Number') {
        switch (condition) {
            case 'equal': return expect((await getText(await getElement(chain))).length).to.be.equal(Number.parseInt(text));
            default: throw new Error(`There are not a suitable condition. There is [equal] with [number], but was received: [${condition}]`)
        }
    } else {
        switch (condition) {
            case 'equal': return expect(await getText(await getElement(chain))).to.be.equal(text);
            case 'contain': return expect(await getText(await getElement(chain))).to.contain(text);
            default: throw new Error(`There are not a suitable condition. There are [contain] or [equal] with [text], but was received: [${condition}]`)
        }
    }

});

Then(/^'([^']*)' should( not)? be (displayed|enabled|present|selected)$/, async (chain, notArg, condition) => {
    const result = await checkElement(await getElement(chain), condition);
    logger.info(`Element should be ${condition} is :[${result}]`, { func: 'checks.steps' });
    return notArg ? expect(result).to.be.false : expect(result).to.be.true;
});

Then(/^I should see the following lines in '([^']*)'$/, async (chain, table) => {
    let error = false;
    const elements = await getText(await getElement(chain));
    table = table.raw().reduce((a, b) => a.concat(b));
    try {
        if (Array.isArray(elements)) {
            table.forEach((text, index) => {
                if (text != elements[index]) {
                    logger.error(`[${elements[index]}] Text is not equal: [${text}]`, { func: 'checks.steps' });
                    error = true;
                }
                expect(text).to.be.equal(elements[index]);
            });
            if (error) {
                throw new Error("Error. Some elements do not match! See error-log");
            }
        } else {
            throw new Error(`[${elements}] is not an array!`);
        }
    } catch (error) {
        logger.error(error, { func: 'checks.steps' })
        throw error;
    }
    return expect(elements).to.deep.equal(table);
});
