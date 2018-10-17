'use strict';

const { collector } = require('../../e2e/utils/page.collector');
const expectedJson = require('../data/expected.pages.json');
const pathToExistingFile = './test/unit/data/expected.pages.json';
const { expect } = require('chai');
const pageTemplatesDir = './test/unit/data/page-snippets/pages';
const destDir = './test/unit/source'
const nonExistingFolder = './nonExistentDir';
const emptyDir = './test/unit/data/emptyDir'


describe('Unit tests of collector functionality', () => {

    it('Result json should equals expected json', async () => {
        collector(pageTemplatesDir, destDir)
        expect(require(`../source/pages.json`)).to.deep.equals(expectedJson);
    });

    it('should throw an error if a directory with pages does not exist', () => {
        expect(function () { collector(nonExistingFolder, destDir) }).to.throw(Error);
    })

    it('should throw an error if a passed path is not a directory', () => {
        expect(function () { collector(pathToExistingFile, destDir) }).to.throw(Error, `The passed source path [${pathToExistingFile}] is not a directory.`);
    })

    it('should throw an error if the directory is empty', () => {
        expect(function () { collector(emptyDir, destDir) }).to.throw(Error, `Passed directory [${emptyDir}] is empty.`);
    })

    // it('should throw an error if an element does not have a selector', () => {
    //     expect(function () { collector.getAllPages('.' + incorrectDir) }).to.throw(Error, 'Object { name: \'page\',\n  url: \'\',\n  children: { Header: { ref: \'./components/header/header.json\' } } } doesn\'t have a selector!');
    // })
});