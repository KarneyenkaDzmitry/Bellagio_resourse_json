'use strict';

const { collector } = require('../../e2e/utils/page.collector');
const expectedJson = require('../data/expected.pages.json');
const path = require('path');
const { expect } = require('chai');

describe('Unit tests of collector functionality', () => {
    it('Result json should equals expected json',async () => {
        await collector('./test/unit/data/page-snippets/pages', './test/unit/source')
        expect(require('../source/pages.json')).to.deep.equals(expectedJson);
    });
});