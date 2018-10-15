'use strict';

const Header = require('./header.page.js');

class RestaurantsPage extends Header {
    constructor() {
        super();
        this['body header h1'] = element(by.css('h1'));
        this['body results'] = element(by.css('#results-wrapper'));
        this['body filter buttons'] = element.all(by.css('button[id*=tagsFilter]'));
        this['body results array'] = element.all(by.css('div.result'));
        this['body results headers'] = element.all(by.css('div.result h3'));
        this['path'] = 'en/restaurants.html';
    }
}

const restaurants = new RestaurantsPage();
module.exports = restaurants;

const json = {
    "name": "restaurantsPage",
    "path": "en/restaurants.html",
    "selector": "html",
    "children": {
        "header": { "ref": "header.json" },
        "body header h1": {"selector": "h1" },
        "body results" : {"selector": "#results-wrapper" },
        "body results headers" : {"isCollection": true, "selector" : "div.result h3"},
        "body results array": {"isCollection": true,  "selector": "div.result" },
        "body filter buttons": {"isCollection": true,  "selector": "button[id*=tagsFilter]" }
    }
}