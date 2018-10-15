'use strict';

const mixin = require('../utils/mixin.js');
const hotelComponenet = require('./componenets/hotel.component.js');
const restaurantsComponenet = require('./componenets/restaurants.component.js');
const searchComponenet = require('./componenets/search.component.js');
const guestServiceComponenet = require('./componenets/guest_services.component.js');
const entertainmentComponenet = require('./componenets/entertainment.component.js');

class Header extends mixin(searchComponenet, guestServiceComponenet, hotelComponenet, restaurantsComponenet, entertainmentComponenet) {
    constructor() {
        super();
    }
}

module.exports = Header;

const json = {
    "name": "header",
    "selector": "html",
    "children": {
        "hotel": { "selector": "a[class*=hotel]" },
        "entertainment": {"selector": "a[class*=entertainment]"},
        "restaurants": {"selector": "a[class*=restaurants]"},
        "searchComponenet": {"ref": "./componenets/searchComponenet.js"},
        "guestServicesComponenet": {"ref": "./componenets/guestServicesComponenet.js"}
    }
}