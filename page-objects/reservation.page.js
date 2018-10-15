'use strict';

const Header = require('./header.page.js');

class ReservationPage extends Header {
    constructor() {
        super();
        this['body header h1'] = element(by.css('h1.account-page-title'));
        this['room option'] = element(by.css('select option[value="room"]'));
        this['path'] = 'en/itineraries/find-reservation.html';
    }
}

const reservation = new ReservationPage();
module.exports = reservation;

const json = {
    "name": "reservationPage",
    "path": "en/itineraries/find-reservation.html",
    "selector": "html",
    "children": {
        "header": { "ref": "header.json" },
        "body header h1": {"selector": "h1.account-page-title" },
        "room option" : {"selector": "select option[value=\"room\"]" }
    }
}