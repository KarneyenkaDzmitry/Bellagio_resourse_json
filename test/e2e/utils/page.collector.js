'use strict';

const path = require('path');
const fs = require('fs');

function collector(sourceDir, destDir) {
    const files = getFiles(sourceDir);
    if (files.length === 0) throw new Error(`Passed directory [${sourceDir}] is empty.`);
    fs.existsSync(destDir) || fs.mkdirSync(destDir);
    const pages = getPages(sourceDir, files);
    fs.writeFileSync(`${destDir}/pages.json`, JSON.stringify(pages), 'utf8');
    return pages;
}

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

function createPage(page, sourceDir) {
    if (page.children) {
        Object.keys(page.children).forEach(key => {
            const ref = page.children[key].ref;
            if (ref) {
                const absPath = path.resolve(sourceDir, ref)
                page.children[key] = createPage(JSON.parse(fs.readFileSync(absPath)), path.dirname(absPath));
                delete page.children[key].ref;
            }
        });
    }
    return page;
}

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