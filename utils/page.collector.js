'use strict';

const path = require('path');
const fs = require('fs');

async function collector(sourceDir, destDir) {
    let pages = {};
    const files = getFiles(sourceDir);
    files.forEach(file => {
        const absPath = path.resolve(sourceDir, file);
        if (fs.statSync(absPath).isFile()) {
            const page = JSON.parse(fs.readFileSync(absPath));
            page.path ? pages[page.path] = createPage(page, sourceDir) : '';
        }
    });
    fs.writeFileSync(destDir, JSON.stringify(pages), 'utf8');
    return pages;
}

function createPage(page, sourceDir) {
    Object.keys(page.children).forEach(key => {
        if (page.children[key].ref) {  
            const absPath = path.resolve(sourceDir, page.children[key].ref)
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
        return files;
    } else {
        throw new Error(`The passed source path [${dir}] is not a directory.`);
    }
}

collector('./page-objects/pages', 'pages.json');

module.exports = { collector }