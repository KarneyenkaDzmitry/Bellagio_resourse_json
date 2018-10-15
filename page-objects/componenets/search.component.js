'use strict';

class SearchComponenet {
    constructor() {
        this['search component'] = element(by.css('ul>li.nav-search.search-expanded'));
        this['search component form'] = element(by.css('form#global-nav-search-form'));
        this['search component button'] = element(by.css('*[aria-label*="Search"]'));
        this['search component field'] = element(by.model('globalSearchKeyword'));
        this['search component cancel'] = element(by.css('span.clear-search.close-search-overlay'));
    }
}
module.exports = SearchComponenet;


const json = {
    "name": "searchComponenet",
    "selector": ".nav-search",
    "children": {
        "search component": { "selector": "ul>li.nav-search.search-expanded" },
        "search component form": {"selector": "form#global-nav-search-form"},
        "search component button": {"selector": "*[aria-label*=\"Search\"]"},
        "search component field": {"selector": "globalSearchKeyword"},
        "search component cancel": {"selector": "span.clear-search.close-search-overlay"}
    }
}