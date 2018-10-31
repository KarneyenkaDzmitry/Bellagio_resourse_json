'use strict';

const path = require('path');
const fs = require('fs');
const { logger, getStr, transport } = require('../configs/logger.conf');
const message = {};
const winston = require('winston')
logger.add(new winston.transports.File({
    name: 'page.collector-log',
    filename: './test/e2e/logs/page.collector.log',
    level: 'debug'
})).remove(transport.combined);

/**
 * The method collects all data for page objects in one Object, then write the data to pages.json file
 * @param  {String} sourceDir path to folder with data json files that describes pages;
 * @param  {String} destDir a path to directory where should save total data.json file;
 * @returns {Object} an object with all pages data; 
 */
function collector(sourceDir, destDir) {
    message.function = 'collector';
    logger.info(`Have been passed data: sourceDir-[${sourceDir}], destDir-[${destDir}]`, message );
    const files = getFiles(sourceDir);
    if (files.length === 0) {
        const err = new Error(`Passed directory [${sourceDir}] is empty.`);
        logger.error(err, message);
        throw err;
    }
    fs.existsSync(destDir) || fs.mkdirSync(destDir);
    const pages = getPages(sourceDir, files);
    try {
        fs.writeFileSync(`${destDir}/pages.json`, JSON.stringify(pages), 'utf8');
    } catch (err) {
        logger.error(err, message);
        throw err;
    }
    return pages;
}

/**
 * Getter returns Object that describes all pages:
 * @param  {String} sourceDir a path to folder with data json files that describes pages;
 * @param  {Array} files an array with names of json files; 
 * @returns {Object} final Object with all data for pages.
 */
function getPages(sourceDir, files) {
    message.function = 'getPages';
    logger.debug(`Have been passed data: sourceDir-[${sourceDir}], files-[${getStr(files)}]`, message );
    let pages = {};
    files.forEach(file => {
        try {
            const absPath = path.resolve(sourceDir, file);
            if (fs.statSync(absPath).isFile()) {
                let object = JSON.parse(fs.readFileSync(absPath));
                const pageName = Object.keys(object).find(key => /page/i.test(key));
                logger.debug(` Was found page - [${pageName}] with path - [${object[pageName].path}]`, message);
                const page = object[pageName];
                if (page.path) {
                    object = pages[page.path] = {};
                    delete page.path;
                    object[`${pageName}`] = createPage(page, sourceDir);
                } else {
                    throw new Error(`There is not property [path] in file [${absPath}]`);
                };
            }
        } catch (err) {
            logger.error(err, message);
            throw err;
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
    message.function = 'createPage';
    logger.debug(`Have been passed data: page-[${getStr(page)}], sourceDir-[${sourceDir}]`, message);
    if (page.children) {
        Object.keys(page.children).forEach(key => {
            const ref = page.children[key].ref;
            if (ref) {
                try {
                    const absPath = path.resolve(sourceDir, ref)
                    const isCollection = page.children[key].isCollection;
                    page.children[key] = createPage(JSON.parse(fs.readFileSync(absPath)), path.dirname(absPath));
                    isCollection ? page.children[key].isCollection = true : '';
                } catch (err) {
                    logger.error(err, message);
                    throw err;
                }
            }
        });
    } else {
        logger.warn(`There is not property [children] in object [${getStr(page)}]`, message)
    }
    logger.debug(`Was returned page - [${getStr(page)}]`, message);
    return page;
}

/**
 * Getter returns an array with names of all json files from passed directory.
 * @param  {String} dir path to directory;
 * @returns {Array} an array with names of all json files from passed directory.
 */
function getFiles(dir) {
    message.function = 'getFiles';
    logger.debug(`Have been passed data: dir-[${dir}]`, message);
    try {
        const stats = fs.statSync(dir);
        if (stats.isDirectory()) {
            let files = fs.readdirSync(dir);
            files = files.filter(file => file.endsWith('.json'));
            logger.debug(`Was returned list of files - ${getStr(files)}`, message);
            return files;
        } else {
            throw new Error(`The passed source path [${dir}] is not a directory.`);
        }
    } catch (err) {
        logger.error(err, message);
        throw err;
    }
}
collector('./test/e2e/page-objects/pages', './test/e2e/source');
module.exports = { collector }