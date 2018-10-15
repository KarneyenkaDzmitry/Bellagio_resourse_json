'use strict';

class HotelComponent {
    constructor() {
        this.hotel = element(by.css('a[class*=hotel]'));
    }
}
module.exports = HotelComponent;