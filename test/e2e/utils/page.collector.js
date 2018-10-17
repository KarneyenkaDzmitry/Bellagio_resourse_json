'use strict';

const path = require('path');
const fs = require('fs');

function collector(sourceDir, destDir) {
    let pages = {};
    const files = getFiles(sourceDir);
    if (files.length===0) throw new Error(`Passed directory [${sourceDir}] is empty.`); 
    fs.existsSync(destDir)||fs.mkdirSync(destDir);
    files.forEach(file => {
        const absPath = path.resolve(sourceDir, file);
        const stat = fs.statSync(absPath)
        if (stat.isFile()) {
            const page = JSON.parse(fs.readFileSync(absPath));
            page.path ? pages[page.path] = createPage(page, sourceDir) : '';
        }
    });
    fs.writeFileSync(`${destDir}/pages.json`, JSON.stringify(pages), 'utf8');
    return pages;
}

function createPage(page, sourceDir) {
    Object.keys(page.children).forEach(key => {
        const ref = page.children[key].ref;
        if (ref) {  
            const absPath = path.resolve(sourceDir, ref)
            page.children[key] = createPage(JSON.parse(fs.readFileSync(absPath)), path.dirname(absPath) ); 
            delete page.children[key].ref;
        } 
    });
    return page;
}

function getFiles(dir) {
    const stats = fs.statSync(dir);
    if (stats.isDirectory()) {
        const files = fs.readdirSync(dir);
        return files.filter(file=>file.endsWith('.json'));
    } else {
        throw new Error(`The passed source path [${dir}] is not a directory.`);
    }
}

collector('./test/e2e/page-objects/pages', './test/e2e/source');

module.exports = { collector }