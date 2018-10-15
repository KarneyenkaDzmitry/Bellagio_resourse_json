'use strict';

class GuestServicesComponent {
    constructor() {
        this['guest services menu'] = element.all(by.css('#unsignedIn-guest-menu > li'));
        this['guest services'] = element(by.css('.nav-services-btn'));
    }
}

module.exports = GuestServicesComponent;

const json = {
    "name": "guestServicesComponenet",
    "selector": ".nav-guest-services",
    "children": {
        "guest services menu": {"isCollection": true, "selector": "#unsignedIn-guest-menu > li" },
        "guest services": {"selector": ".nav-services-btn"} 
    }
}