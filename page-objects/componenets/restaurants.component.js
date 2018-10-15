'use strict';

class RestaurantsComponenet {
    constructor() {
        this.restaurants = element(by.css('a[class*=restaurants]'));
    }
}
module.exports = RestaurantsComponenet;