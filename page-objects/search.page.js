'use strict';

const Header = require('./header.page.js');

class SearchPage extends Header {
    constructor() {
        super();
        this['body header h1'] = element(by.css('.site-search-header'));
        this['body results'] = element(by.css('#results-wrapper'));
        this['body results headers'] = element.all(by.css('#results-wrapper h2'));
        this['body no result message'] = element(by.css('div.no-result > p.ng-binding'));
        this['path'] = 'en/search.html';
    }
}
const search = new SearchPage();
module.exports = search;

const json = {
    "name": "searchPage",
    "path": "en/search.html",
    "selector": "html",
    "children": {
        "header": { "ref": "header.json" },
        "body header h1": { "isCollection": false, "selector": ".site-search-header" },
        "body results" : {"isCollection": false, "selector": "#results-wrapper" },
        "body results headers" : {"isCollection": true, "selector" : "#results-wrapper h2"},
        "body no result message": {"isCollection": false, "selector": "div.no-result > p.ng-binding" }
    }
}