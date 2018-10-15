'use strict';

const Header = require('./header.page.js');

class EntertainmentPage extends Header {
    constructor() {
        super();
        this['body header h1'] = element(by.css('h1'));
        this['body results'] = element(by.css('#results-wrapper'));
        this['path'] = 'en/entertainment.html';
    }
}

const entertainment = new EntertainmentPage();
module.exports = entertainment;

const json = {
    "name": "entertainmentPage",
    "path": "en/entertainment.html",
    "selector": "html",
    "children": {
        "header": { "ref": "header.json" },
        "body header h1" : {"selector": "h1"},
        "body results" : {"selector": "#results-wrapper"}
    }
}
