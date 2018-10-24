'use strict';

const pages = require('../source/pages.json');

function getChain(po, name) {
    if (po.children) {
        const keys = Object.keys(po.children);
        let key = keys.find(key => key === name);
        if (key) {
            return key;
        } else {
            let result;
            key = keys.find(key => {
                result = getChain(po.children[key], name);
                return result;
            });
            return result ? `${key} > ${result}` : result;
        }
    } else {
        return undefined;
    }
}
console.log(getChain(pages['en/itineraries/find-reservation.html']['reservation page'], 'form info'))//['home page']['children']['header']);