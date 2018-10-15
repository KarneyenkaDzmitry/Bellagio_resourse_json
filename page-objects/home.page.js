'use strict';

const Header = require('./header.page.js');

class HomePage extends Header {
    constructor() {
        super();
        this['path'] = 'en.html';
    }
}

const homePage = new HomePage();

module.exports = homePage;

const json = {
    "name": "homePage",
    "path": "en.html",
    "selector": "html",
    "children": {
        "header": { "ref": "header.json" }
    }
}
