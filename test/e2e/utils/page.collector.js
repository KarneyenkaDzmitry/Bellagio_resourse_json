'use strict';

const path = require('path');
const fs = require('fs');
const { logger } = require('../configs/logger.conf');

/**
 * The method collects all data for page objects in one Object, then write the data to pages.json file
 * @param  {String} sourceDir path to folder with data json files that describes pages;
 * @param  {String} destDir a path to directory where should save total data.json file;
 * @returns {Object} an object with all pages data; 
 */
function collector(sourceDir, destDir) {
    const files = getFiles(sourceDir);
    if (files.length === 0) throw new Error(`Passed directory [${sourceDir}] is empty.`);
    fs.existsSync(destDir) || fs.mkdirSync(destDir);
    const pages = getPages(sourceDir, files);
    fs.writeFileSync(`${destDir}/pages.json`, JSON.stringify(pages), 'utf8');
    return pages;
}

/**
 * Getter returns Object that describes all pages:
 * @param  {String} sourceDir a path to folder with data json files that describes pages;
 * @param  {Array} files an array with names of json files; 
 * @returns {Object} final Object with all data for pages.
 */
function getPages(sourceDir, files) {
    let pages = {};
    files.forEach(file => {
        const absPath = path.resolve(sourceDir, file);
        if (fs.statSync(absPath).isFile()) {
            let object = JSON.parse(fs.readFileSync(absPath));
            const pageName = Object.keys(object).find(key => /page/i.test(key));
            const page = object[pageName];
            if (page.path) {
                object = pages[page.path] = {};
                delete page.path;
                object[`${pageName}`] = createPage(page, sourceDir);
            } else {
                throw new Error(`There is not property [path] in file [${absPath}]`);
            };
        }
    });
    return pages;
}

/**
 * Getter returns an Object with all data for one page:
 * @param  {Object} page an object of page that contains references to componenets;
 * @param  {String} sourceDir a path to current directory;
 * @returns {Object} an Object with all data for one page.
 */
function createPage(page, sourceDir) {
    if (page.children) {
        Object.keys(page.children).forEach(key => {
            const ref = page.children[key].ref;
            if (ref) {
                const absPath = path.resolve(sourceDir, ref)
                const isCollection = page.children[key].isCollection;
                page.children[key] = createPage(JSON.parse(fs.readFileSync(absPath)), path.dirname(absPath));
                isCollection ? page.children[key].isCollection = true : '';
            }
        });
    }
    return page;
}

/**
 * Getter returns an array with names of all json files from passed directory.
 * @param  {String} dir path to directory;
 * @returns {Array} an array with names of all json files from passed directory.
 */
function getFiles(dir) {
    const stats = fs.statSync(dir);
    if (stats.isDirectory()) {
        const files = fs.readdirSync(dir);
        return files.filter(file => file.endsWith('.json'));
    } else {
        throw new Error(`The passed source path [${dir}] is not a directory.`);
    }
}
collector('./test/e2e/page-objects/pages', './test/e2e/source');
module.exports = { collector }